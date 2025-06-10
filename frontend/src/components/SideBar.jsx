import React, { useState } from "react";
import logo from "../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBowlRice,
  faChartPie,
  faTags,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";

export default function SideBar() {
  const options = [
    { icon: faChartPie, name: "Dashboard" },
    { icon: faTruck, name: "Order" },
    { icon: faBowlRice, name: "Product" },
    { icon: faTags, name: "Category" },
  ];
  const [selectedOption, setSelectedOption] = useState(options[0].name);

  return (
    <div className="w-[15vw] p-5 flex flex-col">
      <img src={logo} alt="" className="w-[50%] caret-transparent mx-auto" />
      <div className=" rounded-2xl space-y-5 mt-5 flex-1">
        {options.map((item, index) => (
          <div
            className={`flex items-center space-x-2 p-2 font-semibold text-lg ${
              selectedOption === item.name ? "sidebar_selected" : "sidebar_item"
            }`}
            key={index}
            onClick={() => setSelectedOption(item.name)}
          >
            <FontAwesomeIcon icon={item.icon} />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
      <button className="font-semibold text-lg mx-auto bg-gray-500 p-3 rounded-2xl justify-end text-white hover:bg-gray-400">
        Quay lại trang chủ
      </button>
    </div>
  );
}
