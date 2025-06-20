import React, { useEffect, useRef, useState } from "react";
import product from "../assets/product.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { formatCurrencyVN } from "../utils/Format";
import { getDishbyId } from "../services/hosResServices/Product";
import { addCart, updateCart } from "../services/userServices/Service";

export default function ProductPopUp({
  orderId,
  cartItem,
  handleClose,
  token,
  index,
  reloadCart
}) {
  const productRef = useRef(null);
  const [showError,setShowError]=useState(false)
  const [quantity, setQuantity] = useState(cartItem?.quantity || 1);
  const [dish, setDish] = useState({});
  const [specialInstructions, setSpecialInstructions] = useState(
    cartItem.specialInstructions || ""
  );
  const [selectedOptions, setSelectedOptions] = useState(() => {
    if (cartItem?.selectedOptions) {
      return cartItem.selectedOptions;
    }
    return [];
  });
  const [data, setData] = useState({
    dishId: cartItem.dishId || cartItem.id,
    quantity: quantity,
    selectedOptions: selectedOptions,
    specialInstructions: specialInstructions,
  });

  const isChoiceSelected = (optionIndex, choiceName) => {
    return selectedOptions.some(
      (option, index) =>
        index === optionIndex && option.choiceName === choiceName
    );
  };

  const hanndleOptionsChange = (optIndex, choiceName, optionName) => {
    setSelectedOptions((prev) => {
      const newOptions = [...prev];
      const existingOptionIndex = newOptions.findIndex(
        (_, index) => index === optIndex
      );
      if (existingOptionIndex !== -1) {
        newOptions[existingOptionIndex] = {
          optionName,
          choiceName,
        };
      } else {
        newOptions.push({
          optionName,
          choiceName,
        });
      }
      setData({ ...data, selectedOptions: newOptions });
      return newOptions;
    });
  };

  const handleSave = async (index) => {
    if (!orderId)
    {
      if(dish.options.length===selectedOptions.length)
      {
        addCart(token, data);
        handleClose(false);
      }
      else
        setShowError(true)
    }
    else {
      const {dishId,...exceptId}=data
      await updateCart(orderId,token,exceptId,index);
      reloadCart()
      handleClose(false);
    }
  };

  useEffect(() => {
    getDishbyId(cartItem.dishId || cartItem.id).then((res) => {
      console.log(res)
      setDish(res);
    });
  }, [cartItem]);

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
        <img
          src={product || cartItem.dishImage}
          alt={cartItem.dishName || cartItem.name}
          className="rounded-t-4xl shadow"
        />
        <div className="p-6">
          <div className="pb-3 mb-2 space-y-2">
            <div className="font-semibold flex justify-between">
              <p>{cartItem.dishName || cartItem.name}</p>
              <p>
                {formatCurrencyVN(cartItem.unitPrice || cartItem.basePrice)}
              </p>
            </div>
            <p className="text-gray-400 text-sm">{dish.description}</p>
          </div>
          {showError&&<div className="text-red-500 bg-red-100 p-2 font-semibold text-center">Lựa chọn đủ các option</div>}
          <div className="mb-4 ">
            {dish?.options?.map((item, index) => (
              <div key={index}>
                <p className="font-semibold mb-2">{item.name}</p>
                {item.choices?.map((item1, index1) => (
                  <div className="flex justify-between space-y-2" key={index1}>
                    <div className="flex space-x-2">
                      <input
                        type="radio"
                        value={item1.name}
                        checked={isChoiceSelected(index, item1.name)}
                        onChange={() =>
                          hanndleOptionsChange(index, item1.name, item.name)
                        }
                      />
                      <p>{item1.name}</p>
                    </div>
                    <p>+{formatCurrencyVN(item1.price)}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <p className="font-semibold">Ghi chú</p>
          <input
            type="text"
            defaultValue={specialInstructions}
            className="w-full p-2 border rounded-xl my-4 focus:outline-none caret-black"
            onChange={(e) => {
              setSpecialInstructions(e.target.value);
              setData({ ...data, specialInstructions: e.target.value });
            }}
          />
          <div className="flex justify-between items-center bg-gray-100 p-2 rounded-xl">
            <div className="flex font-bold text-lg justify-between w-[40%] items-center">
              <button
                className="border-2 px-1.5 hover:bg-black/20 transition"
                onClick={() => {
                  setQuantity(quantity + 1);
                  setData({ ...data, quantity: quantity + 1 });
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
              <p>{quantity}</p>
              <button
                className="border-2 px-1.5 hover:bg-black/20 transition"
                onClick={() => {
                  setQuantity((prev) => {
                    const newQuantity = prev > 1 ? prev - 1 : 1;
                    setData((data) => ({ ...data, quantity: newQuantity }));
                    return newQuantity;
                  });
                }}
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
            </div>
            <button
              onClick={() => {
                handleSave(index);
              }}
              className="bg-[rgba(227,70,63,1)] hover:bg-red-700 transition text-white px-4 py-2 rounded"
            >
              {!orderId ? "Thêm món" : "Thay đổi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
