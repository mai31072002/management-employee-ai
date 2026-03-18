import axios from "axios";
import jwtService from "app/service/jwt";
import apiConfig from "app/configs/api.config";

// Helper function to get current token
const getCurrentToken = () => {
    return localStorage.getItem(apiConfig.accessTokenKey);
};

// Helper function to set authorization header
const setAuthHeader = (token) => {
    if (token) {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common.Authorization;
    }
};

// Centralized token refresh function
export const refreshAuthToken = async () => {
    try {
        const tokenData = await jwtService.signInWithToken();
        
        if (tokenData && tokenData.data) {
            const newToken = tokenData.data.accessToken;
            setAuthHeader(newToken);
            return newToken;
        } else {
            throw new Error("Invalid token response");
        }
    } catch (error) {
        console.error('Token refresh failed:', error);
        // Clear invalid tokens and redirect to login
        jwtService.logout();
        throw error;
    }
};

// Axios request interceptor for automatic token handling
export const setupAxiosInterceptors = () => {
    // Set initial token
    const currentToken = getCurrentToken();
    if (currentToken) {
        setAuthHeader(currentToken);
    }

    // Request interceptor - add token to every request
    axios.interceptors.request.use(
        (config) => {
            const token = getCurrentToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response interceptor - handle 401 errors globally
    axios.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const newToken = await refreshAuthToken();
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return axios(originalRequest);
                } catch (refreshError) {
                    // Refresh failed, redirect to login
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );
};

// Wrapper for API calls with automatic retry
export const apiCallWithRetry = async (apiCall, ...args) => {
    try {
        return await apiCall(...args);
    } catch (error) {
        if (error.response?.status === 401) {
            try {
                await refreshAuthToken();
                return await apiCall(...args);
            } catch (refreshError) {
                throw refreshError;
            }
        }
        throw error;
    }
};
