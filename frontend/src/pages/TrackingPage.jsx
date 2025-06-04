import {
  faAngleLeft,
  faBowlFood,
  faClipboardCheck,
  faHome,
  faMotorcycle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CartItem from "../components/CartItem";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TrackingPage() {
  const [stage, setStage] = useState("pending");
  const navigate=useNavigate()

  const isActive = (current) => {
    const orderStage = ["pending", "cooking", "delivering", "completed"];
    return orderStage.indexOf(stage) >= orderStage.indexOf(current);
  };
  return (
    <div className="w-[70%] mx-auto">
      <div className="flex items-center">
        <button className="flex items-center justify-start" onClick={()=>navigate('/payment')}>
          <FontAwesomeIcon icon={faAngleLeft} className="text-xl mr-1" />
          trở lại
        </button>
        <h2 className="dancing-script-700 text-5xl flex-1 text-center">
          Chi tiết đơn hàng
        </h2>
      </div>
      <div className="w-full p-10 shadow-2xl flex mt-8 bg-white rounded-2xl ">
        <div className="w-[50%] ">
          <p className="font-bold text-xl mb-4">Đặt hàng thành công</p>
          <p>Đơn hàng sẽ được giao vào lúc 11:30</p>
          <div className="flex items-center space-x-3 mt-10 text-3xl w-full">
            {/* Bước 1: Đặt hàng */}
            <div className="flex items-center space-x-1 w-1/4">
              <div className="text-red-500">
                <FontAwesomeIcon icon={faClipboardCheck} />
              </div>
              <div className="bg-gray-300 w-full h-1">
                <div
                  className={`w-full h-1 bg-red-500 ${
                    stage === "pending" ? "animate-fill" : ""
                  }`}
                ></div>
              </div>
            </div>

            {/* Bước 2: Đang nấu */}
            <div className="flex items-center space-x-1 w-1/4">
              <div
                className={isActive("cooking") ? "text-red-500" : "text-black"}
              >
                <FontAwesomeIcon icon={faBowlFood} />
              </div>
              <div className="w-full h-1 bg-gray-300">
                <div
                  className={`w-full h-1 ${isActive('cooking')?'bg-red-500':''} ${
                    stage === "cooking" ? "animate-fill" : ""
                  }`}
                ></div>
              </div>
            </div>

            {/* Bước 3: Giao hàng */}
            <div className="flex items-center space-x-1 w-1/4">
              <div
                className={
                  isActive("delivering") ? "text-red-500" : "text-black"
                }
              >
                <FontAwesomeIcon icon={faMotorcycle} />
              </div>
              <div className="w-full h-1 bg-gray-300">
                <div
                  className={`w-full h-1 ${isActive('delivering')?'bg-red-500':''} ${
                    stage === "delivering" ? "animate-fill" : ""
                  }`}
                ></div>
              </div>
            </div>

            {/* Bước 4: Hoàn tất */}
            <div
              className={`${
                isActive("delivering") ? "text-red-500" : "text-black"
              } text-end`}
            >
              <FontAwesomeIcon icon={faHome} />
            </div>
          </div>
        </div>
        <div className="space-y-10">
          <div className="space-y-7 bg-gray-100 p-5 rounded-2xl">
            {Array.from({ length: 4 }).map((_, index) => (
              <CartItem key={index} />
            ))}
          </div>
          <hr />
          <div className="space-y-5">
            <p className="font-bold">Tổng 4 món</p>
            <div className="flex justify-between">
              <p>Tạm tính</p>
              <p>171đ</p>
            </div>
            <div className="flex justify-between">
              <p>Tạm tính</p>
              <p>171đ</p>
            </div>
            <div className="flex justify-between">
              <p>Tạm tính</p>
              <p>171đ</p>
            </div>
            <p className="text-end mt-10 text-xl">181đ</p>
          </div>
        </div>
      </div>
    </div>
  );
}
