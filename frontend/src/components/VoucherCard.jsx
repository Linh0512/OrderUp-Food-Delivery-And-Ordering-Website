import voucher from '../assets/voucher.png'

export default function VoucherCard() {
  return (
    <div className="flex items-center bg-white  shadow-md overflow-hidden w-full max-w-3xl hover:bg-gray-200 transition">
      <div className="bg-red-600 text-white  flex items-center w-[25%]">
        <img
          src={voucher} 
          alt="Voucher Icon"
          className=""
        />
      </div>

      <div className="flex-1 px-4 ">
        <p className="font-semibold ">
          Giảm 50% tối đa 20.000đ trên phí vận chuyển
        </p>
        <p className="text-red-500 text-sm">Hóa đơn tối thiểu 100.000đ</p>
      </div>
    </div>
  );
}
