import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import product from "../assets/product.jpg";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function HistotyItem() {
  return (
    <div className="flex w-full shadow-2xl">
      <img src={product} alt="" className="w-[12%] h-auto object-contain" />
      <div className="w-full flex flex-col justify-around ml-9">
        <div className="flex justify-between w-full p-3 ">
        <div className="space-y-4">
          <p className="font-bold text-xl">Cơm chiên dương châu</p>
        </div>
        <p className="font-semibold">1</p>
        <p className="font-semibold">59.000đ</p>
      </div>
      <div className="flex gap-8 p-3 font-semibold">
        <button >
          Đánh giá
          <FontAwesomeIcon icon={faArrowRight} className="ml-3"/>
        </button>
        <button >
          Đặt hàng lại
          <FontAwesomeIcon icon={faArrowRight} className="ml-3"/>
        </button>
      </div>
      </div>
    </div>
  );
}
