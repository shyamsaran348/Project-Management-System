import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import MainLayout from '../layouts/MainLayout';
import ParticleNetwork from '../components/ui/ParticleNetwork';
import { API_URL } from '../api/client';

export default function Register() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        role: 'STUDENT',
        department: '',
        year: '',
        skills: '',
        interests: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            email: formData.email,
            password: formData.password,
            full_name: formData.full_name,
            role: formData.role,
        };

        if (formData.role === 'FACULTY') {
            payload.faculty_profile = {
                department: formData.department,
                interests: formData.interests ? formData.interests.split(',').map(s => s.trim()) : []
            };
        } else {
            payload.student_profile = {
                department: formData.department,
                year: formData.year,
                skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : []
            };
        }

        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                navigate('/login');
            } else {
                const err = await response.json();
                alert(err.detail || 'Registration failed');
            }
        } catch (error) {
            console.error(error);
            alert('Network error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="bg-[var(--cream)] min-h-screen flex flex-col items-center pt-24 pb-16 px-6 relative overflow-hidden">
                <ParticleNetwork />
                <div className="absolute -top-12 -left-12 w-24 h-24 bg-[var(--primary)]/10 rounded-full blur-3xl z-0"></div>
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[var(--sdg-3)]/10 rounded-full blur-3xl z-0"></div>

                
                <main className="relative z-10 w-full max-w-[540px] px-6">
                    <div className="glass-panel p-10 md:p-14 rounded-[40px] flex flex-col">
                        <div className="text-center mb-10">
                            <h2 className="font-heading text-[2.2rem] text-[var(--primary)] mb-3">Institutional Onboarding</h2>
                            <p className="font-light text-[var(--text-muted)] text-[0.95rem]">Join the global network of researchers aligning science with impact.</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Toggle Roles */}
                            <div className="bg-[var(--surface-alt)] p-1 rounded-xl flex mb-10 border border-[var(--border)]">
                                <div className="flex-1">
                                    <input 
                                        type="radio" 
                                        id="student" 
                                        name="role" 
                                        className="hidden peer"
                                        checked={formData.role === 'STUDENT'}
                                        onChange={() => setFormData({...formData, role: 'STUDENT'})}
                                    />
                                    <label htmlFor="student" className="block text-center py-2 px-4 rounded-lg font-['DM_Sans'] text-[14px] text-[var(--on-surface-variant)] cursor-pointer transition-all duration-200 peer-checked:bg-[var(--primary)] peer-checked:text-white peer-checked:shadow-sm">
                                        Student
                                    </label>
                                </div>
                                <div className="flex-1">
                                    <input 
                                        type="radio" 
                                        id="faculty" 
                                        name="role" 
                                        className="hidden peer"
                                        checked={formData.role === 'FACULTY'}
                                        onChange={() => setFormData({...formData, role: 'FACULTY'})}
                                    />
                                    <label htmlFor="faculty" className="block text-center py-2 px-4 rounded-lg font-['DM_Sans'] text-[14px] text-[var(--on-surface-variant)] cursor-pointer transition-all duration-200 peer-checked:bg-[var(--primary)] peer-checked:text-white peer-checked:shadow-sm">
                                        Faculty
                                    </label>
                                </div>
                            </div>

                            {/* Input Fields */}
                            <div className="grid grid-cols-1 gap-4">
                                {/* Full Name */}
                                <div className="space-y-2">
                                    <label className="font-mono text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-[0.1em] ml-1" htmlFor="full_name">Full Name</label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]/40 group-focus-within:text-[var(--primary)] transition-colors text-[20px]">person</span>
                                        <input className="w-full pl-12" id="full_name" name="full_name" placeholder="e.g. John Doe" type="text" required onChange={handleChange}/>
                                    </div>
                                </div>

                                {/* Institutional Email */}
                                <div className="space-y-2">
                                    <label className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--primary)] opacity-60 block px-1">Institutional Email</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]/40 text-[20px]">mail</span>
                                        <input 
                                            className="w-full h-14 pl-14 pr-6" 
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="name@university.edu" 
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="font-mono text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-[0.1em] ml-1" htmlFor="password">Password</label>
                                        <div className="relative group">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]/40 group-focus-within:text-[var(--primary)] transition-colors text-[20px]">lock</span>
                                            <input className="w-full pl-12" id="password" name="password" placeholder="••••••••" type="password" required onChange={handleChange}/>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-mono text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-[0.1em] ml-1" htmlFor="department">Department</label>
                                        <div className="relative group">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]/40 group-focus-within:text-[var(--primary)] transition-colors text-[20px]">account_balance</span>
                                            <input className="w-full pl-12" id="department" name="department" placeholder="e.g. CS / AI" type="text" required onChange={handleChange}/>
                                        </div>
                                    </div>
                                </div>

                                {formData.role === 'FACULTY' ? (
                                    <div className="space-y-2">
                                        <label className="font-mono text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-[0.1em] ml-1" htmlFor="interests">Research Interests</label>
                                        <div className="relative group">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]/40 group-focus-within:text-[var(--primary)] transition-colors text-[20px]">science</span>
                                            <input className="w-full pl-12" id="interests" name="interests" placeholder="e.g. AI, Sustainability" type="text" onChange={handleChange}/>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="font-mono text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-[0.1em] ml-1" htmlFor="year">Current Year</label>
                                            <div className="relative group">
                                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]/40 group-focus-within:text-[var(--primary)] transition-colors text-[20px]">school</span>
                                                <input className="w-full pl-12" id="year" name="year" placeholder="e.g. 3rd Year" type="text" required onChange={handleChange}/>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="font-mono text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-[0.1em] ml-1" htmlFor="skills">Skills</label>
                                            <div className="relative group">
                                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]/40 group-focus-within:text-[var(--primary)] transition-colors text-[20px]">code</span>
                                                <input className="w-full pl-12" id="skills" name="skills" placeholder="e.g. React, Python" type="text" onChange={handleChange}/>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* CTA Button */}
                            <button 
                                className="btn-primary w-full py-4 text-[16px] mt-6" 
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                                <span className="material-symbols-outlined text-xl">arrow_forward</span>
                            </button>

                            {/* Redirect Link */}
                            <p className="text-center mt-6 font-['DM_Sans'] text-[14px] text-[var(--on-surface-variant)]">
                                Already have an account? 
                                <Link to="/login" className="text-[var(--primary)] font-bold hover:text-[var(--accent-hover)] transition-colors underline-offset-4 hover:underline ml-1">Log in</Link>
                            </p>
                        </form>
                    </div>

                    {/* Aligning Section */}
                    <div className="mt-12 flex flex-col items-center">
                        <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-[var(--text-muted)] opacity-50 mb-6">Aligning with Global Frameworks</p>
                        <div className="flex gap-4 opacity-20 grayscale">
                            <div className="w-10 h-10 rounded-full bg-[var(--primary)]"></div>
                            <div className="w-10 h-10 rounded-full bg-[var(--primary)]"></div>
                            <div className="w-10 h-10 rounded-full bg-[var(--primary)]"></div>
                            <div className="w-10 h-10 rounded-full bg-[var(--primary)]"></div>
                        </div>
                    </div>
                </main>
            </div>
        </MainLayout>
    );
}
