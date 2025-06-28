import React, { useEffect, useRef, useState } from "react";
import VoucherCard from "./VoucherCard";

export default function VoucherPopUp({ handleClose, vouchers, onSelectVoucher,subtotal}) {
  const selectRef = useRef(null);
  const [voucherCode,setVoucherCode]=useState()
  
  const handleSelect=()=>{
    if(!voucherCode)
      return
    const found=vouchers.find(v=>v.code===voucherCode)
    if(found)
      onSelectVoucher(found)
    else
      alert("Mã giảm giá không hợp lệ!");
  }

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
        className="bg-white p-6 rounded-3xl shadow-lg w-[40vw] overflow-scroll h-[65%] overflow-x-hidden"
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
            onChange={(e)=>setVoucherCode(e.target.value)}
          />
          <button className="text-white p-3 px-5 bg-[rgba(227,70,63,1)] hover:bg-red-700 transition rounded-2xl" onClick={handleSelect}>
            Áp dụng
          </button>
        </div>
        <p className="mb-4 text-sm text-gray-400">
          Hoặc chọn mã giảm giá của bạn.
        </p>
        <div className="space-y-6 ">
          {vouchers.length!==0 ? (
            vouchers.map((item, index) => (
              <VoucherCard key={index} voucher={item} onSelect={() => onSelectVoucher(item)} subtotal={subtotal}/>
            ))
          ) : (
            <div className="h-50 w-full flex items-center justify-center">
              <p className="font-bold text-2xl text-gray-400">Hiện tại không có mã giảm giá nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
