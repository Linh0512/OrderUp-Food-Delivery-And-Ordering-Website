import {
  faCartShopping,
  faComment,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import CustomIconButtonSelect from "./ProfileSelect";
import CustomSelect from "./CustomSelect";
import { isLogin } from "../services/authServices/authServices";

export default function Header() {
  const isloggedIn = isLogin();
  const navigate = useNavigate();
  const provinces = [
    { label: "Hà Nội", value: "hanoi" },
    { label: "TP. Hồ Chí Minh", value: "hochiminh" },
    { label: "Đà Nẵng", value: "danang" },
    { label: "Cần Thơ", value: "cantho" },
    { label: "Hải Phòng", value: "haiphong" },
    { label: "Khánh Hòa", value: "khanhhoa" },
    { label: "Lâm Đồng", value: "lamdong" },
    { label: "Quảng Ninh", value: "quangninh" },
    { label: "Thừa Thiên Huế", value: "thue" },
    { label: "Bình Định", value: "binhdinh" },
  ];

  return (
    <div className="flex space-x-3 w-full justify-between items-center px-10 caret-transparent">
      <img
        src={logo}
        alt="logo"
        className="w-[10%]"
        onClick={() => navigate("/")}
      />
      <div className="border rounded-2xl caret-black">
        <input
          type="text"
          id=""
          placeholder="tìm địa điểm, món ăn,..."
          className="py-2 px-4 w-[30vw] focus:outline-none"
        />
        <button className="bg-green-400 py-2 px-4 rounded-r-2xl ">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            color="green"
            className="shadow-2xl"
          />
        </button>
      </div>

      <CustomSelect options={provinces} head={"Tỉnh thành"} />
      {isloggedIn ? (
        <div className="flex space-x-5">
          <button
            className="border rounded-2xl p-2 px-4 hover:bg-black/20"
            onClick={() => navigate("/chat")}
          >
            <FontAwesomeIcon icon={faComment} />
          </button>
          <div
            className="p-2 rounded-2xl space-x-1 border px-4 hover:bg-black/20"
            onClick={() => navigate("/cart")}
          >
            <span className="text-xl">0</span>
            <FontAwesomeIcon icon={faCartShopping} />
          </div>
          <CustomIconButtonSelect />
        </div>
      ) : (
        <div className="flex space-x-5">
          <button
            className="border rounded-2xl p-3 px-4 hover:bg-black/20"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </button>
          <button
            className="border rounded-2xl p-3 px-4 hover:bg-black/20"
            onClick={() => navigate("/signup")}
          >
            Đăng Ký
          </button>
        </div>
      )}
    </div>
  );
}
