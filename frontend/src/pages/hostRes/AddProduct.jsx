import {
  faArrowLeft,
  faFloppyDisk,
  faPlus,
  faSpinner,
  faTrash,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/common/AuthContext";
import { AddDish, uploadImage } from "../../services/hosResServices/Product";

export default function AddProduct() {
  const nav = useNavigate();
  const [fileSelected, setFileSelected] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isUpLoading, setIsUpLoading] = useState(false);
  const [dishData, setDishData] = useState({
    name: "",
    description: "",
    basePrice: 0,
    images: [],
    options: [],
  });
  const { user, resId } = useAuth();

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
      const maxSize = 5 * 107 * 1024; // 5MB
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

  const isDishDataValid = () => {
    return (
      dishData.name.trim() !== "" &&
      dishData.basePrice !== "" &&
      dishData.description.trim() !== "" &&
      fileSelected
    );
  };

  const handleAdd = async () => {
    if (!isDishDataValid()) {
      alert("vui lòng điền đủ thông tin ngoại trừ lựa chọn");
      console.log(dishData);
      return;
    }
    try {
      setIsUpLoading(true);
      const image = await uploadImage(fileSelected, user.token);
      const tmp = { ...dishData, images: [image.data.url] };
      await AddDish(resId, tmp);
      setIsUpLoading(false);
      alert("Thêm món thành công")
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddOption = () => {
    setDishData({
      ...dishData,
      options: [
        ...dishData.options,
        { name: "", type: "single", required: true, choices: [] },
      ],
    });
  };

  const handleAddChoice = (index) => {
    setDishData({
      ...dishData,
      options: dishData.options.map((item, i) =>
        i === index
          ? {
              ...item,
              choices: [
                ...item.choices,
                { name: "", price: 0, default: false },
              ],
            }
          : item
      ),
    });
  };

  const handleUpdateOptionName = (index, newName) => {
    setDishData({
      ...dishData,
      options: dishData.options.map((item, i) =>
        i === index ? { ...item, name: newName } : item
      ),
    });
  };

  const handleUpdateChoiceName = (optIndex, choiceIndex, newName) => {
    setDishData({
      ...dishData,
      options: dishData.options.map((item, i) =>
        i === optIndex
          ? {
              ...item,
              choices: item.choices.map((item1, i1) =>
                i1 === choiceIndex ? { ...item1, name: newName } : item1
              ),
            }
          : item
      ),
    });
  };

  const handleUpdateChoicePrice = (optIndex, choiceIndex, newPrice) => {
    setDishData({
      ...dishData,
      options: dishData.options.map((item, i) =>
        i === optIndex
          ? {
              ...item,
              choices: item.choices.map((item1, i1) =>
                i1 === choiceIndex ? { ...item1, price: newPrice } : item1
              ),
            }
          : item
      ),
    });
  };

  const handleDeleteOption = (optIndex) => {
    setDishData({
      ...dishData,
      options: dishData.options.filter((_, i) => i !== optIndex),
    });
  };

  const handleDeleteChoice = (optIndex, choiceIndex) => {
    setDishData({
      ...dishData,
      options: dishData.options.map((item, i) =>
        i === optIndex
          ? {
              ...item,
              choices: item.choices.filter((_, i1) => i1 !== choiceIndex),
            }
          : item
      ),
    });
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
          </div>
        </div>
        <div className="p-2 space-x-3 flex">
          <button
            className={`${isUpLoading?"bg-gray-500":"bg-green-600"} p-2 text-white rounded-xl`}
            onClick={handleAdd}
          >
            {isUpLoading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                Đang tạo 
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faFloppyDisk} className="mr-2" />
                Thêm
              </>
            )}
          </button>
        </div>
      </div>
      <div className="flex space-x-5 w-full bg-gray-200 p-3 mt-5 rounded">
        <div className="w-[40%] caret-transparent flex flex-col items-center mt-10">
          {fileSelected && <img src={previewImage} className="w-full mb-3" />}
          <label className="bg-blue-500 p-3 text-white font-semibold rounded-xl ">
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
              <label className="font-medium text-gray-700 w-30">
                Tên món ăn :
              </label>
              <input
                type="text"
                onChange={(e) =>
                  setDishData({ ...dishData, name: e.target.value })
                }
                className="w-[80%] p-3 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="font-medium text-gray-700 w-30">Giá:</label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  onChange={(e) =>
                    setDishData({ ...dishData, basePrice: e.target.value })
                  }
                  className="w-full pl-5 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <label className=" font-medium text-gray-700 w-30">Mô tả:</label>
              <textarea
                rows={4}
                onChange={(e) =>
                  setDishData({ ...dishData, description: e.target.value })
                }
                className="w-[80%] p-3 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className=" font-medium text-gray-700 w-30">
                Các lựa chọn:
              </label>
              <div className="space-y-5">
                <div className="space-y-3">
                  {dishData.options.map((option, optionIndex) => (
                    <div
                      className="bg-gray-100 p-4 rounded-2xl border border-gray-300 space-y-4"
                      key={optionIndex}
                    >
                      <div className="space-x-2 flex items-center">
                        <input
                          type="text"
                          placeholder="tên lựa chọn"
                          onChange={(e) =>
                            handleUpdateOptionName(optionIndex, e.target.value)
                          }
                          className="border-gray-400 border p-2 rounded-xl bg-white focus:outline-none"
                        />
                        <FontAwesomeIcon
                          icon={faTrash}
                          onClick={() => handleDeleteOption(optionIndex)}
                          className="text-red-500 hover:bg-red-100 p-2 transition rounded"
                        />
                      </div>
                      <p className="text-gray-500">Các lựa chọn</p>
                      <div className="space-y-2">
                        {option.choices.map((choice, choiceIndex) => (
                          <div
                            className="space-x-2 flex items-center"
                            key={choiceIndex}
                          >
                            <input
                              type="text"
                              placeholder="lựa chọn"
                              onChange={(e) =>
                                handleUpdateChoiceName(
                                  optionIndex,
                                  choiceIndex,
                                  e.target.value
                                )
                              }
                              className="border-gray-400 border p-2 rounded-xl bg-white focus:outline-none"
                            />
                            <input
                              type="number"
                              placeholder="giá tiền"
                              onChange={(e) =>
                                handleUpdateChoicePrice(
                                  optionIndex,
                                  choiceIndex,
                                  e.target.value
                                )
                              }
                              className="border-gray-400 border p-2 rounded-xl bg-white focus:outline-none"
                            />
                            <FontAwesomeIcon
                              icon={faX}
                              onClick={() =>
                                handleDeleteChoice(optionIndex, choiceIndex)
                              }
                              className="text-red-500 hover:bg-red-100 p-2 transition rounded"
                            />
                          </div>
                        ))}
                      </div>
                      <button
                        className="text-blue-500 cursor-pointer"
                        onClick={() => handleAddChoice(optionIndex)}
                      >
                        <FontAwesomeIcon icon={faPlus} /> Thêm Lựa chọn
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  className="bg-green-500 p-2 text-white rounded-lg"
                  onClick={handleAddOption}
                >
                  Thêm lựa chọn
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
