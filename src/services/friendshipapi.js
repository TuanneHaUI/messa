import apiClient from '../api/apiClient'
const BASE_URL = 'http://localhost:8080';
export const getAllFriendship = async () => {
    try {
        const response = await apiClient.get('/getAllFriend');
        const postsData = response.data;
        return postsData;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách bài viết:', error);
        throw error;
    }
};

export const updateStatus = async (id, status) => {
    try {
        const response = await apiClient.put('/updateFriendShip', {
            id: id,
            status: status,
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái:', error);
        throw error;
    }
};

export default apiClient;