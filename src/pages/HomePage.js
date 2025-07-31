import React, { useState, useEffect } from 'react';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import Header from '../components/Header';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import './HomePage.css';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAllPosts } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import FriendRequest from '../components/FriendRequest';
import { getAllFriendship } from '../services/friendshipapi';

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const refresh_token = JSON.parse(localStorage.getItem('refresh_token'));
    const navigate = useNavigate();
    const [showFriendRequests, setShowFriendRequests] = useState(false);
    const getAllFriendShip = []
    const [friendRequests, setFriendRequests] = useState([]);
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('refresh_token'));
        if (token === null) {
            toast.success('Vui lòng đăng nhập. Đang chuyển trang...', {
                position: "top-right",
                autoClose: 1000,
            });
            setTimeout(() => navigate('/login'), 1000);
            return;
        }

        const fetchData = async () => {
            try {
                //await getAllFriendship()
                const fetchedPosts = await fetchAllPosts();
                const sortedPosts = fetchedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setPosts(sortedPosts);
            } catch (error) {
                console.error("Lỗi khi load bài viết:", error);
            }
        };

        fetchData();
    }, []); // ✅ bỏ dependency, chạy duy nhất 1 lần sau khi render


    const handleCreatePost = (newPostData) => {
        console.log("✅ onPostCreated được gọi", newPostData);
        setPosts([newPostData, ...posts]);
    };

  const handleShowFriendRequestsClick = async () => {
    try {
        const data = await getAllFriendship();
        setFriendRequests(data);
        setShowFriendRequests(true);
    } catch (err) {
        console.error("Lỗi khi gọi API:", err);
    }
};

    const listVariants = {
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
        hidden: {
            opacity: 0,
        },
    };

    return (
        <>
            <Header onShowFriendRequestsClick={handleShowFriendRequestsClick} />
            <FriendRequest
                showFriendRequests={showFriendRequests}
                setShowFriendRequests={setShowFriendRequests}
                friendRequests={friendRequests}
            />
            <div className="main-layout">
                <LeftSidebar />
                <main className="feed-container">
                    <CreatePost onPostCreated={handleCreatePost} />
                    <motion.div
                        className="post-list"
                        variants={listVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <AnimatePresence>
                            {posts.map(post => (
                                <Post key={post.id} postData={post} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </main>
                <RightSidebar />
            </div>
        </>
    );
};

export default HomePage;