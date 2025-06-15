import {
  faBowlFood,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import CustomSelect from "../../components/CustomSelect";
import ProductCard from "../../components/hostRes/ProductCard";
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";

export default function ProductPage() {
  const [priceSort, setPriceSort] = useState(0);
  const [dateSort, setDateSort] = useState(0);
  const [category, setCategory] = useState("all");
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  setTimeout(() => setIsLoading(false), 1000);
  return (
    <div className="w-full p-3 space-y-5">
      <div className="flex items-center space-x-2 font-semibold text-2xl mb-4">
        <FontAwesomeIcon icon={faBowlFood} />
        <p>Món ăn</p>
      </div>
      <div className="bg-gray-200 flex justify-between p-2 px-4 rounded-xl text-xl font-semibold items-center">
        <p>10 Món ăn</p>
        <button
          className="text-white bg-green-500 text-lg p-2 rounded-lg"
          onClick={() => nav("/Product/add")}
        >
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
      <div className="bg-gray-200 p-3 px-5 rounded-xl flex items-center text-sm">
        <p className="text-xl font-semibold">49 kết quả</p>
        <div className="flex items-center ml-auto space-x-4">
          <div className="bg-white flex items-center p-1 space-x-2 rounded">
            <p>Phân lọai:</p>
            <CustomSelect
              options={[
                { name: "Tất cả", value: "all" },
                { name: "1", value: "pending" },
                { name: "2", value: "cooking" },
                { name: "3", value: "shipping" },
                { name: "4", value: "deliveried" },
              ]}
              handleChange={setCategory}
            />
          </div>
          <div className="bg-white flex items-center p-1 space-x-2 rounded">
            <p>Ngày tạo:</p>
            <CustomSelect
              options={[
                { name: "Tất cả", value: 0 },
                { name: "Mới nhất", value: -1 },
                { name: "Cũ nhất", value: 1 },
              ]}
              handleChange={setDateSort}
            />
          </div>
          <div className="bg-white flex items-center p-1 space-x-2 rounded">
            <p>Giá tiền:</p>
            <CustomSelect
              options={[
                { name: "Tất cả", value: 0 },
                { name: "Tăng dần", value: 1 },
                { name: "Giảm dần", value: -1 },
              ]}
              handleChange={setPriceSort}
            />
          </div>
        </div>
      </div>
      <div className=" bg-gray-200 p-4 space-y-3 rounded-2xl grid grid-cols-3 gap-5">
        {isLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <ProductCard key={index} Loading={true} />
            ))
          : Array.from({ length: 10 }).map((_, index) => (
              <ProductCard key={index} />
            ))}
      </div>
      <Pagination />
    </div>
  );
}
