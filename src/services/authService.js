// src/services/authService.js
import publicApi from './publicApi';

export const registerUser = (username, email, password, confirmPassword) => {
    return publicApi.post('/register', {
        username,
        email,
        password,
        confirmPassword,
    });
};

export const loginUser = (email, password) => {
    return publicApi.post('/login', {
        email,
        password,
    },
        { withCredentials: true });
};
