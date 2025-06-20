import img from "../assets/voucher.png";
import { formatCurrencyVN } from "../utils/Format";

export default function VoucherCard({ voucher, onSelect,subtotal }) {
  const handleSelect=()=>{
    if(subtotal>=voucher.minimumOrderAmount)
      onSelect()
    else
      alert("chưa đủ điều kiện sử dụng voucher")
  }
  return (
    <div
      className="flex items-center bg-white  shadow-md overflow-hidden w-full max-w-3xl hover:bg-gray-200 transition"
      onClick={handleSelect}
    >
      <div className="bg-red-600 text-white  flex items-center w-[25%]">
        <img src={img} alt="Voucher Icon" className="" />
      </div>
      <div className="flex-1 px-4 ">
        <p className="font-semibold ">
          Giảm {formatCurrencyVN(voucher.value)} trên tổng hóa đơn
        </p>
        <p className="text-red-500 text-sm">
          Hóa đơn tối thiểu {formatCurrencyVN(voucher.minimumOrderAmount)}
        </p>
      </div>
    </div>
  );
}
