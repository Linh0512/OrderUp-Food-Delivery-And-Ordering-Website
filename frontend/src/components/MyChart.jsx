import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const salesData = [
  { month: "Jan", sales: 5000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 2000 },
  { month: "Apr", sales: 2780 },
  { month: "May", sales: 1890 },
  { month: "Jun", sales: 2390 },
];

function MyChart({ type }) {
  if (type === "bar") {
    return (
      <div className="bg-white p-2 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-8 ">
          <FontAwesomeIcon icon={faCalendar} className="mr-4" />
          Doanh thu theo tháng
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <Tooltip />
            <Bar dataKey="sales" fill="#2196f3" barSize={100}>
              <LabelList dataKey="sales" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
  if (type === "line") {
    return (
      <div className="bg-white p-2 rounded-lg shadow-lg w-full">
        <h2 className="text-xl font-semibold mb-8 ">
          <FontAwesomeIcon icon={faCalendar} className="mr-4" />
          Đơn hàng theo tháng 
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#2196f3"
              strokeWidth={3}
              dot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
  return <div></div>;
}

export default MyChart;
