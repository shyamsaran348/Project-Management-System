import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getMyProjects, assignStudents, deleteProject } from '../api/projects';
import { getStudents } from '../api/users';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';

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

    const activeProjectsCount = projects.filter(p => p.status !== 'Completed').length;

    if (loading) return (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
    );

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

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">Active Projects</h2>
                    <p className="text-sm text-gray-500">{activeProjectsCount} of 5 active slots used</p>
                </div>
                {activeProjectsCount < 5 && (
                    <Button onClick={() => navigate('/project/new')}>
                        Create New Project
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {projects.map(project => {
                        const projectId = getProjectId(project);
                        const isExpanded = expandedProjectId === projectId;
                        
                        return (
                            <motion.div
                                key={projectId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <Card className="h-full flex flex-col p-6 border-t-4 border-t-gray-900" hover={!isExpanded}>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <Badge variant={`sdg-${Object.keys(project.sdg_mapping)[0] || '1'}`}>
                                                {project.status}
                                            </Badge>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(projectId);
                                                    }}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                                                    disabled={deletingId === projectId}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold mb-2 line-clamp-1">{project.title}</h3>
                                        
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {Object.values(project.sdg_mapping).map((sdg, idx) => (
                                                <span key={idx} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-gray-100 rounded text-gray-600">
                                                    {sdg}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3 mt-auto">
                                        <Button 
                                            variant="primary" 
                                            className="w-full !py-2 !text-xs"
                                            onClick={() => navigate(`/project/${projectId}/workspace`)}
                                        >
                                            Open Workspace
                                        </Button>
                                        <Button 
                                            variant="secondary" 
                                            className="w-full !py-2 !text-xs"
                                            onClick={() => setExpandedProjectId(isExpanded ? null : projectId)}
                                        >
                                            {isExpanded ? 'Cancel' : 'Assign Team'}
                                        </Button>
                                    </div>

                                    {isExpanded && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mt-6 pt-6 border-t border-gray-100 space-y-4"
                                        >
                                            {assignError && (
                                                <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                                                    {assignError}
                                                </div>
                                            )}

                                            <Input
                                                label="Team Name"
                                                className="!mb-0"
                                                value={getAssignmentState(projectId).team_name}
                                                onChange={(e) => updateAssignmentState(projectId, { team_name: e.target.value })}
                                                placeholder="e.g. Innovators A"
                                            />

                                            <div className="form-group !mb-0">
                                                <label className="form-label">Team Leader</label>
                                                <select
                                                    className="form-control"
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

                                            <div className="form-group !mb-0">
                                                <label className="form-label">Members</label>
                                                <select
                                                    className="form-control"
                                                    multiple
                                                    value={getAssignmentState(projectId).member_ids}
                                                    onChange={(e) => handleMembersChange(projectId, e)}
                                                    style={{ minHeight: '100px' }}
                                                >
                                                    {students
                                                        .filter(s => !s.is_assigned || String(s.assigned_project_id) === String(projectId))
                                                        .map((s) => (
                                                            <option key={s.id} value={s.id}>{s.full_name}</option>
                                                        ))}
                                                </select>
                                            </div>

                                            <Button 
                                                className="w-full" 
                                                isLoading={assigning}
                                                disabled={!getAssignmentState(projectId).leader_id}
                                                onClick={() => handleAssign(projectId)}
                                            >
                                                Confirm Team
                                            </Button>
                                        </motion.div>
                                    )}
                                </Card>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {projects.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No projects found. Start by creating one!</p>
                    <Button variant="secondary" className="mt-4" onClick={() => navigate('/project/new')}>
                        Create First Project
                    </Button>
                </div>
            )}
        </div>
    );
}
