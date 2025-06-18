import { faStar, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import avatar from "../assets/banner.jpg";

export default function ReviewRes({ handleClose }) {
  const [hoveredStar, setHoveredStar] = useState(null);
  const selectRef = useRef(null);

  const handle = (e) => {
    e.stopPropagation();
    e.preventDefault();  
    handleClose(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        event.stopPropagation();
        handleClose(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClose]);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white w-[40vw] mx-auto rounded-2xl" ref={selectRef}>
        <div className="text-xl font-semibold bg-gray-300 flex items-center p-4 rounded-t-xl">
          <button onClick={handle}>
            <FontAwesomeIcon icon={faX} className="mr-4" />
          </button>
          Đánh giá nhà hàng
        </div>
        <div className="w-full p-10 ">
          <div className="bg-gray-200 w-full p-5 flex flex-col items-center shadow rounded-2xl">
            <div className="flex flex-col items-center space-y-4 w-full border-b p-2 ">
              <img src={avatar} alt="" className="size-26 rounded-full" />
              <div className="flex space-x-4 items-center text-xl">
                <p className=" font-semibold">Cơm gà số 23</p>
                <p>
                  4.8{" "}
                  <FontAwesomeIcon icon={faStar} className="text-yellow-400" />{" "}
                </p>
              </div>
            </div>
            <div className="mt-10">
              {Array.from({ length: 5 }).map((_, index) => (
                <FontAwesomeIcon
                  icon={faStar}
                  key={index}
                  className={`transition-colors duration-200 text-3xl p-2 ${
                    hoveredStar !== null && index < hoveredStar
                      ? "text-yellow-400"
                      : "text-gray-400"
                  }`}
                  onMouseEnter={() => setHoveredStar(index + 1)}
                  onMouseLeave={() => setHoveredStar(null)}
                />
              ))}
            </div>
            <textarea
              className="border w-full mt-10 focus:outline-none p-2"
              placeholder="Chia sẻ cảm nhận của bạn "
              rows={4}
            />
          </div>
          <button className="w-full bg-[rgba(227,70,63,1)] mt-5 p-3 text-white font-bold text-2xl rounded-2xl hover:bg-red-700 transition">
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}
