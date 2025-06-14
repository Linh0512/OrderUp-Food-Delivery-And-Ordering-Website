import { faMagnifyingGlass, faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import CategoryItem from "../../components/hostRes/CategoryItem";

export default function CategoryPage() {
  const [isAdd, setIsAdd] = useState(false);
  return (
    <div className="w-full p-3 space-y-5">
      <div className="flex items-center space-x-2 font-semibold text-2xl mb-4">
        <FontAwesomeIcon icon={faTag} />
        <p>Category</p>
      </div>
      <div className="bg-gray-200 flex justify-between p-2 px-4 rounded-xl text-xl font-semibold items-center">
        <p>10 Category</p>
        <button className="text-white bg-green-500 text-lg p-2 rounded-lg">
          Thêm +
        </button>
      </div>
      <div className="bg-gray-200 p-3 px-5 rounded-xl">
        <div className="w-full bg-white rounded-xl p-1.5 px-3 flex items-center">
          <input
            type="text"
            className="w-full focus:outline-none"
            placeholder="Tìm kiếm..."
          />
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </div>
      </div>
      <div className="flex space-x-5 ">
        <div className="p-2 w-[100%] bg-gray-200 space-y-5 rounded-2xl">
          <p className="font-semibold text-xl p-2">Danh Sách Category</p>
          {Array.from({ length: 5 }).map((_, index) => (
            <CategoryItem key={index} />
          ))}
        </div>
        <div className="bg-gray-100 shadow p-4 rounded-2xl border-l-4 border-green-500 h-fit w-full space-y-3">
          <p className="font-semibold text-xl mb-4 ">Thêm Categoty</p>
          <p>Tên Category</p>
          <input
            type="text"
            placeholder="Nhập tên category "
            className="p-2 px-4 border rounded-2xl text-gray-400 focus:outline-green-300 w-full"
          />
          <div className="space-x-4">
            <button className="p-2 bg-green-500 text-white rounded-xl">Thêm mới</button>
            <button className="p-2 bg-gray-500 text-white rounded-xl">Hủy</button>
          </div>
        </div>
      </div>
    </div>
  );
}
