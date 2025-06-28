import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrencyVN } from "../utils/Format";
import ReviewRes from "./ReviewRes";

export default function HistotyItem({ item }) {
  const [showPopUp, setShowPopup] = useState(false);
  const nav = useNavigate();

  const handleReview = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowPopup(true);
  };

  return (
    <div className="flex w-full shadow bg-white">
      <div className="w-36 h-32">
        <img src={item.restaurantImage} alt="" className="w-36 h-32 object-cover " />
      </div>
      <div className="w-full flex flex-col justify-around px-9">
        <div className="flex justify-between w-full p-3 ">
          <div className="space-y-10">
            <p className="font-bold text-xl">{item.restaurantName}</p>
            <div className="space-x-5">
              {item.review ? (
                <span className="font-semibold text-red-600">
                  Đã đánh giá
                </span>
              ) : (
                <button onClick={handleReview} className="font-semibold">
                  Đánh giá
                  <FontAwesomeIcon icon={faArrowRight} className="ml-3" />
                </button>
              )}
              <button
                onClick={() => nav(`/history/${item.id}`)}
                className="font-semibold"
              >
                Xem chi tiết
                <FontAwesomeIcon icon={faArrowRight} className="ml-3" />
              </button>
            </div>
          </div>
          <div className="space-y-10">
            <p className="italic text-gray-400">{item.orderDate}</p>
            <p className="font-semibold text-lg  text-red-500">
              {formatCurrencyVN(item.orderTotalAmount)}
            </p>
          </div>
        </div>
      </div>
      {showPopUp ? (
        <ReviewRes handleClose={setShowPopup} resDetail={item} />
      ) : (
        ""
      )}
    </div>
  );
}
