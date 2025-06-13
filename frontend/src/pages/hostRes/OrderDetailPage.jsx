import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function OrderDetailPage() {
  return (
    <div className="w-[60vw] mx-auto bg-gray-200 p-2 mt-5 rounded-2xl">
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="flex items-center gap-4 ">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Chi tiết đơn hàng
            </h1>
            <p className="text-gray-600">#123567</p>
          </div>
        </div>
      </div>
    </div>
  );
}
