import React from "react";
import product from "../assets/product.jpg";

export default function ProductPopUp({ handleClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 ">
      <div className="bg-white shadow-lg w-100 rounded-4xl">
        <img src={product} alt="" className="rounded-4xl"/>
        <div className="p-6">
          <div className="font-semibold flex justify-between mb-4">
            <p>Cơm chiên dương châu</p>
            <p >59đ</p>
          </div>
          <p>ghi chú</p>
          <input type="text" className="w-full p-2 border rounded-xl my-4"/>
          <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
            <div className="flex font-bold text-lg justify-between w-[40%] items-center">
                <button className="border size-7">+</button>
                <p>1</p>
                <button className="border size-7">-</button>
            </div>
            <button
            onClick={() => handleClose(false)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            xác nhận   
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}
