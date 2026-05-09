import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { motion } from 'framer-motion';
import { getPublicAnalytics } from '../api/projects';
import ParticleNetwork from '../components/ui/ParticleNetwork';

export default function Home() {
    const [stats, setStats] = useState({ total_projects: 0, total_sdgs_impacted: 0, active_researchers: 0 });

    useEffect(() => {
        getPublicAnalytics().then(setStats);
    }, []);
    return (
        <MainLayout>
            <div className="relative overflow-hidden bg-[var(--cream)]">
                {/* Interactive Particle Background */}
                <ParticleNetwork />

                {/* Hero Section */}
                <div className="max-w-[1400px] mx-auto px-10 pt-32 pb-48 grid grid-cols-1 lg:grid-cols-[1.2fr_480px] gap-20 items-center relative">
                    <div className="hero-left relative z-10">
                        <div className="max-w-[700px]">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--accent-light)] text-[var(--accent)] rounded-full font-mono text-[0.65rem] font-bold tracking-[0.1em] uppercase mb-6"
                        >
                            <span className="w-1 h-1 bg-[var(--accent)] rounded-full animate-pulse"></span>
                            Institutional Intelligence Hub
                        </motion.div>
                        <motion.h1 
                             initial={{ opacity: 0, y: 30 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ duration: 0.8, delay: 0.1, ease: "circOut" }}
                             className="text-[clamp(2.5rem,5vw,4.2rem)] mb-10 leading-[1.1] text-balance font-heading"
                        >
                            Academic projects<br/>
                            aligned with <em className="font-serif italic text-[var(--accent)]">global</em><br/>
                            impact.
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-[1.1rem] text-[var(--text-muted)] font-light leading-relaxed mb-10 max-w-[500px]"
                        >
                            The premier platform for university research centers to track, analyze, and report their contribution to the UN Sustainable Development Goals.
                        </motion.p>
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="flex flex-wrap items-center gap-8"
                        >
                            <Link to="/register" className="btn-primary px-12 h-16 rounded-xl text-[17px] shadow-lg">
                                Start Initiative
                                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                            </Link>
                            <Link to="/analytics" className="font-heading font-semibold text-[15px] text-[var(--primary)] hover:text-[var(--accent)] transition-colors flex items-center gap-3 group">
                                View Impact Dashboard
                                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">analytics</span>
                            </Link>
                        </motion.div>
                    </div>
                    </div>

                    {/* Premium Hero Visual */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50, rotate: 2 }}
                        animate={{ opacity: 1, x: 0, rotate: 0 }}
                        transition={{ duration: 1, ease: "circOut" }}
                        className="relative hidden lg:block"
                    >
                        <div className="absolute -inset-10 bg-[radial-gradient(circle,rgba(26,107,60,0.1),transparent_70%)] blur-3xl"></div>
                        <div className="p-1 border border-white/40 ring-1 ring-[rgba(212,201,168,0.2)] shadow-2xl relative overflow-hidden bg-white/40 backdrop-blur-3xl rounded-[40px]">
                            <div className="relative rounded-[36px] overflow-hidden aspect-[4/5] bg-[var(--ink)]">
                                <img 
                                    src="/sdg_institutional_hero_1778334505773.png" 
                                    className="w-full h-full object-cover opacity-90"
                                    alt="Institutional Intelligence"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-transparent to-transparent"></div>
                                
                                <div className="absolute bottom-10 left-10 right-10">
                                    <div className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/40 mb-4">Platform Reach</div>
                                    <div className="flex justify-between items-center px-2 py-4 border-t border-white/10">
                                        <div className="group transition-all">
                                            <div className="text-[1.6rem] font-['Syne'] font-bold text-white leading-tight group-hover:text-[var(--accent2)] transition-colors">{stats.total_projects}</div>
                                            <div className="text-[0.6rem] font-mono text-white/30 uppercase tracking-[0.1em]">Global Projects</div>
                                        </div>
                                        <div className="group transition-all">
                                            <div className="text-[1.6rem] font-['Syne'] font-bold text-white leading-tight group-hover:text-[var(--accent2)] transition-colors">{stats.total_sdgs_impacted}</div>
                                            <div className="text-[0.6rem] font-mono text-white/30 uppercase tracking-[0.1em]">SDG Targets</div>
                                        </div>
                                        <div className="group transition-all">
                                            <div className="text-[1.6rem] font-['Syne'] font-bold text-white leading-tight group-hover:text-[var(--accent2)] transition-colors">{stats.active_researchers}</div>
                                            <div className="text-[0.6rem] font-mono text-white/30 uppercase tracking-[0.1em]">Researchers</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Trust Bar */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-48 pt-24 border-t border-[var(--border)] flex flex-col items-center pb-48 section-container"
                >
                    <p className="text-[0.65rem] font-mono text-[var(--text-muted)] uppercase tracking-[0.5em] mb-20">Institutional Compliance Standards</p>
                    <div className="flex flex-wrap justify-center gap-16 md:gap-40 opacity-30 grayscale">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-3xl">account_balance</span>
                            <span className="font-['Syne'] font-bold text-[1.1rem]">UN Global</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-3xl">school</span>
                            <span className="font-['Syne'] font-bold text-[1.1rem]">IEEE Research</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-3xl">public</span>
                            <span className="font-['Syne'] font-bold text-[1.1rem]">SDG Alliance</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-3xl">verified</span>
                            <span className="font-['Syne'] font-bold text-[1.1rem]">Institutional Hub</span>
                        </div>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <div className="max-w-[1280px] mx-auto px-10 py-32">
                    <div className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--accent)] mb-6">Core Capabilities</div>
                    <h2 className="text-[clamp(2rem,4vw,3.2rem)] mb-20 leading-[1.15] font-heading max-w-[800px]">
                        The toolkit for <em className="font-serif italic font-normal">modern</em> academic research centers.
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { icon: '🎯', name: 'SDG Classification', desc: 'Neural transformer automatically maps your project\'s problem statement to the 17 UN SDGs with institutional-grade accuracy.', tag: 'BERT · Transformers', bg: 'bg-[var(--accent-light)]' },
                            { icon: '📚', name: 'Literature Assistant', desc: 'Upload research papers and query the repository using plain language. Powered by high-speed RAG and Groq Llama-3.', tag: 'RAG · Groq LLM', bg: 'bg-[var(--accent-light)]' },
                            { icon: '⚡', name: 'Global Collaboration', desc: 'Secure institutional workspace with task tracking, file synchronization, and real-time project communications.', tag: 'WebSocket · RBAC', bg: 'bg-[var(--accent-light)]' }
                        ].map((feat, i) => (
                            <div key={i} className="glass-panel p-10 rounded-[32px] group hover:border-[var(--accent)]/30 transition-all duration-500">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-8 ${feat.bg} text-[var(--primary)] shadow-sm`}>{feat.icon}</div>
                                <h3 className="text-[1.25rem] mb-4 font-heading">{feat.name}</h3>
                                <p className="text-[0.95rem] text-[var(--text-muted)] font-light leading-relaxed mb-8">{feat.desc}</p>
                                <div className="font-mono text-[10px] px-3.5 py-1.5 rounded-lg bg-[var(--surface-alt)] text-[var(--primary)] inline-block uppercase tracking-wider font-bold">{feat.tag}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SDG Showcase */}
                <div className="bg-[var(--primary)] py-40">
                    <div className="section-container py-0">
                        <h2 className="text-[clamp(2.2rem,5vw,3.5rem)] text-white mb-6 font-heading">Institutional SDG Alignment</h2>
                        <p className="text-[1.1rem] font-light text-white/60 max-w-[600px] leading-relaxed mb-20">SDGSync ensures every project is mapped to the <em className="font-serif italic">Global Goals</em>, providing the transparency required for international academic reporting.</p>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { n: '1 · No Poverty', c: '#ff8a96', b: 'rgba(229,36,59,0.1)', bc: 'rgba(229,36,59,0.3)' },
                                { n: '2 · Zero Hunger', c: '#ffb866', b: 'rgba(221,166,58,0.1)', bc: 'rgba(221,166,58,0.3)' },
                                { n: '3 · Good Health', c: '#7de87a', b: 'rgba(76,159,56,0.1)', bc: 'rgba(76,159,56,0.3)' },
                                { n: '4 · Quality Education', c: '#ff8a96', b: 'rgba(197,25,45,0.1)', bc: 'rgba(197,25,45,0.3)' },
                                { n: '5 · Gender Equality', c: '#ff7a6a', b: 'rgba(255,58,33,0.1)', bc: 'rgba(255,58,33,0.3)' },
                                { n: '6 · Clean Water', c: '#7ad4f0', b: 'rgba(38,189,226,0.1)', bc: 'rgba(38,189,226,0.3)' },
                                { n: '7 · Clean Energy', c: '#ffd966', b: 'rgba(252,195,11,0.1)', bc: 'rgba(252,195,11,0.3)' },
                                { n: '8 · Decent Work', c: '#e08080', b: 'rgba(162,25,66,0.1)', bc: 'rgba(162,25,66,0.3)' },
                                { n: '9 · Industry', c: '#ffb080', b: 'rgba(253,105,37,0.1)', bc: 'rgba(253,105,37,0.3)' },
                                { n: '10 · Reduced Inequalities', c: '#ff7ab0', b: 'rgba(221,19,103,0.1)', bc: 'rgba(221,19,103,0.3)' },
                                { n: '11 · Sustainable Cities', c: '#ffb866', b: 'rgba(253,157,36,0.1)', bc: 'rgba(253,157,36,0.3)' },
                                { n: '12 · Responsible Consumption', c: '#d4a870', b: 'rgba(191,139,46,0.1)', bc: 'rgba(191,139,46,0.3)' },
                                { n: '13 · Climate Action', c: '#7de87a', b: 'rgba(63,126,68,0.1)', bc: 'rgba(63,126,68,0.3)' },
                                { n: '14 · Life Below Water', c: '#7ad4f0', b: 'rgba(10,151,217,0.1)', bc: 'rgba(10,151,217,0.3)' },
                                { n: '15 · Life on Land', c: '#a0e08a', b: 'rgba(86,192,43,0.1)', bc: 'rgba(86,192,43,0.3)' },
                                { n: '16 · Peace & Justice', c: '#7ab8e0', b: 'rgba(0,104,157,0.1)', bc: 'rgba(0,104,157,0.3)' },
                                { n: '17 · Partnerships', c: '#7a9ec0', b: 'rgba(25,72,106,0.1)', bc: 'rgba(25,72,106,0.3)' }
                            ].map((goal, i) => (
                                <div key={i} className="px-3.5 py-2 rounded-full text-[0.78rem] font-mono border transition-transform hover:-translate-y-0.5 cursor-default" style={{ color: goal.c, backgroundColor: goal.b, borderColor: goal.bc }}>
                                    {goal.n}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="section-container py-40">
                    <div className="bg-[var(--surface-alt)] rounded-[48px] p-24 flex flex-col md:flex-row items-center justify-between gap-20 relative overflow-hidden border border-[var(--border)] shadow-2xl">
                        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full bg-[var(--primary)]/5 blur-3xl"></div>
                        <div className="relative z-10 text-center md:text-left">
                            <h2 className="text-[3rem] text-[var(--primary)] mb-6 font-heading">Start your <em className="font-serif italic font-normal">impact</em> journey.</h2>
                            <p className="text-[1.15rem] text-[var(--text-muted)] font-light leading-relaxed max-w-[500px]">Join the global network of researchers transforming academia into a force for sustainable growth.</p>
                        </div>
                        <Link to="/register" className="btn-primary relative z-10 whitespace-nowrap px-12 py-6 rounded-2xl text-[18px] shadow-xl">
                            Create Institutional Account
                        </Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
