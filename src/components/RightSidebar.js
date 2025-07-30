import React, { useState } from 'react';
import ChatBox from './ChatBox'; // Import component ChatBox vừa tạo
import './Sidebar.css'; // File CSS chung

// Dữ liệu giả về danh sách bạn bè
const friendsData = [
    { id: 1, name: 'Minh Anh', avatar: 'https://i.pravatar.cc/40?img=1', online: true },
    { id: 2, name: 'Bảo Trân', avatar: 'https://i.pravatar.cc/40?img=2', online: false },
    { id: 3, name: 'Gia Hân', avatar: 'https://i.pravatar.cc/40?img=3', online: true },
    { id: 4, name: 'Khánh Vy', avatar: 'https://i.pravatar.cc/40?img=4', online: true },
    { id: 5, name: 'Tuấn Kiệt', avatar: 'https://i.pravatar.cc/40?img=5', online: false },
    { id: 6, name: 'Đức Phúc', avatar: 'https://i.pravatar.cc/40?img=6', online: true },
];

const RightSidebar = () => {
    // State để lưu danh sách các cửa sổ chat đang được mở
    // Sẽ chứa các object friend đầy đủ
    const [activeChats, setActiveChats] = useState([]);

    // Hàm được gọi khi click vào một người bạn
    const handleFriendClick = (friend) => {
        // Kiểm tra xem chat với người này đã mở chưa
        if (!activeChats.find(chat => chat.id === friend.id)) {
            // Giới hạn chỉ mở tối đa 3 cửa sổ chat cùng lúc
            if (activeChats.length < 3) {
                setActiveChats(prevChats => [...prevChats, friend]);
            }
        }
    };

    // Hàm để đóng một cửa sổ chat
    const handleCloseChat = (friendId) => {
        setActiveChats(prevChats => prevChats.filter(chat => chat.id !== friendId));
    };

    return (
        <>
            <aside className="sidebar right-sidebar">
                <h4>Người liên hệ</h4>
                <ul className="friend-list">
                    {friendsData.map(friend => (
                        <li key={friend.id} className="friend-item" onClick={() => handleFriendClick(friend)}>
                            <div className="friend-avatar-container">
                                <img src={friend.avatar} alt={friend.name} className="friend-avatar" />
                                {friend.online && <div className="online-indicator"></div>}
                            </div>
                            <span>{friend.name}</span>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Vùng chứa các cửa sổ chat, nằm bên ngoài sidebar */}
            <div className="chat-windows-container">
                {activeChats.map((chatUser) => (
                    <ChatBox
                        key={chatUser.id}
                        user={chatUser}
                        onClose={() => handleCloseChat(chatUser.id)}
                    />
                ))}
            </div>
        </>
    );
};

export default RightSidebar;