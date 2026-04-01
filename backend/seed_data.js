const mongoose = require('mongoose');
require('dotenv').config({ path: 'd:/AESP/backend/.env' });

const CheckIn = require('./models/CheckIn');
const SupportRequest = require('./models/SupportRequest');

const studentId = '69ae641b14d3ed9470304061'; // ID for student@test.com

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected ✅');

        // Sample Check-ins
        const checkins = [
            { userId: studentId, moodLevel: 4, message: "Feeling quite productive today, but a bit anxious about the upcoming finals.", status: "open" },
            { userId: studentId, moodLevel: 2, message: "Exhausted and struggling to focus. Need some tips for sleep management.", status: "open" },
            { userId: studentId, moodLevel: 5, message: "Had a great session with my study group! Feeling much more confident.", status: "reviewed", counselorNote: "Great to hear! Peer support is vital." },
            { userId: studentId, moodLevel: 1, message: "Feeling very overwhelmed and lonely. Not sure where to turn.", status: "open" },
            { userId: studentId, moodLevel: 3, message: "Balanced day. Managed to get some exercise in.", status: "open" }
        ];

        // Sample Support Requests
        const supportRequests = [
            {
                studentId,
                subject: "Exam Stress Management",
                message: "Hi, I'm feeling a lot of pressure from my upcoming midterms. Can I schedule a brief call to talk about coping strategies?",
                status: "pending"
            },
            {
                studentId,
                subject: "Academic Accommodations",
                message: "I was wondering if there are any resources for students struggling with ADHD during exam season.",
                status: "pending"
            },
            {
                studentId,
                subject: "General Well-being Query",
                message: "Just wanted to say thanks for the resources page! It's been really helpful.",
                status: "responded",
                counselorReply: "You are very welcome! We are glad you find it useful. Feel free to reach out anytime.",
                respondedAt: new Date()
            }
        ];

        console.log('Clearing old data (Optional)...');
        // await CheckIn.deleteMany({ userId: studentId });
        // await SupportRequest.deleteMany({ studentId: studentId });

        console.log('Inserting sample check-ins...');
        await CheckIn.insertMany(checkins);

        console.log('Inserting sample support requests...');
        await SupportRequest.insertMany(supportRequests);

        console.log('SEEDING SUCCESSFUL! 🚀');
        process.exit(0);
    } catch (err) {
        console.error('SEEDING FAILED ❌', err.message);
        process.exit(1);
    }
}

seed();
