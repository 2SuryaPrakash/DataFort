// generateKeys.js
import { generateKeyPairSync } from 'crypto';
import fs from 'fs';
import path from 'path';

function generateKeys(nodeId) {
    // Generate key pair using ed25519
    const { publicKey, privateKey } = generateKeyPairSync('ed25519', {
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });

    // Save the public and private keys in the keys directory
    const keysDir = './keys';
    if (!fs.existsSync(keysDir)) {
        fs.mkdirSync(keysDir);
    }
    
    fs.writeFileSync(path.join(keysDir, `node_${nodeId}_public.pem`), publicKey);
    fs.writeFileSync(path.join(keysDir, `node_${nodeId}_private.pem`), privateKey);

    console.log(`Keys generated for Node ${nodeId}`);
}

// Use a unique identifier for each node, e.g., '1', '2', etc.
generateKeys(process.argv[2] || '1');
