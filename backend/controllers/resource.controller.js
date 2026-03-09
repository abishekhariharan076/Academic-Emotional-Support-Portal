const mongoose = require("mongoose");

exports.getResources = async (req, res) => {
    try {
        // Mock resource data
        const resources = [
            {
                _id: "res1",
                title: "Understanding Anxiety",
                description: "A guide to recognizing and managing common anxiety symptoms in students.",
                category: "Anxiety",
                type: "Article",
                link: "https://example.com/anxiety-guide",
            },
            {
                _id: "res2",
                title: "Sleep Hygiene 101",
                description: "Practical tips for improving your sleep quality and academic performance.",
                category: "Sleep",
                type: "PDF",
                link: "https://example.com/sleep-hygiene",
            },
            {
                _id: "res3",
                title: "Focus & Time Management",
                description: "Techniques like Pomodoro to help you stay productive without burnouts.",
                category: "Focus",
                type: "Video",
                link: "https://example.com/focus-techniques",
            },
            {
                _id: "res4",
                title: "Mindfulness Basics",
                description: "Short 5-minute breathing exercises for stressful exam periods.",
                category: "Stress",
                type: "Audio",
                link: "https://example.com/mindfulness",
            },
            {
                _id: "res5",
                title: "Building Resilience",
                description: "How to bounce back from academic setbacks and maintain a positive outlook.",
                category: "General",
                type: "Booklet",
                link: "https://example.com/resilience",
            },
        ];

        res.json(resources);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
