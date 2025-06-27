import {
  faCamera,
  faClock,
  faEnvelope,
  faFloppyDisk,
  faMapPin,
  faMoneyBill,
  faPenToSquare,
  faPhone,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { getResData } from "../../services/hosResServices/service";
import { useAuth } from "../../components/common/AuthContext";

const RestaurantProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [restaurantData, setRestaurantData] = useState({});
  const {user,resId}=useAuth()
  const [editForm, setEditForm] = useState({});

  useEffect(()=>{
    if(resId)
    {
      getResData(resId,user.token).then((res)=>{
        console.log(res.data)
        setRestaurantData(res.data)
      })
    }
  },[user,resId])

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({ ...restaurantData });
  };

  const handleSave = () => {
    setRestaurantData({ ...editForm });
    setIsEditing(false);
    setEditForm({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const handleImageAdd = () => {
    const url = prompt("Nhập URL hình ảnh:");
    if (url) {
      setEditForm({
        ...editForm,
        restaurantImages: [url],
      });
    }
  };

  const data = isEditing ? editForm : restaurantData;

  return (
    <div className="min-h-screen mx-auto p-4 w-full">
      {/* Header */}
      <div className=" rounded-2xl shadow p-6 relative overflow-hidden bg-gray-200 mb-4">
        <div className="flex justify-between items-start relative z-10">
          <div className="flex items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Profile Nhà Hàng
              </h1>
              <p className="text-gray-600">Quản lý thông tin nhà hàng</p>
            </div>
          </div>

          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200 transform hover:scale-105"
                >
                  <FontAwesomeIcon className="mr-2" icon={faFloppyDisk} />
                  Lưu
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200 transform hover:scale-105"
                >
                  <FontAwesomeIcon className="mr-2" icon={faX} />
                  Hủy
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200 transform hover:scale-105"
              >
                <FontAwesomeIcon className="mr-2" icon={faPenToSquare} />
                Chỉnh sửa
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-200 shadow-lg rounded-2xl">
        {/* Restaurant Name & Status */}
        <div className="p-6 border-b border-gray-400">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={data.restaurantName}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      restaurantName: e.target.value,
                    })
                  }
                  className="text-3xl font-bold text-gray-800 border-b-2 border-blue-500 bg-transparent w-full focus:outline-none"
                  placeholder="Tên nhà hàng"
                />
              ) : (
                <h2 className="text-3xl font-bold text-gray-800">
                  {data.restaurantName}
                </h2>
              )}
            </div>

            <div className="ml-4">
              {isEditing ? (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.restaurantIsActive}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        restaurantIsActive: e.target.checked,
                      })
                    }
                    className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">Đang hoạt động</span>
                </label>
              ) : (
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    data.restaurantIsActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {data.restaurantIsActive
                    ? "🟢 Đang hoạt động"
                    : "🔴 Ngừng hoạt động"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Images Gallery */}
        <div className="p-6 border-b border-gray-400">
          <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
            <FontAwesomeIcon className="mr-2 text-blue-500" icon={faCamera} />
            Hình ảnh nhà hàng
          </h3>

          {data.restaurantImages?.length > 0 ? (
            <div className="flex items-center space-x-3">
              <img
                src={data.restaurantImages[0]}
                alt=""
                className="w-[30%] object-cover rounded-lg shadow-md transition-transform duration-200"
              />
              {isEditing && (
                <button
                  onClick={handleImageAdd}
                  className="p-2 h-fit bg-blue-500 hover:bg-blue-700 rounded-lg flex items-center space-x-2 text-white transition-all duration-200"
                >
                  <span className="text-sm font-medium">Chọn hình ảnh</span>
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FontAwesomeIcon
                icon={faCamera}
                className="mx-auto text-gray-400 mb-4"
              />
              <p className="text-gray-500">Chưa có hình ảnh nào</p>
              {isEditing && (
                <button
                  onClick={handleImageAdd}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Thêm hình ảnh đầu tiên
                </button>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="p-6 border-b border-gray-400">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Mô tả về nhà hàng
          </h3>
          {isEditing ? (
            <textarea
              value={data.restaurantDescription}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  restaurantDescription: e.target.value,
                })
              }
              className="bg-white w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows="4"
              placeholder="Nhập mô tả về nhà hàng..."
            />
          ) : (
            <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
              {data.restaurantDescription || "Chưa có mô tả"}
            </p>
          )}
        </div>

        {/* Contact Information */}
        <div className="p-6 border-b border-gray-400">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">
            Thông tin liên hệ
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <FontAwesomeIcon
                  className="mr-2 text-blue-500"
                  icon={faEnvelope}
                />
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={data.restaurantEmail}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      restaurantEmail: e.target.value,
                    })
                  }
                  className="bg-white w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="email@example.com"
                />
              ) : (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-800">
                    {data.restaurantEmail || "Chưa cập nhật"}
                  </p>
                </div>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <FontAwesomeIcon
                  className="mr-2 text-green-500"
                  icon={faPhone}
                />
                Số điện thoại
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={data.restaurantPhone}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      restaurantPhone: e.target.value,
                    })
                  }
                  className="w-full p-3 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="0123-456-789"
                />
              ) : (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-800">
                    {data.restaurantPhone || "Chưa cập nhật"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="mt-6 space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FontAwesomeIcon className="mr-2 text-red-500" icon={faMapPin} />
              Địa chỉ
            </label>
            {isEditing ? (
              <input
                type="text"
                value={data.restaurantAddress}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    restaurantAddress: e.target.value,
                  })
                }
                className="w-full p-3 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Địa chỉ nhà hàng"
              />
            ) : (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-800">
                  {data.restaurantAddress || "Chưa cập nhật"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Business Information */}
        <div className="p-6 rounded-b-2xl">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">
            Thông tin kinh doanh
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Time Range */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <FontAwesomeIcon
                  className="mr-2 text-purple-500"
                  icon={faClock}
                />
                Giờ hoạt động
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={data.restaurantTimeRange}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      restaurantTimeRange: e.target.value,
                    })
                  }
                  className="w-full p-3 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="VD: 08:00 - 22:00"
                />
              ) : (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-800">
                    {data.restaurantTimeRange || "Chưa cập nhật"}
                  </p>
                </div>
              )}
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <FontAwesomeIcon
                  className="mr-2 text-yellow-500"
                  icon={faMoneyBill}
                />
                Khoảng giá
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={data.restaurantPriceRange}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      restaurantPriceRange: e.target.value,
                    })
                  }
                  className="w-full p-3 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="VD: 200,000 - 500,000 VNĐ"
                />
              ) : (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-800">
                    {data.restaurantPriceRange || "Chưa cập nhật"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantProfile;
