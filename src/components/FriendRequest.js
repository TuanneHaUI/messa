import React from 'react';
import './Header.css';
import { updateStatus } from '../services/friendshipapi';
import { toast } from 'react-toastify';

const FriendRequest = ({ showFriendRequests, setShowFriendRequests, friendRequests }) => {
    const acceptFriend = async (id, status) => {
        console.log("id bạn truyền về là:", id);
       const currentUpdate =  await updateStatus(id, status);
       if(currentUpdate.status === "ACCEPTED"){
         toast.success('Kết bạn thành công', {
                            position: "top-right",
                            autoClose: 2000,
                        });
       }
    }
    return (
        showFriendRequests && (
            <div className="popup-overlay" onClick={() => setShowFriendRequests(false)}>
                <div
                    className="friend-request-popup"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="popup-header">
                        <h3>Lời mời kết bạn</h3>
                        <button className="close-btn" onClick={() => setShowFriendRequests(false)}>✕</button>
                    </div>
                    <div className="popup-content">
                        {friendRequests.length > 0 ? (
                            <div className="scroll-area">
                                {friendRequests.map((req) => (
                                    <div key={req.id} className="request-item">
                                        <img src={`http://localhost:8080/storage/avatar/${req.avatar}`} alt="avatar" />

                                        <div className="giua"></div>
                                        <div className="request-info">
                                            <span className="request-name">{req.name}</span>
                                            <div className="request-actions">
                                                <button className="accept-btn" onClick={() => acceptFriend(req.id, "ACCEPTED")}>Chấp nhận</button>
                                                <button className="decline-btn" onClick={() => acceptFriend(req.id, "REJECTED")}>Từ chối</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="empty">Không có lời mời nào</p>
                        )}
                    </div>
                </div>
            </div>
        )
    );
};

export default FriendRequest;