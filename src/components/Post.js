// src/components/Post.js

import React, { useState } from 'react';
import './Post.css';
import { motion } from 'framer-motion';
import { FiHeart, FiMessageSquare, FiShare2 } from 'react-icons/fi';

const Post = ({ postData, onImageClick, onCommentClick }) => {
    // Destructuring các thuộc tính từ prop `postData`
    // Dữ liệu ở đây là dữ liệu đã được định dạng lại bởi `fetchAllPosts`
    const { content, image, likes, comments, author, createdAt } = postData;

    // State để quản lý trạng thái like của bài viết
    const [isLiked, setIsLiked] = useState(false);

    // Cấu hình animation cho từng bài viết
    const postVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
        exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
    };

    /**
     * Hàm để định dạng lại chuỗi thời gian cho dễ đọc.
     * @param {string} dateString - Chuỗi ISO date từ server.
     * @returns {string} - Chuỗi thời gian đã được định dạng.
     */
    const formatTimeAgo = (dateString) => {
        if (!dateString) return 'Vừa xong';
        // Bạn có thể dùng các thư viện như `date-fns` hoặc `moment` để hiển thị "x phút trước"
        // Ở đây, chúng ta sẽ hiển thị ngày/tháng/năm cho đơn giản
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <motion.div
            className="post-card"
            variants={postVariants}
            layout // Giúp animation mượt mà khi các item thay đổi vị trí
        >
            <div className="post-header">
                {/* Truy cập vào `author.avatar` để lấy URL ảnh đại diện */}
                <img src={author.avatar} alt="avatar" className="post-avatar" />
                <div className="post-author-info">
                    {/* Truy cập vào `author.username` để lấy tên người dùng */}
                    <span className="post-author">{author.username}</span>
                    <span className="post-timestamp">{formatTimeAgo(createdAt)}</span>
                </div>
            </div>

            <div className="post-content">
                <p>{content}</p>
                {/* 
                  Thẻ img sẽ nhận URL ảnh hợp lệ (http://...) và hiển thị nó.
                  Nếu image là null, thẻ img sẽ không được render.
                */}
                {image && (
                    <img
                        src={image}
                        alt="Nội dung bài viết"
                        className="post-image"
                        onClick={() => onImageClick && onImageClick(postData)} // Mở modal xem ảnh
                    />
                )}
            </div>

            <div className="post-stats">
                {/* `likes` và `comments` là các con số (likeCount, commentCount) */}
                <span>{isLiked ? likes + 1 : likes} Thích</span>
                <span>{comments} Bình luận</span>
            </div>

            <div className="post-actions">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    className={`action-button ${isLiked ? 'liked' : ''}`}
                    onClick={() => setIsLiked(!isLiked)}
                >
                    <FiHeart /> {isLiked ? 'Đã thích' : 'Thích'}
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="action-button"
                    onClick={() => onCommentClick && onCommentClick(postData)} // Mở modal bình luận
                >
                    <FiMessageSquare /> Bình luận
                </motion.button>
                <motion.button whileTap={{ scale: 0.9 }} className="action-button">
                    <FiShare2 /> Chia sẻ
                </motion.button>
            </div>
        </motion.div>
    );
};

export default Post;