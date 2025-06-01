import {
  faAngleLeft,
  faBowlFood,
  faClipboardCheck,
  faHome,
  faMotorcycle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CartItem from "../components/CartItem";

export default function TrackingPage() {

  return (
    <div className="w-[70%] mx-auto">
      <div className="flex items-center">
        <button className="flex items-center justify-start" >
          <FontAwesomeIcon icon={faAngleLeft} className="text-xl mr-1" />
          trở lại
        </button>
        <h2 className="dancing-script-700 text-5xl flex-1 text-center">
          Chi tiết đơn hàng
        </h2>
      </div>
      <div className="w-full p-5 shadow-2xl flex">
        <div className="w-[50%]">
          <p className="font-bold text-xl">Đặt hàng thành công</p>
          <p>Đơn hàng sẽ được giao vào lúc 11:30</p>
          <div className="flex items-center space-x-3  mt-10 text-3xl w-full">
            {/* Bước 1: Đặt hàng */}
            <div className="flex items-center space-x-1 w-1/4">
              <div className="text-red-600">
                <FontAwesomeIcon icon={faClipboardCheck} />
              </div>
              <div className="w-full h-1 bg-red-500"></div>
            </div>

            {/* Bước 2: Đang nấu */}
            <div className="flex items-center space-x-1 w-1/4">
              <div className="text-black">
                <FontAwesomeIcon icon={faBowlFood} />
                {/* Thay bằng icon tương đương */}
              </div>
              <div className="w-full h-1 bg-black"></div>
            </div>

            {/* Bước 3: Giao hàng */}
            <div className="flex items-center space-x-1 w-1/4">
              <div className="text-black">
                <FontAwesomeIcon icon={faMotorcycle} />
              </div>
              <div className="w-full h-1 bg-black"></div>
            </div>

            {/* Bước 4: Hoàn tất */}
            <div className="text-black text-end">
              <FontAwesomeIcon icon={faHome} />
            </div>
          </div>
        </div>
        <div className="space-y-10">
          <div className="space-y-7">
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
