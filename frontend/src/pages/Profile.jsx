import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../api/users';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function Profile() {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        full_name: '',
        department: '',
        designation: '',
        roll_number: ''
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setEditData({
                full_name: user.full_name || '',
                department: (user.role === 'FACULTY' ? user.faculty_profile?.department : user.student_profile?.department) || '',
                designation: user.faculty_profile?.designation || '',
                roll_number: user.student_profile?.roll_number || ''
            });
            setLoading(false);
        }
    }, [user]);

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            const updatedUser = await updateProfile(editData);
            setUser(updatedUser);
            setIsEditing(false);
        } catch (err) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <MainLayout>
            <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div className="w-8 h-8 border-[3px] border-[var(--surface2)] border-t-[var(--ink)] rounded-full animate-spin"></div>
                <p className="text-[0.8rem] font-mono text-[var(--text-muted)] uppercase tracking-widest">Loading Identity...</p>
            </div>
        </MainLayout>
    );

    const isFaculty = user.role === 'FACULTY';
    const profileData = isFaculty ? user.faculty_profile : user.student_profile;

    return (
        <MainLayout>
            <div className="max-w-[1000px] mx-auto px-10 py-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                    
                    {/* Left Column: Identity Card */}
                    <div className="md:col-span-4 space-y-8">
                        <Card className="p-8 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-24 bg-[var(--ink)]">
                                <img 
                                    src="/sdg_abstract_gradient_1777062903268.png" 
                                    className="w-full h-full object-cover opacity-30"
                                    alt="Header"
                                />
                            </div>
                            <div className="relative z-10 mt-8 mb-6">
                                <div className="w-24 h-24 rounded-full bg-white border-4 border-[var(--cream)] mx-auto flex items-center justify-center text-3xl shadow-xl">
                                    {user.full_name?.charAt(0) || 'U'}
                                </div>
                            </div>
                            <h2 className="font-['Syne'] text-[1.5rem] font-bold text-[var(--ink)] tracking-tight mb-1">{user.full_name}</h2>
                            <p className="text-[0.8rem] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-6">{user.role}</p>
                            
                            <div className="space-y-4 pt-6 border-t border-[var(--surface2)]">
                                <div className="flex justify-between items-center text-[0.75rem]">
                                    <span className="text-[var(--text-muted)] font-light">Department</span>
                                    <span className="font-bold text-[var(--ink)]">{profileData?.department || 'General Research'}</span>
                                </div>
                                <div className="flex justify-between items-center text-[0.75rem]">
                                    <span className="text-[var(--text-muted)] font-light">Status</span>
                                    <Badge variant="success">Verified Researcher</Badge>
                                </div>
                            </div>

                            <Button variant="secondary" className="w-full mt-8 text-[0.75rem]" onClick={() => setIsEditing(true)}>Edit Identity ✎</Button>
                        </Card>

                        <div className="p-6 bg-[var(--accent-light)] rounded-[24px] border border-[rgba(26,107,60,0.1)]">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[1.2rem]">🏆</span>
                                <span className="text-[0.7rem] font-mono font-bold uppercase tracking-[0.1em] text-[var(--accent)]">Impact Achievements</span>
                            </div>
                            <p className="text-[0.75rem] text-[var(--accent)] font-light italic leading-relaxed">
                                You are in the top 5% of contributors this semester. Keep aligning your research with the 2030 Agenda!
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Details & Expertise */}
                    <div className="md:col-span-8 space-y-10">
                        <div>
                            <div className="section-label flex items-center gap-2 mb-6">
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent2)]"></div>
                                <span className="text-[0.7rem] font-mono text-[var(--text-muted)] uppercase tracking-[0.15em] font-bold">Academic Portfolio</span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Card className="p-6 bg-white/50 border-none shadow-sm">
                                    <div className="text-[0.6rem] font-mono uppercase tracking-widest text-[var(--text-muted)] mb-2">Research Domain</div>
                                    <div className="text-[0.95rem] font-medium text-[var(--ink)]">Sustainable Systems & AI Integration</div>
                                </Card>
                                <Card className="p-6 bg-white/50 border-none shadow-sm">
                                    <div className="text-[0.6rem] font-mono uppercase tracking-widest text-[var(--text-muted)] mb-2">Academic Standing</div>
                                    <div className="text-[0.95rem] font-medium text-[var(--ink)]">
                                        {isFaculty ? (profileData?.designation || 'Faculty Lead') : (profileData?.year || 'Research Student')}
                                    </div>
                                </Card>
                            </div>
                        </div>

                        <div>
                            <div className="section-label flex items-center gap-2 mb-6">
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--blue)]"></div>
                                <span className="text-[0.7rem] font-mono text-[var(--text-muted)] uppercase tracking-[0.15em] font-bold">Technical Expertise</span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {(isFaculty ? (profileData?.interests || ['Climate Research']) : (profileData?.skills || ['SDG Mapping'])).map((skill, i) => (
                                    <Badge key={i} className="px-4 py-2 text-[0.75rem] bg-white shadow-sm border-[rgba(180,168,130,0.2)]">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="section-label flex items-center gap-2 mb-6">
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--amber)]"></div>
                                <span className="text-[0.7rem] font-mono text-[var(--text-muted)] uppercase tracking-[0.15em] font-bold">Contribution History</span>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { title: 'Project Initialization', date: 'Oct 12, 2024', status: 'Completed' },
                                    { title: 'Literature Intelligence Audit', date: 'Oct 24, 2024', status: 'Active' },
                                    { title: 'SDG Mapping Validation', date: 'Nov 02, 2024', status: 'Pending' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-5 bg-[var(--surface)] rounded-[18px] group hover:bg-white hover:shadow-md transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">🎯</div>
                                            <div>
                                                <div className="text-[0.85rem] font-bold text-[var(--ink)]">{item.title}</div>
                                                <div className="text-[0.65rem] font-mono text-[var(--text-muted)] uppercase tracking-wider">{item.date}</div>
                                            </div>
                                        </div>
                                        <Badge variant={item.status === 'Completed' ? 'success' : 'info'}>{item.status}</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[var(--ink)]/40 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="w-full max-w-[500px] bg-white rounded-[32px] p-10 shadow-2xl overflow-hidden"
                        >
                            <h3 className="font-['Syne'] text-[1.8rem] font-bold text-[var(--ink)] mb-8">Update Identity</h3>
                            
                            {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-xs">{error}</div>}

                            <div className="space-y-6">
                                <div>
                                    <label className="label-field">Full Name</label>
                                    <input 
                                        type="text" 
                                        className="input-field" 
                                        value={editData.full_name}
                                        onChange={(e) => setEditData({...editData, full_name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="label-field">Department</label>
                                    <input 
                                        type="text" 
                                        className="input-field" 
                                        value={editData.department}
                                        onChange={(e) => setEditData({...editData, department: e.target.value})}
                                    />
                                </div>
                                {isFaculty ? (
                                    <div>
                                        <label className="label-field">Designation</label>
                                        <input 
                                            type="text" 
                                            className="input-field" 
                                            value={editData.designation}
                                            onChange={(e) => setEditData({...editData, designation: e.target.value})}
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <label className="label-field">Roll Number</label>
                                        <input 
                                            type="text" 
                                            className="input-field" 
                                            value={editData.roll_number}
                                            onChange={(e) => setEditData({...editData, roll_number: e.target.value})}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4 mt-10">
                                <Button variant="secondary" className="flex-1" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button variant="primary" className="flex-1" onClick={handleSave} isLoading={saving}>Save Changes</Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </MainLayout>
    );
}
