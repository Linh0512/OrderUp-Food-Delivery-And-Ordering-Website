import { faClock, faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

export default function ShopCard({ shopDetail }) {
  const navigate = useNavigate();

  function handleMove() {
      navigate(`shop/${shopDetail.id}`);
  }
  return (
    <div
      className={`flex flex-col rounded-2xl shadow-xl bg-white transition-all duration-300 ${
        !shopDetail.active
          ? "opacity-60"
          : "hover:shadow-2xl hover:-translate-y-1"
      }`}
    >
      <img
        src={shopDetail.image}
        alt={shopDetail.name}
        className="rounded-t-2xl w-full h-60 object-cover"
      />
      <div className="p-2 space-y-1 flex flex-col justify-center">
        <h3 className="font-bold text-xl py-2 truncate">{shopDetail.name}</h3>
        <p className="text-sm">{shopDetail.address}</p>
        <hr />
        <div className="flex items-center justify-between text-yellow-500">
          <div className="flex space-x-2">
            <p>{shopDetail.review}</p>
            <p> {shopDetail.star} ★ </p>
          </div>
          <button
            className="bg-[rgba(60,152,80,1)] hover:bg-green-800 transition border text-white p-1 px-2 rounded-2xl "
            onClick={handleMove}
          >
            Đặt món
          </button>
        </div>
        <div className="flex justify-between items-center ">
          <p
            className={`${
              shopDetail.active ? "text-[rgba(109,213,29,1)]" : "text-red-600"
            } flex items-center`}
          >
            <span
              className={`size-3 rounded-full mr-2 ${
                shopDetail.active ? "bg-[rgba(109,213,29,1)]" : "bg-red-600"
              }`}
            ></span>
            {shopDetail.active ? "Mở cửa" : "Đóng cửa"}
          </p>
          <div className="space-x-2 flex items-center">
            <FontAwesomeIcon icon={faClock} />
            <p>{shopDetail.timeRange}</p>
          </div>
        </div>
        <p className="text-xl py-2">
          <FontAwesomeIcon icon={faMoneyBill} className="mr-2" />
          {shopDetail.priceRange} VNĐ
        </p>
      </div>
    </div>
  );
}
