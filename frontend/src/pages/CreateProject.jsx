import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject, analyzeSDG } from '../api/projects';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function CreateProject() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        problem_statement: '',
        sdg_mapping: {}
    });

    const [analysisResults, setAnalysisResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await analyzeSDG(formData.problem_statement);
            setAnalysisResults(data.most_suitable_sdgs || []);
            setStep(2);
        } catch (err) {
            setError('AI Analysis failed. Please check your network and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (selectedSuggestion) => {
        const finalData = {
            title: formData.title,
            problem_statement: formData.problem_statement,
            sdg_mapping: {
                [selectedSuggestion.sdg]: selectedSuggestion.sdg
            },
            ml_confidence_scores: {
                [selectedSuggestion.sdg]: selectedSuggestion.confidence
            }
        };

        try {
            await createProject(finalData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to initialize project');
        }
    };

    return (
        <MainLayout>
            <div className="max-w-[800px] mx-auto px-10 py-16">
                {/* Header */}
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.12em] uppercase text-[var(--accent)] mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent2)] animate-pulse"></span>
                        Project Initialization
                    </div>
                    <h1 className="font-['Syne'] text-[2.4rem] font-bold text-[var(--ink)] tracking-tight leading-none mb-3">Create New Initiative</h1>
                    <p className="text-[0.95rem] font-light text-[var(--text-muted)] leading-relaxed">
                        Define your research challenge. Our BERT-based transformer will automatically align it with the appropriate Global Sustainable Development Goals.
                    </p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-[0.85rem] font-medium flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-[0.7rem]">!</span>
                        {error}
                    </div>
                )}

                {/* Stepper Indicator */}
                <div className="flex items-center gap-10 mb-12 border-b border-[var(--surface2)]">
                    <div className={`pb-4 text-[0.7rem] font-mono uppercase tracking-[0.15em] transition-all relative ${step === 1 ? 'text-[var(--ink)] font-bold' : 'text-[var(--text-muted)]'}`}>
                        01. Definition
                        {step === 1 && <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[var(--ink)]"></div>}
                    </div>
                    <div className={`pb-4 text-[0.7rem] font-mono uppercase tracking-[0.15em] transition-all relative ${step === 2 ? 'text-[var(--ink)] font-bold' : 'text-[var(--text-muted)]'}`}>
                        02. AI Alignment
                        {step === 2 && <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[var(--ink)]"></div>}
                    </div>
                </div>

                {step === 1 && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-10">
                            <div className="space-y-8">
                                <div className="space-y-2.5">
                                    <label className="block text-[0.7rem] font-mono uppercase tracking-wider text-[var(--text-muted)]">Project Title</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Clean Water Monitoring via Low-cost IoT Sensors"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-6 py-4 bg-[var(--surface)] border-[1.5px] border-transparent rounded-[14px] text-[1rem] font-['Syne'] font-semibold focus:bg-white focus:border-[var(--accent)] focus:shadow-[0_0_0_4px_rgba(26,107,60,0.08)] outline-none transition-all placeholder:font-normal placeholder:text-[var(--text-muted)]/50"
                                    />
                                </div>

                                <div className="space-y-2.5">
                                    <label className="block text-[0.7rem] font-mono uppercase tracking-wider text-[var(--text-muted)]">Problem Statement</label>
                                    <textarea
                                        className="w-full px-6 py-4 bg-[var(--surface)] border-[1.5px] border-transparent rounded-[14px] text-[0.95rem] font-light leading-relaxed focus:bg-white focus:border-[var(--accent)] focus:shadow-[0_0_0_4px_rgba(26,107,60,0.08)] outline-none transition-all min-h-[260px] placeholder:text-[var(--text-muted)]/50"
                                        value={formData.problem_statement}
                                        onChange={(e) => setFormData({ ...formData, problem_statement: e.target.value })}
                                        placeholder="Describe the research problem, the target community, and the proposed technical solution. The more detailed your description, the more accurate the SDG classification will be."
                                    />
                                    <div className="flex items-center gap-2 text-[0.65rem] text-[var(--text-muted)] font-mono uppercase tracking-wider">
                                        <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]"></span>
                                        Recommended: 100-300 words for optimal BERT analysis
                                    </div>
                                </div>
                            </div>

                            <aside className="space-y-6">
                                <div className="section-label flex items-center gap-2 mb-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--amber)]"></div>
                                    <span className="text-[0.65rem] font-mono text-[var(--text-muted)] uppercase tracking-[0.15em] font-bold">Initiative Preview</span>
                                </div>
                                <Card className="p-6 bg-[var(--ink)] text-white border-none shadow-xl">
                                    <div className="text-[0.6rem] font-mono uppercase tracking-[0.2em] text-white/40 mb-3">Live Structure</div>
                                    <div className="font-['Syne'] text-[0.9rem] font-bold mb-4 line-clamp-2">{formData.title || 'Untitled Initiative'}</div>
                                    <div className="space-y-3 pt-4 border-t border-white/10">
                                        <div className="flex justify-between text-[0.65rem]">
                                            <span className="text-white/40">Complexity</span>
                                            <span className="text-[var(--accent2)]">Low-Moderate</span>
                                        </div>
                                        <div className="flex justify-between text-[0.65rem]">
                                            <span className="text-white/40">Tokens</span>
                                            <span>{formData.problem_statement.split(' ').filter(x => x).length} words</span>
                                        </div>
                                    </div>
                                </Card>
                                <p className="text-[0.7rem] text-[var(--text-muted)] italic leading-relaxed">
                                    Ensure your statement includes technical keywords related to social impact for better AI mapping.
                                </p>
                            </aside>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button 
                                variant="primary"
                                onClick={handleAnalyze} 
                                isLoading={loading}
                                disabled={!formData.title || !formData.problem_statement}
                                className="px-10 h-[56px] text-[0.9rem]"
                            >
                                Run AI SDG Analysis <span className="ml-2 text-white/50">✦</span>
                            </Button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 gap-6">
                            {analysisResults.map((suggestion, idx) => (
                                <Card key={idx} className="group overflow-visible relative" hover={true}>
                                    <div className="absolute top-[-10px] right-[20px] bg-[var(--ink)] text-white font-mono text-[0.6rem] px-3 py-1 rounded-full tracking-widest uppercase">
                                        Match Score: {suggestion.confidence.toFixed(1)}%
                                    </div>
                                    
                                    <div className="p-8 flex flex-col md:flex-row gap-8 items-start">
                                        <div className={`w-[80px] h-[80px] rounded-[16px] flex items-center justify-center shrink-0 text-3xl shadow-sm bg-[var(--sdg-${suggestion.sdg_number || '1'})] opacity-20`}></div>
                                        <div className="absolute left-[54px] top-[54px] text-3xl">🎯</div>
                                        
                                        <div className="flex-1">
                                            <div className="mb-4">
                                                <Badge variant={`sdg-${suggestion.sdg_number || '1'}`} className="mb-3">
                                                    SDG {suggestion.sdg_number || idx + 1}
                                                </Badge>
                                                <h3 className="font-['Syne'] text-[1.25rem] font-bold text-[var(--ink)] tracking-tight">
                                                    {suggestion.sdg}
                                                </h3>
                                            </div>
                                            
                                            <p className="text-[0.875rem] font-light text-[var(--text-muted)] leading-relaxed mb-6">
                                                Our BERT classifier has identified this goal as the most significant alignment for your project. Mapping your research to this SDG will allow for standardized impact reporting.
                                            </p>

                                            <Button 
                                                variant="primary" 
                                                onClick={() => handleConfirm(suggestion)}
                                                className="w-full md:w-auto px-8"
                                            >
                                                Confirm & Initialize Workspace
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {analysisResults.length === 0 && (
                            <div className="text-center py-24 bg-[var(--surface)] rounded-[24px] border-[1.5px] border-dashed border-[var(--surface2)]">
                                <div className="text-3xl mb-4">🔍</div>
                                <h3 className="font-['Syne'] text-[1.1rem] font-bold text-[var(--ink)] mb-2">No alignment found</h3>
                                <p className="text-[0.85rem] text-[var(--text-muted)] font-light max-w-[320px] mx-auto mb-8">The AI couldn't confidently map your project. Try expanding your problem statement with more technical keywords.</p>
                                <Button variant="secondary" onClick={() => setStep(1)}>
                                    Refine Definition
                                </Button>
                            </div>
                        )}

                        <div className="flex justify-start">
                            <Button variant="ghost" onClick={() => setStep(1)} className="text-[var(--text-muted)]">
                                ← Back to definition
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
