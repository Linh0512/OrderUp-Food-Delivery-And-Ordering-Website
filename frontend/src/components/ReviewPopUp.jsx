import { faStar, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef } from "react";

export default function ReviewPopUp({ ratingBars, rating, totalReviews,handleClose }) {
    const selectRef=useRef(null);

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

  const reviews = [
    {
      name: "Nguyễn Văn A",
      star: 5,
      time: "2 ngày trước",
      comment: "Sản phẩm rất tốt, đúng như mô tả. Giao hàng nhanh chóng!",
    },
    {
      name: "Trần Thị B",
      star: 4,
      time: "5 ngày trước",
      comment: "Chất lượng ổn so với giá tiền, sẽ ủng hộ lần sau.",
    },
    {
      name: "Lê Văn C",
      star: 3,
      time: "1 tuần trước",
      comment: "Sản phẩm tạm ổn, nhưng đóng gói chưa kỹ lắm.",
    },
    {
      name: "Phạm Thị D",
      star: 2,
      time: "10 ngày trước",
      comment: "Giao hàng chậm, sản phẩm hơi khác với hình.",
    },
    {
      name: "Đặng Văn E",
      star: 1,
      time: "2 tuần trước",
      comment: "Không hài lòng. Sản phẩm lỗi, shop phản hồi chậm.",
    },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white w-[40vw] mx-auto border-2 shadow rounded-2xl overflow-scroll h-[90%] overflow-x-hidden" ref={selectRef}>
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
        <div className="bg-[rgba(192,192,192,1)] ">
          <div className="p-5 space-y-5">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="text-start bg-white p-5 border rounded-2xl space-y-2"
              >
                <div className="space-x-3">
                  <FontAwesomeIcon icon={faUser} />
                  <span>{review.name}</span>
                </div>
                <div>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <FontAwesomeIcon
                      icon={faStar}
                      key={index}
                      className={`${
                        review.star > index ? "text-yellow-400" : ""
                      }`}
                    />
                  ))}
                  <span className="ml-3 text-black/50 text-sm">
                    {review.time}
                  </span>
                </div>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
