const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");
const CheckIn = require("./models/CheckIn");
const SupportRequest = require("./models/SupportRequest");

dotenv.config();

const seedInteractions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB ✅");

    const passwordHash = await bcrypt.hash("password123", 10);

    // 1. Create/Update Counselor
    const counselor = await User.findOneAndUpdate(
      { email: "abiat22005@gmail.com" },
      {
        name: "Abiat Counselor",
        password: passwordHash,
        role: "counselor",
        domain: "gmail.com"
      },
      { upsert: true, new: true }
    );
    console.log(`Counselor: ${counselor.email}`);

    // 2. Create/Update Student
    const student = await User.findOneAndUpdate(
      { email: "abishekhariharan76@gmail.com" },
      {
        name: "Abhishek Student",
        password: passwordHash,
        role: "student",
        domain: "gmail.com",
        assignedCounselor: counselor._id
      },
      { upsert: true, new: true }
    );
    console.log(`Student: ${student.email}`);

    // 3. Sample Check-ins
    const checkins = [
      {
        userId: student._id,
        moodLevel: 4,
        message: "Feeling productive today!",
        status: "reviewed",
        counselorNote: "Great work!",
        reviewedBy: counselor._id,
        domain: "gmail.com"
      },
      {
        userId: student._id,
        moodLevel: 2,
        message: "A bit tired.",
        status: "open",
        domain: "gmail.com"
      },
      {
        userId: student._id,
        moodLevel: 3,
        message: "Balanced day.",
        status: "reviewed",
        counselorNote: "Keep it up.",
        reviewedBy: counselor._id,
        domain: "gmail.com"
      },
      {
        userId: student._id,
        moodLevel: 1,
        message: "Overwhelmed.",
        status: "open",
        domain: "gmail.com"
      },
      {
        userId: student._id,
        moodLevel: 5,
        message: "Excellent day!",
        status: "reviewed",
        counselorNote: "Awesome!",
        reviewedBy: counselor._id,
        domain: "gmail.com"
      }
    ];

    await CheckIn.deleteMany({ userId: student._id });
    await CheckIn.insertMany(checkins);
    console.log(`Inserted ${checkins.length} check-ins.`);

    // 4. Sample Support Requests
    const supportRequests = [
      {
        studentId: student._id,
        subject: "Time Management",
        message: "Need some tips.",
        status: "responded",
        counselorId: counselor._id,
        counselorReply: "Let's meet tomorrow.",
        respondedAt: new Date(Date.now() - 86400000),
        domain: "gmail.com"
      },
      {
        studentId: student._id,
        subject: "Exam Stress",
        message: "Feeling anxious.",
        status: "pending",
        counselorId: counselor._id,
        domain: "gmail.com"
      },
      {
        studentId: student._id,
        subject: "Gratitude",
        message: "Thanks for the help!",
        status: "responded",
        counselorId: counselor._id,
        counselorReply: "You're welcome!",
        respondedAt: new Date(),
        domain: "gmail.com"
      }
    ];

    await SupportRequest.deleteMany({ studentId: student._id });
    await SupportRequest.insertMany(supportRequests);
    console.log(`Inserted ${supportRequests.length} support requests.`);

    console.log("Seeding complete! 🚀");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed ❌", error);
    process.exit(1);
  }
};

seedInteractions();
