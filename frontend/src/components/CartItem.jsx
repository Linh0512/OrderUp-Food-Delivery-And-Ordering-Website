import { useState } from "react";
import product from "../assets/product.jpg";
import ProductPopUp from "./ProductPopUp";
import { formatCurrencyVN } from "../utils/Format";

export default function CartItem({ cartItem }) {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <div className="flex w-full shadow caret-transparent bg-white p-3">
      <img
        src={product || cartItem.dishImage}
        alt={cartItem.dishName}
        className="w-[15%] h-auto object-contain shadow"
      />
      <div className="flex justify-between w-full ml-5 py-2">
        <div className="flex-col flex justify-between">
          <p className="font-bold">{cartItem.dishName}</p>
          <p className="italic text-sm text-gray-400">
            {cartItem.selectedOptions.map(
              (item) => item.optionName + ": " + item.choiceName+', '
            )}
          </p>
          <p>Ghi chú: {cartItem.specialInstructions}</p>
        </div>
        <p className="font-semibold">Số lượng: {cartItem.quantity}</p>
        <div className="flex-col justify-between flex">
          <p className="font-semibold">
            {formatCurrencyVN(cartItem.unitPrice)}
          </p>
          <button className="text-red-700" onClick={() => setShowPopup(true)}>
            Chỉnh sửa
          </button>
        </div>
      </div>
      {showPopup && (
        <ProductPopUp handleClose={setShowPopup} cartItem={cartItem} />
      )}
    </div>
  );
}
