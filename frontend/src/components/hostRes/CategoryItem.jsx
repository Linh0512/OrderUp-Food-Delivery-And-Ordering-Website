import { faTag, faTicket, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function CategoryItem() {
  return (
    <div className="w-full bg-white flex items-center justify-between group p-2 rounded-xl">
      <div className="flex items-center space-x-5">
        <div className="bg-green-200 text-green-500 text-xl p-2 rounded-lg">
          <FontAwesomeIcon icon={faTicket} />
        </div>
        <p className="text-xl font-semibold">Voucher</p>
        <div className="bg-green-500 p-2 rounded-2xl text-white font-semibold">
          Giảm 10.000 VNĐ với đơn hàng 100.000 VNĐ
        </div>
      </div>
      <button className="text-red-500 font-bold text-xl opacity-0 group-hover:opacity-100 transition">
        <FontAwesomeIcon icon={faTrash}/>
      </button>
    </div>
  );
}
