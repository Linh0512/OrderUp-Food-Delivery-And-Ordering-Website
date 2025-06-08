import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function AdminUserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    role: 'user',
    isActive: true,
    isVerified: true,
    password: '',
    confirmPassword: '',
    profile: {
      firstName: '',
      lastName: '',
      phone: '',
      gender: 'male',
      dateOfBirth: '',
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Giả lập tải dữ liệu người dùng để sửa
    setLoading(true);
    
    // Tạo một người dùng mẫu dựa trên id
    setTimeout(() => {
      const mockUser = {
        id: id,
        email: `user${id}@example.com`,
        role: id === "1" ? "admin" : id === "2" ? "restaurantHost" : "user",
        isActive: true,
        isVerified: true,
        password: '',
        confirmPassword: '',
        profile: {
          firstName: "User",
          lastName: `${id}`,
          phone: `09${id}${id}${id}${id}${id}${id}`,
          gender: "male",
          dateOfBirth: "1990-01-01",
          avatar: null
        }
      };
      
      setFormData(mockUser);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage('');

    // Kiểm tra mật khẩu nếu có nhập
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      setSaving(false);
      return;
    }

    try {
      // Giả lập cập nhật người dùng
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage('Cập nhật người dùng thành công!');
      setTimeout(() => {
        navigate(`/admin/users/${id}/view`);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi cập nhật người dùng.');
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col">
          <h1 className="mb-0">Chỉnh sửa người dùng</h1>
        </div>
        <div className="col text-end">
          <Link to={`/admin/users/${id}/view`} className="btn btn-secondary me-2">Hủy</Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Thông tin cơ bản</h5>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="email" className="form-label">Email <span className="text-danger">*</span></label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="role" className="form-label">Vai trò <span className="text-danger">*</span></label>
                <select
                  className="form-select"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="user">Người dùng</option>
                  <option value="restaurantHost">Chủ nhà hàng</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label" htmlFor="isActive">
                    Kích hoạt tài khoản
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isVerified"
                    name="isVerified"
                    checked={formData.isVerified}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label" htmlFor="isVerified">
                    Tài khoản đã xác thực
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Thông tin cá nhân</h5>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="profile.firstName" className="form-label">Họ <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  id="profile.firstName"
                  name="profile.firstName"
                  value={formData.profile.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="profile.lastName" className="form-label">Tên <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  id="profile.lastName"
                  name="profile.lastName"
                  value={formData.profile.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="profile.phone" className="form-label">Số điện thoại</label>
                <input
                  type="tel"
                  className="form-control"
                  id="profile.phone"
                  name="profile.phone"
                  value={formData.profile.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="profile.gender" className="form-label">Giới tính</label>
                <select
                  className="form-select"
                  id="profile.gender"
                  name="profile.gender"
                  value={formData.profile.gender}
                  onChange={handleInputChange}
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="profile.dateOfBirth" className="form-label">Ngày sinh</label>
                <input
                  type="date"
                  className="form-control"
                  id="profile.dateOfBirth"
                  name="profile.dateOfBirth"
                  value={formData.profile.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Đổi mật khẩu (để trống nếu không muốn thay đổi)</h5>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="password" className="form-label">Mật khẩu mới</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <div className="form-text">Để trống nếu không muốn thay đổi mật khẩu.</div>
              </div>
              <div className="col-md-6">
                <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                />
                <div className="form-text">Nhập lại mật khẩu mới để xác nhận.</div>
                </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
            </div>
            </div>
        </form>
        <div className="text-end mt-3">
            <Link to={`/admin/users/${id}/view`} className="btn btn-secondary me-2">Hủy</Link>
            <button
                type="submit"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={saving}
            >
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
        </div>
        </div>
    );
}