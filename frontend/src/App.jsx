import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateProject from './pages/CreateProject';
import ProjectWorkspace from './pages/ProjectWorkspace';

function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="min-h-screen flex items-center justify-center text-sm font-medium text-gray-400 uppercase tracking-widest">Loading...</div>;
    return user ? children : <Navigate to="/login" />;
}

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } />
                    <Route path="/project/new" element={
                        <PrivateRoute>
                            <CreateProject />
                        </PrivateRoute>
                    } />
                    <Route path="/project/:projectId/workspace" element={
                        <PrivateRoute>
                            <ProjectWorkspace />
                        </PrivateRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
}
