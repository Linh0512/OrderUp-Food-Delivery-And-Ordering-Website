import {
  faBowlFood,
  faCalendar,
  faClock,
  faHome,
  faMoneyBill,
  faQuestion,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import avatar from "../../assets/avatar.png";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const OrderCard = ({ loading }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "text-yellow-500 bg-yellow-100";
      case "cooking":
        return "text-blue-500 bg-blue-100";
      case "shipped":
        return "text-purple-500 bg-purple-100";
      case "delivered":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return faClock;
      case "cooking":
        return faBowlFood;
      case "shipped":
        return faTruck;
      case "delivered":
        return faHome;
      default:
        return faQuestion;
    }
  };
  if (loading)
    return (
      <div>
        <div className="flex flex-col rounded-xl bg-surface p-2 shadow-md gap-2 bg-white">
          <div className=" w-full flex flex-wrap gap-2 items-center">
            <div className="size-[32px] rounded-full bg-gray-300 animate-pulse"></div>
            <div className="grow h-[16px] rounded bg-gray-300 animate-pulse"></div>
          </div>
          <div className="rounded bg-gray-300 animate-pulse w-full h-[30px]"></div>
        </div>
      </div>
    );
  return (
    <Link to={'/Order/1234'} className="flex flex-col rounded-xl bg-surface/60 hover:bg-surface shadow-md p-2 gap-4 bg-white">
      <div className="flex gap-2 items-center">
        <div className="size-28 rounded-full overflow-hidden bg-gray-100">
          <img
            src={avatar}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="grow flex justify-between items-center">
          <div className="font-bold">VÔ DANH</div>
          <div className="text-end text-sm opacity-70 space-y-2">
            <div>123456789</div>
            <div>
              <FontAwesomeIcon icon={faCalendar} /> 20/6/2025
            </div>
            <div>10 items</div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 bg-black/10 p-4 rounded-2xl">
        <div
          className={`font-semibold px-2 py-1 rounded-full ${getStatusColor(
            "pending"
          )}`}
        >
          <FontAwesomeIcon icon={getStatusIcon("pending")} /> pending
        </div>
        <div className="text-green-500 font font-semibold">
          <FontAwesomeIcon icon={faMoneyBill} /> 100.000.000 vnđ
        </div>
      </div>
    </Link>
  );
};

export default OrderCard;
