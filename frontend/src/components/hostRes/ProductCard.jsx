import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import product from "../../assets/product.jpg";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function ProductCard() {
  return (
    <Link to={'/Product/123'}>
      <div className="flex w-full shadow rounded caret-transparent bg-white p-3">
        <img
          src={product}
          alt=""
          className="w-[8%] h-auto object-contain shadow"
        />
        <div className="flex justify-between w-full ml-5">
          <div className="space-y-2">
            <p className="font-bold">Cơm chiên dương châu</p>
            <p className="text-sm text-gray-500"> cơm </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-yellow-500 text-end">
              5 <FontAwesomeIcon icon={faStar} />{" "}
            </p>
            <p className="font-semibold">100.000đ</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
