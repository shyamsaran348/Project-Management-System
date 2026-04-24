import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    createProjectTask,
    getProjectWorkspace,
    updateProjectTask,
    getProjectChat,
    postProjectChat,
    queryRagAnswer,
    listLiteratureDocuments,
    uploadLiteratureDocument,
    deleteLiteratureDocument,
    downloadLiteratureDocument,
    uploadAttachment,
    deleteAttachment,
    downloadAttachment,
} from '../api/projects';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';

const BOARD_COLUMNS = [
    { key: 'TODO', label: 'To Do', color: 'gray' },
    { key: 'IN_PROGRESS', label: 'In Progress', color: 'blue' },
    { key: 'DONE', label: 'Done', color: 'green' }
];

export default function ProjectWorkspace() {
    const { projectId } = useParams();
    const { user } = useAuth();
    const [workspace, setWorkspace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [chatText, setChatText] = useState('');
    const [chatSending, setChatSending] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [ragQuery, setRagQuery] = useState('');
    const [ragAnswer, setRagAnswer] = useState('');
    const [ragLoading, setRagLoading] = useState(false);
    const [ragDocs, setRagDocs] = useState([]);
    const [ragUploadLoading, setRagUploadLoading] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        status: 'TODO'
    });
    const [attachState, setAttachState] = useState({});
    const fileInputRefs = useRef({});
    const [dragOverCol, setDragOverCol] = useState(null);

    useEffect(() => {
        loadWorkspace();
    }, [projectId]);

    useEffect(() => {
        let intervalId;
        const loadChat = async () => {
            try {
                const data = await getProjectChat(projectId);
                setChatMessages(data);
            } catch {
                // Ignore transient errors
            }
        };
        loadChat();
        intervalId = setInterval(loadChat, 5000);
        return () => clearInterval(intervalId);
    }, [projectId]);

    useEffect(() => {
        const loadLiteratureDocs = async () => {
            try {
                const docs = await listLiteratureDocuments(projectId);
                setRagDocs(docs);
            } catch {
                setRagDocs([]);
            }
        };
        loadLiteratureDocs();
    }, [projectId]);

    const loadWorkspace = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getProjectWorkspace(projectId);
            setWorkspace(data);
        } catch (err) {
            setError(err.message || 'Failed to load workspace');
        } finally {
            setLoading(false);
        }
    };

    const groupedTasks = useMemo(() => {
        const groups = { TODO: [], IN_PROGRESS: [], DONE: [] };
        (workspace?.tasks || []).forEach((task) => {
            if (groups[task.status]) groups[task.status].push(task);
        });
        return groups;
    }, [workspace]);

    const progress = useMemo(() => {
        const total = (workspace?.tasks || []).length;
        if (total === 0) return 0;
        const done = workspace.tasks.filter((t) => t.status === 'DONE').length;
        return Math.round((done / total) * 100);
    }, [workspace]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!newTask.title.trim()) return;
        setSaving(true);
        try {
            await createProjectTask(projectId, {
                title: newTask.title.trim(),
                description: newTask.description.trim(),
                status: newTask.status
            });
            setNewTask({ title: '', description: '', status: 'TODO' });
            await loadWorkspace();
        } catch (err) {
            setError(err.message || 'Failed to create task');
        } finally {
            setSaving(false);
        }
    };

    const handleMoveTask = async (taskId, status) => {
        try {
            const updatedTask = await updateProjectTask(projectId, taskId, { status });
            setWorkspace((prev) => ({
                ...prev,
                tasks: prev.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
            }));
        } catch (err) {
            setError(err.message || 'Failed to move task');
        }
    };

    const handleUpload = async (taskId, file) => {
        if (!file) return;
        setAttachState((prev) => ({ ...prev, [taskId]: { uploading: true, error: '' } }));
        try {
            const newAtt = await uploadAttachment(projectId, taskId, file);
            setWorkspace((prev) => ({
                ...prev,
                tasks: prev.tasks.map((t) =>
                    t.id === taskId
                        ? { ...t, attachments: [...(t.attachments || []), newAtt] }
                        : t
                ),
            }));
            setAttachState((prev) => ({ ...prev, [taskId]: { uploading: false, error: '' } }));
        } catch (err) {
            setAttachState((prev) => ({ ...prev, [taskId]: { uploading: false, error: err.message } }));
        }
    };

    const handleDeleteAttachment = async (taskId, attachmentId) => {
        try {
            await deleteAttachment(projectId, taskId, attachmentId);
            setWorkspace((prev) => ({
                ...prev,
                tasks: prev.tasks.map((t) =>
                    t.id === taskId
                        ? { ...t, attachments: (t.attachments || []).filter((a) => a.id !== attachmentId) }
                        : t
                ),
            }));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const message = chatText.trim();
        if (!message) return;
        setChatSending(true);
        try {
            const saved = await postProjectChat(projectId, { message });
            setChatMessages((prev) => [...prev, saved]);
            setChatText('');
        } catch (err) {
            setError(err.message);
        } finally {
            setChatSending(false);
        }
    };

    const handleAskRag = async (e) => {
        e.preventDefault();
        if (!ragQuery.trim()) return;
        setRagLoading(true);
        setRagAnswer('');
        try {
            const answer = await queryRagAnswer(projectId, ragQuery.trim(), 4);
            setRagAnswer(answer);
        } catch (err) {
            setError(err.message);
        } finally {
            setRagLoading(false);
        }
    };

    const handleLiteratureUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setRagUploadLoading(true);
        try {
            await uploadLiteratureDocument(projectId, file);
            const docs = await listLiteratureDocuments(projectId);
            setRagDocs(docs);
        } catch (err) {
            setError(err.message);
        } finally {
            setRagUploadLoading(false);
            e.target.value = '';
        }
    };

    if (loading) return (
        <MainLayout>
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        </MainLayout>
    );

    if (!workspace) return <MainLayout><div className="container py-20 text-center">Workspace not found</div></MainLayout>;

    return (
        <MainLayout>
            <div className="container py-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-4">
                            <Badge variant={`sdg-${Object.keys(workspace.sdg_mapping)[0] || '1'}`}>
                                {workspace.status}
                            </Badge>
                            <span className="text-xs text-gray-400 font-mono">PROJECT_ID: {projectId.slice(-6).toUpperCase()}</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight mb-4">{workspace.title}</h1>
                        <p className="text-gray-500 leading-relaxed">{workspace.problem_statement}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Overall Progress</p>
                            <div className="flex items-center gap-3">
                                <div className="w-32 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-gray-900 dark:bg-white transition-all duration-500" style={{ width: `${progress}%` }} />
                                </div>
                                <span className="text-sm font-bold">{progress}%</span>
                            </div>
                        </div>
                        <Button variant="secondary" onClick={() => setIsChatOpen(true)} className="relative">
                            Team Chat
                            {chatMessages.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white" />
                            )}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* AI Section */}
                        <Card className="p-8">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded flex items-center justify-center text-white dark:text-gray-900">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                                <h3 className="text-lg font-bold">Literature Intelligence</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Knowledge Base</p>
                                    <div className="space-y-2">
                                        {ragDocs.map(doc => (
                                            <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg group">
                                                <div className="flex items-center gap-3">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                    <span className="text-sm font-medium truncate max-w-[150px]">{doc.filename}</span>
                                                </div>
                                                <button 
                                                    onClick={() => deleteLiteratureDocument(projectId, doc.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                        ))}
                                        <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl hover:border-gray-900 dark:hover:border-white transition-colors cursor-pointer">
                                            <input type="file" className="hidden" onChange={handleLiteratureUpload} accept=".pdf,.txt,.md" disabled={ragUploadLoading} />
                                            <span className="text-xs font-bold text-gray-400">{ragUploadLoading ? 'Indexing...' : '+ Upload Source'}</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Ask Anything</p>
                                    <form onSubmit={handleAskRag} className="flex gap-2">
                                        <Input 
                                            placeholder="Synthesize insights..." 
                                            className="!mb-0" 
                                            value={ragQuery} 
                                            onChange={(e) => setRagQuery(e.target.value)} 
                                        />
                                        <Button type="submit" isLoading={ragLoading} disabled={ragDocs.length === 0}>
                                            Ask
                                        </Button>
                                    </form>
                                    {ragAnswer && (
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-sm leading-relaxed text-gray-600 dark:text-gray-400 animate-in fade-in slide-in-from-top-2">
                                            {ragAnswer}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Kanban Board */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                            {BOARD_COLUMNS.map(col => (
                                <div key={col.key} className="flex flex-col h-full min-h-[400px]">
                                    <div className="flex items-center justify-between mb-4 px-1">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full bg-${col.color}-500`} />
                                            <h4 className="text-sm font-bold uppercase tracking-widest">{col.label}</h4>
                                        </div>
                                        <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                                            {groupedTasks[col.key].length}
                                        </span>
                                    </div>

                                    <div 
                                        className={`flex-1 space-y-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 transition-colors ${dragOverCol === col.key ? 'bg-gray-200/50 dark:bg-gray-800' : ''}`}
                                        onDragOver={(e) => { e.preventDefault(); setDragOverCol(col.key); }}
                                        onDragLeave={() => setDragOverCol(null)}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setDragOverCol(null);
                                            const taskId = e.dataTransfer.getData("taskId");
                                            if (taskId) handleMoveTask(taskId, col.key);
                                        }}
                                    >
                                        <AnimatePresence>
                                            {groupedTasks[col.key].map(task => (
                                                <motion.div
                                                    key={task.id}
                                                    layout
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    draggable
                                                    onDragStart={(e) => e.dataTransfer.setData("taskId", task.id)}
                                                    className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm cursor-grab active:cursor-grabbing group"
                                                >
                                                    <h5 className="text-sm font-bold mb-1">{task.title}</h5>
                                                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{task.description}</p>
                                                    
                                                    <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-700">
                                                        <span className="text-[10px] text-gray-400 font-bold uppercase">@{task.created_by?.split(' ')[0]}</span>
                                                        <div className="flex gap-1">
                                                            {(task.attachments || []).length > 0 && (
                                                                <span className="text-[10px] text-blue-600 font-bold">📎 {task.attachments.length}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                        
                                        {col.key === 'TODO' && (
                                            <button 
                                                onClick={() => setNewTask(prev => ({ ...prev, status: 'TODO' }))}
                                                className="w-full py-3 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                            >
                                                + New Task
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:col-span-4 space-y-8">
                        <Card className="p-8">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Project Metadata</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 block mb-1 uppercase">Faculty Advisor</label>
                                    <p className="text-sm font-bold">{workspace.faculty_name || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 block mb-1 uppercase">Research Group</label>
                                    <p className="text-sm font-bold">{workspace.team_name || 'Individual Project'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 block mb-3 uppercase">Collaborators</label>
                                    <div className="flex flex-wrap gap-2">
                                        {(workspace.member_names || []).map((name, i) => (
                                            <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-[10px] font-bold">
                                                {name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                                    <label className="text-xs font-bold text-gray-400 block mb-3 uppercase">Create Quick Task</label>
                                    <form onSubmit={handleCreateTask} className="space-y-3">
                                        <Input 
                                            placeholder="Task title..." 
                                            className="!mb-0 !text-sm" 
                                            value={newTask.title} 
                                            onChange={(e) => setNewTask(p => ({ ...p, title: e.target.value }))}
                                            required
                                        />
                                        <Button type="submit" className="w-full !text-xs" isLoading={saving}>Add To Do</Button>
                                    </form>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Chat Drawer */}
            <AnimatePresence>
                {isChatOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsChatOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-[101] flex flex-col"
                        >
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                <h3 className="font-bold">Team Collaboration</h3>
                                <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {chatMessages.map((m, i) => {
                                    const isMine = String(m.sender_id) === String(user?.id);
                                    return (
                                        <div key={i} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{m.sender_name}</span>
                                            </div>
                                            <div className={`p-4 rounded-2xl text-sm max-w-[85%] ${isMine ? 'bg-gray-900 text-white rounded-tr-none' : 'bg-gray-100 dark:bg-gray-800 rounded-tl-none'}`}>
                                                {m.message}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-100 dark:border-gray-800 flex gap-2">
                                <Input 
                                    placeholder="Share an update..." 
                                    className="!mb-0" 
                                    value={chatText} 
                                    onChange={(e) => setChatText(e.target.value)}
                                />
                                <Button type="submit" isLoading={chatSending}>Send</Button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </MainLayout>
    );
}
