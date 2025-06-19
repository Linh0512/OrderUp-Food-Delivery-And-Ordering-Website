import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import product from "../assets/product.jpg";
import ReviewRes from "./ReviewRes";
import { Link, useNavigate } from "react-router-dom";

export default function HistotyItem({ item }) {
  const [showPopUp, setShowPopup] = useState(false);
  const nav = useNavigate();

  const handleReview = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowPopup(true);
  };

  return (
    <div
      className="flex w-full shadow bg-white"
      onClick={() => nav(`/history/${item.id}`)}
    >
      <img src={product} alt="" className="w-[12%] h-auto object-contain" />
      <div className="w-full flex flex-col justify-around px-9">
        <div className="flex justify-between w-full p-3 ">
          <div className="space-y-10">
            <p className="font-bold text-xl">{item.restaurantName}</p>
            <button onClick={handleReview} className="font-semibold">
              Đánh giá
              <FontAwesomeIcon icon={faArrowRight} className="ml-3" />
            </button>
          </div>
          <div className="space-y-10">
            <p className="italic text-gray-400">{item.orderDate}</p>
            <p className="font-semibold">{item.orderTotalAmount}</p>
          </div>
        </div>
      </div>
      {showPopUp ? <ReviewRes handleClose={setShowPopup} resDetail={item} /> : ""}
    </div>
  );
}
