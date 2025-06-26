import {
  faAngleLeft,
  faAngleRight,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CartItem from "../../components/CartItem";
import VoucherPopUp from "../../components/voucherPopUp";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/common/AuthContext";
import {
  deleteCart,
  getCart,
  getVoucher,
} from "../../services/userServices/Service";
import food from "../../assets/food1.jpg";
import { formatCurrencyVN } from "../../utils/Format";

export default function CartPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [cart, setCart] = useState([]);
  const [vouchers, setVouchers] = useState();
  const [subtotal, setSubtotal] = useState(0);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [selectedRes, setSelectedRes] = useState();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSelectVoucher = (voucher) => {
    setSelectedVoucher(voucher);
    setShowPopup(false);
  };

  const reloadCart = async () => {
    await getCart(user.token).then((res) => {
      setCart(res);
      const found = res.find(
        (item) => selectedRes && item.restaurantId === selectedRes.restaurantId
      );
      if (found) {
        setSelectedRes(found);
        setSubtotal(found.summary.subtotal);
      } else {
        setSelectedRes(null);
        setSubtotal(0);
      }
    });
  };

  const handleDeleteCart = async (orderId, token, index) => {
    await deleteCart(orderId, token, index);
  };

  const handleDeleteResCart = async (res) => {
    for (let i = res.items.length - 1; i >= 0; i--) {
      await deleteCart(res.id, user.token, i);
    }
    reloadCart();
  };

  const handlePayment = () => {
    if (selectedRes) {
      navigate("/payment", {
        state: {
          cart: { id: selectedRes.id, items: selectedRes.items },
          subtotal: subtotal,
          discount: selectedVoucher,
        },
      });
    } else alert("Chưa chọn món ăn");
  };

  useEffect(() => {
    getCart(user.token).then((res) => {
      console.log(res);
      setCart(res);
    });
    getVoucher(user.userId, user.token).then((res) => {
      setVouchers(res);
    });
  }, [user]);
  return (
    <div className="w-[70vw] mx-auto ">
      <div className="flex items-center">
        <button
          className="flex items-center justify-start"
          onClick={() => navigate("/")}
        >
          <FontAwesomeIcon icon={faAngleLeft} className="text-xl mr-1" />
          trở lại
        </button>
        <h2 className="dancing-script-700 text-5xl flex-1 text-center">
          Giỏ hàng của tôi
        </h2>
      </div>
      <div className="flex mt-8 space-x-10">
        <div className="p-7 rounded-3xl w-[65%] bg-white shadow">
          <h3 className="font-bold text-xl mb-4 text-center">
            Chỉ cho phép chọn 1 nhà hàng cho 1 đơn
          </h3>
          <div className="space-y-5 py-5 bg-gray-100 p-5 rounded-2xl">
            {cart.length === 0 ? (
              <div className="text-center space-y-3">
                <p className="text-2xl text-gray-400">
                  Hiện chưa có món ăn nào trong Giỏ hàng{" "}
                </p>
                <button
                  className="text-xl p-2 bg-green-500 hover:bg-green-600 transition text-white rounded-xl"
                  onClick={() => navigate("/")}
                >
                  Thêm món ăn
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedRes === item}
                      onChange={() => {
                        setSelectedRes(
                          selectedRes?.restaurantId === item.restaurantId
                            ? null
                            : item
                        );
                        setSubtotal(item.summary.subtotal);
                      }}
                    />
                    <p className="font-semibold">{item.restaurant.name}</p>
                    <button
                      className="ml-auto mr-3"
                      onClick={() => handleDeleteResCart(item)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                  <div className="space-y-7">
                    {item.items.map((item1, index1) => (
                      <CartItem
                        key={index1}
                        cartItem={item1}
                        orderId={item.id}
                        index={index1}
                        token={user.token}
                        reloadCart={reloadCart}
                        handleDelete={handleDeleteCart}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className=" w-[30%] ">
          <div className="space-y-7 p-4 px-7 shadow h-fit rounded-4xl bg-white">
            <div
              className="flex items-center justify-between font-bold text-xl "
              onClick={() => setShowPopup(true)}
            >
              Voucher
              <FontAwesomeIcon icon={faAngleRight} />
            </div>
            <p className="text-red-700 font-semibold">Chọn voucher</p>
          </div>
          <div className="space-y-7 p-4 px-7 shadow h-fit rounded-4xl mt-5 font-semibold bg-white">
            <p>chi tiết thanh toán</p>
            <div className="flex justify-between">
              <p>Tạm tính</p>
              <p>{formatCurrencyVN(subtotal)}</p>
            </div>
            <div className="flex justify-between">
              <p>Giảm giá</p>
              <p className="text-red-500">
                - {formatCurrencyVN(selectedVoucher?.value)}
              </p>
            </div>
            <div className="flex justify-between">
              <p>Phí giao hàng</p>
              <p>{formatCurrencyVN(30000)}</p>
            </div>
            <hr className="w-[90%] mx-auto" />
            <div className="flex justify-between text-xl">
              <p>Tổng cộng</p>
              <p className="text-green-500 ">
                {formatCurrencyVN(
                  subtotal + 30000 - selectedVoucher?.value || subtotal + 30000
                )}
              </p>
            </div>
          </div>
          <button
            className="w-full bg-[rgba(227,70,63,1)] hover:bg-red-700 transition rounded-3xl shadow font-bold p-3 text-white text-xl mt-7"
            onClick={handlePayment}
          >
            Thanh toán
          </button>
        </div>
      </div>
      {showPopup && (
        <VoucherPopUp
          handleClose={setShowPopup}
          vouchers={vouchers}
          onSelectVoucher={handleSelectVoucher}
          subtotal={subtotal}
        />
      )}
    </div>
  );
}
