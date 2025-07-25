// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './LoginPage.css'; // Tái sử dụng CSS của trang Login cho nhanh
import { registerUser } from '../services/authService';
import { toast } from 'react-toastify';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    // const [success, setSuccess] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // setSuccess('');

        // 1. Kiểm tra mật khẩu có khớp không
        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            return;
        }

        try {
            // 2. Gọi API đăng ký
            const { data } = await registerUser(username, email, password, confirmPassword);
            if (data === 'Đăng ký thành công! Đang chuyển đến trang đăng nhập...') {
                // setSuccess(data); // hoặc 'Đăng ký thành công!'
                toast.success('Đăng kí thành công. Đang chuyển trang...', {
                    position: "top-right",
                    autoClose: 2000,
                });
                setTimeout(() => navigate('/login'), 2000);
            } else {
                toast.error('Đăng kí thất bại!', {
                    position: "top-right"
                });
                setError(data);
            }


        } catch (err) {
            const message = err.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
            setError(message);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="login-title">Tạo tài khoản</h1>
                {error && <p className="error-message">{error}</p>}
                {/* {success && <p className="success-message">{success}</p>} */}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Tên người dùng</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
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
                    <div className="input-group">
                        <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">Đăng ký</button>
                </form>

                <p className="extra-link">
                    Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;