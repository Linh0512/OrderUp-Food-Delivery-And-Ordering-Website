import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import food1 from "../assets/food1.jpg";
import { faClock, faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function ShopCard() {
  const navigate=useNavigate()

  function handleMove(){
    navigate('shop')
  }
  return (
    <div className="flex flex-col rounded-2xl shadow-xl bg-white">
      <img src={food1} alt="" className="rounded-t-2xl" />
      <div className="p-2 space-y-1 flex flex-col justify-center">
        <h3 className="font-bold text-lg">Cafe Amazone - Hai Bà Trưng</h3>
        <p className="text-sm">95 Hai Bà Trưng, P.Bến Nghé, Quận 1, TP. HCM</p>
        <hr />
        <div className="flex items-center justify-between text-yellow-500">
          <div className="flex space-x-2">
            <p>876+ </p>
            <p> 5★ </p>
          </div>
          <button className="bg-[rgba(60,152,80,1)] border text-white p-1 px-2 rounded-2xl hover:opacity-80" onClick={handleMove}>
            Đặt món
          </button>
        </div>
        <div className="flex justify-between items-center ">
          <p className="text-[rgba(109,213,29,1)]">Mở cửa</p>
          <div className="space-x-2 flex items-center">
            <FontAwesomeIcon icon={faClock} />
            <p>7:00 - 22:00</p>
          </div>
        </div>
        <p className="text-xl py-2">
          <FontAwesomeIcon icon={faMoneyBill} /> 20.000 - 100.000
        </p>
      </div>
    </div>
  );
}
