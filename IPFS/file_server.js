// server.js - API Node Server
import express from 'express';
import  { create }  from 'ipfs-http-client';  // Updated for ES module
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import multer from 'multer';
import { exec } from 'child_process';
import crypto from 'crypto';
import { spawn } from 'child_process';
import pkg from 'dotenv';
import mime from 'mime';
// import FileType from 'file-type';

const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Set up file upload
const upload = multer({ dest: 'uploads/' });

class IPFSNode {
    constructor() {
        this.ipfs = null;
        this.swarmKeyPath = path.join(process.env.HOME || process.env.USERPROFILE, '.ipfs/swarm.key');
        this.configPath = path.join(process.env.HOME || process.env.USERPROFILE, '.ipfs/config');
        this.daemonProcess = null;
    }
    
      async  connectToPeers() {
        setInterval(async () => {
          try {
            const peers = await this.ipfs.swarm.peers()
            console.log('Connected peers:', peers.length)
      
            // Get a list of all known peer addresses
            const knownPeers = await this.swarm.addrs()
      
            // Try to connect to each known peer
            for (const peer of knownPeers) {
              try {
                await this.swarm.connect(peer.id)
                console.log('Connected to peer:', peer.id)
              } catch (error) {
                console.error('Failed to connect to peer:', peer.id, error.message)
              }
            }
          } catch (error) {
            console.error('Error connecting to peers:', error)
          }
        }, 30000) // Run every 30 seconds
      }
    async initialize() {
        try {
            // Generate swarm key if it doesn't exist
            await this.generateSwarmKey();

            // Configure IPFS
            await this.configureIPFS();

            // Connect to IPFS
            this.ipfs = await create({
                host: 'localhost',
                port: 5001,
                protocol: 'http'
            });

            console.log('IPFS node initialized');
        } catch (error) {
            console.error('Error initializing IPFS node:', error);
            throw error;
        }
    }

    async generateSwarmKey() {
        if (!fs.existsSync(this.swarmKeyPath)) {
            const key = `/key/swarm/psk/1.0.0/\n/base16/\n${crypto.randomBytes(32).toString('hex')}`;
            fs.mkdirSync(path.dirname(this.swarmKeyPath), { recursive: true });
            fs.writeFileSync(this.swarmKeyPath, key);
            console.log('Generated new swarm key');
        }
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
    async configureIPFS() {
        try {
            // Update Addresses for API, Gateway, and Swarm
            await this.runCommand(`ipfs config Addresses.API "/ip4/0.0.0.0/tcp/5001"`);
            await this.runCommand(`ipfs config Addresses.Gateway "/ip4/0.0.0.0/tcp/8080"`);
            await this.runCommand(`ipfs config Addresses.Swarm --json "[\\"/ip4/0.0.0.0/tcp/4001\\", \\"/ip4/0.0.0.0/tcp/4002/ws\\"]"`);

            // Update API HTTP Headers for CORS
            await this.runCommand(`ipfs config --json API.HTTPHeaders "{\\"Access-Control-Allow-Origin\\": [\\"*\\"], \\"Access-Control-Allow-Methods\\": [\\"PUT\\", \\"POST\\", \\"GET\\"]}"`);


            // Update Bootstrap nodes (empty array in this case)
            await this.runCommand(`ipfs config Bootstrap --json "[]"`);

            // Update Swarm connection manager settings
            await this.runCommand(`ipfs config Swarm.ConnMgr.HighWater --json 100`);
            await this.runCommand(`ipfs config Swarm.ConnMgr.LowWater --json 50`);
            await this.runCommand(`ipfs config Swarm.ConnMgr.GracePeriod "30s"`);

            console.log('IPFS configuration updated');
        } catch (error) {
            console.error('Error updating IPFS configuration:', error);
        }
    }

    async startDaemon() {
        return new Promise((resolve, reject) => {
            // exec('ipfs daemon --enable-pubsub-experiment', (error, stdout, stderr) => {
            //     if (error) {
            //         console.error('Error starting IPFS daemon:', error);
            //         reject(error);
            //         return;
            //     }
            //     console.log('IPFS daemon started');
            //     resolve();
            // });
            const daemon = spawn('ipfs', ['daemon', '--enable-pubsub-experiment'], {
                detached: true,
                stdio: 'ignore' // Run in the background
            });

            daemon.on('error', (error) => {
                console.error('Error starting IPFS daemon:', error);
                reject(error);
            });

            daemon.unref(); // Detach from main process
            this.daemonProcess = daemon; // Save reference for later termination
            console.log('IPFS daemon started');
            resolve();
        });
    }
    stopDaemon() {
        if (this.daemonProcess) {
            console.log('Stopping IPFS daemon...');
            process.kill(-this.daemonProcess.pid); // Stop the detached process
            this.daemonProcess = null;
        }
    }

    async getNodeId() {
        try {
            const info = await this.ipfs.id();
            return info;
        } catch (error) {
            console.error('Error getting node ID:', error);
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
            console.error(`Error unpinning CID ${cid}:`, error);
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
}




// Initialize IPFS node
const node = new IPFSNode();

// API Routes
app.post('/api/gc', async (req, res) => {
    try {
        await node.runGarbageCollection();
        res.json({ message: 'Garbage collection completed successfully' });
    } catch (error) {
        console.error('Error running garbage collection:', error);
        res.status(500).json({ error: 'Error running garbage collection' });
    }
});
app.delete('/api/unpin/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        await node.unpinCID(cid);
        res.json({ message: `Successfully unpinned ${cid}` });
    } catch (error) {
        console.error('Error unpinning CID:', error);
        res.status(500).json({ error: 'Error unpinning CID' });
    }
});
app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        const fileData = fs.readFileSync(req.file.path);
        const result = await node.ipfs.add(fileData);

