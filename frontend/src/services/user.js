import api from './api';

export const userService = {
  /**
   * Lấy danh sách tất cả người dùng với phân trang và sắp xếp
   * @param {number} page - Trang hiện tại (bắt đầu từ 0)
   * @param {number} size - Số lượng người dùng trên mỗi trang
   * @param {string[]} sortBy - Mảng các trường cần sắp xếp
   * @param {string} direction - Hướng sắp xếp ('asc' hoặc 'desc')
   * @returns {Promise} - Promise chứa dữ liệu người dùng
   */
  async getAllUsers(page = 0, size = 10, sortBy = ['updatedAt'], direction = 'desc') {
    try {
      const response = await api.get('/users', {
        params: { page, size, sortBy, direction }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  /**
   * Lấy thông tin người dùng theo ID
   * @param {string} id - ID người dùng
   * @returns {Promise} - Promise chứa thông tin người dùng
   */
  async getUserById(id) {
    try {
      const response = await api.get(`/users/id/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Lấy thông tin người dùng theo email
   * @param {string} email - Email người dùng
   * @returns {Promise} - Promise chứa thông tin người dùng
   */
  async getUserByEmail(email) {
    try {
      const response = await api.get(`/users/email/${email}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with email ${email}:`, error);
      throw error;
    }
  },

  /**
   * Lấy danh sách người dùng theo số điện thoại
   * @param {string} phone - Số điện thoại
   * @returns {Promise} - Promise chứa danh sách người dùng
   */
  async getUsersByPhone(phone) {
    try {
      const response = await api.get(`/users/phone/${phone}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching users with phone ${phone}:`, error);
      throw error;
    }
  },

  /**
   * Tìm kiếm người dùng theo tên
   * @param {string} userName - Tên người dùng cần tìm
   * @returns {Promise} - Promise chứa danh sách người dùng
   */
  async searchUsers(userName) {
    try {
      const response = await api.get(`/users/name/${userName}`, {
        params: { userName }
      });
      return response.data;
    } catch (error) {
      console.error(`Error searching users with name ${userName}:`, error);
      throw error;
    }
  },

  /**
   * Tạo người dùng mới
   * @param {Object} user - Thông tin người dùng mới
   * @returns {Promise} - Promise chứa thông tin người dùng đã tạo
   */
  async createUser(user) {
    try {
      const response = await api.post('/users', user);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  /**
   * Cập nhật thông tin người dùng
   * @param {string} id - ID người dùng
   * @param {Object} user - Thông tin cập nhật
   * @returns {Promise} - Promise chứa thông tin người dùng đã cập nhật
   */
  async updateUser(id, user) {
    try {
      const response = await api.put(`/users/${id}`, user);
      return response.data;
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Xóa người dùng
   * @param {string} id - ID người dùng cần xóa
   * @returns {Promise}
   */
  async deleteUser(id) {
    try {
      const response = await api.delete(`/users/id/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Lấy thống kê về người dùng
   * @returns {Promise} - Promise chứa dữ liệu thống kê
   */
  async getUserStats() {
    try {
      const response = await api.get('/users/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }
};

export default userService;