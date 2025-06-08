import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/auth';
import logo from '../../assets/logo.png';

const AdminLayout = ({ children, title }) => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Admin Header */}
      <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
        <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">
          <img src={logo} alt="OrderUp" height="30" />
        </a>
        <button 
          className="navbar-toggler position-absolute d-md-none collapsed" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#sidebarMenu" 
          aria-controls="sidebarMenu" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="navbar-nav">
          <div className="nav-item text-nowrap">
            <button 
              className="nav-link px-3 btn btn-link"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <div className="container-fluid">
        <div className="row">
          {/* Admin Sidebar */}
          <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
            <div className="position-sticky pt-3">
              <ul className="nav flex-column">
                <li className="nav-item">
                  <Link 
                    to="/admin/dashboard" 
                    className="nav-link"
                  >
                    <i className="bi bi-speedometer2"></i> Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/admin/users" 
                    className="nav-link"
                  >
                    <i className="bi bi-people"></i> Người dùng
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/admin/restaurants" 
                    className="nav-link"
                  >
                    <i className="bi bi-shop"></i> Nhà hàng
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/admin/orders" 
                    className="nav-link"
                  >
                    <i className="bi bi-bag"></i> Đơn hàng
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/admin/categories" 
                    className="nav-link"
                  >
                    <i className="bi bi-tags"></i> Danh mục
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/admin/vouchers" 
                    className="nav-link"
                  >
                    <i className="bi bi-ticket"></i> Vouchers
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/admin/reviews" 
                    className="nav-link"
                  >
                    <i className="bi bi-star"></i> Đánh giá
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/admin/analytics" 
                    className="nav-link"
                  >
                    <i className="bi bi-graph-up"></i> Thống kê
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/admin/settings" 
                    className="nav-link"
                  >
                    <i className="bi bi-gear"></i> Cài đặt
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          {/* Main content */}
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h1 className="h2">{title}</h1>
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;