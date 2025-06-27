import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { getReview } from "../services/userServices/Service";
import { formatDateVN } from "../utils/Format";

export default function ReviewPopUp({
  ratingBars,
  rating,
  totalReviews,
  handleClose,
  idRes,
}) {
  const selectRef = useRef(null);
  const [review,setReview]=useState([])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        handleClose(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClose]);

  useEffect(()=>{
    getReview(idRes).then((res)=>{
      console.log(res.data)
      setReview(res.data)
    })
  },[idRes])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div
        className="bg-white w-[40vw] mx-auto border-2 shadow rounded-2xl overflow-scroll h-[80%] overflow-y-hidden overflow-x-hidden"
        ref={selectRef}
      >
        <h2 className="w-full shadow py-5 font-bold text-2xl">
          Đánh giá từ người dùng
        </h2>
        <div className="p-5 w-[60%] mx-auto">
          <div className="bg-white">
            <div className="flex items-center justify-between text-sm mb-2 px-6 py-2 bg-[rgba(217,217,217,0.4)] rounded-t-2xl">
              <div className="flex items-center space-x-1">
                <span className="text-lg font-semibold">{rating}</span>
                <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
              </div>
              <span className="text-gray-500">{totalReviews} đánh giá</span>
            </div>
          </div>
          <div className="space-y-1 text-sm text-gray-500 p-5 bg-[rgba(217,217,217,0.4)] rounded-b-2xl">
            {ratingBars.map((bar) => (
              <div key={bar.stars} className="flex items-center space-x-2">
                <span className="w-4">{bar.stars}</span>
                <div className="flex-1 bg-gray-300 rounded-full h-1">
                  <div
                    className="bg-yellow-400 h-1 rounded-full"
                    style={{ width: `${bar.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[rgba(192,192,192,1)] h-full">
          <div className="p-5 space-y-5">
            {review&&review.length>0?(review.map((review, index) => (
              <div
                key={index}
                className="text-start bg-white p-5 border rounded-2xl space-y-2"
              >
                <div className="space-x-3 flex items-center">
                  <img src={review.userAvatar} alt={review.userName} className="rounded-full size-10 object-cover shadow"/>
                  <span>{review.userName}</span>
                </div>
                <div>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <FontAwesomeIcon
                      icon={faStar}
                      key={index}
                      className={`${
                        review.rating > index ? "text-yellow-400" : ""
                      }`}
                    />
                  ))}
                  <span className="ml-3 text-black/50 text-sm">
                    {review.createdAt}
                  </span>
                </div>
                <p>{review.userComment}</p>
              </div>
            ))):(
              <p className="mt-10 text-2xl font-semibold text-gray-600">Hiện tại chưa có bình luận nào </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
