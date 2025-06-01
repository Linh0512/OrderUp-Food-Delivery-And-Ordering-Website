import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import money from "../assets/money.png";
import zalopay from "../assets/zalopay.png";
import React from "react";
import CartItem from "../components/CartItem";

export default function PaymentPage() {
  return (
    <div className="w-[70vw] mx-auto    ">
      <div className="flex items-center">
        <button className="flex items-center justify-start">
          <FontAwesomeIcon icon={faAngleLeft} className="text-xl mr-1" />
          trở lại
        </button>
        <h2 className="dancing-script-700 text-5xl flex-1 text-center">
          Thanh Toán
        </h2>
      </div>
      <div className="flex">
        <div className="w-[70%] space-y-5">
          <div className="p-4 shadow-2xl rounded-3xl ">
            <h3 className="font-semibold ">Giao đến</h3>
            <p>Số 100 đường A, Phường B, Quận 7, Hồ Chí Minh, Việt Nam</p>
            <p className="font-semibold my-3">Ghi chú</p>
            <input
              type="text"
              name=""
              id=""
              placeholder="Ghi chú cho giao hàng, ví dụ: tầng phòng,..."
              className="border p-3 w-full rounded-2xl"
            />
          </div>
          <div className="p-4 shadow-2xl rounded-3xl">
            <h3 className="font-semibold text-xl mb-7">Người đặt hàng</h3>
            <div>
              <p className="font-semibold my-3">Họ và tên</p>
              <input
                type="text"
                name=""
                id=""
                placeholder="Nhập họ tên đầy đủ của bạn"
                className="border p-3 w-full rounded-2xl"
              />
            </div>
            <div>
              <p className="font-semibold my-3">Email</p>
              <input
                type="text"
                name=""
                id=""
                placeholder="Nhập email của bạn"
                className="border p-3 w-full rounded-2xl"
              />
            </div>
            <div>
              <p className="font-semibold my-3">Số điện thoại</p>
              <input
                type="text"
                name=""
                id=""
                placeholder="Nhập số điện thoại của bạn"
                className="border p-3 w-full rounded-2xl"
              />
            </div>
          </div>
          <div className="p-4 shadow-2xl rounded-3xl">
            <h3 className="font-semibold text-xl mb-7">
              Phương thức thanh toán
            </h3>
            <ul className="space-y-5">
              <div className="flex items-center w-[25%] justify-between">
                <input
                  type="radio"
                  className="w-5 h-5 accent-blue-600 rounded-full"
                />
                <img src={money} alt="" className="w-8" />
                <p>Tiền mặt</p>
              </div>
              <div className="flex items-center w-[25%] justify-between">
                <input
                  type="radio"
                  className="w-5 h-5 accent-blue-600 rounded-full"
                />
                <img src={zalopay} alt="" className="w-8" />
                <p>ZaloPay</p>
              </div>
            </ul>
          </div>
        </div>
        <div className=" w-[30%] ml-4">
          <div className="space-y-7 p-4 shadow-2xl h-fit rounded-4xl ">
            <div className="flex items-center justify-between font-bold text-xl ">
              Voucher
              <FontAwesomeIcon icon={faAngleRight} />
            </div>
            <p className="text-red-700 font-semibold">Chọn voucher</p>
          </div>
          <div className="space-y-7 p-4 shadow-2xl h-fit rounded-4xl mt-5 font-semibold">
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
            <hr className="w-[80%] mx-auto" />
            <div className="flex justify-between">
              <p>Tổng cộng</p>
              <p>171.000đ</p>
            </div>
          </div>
          <button className="w-full bg-red-700 rounded-3xl shadow-2xl font-bold p-3 text-white text-xl mt-7">
            Đặt hàng
          </button>
        </div>
      </div>
    </div>
  );
}
