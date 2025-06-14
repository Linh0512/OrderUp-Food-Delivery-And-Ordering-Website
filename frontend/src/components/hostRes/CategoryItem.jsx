import { faTag, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function CategoryItem() {
  return (
    <div className="w-full bg-white flex items-center justify-between group p-2 rounded-xl">
      <div className="flex items-center space-x-5">
        <div className="bg-green-200 text-green-500 text-xl p-2 rounded-lg">
          <FontAwesomeIcon icon={faTag} />
        </div>
        <p className="text-xl font-semibold">Món mới</p>
        <div className="bg-green-100 p-1 text-sm rounded-2xl text-green-500 font-bold">
          10 món
        </div>
      </div>
      <button className="text-red-500 font-bold text-xl opacity-0 group-hover:opacity-100 transition">
        <FontAwesomeIcon icon={faTrash}/>
      </button>
    </div>
  );
}
