const mongoose = require("mongoose");

exports.getResources = async (req, res) => {
    try {
        // Mock resource data
        const resources = [
            {
                _id: "res1",
                title: "Understanding Anxiety",
                description: "Recognize symptoms, identify body signals, and learn effective management strategies for academic anxiety.",
                category: "Anxiety",
                type: "Article",
                link: "#",
                fullContent: {
                    symptoms: "Students with anxiety often show physical signs like rapid heartbeat, sweating, stomachaches, headaches, or muscle tension. Emotionally, they may feel excessive worry, irritability, or negative thoughts, while behaviorally, they avoid tasks, struggle with focus, or exhibit restlessness—sometimes mistaken for ADHD. Patterns like frequent 'illness' on test days or declining grades signal a need for support.",
                    recognition: "Watch for self-soothing habits such as nail-biting, hair-pulling, or fidgeting, which provide temporary relief. Teach self-awareness through exercises like noting body signals (e.g., 'racing heart') or anxious thoughts (e.g., 'What if I fail?'). In classrooms, note concentration issues or avoidance of social/homework situations as key indicators.",
                    management: "Practice deep breathing, progressive muscle relaxation, or mindfulness meditation to calm immediate symptoms. Encourage healthy habits like regular exercise, sleep, and an 'anxiety diary' to track triggers and challenge negative self-talk. For ongoing issues, seek school counseling or professional help, and create supportive environments by validating feelings without enabling avoidance."
                }
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
