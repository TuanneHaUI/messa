import React, { useState, useEffect } from 'react';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import Header from '../components/Header';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import './HomePage.css';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAllPosts } from '../services/api';

const HomePage = () => {
    const [posts, setPosts] = useState([]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedPosts = await fetchAllPosts();
                setPosts(fetchedPosts);
            } catch (error) {
                console.error("Lỗi khi load bài viết:", error);
            }
        };
        fetchData();
    }, []);

    const handleCreatePost = (newPostData) => {
        console.log("✅ onPostCreated được gọi", newPostData);

        setPosts([newPostData, ...posts]);
    };

    // Animation cho danh sách bài viết
    const listVariants = {
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1, // Mỗi item xuất hiện cách nhau 0.1s
            },
        },
        hidden: {
            opacity: 0,
        },
    };

    return (
        <>
            <Header />
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