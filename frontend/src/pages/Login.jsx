import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import ParticleNetwork from '../components/ui/ParticleNetwork';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const success = await login(formData.email, formData.password);
            if (success) {
                navigate('/dashboard');
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            console.error(error);
            alert('Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="bg-[var(--cream)] min-h-[calc(100vh-64px)] flex items-center justify-center font-body-base text-[var(--on-surface)] overflow-hidden relative">
                {/* Decorative Neural-like background elements */}
                <ParticleNetwork />
                <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-[80px] z-0 pointer-events-none"></div>
                <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[var(--sdg-3)]/5 rounded-full blur-[80px] z-0 pointer-events-none"></div>
                
                <main className="relative z-10 w-full max-w-[1280px] px-6 flex justify-center lg:justify-start lg:pl-[10%]">
                    {/* Central Login Card */}
                    <div className="glass-panel w-full max-w-[460px] p-10 md:p-14 rounded-[32px] flex flex-col items-center">
                        {/* Logo Section */}
                        <div className="mb-8 flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-[var(--primary)] flex items-center justify-center rounded-2xl shadow-sm mb-2">
                                <span className="material-symbols-outlined text-white text-[40px]">sync</span>
                            </div>
                            <h1 className="font-['Syne'] text-[24px] font-bold text-[var(--primary)] tracking-tight">SDGSync</h1>
                        </div>
                        
                        {/* Header Text */}
                        <div className="text-center mb-10">
                            <h2 className="font-['Syne'] text-[1.8rem] font-bold text-[var(--ink)] tracking-tight mb-2">Researcher Gateway</h2>
                            <p className="font-['DM_Sans'] text-[0.9rem] text-[var(--text-muted)] font-light">Enter your credentials to access the SDG synchronization dashboard.</p>
                        </div>
                        
                        {/* Form */}
                        <form onSubmit={handleSubmit} className="w-full space-y-4">
                            <div className="space-y-2">
                                <label className="font-mono text-[10px] uppercase tracking-[0.1em] font-bold text-[var(--text-muted)] block px-1" htmlFor="email">INSTITUTIONAL EMAIL</label>
                                <input 
                                    className="w-full h-14 px-6" 
                                    id="email" 
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="name@university.edu" 
                                    onChange={handleChange}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="font-mono text-[10px] uppercase tracking-[0.1em] font-bold text-[var(--text-muted)]" htmlFor="password">PASSWORD</label>
                                    <a className="text-[13px] text-[var(--primary)] hover:underline underline-offset-4" href="#">Forgot Password?</a>
                                </div>
                                <div className="relative">
                                    <input 
                                        className="w-full h-14 px-6" 
                                        id="password" 
                                        name="password"
                                        type="password"
                                        required
                                        placeholder="••••••••" 
                                        onChange={handleChange}
                                    />
                                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors" type="button">
                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3 px-1 py-2">
                                <input className="w-5 h-5 rounded border-[var(--sand)] text-[var(--primary)] focus:ring-[var(--primary)]/20 cursor-pointer" id="remember" type="checkbox"/>
                                <label className="font-['DM_Sans'] text-[14px] text-[var(--on-surface-variant)] select-none cursor-pointer" htmlFor="remember">Remember this device for 30 days</label>
                            </div>
                            
                            <div className="pt-4 space-y-4">
                                <button 
                                    className="btn-primary w-full h-14 text-[16px]" 
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Authenticating...' : 'Sign In'}
                                    <span className="material-symbols-outlined text-[18px]">login</span>
                                </button>
                                
                                <div className="relative py-4 flex items-center">
                                    <div className="flex-grow border-t border-[var(--sand)]/30"></div>
                                    <span className="flex-shrink mx-4 font-['DM_Mono'] text-[12px] uppercase tracking-[0.1em] font-medium text-[var(--outline)]/60">OR</span>
                                    <div className="flex-grow border-t border-[var(--sand)]/30"></div>
                                </div>
                                
                                <button 
                                    className="w-full h-14 bg-white border border-[var(--sand)] text-[var(--on-surface)] rounded-xl font-['Syne'] text-[16px] font-bold hover:bg-[var(--surface)] active:scale-95 transition-all duration-200" 
                                    type="button"
                                    onClick={() => navigate('/register')}
                                >
                                    Create an account
                                </button>
                            </div>
                        </form>
                        
                        {/* Footer Compliance/Links */}
                        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
                            <a className="font-['DM_Sans'] text-[14px] text-[var(--on-surface-variant)]/70 hover:text-[var(--primary)] transition-colors" href="#">Privacy Policy</a>
                            <a className="font-['DM_Sans'] text-[14px] text-[var(--on-surface-variant)]/70 hover:text-[var(--primary)] transition-colors" href="#">Terms of Service</a>
                            <a className="font-['DM_Sans'] text-[14px] text-[var(--on-surface-variant)]/70 hover:text-[var(--primary)] transition-colors" href="#">Global Support</a>
                        </div>
                    </div>
                </main>
                
                {/* Side Imagery Component (Hidden on small screens) */}
                <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block overflow-hidden pointer-events-none">
                    <div className="w-full h-full relative">
                        <img alt="SDGSync Institutional Context" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4eKGNls5zmeJbhI0WloYgrwhwAbiSyHfv8xiFHbiQSmF9X1Dh9iMJXBL-xLhwLZETFD4l5frRbvOVlHM2u3ZfF4anez4lLaUOW4dRlkM3Y41dOTiH7HMY7Omd-gY_4sJk5c6pIQSSC6M6EmumRH_8dX6aXDfyspynKx_wVkPhDbBBwBBWn8NL7sRkyQXg6rEnprNkI3u4yZqFQdBhWg7o7PliViOo3J5_trk_bhgrWfHKBMWKaelQWy02gP7HAmX_kUg0f1fWm64"/>
                        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[var(--cream)]"></div>
                        
                        {/* Floating Quote Card */}
                        <div className="absolute bottom-12 right-12 glass-panel p-10 rounded-[32px] max-w-[400px] shadow-2xl border border-white/40 ring-1 ring-white/10">
                            <div className="w-12 h-12 bg-[var(--primary)] text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                                <span className="material-symbols-outlined text-[28px]">format_quote</span>
                            </div>
                            <p className="font-['DM_Sans'] text-[1.05rem] text-[var(--ink)] italic mb-6 leading-relaxed">"Strategic institutional alignment with the 2030 Agenda begins with data transparency and cross-departmental collaboration."</p>
                            <div className="flex items-center gap-4 pt-6 border-t border-[var(--sand)]/20">
                                <div className="w-12 h-12 rounded-full bg-[var(--surface-dim)] overflow-hidden border-2 border-white shadow-md">
                                    <img alt="Director Portrait" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop"/>
                                </div>
                                <div>
                                    <p className="font-['Syne'] text-[15px] font-bold text-[var(--ink)] tracking-tight">Dr. Sarah Jensen</p>
                                    <p className="font-['DM_Sans'] text-[13px] text-[var(--text-muted)]">Director of Sustainability</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
