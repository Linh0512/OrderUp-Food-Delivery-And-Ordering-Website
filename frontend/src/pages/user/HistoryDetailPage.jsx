import {
  faArrowLeft,
  faCalendar,
  faCircleUser,
  faLocationDot,
  faPhone,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import avatar from "../../assets/avatar.png";
import OrderItem from "../../components/hostRes/OrderItem";
import { useNavigate } from "react-router-dom";

export default function HistoryDetailPage() {
  const nav = useNavigate();
  return (
    <div className="w-[60vw] mx-auto">
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex items-center gap-4 ">
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => nav("/history")}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Chi tiết đơn hàng
            </h1>
            <p className="text-gray-600">#123567</p>
          </div>
        </div>
      </div>
      <div className=" bg-gray-200 p-2 my-5 rounded-2xl space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faCircleUser} />
            Thông tin khách hàng
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <img src={avatar} alt="" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">vô danh</p>
                <p className="text-sm text-gray-600">Khách hàng</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <FontAwesomeIcon icon={faPhone} className="w-6" />
              <span>093274832</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <FontAwesomeIcon icon={faLocationDot} className="w-6" />
              <span className="leading-relaxed">quận 9 Hồ Chí Minh</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <FontAwesomeIcon icon={faCalendar} className="w-6" />
              <span>Đặt ngày 10/0/0000</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            Món ăn đã đặt (2 món)
          </h2>
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <OrderItem key={index} />
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faReceipt} />
            Tóm tắt đơn hàng
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Tạm tính:</span>
              <span>100.000</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phí giao hàng:</span>
              <span>100.000</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Giảm giá:</span>
              <span>100.000</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between text-lg font-bold text-gray-800">
                <span>Tổng cộng:</span>
                <span className="text-green-600">100.000</span>
              </div>
            </div>
          </div>
        </div>
        <button className="block w-[90%] mx-auto bg-green-500 p-2 text-2xl text-white font-semibold rounded-xl">
          Xác nhận đơn hàng
        </button>
      </div>
    </div>
  );
}
