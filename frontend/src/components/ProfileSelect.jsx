import {
  faClockRotateLeft,
  faList,
  faLocationDot,
  faRightToBracket,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./common/AuthContext";

export default function CustomIconButtonSelect() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const { Logout } = useAuth();

  const options = [
    { label: "Hồ sơ", value: "profile", icon: faUser },
    { label: "Lịch sử", value: "history", icon: faClockRotateLeft },
    { label: "Địa chỉ", value: "address", icon: faLocationDot },
  ];

  const handleMove = (value) => {
    navigate(`/${value}`);
    setIsOpen(false);
  };

  const handleLogOut=()=>{
    Logout()
    navigate('/login')
  }

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
              className=" flex items-center space-x-2 p-3 px-5 text-lg cursor-pointer hover:bg-blue-100 transition-colors duration-150 "
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
