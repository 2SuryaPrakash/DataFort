import crypto from 'crypto';
import Exonum from 'exonum-client';

const DataSchema = new Exonum.newType({
    fields: [
        { name: 'hash', type: Exonum.Hash },
        { name: 'timestamp', type: Exonum.Uint64 },
        { name: 'encrypted', type: Exonum.Bool },
        { name: 'data', type: Exonum.String }
    ]
});

class DataContract {
    constructor(blockchainInstance) {
        this.blockchainInstance = blockchainInstance;
    }

    async addData(data, privateKey) {
        const dataHash = crypto.createHash('sha256').update(data).digest('hex');
        const timestamp = Date.now();

        const entry = {
            hash: dataHash,
            timestamp: timestamp,
            encrypted: true,
            data: data
        };

        const serializedData = DataSchema.serialize(entry);
        const signature = Exonum.sign(serializedData, privateKey);

        const transaction = {
            data: serializedData,
            signature: signature,
            publicKey: this.blockchainInstance.publicKey
        };

        try {
            await this.blockchainInstance.addTransaction(transaction);
            console.log(`Data added to blockchain: ${dataHash} at ${timestamp}`);
            return true;
        } catch (error) {
            console.error('Error adding data to blockchain:', error);
            throw error;
        }
    }

    async retrieveData(hash) {
        try {
            const entry = await this.blockchainInstance.getTransaction(hash);
            return entry || null;
        } catch (error) {
            console.error('Error retrieving data:', error);
            throw error;
        }
    }
}

export default DataContract;