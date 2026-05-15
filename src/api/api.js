import axios from 'axios';

// Base API configuration
const createAPI = (baseURL) => {
    const instance = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Add a request interceptor to include the Bearer token
    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token && token !== 'undefined' && token !== 'null') {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Add a response interceptor to handle 401s and refresh tokens
    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const originalRequest = error.config;
            
            // SPECIAL WORKAROUND: If it's a "Network Error" and we have a token, 
            // it might be a CORS-blocked 401 from the Gateway.
            const isNetworkError = error.message === 'Network Error' || !error.response;
            const hasToken = !!localStorage.getItem('token');

            if ((error.response?.status === 401 || (isNetworkError && hasToken)) && !originalRequest._retry) {
                // Ignore refresh loops
                if (originalRequest.url.includes('/auth/refresh-token')) {
                    return Promise.reject(error);
                }

                originalRequest._retry = true;
                const refreshToken = localStorage.getItem('refreshToken');

                if (refreshToken && refreshToken !== 'undefined' && refreshToken !== 'null') {
                    try {
                        const authBaseURL = 'http://localhost:7777/ms-authentification';
                        const res = await axios.post(`${authBaseURL}/auth/refresh-token`, {
                            refreshToken
                        });

                        const newAccessToken = res.data.accessToken || res.data.accesstoken;

                        if (newAccessToken) {
                            localStorage.setItem('token', newAccessToken);
                            if (res.data.refreshToken) {
                                localStorage.setItem('refreshToken', res.data.refreshToken);
                            }

                            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                            return instance(originalRequest);
                        }
                    } catch (refreshError) {
                        console.error('Token refresh failed:', refreshError);
                        // Only logout if the refresh request specifically fails
                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                        return Promise.reject(refreshError);
                    }
                }
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

// Auth Microservice (Gateway Port 7777)
export const authApi = createAPI('http://localhost:7777/ms-authentification');

// Offers Microservice (Gateway Port 7777)
export const offersApi = createAPI('http://localhost:7777/ms-offers');

// Negotiation Microservice (Gateway Port 7777)
export const negotiationApi = createAPI('http://localhost:7777/ms-negotiation');

// Orders Microservice (Gateway Port 7777)
export const ordersApi = createAPI('http://localhost:7777/ms-orders');

// Wallet Microservice (Gateway Port 7777)
export const walletApi = createAPI('http://localhost:7777/ms-wallet');

// Default export for backward compatibility (pointing to auth)
export default authApi;
