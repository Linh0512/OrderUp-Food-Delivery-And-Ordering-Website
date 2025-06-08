import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Giả lập tải dữ liệu người dùng
    setLoading(true);
    
    // Tạo một người dùng mẫu dựa trên id
    setTimeout(() => {
      const mockUser = {
        id: id,
        email: `user${id}@example.com`,
        role: id === "1" ? "admin" : id === "2" ? "restaurantHost" : "user",
        isActive: true,
        isVerified: true,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        profile: {
          firstName: "User",
          lastName: `${id}`,
          phone: `09${id}${id}${id}${id}${id}${id}`,
          gender: "male",
          dateOfBirth: "1990-01-01",
          avatar: null
        }
      };
      
      setUser(mockUser);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
        <p>Đang tải thông tin người dùng...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <p>{error}</p>
          <Link to="/admin/users" className="btn btn-primary">Quay lại danh sách</Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          <p>Không tìm thấy người dùng với ID: {id}</p>
          <Link to="/admin/users" className="btn btn-primary">Quay lại danh sách</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col">
          <h1 className="mb-0">Chi tiết người dùng</h1>
        </div>
        <div className="col text-end">
          <Link to="/admin/users" className="btn btn-secondary me-2">Quay lại</Link>
          <Link to={`/admin/users/${id}/edit`} className="btn btn-primary">Chỉnh sửa</Link>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body text-center">
              {user.profile && user.profile.avatar ? (
                <img 
                  src={user.profile.avatar} 
                  alt="Avatar" 
                  className="rounded-circle img-fluid mb-3" 
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }} 
                />
              ) : (
                <div 
                  style={{ 
                    width: '150px', 
                    height: '150px', 
                    borderRadius: '50%',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    margin: '0 auto 1rem'
                  }}
                >
                  {user.profile ? 
                    (user.profile.firstName?.charAt(0) || '') + (user.profile.lastName?.charAt(0) || '') : 
                    user.email.charAt(0)}
                </div>
              )}
              <h3 className="card-title">
                {user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : 'N/A'}
              </h3>
              <p className="card-text text-muted">{user.email}</p>
              
              <div className="d-flex justify-content-center mt-3">
                {user.role === 'admin' && (
                  <span className="badge bg-danger fs-6 mx-1">Admin</span>
                )}
                {user.role === 'restaurantHost' && (
                  <span className="badge bg-warning fs-6 mx-1">Chủ nhà hàng</span>
                )}
                {user.role === 'user' && (
                  <span className="badge bg-success fs-6 mx-1">Người dùng</span>
                )}
                
                {user.isActive ? (
                  <span className="badge bg-success fs-6 mx-1">Hoạt động</span>
                ) : (
                  <span className="badge bg-danger fs-6 mx-1">Đã khóa</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Thông tin cá nhân</h5>
            </div>
            <div className="card-body">
              <table className="table">
                <tbody>
                  <tr>
                    <th style={{ width: '30%' }}>Họ và tên</th>
                    <td>
                      {user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>{user.email}</td>
                  </tr>
                  <tr>
                    <th>Số điện thoại</th>
                    <td>{user.profile?.phone || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Giới tính</th>
                    <td>
                      {user.profile?.gender === 'male' ? 'Nam' : 
                       user.profile?.gender === 'female' ? 'Nữ' : 
                       'Khác'}
                    </td>
                  </tr>
                  <tr>
                    <th>Ngày sinh</th>
                    <td>
                      {user.profile?.dateOfBirth ? new Date(user.profile.dateOfBirth).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Thông tin tài khoản</h5>
            </div>
            <div className="card-body">
              <table className="table">
                <tbody>
                  <tr>
                    <th style={{ width: '30%' }}>ID người dùng</th>
                    <td>{user.id}</td>
                  </tr>
                  <tr>
                    <th>Vai trò</th>
                    <td>
                      {user.role === 'admin' ? 'Admin' : 
                       user.role === 'restaurantHost' ? 'Chủ nhà hàng' : 
                       'Người dùng'}
                    </td>
                  </tr>
                  <tr>
                    <th>Trạng thái</th>
                    <td>{user.isActive ? 'Đang hoạt động' : 'Đã khóa'}</td>
                  </tr>
                  <tr>
                    <th>Đã xác thực</th>
                    <td>{user.isVerified ? 'Có' : 'Không'}</td>
                  </tr>
                  <tr>
                    <th>Ngày tạo</th>
                    <td>{new Date(user.createdAt).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <th>Cập nhật lần cuối</th>
                    <td>{new Date(user.updatedAt).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <th>Đăng nhập lần cuối</th>
                    <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}