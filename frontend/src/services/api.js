import axios from 'axios';

// Tạo instance của axios với cấu hình cơ bản
const api = axios.create({
  baseURL: 'http://localhost:8080', // Đảm bảo URL này đúng với backend của bạn
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Thêm interceptor để xử lý lỗi global
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Export instance
export default api;




// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:8080', // URL của backend Spring Boot
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// // Thêm interceptor để tự động thêm token vào mọi request
// api.interceptors.request.use(
//   config => {
//     try {
//       const userDataString = localStorage.getItem('user_data');
//       if (userDataString) {
//         const userData = JSON.parse(userDataString);
//         if (userData.token) {
//           config.headers.Authorization = `Bearer ${userData.token}`;
//         }
//       }
//     } catch (error) {
//       console.error('Error reading token from localStorage:', error);
//     }
//     return config;
//   },
//   error => Promise.reject(error)
// );

// // Interceptor để xử lý lỗi 401 (unauthorized)
// api.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response && error.response.status === 401) {
//       // Token hết hạn hoặc không hợp lệ
//       localStorage.removeItem('user_data');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;