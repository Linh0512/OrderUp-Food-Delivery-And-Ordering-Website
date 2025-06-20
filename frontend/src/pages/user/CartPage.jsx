import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CartItem from "../../components/CartItem";
import VoucherPopUp from "../../components/voucherPopUp";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/common/AuthContext";
import { getCart, getVoucher } from "../../services/userServices/Service";

export default function CartPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [cart, setCart] = useState([]);
  const [vouchers, setVouchers] = useState();
  const [subtotal, setSubtotal] = useState(0);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSelectVoucher = (voucher) => {
    setSelectedVoucher(voucher);
    setShowPopup(false); // Đóng popup sau khi chọn
  };

  useEffect(() => {
    getCart(user.token).then((res) => {
      console.log(res)
      setCart(res);
      setSubtotal(res.subtotal);
    });
    getVoucher("684844b61a05cf815c50eb73", user.token).then((res) => {
      console.log(res);
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
          <h3 className="font-semibold m-4">
            {" "}
            có {cart.length} sản phẩm trong giỏ hàng{" "}
          </h3>
          <div className="space-y-7 py-5 bg-gray-100 p-5 rounded-2xl">
            {cart.map((item, index) => (
              <CartItem key={index} cartItem={item} />
            ))}
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
              <p>{subtotal}</p>
            </div>
            <div className="flex justify-between">
              <p>Giảm giá</p>
              <p className="text-red-500">- {selectedVoucher?selectedVoucher.value:"0"}</p>
            </div>
            <div className="flex justify-between">
              <p>Phí giao hàng</p>
              <p>30000</p>
            </div>
            <hr className="w-[90%] mx-auto" />
            <div className="flex justify-between text-xl">
              <p>Tổng cộng</p>
              <p className="text-green-500 ">{subtotal+30000-selectedVoucher?.value||subtotal+30000}</p>
            </div>
          </div>
          <button
            className="w-full bg-[rgba(227,70,63,1)] hover:bg-red-700 transition rounded-3xl shadow font-bold p-3 text-white text-xl mt-7"
            onClick={() => navigate("/payment", { state: { cart,subtotal,discount:selectedVoucher?.value } })}
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
        />
      )}
    </div>
  );
}
