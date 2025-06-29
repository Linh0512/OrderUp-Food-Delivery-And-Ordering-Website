import { faEye, faEyeSlash, faLockOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { changePassword } from "../services/userServices/Service";

export default function ChangePasswordPopUp({ handleClose, token }) {
  const condition = [
    { name: "Ít nhất 12 ký tự", valid: (password) => password.length >= 12 },
    {
      name: "chứa 1 ký tự viết hoa",
      valid: (password) => /[A-Z]/.test(password),
    },
    {
      name: "chứa 1 ký tự viết thường",
      valid: (password) => /[a-z]/.test(password),
    },
    {
      name: "chứa 1 ký tự đặc biệt",
      valid: (password) => /[^A-Za-z0-9]/.test(password),
    },
    { name: "chứa 1 số", valid: (password) => /[0-9]/.test(password) },
  ];
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setoldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState([false,false,false]);

  const handleShowPassword = (idx) => {
  setShowPassword(prev => prev.map((v, i) => i === idx ? !v : v));
};

  const handleSubmit = () => {
    const password = { newPassword, oldPassword, confirmPassword };
    const isFilled = Object.values(password).every(
      (value) => value && value.trim() !== ""
    );
    if (!isFilled) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (newPassword === oldPassword) {
      alert("Mật khẩu mới trùng khớp với mật khẩu cũ!");
      return;
    }
    if (confirmPassword !== newPassword) {
      alert("Mật khẩu nhập lại chưa khớp!");
      return;
    }
    changePassword(token, oldPassword, newPassword, confirmPassword).then(
      alert("Đổi mật khẩu thành công")
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="border-3 bg-white p-6 rounded-3xl shadow w-[40vw]">
        <h2 className="dancing-script-700 text-4xl text-center">
          Đổi mật khẩu
        </h2>
        <p className="text-center mt-4">
          Vui lòng điền vào mẫu dưới đây để cập nhật mật khẩu
        </p>
        <div className="p-20 space-y-10">
          <div>
            <p className="font-semibold">MẬT KHẨU HIỆN TẠI</p>
            <div className="flex space-x-3 items-center border-b p-2">
              <FontAwesomeIcon icon={faLockOpen} className="text-2xl" />
              <input
                type={showPassword[0] ? "text" : "password"}
                name=""
                id=""
                className="w-full focus:outline-none"
                placeholder="Nhập mật khẩu hiện tại"
                onChange={(e) => setoldPassword(e.target.value)}
              />
              <FontAwesomeIcon
                icon={showPassword[0] ? faEyeSlash : faEye}
                onClick={() => handleShowPassword(0)}
                className="cursor-pointer select-none text-2xl"
              />
            </div>
          </div>
          <div>
            <p className="font-semibold">MẬT KHẨU MỚI</p>
            <div className="flex space-x-3 items-center border-b p-2">
              <FontAwesomeIcon icon={faLockOpen} className="text-2xl" />
              <input
                type={showPassword[1] ? "text" : "password"}
                name=""
                id=""
                className="w-full focus:outline-none"
                placeholder="Nhập mật khẩu mới"
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <FontAwesomeIcon
                icon={showPassword[1] ? faEyeSlash : faEye}
                onClick={() => handleShowPassword(1)}
                className="cursor-pointer select-none text-2xl"
              />
            </div>
          </div>
          <div className="space-y-2 px-5">
            {condition.map((item, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 ${
                  item.valid(newPassword) ? "text-red-500" : ""
                }`}
              >
                <div
                  className={`size-2.5 rounded-full ${
                    item.valid(newPassword) ? "bg-red-500" : "bg-black"
                  }`}
                ></div>
                <p>{item.name}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="font-semibold">XÁC NHẬN MẬT KHẨU MỚI</p>
            <div className="flex space-x-3 items-center border-b p-2">
              <FontAwesomeIcon icon={faLockOpen} className="text-2xl" />
              <input
                type={showPassword[2] ? "text" : "password"}
                name=""
                id=""
                className="w-full focus:outline-none"
                placeholder="Nhập lại mật khẩu mới"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <FontAwesomeIcon
                icon={showPassword[2] ? faEyeSlash : faEye}
                onClick={() => handleShowPassword(2)}
                className="cursor-pointer select-none text-2xl"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="w-[40%] p-3 bg-[rgba(227,70,63,1)] text-white font-semibold text-xl rounded-2xl hover:bg-red-600 transition"
              onClick={() => handleClose(false)}
            >
              Hủy
            </button>
            <button
              className="w-[40%] p-3 bg-[rgba(227,70,63,1)] text-white font-semibold text-xl rounded-2xl hover:bg-red-600 transition"
              onClick={handleSubmit}
            >
              Thay đổi mật khẩu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
