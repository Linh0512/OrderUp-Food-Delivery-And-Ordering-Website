import {
  faCartShopping,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import CustomIconButtonSelect from "./ProfileSelect";
import { useAuth } from "./common/AuthContext";

export default function Header({ search, setSearch }) {
  const navigate = useNavigate();
  const { role, isLogin } = useAuth();

  useEffect(() => {});

  return (
    <div className="flex space-x-3 w-full py-5 items-center px-20 caret-transparent sticky top-0 z-50 bg-white">
      <img
        src={logo}
        alt="logo"
        className="w-[8%]"
        onClick={() => navigate("/")}
      />
      <div className="flex space-x-5 items-center ml-5">
        <Link
          to={"/"}
          className="text-2xl font-extralight hover:font-normal transition"
        >
          Trang chủ
        </Link>
        {role === "restaurantHost" && (
          <Link
            to={"/Dashboard"}
            className="text-2xl font-extralight hover:font-normal transition"
          >
            Cửa hàng
          </Link>
        )}
      </div>
      <div className=" border border-gray-400 rounded-2xl caret-black px-4 ml-auto">
        <input
          type="text"
          id=""
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="tìm kiếm..."
          className="py-2 focus:outline-none w-[20vw]"
        />
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          color="gray"
          className="shadow-2xl"
        />
      </div>
      {isLogin ? (
        <div className="flex space-x-5">
          <div
            className="flex items-center justify-center rounded-2xl border px-4 hover:bg-black/20"
            onClick={() => navigate("/cart")}
          >
            <FontAwesomeIcon icon={faCartShopping} />
          </div>
          <CustomIconButtonSelect />
        </div>
      ) : (
        <div className="flex space-x-5">
          <button
            className="border rounded-2xl p-2 px-4 hover:bg-black/20 transition"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </button>
          <button
            className="border rounded-2xl p-2 px-4 hover:bg-black/20 transition"
            onClick={() => navigate("/signup")}
          >
            Đăng Ký
          </button>
        </div>
      )}
    </div>
  );
}
