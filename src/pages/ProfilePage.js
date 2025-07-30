import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import EditProfileModal from '../components/EditProfileModal';

import './ProfilePage.css';
import { fetchProfile } from '../services/api';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Gọi API khi component được mount
    useEffect(() => {
        const loadProfile = async () => {
            setLoading(true);
            try {
                const data = await fetchProfile();

                setUser({
                    username: data.name,
                    bio: data.bio,
                    avatar: data.avatar,
                    postCount: data.postCount,
                    followerCount: data.followerCount,
                    followingCount: data.followingCount,
                });

                setPosts(data.posts);
            } catch (error) {
                console.error("Lỗi khi tải trang cá nhân:", error);
            }
            setLoading(false);
        };

        loadProfile();
    }, []);

    // Lưu dữ liệu khi người dùng chỉnh sửa profile
    const handleSaveProfile = (updatedData) => {
        setUser(prevUser => ({
            ...prevUser,
            ...updatedData
        }));
        setIsModalOpen(false);
    };

    if (loading) return <div>Đang tải...</div>;
    if (!user) return <div>Không tìm thấy người dùng.</div>;

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
                            <span><strong>{user.followingCount}</strong> bạn bè</span>
                        </div>
                        <p className="profile-bio">{user.bio}</p>
                    </div>
                </div>

                <div className="profile-content">
                    <h2>Bài viết</h2>
                    <div className="post-grid">
                        {posts.length === 0 ? (
                            <p>Chưa có bài viết nào.</p>
                        ) : (
                            posts.map((post) => (
                                <div key={post.id} className="post-grid-item">
                                    <img src={post.image} alt="post" />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Modal chỉnh sửa profile */}
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
