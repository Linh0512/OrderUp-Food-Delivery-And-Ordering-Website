import {
  faBowlRice,
  faChartPie,
  faHouseUser,
  faTicket,
  faTruck
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function SideBar() {
  const options = [
    { icon: faChartPie, name: "Dashboard" },
    { icon: faTruck, name: "Order" },
    { icon: faBowlRice, name: "Product" },
    { icon: faTicket, name: "Voucher" },
    { icon: faHouseUser, name: "ResProfile" },
  ];
  
  const nav = useNavigate();
  const location=useLocation();
  const getOptionFromPath=(path)=>{
    const found=options.find(opt=>path.includes(opt.name))
    return found?found.name:options[0].name;
  }
  const [selectedOption, setSelectedOption] = useState(getOptionFromPath(location.pathname));

  return (
    <div className="w-[15vw] p-5 flex flex-col h-screen fixed top-0 left-0">
      <img src={logo} alt="" className="w-[50%] caret-transparent mx-auto" />
      <div className=" rounded-2xl space-y-5 mt-5 flex-1">
        {options.map((item, index) => (
          <div
            className={`flex items-center space-x-2 p-2 font-semibold text-lg ${
              selectedOption === item.name ? "sidebar_selected" : "sidebar_item"
            }`}
            key={index}
            onClick={() => {
              setSelectedOption(item.name);
              nav(item.name);
            }}
          >
            <FontAwesomeIcon icon={item.icon} />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
      <button
        className="font-semibold text-lg mx-auto border-none bg-gray-500 p-3 rounded-2xl justify-end text-white hover:bg-gray-400"
        onClick={() => nav("/")}
      >
        Quay lại trang chủ
      </button>
    </div>
  );
}
