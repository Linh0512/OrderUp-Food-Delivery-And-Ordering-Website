import { useState } from "react";
import ProductPopUp from "./ProductPopUp";
import { formatCurrencyVN } from "../utils/Format";


export default function ProductCard({
  productDetail,
  token,
  quantity,
  reloadShop,
  shopActive
}) {
  const [showPopUp, setShowPopup] = useState(false);

  const handleShowPopUp=()=>{
    if(shopActive)
      if(productDetail.active)
        setShowPopup(true)
      else
        alert("Hiện tại món ăn không khả dụng !!!")
    else
      alert("Hiện tại cửa hàng đang tạm nghỉ !!!")
  }
  return (
    <>
      <div
        className={`flex p-3 space-x-5 shadow-xl bg-white transition-all duration-300 ${
          !productDetail.active
            ? "opacity-60 cursor-not-allowed"
            : "hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
        }`}
      >
        <img
          src={productDetail.image}
          alt={productDetail.name}
          className="size-24 shadow-xl object-cover"
        />
        <div className="flex-1 min-w-0 space-y-3">
          <h3 className="font-bold text-lg">{productDetail.name}</h3>
          <p className="truncate text-sm">{productDetail.description}</p>
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">
              {formatCurrencyVN(productDetail.basePrice)}
            </p>
            <div className="flex items-center space-x-4">
              {quantity && (
                <div className="size-7 text-center rounded-full border border-orange-500">
                  {quantity}
                </div>
              )}
              <button
                className="bg-orange-500 px-2 py-0.5 text-lg rounded-lg text-white font-semibold hover:bg-orange-600 transition-colors duration-150"
                onClick={handleShowPopUp}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
      {showPopUp && (
        <ProductPopUp
          handleClose={setShowPopup}
          cartItem={productDetail}
          token={token}
          reloadShop={reloadShop}
        />
      )}
    </>
  );
}
