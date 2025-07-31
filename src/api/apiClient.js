import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const getAccessToken = () => {
    const refresh_token = JSON.parse(localStorage.getItem('refresh_token'));
    return refresh_token?.access_token;
};

const saveAccessToken = (newToken) => {
    const refresh_token = JSON.parse(localStorage.getItem('refresh_token'));
    if (refresh_token) {
        refresh_token.access_token = newToken;
        localStorage.setItem('refresh_token', JSON.stringify(refresh_token));
    }
};

const refreshAccessToken = async () => {
    const refresh_token = JSON.parse(localStorage.getItem('refresh_token'));
    const refreshToken = refresh_token?.refresh_token;

    const response = await axios.get(`${BASE_URL}/auth/refresh`, {
        withCredentials: true,
    });

    return response.data.access_token;
};

apiClient.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newToken = await refreshAccessToken();
                saveAccessToken(newToken);
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
