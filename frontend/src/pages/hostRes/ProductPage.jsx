import {
  faBowlFood,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import CustomSelect from "../../components/CustomSelect";
import ProductCard from "../../components/hostRes/ProductCard";
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/common/AuthContext";
import { getAllDish } from "../../services/hosResServices/Product";

export default function ProductPage() {
  const LIMIT = 12;
  const [priceSort, setPriceSort] = useState(0);
  const [search, setSearch] = useState("");
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dish, setDish] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const { user, resId } = useAuth();

  useEffect(() => {
    if (resId) {
      getAllDish(resId, user.token).then((res) => {
        console.log(res.data)
        setDish(res.data);
        setCount(res.count);
      });
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [user,resId]);

  let sortedDish = [...dish];

  if (priceSort === 1) {
    sortedDish.sort((a, b) => a.basePrice - b.basePrice);
  } else if (priceSort === -1) {
    sortedDish.sort((a, b) => b.basePrice - a.basePrice);
  }

  return (
    <div className="w-full p-3 space-y-5">
      <div className="flex items-center space-x-2 font-semibold text-2xl mb-4">
        <FontAwesomeIcon icon={faBowlFood} />
        <p>Món ăn</p>
      </div>
      <div className="bg-gray-200 flex justify-between p-2 px-4 rounded-xl text-xl font-semibold items-center">
        <p>{dish.length} Món ăn</p>
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </div>
      </div>
      <div className="bg-gray-200 p-3 px-5 rounded-xl flex items-center text-sm">
        <p className="text-xl font-semibold">{dish.length} kết quả</p>
        <div className="flex items-center ml-auto space-x-4">
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
          : sortedDish
              .filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((item, index) => <ProductCard key={index} item={item} />)}
      </div>
      <Pagination
        limit={LIMIT}
        count={count}
        current={page}
        onPageChange={setPage}
      />
    </div>
  );
}
