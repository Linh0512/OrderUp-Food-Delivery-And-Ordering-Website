import React, { useState, useEffect } from "react";
import {
    faCartShopping,
    faComment,
    faMagnifyingGlass,
    faNewspaper
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import CustomIconButtonSelect from "./ProfileSelect";
import CustomSelect from "./CustomSelect";
import authService from "../services/auth";

export default function Header() {
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
  }, []); // Chỉ chạy một lần khi component mount

  const provinces = [
    { label: "Hà Nội", value: "hanoi" },
    { label: "TP. Hồ Chí Minh", value: "hochiminh" },
    { label: "Đà Nẵng", value: "danang" },
    { label: "Cần Thơ", value: "cantho" },
    { label: "Hải Phòng", value: "haiphong" },
    { label: "Khánh Hòa", value: "khanhhoa" },
    { label: "Lâm Đồng", value: "lamdong" },
    { label: "Quảng Ninh", value: "quangninh" },
    { label: "Thừa Thiên Huế", value: "thue" },
    { label: "Bình Định", value: "binhdinh" },
  ];

  return (
    <div className="flex space-x-3 w-full justify-between items-center px-10 caret-transparent">
      <img
        src={logo}
        alt="logo"
        className="w-[10%]"
        onClick={() => navigate("/home")}
      />
      <div className="border rounded-2xl caret-black">
        <input
          type="text"
          id=""
          placeholder="tìm địa điểm, món ăn,..."
          className="py-2 px-4 w-[30vw] focus:outline-none"
        />
        <button className="bg-green-400 py-2 px-4 rounded-r-2xl ">
          <FontAwesomeIcon  
            icon={faMagnifyingGlass}
            color="green"
            className="shadow-2xl"
          />
        </button>
      </div>

      <CustomSelect options={provinces} head={"Tỉnh thành"}/>
      <div className="flex space-x-5">
        <button 
          className="border rounded-2xl p-2 px-4 hover:bg-black/20"
          onClick={() => navigate('/restaurants')}
        >
          <FontAwesomeIcon icon={faNewspaper} />
        </button>
        <button 
          className="border rounded-2xl p-2 px-4 hover:bg-black/20" 
          onClick={() => navigate('/chat')}
        >
          <FontAwesomeIcon icon={faComment} />
        </button>
        <div 
          className="p-2 rounded-2xl space-x-1 border px-4 hover:bg-black/20 cursor-pointer" 
          onClick={() => navigate('/cart')}
        >
          <span className="text-xl">0</span>
          <FontAwesomeIcon icon={faCartShopping} />
        </div>
        
        {/* ProfileSelect sẽ xử lý phần đăng nhập/đăng xuất và điều hướng đến profile */}
        <CustomIconButtonSelect 
          isLoggedIn={isLoggedIn} 
          userRole={userRole} 
          onProfileClick={() => navigate('/profile')}
          onHistoryClick={() => navigate('/history')}
          onLoginClick={() => navigate('/login')}
          onLogoutClick={() => {
            authService.logout();
            navigate('/login');
          }}
          onAdminClick={userRole === 'admin' ? () => navigate('/admin/users') : undefined}
        />
      </div>
    </div>
  );
}