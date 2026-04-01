const { MongoClient } = require('mongodb');

async function test() {
    // Single shard connection to test if it's a replica set discovery issue
    const uri = "mongodb://abishekhariharan76_db_user:2005hariharan76@ac-3lodcvd-shard-00-00.tamneyl.mongodb.net:27017/aesp?ssl=true&authSource=admin";
    const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
    });

    try {
        console.log('Testing MINIMAL connection to Shard 00...');
        await client.connect();
        console.log('MINIMAL SUCCESS ✅');
        const ping = await client.db('admin').command({ ping: 1 });
        console.log('PING:', ping);
        process.exit(0);
    } catch (err) {
        console.error('MINIMAL FAILURE ❌');
        console.error(err.message);
        process.exit(1);
    } finally {
        await client.close();
    }
}

test();
