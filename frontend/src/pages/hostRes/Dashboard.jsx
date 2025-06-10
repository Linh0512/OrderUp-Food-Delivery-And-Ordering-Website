import {
  faArrowTrendUp,
  faCalendarAlt,
  faClock,
  faDollarSign,
  faGlobe,
  faMoneyBillWave,
  faPieChart,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MyChart from "../../components/MyChart";

export default function Dashboard() {
  return (
    <div className="w-full p-3 space-y-5">
      <div className="flex items-center space-x-2 font-semibold text-2xl mb-4">
        <FontAwesomeIcon icon={faPieChart} />
        <p>Dashboard</p>
      </div>
      <div className="bg-gray-200 p-4 space-y-3 rounded-2xl">
        <div className="text-xl p-2 bg-gray-400 text-white font-semibold rounded-xl">
          <FontAwesomeIcon icon={faMoneyBillWave} className="mr-3" />
          Doanh thu
        </div>
        <MyChart type={"bar"} />
        <div className="flex items-center space-x-5">
          <div className="p-3 font-semibold text-xl bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl text-white grow">
            <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
            Tổng doanh thu: 100.000.000 vnđ
          </div>
          <div className="p-3 font-semibold text-xl bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white grow">
            <FontAwesomeIcon icon={faArrowTrendUp} className="mr-2" />
            Doanh thu tháng này: 100.000.000 vnđ
          </div>
        </div>
      </div>
      <div className="bg-gray-200 p-4 space-y-3 rounded-2xl">
        <div className="text-xl p-2 bg-gray-400 text-white font-semibold rounded-xl">
          <FontAwesomeIcon icon={faTruck} className="mr-3" />
          Đơn hàng
        </div>
        <div className="flex justify-between space-x-4">
          <MyChart type={"line"}/>
          <div className="w-[35%] flex flex-col justify-between">
            <div className="p-3 font-semibold text-xl bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white  ">
              <FontAwesomeIcon icon={faClock} className="mr-2" />
              Số lượng đơn hôm nay
              <p className="mt-2">100</p>
            </div>
            <div className="p-3 font-semibold text-xl bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white ">
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
              Số lượng đơn tháng này
              <p className="mt-2">100</p>
            </div>
            <div className="p-3 font-semibold text-xl bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl text-white ">
              <FontAwesomeIcon icon={faGlobe} className="mr-2" />
              Tổng đơn hàng
              <p className="mt-2">100</p>
            </div>
            <div className="p-3 font-semibold text-xl bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl text-white ">
              <FontAwesomeIcon icon={faTruck} className="mr-2" />
              Số lượng đơn đang được giao
              <p className="mt-2">100</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
