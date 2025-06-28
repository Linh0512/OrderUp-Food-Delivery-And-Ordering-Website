import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

import { formatCurrencyVN } from "../utils/Format";
import ProductPopUp from "./ProductPopUp";

export default function CartItem({
  orderId,
  cartItem,
  index,
  token,
  reloadCart,
  handleDelete,
}) {
  const [showPopup, setShowPopup] = useState(false);
  const deleteOne = async () => {
    await handleDelete(orderId, token, index);
    reloadCart();
  };
  return (
    <div className="flex w-full shadow caret-transparent bg-white p-3">
      <button
        className="mr-3 text-red-500 bg-red-100 my-auto p-1 rounded-lg"
        onClick={deleteOne}
      >
        <FontAwesomeIcon icon={faX} />
      </button>
      <img
        src={ cartItem.dishImage}
        alt={cartItem.dishName}
        className="w-[15%] h-auto object-contain shadow"
      />
      <div className="flex justify-between w-full ml-5 py-2">
        <div className="flex-col flex justify-between">
          <p className="font-bold">{cartItem.dishName}</p>
          <p className="italic text-sm text-gray-400">
            {cartItem.selectedOptions.map(
              (item) => item.optionName + ": " + item.choiceName + ", "
            )}
          </p>
          <p>Ghi chú: {cartItem.specialInstructions}</p>
        </div>
        <p className="font-semibold">Số lượng: {cartItem.quantity}</p>
        <div className="flex-col justify-between flex">
          <p className="font-semibold">
            {formatCurrencyVN(cartItem.subtotal)}
          </p>
          <div className="text-red-700 ">
            <button onClick={() => setShowPopup(true)}>Chỉnh sửa</button>
          </div>
        </div>
      </div>
      {showPopup && (
        <ProductPopUp
          handleClose={setShowPopup}
          cartItem={cartItem}
          orderId={orderId}
          index={index}
          token={token}
          reloadCart={reloadCart}
        />
      )}
    </div>
  );
}
