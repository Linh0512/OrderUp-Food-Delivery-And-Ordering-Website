import {
    faCartShopping,
    faComment,
    faMagnifyingGlass,
    faNewspaper
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import CustomIconButtonSelect from "./CustomSelect";

export default function Header() {
  const navigate = useNavigate();
  return (
    <div className="flex space-x-3 w-full justify-between items-center px-10">
      <img
        src={logo}
        alt="logo"
        className="w-[10%]"
        onClick={() => navigate("/")}
      />
      <div className="border rounded-2xl ">
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
      <select id="" className="border rounded-2xl p-2">
        <option value="hanoi">Hà Nội</option>
        <option value="hochiminh">TP. Hồ Chí Minh</option>
        <option value="danang">Đà Nẵng</option>
        <option value="cantho">Cần Thơ</option>
        <option value="haiphong">Hải Phòng</option>
        <option value="khanhhoa">Khánh Hòa</option>
        <option value="lamdong">Lâm Đồng</option>
        <option value="quangninh">Quảng Ninh</option>
        <option value="thue">Thừa Thiên Huế</option>
        <option value="binhdinh">Bình Định</option>
      </select>
      <div className="flex space-x-5">
        <button className="border rounded-2xl p-2 px-4 hover:bg-black/20 ">
          <FontAwesomeIcon icon={faNewspaper} />
        </button>
        <button className="border rounded-2xl p-2 px-4 hover:bg-black/20">
          <FontAwesomeIcon icon={faComment} />
        </button>
        <div className="p-2 rounded-2xl space-x-1 border px-4 hover:bg-black/20" onClick={()=>navigate('/cart')}>
          <span className="text-xl">0</span>
          <FontAwesomeIcon icon={faCartShopping} />
        </div>
        <CustomIconButtonSelect/>
      </div>
    </div>
  );
}
