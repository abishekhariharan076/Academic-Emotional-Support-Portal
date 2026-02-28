const mongoose = require('mongoose');
require('dotenv').config({ path: 'd:/AESP/backend/.env' });

async function test() {
    try {
        console.log('Connecting to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('SUCCESS ✅');
        process.exit(0);
    } catch (err) {
        console.error('FAILURE ❌');
        console.error(err);
        process.exit(1);
    }
}

test();
