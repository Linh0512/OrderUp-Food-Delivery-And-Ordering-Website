import api from './api';

const LOCAL_STORAGE_KEY = 'user_data';
const LAST_EMAIL_KEY = 'last_email';

const authService = {
  async login(email, password) {
    try {
      console.log('Calling login API with:', { email });
      const response = await api.post('/api/auth/login', { email, password });
      console.log('API response:', response.data);
      
      if (response.data && response.data.success) {
        // Lưu thông tin user và token
        localStorage.setItem(LAST_EMAIL_KEY, email);

        const userData = {
          userId: response.data.userId,
          role: response.data.role,
          token: response.data.token,
          email: email,
          // Thêm thời gian hết hạn
          expiresAt: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 giờ từ bây giờ
        };
        
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
        
        // Cập nhật Authorization header cho các request tiếp theo
        if (api.defaults && response.data.token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }
        
        return {
          success: true,
          userId: response.data.userId,
          role: response.data.role,
          token: response.data.token
        };
      }
      
      return {
        success: false,
        message: response.data?.message || 'Đăng nhập thất bại'
      };
    } catch (error) {
      console.error('Login API error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Đã xảy ra lỗi khi đăng nhập'
      };
    }
  },
  
  logout() {
    console.log('Logging out user, removing data from localStorage');
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    if (api.defaults && api.defaults.headers.common['Authorization']) {
      delete api.defaults.headers.common['Authorization'];
    }
  },
  
  isAuthenticated() {
    try {
      console.log('Checking authentication status...');
      
      const userDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!userDataString) {
        console.log('No user data found in localStorage');
        return false;
      }
      
      let userData;
      try {
        userData = JSON.parse(userDataString);
      } catch (e) {
        console.error('Error parsing user data from localStorage:', e);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        return false;
      }
      
      // Kiểm tra dữ liệu hợp lệ
      if (!userData || typeof userData !== 'object') {
        console.log('Invalid user data format');
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        return false;
      }
      
      // Kiểm tra token có tồn tại hay không
      if (!userData.token || typeof userData.token !== 'string' || userData.token.trim() === '') {
        console.log('No valid token found in user data');
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        return false;
      }
      
      // Kiểm tra token có hết hạn hay không (nếu có thời gian hết hạn)
      if (userData.expiresAt && new Date().getTime() > userData.expiresAt) {
        console.log('Token expired at:', new Date(userData.expiresAt).toLocaleString());
        console.log('Current time:', new Date().toLocaleString());
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        return false;
      }
      
      console.log('User is authenticated with token:', userData.token.substring(0, 10) + '...');
      return true;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  },
  
  // Thêm phương thức để lấy thông tin người dùng
  getUserData() {
    try {
      const userDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!userDataString) return null;
      
      return JSON.parse(userDataString);
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },
  
  // Thêm phương thức để lấy role
  getUserRole() {
    const userData = this.getUserData();
    return userData ? userData.role : null;
  }
};

export default authService;