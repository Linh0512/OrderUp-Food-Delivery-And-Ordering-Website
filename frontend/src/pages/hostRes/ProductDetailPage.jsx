import {
  faArrowLeft,
  faEye,
  faEyeSlash,
  faFloppyDisk,
  faPenToSquare,
  faTrash,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import product from "../../assets/product.jpg";
import { useAuth } from "../../components/common/AuthContext";
import { getDishbyId } from "../../services/hosResServices/Product";
import { formatCurrencyVN } from "../../utils/Format";

export default function ProductDetailPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSale, setIsSale] = useState(true);
  const [dish, setDish] = useState({});
  const [fileSelected, setFileSelected] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const { user } = useAuth();
  const { id } = useParams();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)");
        return;
      }
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert("File quá lớn. Vui lòng chọn file nhỏ hơn 5MB");
        return;
      }
      setFileSelected(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    getDishbyId(id, user.token).then((res) => {
      console.log(res);
      setDish(res);
    });
  }, [user, id]);
  const nav = useNavigate();
  return (
    <div className="w-[80%] mx-auto">
      <div className="bg-white rounded-xl shadow p-4 flex justify-between">
        <div className="flex items-center gap-4 ">
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => nav("/Product")}
          >
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
              <button
                className="bg-green-500 text-white p-2 rounded-xl"
                onClick={() => setIsSale(!isSale)}
              >
                <FontAwesomeIcon icon={faEye} className="mr-2" />
                Đang bán
              </button>
            ) : (
              <button
                className="bg-red-500 text-white p-2 rounded-xl"
                onClick={() => setIsSale(!isSale)}
              >
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
        <div className="w-[40%] flex flex-col items-center caret-transparent">
          <img src={previewImage||product} alt="" />
          {isEditing ? (
            <label className="bg-blue-500 text-white px-4 py-2 mt-5 rounded cursor-pointer text-sm hover:bg-blue-600 transition">
              Thay hình ảnh
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
          ) : (
            ""
          )}
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 w-full ">
          <div className="space-y-4 ">
            <div className="flex items-center">
              <label className="font-medium text-gray-700 w-34">
                Tên món ăn :
              </label>
              {isEditing ? (
                <input
                  type="text"
                  defaultValue={dish.name}
                  className="w-[80%] p-3 border border-gray-300 rounded-lg focus:outline-none"
                />
              ) : (
                <p className=" font-semibold text-gray-800 text-2xl">
                  {dish.name}
                </p>
              )}
            </div>
            <div className="flex items-center ">
              <label className="font-medium text-gray-700 w-34">Giá :</label>
              {isEditing ? (
                <div className="relative">
                  <input
                    type="number"
                    defaultValue={dish.basePrice}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
                  />
                </div>
              ) : (
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrencyVN(dish.basePrice)}
                </p>
              )}
            </div>
            <div className="flex items-center">
              <label className=" font-medium text-gray-700 w-34">Mô tả :</label>
              {isEditing ? (
                <textarea
                  rows={4}
                  defaultValue={dish.description}
                  className="w-[80%] p-3 border border-gray-300 rounded-lg focus:outline-none"
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">
                  {dish.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
