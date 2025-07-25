// src/pages/ChatPage.js (Phiên bản đầy đủ)
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import './ChatPage.css';

const ChatPage = () => {
    // --- Dữ liệu giả cho danh sách hội thoại ---
    const conversations = [
        { id: 1, name: 'Sơn Tùng M-TP', lastMessage: 'Lạc trôi đi đâu đó?', avatar: 'https://i.pravatar.cc/50?u=a' },
        { id: 2, name: 'Đen Vâu', lastMessage: 'Về nhà đi con.', avatar: 'https://i.pravatar.cc/50?u=b' },
        { id: 3, name: 'Bích Phương', lastMessage: 'Đi đu đưa không?', avatar: 'https://i.pravatar.cc/50?u=c' },
    ];

    // --- Dữ liệu giả ban đầu cho tin nhắn ---
    const initialMessages = [
        { id: 1, sender: 'other', text: 'Lạc trôi đi đâu đó?' },
        { id: 2, sender: 'me', text: 'Đang code giao diện nè bạn ơi' },
        { id: 3, sender: 'other', text: 'Oh ghê vậy' },
        { id: 1, sender: 'other', text: 'Lạc trôi đi đâu đó?' }
    ];

    // --- State để quản lý dữ liệu động ---
    const [activeConversation, setActiveConversation] = useState(conversations[0]);
    const [messages, setMessages] = useState(initialMessages); 
    const [newMessage, setNewMessage] = useState('');

    // --- Hàm gửi tin nhắn ---
    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const messageToSend = {
            id: Date.now(), 
            sender: 'me',   
            text: newMessage.trim()
        };
        
        setMessages([...messages, messageToSend]);
        setNewMessage('');
    };

    // --- Tự động cuộn xuống tin nhắn mới nhất ---
    useEffect(() => {
        const messageList = document.querySelector('.message-list');
        if (messageList) {
            messageList.scrollTop = messageList.scrollHeight;
        }
    }, [messages]);

    return (
        <>
            <Header />
            <div className="chat-page-container">
                <div className="chat-layout">
                    {/* ===== PHẦN ĐƯỢC PHỤC HỒI ===== */}
                    <div className="conversation-list">
                        <div className="conversation-header">
                            <h2>Chat</h2>
                        </div>
                        {conversations.map(conv => (
                            <div
                                key={conv.id}
                                className={`conversation-item ${activeConversation.id === conv.id ? 'active' : ''}`}
                                onClick={() => setActiveConversation(conv)}
                            >
                                <img src={conv.avatar} alt="avatar" />
                                <div className="conversation-info">
                                    <strong>{conv.name}</strong>
                                    <p>{conv.lastMessage}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* ===== KẾT THÚC PHẦN PHỤC HỒI ===== */}

                    <div className="chat-window">
                        <div className="chat-header">
                            <img src={activeConversation.avatar} alt="avatar" />
                            <strong>{activeConversation.name}</strong>
                        </div>
                        <div className="message-list">
                            {messages.map(msg => (
                                <div key={msg.id} className={`message-item ${msg.sender}`}>
                                    <div className="message-bubble">{msg.text}</div>
                                </div>
                            ))}
                        </div>
                        <div className="message-input">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Nhập tin nhắn..."
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button onClick={handleSendMessage}>Gửi</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatPage;