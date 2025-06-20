import { faLocationDot, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import AddressItem from "../../components/AddressItem";
import AddressPopUp from "../../components/AddressPopUp";
import {
  addAddress,
  deleteAddress,
  getAddress,
  updateAddress,
  updatedUser,
} from "../../services/userServices/Service";
import { useAuth } from "../../components/common/AuthContext";
import { Await } from "react-router-dom";

export default function AddressPage() {
  const [addresses, setAddresses] = useState([]);
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [index,setIndex]=useState(null)
  const [formData, setFormData] = useState({
    title: "",
    fullAddress: "",
    default: false,
  });

  useEffect(() => {
    getAddress(user.userId, user.token).then((res) => {
      console.log(res);
      setAddresses(res);
    });
  }, [user]);

  // Mở modal thêm mới
  const handleAdd = () => {
    setIndex(null)
    setFormData({ title: "", fullAddress: "", default: false });
    setShowModal(true);
  };

  // Mở modal chỉnh sửa
  const handleEdit = (address,index) => {
    setIndex(index)
    setFormData({
      title: address.title,
      fullAddress: address.fullAddress,
      default: address.default,
    });
    setShowModal(true);
  };

  // Xóa địa chỉ
  const handleDelete = async (index) => {
    const addressToDelete = addresses[index];
    if (addressToDelete?.default) {
      alert("Không thể xóa địa chỉ mặc định!");
      return;
    }

    await deleteAddress(user.userId, user.token, index);

    if (window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      setAddresses(addresses.filter((_, i) => i !== index));
    }
  };

  // Đặt làm địa chỉ mặc định
  const handleSetDefault = (index) => {
    const tmp={...addresses[index],default:true}
    updateAddress(user.userId,user.token,tmp,index)
    setAddresses(
      addresses.map((addr,i) => i===index?{...addr,default:true}:{...addr,default:false})
    );
  };

  // Lưu địa chỉ (thêm mới hoặc cập nhật)
  const handleSave = async() => {
    if (!formData.title.trim() || !formData.fullAddress.trim()) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (index===0||index) {
      await updateAddress(user.userId,user.token,formData,index)
      console.log("sửa địa chỉ thành công");
      setAddresses(
        addresses.map((addr,i) =>
          i === index
            ? { ...addr, ...formData }
            : formData.default
            ? { ...addr, default: false }
            : addr
        )
      );
    } else {
      // Thêm địa chỉ mới
      await addAddress(user.userId, user.token, formData);
      console.log("thêm địa chỉ thành công");
      setAddresses([
        ...addresses.map((addr) =>
          formData.default ? { ...addr, default: false } : addr
        ),
        formData,
      ]);
    }

    setShowModal(false);
    setFormData({ title: "", fullAddress: "", default: false });
  };

  return (
    <div className="w-[70vw] min-h-[60vh] bg-gray-50 p-6 mx-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b">
          <h1 className="text-5xl text-gray-800 dancing-script-700">
            Quản Lý Địa Chỉ
          </h1>
        </div>
        <button
          onClick={handleAdd}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ml-auto mb-4"
        >
          <FontAwesomeIcon icon={faPlus} />
          Thêm Địa Chỉ
        </button>

        {/* Danh sách địa chỉ */}
        <div className="space-y-4">
          {addresses.length === 0 ? (
            <div className="text-center py-12">
              <FontAwesomeIcon
                icon={faLocationDot}
                className="text-gray-300 mx-auto mb-4"
              />
              {/* <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" /> */}
              <p className="text-gray-500 text-lg">Chưa có địa chỉ nào</p>
              <button
                onClick={handleAdd}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Thêm địa chỉ đầu tiên
              </button>
            </div>
          ) : (
            addresses.map((address, index) => (
              <AddressItem
                address={address}
                handleEdit={handleEdit}
                key={index}
                index={index}
                handleDelete={handleDelete}
                handleSetDefault={handleSetDefault}
              />
            ))
          )}
        </div>

        {/* Modal thêm/sửa địa chỉ */}
        {showModal && (
          <AddressPopUp
            index={index}
            formData={formData}
            setFormData={setFormData}
            setShowModal={setShowModal}
            handleSave={handleSave}
          />
        )}
      </div>
    </div>
  );
}
