// src/components/EditProfileModal.js
import React, { useState } from 'react';
import './EditProfileModal.css';

// Component này nhận vào:
// - currentUser: thông tin người dùng hiện tại
// - onSave: hàm để gọi khi người dùng bấm Lưu
// - onClose: hàm để gọi khi người dùng bấm Đóng hoặc nút X
const EditProfileModal = ({ currentUser, onSave, onClose }) => {
    // Tạo state để lưu trữ các giá trị đang được chỉnh sửa trong form
    const [username, setUsername] = useState(currentUser.username);
    const [bio, setBio] = useState(currentUser.bio || ''); // Dùng '' nếu bio là null/undefined
    const [avatar, setAvatar] = useState(currentUser.avatar);

    const handleSave = () => {
        const updatedUser = {
            username,
            bio,
            avatar,
        };
        onSave(updatedUser); // Gọi hàm onSave từ component cha và truyền dữ liệu mới
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Chỉnh sửa trang cá nhân</h2>
                    <button onClick={onClose} className="close-button">×</button>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label>Ảnh đại diện (URL)</label>
                        <input
                            type="text"
                            value={avatar}
                            onChange={(e) => setAvatar(e.target.value)}
                        />
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