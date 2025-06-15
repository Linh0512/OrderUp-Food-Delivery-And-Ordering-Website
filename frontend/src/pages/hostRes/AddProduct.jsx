import { faArrowLeft, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AddDish, uploadImage } from "../../services/hosResServices/Product";
import { useAuth } from "../../components/common/AuthContext";

export default function AddProduct() {
  const nav = useNavigate();
  const [fileSelected, setFileSelected] = useState(null);
  const {user}=useAuth()

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
    }
  };

  const handleAdd = async () => {
    try {
      const image = await uploadImage(fileSelected,user.token);
      console.log(image.data.url)
      const dish = {
        name: "Phở bò tái nạm",
        description:
          "Phở bò truyền thống Hà Nội với thịt bò tái và nạm, nước dùng đậm đà, bánh phở mềm dẻo",
        basePrice: 65000,
        discountPrice: 55000,
        isDiscounted: true,
        images: [
          image.data.url
        ],
        tags: ["phở", "món nước", "đặc sản", "bò"],
        preparationTime: 15,
        optionName: "Lựa chọn thịt",
        optionType: "multiple",
        optionIsRequired: true,
        choiceName: ["Thịt bò tái", "Thịt bò nạm", "Thịt bò viên", "Gầu bò"],
        choicePrice: [10000, 10000, 15000, 20000],
      };
      await AddDish("684844b61a05cf815c50eb70",dish)
    } catch (error) {
      console.log(error)
    }
  };
  return (
    <div className="w-[80%] mx-auto">
      <div className="bg-white rounded-xl shadow p-4 flex justify-between">
        <div className="flex items-center gap-4 ">
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => nav("/product")}
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
          <button className="bg-green-600 p-2 text-white rounded-xl" onClick={handleAdd}>
            <FontAwesomeIcon icon={faFloppyDisk} className="mr-2" />
            Thêm
          </button>
        </div>
      </div>
      <div className="flex space-x-5 w-full bg-gray-100 p-3">
        <div className="w-[40%] caret-transparent flex flex-col items-center justify-center">
          {fileSelected && <p className="text-green text-xl">thành công</p>}
          <label className="bg-blue-500 p-3 text-white font-semibold rounded-xl">
            Chọn ảnh
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
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
