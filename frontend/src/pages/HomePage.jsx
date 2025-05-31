import Category from "../components/Category";
import Pagination from "../components/Pagination";
import ProdcuctList from "../components/ProdcuctList";

export default function HomePage() {
  return (
    <div className="w-[80vw] mx-auto flex">
      <div className="w-[80%] space-y-3">
        <h1 className="text-center font-bold text-4xl m-2 mt-3">
          Các nhà hàng phổ biến
        </h1>
        <hr className="w-[90%] mx-auto mb-3"/>
        <ProdcuctList />
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
      </div>
    </div>
  );
}
