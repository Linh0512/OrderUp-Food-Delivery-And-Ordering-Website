import { faCircleUser, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import avatar from "../assets/avatar.png";
import React, { useState } from "react";
import ChangePasswordPopUp from "../components/ChangePasswordPopUp";

export default function ProfilePage() {
  const [showPopUp, setShowPopup] = useState(false);
  return (
    <div className="w-[60vw] mx-auto">
      <p className="dancing-script-700 text-7xl ">Profile</p>
      <hr className="mb-10" />
      <div className="flex justify-between">
        <div className="grid grid-cols-2 w-[60%] gap-10 border p-8 rounded-2xl bg-white">
          <div className="text-xl text-gray-400 space-y-2">
            <p className="font-semibold">FULLNAME</p>
            <div className="border-b space-x-2">
              <FontAwesomeIcon icon={faCircleUser} />
              <input
                type="text"
                placeholder="Fullname"
                className="w-[90%] focus:outline-none"
              />
            </div>
          </div>
          <div className="text-xl text-gray-400 space-y-2">
            <p className="font-semibold">USERNAME</p>
            <div className="border-b flex space-x-2">
              <p>@</p>
              <input
                type="text"
                placeholder="Username"
                className="w-[90%] focus:outline-none"
              />
            </div>
          </div>
          <div className="text-xl text-gray-400 space-y-2">
            <p className="font-semibold">EMAIL</p>
            <div className="border-b space-x-2">
              <FontAwesomeIcon icon={faEnvelope} />
              <input
                type="text"
                placeholder="Email"
                className="w-[90%] focus:outline-none"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center space-y-4 w-[40%]">
          <div className="w-[40%] rounded-full overflow-hidden bg-gray-100">
            <img
              src={avatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex space-x-4">
            <label className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer text-sm hover:bg-red-600 transition">
              Thay hình ảnh
              <input type="file" accept="image/*" className="hidden" />
            </label>
            <button className="border border-gray-400 px-4 py-2 rounded text-sm hover:bg-gray-200 transition">
              Xoá
            </button>
          </div>
        </div>
      </div>
      <div className="flex w-fit gap-5 mt-10">
        <button className=" bg-red-500 px-4 py-2 rounded text-sm hover:bg-red-600 transition text-white">
          Lưu Thông Tin
        </button>
        <button className=" bg-red-500 px-4 py-2 rounded text-sm hover:bg-red-600 transition text-white" onClick={() => setShowPopup(true)}>
          Đổi mật khẩu
        </button>
      </div>
      {showPopUp && (
        <ChangePasswordPopUp handleClose={setShowPopup}/>
      )}
    </div>
  );
}
