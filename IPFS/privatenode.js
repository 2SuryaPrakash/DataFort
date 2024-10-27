// regular-node.js - Regular Node
import { create } from 'ipfs-http-client';  // Updated for ES module
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { spawn } from 'child_process';

class RegularNode {
    constructor(apiNodeAddress) {
        this.ipfs = null;
        this.apiNodeAddress = apiNodeAddress;
        this.configPath = path.join(process.env.HOME || process.env.USERPROFILE, '.ipfs/config');
        this.gcInterval = null;
    }
    runCommand = (command) => {
        return new Promise((resolve, reject) => {
            exec(command, { env: { ...process.env, IPFS_PATH: this.ipfsPath } }, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(stdout);
                }
            });
        });
    };
    async initialize() {
        try {
            // Configure IPFS
            await this.configureIPFS();

            // Connect to IPFS
            this.ipfs = await create({
                host: 'localhost',
                port: 5001,
                protocol: 'http'
            });

            console.log('Regular node initialized');
        } catch (error) {
            console.error('Error initializing regular node:', error);
            throw error;
        }
    }


    async configureIPFS() {
        try {
            // Update Swarm addresses
            
            await this.runCommand(`ipfs config Addresses.Swarm --json "[\\"/ip4/0.0.0.0/tcp/4001\\", \\"/ip4/0.0.0.0/tcp/4002/ws\\"]"`);

            await this.runCommand(`ipfs config Bootstrap --json "[\\"/ip4/${this.apiNodeAddress}/tcp/4002/ws/p2p/12D3KooWAh919TL4Ym7eTyJaWpy9QWa8iX5zreQfjy6jyU3Pyo8y\\"]"`);
            // await this.runCommand(`ipfs config Bootstrap --json "[\\"/ip4/172.22.109.200/tcp/4001/p2p/12D3KooWMBGJ6GXUdLabURXwHr4CdNnbPeCQep9CiX23wns8fwGe\\"]"`);

            await this.runCommand(`ipfs config Swarm.ConnMgr.HighWater --json "100"`);
            await this.runCommand(`ipfs config Swarm.ConnMgr.LowWater --json "50"`);
            await this.runCommand(`ipfs config Swarm.ConnMgr.GracePeriod "30s"`);


            console.log('IPFS configuration updated');
        } catch (error) {
            console.error('Error updating IPFS configuration:', error);
        }

    }

    async startDaemon() {
        return new Promise((resolve, reject) => {
            exec('ipfs daemon', (error, stdout, stderr) => {
                if (error) {
                    console.error('Error starting IPFS daemon:', error);
                    reject(error);
                    return;
                }
                console.log('IPFS daemon started');
                resolve();
            });
        });
    }

    async connectToAPI() {
        try {
            await this.ipfs.swarm.connect(`/ip4/${this.apiNodeAddress}/tcp/4002/ws/p2p/12D3KooWAh919TL4Ym7eTyJaWpy9QWa8iX5zreQfjy6jyU3Pyo8y`);
            console.log('Connected to API node');
        } catch (error) {
            console.error('Error connecting to API node:', error);
            throw error;
        }
    }

    async getFile(hash) {
        try {
            const chunks = [];
            for await (const chunk of this.ipfs.cat(hash)) {
                chunks.push(chunk);
            }
            return Buffer.concat(chunks);
        } catch (error) {
            console.error('Error retrieving file:', error);
            throw error;
        }
    }

    async listPeers() {
        try {
            const peers = await this.ipfs.swarm.peers();
            console.log('Connected peers:', peers);
            return peers;
        } catch (error) {
            console.error('Error listing peers:', error);
            throw error;
        }
    }
    async runGarbageCollection() {
        try {
            await this.ipfs.repo.gc();
            console.log('Garbage collection completed');

            // Get repo stats after GC
            const stats = await this.ipfs.repo.stat();
            console.log('Repository stats after GC:', {
                repoSize: stats.repoSize,
                storageMax: stats.storageMax,
                numObjects: stats.numObjects
            });
        } catch (error) {
            console.error('Error during garbage collection:', error);
            throw error;
        }
    }

    async unpinCID(cid) {
        try {
            await this.ipfs.pin.rm(cid);
            console.log(`Unpinned CID: ${cid}`);
            return true;
        } catch (error) {
            console.error(`Error unpinning CID ${cid}:, error`);
            throw error;
        }
    }

    async getPinnedCIDs() {
        try {
            const pins = await this.ipfs.pin.ls();
            return Array.from(pins);
        } catch (error) {
            console.error('Error getting pinned CIDs:', error);
            throw error;
        }
    }

    startAutomaticGC(intervalHours = 24) {
        // Run GC every X hours
        this.gcInterval = setInterval(async () => {
            console.log('Starting scheduled garbage collection');
            await this.runGarbageCollection();
        }, intervalHours * 60 * 60 * 1000);
    }

    stopAutomaticGC() {
        if (this.gcInterval) {
            clearInterval(this.gcInterval);
            this.gcInterval = null;
        }
    }
    async connectToAllPeers() {
        try {
            const peers = await this.listPeers();
            for (const peer of peers) {
                const peerAddress = `/ip4/${peer.addr.split('/')[2]}/tcp/${peer.addr.split('/')[4]}/p2p/${peer.peerId}`;
                await this.ipfs.swarm.connect(peerAddress);
                console.log(`Connected to peer: ${peer.peerId}`);
            }
        } catch (error) {
            console.error('Error connecting to peers:', error);
        }
    }
    // Method to sync pins with API node
    async syncPinsWithAPI() {
        try {
            // Get pins from API node
            const response = await fetch(`http://${this.apiNodeAddress}:4000/api/pins`);
            const apiPins = await response.json();

            // Get local pins
            const localPins = await this.getPinnedCIDs();

            // Find pins to remove (pins that exist locally but not in API node)
            const localPinCids = new Set(localPins.map(p => p.cid.toString()));
            const apiPinCids = new Set(apiPins.map(p => p.cid.toString()));

            for (const localCid of localPinCids) {
                if (!apiPinCids.has(localCid)) {
                    console.log(`Unpinning ${localCid} to sync with API node`);
                    await this.unpinCID(localCid);
                }
            }

            console.log('Pin synchronization completed');
        } catch (error) {
            console.error('Error syncing pins with API node:', error);
            throw error;
        }
    }
}

// Usage
async function startRegularNode() {
    try {
        const node = new RegularNode("10.200.255.119"); // Replace with actual API node IP
        
        // Initialize the IPFS client and start the daemon before connecting
        await node.initialize();
        await node.startDaemon();
        await node.connectToAPI();

        // Example: List peers every 30 seconds
        setInterval(async () => {
            try {
                await node.syncPinsWithAPI();
                await node.runGarbageCollection();
            } catch (error) {
                console.error('Error during sync and GC:', error);
            }
        }, 60 * 60 * 1000);

        setInterval(async () => {
            console.log('Connecting to all peers...');
            await node.connectToAllPeers();
        }, 30000);

    } catch (error) {
        console.error('Error starting regular node:', error);
        process.exit(1);
    }
}

startRegularNode();