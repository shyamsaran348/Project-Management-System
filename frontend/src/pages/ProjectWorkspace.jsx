import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    createProjectTask,
    getProjectWorkspace,
    updateProjectTask,
    deleteProjectTask,
    getProjectChat,
    postProjectChat,
    queryRagAnswer,
    listLiteratureDocuments,
    uploadLiteratureDocument,
    deleteLiteratureDocument,
} from '../api/projects';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import { SkeletonCard } from '../components/ui/Skeleton';

const BOARD_COLUMNS = [
    { key: 'TODO', label: 'To Do', color: 'bg-[var(--on-surface-variant)]' },
    { key: 'IN_PROGRESS', label: 'In Progress', color: 'bg-[var(--secondary)]' },
    { key: 'DONE', label: 'Completed', color: 'bg-[var(--sdg-15)]' }
];

/**
 * Project Workspace Component
 * --------------------------
 * The primary collaborative environment for institutional researchers.
 * 
 * CORE MODULES:
 * 1. Research Kanban: High-fidelity task management with milestone tracking.
 * 2. Literature Intelligence (LIR): RAG-powered research paper assistant using Groq LLM.
 * 3. Real-time Project Pulse: WebSocket-integrated chat for team synchronization.
 * 4. Resource Allocation: Role-based task assignments with institutional guardrails.
 * 
 * DESIGN: Powered by the Stitch Design System (Glassmorphism & High-contrast neutrals).
 */

