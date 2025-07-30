import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';
import './ChatBox.css'; // Chúng ta sẽ tạo file này ở bước 3

const ChatBox = ({ user, onClose }) => {
    // State để lưu tin nhắn đang gõ
    const [newMessage, setNewMessage] = useState('');
    // State để lưu danh sách tin nhắn (ví dụ)
    const [messages, setMessages] = useState([
        { id: 1, text: `Chào bạn, mình là ${user.name}!`, sender: 'them' },
        { id: 2, text: 'Rất vui được làm quen!', sender: 'them' },
    ]);

    const messagesEndRef = useRef(null);

    // Tự động cuộn xuống tin nhắn mới nhất
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const newMsg = {
            id: Date.now(),
            text: newMessage,
            sender: 'me', // 'me' là tin nhắn của mình
        };

        setMessages(prevMessages => [...prevMessages, newMsg]);
        setNewMessage('');
    };

    return (
        <div className="chat-box">
            <div className="chat-box-header">
                <div className="chat-user-info">
                    <img src={user.avatar} alt={user.name} className="chat-user-avatar" />
                    <span className="chat-user-name">{user.name}</span>
                </div>
                <button onClick={onClose} className="close-chat-btn">
                    <FaTimes />
                </button>
            </div>
            <div className="chat-box-body">
                {messages.map(msg => (
                    <div key={msg.id} className={`message-bubble ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form className="chat-box-footer" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                />
                <button type="submit">
                    <FaPaperPlane />
                </button>
            </form>
        </div>
    );
};

export default ChatBox;