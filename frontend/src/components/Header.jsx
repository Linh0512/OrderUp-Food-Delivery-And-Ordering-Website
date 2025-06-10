import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faSearch, faUser, faSignOutAlt, faHistory, faChevronDown, faComment } from '@fortawesome/free-solid-svg-icons';
import authService from '../services/auth';

// Component chọn profile, history, và logout
function CustomIconButtonSelect({ isLoggedIn, userRole, onProfileClick, onHistoryClick, onLoginClick, onLogoutClick, onAdminClick, onChatClick, onShoppingCartClick }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.profile-dropdown')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!isLoggedIn) {
    return (
      <button 
        onClick={onLoginClick}
        className="bg-[rgba(227,70,63,1)] text-white px-4 py-1.5 rounded-xl hover:bg-red-700 transition"
      >
        Đăng nhập
      </button>
    );
  }

  return (
    <div className="profile-dropdown relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 bg-[rgba(227,70,63,0.1)] text-[rgba(227,70,63,1)] px-3 py-1.5 rounded-xl hover:bg-[rgba(227,70,63,0.2)] transition"
      >
        <FontAwesomeIcon icon={faUser} />
        <span>Tài khoản</span>
        <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
          <button
            onClick={() => {
              onProfileClick();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            Hồ sơ
          </button>
          
          <button
            onClick={() => {
              onHistoryClick();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <FontAwesomeIcon icon={faHistory} className="mr-2" />
            Lịch sử
          </button>
          
          <button
            onClick={() => {
              onShoppingCartClick();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
            Giỏ hàng 0
          </button>

          <button
            onClick={() => {
              onChatClick();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <FontAwesomeIcon icon={faComment} className="mr-2" />
            Trò chuyện
          </button>
          {userRole === 'admin' && (
            <button
              onClick={() => {
                onAdminClick();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              Quản trị
            </button>
          )}
          
          <div className="border-t border-gray-200 my-1"></div>
          
          <button
            onClick={() => {
              onLogoutClick();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  // const isloggedIn = isLogin();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState(null);
  
  useEffect(() => {
    // Kiểm tra đăng nhập một lần khi component mount
    const checkLoginStatus = () => {
      try {
        const loggedIn = authService.isAuthenticated();
        setIsLoggedIn(loggedIn);
        
        if (loggedIn) {
          const userData = authService.getUserData();
          setUserName(userData?.name || userData?.email || 'User');
          setUserRole(userData?.role || null);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };
    
    checkLoginStatus();
    
    // Event listener để cập nhật UI khi localStorage thay đổi
    const handleStorageChange = (e) => {
      if (e.key === 'user_data' || e.key === null) {
        checkLoginStatus();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const handleLogout = () => {
    // Giữ lại email để tiện cho lần đăng nhập sau
    let userEmail = '';
    try {
      const userData = authService.getUserData();
      if (userData && userData.email) {
        userEmail = userData.email;
      }
    } catch (e) {
      console.error('Error retrieving user email:', e);
    }
    
    // Đăng xuất và xóa dữ liệu người dùng
    authService.logout();
    
    // Lưu lại email vào localStorage (nhưng không phải trong user_data)
    if (userEmail) {
      try {
        localStorage.setItem('last_email', userEmail);
      } catch (e) {
        console.error('Error saving last email:', e);
      }
    }
    
    // Chuyển hướng đến trang đăng nhập
    navigate('/login');
  };

  return (
    <div className="flex justify-between items-center py-3 px-20 bg-white z-50 w-full">
      <div className="flex items-center space-x-10">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-12" />
        </Link>
        
        <div className="flex space-x-5">
          <Link to="/home" className="text-lg hover:text-[rgba(227,70,63,1)] transition">
            Trang chủ
          </Link>
          <Link to="/restaurants" className="text-lg hover:text-[rgba(227,70,63,1)] transition">
            Nhà hàng
          </Link>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative w-full lg:w-[20vw]">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full border border-gray-300 rounded-xl py-1.5 px-3 pr-10 focus:outline-none focus:border-[rgba(227,70,63,1)]"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
        
        <Link to="/cart" className="relative">
          <FontAwesomeIcon
            icon={faShoppingCart}
            className="text-xl text-[rgba(227,70,63,1)]"
          />
          <span className="absolute -top-2 -right-2 bg-[rgba(227,70,63,1)] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            0
          </span>
        </Link>
        
        {/* ProfileSelect sẽ xử lý phần đăng nhập/đăng xuất và điều hướng đến profile */}
        <CustomIconButtonSelect 
          isLoggedIn={isLoggedIn} 
          userRole={userRole} 
          onProfileClick={() => navigate('/profile')}
          onHistoryClick={() => navigate('/history')}
          onChatClick={() => navigate('/chat')}
          onShoppingCartClick={() => navigate('/cart')}
          onLoginClick={() => navigate('/login')}
          onLogoutClick={handleLogout}
          // localhost:8080/ sẽ là trang quản trị, chỉ hiển thị nếu người dùng là admin
          onAdminClick={userRole === 'admin' ? () => window.location.href = 'http://localhost:8080/' : undefined}
        />
      </div>
    </div>
  );
}