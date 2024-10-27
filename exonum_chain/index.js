// index.js - Node with Smart Contract Interaction
// const fs = require('fs');
// const path = require('path');
// const Exonum = require('exonum-client');
// const express = require('express');
// const DataContract = require('./smart_contracts/dataContract');

import fs from 'fs';
import path from 'path';
import Exonum from 'exonum-client';
import express from 'express';
import DataContract from './smart_contracts/dataContract.js';

const app = express();
app.use(express.json());

// Load node configuration
const nodeId = process.argv[2];
const configPath = 'config/node_.json';
const config = JSON.parse(fs.readFileSync(configPath));

// Initialize blockchain
const blockchainInstance = new Exonum.Blockchain({
    publicKey: fs.readFileSync(config.public_key, 'utf8'),
    privateKey: fs.readFileSync(config.private_key, 'utf8'),
    swarmKey: fs.readFileSync(path.join(__dirname, 'config', 'swarm.key')),
    knownPeers: config.known_peers,
    consensus: 'PoA'
});

// Connect to peers
blockchainInstance.connectPeers(config.known_peers);
console.log(`Node ${nodeId} started and connected to the network.`);

// Smart contract interaction setup
const dataContract = new DataContract(blockchainInstance);

// Helper function to handle encryption/decryption (using Exonum’s keypair)
function encryptData(data, publicKey) {
    // Encrypt data with the user’s public key here
    return Exonum.crypto.publicEncrypt(data, publicKey);  // Placeholder
}

function decryptData(encryptedData, privateKey) {
    // Decrypt data with the user’s private key here
    return Exonum.crypto.privateDecrypt(encryptedData, privateKey);  // Placeholder
}

// POST endpoint to add data to the blockchain
app.post('/addData', async (req, res) => {
    const { data, publicKey } = req.body;

    // Encrypt data with the user’s public key
    const encryptedData = encryptData(data, publicKey);

    try {
        // Store data in blockchain
        const txHash = await dataContract.addData(encryptedData);
        res.status(200).json({ success: true, txHash });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET endpoint to retrieve data by transaction hash
app.get('/getData/:txHash', async (req, res) => {
    const { txHash } = req.params;
    const { privateKey } = req.query;  // Retrieve user’s private key

    try {
        // Retrieve data from blockchain
        const encryptedData = await dataContract.getData(txHash);

        // Decrypt data with user’s private key
        const data = decryptData(encryptedData, privateKey);
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Start the server on port 4000 + nodeId
const port = 4010 
app.listen(port, () => {
    console.log(`Node  API server running at http://localhost:${port}`);
});
