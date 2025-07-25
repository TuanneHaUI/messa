// src/pages/LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './LoginPage.css';
import { loginUser } from '../services/authService';
import { toast } from 'react-toastify';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    // const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await loginUser(email, password);

            if (data?.access_token) { // ✅ kiểm tra đúng field
                const t = localStorage.setItem('userInfo', JSON.stringify(data));
                console.log("================>>>>>>t");
                // setSuccess('Đăng nhập thành công!');
                toast.success('Đăng nhập thành công. Đang chuyển trang...', {
                    position: "top-right",
                    autoClose: 2000,
                });
                setTimeout(() => navigate('/'), 2000);
            } else {
                setError('Sai tài khoản hoặc mật khẩu');
                toast.error('Đăng nhập thất bại!', {
                    position: "top-right"
                });
            }
        } catch (err) {
            // const message = err.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
            // console.error("Login error:", err); // ✅ log lỗi ra
            // setError(message);
            setError('Sai tài khoản hoặc mật khẩu');
            toast.error('Đăng nhập thất bại!', {
                position: "top-right"
            });
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="login-title">Đăng nhập SocialApp</h1>
                {error && <p className="error-message">{error}</p>}
                {/* {success && <p className="success-message">{success}</p>} */}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">Đăng nhập</button>
                    <p className="extra-link">
                        Đã có tài khoản? <Link to="/register">Đăng kí ngay</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;