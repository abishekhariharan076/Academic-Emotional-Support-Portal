const { MongoClient } = require('mongodb');

async function test() {
    const uri = "mongodb://abishekhariharan76_db_user:2005hariharan76@ac-3lodcvd-shard-00-00.tamneyl.mongodb.net:27017,ac-3lodcvd-shard-00-01.tamneyl.mongodb.net:27017,ac-3lodcvd-shard-00-02.tamneyl.mongodb.net:27017/?ssl=true&replicaSet=atlas-tamneyl-shard-0&authSource=admin";
    const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 15000,
        connectTimeoutMS: 15000,
        tls: true,
        tlsAllowInvalidCertificates: true
    });

    try {
        console.log('Testing with native driver...');
        await client.connect();
        console.log('NATIVE SUCCESS ✅');
        await client.db('admin').command({ ping: 1 });
        console.log('PING SUCCESS ✅');
        process.exit(0);
    } catch (err) {
        console.error('NATIVE FAILURE ❌');
        console.error(err);
        process.exit(1);
    } finally {
        await client.close();
    }
}

test();
