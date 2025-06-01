import React from "react";
import VoucherCard from "./VoucherCard";

export default function VoucherPopUp({ handleClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-3xl shadow-lg w-[40vw]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold ">Mã khuyến mãi</h2> 
          <button
            className="border bg-red-700 text-white px-2"
            onClick={() => handleClose(false)}
          >
            X
          </button>
        </div>
        <div className="flex items-center justify-between mb-4">
            <input type="text" name="" id="" placeholder="nhập mã giảm giá của bạn" className="border p-2 w-[80%] rounded-xl"/>
            <button className="text-white p-3 bg-red-600 rounded-2xl">Áp dụng</button>
        </div>
        <p className="mb-4 text-sm text-gray-400">Hoặc chọn mã giảm giá của bạn.</p>
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <VoucherCard key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
