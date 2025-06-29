import {
  faArrowLeft,
  faCalendar,
  faCircleUser,
  faLocationDot,
  faPhone,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import avatar from "../../assets/avatar.png";
import { useAuth } from "../../components/common/AuthContext";
import OrderItem from "../../components/hostRes/OrderItem";
import { getHistotyDetail } from "../../services/userServices/Service";
import { formatCurrencyVN } from "../../utils/Format";

export default function OrderDetailPage() {
  const nav = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState({});

  useEffect(() => {
    getHistotyDetail(id, user.token).then((res) => {
      console.log(res);
      setOrder(res);
    });
  }, [user, id]);

  return (
    <div className="w-[60vw] mx-auto bg-gray-200 p-2 my-5 rounded-2xl space-y-6">
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex items-center gap-4 ">
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => nav("/Order")}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Chi tiết đơn hàng
            </h1>
            <p className="text-gray-600">{order.orderNumber}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faCircleUser} />
          Thông tin khách hàng
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="size-12 bg-blue-100 rounded-full flex items-center justify-center">
              <img src={order.userProfile?.avatar} alt="" className="size-12 rounded-full object-cover"/>
            </div>
            <div>
              <p className="font-semibold text-gray-800">
                {order.userProfile?.fullName}
              </p>
              <p className="text-sm text-gray-600">Khách hàng</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <FontAwesomeIcon icon={faPhone} className="w-6" />
            <span>{order.deliveryInfo?.customerPhone}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <FontAwesomeIcon icon={faLocationDot} className="w-6" />
            <span className="leading-relaxed">
              {order.deliveryInfo?.fullAddress}
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <FontAwesomeIcon icon={faCalendar} className="w-6" />
            <span>Đặt ngày {order.orderDate}</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          Món ăn đã đặt (2 món)
        </h2>
        <div className="space-y-4">
          {order.orderItems?.map((item, index) => (
            <OrderItem key={index} orderItem={item} />
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faReceipt} />
          Tóm tắt đơn hàng
        </h2>
        {order.orderSummary && (
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Tạm tính:</span>
              <span>{formatCurrencyVN(order.orderSummary.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phí giao hàng:</span>
              <span>{formatCurrencyVN(order.orderSummary.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Giảm giá:</span>
              <span>{formatCurrencyVN(order.orderSummary.discount)}</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between text-lg font-bold text-gray-800">
                <span>Tổng cộng:</span>
                <span className="text-green-600">
                  {formatCurrencyVN(order.orderSummary.total)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
