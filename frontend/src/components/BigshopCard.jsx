import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import food1 from "../assets/food1.jpg";
import { faClock, faMoneyBill } from "@fortawesome/free-solid-svg-icons";

export default function BigShopCard({shop}) {
  return (
    <div className="flex rounded-2xl shadow-2xl bg-white caret-transparent">
      <img src={food1} alt="" className="rounded-l-2xl w-[50%]" />
      <div className="p-2 space-y-5 flex flex-col justify-start w-fit ml-5">
        <h3 className="font-bold text-2xl">{shop.name}</h3>
        <p className="">{shop.address}</p>
        <div className="flex items-center justify-between text-yellow-500">
          <div className="flex space-x-2">
            <p>{shop.review} </p>
            <p> {shop.star} ★ </p>
          </div>
        </div>
        <div className="flex justify-between items-center ">
          {shop.timeRange==="Mở cửa"?(<p className="text-green-400">Mở cửa</p>):(<p className="text-red-400">Mở cửa</p>)}
          <div className="space-x-2 flex items-center">
            <FontAwesomeIcon icon={faClock} />
            <p>7:00 - 22:00</p>
          </div>
        </div>
        <p className="text-xl ">
          <FontAwesomeIcon icon={faMoneyBill} /> {shop.priceRange}
        </p>
      </div>
    </div>
  );
}
