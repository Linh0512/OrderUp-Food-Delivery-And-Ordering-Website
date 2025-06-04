import React, { useEffect, useRef } from "react";
import product from "../assets/product.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

export default function ProductPopUp({ handleClose }) {
  const productRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (productRef.current && !productRef.current.contains(event.target)) {
        handleClose(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClose]);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 ">
      <div className="bg-white shadow-lg w-100 rounded-4xl" ref={productRef}>
        <img src={product} alt="" className="rounded-t-4xl shadow" />
        <div className="p-6">
          <div className="font-semibold flex justify-between mb-4">
            <p>Cơm chiên dương châu</p>
            <p>59đ</p>
          </div>
          <p>ghi chú</p>
          <input type="text" className="w-full p-2 border rounded-xl my-4 focus:outline-none caret-black" />
          <div className="flex justify-between items-center bg-gray-100 p-2 rounded-xl">
            <div className="flex font-bold text-lg justify-between w-[40%] items-center">
              <button className="border-2 px-1.5 hover:bg-black/20 transition"><FontAwesomeIcon icon={faPlus}/></button>
              <p>1</p>
              <button className="border-2 px-1.5 hover:bg-black/20 transition"><FontAwesomeIcon icon={faMinus}/></button>
            </div>
            <button
              onClick={() => handleClose(false)}
              className="bg-[rgba(227,70,63,1)] hover:bg-red-700 transition text-white px-4 py-2 rounded"
            >
              xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
