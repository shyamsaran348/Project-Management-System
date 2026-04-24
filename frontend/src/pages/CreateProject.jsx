import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject, analyzeSDG } from '../api/projects';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
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
            setError('Analysis failed. Please try again.');
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
            setError(err.message || 'Failed to create project');
        }
    };

    return (
        <MainLayout>
            <div className="container py-12 max-w-4xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Create New Project</h1>
                    <p className="text-gray-500">Define your project and let AI align it with Global Sustainable Development Goals.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <div className="relative">
                    {/* Step Indicator */}
                    <div className="flex items-center gap-8 mb-8 border-b border-gray-100 dark:border-gray-800">
                        <button 
                            className={`pb-4 text-xs font-bold uppercase tracking-widest transition-colors ${step === 1 ? 'text-gray-900 dark:text-white border-b-2 border-gray-900' : 'text-gray-400'}`}
                            onClick={() => step === 2 && setStep(1)}
                        >
                            01. Definition
                        </button>
                        <button 
                            className={`pb-4 text-xs font-bold uppercase tracking-widest transition-colors ${step === 2 ? 'text-gray-900 dark:text-white border-b-2 border-gray-900' : 'text-gray-400'}`}
                            disabled={step === 1}
                        >
                            02. SDG Alignment
                        </button>
                    </div>

                    {step === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            <Card className="p-8 space-y-6">
                                <Input 
                                    label="Project Title"
                                    placeholder="Enter a descriptive title..."
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Problem Statement</label>
                                    <textarea
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-1 focus:ring-gray-900 outline-none transition-all min-h-[200px] text-sm"
                                        value={formData.problem_statement}
                                        onChange={(e) => setFormData({ ...formData, problem_statement: e.target.value })}
                                        placeholder="Describe the research problem or social challenge you are addressing..."
                                    />
                                    <p className="text-[10px] text-gray-400">Be as detailed as possible for better AI analysis.</p>
                                </div>
                            </Card>

                            <div className="flex justify-end">
                                <Button 
                                    onClick={handleAnalyze} 
                                    isLoading={loading}
                                    disabled={!formData.title || !formData.problem_statement}
                                    className="!px-12"
                                >
                                    Analyze Alignment
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {analysisResults.map((suggestion, idx) => (
                                    <Card key={idx} className="p-8 flex flex-col justify-between border-t-4 border-t-gray-900">
                                        <div>
                                            <div className="flex justify-between items-center mb-6">
                                                <Badge variant={`sdg-${suggestion.sdg_number || '1'}`}>
                                                    SDG {suggestion.sdg_number || idx + 1}
                                                </Badge>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                    Confidence: {suggestion.confidence.toFixed(1)}%
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold mb-4">{suggestion.sdg}</h3>
                                            <p className="text-sm text-gray-500 leading-relaxed mb-8">
                                                Based on your problem statement, this goal has a high relevance score for impact measurement.
                                            </p>
                                        </div>
                                        <Button 
                                            variant="secondary" 
                                            onClick={() => handleConfirm(suggestion)}
                                            className="w-full"
                                        >
                                            Confirm & Launch
                                        </Button>
                                    </Card>
                                ))}
                            </div>

                            {analysisResults.length === 0 && (
                                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <p className="text-gray-500">No suitable SDG alignment found. Try refining your problem statement.</p>
                                </div>
                            )}

                            <div className="flex justify-start">
                                <Button variant="secondary" onClick={() => setStep(1)}>
                                    Back to Edit
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
