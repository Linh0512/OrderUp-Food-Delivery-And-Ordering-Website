import { useNavigate } from "react-router-dom";
import { formatCurrencyVN } from "../../utils/Format";

export default function ProductCard({ item, Loading }) {
  const nav = useNavigate();
  if (Loading)
    return <div className="w-120 animate-pulse bg-gray-300 h-30"></div>;
  return (
    <div
      className="flex w-full h-30 items-center shadow rounded caret-transparent bg-white p-3"
      onClick={() => nav(`/Product/${item.id}`)}
    >
      <img
        src={item.image}
        alt=""
        className="w-24 h-24 object-cover shadow"
      />
      <div className="flex flex-col justify-between ml-5 py-3 w-full">
        <div className="space-y-1">
          <p className="font-bold">{item.name}</p>
          <p className="text-sm text-gray-500"> {item.description} </p>
        </div>
        <p className="font-semibold text-end self-end">{formatCurrencyVN(item.basePrice)}</p>
      </div>
    </div>
  );
}
