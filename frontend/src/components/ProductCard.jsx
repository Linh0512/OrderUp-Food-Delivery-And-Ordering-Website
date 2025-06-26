import { useState } from "react";
import ProductPopUp from "./ProductPopUp";
import { formatCurrencyVN } from "../utils/Format";
import product from '../assets/product.jpg'

export default function ProductCard({ productDetail ,token}) {
  const [showPopUp,setShowPopup]=useState(false)
  return (
    <div className="flex shadow p-3 space-x-5 items-center bg-white">
      <img
        src={product||productDetail.image}
        alt={productDetail.name}
        className="size-24 shadow-xl"
      />
      <div className="flex-1 min-w-0 space-y-3">
        <h3 className="font-bold text-lg">{productDetail.name}</h3>
        <p className="truncate text-sm">{productDetail.description}</p>
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">{formatCurrencyVN(productDetail.basePrice)}</p>
          <button className="bg-orange-500 px-2 py-0.5 text-lg rounded-lg text-white font-semibold hover:bg-orange-600 transition-colors duration-150" onClick={()=>setShowPopup(true)}>
            +
          </button>
        </div>
      </div>
      {showPopUp&&<ProductPopUp handleClose={setShowPopup} cartItem={productDetail} token={token}/>}
    </div>
  );
}
