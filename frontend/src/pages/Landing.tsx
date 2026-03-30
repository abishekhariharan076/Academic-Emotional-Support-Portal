import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';
import Logo from '../components/Logo';
import { 
  Heart, 
  Shield, 
  MessageCircle, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2,
  Activity,
  Zap
} from 'lucide-react';

const Landing: React.FC = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100
            }
        }
    };

    return (
        <div className="min-h-screen bg-canvas flex flex-col font-sans text-text-main selection:bg-primary/20">
            {/* Sticky Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border-light shadow-sm">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
                        <Logo type="horizontal" />
                    </Link>

                    <nav className="hidden lg:flex items-center gap-10">
                        {['How it works', 'Resources', 'Privacy'].map((item) => (
                            <a 
                                key={item}
                                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                                className="text-sm font-bold text-text-body hover:text-primary transition-all hover:scale-105 uppercase tracking-widest"
                            >
                                {item}
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link to="/login">
                            <Button variant="ghost" size="sm" className="font-bold uppercase tracking-widest text-[10px]">Log In</Button>
                        </Link>
                        <Link to="/register">
                            <Button size="sm" className="font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-24 pb-32 overflow-hidden">
                {/* Dynamic Background Elements */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.2, 0.1]
                        }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute top-20 left-[10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] mix-blend-multiply"
                    />
                    <motion.div 
                        animate={{ 
                            scale: [1.2, 1, 1.2],
                            opacity: [0.1, 0.15, 0.1]
                        }}
                        transition={{ duration: 10, repeat: Infinity }}
                        className="absolute bottom-0 right-[5%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[140px] mix-blend-multiply"
                    />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
                            <Zap className="w-3 h-3 animate-pulse" /> Unified Academic Support
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-text-main mb-8 leading-[1.1]">
                            Protecting the <br className="hidden md:block" />
                            <span className="text-primary relative inline-block">
                                Student Mind
                                <div className="absolute bottom-2 left-0 w-full h-3 bg-primary/10 -z-10 -rotate-1" />
                            </span>
                        </h1>
                        
                        <p className="max-w-3xl mx-auto text-lg md:text-xl text-text-body mb-12 leading-relaxed font-medium">
                            A safe, encrypted digital harbor for your emotional journey. 
                            Connect with campus mentors, monitor your wellness pulse, and access curated mental health intelligence in total privacy.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
                            <Link to="/login" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full h-16 px-10 text-base font-black uppercase tracking-widest shadow-2xl shadow-primary/30 group">
                                    Start Pulse Check-In <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link to="/resources" className="w-full sm:w-auto">
                                <Button variant="outline" size="lg" className="w-full h-16 px-10 text-base font-black uppercase tracking-widest border-2 hover:bg-canvas">
                                    Browse Intelligence
                                </Button>
                            </Link>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap justify-center gap-6">
                            {[
                                { text: 'End-to-End Encryption', icon: Shield },
                                { text: 'Anonymous Submission', icon: MessageCircle },
                                { text: '24/7 Crisis Access', icon: Heart }
                            ].map((badge) => (
                                <motion.div 
                                    key={badge.text}
                                    whileHover={{ y: -5 }}
                                    className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-border-light shadow-sm"
                                >
                                    <badge.icon className="w-4 h-4 text-primary" />
                                    <span className="text-xs font-black text-text-main uppercase tracking-widest">{badge.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* How it Works */}
            <section id="how-it-works" className="py-32 bg-white relative">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl md:text-4xl font-black text-text-main mb-6 tracking-tight uppercase">Operational Workflow</h2>
                            <p className="text-text-body font-medium text-lg">Our streamlined architecture ensures your data serves your growth without compromising your peace of mind.</p>
                        </div>
                        <Link to="/register">
                            <Button variant="ghost" className="font-black uppercase tracking-widest text-xs group">
                                Join the Network <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>

                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-10"
                    >
                        {[
                            { 
                                title: 'Daily Pulse', 
                                desc: 'Log your emotional metrics via our rapid check-in interface. Track patterns across semesters.', 
                                icon: Activity,
                                color: 'primary'
                            },
                            { 
                                title: 'Direct Uplink', 
                                desc: 'Securely message authorized campus counselors. Option for complete student-ID masking.', 
                                icon: MessageCircle,
                                color: 'secondary'
                            },
                            { 
                                title: 'Reference Lab', 
                                desc: 'Access high-impact resources on anxiety, focus, and cognitive performance.', 
                                icon: BookOpen,
                                color: 'indigo'
                            },
                        ].map((step, idx) => (
                            <motion.div key={idx} variants={itemVariants}>
                                <Card className="p-8 h-full hover:shadow-2xl transition-all duration-500 border-none bg-canvas/40 group hover:-translate-y-2">
                                    <div className={`w-14 h-14 bg-white rounded-2xl shadow-lg shadow-${step.color}/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                                        <step.icon className={`w-7 h-7 text-${step.color}`} />
                                    </div>
                                    <h3 className="text-xl font-black mb-4 tracking-tight uppercase">{step.title}</h3>
                                    <p className="text-text-body font-medium leading-relaxed">{step.desc}</p>
                                    <div className="mt-8 flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                        Learn More <ArrowRight className="w-3 h-3" />
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <Card className="max-w-5xl mx-auto bg-text-main p-12 md:p-20 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/10 opacity-20 pointer-events-none" />
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tighter uppercase">Ready to prioritize your mind?</h2>
                        <p className="text-white/60 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium">
                            Join thousands of students who have claimed their safe space for growth.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link to="/register" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full h-16 px-12 bg-white text-text-main hover:bg-white/90 font-black uppercase tracking-widest">
                                    Initialize Account
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            </section>

            {/* Footer */}
            <footer className="mt-auto bg-canvas border-t border-border-light py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="md:col-span-1">
                            <Logo type="horizontal" className="mb-6" />
                            <p className="text-sm text-text-muted font-medium pr-4">
                                The gold standard for institutional emotional support ecosystems. 
                                Privacy. Perspective. Progress.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-main">Platform</h4>
                            <ul className="flex flex-col gap-3">
                                {['Check-In', 'Support Inbox', 'Resources'].map(link => (
                                    <li key={link}><Link to="#" className="text-sm text-text-muted hover:text-primary transition-colors font-bold uppercase tracking-widest">{link}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-main">Security</h4>
                            <ul className="flex flex-col gap-3">
                                {['Encryption', 'Privacy Policy', 'Protocol'].map(link => (
                                    <li key={link}><Link to="#" className="text-sm text-text-muted hover:text-primary transition-colors font-bold uppercase tracking-widest">{link}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-main">Support</h4>
                            <ul className="flex flex-col gap-3">
                                {['Help Center', 'API Status', 'Crisis Hotline'].map(link => (
                                    <li key={link}><Link to="#" className="text-sm text-text-muted hover:text-primary transition-colors font-bold uppercase tracking-widest">{link}</Link></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-border-light/50">
                        <div className="flex items-center gap-2">
                             <CheckCircle2 className="w-4 h-4 text-status-success" />
                             <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">
                                Server Status: Nominal <span className="mx-2">•</span> © 2024 AESP Systems
                             </p>
                        </div>
                        <div className="flex gap-8">
                            <a href="#" className="p-2 bg-white rounded-lg border border-border-light shadow-sm hover:scale-110 transition-transform">
                                <Shield className="w-5 h-5 text-text-body" />
                            </a>
                            <a href="#" className="p-2 bg-white rounded-lg border border-border-light shadow-sm hover:scale-110 transition-transform">
                                <MessageCircle className="w-5 h-5 text-text-body" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
