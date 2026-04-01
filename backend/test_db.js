const mongoose = require('mongoose');
require('dotenv').config({ path: 'd:/AESP/backend/.env' });

async function test() {
    try {
        console.log('Connecting to:', process.env.MONGO_URI.replace(/:[^:@/]+@/, ':****@'));

        mongoose.connection.on('connecting', () => console.log('Mongoose: connecting...'));
        mongoose.connection.on('connected', () => console.log('Mongoose: connected ✓'));
        mongoose.connection.on('error', (err) => console.log('Mongoose: connection error:', err.message));
        mongoose.connection.on('disconnected', () => console.log('Mongoose: disconnected'));

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
            family: 4 // Force IPv4
        });
        console.log('SUCCESS ✅');
        process.exit(0);
    } catch (err) {
        console.error('FAILURE ❌');
        console.error('Error Name:', err.name);
        console.error('Error Message:', err.message);
        process.exit(1);
    }
}

test();
