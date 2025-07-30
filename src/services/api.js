import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

// === Tạo instance ===
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// === Lấy access token hiện tại ===
const getAccessToken = () => {
  const refresh_token = JSON.parse(localStorage.getItem('refresh_token'));
  return refresh_token?.access_token;
};

// === Lưu access token mới sau khi refresh ===
const saveAccessToken = (newToken) => {
  const refresh_token = JSON.parse(localStorage.getItem('refresh_token'));
  if (refresh_token) {
    refresh_token.access_token = newToken;
    localStorage.setItem('refresh_token', JSON.stringify(refresh_token));
  }
};

// === Gọi refresh token API ===
const refreshAccessToken = async () => {
  const refresh_token = JSON.parse(localStorage.getItem('refresh_token'));
  const refreshToken = refresh_token?.refresh_token;

  const response = await axios.get(`${BASE_URL}/auth/refresh`, {
    withCredentials: true,
  });

  return response.data.access_token;
};

// === Interceptor request: gắn token trước khi gửi ===
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// === Interceptor response: xử lý lỗi 401 và tự refresh token ===
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        saveAccessToken(newToken);
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return apiClient(originalRequest); // Retry lại request cũ
      } catch (refreshError) {
        localStorage.removeItem('refresh_token');
        window.location.href = '/login'; // Chuyển hướng đến login nếu refresh thất bại
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

//
// ======================= API FUNCTION =======================
//

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

// === HÀM LẤY DANH SÁCH BÀI VIẾT ===
export const fetchAllPosts = async () => {
  try {
    const response = await apiClient.get('/getPost');
    const postsData = response.data;

    if (!Array.isArray(postsData)) {
      console.error("Dữ liệu trả về từ API /getPost không phải là một mảng:", postsData);
      return [];
    }

    const formattedPosts = postsData.map((post) => {
      const localPath = post.imageUrl;
      const fileName = localPath ? localPath.split(/[\\/]/).pop() : null;
      const imageUrl = fileName ? `${BASE_URL}/storage/posts/${fileName}` : null;

      return {
        id: post.id,
        content: post.content,
        image: imageUrl,
        author: {
          username: post.author.username,
          avatar:`${BASE_URL}/storage/avatar/${post.author.avatarUrl}`,
        },
        likes: post.likeCount || 0,
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


export const fetchProfile = async () => {
  try {
    const response = await apiClient.get('/profile');
    const data = response.data;

    // Kiểm tra nếu không có urlImages hoặc không phải mảng
    if (!Array.isArray(data.urlImages)) {
      console.error("Dữ liệu trả về không đúng định dạng:", data);
      return null;
    }

    // Map các ảnh từ urlImages thành danh sách bài viết giả định (nếu cần)
    const formattedPosts = data.urlImages.map((fileName, index) => ({
      id: index, // nếu không có ID thật thì dùng index
      image: `${BASE_URL}/storage/posts/${fileName}`,
    }));

    return {
      name: data.name,
      bio: data.bio,
      avatar: data.avatar
        ? `${BASE_URL}/storage/avatar/${data.avatar}`
        : `${BASE_URL}/storage/avatar/anhdaidien.jpg`,
      postCount: data.post,
      followerCount: data.follower,
      followingCount: data.following,
      posts: formattedPosts,
    };
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu hồ sơ:', error);
    throw error;
  }
};
export const updateProfileUser = async (formData) => {
  try {
    await apiClient.put('/updateUser', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return "response.data";
  } catch (error) {
    console.error('Lỗi khi update người dùng:', error);
    throw error;
  }
};
export default apiClient;
