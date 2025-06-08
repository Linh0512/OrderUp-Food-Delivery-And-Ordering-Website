import api from './api';

const LOCAL_STORAGE_KEY = 'user_data';

const authService = {
  async login(email, password) {
    try {
      console.log('Calling login API with:', { email });
      const response = await api.post('/api/auth/login', { email, password });
      console.log('API response:', response.data);
      
      if (response.data && response.data.success) {
        // Lưu thông tin user và token
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
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    if (api.defaults && api.defaults.headers.common['Authorization']) {
      delete api.defaults.headers.common['Authorization'];
    }
    // Chuyển hướng về trang login sau khi đăng xuất
    window.location.href = '/login';
  },
  
  isAuthenticated() {
    try {
      const userDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!userDataString) return false;
      
      const userData = JSON.parse(userDataString);
      
      // Kiểm tra token có tồn tại hay không
      if (!userData || !userData.token) return false;
      
      // Kiểm tra token có hết hạn hay không (nếu có thời gian hết hạn)
      if (userData.expiresAt && new Date().getTime() > userData.expiresAt) {
        console.log('Token expired, logging out');
        this.logout();
        return false;
      }
      
      // Nếu mọi thứ OK
      return true;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  },
  
  getUserData() {
    try {
      const userDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
      return userDataString ? JSON.parse(userDataString) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },
  
  getUserRole() {
    const userData = this.getUserData();
    return userData ? userData.role : null;
  }
};

export default authService;