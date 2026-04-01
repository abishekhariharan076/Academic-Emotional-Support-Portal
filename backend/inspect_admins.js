const mongoose = require('mongoose');
require('dotenv').config();

async function inspect() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const User = mongoose.connection.collection('users');
        
        const admins = await User.find({ role: 'admin' }).toArray();
        console.log('Admins in DB:', JSON.stringify(admins, null, 2));
        
        if (admins.length > 0) {
            for (const admin of admins) {
                if (!admin.domain) {
                    const domain = admin.email.split('@')[1];
                    console.log(`Fixing admin ${admin.email} with domain ${domain}`);
                    await User.updateOne({ _id: admin._id }, { $set: { domain: domain } });
                }
            }
            console.log('Admin domains fixed! ✅');
        } else {
            console.log('No admins found! ❌');
        }
        
        process.exit(0);
    } catch (err) {
        console.error('Inspection failed:', err.message);
        process.exit(1);
    }
}

inspect();
