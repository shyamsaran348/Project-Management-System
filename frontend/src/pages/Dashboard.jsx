import { useAuth } from '../context/AuthContext';
import FacultyDashboard from './FacultyDashboard';
import StudentDashboard from './StudentDashboard';
import MainLayout from '../layouts/MainLayout';

export default function Dashboard() {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <MainLayout>
            <div className="container py-12">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Manage your academic projects and collaborations</p>
                </div>
                {user.role === 'FACULTY' ? (
                    <FacultyDashboard />
                ) : (
                    <StudentDashboard />
                )}
            </div>
        </MainLayout>
    );
}
