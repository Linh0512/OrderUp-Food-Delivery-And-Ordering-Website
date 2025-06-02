import React from "react";
import BigShopCard from "../components/BigshopCard";
import ReviewBox from "../components/ReviewBox";
import ProductCategory from "../components/ProductCategory";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function ShopPage() {
  return (
    <div className="w-[80vw] mx-auto">
      <div className="flex w-full gap-3">
        <div className="w-[70%]">
          <BigShopCard />
        </div>
        <div className="w-[30%]">
          <ReviewBox />
        </div>
      </div>
      <div className="mt-10 flex">
        <div className="space-y-4 w-1/5">
          <select className="border p-2 text-lg rounded-xl">
            <option defaultChecked>Sắp xếp theo</option>
            <option value="1">tăng dần</option>
            <option value="-1">giảm dần</option>
          </select>
          <ProductCategory />
        </div>
        <div className=" w-4/5 space-y-5">
        <div className="flex items-center border p-2 gap-3">
          <FontAwesomeIcon icon={faSearch}/>
          <input type="text" name="" id="" placeholder="Tìm món" className="w-full focus:outline-none focus:ring-0 focus:border-none "/>
        </div>
          <div className="grid grid-cols-3 gap-7 ">
            {Array.from({ length: 20 }).map((_, index) => (
              <ProductCard key={index} />
            ))}
          </div>
          <Pagination/>
        </div>
      </div>
    </div>
  );
}
