import React, { useState, useRef, useEffect } from 'react';
import { FaPhotoVideo, FaSmile, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { createPost, fetchAllPosts } from '../services/api'; // Import hàm API
import './CreatePost.css'; // Đảm bảo bạn có file CSS tương ứng

const CreatePost = ({ onPostCreated }) => {
    // State quản lý việc hiển thị modal
    const [showModal, setShowModal] = useState(false);

    // State cho nội dung bài viết
    const [content, setContent] = useState('');

    // State để hiển thị ảnh preview trên giao diện
    const [selectedImage, setSelectedImage] = useState(null);

    // State để lưu trữ file ảnh thật sự sẽ được gửi đi
    const [imageFile, setImageFile] = useState(null);

    // Ref để tham chiếu đến các element DOM
    const modalRef = useRef();
    const fileInputRef = useRef();

    // Lấy thông tin người dùng từ localStorage để hiển thị
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const username = userInfo?.user?.name || 'Bạn';
    const userAvatar = userInfo?.user?.avatar || "https://i.pravatar.cc/40";

    /**
     * Effect để xử lý việc đóng modal khi người dùng click ra bên ngoài.
     */
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Nếu modal đang mở và người dùng click vào vị trí không thuộc modal
            if (showModal && modalRef.current && !modalRef.current.contains(event.target)) {
                resetAndCloseModal();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showModal]);

    /**
     * Xử lý khi người dùng chọn một file ảnh.
     * @param {Event} e - Sự kiện onchange của input file
     */
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Tạo một URL tạm thời từ file để hiển thị ảnh preview
            setSelectedImage(URL.createObjectURL(file));
            // Lưu file thật để gửi lên server
            setImageFile(file);
        }
    };

    /**
     * Reset tất cả state của modal và đóng nó lại.
     */
    const resetAndCloseModal = () => {
        setShowModal(false);
        setContent('');
        setSelectedImage(null);
        setImageFile(null);
    };

    /**
     * Xử lý logic khi người dùng bấm nút "Đăng".
     */
    const handleSubmit = async () => {
        if (!content.trim()) { /* ... */ return; }
        const formData = new FormData();
        formData.append('post', JSON.stringify({ content }));
        if (imageFile) {
            formData.append('file', imageFile);
        }
        formData.append('folder', 'posts');

        toast.info('Đang đăng bài...');

        try {
            // Gọi API và nhận về object Post thật từ backend
            const newPostFromServer = await createPost(formData);

            toast.success('Đăng bài thành công!');

            if (onPostCreated) {
                // Định dạng lại object nhận về cho khớp với cấu trúc frontend
                const formattedNewPost = {
                    id: newPostFromServer.id,
                    content: newPostFromServer.content,
                    // Xây dựng URL ảnh từ fileName nhận về
                    image: newPostFromServer.imageUrl
                        ? `http://localhost:8080/storage/posts/${newPostFromServer.imageUrl}`
                        : null,
                    author: {
                        username: newPostFromServer.author.name,
                        avatar: newPostFromServer.author.avatar,
                    },
                    likes: newPostFromServer.likes || [],
                    comments: newPostFromServer.comments || [],
                    createdAt: newPostFromServer.createdDate,
                };

                // Gọi hàm của component cha và truyền object đã được định dạng
                onPostCreated(formattedNewPost);
            }

            resetAndCloseModal();

        } catch (error) {
            console.error('Lỗi khi tạo bài viết:', error);
            const errorMessage = error.response?.data?.message || 'Đăng bài thất bại, đã có lỗi xảy ra!';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="create-post-card">
            {/* Phần hiển thị tĩnh trên trang chủ */}
            <div className="create-post-header">
                <img src={userAvatar} alt="avatar" className="create-post-avatar" />
                <input
                    type="text"
                    readOnly
                    className="create-post-input"
                    placeholder={`${username} ơi, bạn đang nghĩ gì?`}
                    onClick={() => setShowModal(true)} // Mở modal khi click
                />
            </div>

            {/* Modal chỉ hiển thị khi showModal là true */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" ref={modalRef}>
                        <div className="modal-header">
                            <h3>Tạo bài viết</h3>
                            <button className="close-button" onClick={resetAndCloseModal}>
                                <FaTimes />
                            </button>
                        </div>

                        <textarea
                            rows="4"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Bạn đang nghĩ gì thế?"
                            className="popup-textarea"
                            autoFocus // Tự động focus vào ô textarea khi modal mở
                        />

                        {/* Vùng hiển thị ảnh preview */}
                        {selectedImage && (
                            <div className="image-preview">
                                <button className="remove-image-button" onClick={() => { setSelectedImage(null); setImageFile(null); }}>
                                    <FaTimes />
                                </button>
                                <img src={selectedImage} alt="Xem trước" />
                            </div>
                        )}

                        {/* Các nút hành động trong modal */}
                        <div className="popup-actions">
                            <button className="action-item" onClick={() => fileInputRef.current.click()}>
                                <FaPhotoVideo color="#45bd62" size={20} />
                                <span>Ảnh/Video</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                />
                            </button>

                            <button className="action-item">
                                <FaSmile color="#f7b928" size={20} />
                                <span>Cảm xúc</span>
                            </button>

                            <button
                                className="submit-button"
                                onClick={handleSubmit}
                                disabled={!content.trim()} // Vô hiệu hóa nút nếu không có nội dung
                            >
                                Đăng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreatePost;