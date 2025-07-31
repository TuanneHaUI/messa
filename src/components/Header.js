import { NavLink, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import { FaSun, FaMoon, FaFacebookMessenger, FaCog, FaSignOutAlt, FaUserFriends } from 'react-icons/fa';
import { AiFillHome } from 'react-icons/ai';
import { logout } from '../services/api';
import { toast } from 'react-toastify';

const Header = ({ onShowFriendRequestsClick }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [userAvatar, setUserAvatar] = useState("https://i.pravatar.cc/40");

    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedData = localStorage.getItem('refresh_token');
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                const avatarFileName = parsedData?.user?.avatar;
                if (avatarFileName) {
                    setUserAvatar(`http://localhost:8080/storage/avatar/${avatarFileName}`);
                }
            } catch (e) {
                console.error("Lỗi khi parse dữ liệu từ localStorage:", e);
            }
        }
    }, []);

    useEffect(() => {
        const handleProfileUpdate = (event) => {
            const newAvatarUrl = event.detail.avatar;
            console.log("Header đã nhận được avatar mới:", newAvatarUrl);
            setUserAvatar(newAvatarUrl);
        };

        window.addEventListener('profileUpdated', handleProfileUpdate);

        return () => {
            window.removeEventListener('profileUpdated', handleProfileUpdate);
        };
    }, []);

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
            await logout();
            localStorage.removeItem('refresh_token');

            toast.success('Đăng xuất thành công. Đang chuyển trang...', {
                position: "top-right",
                autoClose: 2000,
            });

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
        setTimeout(() => {
            navigate('/profile');
        }, 100);
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
                    <button className="nav-link icon-btn" onClick={onShowFriendRequestsClick}>
                        <FaUserFriends size={22} />
                    </button>
                </nav>
                <div className="user-actions" ref={menuRef}>
                    <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
                        {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
                    </button>
                    <img
                        src={userAvatar}
                        alt="User Avatar"
                        className="user-avatar"
                        onClick={() => setShowMenu(!showMenu)}
                        key={userAvatar}
                    />
                    {showMenu && (
                        <div className="user-menu">
                            <div className="menu-item" onClick={handleSetting}>
                                <FaCog style={{ marginRight: 8 }} /> Trang cá nhân
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