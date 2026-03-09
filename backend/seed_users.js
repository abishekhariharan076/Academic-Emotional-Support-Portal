const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: 'd:/AESP/backend/.env' });

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'counselor', 'admin'], default: 'student' },
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected ✅');

        const password = await bcrypt.hash('password123', 10);

        const testUsers = [
            { name: 'Admin User', email: 'admin@test.com', password, role: 'admin' },
            { name: 'Counselor User', email: 'counselor@test.com', password, role: 'counselor' },
            { name: 'Student User', email: 'student@test.com', password, role: 'student' },
        ];

        for (const u of testUsers) {
            await User.findOneAndUpdate({ email: u.email }, u, { upsert: true, new: true });
            console.log(`User created/updated: ${u.email} (${u.role})`);
        }

        console.log('Seeding complete! Password for all is: password123');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed ❌', err.message);
        process.exit(1);
    }
}

seed();
