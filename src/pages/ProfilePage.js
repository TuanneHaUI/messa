// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import EditProfileModal from '../components/EditProfileModal';
import './ProfilePage.css';
// import { getMyProfile, updateMyProfile } from '../services/api'; // Sẽ dùng sau

const ProfilePage = () => {
    // Dữ liệu giả, sau này sẽ lấy từ API
    const [user, setUser] = useState({
        username: 'Sơn Tùng M-TP',
        email: 'sontung@example.com',
        avatar: 'https://i.pravatar.cc/150?u=a',
        bio: 'Sky ơi, yêu mọi người! ❤️',
        postCount: 120,
        followerCount: 1000000,
        followingCount: 5
    });

    // State để điều khiển việc hiển thị modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     const fetchProfile = async () => {
    //         setLoading(true);
    //         try {
    //             const { data } = await getMyProfile();
    //             setUser(data);
    //         } catch (error) {
    //             console.error("Lỗi khi tải trang cá nhân", error);
    //         }
    //         setLoading(false);
    //     };
    //     fetchProfile();
    // }, []);

    // Hàm này sẽ được gọi khi người dùng bấm "Lưu" trong modal
    const handleSaveProfile = (updatedData) => {
        console.log("Dữ liệu mới để lưu:", updatedData);
        // --- Chỗ này sẽ gọi API để cập nhật profile ---
        // await updateMyProfile(updatedData);

        // Cập nhật giao diện ngay lập tức với dữ liệu mới
        setUser(prevUser => ({
            ...prevUser, // Giữ lại các thông tin không đổi (postCount, followerCount...)
            ...updatedData // Ghi đè các thông tin đã thay đổi
        }));

        // Đóng modal
        setIsModalOpen(false);
    };

    if (loading) return <div>Đang tải...</div>

    return (
        <>
            <Header />
            <div className="profile-container">
                <div className="profile-header">
                    <img src={user.avatar} alt="Avatar" className="profile-avatar" />
                    <div className="profile-info">
                        <div className="profile-info-top">
                            <h1 className="profile-username">{user.username}</h1>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="edit-profile-btn"
                            >
                                Chỉnh sửa trang cá nhân
                            </button>
                        </div>
                        <div className="profile-stats">
                            <span><strong>{user.postCount}</strong> bài viết</span>
                            <span><strong>{user.followerCount}</strong> người theo dõi</span>
                            <span><strong>{user.followingCount}</strong> đang theo dõi</span>
                        </div>
                        <p className="profile-bio">{user.bio}</p>
                    </div>
                </div>
                <div className="profile-content">
                    {/* Nơi hiển thị các bài đăng của người dùng */}
                    <h2>Bài viết</h2>
                    <div className="post-grid">
                        {/* Giả lập các bài post */}
                        <div className="post-grid-item"><img src="https://picsum.photos/300/300?random=1" alt="post" /></div>
                        <div className="post-grid-item"><img src="https://picsum.photos/300/300?random=2" alt="post" /></div>
                        <div className="post-grid-item"><img src="https://picsum.photos/300/300?random=3" alt="post" /></div>
                    </div>
                </div>
            </div>

            {/* Hiển thị modal nếu isModalOpen là true */}
            {isModalOpen && (
                <EditProfileModal
                    currentUser={user}
                    onSave={handleSaveProfile}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
};

export default ProfilePage;