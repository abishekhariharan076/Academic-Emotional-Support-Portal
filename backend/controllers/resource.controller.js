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
                fullContent: [
                    {
                        title: "Common Symptoms",
                        text: "Students with anxiety often show physical signs like rapid heartbeat, sweating, stomachaches, headaches, or muscle tension. Emotionally, they may feel excessive worry, irritability, or negative thoughts, while behaviorally, they avoid tasks, struggle with focus, or exhibit restlessness—sometimes mistaken for ADHD. Patterns like frequent 'illness' on test days or declining grades signal a need for support."
                    },
                    {
                        title: "Recognition Tips",
                        text: "Watch for self-soothing habits such as nail-biting, hair-pulling, or fidgeting, which provide temporary relief. Teach self-awareness through exercises like noting body signals (e.g., 'racing heart') or anxious thoughts (e.g., 'What if I fail?'). In classrooms, note concentration issues or avoidance of social/homework situations as key indicators."
                    },
                    {
                        title: "Management Strategies",
                        text: "Practice deep breathing, progressive muscle relaxation, or mindfulness meditation to calm immediate symptoms. Encourage healthy habits like regular exercise, sleep, and an 'anxiety diary' to track triggers and challenge negative self-talk. For ongoing issues, seek school counseling or professional help, and create supportive environments by validating feelings without enabling avoidance."
                    }
                ]
            },
            {
                _id: "res2",
                title: "Sleep Hygiene 101",
                description: "Practical tips for improving your sleep quality and academic performance with better daily routines.",
                category: "Sleep",
                type: "Article",
                link: "#",
                fullContent: [
                    {
                        title: "Key Principles",
                        text: "Maintain a fixed sleep schedule, even on weekends, aiming for 7-9 hours nightly to align your circadian rhythm. Avoid caffeine after noon and heavy meals close to bedtime, as they disrupt melatonin production. Limit naps to 20-30 minutes early in the day to prevent nighttime interference."
                    },
                    {
                        title: "Bedroom Setup",
                        text: "Keep your room cool (60-67°F), dark with blackout curtains or masks, and quiet using earplugs or white noise. Invest in a supportive mattress, pillow, and breathable bedding reserved solely for sleep and relaxation—no work or screens."
                    },
                    {
                        title: "Daily Routines",
                        text: "Exercise regularly but finish vigorous activity 3+ hours before bed to deepen sleep without overstimulation. Wind down with a screen-free routine like reading or journaling 1 hour prior, dimming lights to signal rest. Track sleep patterns in a diary to identify and adjust personal triggers."
                    }
                ]
            },
            {
                _id: "res3",
                title: "Focus & Time Management",
                description: "Master techniques like Pomodoro and time blocking to stay productive and avoid academic burnout.",
                category: "Focus",
                type: "Article",
                link: "#",
                fullContent: [
                    {
                        title: "Pomodoro Basics",
                        text: "Choose a single task, set a timer for 25 minutes of uninterrupted focus, then take a 5-minute break. After four cycles (about 2 hours), enjoy a longer 15-30 minute break to recharge fully. Track completed 'pomodoros' to monitor progress and refine your rhythm."
                    },
                    {
                        title: "Complementary Techniques",
                        text: "Prioritize tasks using time blocking: assign specific slots (e.g., 4-5 PM for math homework) to avoid multitasking, which cuts productivity by up to 40%. Break large assignments into small steps and use the '1-hour daily rule' for spaced revision to boost memory without cramming. Silence notifications and study in a distraction-free zone during sessions."
                    },
                    {
                        title: "Avoiding Burnout",
                        text: "Adjust intervals if 25 minutes feels too long—try 15 or 10 for tough tasks—and always protect breaks for movement or snacks. Review weekly to balance study with rest, declining overload to safeguard mental energy. Consistent use improves concentration over time, directly lifting academic output."
                    }
                ]
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
