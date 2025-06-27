import { useEffect, useState } from "react";
import Category from "../components/Category";
import Pagination from "../components/Pagination";
import ShopCard from "../components/ShopCard";
import {
  getAllShops,
  getShopsByCuisine,
} from "../services/userServices/Service";
import { useOutletContext } from "react-router-dom";

export default function HomePage() {
  const { search } = useOutletContext();
  const SHOP_LIMIT = 12;
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [category, setcategory] = useState("Tất cả");

  const categories = [
    { name: "Tất cả", color: "bg-green-500" },
    { name: "Taco", color: "bg-orange-400" },
    { name: "Phở", color: "bg-red-400" },
    { name: "Cháo", color: "bg-blue-300" },
    { name: "Bánh mì", color: "bg-pink-400" },
    { name: "Pizza", color: "bg-blue-400" },
    { name: "Burger", color: "bg-green-400" },
  ];

  const priceRanges = [
    { name: "Tất cả", color: "bg-green-500" },
    { name: "20 - 50 nghìn", color: "bg-yellow-400" },
    { name: "50 - 100 nghìn", color: "bg-green-300" },
    { name: "100 - 200 nghìn", color: "bg-green-600" },
    { name: "Trên 200 nghìn", color: "bg-green-700" },
  ];

  const otherCriteria = [
    { name: "Tất cả", color: "bg-green-500" },
    { name: "Được đánh giá cao", color: "bg-yellow-500" },
    { name: "Giao nhanh", color: "bg-blue-500" },
    { name: "Khuyến mãi", color: "bg-pink-500" },
  ];
  const [shops, setShops] = useState([]);

  useEffect(() => {
    if (category === "Tất cả") {
      getAllShops(page - 1, SHOP_LIMIT).then((res) => {
        console.log(res.data);
        setShops(res.data);
        setCount(res.count);
      });
    } else {
      getShopsByCuisine(category, page - 1, SHOP_LIMIT).then((res) => {
        setShops(res.data);
        setCount(res.count);
      });
    }
  }, [page, category]);

  return (
    <div className="w-[80vw] mx-auto flex">
      <div className="w-[80%] space-y-3">
        <h1 className="text-center text-5xl m-2 mt-3 dancing-script-700">
          Các nhà hàng phổ biến
        </h1>
        <hr className="w-[90%] mx-auto mb-3" />
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-10 mb-7">
          {Array.isArray(shops) &&
            shops
              .filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((item, index) => <ShopCard key={index} shopDetail={item} />)}
        </div>
        <Pagination
          limit={SHOP_LIMIT}
          count={count}
          current={page}
          onPageChange={setPage}
        />
      </div>
      <div className="space-y-3 mt-10 ml-4">
        <Category
          header={"Danh mục món ăn"}
          items={categories}
          handleSelect={setcategory}
        />
        <Category header={"Mức giá"} items={priceRanges} />
        <Category header={"Tiêu chí khác"} items={otherCriteria} />
      </div>
    </div>
  );
}
