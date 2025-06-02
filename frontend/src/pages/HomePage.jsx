import Category from "../components/Category";
import Pagination from "../components/Pagination";
import ShopCard from "../components/ShopCard";


export default function HomePage() {
  return (
    <div className="w-[80vw] mx-auto flex">
      <div className="w-[80%] space-y-3">
        <h1 className="text-center text-5xl m-2 mt-3 dancing-script-700">
          Các nhà hàng phổ biến
        </h1>
        <hr className="w-[90%] mx-auto mb-3" />
        <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-1 gap-7 mb-7">
          {Array.from({ length: 20 }).map((_, index) => (
            <ShopCard key={index} />
          ))}
        </div>
        <Pagination />
      </div>
      <div className="space-y-3 mt-10 ml-4">
        <select className="border p-2 text-lg rounded-2xl">
          <option defaultChecked>Sắp xếp theo</option>
          <option value="1">tăng dần</option>
          <option value="-1">giảm dần</option>
        </select>
        <div className="flex border p-2 w-fit space-x-2 rounded-2xl">
          <input type="checkbox" />
          <p>Đang khuyến mãi</p>
        </div>
        <Category />
        <div className="border h-fit p-2 rounded-2xl">
          <h3 className="text-center font-bold">Mức giá</h3>
          <hr />
          <ul className="space-y-2">
            <div className="flex space-x-2 items-center font-semibold text-lg">
              <input type="checkbox" />
              <p>Tất cả</p>
            </div>
            <div className="flex space-x-2 items-center font-semibold text-lg">
              <input type="checkbox" />
              <p>Dưới 50 nghìn</p>
            </div>
            <div className="flex space-x-2 items-center font-semibold text-lg">
              <input type="checkbox" />
              <p>từ 50-100 nghìn</p>
            </div>
            <div className="flex space-x-2 items-center font-semibold text-lg">
              <input type="checkbox" />
              <p>từ 100-200 nghìn</p>
            </div>
            <div className="flex space-x-2 items-center font-semibold text-lg">
              <input type="checkbox" />
              <p>200 nghìn trở lên</p>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
}
