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

    // --- BẮT ĐẦU PHẦN CẬP NHẬT ---
    const [userAvatar, setUserAvatar] = useState("https://i.pravatar.cc/40"); // Avatar mặc định
    // --- KẾT THÚC PHẦN CẬP NHẬT ---

    const menuRef = useRef(null);
    const navigate = useNavigate();

    // Effect để lấy avatar từ localStorage khi component được tải lần đầu
    useEffect(() => {
        const storedData = localStorage.getItem('refresh_token');
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                const avatarFileName = parsedData?.user?.avatar;
                if (avatarFileName) {
                    // Giả sử backend trả về tên file, cần ghép với base URL
                    setUserAvatar(`http://localhost:8080/storage/avatar/${avatarFileName}`);
                }
            } catch (e) {
                console.error("Lỗi khi parse dữ liệu từ localStorage:", e);
            }
        }
    }, []);

    // Effect để lắng nghe sự kiện khi profile được cập nhật ở nơi khác
    useEffect(() => {
        const handleProfileUpdate = (event) => {
            // event.detail chứa dữ liệu mới được gửi từ ProfilePage
            const newAvatarUrl = event.detail.avatar;
            console.log("Header đã nhận được avatar mới:", newAvatarUrl);
            setUserAvatar(newAvatarUrl);
        };

        window.addEventListener('profileUpdated', handleProfileUpdate);

        // Dọn dẹp listener khi component bị unmount
        return () => {
            window.removeEventListener('profileUpdated', handleProfileUpdate);
        };
    }, []);
    // --- KẾT THÚC PHẦN CẬP NHẬT ---

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
                </nav>

                <div className="user-actions" ref={menuRef}>
                    <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
                        {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
                    </button>
                    {/* --- BẮT ĐẦU PHẦN CẬP NHẬT --- */}
                    <img
                        src={userAvatar} // Sử dụng state userAvatar thay vì link cứng
                        alt="User Avatar"
                        className="user-avatar"
                        onClick={() => setShowMenu(!showMenu)}
                        key={userAvatar} // Thêm key để React chắc chắn render lại ảnh khi src thay đổi
                    />
                    {/* --- KẾT THÚC PHẦN CẬP NHẬT --- */}
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