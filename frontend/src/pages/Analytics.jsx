import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getInstitutionAnalytics } from '../api/projects';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export default function Analytics() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await getInstitutionAnalytics();
            setStats(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <MainLayout>
            <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div className="w-8 h-8 border-[3px] border-[var(--surface2)] border-t-[var(--ink)] rounded-full animate-spin"></div>
                <p className="text-[0.8rem] font-mono text-[var(--text-muted)] uppercase tracking-widest">Processing Institution Data...</p>
            </div>
        </MainLayout>
    );

    if (!stats) return <MainLayout><div className="container py-20 text-center">Failed to load analytics</div></MainLayout>;

    return (
        <MainLayout>
            <div className="max-w-[1200px] mx-auto px-10 py-12">
                <div className="mb-12">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.2em] uppercase text-[var(--accent2)] mb-4"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent2)] animate-pulse"></span>
                        Strategic Intelligence — Institution Overview
                    </motion.div>
                    <h1 className="font-['Syne'] text-[2.8rem] font-bold tracking-tight leading-none mb-4 text-[var(--ink)]">
                        Impact Metrics.
                    </h1>
                    <p className="text-[0.95rem] font-light text-[var(--text-muted)] leading-relaxed max-w-[500px]">
                        Analyzing cross-departmental alignment with the Sustainable Development Goals and research momentum.
                    </p>
                </div>

                {/* Top Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {[
                        { label: 'Total Initiatives', value: stats.total_projects, icon: '🎯' },
                        { label: 'Active Milestones', value: stats.total_tasks, icon: '⚡' },
                        { label: 'Impact Completion', value: `${stats.completion_rate}%`, icon: '📈' },
                        { label: 'Researcher Reach', value: '240+', icon: '👥' }
                    ].map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="p-8 h-full bg-white border-[rgba(180,168,130,0.1)] relative overflow-hidden group">
                                <div className="text-[1.5rem] mb-4">{m.icon}</div>
                                <div className="text-[2.2rem] font-['Syne'] font-bold text-[var(--ink)] tracking-tighter mb-1">{m.value}</div>
                                <div className="text-[0.65rem] font-mono text-[var(--text-muted)] uppercase tracking-widest font-bold">{m.label}</div>
                                <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--primary)]/5 rounded-bl-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* SDG Distribution Chart (CSS) */}
                    <Card className="lg:col-span-8 p-10 bg-white border border-[rgba(212,201,168,0.25)] ring-1 ring-white shadow-md">
                        <div className="section-label flex items-center gap-2 mb-10">
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent2)]"></div>
                            <span className="text-[0.7rem] font-mono text-[var(--text-muted)] uppercase tracking-[0.15em] font-bold">SDG Target Distribution</span>
                        </div>
                        
                        <div className="space-y-8">
                            {stats.sdg_distribution.length === 0 ? (
                                <p className="text-center py-20 text-[var(--text-muted)] opacity-50">No SDG data mapped yet.</p>
                            ) : (
                                stats.sdg_distribution.map((sdg, i) => {
                                    const percentage = Math.max(10, (sdg.count / stats.total_projects) * 100);
                                    return (
                                        <div key={sdg.id} className="space-y-2.5 group">
                                            <div className="flex justify-between items-center text-[0.75rem] font-bold font-mono text-[var(--text-muted)] uppercase tracking-wider">
                                                <span>SDG {sdg.id}</span>
                                                <span className="text-[var(--ink)]">{sdg.count} Projects</span>
                                            </div>
                                            <div className="h-3 bg-[var(--surface)] rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percentage}%` }}
                                                    transition={{ duration: 1, delay: i * 0.05 }}
                                                    className="h-full group-hover:brightness-110 transition-all shadow-[0_0_12px_rgba(0,0,0,0.1)]"
                                                    style={{ background: `var(--sdg-${sdg.id})` || 'var(--ink)' }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </Card>

                    {/* Completion Velocity */}
                    <Card className="lg:col-span-4 p-10 bg-[var(--ink)] text-white border-none shadow-2xl relative overflow-hidden">
                        <div className="absolute top-[-20%] right-[-20%] w-[200px] h-[200px] bg-[var(--accent2)] rounded-full opacity-10 blur-3xl"></div>
                        
                        <div className="relative z-10">
                            <div className="section-label flex items-center gap-2 mb-10">
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent2)]"></div>
                                <span className="text-[0.7rem] font-mono text-white/40 uppercase tracking-[0.15em] font-bold">Research Velocity</span>
                            </div>

                            <div className="text-center py-10">
                                <div className="relative inline-block">
                                    <svg className="w-40 h-40 transform -rotate-90">
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r="70"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            className="text-white/5"
                                        />
                                        <motion.circle
                                            cx="80"
                                            cy="80"
                                            r="70"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            strokeDasharray={440}
                                            initial={{ strokeDashoffset: 440 }}
                                            animate={{ strokeDashoffset: 440 - (440 * stats.completion_rate) / 100 }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="text-[var(--accent2)]"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-[2.2rem] font-['Syne'] font-bold tracking-tighter">{stats.completion_rate}%</span>
                                        <span className="text-[0.6rem] font-mono text-white/40 uppercase tracking-widest">Global Pace</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-[0.75rem] text-white/50 font-light">Milestones Completed</span>
                                    <span className="text-[0.875rem] font-bold">{stats.completed_tasks}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[0.75rem] text-white/50 font-light">Remaining Phase Tasks</span>
                                    <span className="text-[0.875rem] font-bold">{stats.total_tasks - stats.completed_tasks}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
