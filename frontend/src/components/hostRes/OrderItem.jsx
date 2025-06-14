import React from "react";
import product from "../../assets/product.jpg";

export default function OrderItem() {
  return (
    <div className="flex w-full shadow rounded caret-transparent bg-green-50 p-3">
      <img
        src={product}
        alt=""
        className="w-[8%] h-auto object-contain shadow"
      />
      <div className="flex justify-between w-full ml-5">
        <div className="space-y-2">
          <p className="font-bold">Cơm chiên dương châu</p>
          <p className="text-sm text-gray-500">Thêm ớt trái không hành</p>
        </div>
        <p className="font-semibold">Số lượng: 1</p>
        <div className="space-y-2">
          <p className="font-semibold">100.000đ</p>
          <p className="text-sm text-gray-500">50.000đ/món</p>
        </div>
      </div>
    </div>
  );
}
