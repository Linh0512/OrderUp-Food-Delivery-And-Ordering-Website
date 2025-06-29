import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faMoneyBill } from "@fortawesome/free-solid-svg-icons";

export default function BigShopCard({ shop }) {
  return (
    <div className="flex rounded-2xl shadow-2xl bg-white caret-transparent">
      <img src={shop.image} alt="" className="rounded-l-2xl w-[50%] h-100 object-cover" />
      <div className="p-2 space-y-5 flex flex-col justify-start w-fit ml-5">
        <h3 className="font-bold text-2xl">{shop.name}</h3>
        <p className="">{shop.address}</p>
        <div className="flex items-center justify-between text-yellow-500">
          <div className="flex space-x-2">
            <p>{shop.review} </p>
            <p> {shop.star} ★ </p>
          </div>
        </div>
        <div className="flex w-full justify-between items-center ">
          <div className="flex w-full justify-between items-center ">
            <p
              className={`${
                shop.isActive ? "text-[rgba(109,213,29,1)]" : "text-red-600"
              } flex items-center`}
            >
              <span
                className={`size-3 rounded-full mr-2 ${
                  shop.isActive ? "bg-[rgba(109,213,29,1)]" : "bg-red-600"
                }`}
              ></span>
              {shop.isActive ? "Mở cửa" : "Đóng cửa"}
            </p>
            <div className="space-x-2 flex items-center">
              <FontAwesomeIcon icon={faClock} />
              <p>{shop.timeRange}</p>
            </div>
          </div>
        </div>
        <p className="text-xl ">
          <FontAwesomeIcon icon={faMoneyBill} /> {shop.priceRange}
        </p>
      </div>
    </div>
  );
}