export default function ProjectWorkspace() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [workspace, setWorkspace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('Overview');

    // Tasks State
    const [newTask, setNewTask] = useState({ title: '', description: '', status: 'TODO' });
    const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
    const [savingTask, setSavingTask] = useState(false);
    const [dragOverCol, setDragOverCol] = useState(null);

    // Chat State
    const [chatMessages, setChatMessages] = useState([]);
    const [chatText, setChatText] = useState('');
    const [chatSending, setChatSending] = useState(false);
    const [typingUsers, setTypingUsers] = useState({});

    // Literature State
    const [ragDocs, setRagDocs] = useState([]);
    const [ragUploadLoading, setRagUploadLoading] = useState(false);
    const [ragQuery, setRagQuery] = useState('');
    const [ragAnswer, setRagAnswer] = useState('');
    const [ragLoading, setRagLoading] = useState(false);

    useEffect(() => {
        loadWorkspace();
        loadInitialChat();
        loadLiteratureDocs();
    }, [projectId]);

    useEffect(() => {
        let ws;
        const connectWs = () => {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `${protocol}//${window.location.hostname}:8000/projects/${projectId}/ws`;
            ws = new WebSocket(wsUrl);

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'new_message') {
                    setChatMessages(prev => {
                        if (prev.find(m => m.id === data.payload.id)) return prev;
                        return [...prev, data.payload];
                    });
                } else if (data.type === 'typing_update') {
                    setTypingUsers(prev => ({
                        ...prev,
                        [data.user_id]: data.is_typing ? data.user_name : null
                    }));
                }
            };
            ws.onclose = () => setTimeout(connectWs, 3000);
        };

        connectWs();
        return () => { if (ws) ws.close(); };
    }, [projectId]);

    const loadWorkspace = async () => {
        try {
            const data = await getProjectWorkspace(projectId);
            setWorkspace(data);
        } catch (err) {
            setError(err.message || 'Failed to load workspace');
        } finally {
            setLoading(false);
        }
    };

    const loadInitialChat = async () => {
        try {
            const data = await getProjectChat(projectId);
            setChatMessages(data);
        } catch (err) {
            console.error("Initial chat load failed", err);
        }
    };

    const loadLiteratureDocs = async () => {
        try {
            const docs = await listLiteratureDocuments(projectId);
            setRagDocs(docs);
        } catch {
            setRagDocs([]);
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
        setSavingTask(true);
        try {
            await createProjectTask(projectId, {
                title: newTask.title.trim(),
                description: newTask.description.trim(),
                status: newTask.status
            });
            setNewTask({ title: '', description: '', status: 'TODO' });
            setIsNewTaskOpen(false);
            toast.success('Task created successfully');
            await loadWorkspace();
        } catch (err) {
            toast.error(err.message || 'Failed to create task');
        } finally {
            setSavingTask(false);
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
            toast.error(err.message || 'Failed to move task');
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Delete this task?')) return;
        try {
            await deleteProjectTask(projectId, taskId);
            setWorkspace((prev) => ({
                ...prev,
                tasks: prev.tasks.filter((t) => t.id !== taskId)
            }));
        } catch (err) {
            toast.error(err.message || 'Failed to delete task');
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
            toast.error(err.message);
        } finally {
            setChatSending(false);
        }
    };

    const handleLiteratureUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setRagUploadLoading(true);
        try {
            await uploadLiteratureDocument(projectId, file);
            toast.success('Document indexed');
            await loadLiteratureDocs();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setRagUploadLoading(false);
            e.target.value = '';
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
            toast.error(err.message);
        } finally {
            setRagLoading(false);
        }
    };

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

    if (!workspace) return <MainLayout><div className="pt-24 text-center">Workspace not found</div></MainLayout>;

    const firstSdg = Object.keys(workspace.sdg_mapping)[0] || '1';

    return (
        <MainLayout>
        <main className="lg:ml-64 pt-[64px] min-h-[calc(100vh-64px)] flex flex-col bg-[var(--cream)]">
                {/* Workspace Header & Tab Navigation */}
                <div className="px-6 pt-8 pb-4 bg-[var(--cream)]/80 backdrop-blur-sm sticky top-[64px] z-40 max-w-[1280px] w-full mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                        <div>
                            <nav className="flex items-center gap-2 text-[var(--on-surface-variant)] text-[14px] font-['DM_Sans'] mb-1">
                                <span className="cursor-pointer hover:text-[var(--primary)]" onClick={() => navigate(-1)}>Projects</span>
                                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                                <span className="truncate max-w-[200px]">{workspace.title}</span>
                            </nav>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 bg-[var(--sdg-${firstSdg})] rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0`}>
                                    <span className="material-symbols-outlined text-[32px]">eco</span>
                                </div>
                                <div>
                                    <h1 className="font-['Syne'] text-[32px] md:text-[40px] font-bold text-[var(--primary)] tracking-tight leading-tight truncate">{workspace.title}</h1>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`px-2 py-0.5 bg-[var(--sdg-${firstSdg})]/10 text-[var(--sdg-${firstSdg})] rounded-md text-[12px] font-['DM_Mono'] font-bold`}>GOAL {firstSdg}</span>
                                        <span className="text-[14px] font-['DM_Sans'] text-[var(--on-surface-variant)]">• {workspace.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {activeTab === 'Tasks' && (
                            <button 
                                onClick={() => setIsNewTaskOpen(true)}
                                className="bg-[var(--primary)] text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 transition-all w-full md:w-auto font-['DM_Sans']"
                            >
                                <span className="material-symbols-outlined">add</span>
                                Add Task
                            </button>
                        )}
                    </div>
                    
                    {/* Tabs */}
                    <nav className="flex space-x-8 border-b border-[var(--sand)]/30 overflow-x-auto custom-scrollbar">
                        {['Overview', 'Tasks', 'Chat', 'Literature'].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 font-['DM_Sans'] text-[16px] whitespace-nowrap transition-colors ${activeTab === tab ? 'text-[var(--primary)] font-bold border-b-2 border-[var(--primary)]' : 'text-[var(--on-surface-variant)] font-medium hover:text-[var(--primary)]'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Contents */}
                <div className="flex-1 w-full max-w-[1280px] mx-auto px-6 py-6">
                    <AnimatePresence mode="wait">
                        
                        {/* OVERVIEW TAB */}
                        {activeTab === 'Overview' && (
                            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-12 gap-6">
                                <div className="col-span-12 lg:col-span-8 space-y-6">
                                    {/* Problem Statement */}
                                    <div className="bg-white rounded-[28px] p-10 border border-[var(--sand)] shadow-sm hover:shadow-md transition-all">
                                        <div className="flex items-center gap-3 mb-6">
                                            <span className="material-symbols-outlined text-[var(--primary)]">description</span>
                                            <h2 className="font-['Syne'] text-[24px] font-bold">Problem Statement</h2>
                                        </div>
                                        <p className="font-['DM_Sans'] text-[16px] text-[var(--text-mid)] leading-relaxed italic">
                                            "{workspace.problem_statement || 'No description provided for this initiative.'}"
                                        </p>
                                        <div className="mt-8 pt-8 border-t border-[var(--sand)]/30 flex flex-wrap gap-4">
                                            <div className="px-4 py-2 bg-[var(--surface)] rounded-xl">
                                                <p className="font-['DM_Mono'] text-[10px] text-[var(--on-surface-variant)] uppercase font-bold tracking-tighter">Team Name</p>
                                                <p className="font-['DM_Sans'] font-medium">{workspace.team_name || 'Unassigned'}</p>
                                            </div>
                                            <div className="px-4 py-2 bg-[var(--surface)] rounded-xl">
                                                <p className="font-['DM_Mono'] text-[10px] text-[var(--on-surface-variant)] uppercase font-bold tracking-tighter">Status</p>
                                                <p className="font-['DM_Sans'] font-medium">{workspace.status}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SDG Mapping */}
                                    <div className="bg-white rounded-[28px] p-10 border border-[var(--sand)] shadow-sm">
                                        <div className="flex items-center gap-3 mb-8">
                                            <span className="material-symbols-outlined text-[var(--primary)]">hub</span>
                                            <h2 className="font-['Syne'] text-[24px] font-bold">SDG Mapping</h2>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {Object.keys(workspace.sdg_mapping).map(id => (
                                                <div key={id} className={`p-6 bg-[var(--cream)]/50 border border-[var(--sdg-${id})]/20 rounded-2xl`}>
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className={`w-12 h-12 bg-[var(--sdg-${id})] rounded-xl flex items-center justify-center text-white`}>
                                                            <span className="material-symbols-outlined text-2xl">public</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className={`font-['DM_Mono'] text-[12px] text-[var(--sdg-${id})] font-bold`}>SDG {id}</span>
                                                        </div>
                                                    </div>
                                                    <h3 className="font-['DM_Sans'] font-bold text-lg mb-1">{workspace.sdg_mapping[id]}</h3>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-12 lg:col-span-4 space-y-6">
                                    {/* Project Stats */}
                                    <div className="bg-[var(--on-primary-fixed)] text-white rounded-[28px] p-8 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                                        <h2 className="font-['Syne'] text-[24px] font-bold mb-6 relative z-10">Project Pulse</h2>
                                        <div className="grid grid-cols-2 gap-4 relative z-10">
                                            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                                                <p className="text-[var(--primary-fixed-dim)] text-[12px] font-['DM_Mono'] mb-1">TOTAL TASKS</p>
                                                <p className="text-2xl font-bold font-['DM_Sans']">{workspace.tasks.length}</p>
                                            </div>
                                            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                                                <p className="text-[var(--primary-fixed-dim)] text-[12px] font-['DM_Mono'] mb-1">COMPLETION</p>
                                                <p className="text-2xl font-bold font-['DM_Sans']">{progress}%</p>
                                            </div>
                                            <div className="col-span-2 p-4 bg-white/10 rounded-2xl backdrop-blur-md flex items-center justify-between">
                                                <div>
                                                    <p className="text-[var(--primary-fixed-dim)] text-[12px] font-['DM_Mono'] mb-1">LITERATURE</p>
                                                    <p className="text-sm font-medium font-['DM_Sans']">{ragDocs.length} Docs Indexed</p>
                                                </div>
                                                <span className="material-symbols-outlined text-[var(--primary-fixed-dim)]">description</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* TASKS TAB */}
                        {activeTab === 'Tasks' && (
                            <motion.div key="tasks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                                {BOARD_COLUMNS.map(col => (
                                    <div key={col.key} className="bg-[var(--surface-alt)]/50 rounded-[32px] p-4 flex flex-col gap-4 min-h-[600px] border border-[var(--sand)]/10">
                                        <div className="flex items-center justify-between px-2 mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${col.color}`}></span>
                                                <h2 className="font-['Syne'] text-[16px] font-bold text-[var(--on-surface-variant)] uppercase tracking-widest">{col.label}</h2>
                                                <span className="bg-white/60 px-2 py-0.5 rounded-full font-['DM_Mono'] text-[12px] text-[var(--on-surface-variant)]">{groupedTasks[col.key].length}</span>
                                            </div>
                                        </div>

                                        <div 
                                            className={`flex-1 space-y-4 rounded-3xl transition-all duration-300 ${dragOverCol === col.key ? 'bg-[var(--primary)]/5' : ''}`}
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
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.9 }}
                                                        draggable
                                                        onDragStart={(e) => e.dataTransfer.setData("taskId", task.id)}
                                                        className={`bg-white rounded-[24px] p-6 shadow-sm border border-[rgba(212,201,168,0.3)] hover:border-[var(--primary)]/30 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group ${col.key === 'DONE' ? 'opacity-80' : ''}`}
                                                    >
                                                        <div className="flex justify-between items-start mb-3">
                                                            {col.key === 'DONE' ? (
                                                                <span className="bg-[var(--sdg-15)]/10 text-[var(--sdg-15)] px-3 py-1 rounded-full font-['DM_Mono'] text-[12px] flex items-center gap-1 font-bold">
                                                                    <span className="material-symbols-outlined text-[14px]">check_circle</span> FINISHED
                                                                </span>
                                                            ) : (
                                                                <span className="bg-[var(--surface)] text-[var(--on-surface-variant)] px-3 py-1 rounded-full font-['DM_Mono'] text-[12px] font-bold uppercase tracking-wider">
                                                                    TASK
                                                                </span>
                                                            )}
                                                            <button 
                                                                onClick={() => handleDeleteTask(task.id)}
                                                                className="text-[var(--on-surface-variant)] opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 hover:bg-red-50 p-1 rounded-lg"
                                                            >
                                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                                            </button>
                                                        </div>
                                                        <h3 className={`font-['Syne'] text-[18px] font-bold text-[var(--primary)] mb-2 tracking-tight ${col.key === 'DONE' ? 'line-through text-[var(--on-surface-variant)]' : ''}`}>{task.title}</h3>
                                                        <p className="font-['DM_Sans'] text-[14px] text-[var(--on-surface-variant)] leading-relaxed mb-4 line-clamp-3 font-light">{task.description}</p>
                                                        
                                                        <div className="flex items-center gap-4 pt-4 border-t border-[var(--sand)]/10">
                                                            <div className="ml-auto flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-[var(--surface)] flex items-center justify-center text-[10px] font-bold text-[var(--ink)] border border-[var(--sand)]">
                                                                    {task.created_by?.charAt(0)}
                                                                </div>
                                                                <span className="font-['DM_Mono'] text-[10px] uppercase text-[var(--on-surface-variant)] font-bold">{task.created_by?.split(' ')[0]}</span>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {/* CHAT TAB */}
                        {activeTab === 'Chat' && (
                            <motion.div key="chat" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="h-[calc(100vh-280px)] min-h-[500px] flex flex-col max-w-4xl mx-auto bg-white rounded-[32px] border border-[var(--sand)]/30 shadow-md overflow-hidden">
                                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                                    {chatMessages.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-[var(--on-surface-variant)]/50">
                                            <span className="material-symbols-outlined text-5xl mb-4 opacity-50">forum</span>
                                            <p className="font-['DM_Sans'] font-medium">No messages yet. Start the conversation!</p>
                                        </div>
                                    ) : (
                                        chatMessages.map((m, i) => {
                                            const isMine = String(m.sender_id) === String(user?.id);
                                            return (
                                                <div key={i} className={`flex items-end gap-3 max-w-[80%] ${isMine ? 'ml-auto justify-end' : ''}`}>
                                                    {!isMine && (
                                                        <div className="w-8 h-8 rounded-full bg-[var(--surface-dim)] flex-shrink-0 flex items-center justify-center text-[12px] font-bold border border-[var(--sand)]">
                                                            {m.sender_name?.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div className="space-y-1">
                                                        <div className={`flex items-center gap-2 px-1 ${isMine ? 'justify-end' : ''}`}>
                                                            {!isMine && <span className="font-bold text-[14px] font-['DM_Sans'] text-[var(--primary)]">{m.sender_name}</span>}
                                                        </div>
                                                        <div className={`p-4 rounded-[20px] shadow-sm text-[0.95rem] font-['DM_Sans'] leading-relaxed ring-1 ring-white/10 ${isMine ? 'bg-[var(--primary)] text-white rounded-br-[4px] shadow-lg shadow-[var(--primary)]/5' : 'bg-white border border-[rgba(212,201,168,0.3)] rounded-bl-[4px] text-[var(--ink)]'}`}>
                                                            <p className="font-light">{m.message}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                    
                                    {Object.entries(typingUsers).filter(([uid, name]) => name && uid !== String(user?.id)).map(([uid, name]) => (
                                        <div key={uid} className="flex items-center gap-2 px-11 py-2 opacity-60">
                                            <div className="flex gap-1">
                                                <span className="w-1.5 h-1.5 bg-[var(--sand-dark)] rounded-full animate-bounce"></span>
                                                <span className="w-1.5 h-1.5 bg-[var(--sand-dark)] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                                <span className="w-1.5 h-1.5 bg-[var(--sand-dark)] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                            </div>
                                            <p className="font-['DM_Sans'] text-[14px] italic">{name} is typing...</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 bg-[var(--surface-bright)] border-t border-[var(--sand)]/20">
                                    <form onSubmit={handleSendMessage} className="relative bg-white p-2 rounded-[28px] border border-[var(--sand)] shadow-sm flex items-center gap-2 focus-within:ring-4 focus-within:ring-[var(--primary)]/10 transition-all">
                                        <input 
                                            className="flex-1 bg-transparent border-none focus:ring-0 text-[16px] font-['DM_Sans'] px-4 placeholder:text-[var(--on-surface-variant)]/50 outline-none" 
                                            placeholder="Type a message..." 
                                            value={chatText}
                                            onChange={(e) => setChatText(e.target.value)}
                                        />
                                        <button type="submit" disabled={chatSending || !chatText.trim()} className="bg-[var(--primary)] text-white p-3 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md disabled:opacity-50 disabled:hover:scale-100">
                                            <span className="material-symbols-outlined">send</span>
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        )}

                        {/* LITERATURE TAB */}
                        {activeTab === 'Literature' && (
                            <motion.div key="literature" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-12 gap-6">
                                <div className="col-span-12 lg:col-span-7 xl:col-span-8 space-y-6">
                                    <label className="bg-white rounded-[24px] border-2 border-dashed border-[rgba(212,201,168,0.4)] p-12 shadow-sm hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all cursor-pointer group flex flex-col items-center justify-center text-center">
                                        <input type="file" className="hidden" onChange={handleLiteratureUpload} accept=".pdf,.txt,.md" disabled={ragUploadLoading} />
                                        <div className="w-20 h-20 bg-[var(--surface)] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-transform shadow-sm">
                                            {ragUploadLoading ? (
                                                <div className="w-8 h-8 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <span className="material-symbols-outlined text-[var(--primary)] text-4xl">cloud_upload</span>
                                            )}
                                        </div>
                                        <h3 className="font-['Syne'] text-[1.1rem] font-bold mb-2 text-[var(--ink)]">{ragUploadLoading ? 'Indexing Documents...' : 'Literature Integration'}</h3>
                                        <p className="font-['DM_Sans'] text-[var(--text-muted)] text-[0.85rem] max-w-[280px]">Drag research papers or technical reports to augment the project's knowledge base.</p>
                                    </label>

                                    <div className="bg-white rounded-[28px] shadow-sm border border-[var(--sand)]/20 overflow-hidden">
                                        <div className="px-8 py-6 border-b border-[var(--sand)]/10 flex justify-between items-center bg-[var(--surface-bright)]">
                                            <h2 className="font-['Syne'] text-[18px] font-bold text-[var(--on-surface)]">Indexed Documents</h2>
                                            <span className="bg-[var(--cream)] text-[var(--primary)] px-3 py-1 rounded-full font-['DM_Mono'] text-[10px] font-bold">{ragDocs.length} TOTAL</span>
                                        </div>
                                        <div className="overflow-x-auto max-h-[400px] overflow-y-auto custom-scrollbar">
                                            {ragDocs.length === 0 ? (
                                                <div className="p-8 text-center text-[var(--on-surface-variant)]/60 font-['DM_Sans'] italic">No documents indexed yet.</div>
                                            ) : (
                                                <table className="w-full text-left border-collapse">
                                                    <thead className="bg-[var(--surface)] text-[var(--on-surface-variant)] font-['DM_Mono'] text-[11px] uppercase tracking-wider sticky top-0">
                                                        <tr>
                                                            <th className="px-8 py-4">Filename</th>
                                                            <th className="px-8 py-4 text-right">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-[var(--sand)]/10">
                                                        {ragDocs.map(doc => (
                                                            <tr key={doc.id} className="hover:bg-[var(--cream)]/50 transition-colors group">
                                                                <td className="px-8 py-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="material-symbols-outlined text-[var(--sdg-16)]">description</span>
                                                                        <p className="font-bold text-[var(--on-background)] font-['DM_Sans'] text-[14px]">{doc.filename}</p>
                                                                    </div>
                                                                </td>
                                                                <td className="px-8 py-4 text-right">
                                                                    <button 
                                                                        onClick={() => deleteLiteratureDocument(projectId, doc.id)}
                                                                        className="p-2 hover:bg-white rounded-lg text-[var(--on-surface-variant)] hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                                                    >
                                                                        <span className="material-symbols-outlined">delete</span>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-12 lg:col-span-5 xl:col-span-4">
                                    <div className="bg-white rounded-[28px] shadow-sm border border-[var(--sand)]/20 flex flex-col h-[calc(100vh-250px)] min-h-[500px] overflow-hidden">
                                        <div className="px-6 py-5 bg-[var(--surface-bright)] flex items-center gap-3 border-b border-[var(--sand)]/10">
                                            <div className="w-10 h-10 bg-[var(--primary-container)] text-white rounded-full flex items-center justify-center">
                                                <span className="material-symbols-outlined">auto_awesome</span>
                                            </div>
                                            <div>
                                                <h2 className="font-['Syne'] text-[16px] font-bold text-[var(--on-background)]">AI Research Assistant</h2>
                                                <p className="text-[10px] font-['DM_Mono'] text-[var(--primary)] tracking-widest font-bold">{ragDocs.length > 0 ? 'KNOWLEDGE BASE ACTIVE' : 'NO KNOWLEDGE'}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1 p-8 overflow-y-auto space-y-8 custom-scrollbar bg-white/40">
                                            <div className="p-5 bg-white border border-[rgba(212,201,168,0.3)] rounded-[20px] shadow-sm">
                                                <p className="font-['DM_Sans'] text-[0.85rem] italic text-[var(--text-muted)] leading-relaxed">
                                                    Systems online. I have synthesized {ragDocs.length} documents into the local knowledge base. I can assist with citation extraction and thematic analysis.
                                                </p>
                                            </div>
                                            
                                            {ragAnswer && (
                                                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-[14px] text-[var(--primary)]">history_edu</span>
                                                        <span className="font-['DM_Mono'] text-[10px] text-[var(--on-surface-variant)] font-bold tracking-widest uppercase">Response Summary</span>
                                                    </div>
                                                    <div className="bg-white p-5 rounded-2xl border border-[var(--primary)]/20 shadow-sm font-['DM_Sans'] text-[14px] leading-relaxed">
                                                        <p>{ragAnswer}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4 border-t border-[var(--sand)]/10 bg-[var(--surface-bright)]">
                                            <form onSubmit={handleAskRag} className="relative">
                                                <textarea 
                                                    className="w-full bg-[var(--surface)] border border-[var(--sand)]/30 rounded-2xl p-4 text-[14px] font-['DM_Sans'] min-h-[100px] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all resize-none placeholder:text-[var(--on-surface-variant)]/50 outline-none" 
                                                    placeholder="What would you like to know about the literature?"
                                                    value={ragQuery}
                                                    onChange={(e) => setRagQuery(e.target.value)}
                                                />
                                                <button 
                                                    type="submit"
                                                    disabled={ragLoading || ragDocs.length === 0 || !ragQuery.trim()}
                                                    className="absolute bottom-3 right-3 bg-[var(--on-background)] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:scale-95 transition-transform shadow-md disabled:opacity-50 disabled:scale-100"
                                                >
                                                    <span className="font-['DM_Sans'] text-[12px]">{ragLoading ? 'Searching...' : 'Ask AI'}</span>
                                                    <span className="material-symbols-outlined text-[16px]">send</span>
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </main>

            {/* New Task Modal */}
            <AnimatePresence>
                {isNewTaskOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[var(--on-background)]/40 backdrop-blur-sm" onClick={() => setIsNewTaskOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-[32px] shadow-2xl p-8 max-w-md w-full border border-[var(--sand)]/20 z-10">
                            <h3 className="font-['Syne'] text-[24px] font-bold mb-6 text-[var(--on-surface)]">Create New Task</h3>
                            <form onSubmit={handleCreateTask} className="space-y-4">
                                <div>
                                    <label className="font-['DM_Mono'] text-[10px] uppercase text-[var(--on-surface-variant)] font-bold tracking-wider ml-1">Title</label>
                                    <input required className="w-full mt-1 px-4 py-3 bg-[var(--surface)] border-none rounded-xl text-[14px] font-['DM_Sans'] outline-none focus:ring-2 focus:ring-[var(--primary)]/20" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} placeholder="e.g. Conduct Survey" />
                                </div>
                                <div>
                                    <label className="font-['DM_Mono'] text-[10px] uppercase text-[var(--on-surface-variant)] font-bold tracking-wider ml-1">Description</label>
                                    <textarea className="w-full mt-1 px-4 py-3 bg-[var(--surface)] border-none rounded-xl text-[14px] font-['DM_Sans'] outline-none focus:ring-2 focus:ring-[var(--primary)]/20 min-h-[100px] resize-none" value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} placeholder="Task details..." />
                                </div>
                                <div>
                                    <label className="font-['DM_Mono'] text-[10px] uppercase text-[var(--on-surface-variant)] font-bold tracking-wider ml-1">Status</label>
                                    <select className="w-full mt-1 px-4 py-3 bg-[var(--surface)] border-none rounded-xl text-[14px] font-['DM_Sans'] outline-none focus:ring-2 focus:ring-[var(--primary)]/20 appearance-none cursor-pointer" value={newTask.status} onChange={(e) => setNewTask({...newTask, status: e.target.value})}>
                                        <option value="TODO">To Do</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="DONE">Completed</option>
                                    </select>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={() => setIsNewTaskOpen(false)} className="flex-1 bg-[var(--surface)] text-[var(--on-surface)] py-3 rounded-xl font-bold font-['DM_Sans'] text-[14px] hover:bg-[var(--surface-container-high)] transition-colors">Cancel</button>
                                    <button type="submit" disabled={savingTask} className="flex-1 bg-[var(--primary)] text-white py-3 rounded-xl font-bold font-['DM_Sans'] text-[14px] hover:bg-[var(--primary)]/90 transition-colors disabled:opacity-50">{savingTask ? 'Saving...' : 'Create'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </MainLayout>
    );
}
