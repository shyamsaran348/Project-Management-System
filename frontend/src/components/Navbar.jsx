import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] h-[72px] flex items-center justify-between px-8 lg:px-16 bg-[rgba(250,248,243,0.92)] backdrop-blur-2xl border-b border-[var(--border)] shadow-sm">
            {/* Brand */}
            <div className="flex items-center gap-8">
                <Link
                    to="/"
                    className="flex items-center gap-2.5 font-['Syne'] text-[1.1rem] font-bold text-[var(--ink)] no-underline tracking-[-0.03em] hover:opacity-80 transition-opacity"
                >
                    <div className="w-8 h-8 rounded-[10px] bg-[var(--primary)] flex items-center justify-center text-white text-[0.85rem] font-extrabold shadow-sm active:scale-95 transition-transform">
                        S
                    </div>
                    SDGSync
                </Link>

                {/* Desktop search — only show when logged in */}
                {user && (
                    <div className="hidden lg:flex items-center relative group">
                        <span className="absolute left-3.5 text-[var(--text-muted)] opacity-40 group-focus-within:opacity-70 transition-opacity">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Find research initiatives..."
                            className="bg-[var(--surface)] border border-[rgba(212,201,168,0.2)] rounded-full py-2 pl-10 pr-4 text-[0.75rem] w-[240px] focus:w-[320px] focus:bg-white focus:ring-4 focus:ring-[var(--primary)]/5 transition-all outline-none placeholder:text-[var(--text-muted)]/50 font-['DM_Sans']"
                        />
                    </div>
                )}
            </div>

            {/* Right nav links */}
            <div className="flex items-center gap-4">
                <NavLink to="/" label="Overview" isActive={isActive('/')} exact />

                {user ? (
                    <>
                        <NavLink to="/dashboard" label="Dashboard" isActive={isActive('/dashboard')} />
                        <NavLink to="/analytics" label="Analytics" isActive={isActive('/analytics')} />
                        <NavLink to="/profile" label="Profile" isActive={isActive('/profile')} />
                        <button
                            onClick={handleLogout}
                            className="text-[0.875rem] font-['DM_Sans'] font-medium text-[var(--text-mid)] px-3.5 py-1.5 rounded-[10px] hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer ml-1"
                        >
                            Sign Out
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="text-[0.875rem] font-['DM_Sans'] font-normal text-[var(--text-mid)] no-underline px-3.5 py-1.5 rounded-[10px] hover:bg-[var(--surface)] hover:text-[var(--ink)] transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="text-[0.875rem] font-['DM_Sans'] font-bold px-4 py-1.5 rounded-[10px] bg-[var(--primary)] text-white no-underline hover:bg-[var(--accent2)] hover:-translate-y-[1px] transition-all shadow-sm"
                        >
                            Get Started
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

function NavLink({ to, label, isActive }) {
    return (
        <Link
            to={to}
            className={`text-[0.875rem] font-['DM_Sans'] font-medium no-underline px-3.5 py-1.5 rounded-[10px] transition-colors ${
                isActive
                    ? 'bg-[var(--accent-light)] text-[var(--primary)] font-bold'
                    : 'text-[var(--text-mid)] hover:bg-[var(--surface)] hover:text-[var(--ink)]'
            }`}
        >
            {label}
        </Link>
    );
}
