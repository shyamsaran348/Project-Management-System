import React from 'react';
import { motion } from 'framer-motion';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function Home() {
    return (
        <MainLayout>
            {/* Hero Section */}
            <section className="py-24 border-b border-gray-100 dark:border-gray-800">
                <div className="container">
                    <div className="max-w-3xl">
                        <motion.span 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-bold rounded mb-6 uppercase tracking-wider"
                        >
                            Technology for Social Good
                        </motion.span>
                        
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight"
                        >
                            Intelligent Project Management for Academic Social Impact.
                        </motion.h1>
                        
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-gray-500 mb-10 leading-relaxed max-w-2xl"
                        >
                            Align your research and technical projects with the UN Sustainable Development Goals using AI-powered classification and literature intelligence.
                        </motion.p>
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap gap-4"
                        >
                            <Button size="lg" onClick={() => window.location.href = '/login'}>
                                Get Started
                            </Button>
                            <Button variant="secondary" size="lg" onClick={() => window.location.href = '/register'}>
                                View Impact Reports
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                title: "SDG Classification",
                                desc: "Automated mapping of project problem statements to the 17 UN SDGs using BERT-based Transformers.",
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                )
                            },
                            {
                                title: "Literature Intelligence",
                                desc: "RAG-based system for querying research papers using Groq LLM for instant academic insights.",
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                )
                            },
                            {
                                title: "Collaboration Hub",
                                desc: "Unified workspace with real-time task tracking and smart team assignment validation.",
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                )
                            }
                        ].map((feature, i) => (
                            <div key={i} className="flex flex-col">
                                <div className="text-blue-600 mb-6">{feature.icon}</div>
                                <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed text-sm">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact Section */}
            <section className="py-32">
                <div className="container">
                    <div className="bg-gray-900 rounded-3xl p-12 md:p-20 text-white relative overflow-hidden">
                        <div className="max-w-2xl relative z-10">
                            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">Built for institutions that prioritize impact.</h2>
                            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                                Join hundreds of faculty and students in transforming academic research into measurable contributions for the UN 2030 Agenda.
                            </p>
                            <Button variant="accent" size="lg" onClick={() => window.location.href = '/register'}>
                                Start Building for Social Good
                            </Button>
                        </div>
                        {/* Subtle Abstract Background Decoration */}
                        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                            <div className="w-full h-full border-l border-white/20 transform skew-x-12 translate-x-20" />
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
