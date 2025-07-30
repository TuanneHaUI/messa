// src/components/Header.js
import { NavLink, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import { FaSun, FaMoon, FaFacebookMessenger, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { AiFillHome } from 'react-icons/ai';
import { logout } from '../services/api';
import { toast } from 'react-toastify';
const Header = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [isDarkMode]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await logout(); // Gọi API logout
            localStorage.removeItem('refresh_token'); // Xoá token local

            // Hiển thị thông báo thành công
            toast.success('Đăng xuất thành công. Đang chuyển trang...', {
                position: "top-right",
                autoClose: 2000,
            });

            // Chờ 3 giây rồi chuyển sang login
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            toast.error('Đăng xuất thất bại!', {
                position: "top-right"
            });
            console.error('Logout thất bại:', error);
        }
    };
    const handleSetting = () => {
        toast.success('. Đang chuyển trang đến setting...', {
            position: "top-right",
            autoClose: 1000,
        });
        setTimeout(() => {
            navigate('/profile');
        }, 1000);
    };
    return (
        <header className="main-header">
            <div className="header-content">
                <div className="logo">SocialApp</div>

                <nav className="navigation">
                    <NavLink to="/" className="nav-link">
                        <AiFillHome size={24} />
                    </NavLink>
                    <NavLink to="/messages" className="nav-link">
                        <FaFacebookMessenger size={24} />
                    </NavLink>
                </nav>

                <div className="user-actions" ref={menuRef}>
                    <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
                        {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
                    </button>
                    <img
                        src="https://i.pravatar.cc/40"
                        alt="User Avatar"
                        className="user-avatar"
                        onClick={() => setShowMenu(!showMenu)}
                    />
                    {showMenu && (
                        <div className="user-menu">
                            <div className="menu-item" onClick={handleSetting}>
                                <FaCog style={{ marginRight: 8 }} /> Cài đặt
                            </div>
                            <div className="menu-item" onClick={handleLogout}>
                                <FaSignOutAlt style={{ marginRight: 8 }} /> Đăng xuất
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
