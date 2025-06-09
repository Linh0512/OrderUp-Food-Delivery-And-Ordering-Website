import axios from 'axios';
import authService from './auth';

// Tạo instance của axios với cấu hình cơ bản
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// KÍCH HOẠT interceptor để thêm token vào mọi request
api.interceptors.request.use(
  config => {
    try {
      const userDataString = localStorage.getItem('user_data');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        if (userData.token) {
          config.headers.Authorization = `Bearer ${userData.token}`;
          console.log('Added token to request:', config.url);
        }
      }
    } catch (error) {
      console.error('Error reading token from localStorage:', error);
    }
    return config;
  },
  error => Promise.reject(error)
);

// Thêm interceptor để xử lý lỗi 401 (unauthorized)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      console.log('Received 401 Unauthorized response. Logging out user.');
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Thêm interceptor để log các request cho debugging
api.interceptors.request.use(
  config => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

export default api;