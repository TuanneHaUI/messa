import axios from 'axios';

// Tạo một instance của axios với cấu hình mặc định
const apiClient = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    }
});

// === INTERCEPTOR: Người gác cổng cho mọi request ===
apiClient.interceptors.request.use(
    (config) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        if (userInfo && userInfo.access_token) {
            config.headers['Authorization'] = `Bearer ${userInfo.access_token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// === HÀM ĐĂNG BÀI: GỬI ẢNH + NỘI DUNG ===
export const createPost = async (formData) => {
    try {
        const response = await apiClient.post('/createPost', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tạo bài viết:', error);
        throw error;
    }
};

// === HÀM LOGOUT ===
export const logout = async () => {
    try {
        const response = await apiClient.post('/auth/logout');
        return response.data;
    } catch (error) {
        console.error('Lỗi khi logout:', error);
        throw error;
    }
};
export const fetchAllPosts = async () => {
    try {
        const response = await apiClient.get('/getPost');
        // Dữ liệu trả về là một mảng các bài viết
        const postsData = response.data;

        // Kiểm tra để đảm bảo dữ liệu trả về là một mảng
        if (!Array.isArray(postsData)) {
            console.error("Dữ liệu trả về từ API /getPost không phải là một mảng:", postsData);
            return []; // Trả về mảng rỗng để tránh lỗi
        }

        // Dùng .map() để lặp qua từng bài viết và "dịch" nó sang định dạng frontend cần
        const formattedPosts = postsData.map(post => {
            // Lấy đường dẫn file cục bộ từ backend
            const localPath = post.imageUrl;

            // Trích xuất chỉ tên file từ đường dẫn đầy đủ
            // Ví dụ: "D:/.../image.png" -> "image.png"
            const fileName = localPath ? localPath.split(/[\\/]/).pop() : null;

            // Xây dựng URL hoàn chỉnh mà trình duyệt có thể truy cập được
            const imageUrl = fileName
                ? `http://localhost:8080/images/posts/${fileName}`
                : null;

            // Trả về một object mới với cấu trúc chuẩn cho frontend
            return {
                id: post.id,
                content: post.content,
                image: imageUrl, // URL ảnh đã được xây dựng lại
                author: { // Gộp thông tin author vào một object
                    username: post.author.username,
                    avatar: post.author.avatarUrl || `https://i.pravatar.cc/50?u=${post.author.username}`, // Dùng avatar mặc định nếu không có
                },
                likes: post.likeCount || 0, // Dùng giá trị mặc định là 0 nếu không có
                comments: post.commentCount || 0,
                createdAt: post.createdAt,
            };
        });

        return formattedPosts;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách bài viết:', error);
        throw error;
    }
};

export default apiClient;
