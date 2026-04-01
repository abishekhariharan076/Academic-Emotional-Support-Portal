const mongoose = require('mongoose');
require('dotenv').config();

async function fix() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        
        const collections = ['users', 'checkins', 'supportrequests', 'messages'];
        
        for (const colName of collections) {
            console.log(`Checking collection: ${colName}...`);
            const collection = db.collection(colName);
            const docs = await collection.find({ domain: { $exists: false } }).toArray();
            console.log(`- Found ${docs.length} documents without domain`);
            
            for (const doc of docs) {
                let domain = 'unknown.edu';
                
                if (doc.email) {
                    domain = doc.email.split('@')[1];
                } else if (doc.userId) {
                    const user = await db.collection('users').findOne({ _id: doc.userId });
                    if (user && user.domain) domain = user.domain;
                    else if (user && user.email) domain = user.email.split('@')[1];
                } else if (doc.studentId) {
                    const user = await db.collection('users').findOne({ _id: doc.studentId });
                    if (user && user.domain) domain = user.domain;
                    else if (user && user.email) domain = user.email.split('@')[1];
                } else if (doc.supportRequestId) {
                    const sr = await db.collection('supportrequests').findOne({ _id: doc.supportRequestId });
                    if (sr && sr.domain) domain = sr.domain;
                }
                
                await collection.updateOne({ _id: doc._id }, { $set: { domain } });
            }
            if (docs.length > 0) console.log(`- Fixed ${docs.length} documents in ${colName}`);
        }
        
        console.log('\nAll domains synchronized! ✅');
        process.exit(0);
    } catch (err) {
        console.error('Fix failed:', err.message);
        process.exit(1);
    }
}

fix();
