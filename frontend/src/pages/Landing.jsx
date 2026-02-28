import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';

const Landing = () => {
    return (
        <div className="min-h-screen bg-canvas flex flex-col font-sans text-text-main">
            {/* Sticky Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border-light">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                            AE
                        </div>
                        <span className="text-xl font-bold tracking-tight text-primary">AESP</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        <a href="#how-it-works" className="text-sm font-medium text-text-body hover:text-primary transition-colors">How it works</a>
                        <a href="#resources" className="text-sm font-medium text-text-body hover:text-primary transition-colors">Resources</a>
                        <a href="#privacy" className="text-sm font-medium text-text-body hover:text-primary transition-colors">Privacy</a>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link to="/login">
                            <Button variant="ghost" size="sm">Log In</Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="primary" size="sm">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl mix-blend-multiply animate-pulse"></div>
                    <div className="absolute top-40 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl mix-blend-multiply"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text-main mb-6">
                        A safe space for <br className="hidden md:block" />
                        <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400">
                            academic well-being
                        </span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-text-body mb-10 leading-relaxed">
                        Connect with counselors, track your emotional health, and access resources in a private, supportive environment designed for your campus life.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Link to="/login">
                            <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/20">
                                Start a Check-In
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                Explore Resources
                            </Button>
                        </Link>
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                        {['Privacy-first', 'Counselor-guided', 'Anonymous option', 'Campus-ready'].map((tag) => (
                            <span key={tag} className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-border-light shadow-sm text-sm font-medium text-text-body">
                                <span className="w-2 h-2 rounded-full bg-secondary mr-2"></span>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section id="how-it-works" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-text-main mb-4">How it works</h2>
                        <p className="text-text-body max-w-xl mx-auto">Simple steps to get the support you need, whenever you need it.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: 'Check in privately', desc: 'Log your mood and stress levels to keep track of your well-being over time.', icon: '📝' },
                            { title: 'Request support', desc: 'Reach out to counselors anonymously or directly for guidance and help.', icon: '🤝' },
                            { title: 'Get responses', desc: 'Receive thoughtful, professional feedback and resources from campus counselors.', icon: '💬' },
                        ].map((step, idx) => (
                            <Card key={idx} className="text-center hover:shadow-lg transition-shadow duration-300 border-none bg-canvas/50">
                                <div className="w-12 h-12 mx-auto bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl mb-6">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                                <p className="text-text-body leading-relaxed">{step.desc}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-auto bg-canvas border-t border-border-light py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-text-muted text-sm">
                        © 2024 Academic Emotional Support Portal. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <a href="#" className="text-text-muted hover:text-primary">Privacy Policy</a>
                        <a href="#" className="text-text-muted hover:text-primary">Terms of Service</a>
                        <a href="#" className="text-status-error font-medium hover:text-red-600">Emergency Resources</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
