import React, { useState, useRef } from 'react';
import './EditProfileModal.css';
import { updateProfileUser } from '../services/api';

async function urlToFile(url, fileName) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
}

const EditProfileModal = ({ currentUser, onSave, onClose }) => {
    const fileInputRef = useRef(null);

    const [username, setUsername] = useState(currentUser.username);
    const [bio, setBio] = useState(currentUser.bio || '');

    const [avatarPreview, setAvatarPreview] = useState(currentUser.avatar);
    const [avatarFile, setAvatarFile] = useState(null);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
            setAvatarFile(file);
        }
    };

    const handleSave = async () => {
        const userData = {
            username: username,
            bio: bio
        };

        const formData = new FormData();

        formData.append('user', JSON.stringify(userData));
        formData.append('folder', 'avatar');

        try {
            let fileToSend;

            if (avatarFile) {
                fileToSend = avatarFile;
            } else {
                console.log("Không có file mới được chọn. Đang chuyển đổi ảnh cũ thành File để gửi đi:", currentUser.avatar);
                const oldFileName = currentUser.avatar.split('/').pop() || 'current-avatar.jpg';
                fileToSend = await urlToFile(currentUser.avatar, oldFileName);
            }

            formData.append('file', fileToSend);

            await updateProfileUser(formData);

            const updatedUIData = {
                username,
                bio,
                avatar: avatarPreview,
            };

            onSave(updatedUIData);

        } catch (error) {
            console.error("Lỗi khi cập nhật profile:", error);
            if (error.message.includes('CORS')) {
                alert(
                    "Lỗi CORS! Không thể tải ảnh đại diện cũ để gửi đi.\n\n" +
                    "Vui lòng đảm bảo backend Spring Boot của bạn đã được cấu hình CORS để cho phép request từ frontend."
                );
            } else {
                alert("Đã có lỗi xảy ra khi cập nhật. Vui lòng thử lại.");
            }
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Chỉnh sửa trang cá nhân</h2>
                    <button onClick={onClose} className="close-button">×</button>
                </div>

                <div className="modal-body">
                    <div className="form-group avatar-edit-container">
                        <label>Ảnh đại diện</label>
                        <div className="avatar-preview-wrapper">
                            <button
                                type="button"
                                className="change-avatar-btn"
                                onClick={() => fileInputRef.current.click()}
                            >
                                <img src={avatarPreview} alt="Avatar Preview" className="avatar-preview-image" />
                            </button>
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                ref={fileInputRef}
                                onChange={handleAvatarChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Tên người dùng</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Tiểu sử</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows="3"
                        ></textarea>
                    </div>
                </div>

                <div className="modal-footer">
                    <button onClick={onClose} className="button-secondary">Hủy</button>
                    <button onClick={handleSave} className="button-primary">Lưu thay đổi</button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;