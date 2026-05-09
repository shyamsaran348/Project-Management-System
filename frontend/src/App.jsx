import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateProject from './pages/CreateProject';
import ProjectWorkspace from './pages/ProjectWorkspace';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';

function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin" />
        </div>
    );
    return user ? children : <Navigate to="/login" />;
}

export default function App() {
    return (
        <AuthProvider>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: 'var(--surface-container-lowest, #fff)',
                        color: 'var(--on-surface, #1b1b20)',
                        borderRadius: '16px',
                        fontSize: '14px',
                        fontFamily: "'DM Sans', sans-serif",
                        border: '1px solid var(--sand, #d4c9a8)',
                        boxShadow: '0 8px 24px -4px rgba(10,10,15,0.08)',
                    },
                    success: {
                        iconTheme: {
                            primary: 'var(--primary, #005129)',
                            secondary: '#fff',
                        },
                    },
                }}
            />
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={
                        <PrivateRoute><Dashboard /></PrivateRoute>
                    } />
                    <Route path="/project/new" element={
                        <PrivateRoute><CreateProject /></PrivateRoute>
                    } />
                    <Route path="/project/:projectId/workspace" element={
                        <PrivateRoute><ProjectWorkspace /></PrivateRoute>
                    } />
                    <Route path="/profile" element={
                        <PrivateRoute><Profile /></PrivateRoute>
                    } />
                    <Route path="/analytics" element={
                        <PrivateRoute><Analytics /></PrivateRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
}
