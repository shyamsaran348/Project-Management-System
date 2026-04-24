import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

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
                interests: formData.interests.split(',').map(s => s.trim())
            };
        } else {
            payload.student_profile = {
                department: formData.department,
                year: formData.year,
                skills: formData.skills.split(',').map(s => s.trim())
            };
        }

        try {
            const response = await fetch('http://localhost:8000/auth/signup', {
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
            <div className="flex flex-col items-center justify-center py-20 px-4">
                <div className="w-full max-w-xl">
                    <div className="text-center mb-10">
                        <h1 className="text-2xl font-bold tracking-tight mb-2">Create your account</h1>
                        <p className="text-sm text-gray-500">Join the ecosystem of technology for social good</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Full Name"
                                name="full_name"
                                placeholder="John Doe"
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="University Email"
                                name="email"
                                type="email"
                                placeholder="john@university.edu"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                onChange={handleChange}
                                required
                            />
                            <div className="form-group">
                                <label className="form-label">Role</label>
                                <select 
                                    name="role" 
                                    className="form-control" 
                                    onChange={handleChange} 
                                    value={formData.role}
                                >
                                    <option value="STUDENT">Student</option>
                                    <option value="FACULTY">Faculty Member</option>
                                </select>
                            </div>
                        </div>

                        <Input
                            label="Department"
                            name="department"
                            placeholder="e.g. Computer Science"
                            onChange={handleChange}
                            required
                        />

                        {formData.role === 'FACULTY' ? (
                            <Input
                                label="Research Interests"
                                name="interests"
                                placeholder="AI, Sustainability, Healthcare (comma separated)"
                                onChange={handleChange}
                            />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Current Year"
                                    name="year"
                                    placeholder="e.g. 3rd Year"
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Skills"
                                    name="skills"
                                    placeholder="Python, React, ML (comma separated)"
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        <Button 
                            type="submit" 
                            className="w-full py-2.5 text-sm" 
                            isLoading={isLoading}
                        >
                            Create Account
                        </Button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                        <p className="text-gray-500 text-sm">
                            Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign in instead</Link>
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
