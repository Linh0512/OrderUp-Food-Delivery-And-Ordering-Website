import {
  faArrowLeft,
  faEye,
  faEyeSlash,
  faFloppyDisk,
  faPenToSquare,
  faTag,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import product from "../../assets/product.jpg";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../components/common/AuthContext";
import { getDishbyId } from "../../services/hosResServices/Product";
import { formatCurrencyVN } from "../../utils/Format";

export default function ProductDetailPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSale, setIsSale] = useState(true);
  const [dish,setDish]=useState({})
  const {user}=useAuth()
  const {id}=useParams()
  
  useEffect(()=>{
    getDishbyId(id,user.token).then((res)=>{
      console.log(res)
      setDish(res)
    })
  },[user,id])
  const nav=useNavigate()
  return (
    <div className="w-[80%] mx-auto">
      <div className="bg-white rounded-xl shadow p-4 flex justify-between">
        <div className="flex items-center gap-4 ">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" onClick={()=>nav('/Product')}>
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
          <div className="py-2 transition">
            {isSale ? (
              <button className="bg-green-500 text-white p-2 rounded-xl" onClick={()=>setIsSale(!isSale)}>
                <FontAwesomeIcon icon={faEye} className="mr-2" />
                Đang bán
              </button>
            ) : (
              <button className="bg-red-500 text-white p-2 rounded-xl" onClick={()=>setIsSale(!isSale)}>
                <FontAwesomeIcon icon={faEyeSlash} className="mr-2" />
                Dừng bán
              </button>
            )}
          </div>
          {isEditing ? (
            <div className="p-2 space-x-3">
              <button
                className="bg-green-600 p-2 text-white rounded-xl"
                onClick={() => setIsEditing(!isEditing)}
              >
                <FontAwesomeIcon icon={faFloppyDisk} className="mr-2" />
                Lưu
              </button>
              <button
                className="bg-gray-600 p-2 text-white rounded-xl"
                onClick={() => setIsEditing(!isEditing)}
              >
                <FontAwesomeIcon icon={faXmark} className="mr-2" />
                Hủy
              </button>
            </div>
          ) : (
            <div className="p-2 space-x-3">
              <button
                className="bg-blue-600 p-2 text-white rounded-xl"
                onClick={() => setIsEditing(!isEditing)}
              >
                <FontAwesomeIcon icon={faPenToSquare} className="mr-2" />
                Chỉnh sửa
              </button>
              <button className="bg-red-600 p-2 text-white rounded-xl">
                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                Xóa
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex space-x-5 w-full bg-gray-100 p-3">
        <div className="w-[40%] caret-transparent">
          <img src={product} alt="" />
          {isEditing ? (
            <button className="bg-blue-600 p-2 text-white rounded-xl mx-auto block mt-3">
              chọn ảnh
            </button>
          ) : (
            ""
          )}
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
              {isEditing ? (
                <input
                  type="text"
                  defaultValue={dish.name}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
                />
              ) : (
                <p className=" font-semibold text-gray-800 text-2xl">
                  {dish.name}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <label className=" font-medium text-gray-700 w-27">
                Danh mục:
              </label>
              {isEditing ? (
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none">
                  <option value="Cơm">Cơm</option>
                  <option value="Phở">Phở</option>
                  <option value="Bánh mì">Bánh mì</option>
                  <option value="Bún">Bún</option>
                  <option value="Đồ uống">Đồ uống</option>
                </select>
              ) : (
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faTag} />
                  <span className="text-gray-800">Cơm</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <label className="font-medium text-gray-700 w-24">Giá:</label>
              {isEditing ? (
                <div className="relative">
                  <input
                    type="number"
                    defaultValue={dish.basePrice}
                    className="w-full pl-5 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none"
                  />
                </div>
              ) : (
                <p className="text-2xl font-bold text-green-600">{formatCurrencyVN(dish.basePrice)}</p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <label className=" font-medium text-gray-700 w-27">Mô tả:</label>
              {isEditing ? (
                <textarea
                  rows={4}
                  defaultValue={dish.description} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">{dish.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
