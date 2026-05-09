import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getMyProjects, assignStudents, deleteProject, updateProjectStatus } from '../api/projects';
import { toast } from 'react-hot-toast';
import { getStudents } from '../api/users';
import { SkeletonCard } from '../components/ui/Skeleton';
import MainLayout from '../layouts/MainLayout';

export default function FacultyDashboard() {
    const [projects, setProjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedProjectId, setExpandedProjectId] = useState(null);
    const [assignments, setAssignments] = useState({});
    const [assigning, setAssigning] = useState(false);
    const [assignError, setAssignError] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [projectsData, studentsData] = await Promise.all([
                getMyProjects(),
                getStudents()
            ]);
            setProjects(projectsData);
            setStudents(studentsData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (projectId, newStatus) => {
        try {
            await updateProjectStatus(projectId, newStatus);
            toast.success(`Status updated to ${newStatus}`);
            loadData();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const getAssignmentState = (projectId) => {
        if (assignments[projectId]) return assignments[projectId];
        return { team_name: '', leader_id: '', member_ids: [] };
    };

    const updateAssignmentState = (projectId, nextState) => {
        setAssignments((prev) => ({
            ...prev,
            [projectId]: { ...getAssignmentState(projectId), ...nextState }
        }));
    };

    const handleMembersChange = (projectId, event) => {
        const selected = Array.from(event.target.selectedOptions).map((o) => o.value);
        updateAssignmentState(projectId, { member_ids: selected });
    };

    const getProjectId = (project) => project.id || project._id;

    const handleAssign = async (projectId) => {
        setAssigning(true);
        setAssignError('');
        const state = getAssignmentState(projectId);

        try {
            const payload = {
                team_name: state.team_name || undefined,
                leader_id: state.leader_id || undefined,
                member_ids: state.member_ids || []
            };
            await assignStudents(projectId, payload);
            await loadData();
            setExpandedProjectId(null);
        } catch (err) {
            setAssignError(err.message || 'Failed to assign students');
        } finally {
            setAssigning(false);
        }
    };

    const handleDelete = async (projectId) => {
        const confirmed = window.confirm('Delete this project? This cannot be undone.');
        if (!confirmed) return;

        setDeletingId(projectId);
        setAssignError('');
        try {
            await deleteProject(projectId);
            await loadData();
            if (expandedProjectId === projectId) setExpandedProjectId(null);
        } catch (err) {
            setAssignError(err.message || 'Failed to delete project');
        } finally {
            setDeletingId(null);
        }
    };

    const [searchTerm, setSearchTerm] = useState('');
    const filteredStudents = students.filter(s => 
        s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.student_profile?.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="max-w-[1280px] mx-auto px-6 py-12 lg:ml-64 pt-24">
            <div className="relative rounded-[32px] mb-12 bg-[var(--surface)] h-[280px] skeleton"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </div>
        </div>
    );

    return (
        <MainLayout>
            <main className="lg:ml-64 pt-24 px-6 pb-12 max-w-[1280px] mx-auto">
                <header className="flex flex-col md:flex-row justify-between md:items-end mb-10 gap-4">
                    <div>
                        <h1 className="font-['Syne'] text-[48px] font-bold text-[var(--on-surface)] mb-2 tracking-tight">Welcome back, Professor</h1>
                        <p className="font-['DM_Sans'] text-[16px] text-[var(--on-surface-variant)]">Your institutional research dashboard is up to date.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/project/new')}
                        className="flex items-center gap-2 bg-[var(--on-surface)] text-white px-8 py-4 rounded-xl font-bold shadow-md hover:scale-95 transition-transform whitespace-nowrap w-fit"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Create New Project
                    </button>
                </header>

                {/* KPI Section */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="premium-card bg-white border border-[var(--sand)] p-8 shadow-sm rounded-[28px] transition-all hover:-translate-y-1 hover:shadow-md">
                        <div className="flex justify-between items-start mb-4">
                            <p className="font-['DM_Mono'] text-[12px] text-[var(--on-surface-variant)] uppercase tracking-wider font-medium">Total Projects</p>
                            <span className="material-symbols-outlined text-[var(--primary)]">analytics</span>
                        </div>
                        <h2 className="font-['Syne'] text-[48px] font-bold text-[var(--on-surface)] leading-none">{projects.length}</h2>
                        <div className="mt-4 flex items-center text-[var(--sdg-3)] gap-1">
                            <span className="material-symbols-outlined text-sm">trending_up</span>
                            <span className="font-['DM_Sans'] text-[14px]">Active portfolio</span>
                        </div>
                    </div>
                    
                    <div className="premium-card bg-white border border-[var(--sand)] p-8 shadow-sm rounded-[28px] transition-all hover:-translate-y-1 hover:shadow-md">
                        <div className="flex justify-between items-start mb-4">
                            <p className="font-['DM_Mono'] text-[12px] text-[var(--on-surface-variant)] uppercase tracking-wider font-medium">Active Researchers</p>
                            <span className="material-symbols-outlined text-[var(--primary)]">diversity_3</span>
                        </div>
                        <h2 className="font-['Syne'] text-[48px] font-bold text-[var(--on-surface)] leading-none">{students.length}</h2>
                        <div className="mt-4 flex items-center text-[var(--sdg-3)] gap-1">
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            <span className="font-['DM_Sans'] text-[14px]">Cross-departmental</span>
                        </div>
                    </div>
                    
                    <div className="premium-card bg-white border border-[var(--sand)] p-8 shadow-sm rounded-[28px] transition-all hover:-translate-y-1 hover:shadow-md">
                        <div className="flex justify-between items-start mb-4">
                            <p className="font-['DM_Mono'] text-[12px] text-[var(--on-surface-variant)] uppercase tracking-wider font-medium">Global Completion</p>
                            <span className="material-symbols-outlined text-[var(--primary)]">data_usage</span>
                        </div>
                        <div className="flex flex-col gap-2 mt-4">
                            <div className="flex justify-between text-[14px] font-['DM_Sans'] mb-1">
                                <span className="font-medium text-[var(--on-surface-variant)]">Average</span>
                                <span className="font-bold text-[var(--primary)]">65%</span>
                            </div>
                            <div className="w-full h-3 bg-[var(--surface-container-high)] rounded-full overflow-hidden">
                                <div className="h-full bg-[var(--primary)]" style={{ width: '65%' }}></div>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-between gap-1 h-12 items-end">
                            <div className="flex-1 bg-[var(--primary)]/20 rounded-t-sm" style={{ height: '40%' }}></div>
                            <div className="flex-1 bg-[var(--primary)]/40 rounded-t-sm" style={{ height: '60%' }}></div>
                            <div className="flex-1 bg-[var(--primary)]/60 rounded-t-sm" style={{ height: '85%' }}></div>
                            <div className="flex-1 bg-[var(--primary)]/80 rounded-t-sm" style={{ height: '70%' }}></div>
                            <div className="flex-1 bg-[var(--primary)] rounded-t-sm" style={{ height: '95%' }}></div>
                        </div>
                    </div>
                </section>

                {/* Project Grid */}
                <h3 className="font-['Syne'] text-[24px] font-bold text-[var(--on-surface)] mb-6">Active Initiatives</h3>
                
                {projects.length === 0 ? (
                    <div className="col-span-full border-2 border-dashed border-[var(--sand)]/50 rounded-[28px] p-16 flex flex-col items-center justify-center text-[var(--on-surface-variant)] text-center bg-white/50">
                        <span className="material-symbols-outlined text-5xl mb-4 animate-float opacity-50">folder_off</span>
                        <h3 className="font-['Syne'] font-bold mb-2 text-xl text-[var(--on-surface)]">No active projects</h3>
                        <p className="text-[14px] font-['DM_Sans'] max-w-sm mb-6">You haven't created any research projects yet. Start your first impact-focused initiative.</p>
                        <button onClick={() => navigate('/project/new')} className="bg-[var(--primary)] text-white px-6 py-3 rounded-xl font-bold active:scale-95 transition-transform">Create First Project</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                        <AnimatePresence>
                            {projects.map((project, i) => {
                                const projectId = getProjectId(project);
                                const isExpanded = expandedProjectId === projectId;
                                const firstSdg = Object.keys(project.sdg_mapping)[0] || '1';
                                
                                return (
                                    <motion.div
                                        key={projectId}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={`premium-card bg-white border border-[rgba(212,201,168,0.3)] ring-1 ring-white shadow-sm hover:shadow-xl rounded-[28px] flex flex-col justify-between overflow-hidden transition-all duration-300 ${isExpanded ? 'ring-2 ring-[var(--primary)]/30 border-[var(--primary)]/40' : ''}`}
                                    >
                                        <div className="p-8">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-3 py-1 bg-[var(--sdg-${firstSdg})] text-white text-[12px] font-['DM_Mono'] font-medium rounded-full uppercase`}>
                                                        GOAL {firstSdg}
                                                    </span>
                                                    
                                                    {/* Status Dropdown */}
                                                    <div className="relative group">
                                                        <span className={`px-3 py-1 text-[11px] font-['DM_Mono'] font-bold rounded-full border uppercase cursor-pointer transition-colors ${
                                                            project.status === 'Completed' ? 'bg-[var(--accent-light)] text-[var(--primary)] border-[var(--primary)]/10 hover:bg-[var(--primary)]/10' : 
                                                            project.status === 'Delayed' ? 'bg-[var(--error-container)] text-[var(--error)] border-[var(--error)]/10 hover:bg-[var(--error)]/10' : 
                                                            'bg-[var(--blue-light)] text-[var(--blue)] border-[var(--blue)]/10 hover:bg-[var(--blue)]/10'
                                                        }`}>
                                                            {project.status || 'Active'}
                                                        </span>
                                                        <div className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-xl border border-[var(--sand)] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto z-50 min-w-[120px] transition-all overflow-hidden">
                                                            {['On Track', 'Delayed', 'Completed'].map(st => (
                                                                <button 
                                                                    key={st}
                                                                    onClick={() => handleStatusChange(projectId, st)}
                                                                    className="w-full text-left px-4 py-2 text-[12px] font-['DM_Sans'] text-[var(--ink)] hover:bg-[var(--surface-container)] transition-colors"
                                                                >
                                                                    {st}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <button 
                                                    onClick={() => handleDelete(projectId)}
                                                    disabled={deletingId === projectId}
                                                    className="text-[var(--on-surface-variant)] hover:text-red-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </div>
                                            
                                            <h4 className="font-['Syne'] text-[24px] font-bold text-[var(--on-surface)] mb-3 leading-tight">{project.title}</h4>
                                            <p className="font-['DM_Sans'] text-[16px] text-[var(--on-surface-variant)] mb-6 line-clamp-2">
                                                {project.problem_statement}
                                            </p>
                                        </div>
                                        
                                        <div className="px-8 pb-8 space-y-4">
                                            <div className="flex gap-3">
                                                <button 
                                                    className="flex-1 bg-[var(--primary)] text-white px-5 py-3 rounded-xl text-[14px] font-bold font-['DM_Sans'] active:scale-95 transition-transform text-center"
                                                    onClick={() => navigate(`/project/${projectId}/workspace`)}
                                                >
                                                    Open Workspace
                                                </button>
                                                <button 
                                                    className="flex-1 bg-[var(--surface)] border border-[var(--sand)] text-[var(--on-surface)] px-5 py-3 rounded-xl text-[14px] font-bold font-['DM_Sans'] hover:bg-white active:scale-95 transition-all text-center"
                                                    onClick={() => setExpandedProjectId(isExpanded ? null : projectId)}
                                                >
                                                    {isExpanded ? 'Cancel Setup' : 'Assign Team'}
                                                </button>
                                            </div>
                                            
                                            <div className="flex items-center justify-between pt-6 border-t border-[var(--sand)]/30">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[12px] font-['DM_Sans'] text-[var(--on-surface-variant)] font-medium">Team:</span>
                                                    <span className="text-[14px] font-['DM_Sans'] font-bold text-[var(--on-surface)]">{project.team ? project.team.name : 'Unassigned'}</span>
                                                </div>
                                                <div className="flex -space-x-3">
                                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-[var(--surface-dim)] flex items-center justify-center text-[10px] font-bold text-[var(--on-surface)]">
                                                        +{project.team?.member_ids?.length || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expandable Assignment Area */}
                                        {isExpanded && (
                                            <motion.div 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="px-8 pb-8 bg-[var(--surface)]/30 border-t border-[var(--sand)]/20"
                                            >
                                                <div className="pt-6 space-y-4">
                                                    {assignError && (
                                                        <div className="text-[12px] text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 font-['DM_Sans']">
                                                            {assignError}
                                                        </div>
                                                    )}

                                                    <div className="space-y-1.5">
                                                        <label className="font-['DM_Mono'] text-[10px] uppercase text-[var(--on-surface-variant)] font-bold tracking-wider ml-1">Team Name</label>
                                                        <input
                                                            type="text"
                                                            value={getAssignmentState(projectId).team_name}
                                                            onChange={(e) => updateAssignmentState(projectId, { team_name: e.target.value })}
                                                            placeholder="e.g. GreenTech Alpha"
                                                            className="w-full px-4 py-3 bg-white border border-[var(--sand)] rounded-xl text-[14px] font-['DM_Sans'] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none"
                                                        />
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <label className="font-['DM_Mono'] text-[10px] uppercase text-[var(--on-surface-variant)] font-bold tracking-wider ml-1">Team Leader</label>
                                                        <select
                                                            className="w-full px-4 py-3 bg-white border border-[var(--sand)] rounded-xl text-[14px] font-['DM_Sans'] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none appearance-none cursor-pointer"
                                                            value={getAssignmentState(projectId).leader_id}
                                                            onChange={(e) => updateAssignmentState(projectId, { leader_id: e.target.value })}
                                                        >
                                                            <option value="">Select student</option>
                                                            {students
                                                                .filter(s => !s.is_assigned || String(s.assigned_project_id) === String(projectId))
                                                                .map((s) => (
                                                                    <option key={s.id} value={s.id}>{s.full_name}</option>
                                                                ))}
                                                        </select>
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <label className="font-['DM_Mono'] text-[10px] uppercase text-[var(--on-surface-variant)] font-bold tracking-wider ml-1">Additional Members</label>
                                                        <select
                                                            className="w-full px-4 py-3 bg-white border border-[var(--sand)] rounded-xl text-[14px] font-['DM_Sans'] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none cursor-pointer min-h-[120px]"
                                                            multiple
                                                            value={getAssignmentState(projectId).member_ids}
                                                            onChange={(e) => handleMembersChange(projectId, e)}
                                                        >
                                                            {students
                                                                .filter(s => !s.is_assigned || String(s.assigned_project_id) === String(projectId))
                                                                .map((s) => (
                                                                    <option key={s.id} value={s.id}>{s.full_name}</option>
                                                                ))}
                                                        </select>
                                                        <p className="text-[10px] text-[var(--text-muted)] italic font-['DM_Sans'] ml-1">Hold Ctrl/Cmd to multi-select</p>
                                                    </div>

                                                    <button 
                                                        className={`w-full py-3 rounded-xl font-['DM_Sans'] font-bold text-[14px] transition-all flex justify-center items-center gap-2 ${
                                                            !getAssignmentState(projectId).leader_id || assigning 
                                                            ? 'bg-[var(--surface-dim)] text-[var(--text-muted)] cursor-not-allowed' 
                                                            : 'bg-[var(--on-surface)] text-white hover:shadow-lg active:scale-95'
                                                        }`}
                                                        disabled={!getAssignmentState(projectId).leader_id || assigning}
                                                        onClick={() => handleAssign(projectId)}
                                                    >
                                                        {assigning ? 'Initializing...' : 'Initialize Team ⚡'}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </main>
        </MainLayout>
    );
}
