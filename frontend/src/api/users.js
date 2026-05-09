import { fetchClient } from './client';

export const getStudents = async () => {
    const response = await fetchClient('/auth/students');
    if (!response.ok) throw new Error('Failed to fetch students');
    return response.json();
};

export const updateProfile = async (data) => {
    const response = await fetchClient('/auth/me', {
        method: 'PUT',
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update profile');
    }
    return response.json();
};
