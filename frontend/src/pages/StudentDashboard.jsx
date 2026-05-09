import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProjects } from '../api/projects';
import { SkeletonCard } from '../components/ui/Skeleton';
import MainLayout from '../layouts/MainLayout';

export default function StudentDashboard() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await getMyProjects();
            setProjects(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <MainLayout>
            <div className="max-w-[1280px] mx-auto px-6 lg:ml-64 pt-24 pb-12">
                <div className="relative rounded-[32px] mb-12 bg-[var(--surface)] h-[280px] skeleton"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </div>
        </MainLayout>
    );

    return (
        <MainLayout>
            <main className="lg:ml-64 pt-24 px-6 pb-12 max-w-[1280px] mx-auto">
            <header className="mb-10">
                <h2 className="font-['Syne'] text-[48px] font-bold text-[var(--primary)] mb-2">Welcome back</h2>
                <p className="text-[var(--on-surface-variant)] font-['DM_Sans'] text-[16px]">Here's what's happening across your SDG impact initiatives.</p>
            </header>

            <div className="grid grid-cols-12 gap-8">
                {/* Projects Grid */}
                <section className="col-span-12 xl:col-span-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-['Syne'] text-[24px] font-bold text-[var(--on-surface)]">My Projects</h3>
                        <button className="text-[var(--primary)] font-bold hover:underline font-['DM_Sans'] text-[14px]">View All</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {projects.length === 0 ? (
                            <div className="col-span-full border-2 border-dashed border-[var(--sand)]/50 rounded-[28px] p-10 flex flex-col items-center justify-center text-[var(--on-surface-variant)] text-center">
                                <span className="material-symbols-outlined text-4xl mb-2 animate-float">folder_off</span>
                                <h3 className="font-bold mb-2 text-lg">Awaiting Assignment</h3>
                                <p className="text-[14px]">You haven't been assigned to any projects yet. Contact your faculty advisor.</p>
                            </div>
                        ) : (
                            projects.map((project, idx) => {
                                const projectId = project.id || project._id;
                                const firstSdg = Object.keys(project.sdg_mapping)[0] || '1';
                                const completion = project.tasks?.length ? Math.round((project.tasks.filter(t => t.status === 'DONE').length / project.tasks.length) * 100) : 0;
                                
                                return (
                                    <div key={projectId} className="bg-white rounded-[28px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] border border-[var(--sand)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl p-6 flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`px-3 py-1 text-white text-[12px] font-['DM_Mono'] font-medium rounded-full bg-[var(--sdg-${firstSdg})]`}>
                                                SDG {firstSdg}
                                            </span>
                                            <span className="material-symbols-outlined text-[var(--sand)] cursor-pointer hover:text-[var(--on-surface)]">more_vert</span>
                                        </div>
                                        <h4 className="font-['Syne'] text-[24px] font-bold text-[var(--on-surface)] mb-2 line-clamp-2">{project.title}</h4>
                                        <p className="text-[14px] font-['DM_Sans'] text-[var(--on-surface-variant)] mb-6 flex-grow line-clamp-3">
                                        {project.problem_statement || "Research initiative mapping to the UN Sustainable Development Goals."}
                                        </p>
                                        
                                        <div className="mb-6">
                                            <div className="flex justify-between font-['DM_Mono'] text-[12px] font-medium text-[var(--on-surface-variant)] mb-2">
                                                <span>COMPLETION</span>
                                                <span>{completion}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-[var(--surface-container)] rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full bg-[var(--sdg-${firstSdg})]`} style={{ width: `${completion}%` }}></div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex -space-x-2">
                                                <div className="w-8 h-8 rounded-full bg-[var(--surface-alt)] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[var(--on-surface)]">+{project.team?.member_ids?.length || 1}</div>
                                            </div>
                                            <button 
                                                onClick={() => navigate(`/project/${projectId}/workspace`)}
                                                className="bg-[var(--primary)] text-white px-5 py-2 rounded-xl text-[14px] font-bold font-['DM_Sans'] active:scale-95 transition-transform"
                                            >
                                                Open Workspace
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        
                        {/* Start New Project (Hidden for Students, just here as a placeholder or can be removed if they don't have access) */}
                        <button 
                            className="border-2 border-dashed border-[var(--sand)]/50 rounded-[28px] p-6 flex flex-col items-center justify-center text-[var(--on-surface-variant)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all group"
                            onClick={() => navigate('/project/new')}
                        >
                            <span className="material-symbols-outlined text-4xl mb-2 group-hover:scale-110 transition-transform">add_circle</span>
                            <span className="font-bold font-['DM_Sans']">Propose Initiative</span>
                        </button>
                    </div>
                </section>

                {/* Sidebar */}
                <aside className="col-span-12 xl:col-span-4 space-y-8">
                    {/* Upcoming Deadlines Placeholder */}
                    <div className="bg-white rounded-[28px] shadow-sm border border-[var(--sand)] p-6">
                        <h3 className="font-['Syne'] text-[24px] font-bold text-[var(--on-surface)] mb-6">Upcoming Deadlines</h3>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-4 p-3 rounded-xl hover:bg-[var(--surface-container)] transition-colors">
                                <div className="bg-[var(--amber-light)] text-[var(--secondary)] w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold">
                                    <span className="text-[10px] leading-none">NOV</span>
                                    <span className="text-xl">12</span>
                                </div>
                                <div>
                                    <p className="font-bold text-[var(--on-surface)]">Milestone Review</p>
                                    <p className="text-[14px] text-[var(--on-surface-variant)]">Research Track 1</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4 p-3 rounded-xl hover:bg-[var(--surface-container)] transition-colors">
                                <div className="bg-[var(--blue-light)] text-[var(--blue)] w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold">
                                    <span className="text-[10px] leading-none">DEC</span>
                                    <span className="text-xl">05</span>
                                </div>
                                <div>
                                    <p className="font-bold text-[var(--on-surface)]">Final Report Submission</p>
                                    <p className="text-[14px] text-[var(--on-surface-variant)]">Institutional Committee</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity Placeholder */}
                    <div className="bg-white rounded-[28px] shadow-sm border border-[var(--sand)] p-6">
                        <h3 className="font-['Syne'] text-[24px] font-bold text-[var(--on-surface)] mb-6">Recent Activity</h3>
                        <div className="space-y-6">
                            <div className="flex space-x-3">
                                <div className="w-10 h-10 rounded-full flex-shrink-0 bg-[var(--surface-dim)] flex items-center justify-center text-xs font-bold">PT</div>
                                <div>
                                    <p className="text-[14px] font-bold text-[var(--on-surface)]">Project Team <span className="font-normal text-[var(--on-surface-variant)] ml-2">2h ago</span></p>
                                    <div className="bg-[var(--surface)] p-3 rounded-2xl rounded-tl-none mt-1">
                                        <p className="text-[14px]">The literature review document has been updated in the RAG system.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
        </MainLayout>
    );
}