        // Clean up uploaded file
        fs.unlinkSync(req.file.path);

        res.json({
            hash: result.path,
            size: result.size
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Error uploading file' });
    }
});
app.get('/api/pins', async (req, res) => {
    try {
        const pins = await node.getPinnedCIDs();
        res.json(pins);
    } catch (error) {
        console.error('Error getting pinned CIDs:', error);
        res.status(500).json({ error: 'Error getting pinned CIDs' });
    }
});
// app.get('/api/file/:hash', async (req, res) => {
//     try {
//         const hash = req.params.hash;
//         const chunks = [];

//         for await (const chunk of node.ipfs.cat(hash)) {
//             chunks.push(chunk);
//         }

//         const data = Buffer.concat(chunks);
//         res.send(data);
//     } catch (error) {
//         console.error('Error retrieving file:', error);
//         res.status(500).json({ error: 'Error retrieving file' });
//     }
// });
import { fileTypeFromBuffer } from 'file-type';


app.get('/api/file/:hash', async (req, res) => {
    try {
        const hash = req.params.hash;
        const chunks = [];

        // Fetch the file data from IPFS
        for await (const chunk of node.ipfs.cat(hash)) {
            chunks.push(chunk);
        }

        const data = Buffer.concat(chunks);

        // Detect the file type using file-type package
        // const type = await FileType.fromBuffer(data);
        const fileType = await fileTypeFromBuffer(data);

        if (fileType) {
            // Set the content type based on the detected MIME type
            res.setHeader('Content-Type', fileType.mime);
        } else {
            // Default to application/octet-stream if type cannot be determined
            res.setHeader('Content-Type', 'application/octet-stream');
        }

        // Send the file content as the response
        res.send(data);
    } catch (error) {
        console.error('Error retrieving file:', error);
        res.status(500).json({ error: 'Error retrieving file' });
    }
});

app.get('/api/peers', async (req, res) => {
    try {
        const peers = await node.ipfs.swarm.peers();
        res.json(peers);
    } catch (error) {
        console.error('Error getting peers:', error);
        res.status(500).json({ error: 'Error getting peers' });
    }
});
export {app};
// Start server
async function startServer() {
    try {
        await node.initialize();
        await node.startDaemon();
        // await node.connectToPeers();
        // await Promise.all([node.initialize(), node.startDaemon()]);
        

        node.startAutomaticGC(24);
        app.listen(port,'0.0.0.0', () => {
            console.log(`API Node server running on port ${port}`);
        });
        process.on('SIGINT', () => {
            console.log('\nGracefully shutting down...');
            node.stopDaemon(); // Stop the IPFS daemon
            process.exit(0);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}

startServer();