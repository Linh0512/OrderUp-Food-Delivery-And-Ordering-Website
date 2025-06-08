import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CartItem from "../../components/CartItem";
import VoucherPopUp from "../../components/voucherPopUp";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="w-[70vw] mx-auto ">
      <div className="flex items-center">
        <button className="flex items-center justify-start" onClick={() => navigate("/shop")}>
          <FontAwesomeIcon
            icon={faAngleLeft}
            className="text-xl mr-1"
            
          />
          trở lại
        </button>
        <h2 className="dancing-script-700 text-5xl flex-1 text-center">
          Giỏ hàng của tôi
        </h2>
      </div>
      <div className="flex mt-8 space-x-10">
        <div className="p-7 rounded-3xl w-[65%] bg-white shadow">
          <h3 className="font-semibold m-4"> có 4 sản phẩm trong giỏ hàng </h3>
          <div className="space-y-7 py-5 bg-gray-100 p-5 rounded-2xl">
            {Array.from({ length: 4 }).map((_, index) => (
              <CartItem key={index} />
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
              <p>171.000đ</p>
            </div>
            <div className="flex justify-between">
              <p>Giảm giá</p>
              <p>171.000đ</p>
            </div>
            <div className="flex justify-between">
              <p>Phí giao hàng</p>
              <p>171.000đ</p>
            </div>
            <hr className="w-[90%] mx-auto" />
            <div className="flex justify-between">
              <p>Tổng cộng</p>
              <p>171.000đ</p>
            </div>
          </div>
          <button
            className="w-full bg-[rgba(227,70,63,1)] hover:bg-red-700 transition rounded-3xl shadow font-bold p-3 text-white text-xl mt-7"
            onClick={() => navigate("/payment")}
          >
            Thanh toán
          </button>
        </div>
      </div>
      {showPopup && <VoucherPopUp handleClose={setShowPopup} />}
    </div>
  );
}
