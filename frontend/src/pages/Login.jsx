import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials. Please check your email and password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="flex flex-col items-center justify-center py-24 px-4">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-10">
                        <h1 className="text-2xl font-bold tracking-tight mb-2">Sign in to SDGSync</h1>
                        <p className="text-sm text-gray-500">Enter your credentials to manage your academic projects</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 text-xs p-3 rounded mb-6 text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Email Address"
                            type="email"
                            id="email"
                            placeholder="name@university.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        
                        <Button 
                            type="submit" 
                            className="w-full py-2.5 text-sm" 
                            isLoading={isLoading}
                        >
                            Continue
                        </Button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                        <p className="text-gray-500 text-sm">
                            Don't have an account? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Create one for free</Link>
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
