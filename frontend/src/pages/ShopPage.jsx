import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BigShopCard from "../components/BigshopCard";
import CustomSelect from "../components/CustomSelect";
import Pagination from "../components/Pagination";
import ProductCard from "../components/ProductCard";
import ProductCategory from "../components/ProductCategory";
import ReviewBox from "../components/ReviewBox";
import { getShopDetail } from "../services/userServices/Service";
import { useAuth } from "../components/common/AuthContext";

export default function ShopPage() {
  const PRODUCT_LIMIT = 12;
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [review, setReview] = useState();
  const { id } = useParams();
  const { user } = useAuth();
  const options = [
    { name: "Tất cả", value: 0 },
    { name: "Tăng dần", value: 1 },
    { name: "Giảm dần", value: -1 },
  ];
  const [priceSort, setPriceSort] = useState(0);
  const [shopDetail, setShopDetail] = useState({});

  useEffect(() => {
    getShopDetail(id, user.token).then((res) => {
      console.log(res.data);
      setShopDetail({
        name: res.data.restaurantName,
        priceRange: res.data.restaurantPriceRange,
        review: res.data.restaurantReviewCount,
        star: res.data.restaurantStar,
        address: res.data.restaurantAddress,
        timeRange: res.data.restaurantTimeRange,
        isActive: res.data.restaurantIsActive,
      });
      setProducts(res.data.dishes);
      setCount(res.data.dishes.length);
      setReview({
        ...res.data.ratingBreakdown,
        total: res.data.restaurantReviewCount,
        star: res.data.restaurantStar,
      });
    });
  }, [id, user.token]);
  return (
    <div className="w-[80vw] mx-auto">
      <div className="flex w-full gap-20">
        <div className="w-[65%]">
          <BigShopCard shop={shopDetail} />
        </div>
        <div className="w-[30%]">{review && <ReviewBox review={review} id={id}/>}</div>
      </div>
      <div className="mt-10 flex">
        <div className="space-y-4 w-1/5">
          <CustomSelect options={options} handleChange={setPriceSort} />
          <ProductCategory />
        </div>
        <div className=" w-4/5 space-y-5">
          <div className="flex items-center border p-2 gap-3 bg-white ">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              name=""
              id=""
              placeholder="Tìm món"
              className="w-full focus:outline-none focus:ring-0 focus:border-none "
            />
          </div>
          <div className="grid grid-cols-3 gap-7 ">
            {Array.isArray(products) &&
              products
                .slice((page - 1) * PRODUCT_LIMIT, page * PRODUCT_LIMIT)
                .map((item, index) => (
                  <ProductCard key={index} productDetail={item} />
                ))}
          </div>
          <Pagination
            limit={PRODUCT_LIMIT}
            count={count}
            current={page}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
