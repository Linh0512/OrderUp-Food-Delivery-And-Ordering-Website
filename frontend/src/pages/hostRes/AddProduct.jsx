import { faArrowLeft, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import product from "../../assets/product.jpg";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
    const nav=useNavigate()
  return (
    <div className="w-[80%] mx-auto">
      <div className="bg-white rounded-xl shadow p-4 flex justify-between">
        <div className="flex items-center gap-4 ">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" onClick={()=>nav('/product')}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Chi tiết món ăn
            </h1>
            <p className="text-gray-600">#123567</p>
          </div>
        </div>
        <div className="p-2 space-x-3 flex">
          <button className="bg-green-600 p-2 text-white rounded-xl">
            <FontAwesomeIcon icon={faFloppyDisk} className="mr-2" />
            Lưu
          </button>
        </div>
      </div>
      <div className="flex space-x-5 w-full bg-gray-100 p-3">
        <div className="w-[40%] caret-transparent flex items-center justify-center">
            <label className="bg-blue-500 p-3 text-white font-semibold rounded-xl">Chọn ảnh
                <input type="file" accept="image/*"className="hidden" />
            </label>    
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 w-full ">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Thông tin cơ bản
          </h2>
          <div className="space-y-4 ">
            <div className="flex items-center space-x-4">
              <label className="font-medium text-gray-700 w-27">
                Tên món ăn :
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className=" font-medium text-gray-700 w-27">
                Danh mục:
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none">
                <option value="Cơm">Cơm</option>
                <option value="Phở">Phở</option>
                <option value="Bánh mì">Bánh mì</option>
                <option value="Bún">Bún</option>
                <option value="Đồ uống">Đồ uống</option>
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <label className="font-medium text-gray-700 w-24">Giá:</label>
              <div className="relative">
                <input
                  type="number"
                  className="w-full pl-5 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <label className=" font-medium text-gray-700 w-27">Mô tả:</label>
              <textarea
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
