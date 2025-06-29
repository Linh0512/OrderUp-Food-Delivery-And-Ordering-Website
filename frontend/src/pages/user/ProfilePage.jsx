import {
  faCalendarDay,
  faCircleUser,
  faPhone,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import ChangePasswordPopUp from "../../components/ChangePasswordPopUp";
import { useAuth } from "../../components/common/AuthContext";
import CustomSelect from "../../components/CustomSelect";
import { uploadImage } from "../../services/hosResServices/Product";
import {
  getUserProfile,
  updatedUser,
} from "../../services/userServices/Service";

export default function ProfilePage() {
  const [showPopUp, setShowPopup] = useState(false);
  const [userDetail, setUserDetail] = useState({});
  const [fileSelected, setFileSelected] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isUpLoading, setIsUpLoading] = useState(false);
  const { user } = useAuth();

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

  const handleUpdated = async () => {
    const { avatar, ...fieldsToCheck } = userDetail;
    const isFilled = Object.values(fieldsToCheck).every(
      (value) => value && value.trim() !== ""
    );
    if (!isFilled) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    let tmp = userDetail;
    if (fileSelected) {
      setIsUpLoading(true);
      await uploadImage(fileSelected, user.token).then((res) => {
        tmp = {
          ...userDetail,
          avatar: res.data.url,
        };
        setUserDetail(tmp);
      });
    }
    console.log(tmp)
    await updatedUser(user.userId, tmp, user.token);
    setFileSelected(null);
    setPreviewImage(null);
    setIsUpLoading(false);
    alert("Cập nhật thông tin thành công");
  };

  useEffect(() => {
    getUserProfile(user.userId, user.token).then((res) => {
      console.log(res);
      setUserDetail(res.profile);
    });
  }, [user]);
  return (
    <div className="w-[60vw] mx-auto">
      <p className="dancing-script-700 text-7xl ">Profile</p>
      <hr className="mb-10" />
      <div className="flex justify-between">
        <div className=" w-[60%] space-y-10 border p-8 rounded-2xl bg-white">
          <div className="flex justify-between">
            <div className="text-xl w-[70%] text-gray-400 space-y-2">
              <p className="font-semibold">Họ</p>
              <div className="border-b space-x-2">
                <FontAwesomeIcon icon={faCircleUser} />
                <input
                  type="text"
                  placeholder="firstName"
                  className="w-[90%] focus:outline-none"
                  defaultValue={userDetail.firstName}
                  onChange={(e) =>
                    setUserDetail({ ...userDetail, firstName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="text-xl text-gray-400 space-y-2">
              <p className="font-semibold">Giới tính</p>
              <div className="flex items-center space-x-2 ">
                <div className="text-black">
                  <CustomSelect
                    options={[
                      { name: "Nam", value: "male" },
                      { name: "Nữ", value: "female" },
                    ]}
                    handleChange={(value) =>
                      setUserDetail({ ...userDetail, gender: value })
                    }
                    selected={userDetail.gender}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="text-xl text-gray-400 space-y-2">
              <p className="font-semibold">Tên</p>
              <div className="border-b space-x-2">
                <FontAwesomeIcon icon={faCircleUser} />
                <input
                  type="text"
                  placeholder="lastName"
                  className="w-[90%] focus:outline-none"
                  defaultValue={userDetail.lastName}
                  onChange={(e) =>
                    setUserDetail({ ...userDetail, lastName: e.target.value })
                  }
                />
              </div>
            </div>
          <div className="text-xl text-gray-400 space-y-2">
            <p className="font-semibold">Ngày sinh</p>
            <div className="border-b space-x-2">
              <FontAwesomeIcon icon={faCalendarDay} />
              <input
                type="date"
                className="w-[90%] focus:outline-none"
                defaultValue={userDetail.dateOfBirth}
                onChange={(e) =>
                  setUserDetail({ ...userDetail, dateOfBirth: e.target.value })
                }
              />
            </div>
          </div>
          <div className="text-xl text-gray-400 space-y-2">
            <p className="font-semibold">Số điện thoại</p>
            <div className="border-b flex space-x-2">
              <FontAwesomeIcon icon={faPhone} />
              <input
                type="tel"
                placeholder="Username"
                className="w-[90%] focus:outline-none"
                defaultValue={userDetail.phone}
                onChange={(e) =>
                  setUserDetail({ ...userDetail, phone: e.target.value })
                }
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center space-y-4 w-[40%]">
          <div className="size-40 overflow-hidden bg-gray-100">
            <img
              src={previewImage || userDetail.avatar}
              alt="Avatar"
              className="size-40 object-cover rounded-full text-center "
            />
          </div>
          <label className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer text-sm hover:bg-red-600 transition">
            Thay hình ảnh
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
        </div>
      </div>
      <div className="flex w-fit gap-5 mt-10">
        <button
          className={`  px-4 py-2 rounded text-sm transition text-white ${
            isUpLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600"
          }`}
          onClick={handleUpdated}
        >
          {isUpLoading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />{" "}
              Đang Lưu...{" "}
            </>
          ) : (
            "Lưu Thông Tin"
          )}
        </button>
        <button
          className=" bg-red-500 px-4 py-2 rounded text-sm hover:bg-red-600 transition text-white"
          onClick={() => setShowPopup(true)}
        >
          Đổi mật khẩu
        </button>
      </div>
      {showPopUp && (
        <ChangePasswordPopUp handleClose={setShowPopup} token={user.token} />
      )}
    </div>
  );
}
