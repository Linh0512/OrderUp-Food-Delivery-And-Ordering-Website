import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import product from "../../assets/product.jpg";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

export default function ProductCard({ item, Loading }) {
  const nav = useNavigate();
  if (Loading)
    return <div className="w-120 animate-pulse bg-gray-300 h-30"></div>;
  return (
    <div
      className="flex w-full shadow rounded caret-transparent bg-white p-3"
      onClick={() => nav(`/Product/${item.id}`)}
    >
      <img
        src={product}
        alt=""
        className="w-[20%] h-auto object-contain shadow"
      />
      <div className="flex justify-between w-full ml-5 py-3">
        <div className="space-y-1">
          <p className="font-bold">{item.name}</p>
          <p className="text-sm text-gray-500"> cơm </p>
        </div>
        <div className="space-y-8">
          <p className="text-sm text-yellow-500 text-end">
            5 <FontAwesomeIcon icon={faStar} />{" "}
          </p>
          <p className="font-semibold">{item.basePrice}đ</p>
        </div>
      </div>
    </div>
  );
}
