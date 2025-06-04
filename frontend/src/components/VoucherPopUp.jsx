import React, { useEffect, useRef } from "react";
import VoucherCard from "./VoucherCard";

export default function VoucherPopUp({ handleClose }) {
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        handleClose(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div
        className="bg-white p-6 rounded-3xl shadow-lg w-[40vw]"
        ref={selectRef}
      >
        <h2 className="text-xl font-bold mb-5 ">Mã khuyến mãi</h2>
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            name=""
            id=""
            placeholder="nhập mã giảm giá của bạn"
            className="border p-2 w-[80%] rounded-xl"
          />
          <button className="text-white p-3 px-5 bg-[rgba(227,70,63,1)] hover:bg-red-700 transition rounded-2xl">
            Áp dụng
          </button>
        </div>
        <p className="mb-4 text-sm text-gray-400">
          Hoặc chọn mã giảm giá của bạn.
        </p>
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <VoucherCard key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
