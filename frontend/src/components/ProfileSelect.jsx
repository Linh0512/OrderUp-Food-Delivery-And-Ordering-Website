import {
  faClockRotateLeft,
  faList,
  faLocationDot,
  faRightToBracket,
  faUser,
  faUserShield
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./common/AuthContext";
import axios from "axios";

export default function CustomIconButtonSelect() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const { Logout, role } = useAuth();

  // Debug role
  console.log("ProfileSelect - Current role:", role);

  const options = [
    { label: "Hồ sơ", value: "profile", icon: faUser },
    { label: "Lịch sử", value: "history", icon: faClockRotateLeft },
    { label: "Địa chỉ", value: "address", icon: faLocationDot },
    ...(role === "admin" ? [
      { 
        label: "Trang Admin", 
        value: "admin", 
        icon: faUserShield,
        isAdmin: true
      }
    ] : [])
  ];

  const handleAdminRedirect = async () => {
    console.log("Admin redirect triggered");
    console.log("Current role:", role);
    
    try {
      // Lấy token từ localStorage
      const userData = JSON.parse(localStorage.getItem(import.meta.env.VITE_LOCAL_STORAGE_KEY || 'orderup_user'));
      const token = userData?.token;
      
      if (!token) {
        console.error("No token found, cannot access admin");
        alert("Vui lòng đăng nhập lại để truy cập trang admin");
        return;
      }
      
      console.log("Found token, setting up admin session...");
      
      // Gửi token đến backend để set cookie admin
      const response = await fetch('http://localhost:8080/api/admin-auth/setup-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Để nhận cookie
        body: JSON.stringify({ token: token })
      });
      
      if (response.ok) {
        console.log("Admin session setup successful, redirecting...");
        // Delay một chút để cookie được set, rồi redirect về admin dashboard
        setTimeout(() => {
          window.location.replace('http://localhost:8080/admin/');
        }, 200);
      } else {
        console.error("Failed to setup admin session");
        alert("Không thể thiết lập phiên admin. Vui lòng thử lại.");
      }
      
    } catch (error) {
      console.error("Error setting up admin session:", error);
      alert("Lỗi khi truy cập trang admin. Vui lòng thử lại.");
    }
  };

  const handleMove = (value) => {
    console.log("ProfileSelect - handleMove called with value:", value);
    
    if (value === "admin") {
      handleAdminRedirect();
    } else {
      console.log("Navigating to:", `/${value}`);
      navigate(`/${value}`);
    }
    setIsOpen(false);
  };

  const handleLogOut = async () => {
    try {
      // Gọi API để logout và xóa session admin
      if (role === "admin") {
        await axios.post("http://localhost:8080/api/admin-auth/logout");
      }
      // Logout ở frontend
      Logout();
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
      // Vẫn logout ở frontend nếu có lỗi
      Logout();
      navigate('/login');
    }
  };

  // Effect to handle clicks outside the component to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-max font-inter" ref={selectRef}>
      {/* The custom button/trigger for the select */}
      <button
        className={`
          flex items-center space-x-2 border rounded-2xl p-4 
          ${isOpen ? "bg-black/20" : "hover:bg-black/20"}
          transition-colors duration-200
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon icon={faList} />

        {/* <FontAwesomeIcon icon={faAngleDown} className={`transition-transform duration-200 ${isOpen?'rotate-180':''}`}/> */}
      </button>

      {/* Dropdown options list */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-lg z-20 min-w-[200px]">
          {options.map((option) => (
            <div
              key={option.value}
              className={`flex items-center space-x-2 p-3 px-5 text-lg cursor-pointer hover:bg-blue-100 transition-colors duration-150 ${option.value === 'admin' ? 'text-blue-600 font-medium' : ''}`}
              onClick={() => handleMove(option.value)}
            >
              <FontAwesomeIcon icon={option.icon} />
              <p>{option.label}</p>
            </div>
          ))}
          <hr />
          <div
            className="flex items-center space-x-2 p-3 px-5 text-lg cursor-pointer hover:bg-red-100 transition-colors duration-150 text-red-500"
            onClick={handleLogOut}
          >
            <FontAwesomeIcon icon={faRightToBracket} />
            <p>Đăng xuất</p>
          </div>
        </div>
      )}
    </div>
  );
}
