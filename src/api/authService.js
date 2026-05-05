import api from './api';

const authService = {
    login: async (email, password) => {
        // Step 1: Login
        const response = await api.post('/auth/login', { email, password });
        
        // Save tokens if present (Backend returns them here)
        if (response.data.accessToken) {
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data;
    },

    sendOtp: async (userId) => {
        const response = await api.post('/auth/send-otp', { userId });
        return response.data;
    },

    verifyOtp: async (userId, code) => {
        const response = await api.post('/auth/verify-otp', { userId, code });
        return response.data;
    },

    logout: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (refreshToken) {
                await api.post('/auth/logout', { refreshToken });
            }
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        }
    },

    getProfile: async () => {
        const response = await api.get('/auth/profile');
        return response.data;
    }
};

export default authService;
