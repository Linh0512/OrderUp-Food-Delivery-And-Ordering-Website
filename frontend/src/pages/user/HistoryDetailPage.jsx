import {
  faArrowLeft,
  faCalendar,
  faLocationDot,
  faPhone,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../components/common/AuthContext";
import OrderItem from "../../components/hostRes/OrderItem";
import { getHistotyDetail } from "../../services/userServices/Service";
import { formatCurrencyVN } from "../../utils/Format";

export default function HistoryDetailPage() {
  const nav = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [detail, setDetail] = useState();

  useEffect(() => {
    getHistotyDetail(id, user.token).then((res) => {
      console.log(res);
      setDetail(res);
    });
  }, [user, id]);

  return (
    detail && (
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
              <p className="text-gray-600">{detail.orderNumber}</p>
            </div>
          </div>
        </div>
        <div className=" bg-gray-200 p-2 my-5 rounded-2xl space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <img src={detail.restaurantInfo.restaurantImage} alt="" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {detail.restaurantInfo.restaurantName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <FontAwesomeIcon icon={faPhone} className="w-6" />
                <span>{detail.restaurantInfo.restaurantPhone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <FontAwesomeIcon icon={faLocationDot} className="w-6" />
                <span className="leading-relaxed">
                  {detail.restaurantInfo.restaurantAddress}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <FontAwesomeIcon icon={faCalendar} className="w-6" />
                <span>Đặt ngày {detail.orderDate}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 mt-5 px-1">
                <div className="bg-green-500 rounded-full size-4"></div>
                <span className="text-black text-lg font-semibold">
                  Giao đến:
                </span>
                <span>{detail.deliveryInfo.fullAddress}</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              Món ăn đã đặt {detail.orderItems.length}
            </h2>
            <div className="space-y-4">
              {detail.orderItems &&
                detail.orderItems.map((item, index) => (
                  <OrderItem key={index} orderItem={item} />
                ))}
            </div>
            <div className="border-t pt-3 mt-10 space-y-3">
              <div className="flex justify-between text-gray-400">
                Tạm tính:
                <span className="text-black">
                  {formatCurrencyVN(detail.orderSummary.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                Giảm giá :
                <span className="text-black">
                  {formatCurrencyVN(detail.orderSummary.discount)}
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                Phí vận chuyển:
                <span className="text-black">
                  {formatCurrencyVN(detail.orderSummary.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-800">
                <p>
                  <FontAwesomeIcon icon={faReceipt} /> Tổng cộng:
                </p>
                <span className="text-green-600 text-lg font-semibold">
                  {formatCurrencyVN(detail.orderSummary.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
