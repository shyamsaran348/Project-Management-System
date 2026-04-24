import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getMyProjectsView } from '../api/projects';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export default function StudentDashboard() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await getMyProjectsView();
            setProjects(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold">Assigned Projects</h2>
                <p className="text-sm text-gray-500">Projects you are actively contributing to</p>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">You have not been assigned to any projects yet.</p>
                    <p className="text-xs text-gray-400 mt-1">Please contact your faculty advisor for project assignment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {projects.map(project => {
                            const projectId = project.id;
                            const facultyName = project.faculty_name || project.faculty_id || 'N/A';
                            
                            return (
                                <motion.div
                                    key={projectId}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <Card className="h-full flex flex-col p-6 border-t-4 border-t-gray-900" hover={true} onClick={() => navigate(`/project/${projectId}/workspace`)}>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-4">
                                                <Badge variant="sdg-3">
                                                    Active Member
                                                </Badge>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                    ID: {projectId.slice(-4)}
                                                </span>
                                            </div>

                                            <h3 className="text-lg font-bold mb-4 line-clamp-2">{project.title}</h3>
                                            
                                            <div className="space-y-3 mb-6">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-500">Faculty:</span>
                                                    <span className="text-xs font-semibold">{facultyName}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {Object.values(project.sdg_mapping).map((sdg, idx) => (
                                                        <span key={idx} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-gray-100 rounded text-gray-600">
                                                            {sdg}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <Button 
                                            variant="secondary" 
                                            className="w-full !py-2 !text-xs mt-auto"
                                        >
                                            Enter Workspace
                                        </Button>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
