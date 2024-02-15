import mongoose from "mongoose";

interface ConnectionOptions {
    mongoUrl: string;
    dbName:string;
}

export class MongoDataBase {
    static async connect(options:ConnectionOptions) {
        const {mongoUrl, dbName} = options;

        try {
            await mongoose.connect(mongoUrl, {
                dbName: dbName
            });
            
            return true
        } catch (error) {
            console.log('Mongo connection error');
            throw error;
            
        }
    }

    static async disconnect() {
        await mongoose.disconnect();
    }
}

