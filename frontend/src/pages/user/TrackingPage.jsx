import {
  faAngleLeft,
  faBowlFood,
  faClipboardCheck,
  faHome,
  faMotorcycle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OrderItem from "../../components/hostRes/OrderItem";
import money from "../../assets/money.png";
import zalo from "../../assets/zalopay.png";
import { formatCurrencyVN } from "../../utils/Format";

export default function TrackingPage() {
  const [stage, setStage] = useState("pending");
  const navigate = useNavigate();
  const location = useLocation();
  const cart = location.state?.cart || [];
  const address = location.state?.addressDetail || {};
  const subtotal = location.state?.subtotal || 0;
  const discount = location.state?.discount || 0;
  const orderStage = useMemo(
    () => ["pending", "cooking", "delivering", "completed"],
    []
  );

  const isActive = (current) => {
    return orderStage.indexOf(stage) >= orderStage.indexOf(current);
  };

  useEffect(() => {
    const currentIndex = orderStage.indexOf(stage);
    if (currentIndex < orderStage.length - 1) {
      const timer = setTimeout(() => {
        setStage(orderStage[currentIndex + 1]);
      }, 2000);
      return () => clearTimeout(timer);
    }
    if(currentIndex===3)
      navigate('/history')
  }, [stage, orderStage, navigate]);

  return (
    <div className="w-[70%] mx-auto">
      <div className="flex items-center">
        <button
          className="flex items-center justify-start"
          onClick={() => navigate("/cart")}
        >
          <FontAwesomeIcon icon={faAngleLeft} className="text-xl mr-1" />
          trở lại
        </button>
        <h2 className="dancing-script-700 text-5xl flex-1 text-center">
          Chi tiết đơn hàng
        </h2>
      </div>
      <div className="w-full p-10 shadow-2xl flex mt-8 bg-white rounded-2xl ">
        <div className="w-[70%] ">
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
                  className={`w-full h-1 ${
                    isActive("cooking") ? "bg-red-500" : ""
                  } ${stage === "cooking" ? "animate-fill" : ""}`}
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
                  className={`w-full h-1 ${
                    isActive("delivering") ? "bg-red-500" : ""
                  } ${stage === "delivering" ? "animate-fill" : ""}`}
                ></div>
              </div>
            </div>

            {/* Bước 4: Hoàn tất */}
            <div
              className={`${
                isActive("completed") ? "text-red-500" : "text-black"
              } text-end`}
            >
              <FontAwesomeIcon icon={faHome} />
            </div>
          </div>
          <div className="mt-10 space-y-1 mr-10">
            <div className="flex items-center space-x-2">
              <div className="size-4 bg-red-600 rounded-full"></div>
              <span className="font-semibold">Từ</span>
            </div>
            <p className="font-semibold">Cơm Gà Số 23</p>
            <p className="text-sm">64 số 23, P.A, Quận 7, TP.HCM</p>
          </div>
          <div className="mt-5 space-y-2 mr-10">
            <div className="flex items-center space-x-2 ">
              <div className="size-4 bg-green-500 rounded-full"></div>
              <span className="font-semibold">Đến</span>
            </div>
            <p className="font-semibold">
              ({address.note}) {address.address}
            </p>
            <p className="text-sm">
              {address.name} - {address.phone}
            </p>
            <p className="text-sm">{address.email}</p>
            <div className="text-sm flex items-center">
              Thanh toán:
              <img
                src={address.method === "cash" ? money : zalo}
                className="size-10 ml-2"
              />
            </div>
          </div>
        </div>
        <div className="space-y-10 w-full">
          <div className="space-y-7 p-5 bg-gray-200 rounded-2xl">
            {cart.map((item, index) => (
              <OrderItem key={index} orderItem={item} />
            ))}
          </div>
          <hr />
          <div className="space-y-5 ml-auto">
            <p className="font-bold">Tổng {cart.length} món</p>
            <div className="flex justify-between">
              <p>Tạm tính</p>
              <p>{formatCurrencyVN(subtotal)}</p>
            </div>
            <div className="flex justify-between">
              <p>Giảm giá</p>
              <p>- {formatCurrencyVN(discount.value)}</p>
            </div>
            <div className="flex justify-between">
              <p>Phí vận chuyển</p>
              <p>{formatCurrencyVN(30000)}</p>
            </div>
            <p className="text-end mt-7 text-2xl font-semibold">
              {formatCurrencyVN(subtotal - (discount.value || 0) + 30000)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
