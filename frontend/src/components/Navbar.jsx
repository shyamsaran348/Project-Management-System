import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import Button from './ui/Button';

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="container h-full flex justify-between items-center">
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded flex items-center justify-center text-white dark:text-gray-900 font-bold text-lg">
                        S
                    </div>
                    <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">
                        SDGSync
                    </span>
                </Link>

                <div className="flex items-center gap-8">
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'}`}>
                            Overview
                        </Link>
                        {user && (
                            <>
                                <Link to="/dashboard" className={`text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'}`}>
                                    Dashboard
                                </Link>
                                {user.role === 'FACULTY' && (
                                    <Link to="/project/new" className={`text-sm font-medium transition-colors ${isActive('/project/new') ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'}`}>
                                        New Project
                                    </Link>
                                )}
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
                            title="Toggle Mode"
                        >
                            {theme === 'light' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            )}
                        </button>

                        {user ? (
                            <div className="flex items-center gap-4 border-l border-gray-200 dark:border-gray-800 pl-4">
                                <div className="text-right hidden lg:block">
                                    <p className="text-xs font-bold text-gray-900 dark:text-white leading-none">{user.full_name}</p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{user.role}</p>
                                </div>
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    onClick={logout}
                                    className="!py-1.5 !px-3 !text-xs"
                                >
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                                    Sign In
                                </Link>
                                <Button 
                                    variant="primary" 
                                    size="sm" 
                                    onClick={() => window.location.href = '/register'}
                                    className="!py-1.5 !px-4 !text-xs"
                                >
                                    Get Started
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
