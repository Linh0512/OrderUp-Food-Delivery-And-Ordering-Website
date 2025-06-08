import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function AdminUserListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const [stats, setStats] = useState(null);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users?page=${currentPage}&size=${pageSize}`);
      setUsers(response.data.Users);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Có lỗi xảy ra khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user stats
  const fetchStats = async () => {
    try {
      const response = await api.get('/users/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [currentPage, pageSize]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Function to handle user deletion
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await api.delete(`/users/id/${userId}`);
        fetchUsers(); // Refresh the list
        alert('Đã xóa người dùng thành công');
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Có lỗi xảy ra khi xóa người dùng');
      }
    }
  };

  return (
    <AdminLayout title="Quản lý Người dùng">
      {
        <div className="container mt-5">
        <h1>Quản lý Người dùng</h1>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        <div className="row mb-4">
          <div className="col-md-6">
            <form className="d-flex">
              <input 
                type="text" 
                className="form-control me-2" 
                placeholder="Tìm theo tên người dùng..."
              />
              <button type="submit" className="btn btn-primary">Tìm kiếm</button>
            </form>
          </div>
          <div className="col-md-6 text-end">
            <Link to="/admin/users/create" className="btn btn-success">Thêm người dùng mới</Link>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Ảnh đại diện</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Đăng nhập cuối</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>
                        {user.profile && user.profile.avatar ? (
                          <img 
                            src={user.profile.avatar} 
                            alt="Avatar" 
                            className="avatar-img" 
                            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                          />
                        ) : (
                          <div 
                            className="bg-secondary text-white d-flex align-items-center justify-content-center"
                            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                          >
                            {user.profile ? (
                              user.profile.firstName?.charAt(0) + user.profile.lastName?.charAt(0)
                            ) : (
                              user.email.charAt(0)
                            )}
                          </div>
                        )}
                      </td>
                      <td>
                        {user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : 'N/A'}
                      </td>
                      <td>{user.email}</td>
                      <td>{user.profile ? user.profile.phone : 'N/A'}</td>
                      <td>
                        {user.role === 'admin' && (
                          <span className="badge bg-danger">Admin</span>
                        )}
                        {user.role === 'restaurantHost' && (
                          <span className="badge bg-warning">Chủ nhà hàng</span>
                        )}
                        {user.role === 'user' && (
                          <span className="badge bg-success">Người dùng</span>
                        )}
                      </td>
                      <td>
                        {user.isActive ? (
                          <span className="badge bg-success">Hoạt động</span>
                        ) : (
                          <span className="badge bg-danger">Đã khóa</span>
                        )}
                      </td>
                      <td>
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link 
                            to={`/admin/users/${user.id}/view`} 
                            className="btn btn-info"
                          >
                            Xem
                          </Link>
                          <Link 
                            to={`/admin/users/${user.id}/edit`}
                            className="btn btn-warning"
                          >
                            Sửa
                          </Link>
                          <button 
                            type="button" 
                            className="btn btn-danger"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center">Không tìm thấy người dùng nào</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 0 && (
          <nav>
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  Trước
                </button>
              </li>
              
              {[...Array(totalPages).keys()].map(page => (
                <li 
                  key={page} 
                  className={`page-item ${currentPage === page ? 'active' : ''}`}
                >
                  <button 
                    className="page-link" 
                    onClick={() => handlePageChange(page)}
                  >
                    {page + 1}
                  </button>
                </li>
              ))}
              
              <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                >
                  Sau
                </button>
              </li>
            </ul>
          </nav>
        )}
        
        {/* User Stats */}
        {stats && (
          <div className="card mt-4">
            <div className="card-header bg-primary text-white">
              Thống kê người dùng
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <h5 className="card-title">Tổng số người dùng</h5>
                      <h2 className="card-text">{stats.totalUsers || 0}</h2>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <h5 className="card-title">Người dùng mới</h5>
                      <h2 className="card-text">{stats.newUsers || 0}</h2>
                      <small className="text-muted">30 ngày qua</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <h5 className="card-title">Người dùng hoạt động</h5>
                      <h2 className="card-text">{stats.activeUsers || 0}</h2>
                      <small className="text-muted">7 ngày qua</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <Link to="/" className="btn btn-secondary mt-3">Quay lại Trang chủ</Link>
      </div>
      }
    </AdminLayout>
  );  
}