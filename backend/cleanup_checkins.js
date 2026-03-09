const mongoose = require('mongoose');
require('dotenv').config({ path: 'd:/AESP/backend/.env' });

const checkInSchema = new mongoose.Schema({ userId: mongoose.Schema.Types.ObjectId });
const CheckIn = mongoose.model('CheckIn', checkInSchema);

async function cleanup() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected ✅');

        const result = await CheckIn.deleteMany({});
        console.log(`Deleted ${result.deletedCount} check-ins. Database is now clean! ✨`);

        process.exit(0);
    } catch (err) {
        console.error('Cleanup failed ❌', err.message);
        process.exit(1);
    }
}

cleanup();
