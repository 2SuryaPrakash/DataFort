import express from 'express';
import fs from 'fs';
import path from 'path';
import Exonum from 'exonum-client';
import dotenv from 'dotenv';
import DataContract from './smart_contracts/dataContract.js';
import { getUserKeys } from './utils/userManager.js';
import { encryptData, decryptData } from './utils/encryption.js';

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// Node configuration
const nodeConfig = {
    host: process.env.NODE_IP,
    port: process.env.P2P_PORT,
    publicKey: fs.readFileSync(path.join('keys', 'node_public.pem'), 'utf8'),
    privateKey: fs.readFileSync(path.join('keys', 'node_private.pem'), 'utf8'),
    peers: [
        `${process.env.BOOTSTRAP_NODE_IP}:${process.env.P2P_PORT}`
    ]
};

// Initialize blockchain instance
const blockchainInstance = new Exonum.Blockchain({
    ...nodeConfig,
    consensus: 'PoA',
    services: [
        {
            name: 'data_service',
            contract: DataContract
        }
    ]
});

// Initialize data contract
const dataContract = new DataContract(blockchainInstance);

// Middleware to handle user authentication
app.use('/', (req, res, next) => {
    if (!req.body.userId) {
        return res.status(400).json({ error: "Invalid access - userId required" });
    }
    if (!req.body.userKeys) {
        req.body.userKeys = getUserKeys(req.body.userId);
    }
    next();
});

// Endpoint to add data
app.post('/addData', async (req, res) => {
    try {
        const { userId, userKeys, data } = req.body;
        
        // Encrypt data with user's public key
        const encryptedData = encryptData(data, userKeys.publicKey);

        // Add encrypted data to the blockchain
        await dataContract.addData(encryptedData, nodeConfig.privateKey);
        
        res.json({ 
            success: true,
            message: 'Data added to blockchain',
            encryptedData 
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding data to blockchain',
            error: error.message
        });
    }
});

// Endpoint to get data by public key
app.get('/getDataByPublicKey', async (req, res) => {
    const { publicKey, privateKey } = req.body.userKeys;

    if (!publicKey) {
        return res.status(400).json({ 
            success: false, 
            message: "Public key is required" 
        });
    }

    try {
        let matchedData = [];
        const blockCount = await blockchainInstance.getBlockCount();

        for (let blockNumber = 0; blockNumber < blockCount; blockNumber++) {
            const block = await blockchainInstance.getBlock(blockNumber);

            for (const txHash of block.txHashes) {
                const transaction = await blockchainInstance.getTransaction(txHash);

                if (transaction.publicKey === publicKey) {
                    let data = transaction.data;
                    if (transaction.encrypted && privateKey) {
                        data = decryptData(transaction.data, privateKey);
                    }

                    matchedData.push({
                        txHash,
                        blockNumber,
                        timestamp: block.timestamp,
                        data
                    });
                }
            }
        }

        res.status(200).json({ success: true, matchedData });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error fetching data by public key", 
            error: error.message 
        });
    }
});

// Start server
const PORT = process.env.NODE_PORT || 3010;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
