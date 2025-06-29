import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import money from "../../assets/money.png";
import zalopay from "../../assets/zalopay.png";
import { useAuth } from "../../components/common/AuthContext";
import {
  createOrder,
  getAddress,
  UseVoucher
} from "../../services/userServices/Service";
import { formatCurrencyVN } from "../../utils/Format";

export default function PaymentPage() {
  const [addresses, setAddresses] = useState([]);
  const [addressMethod, setAddressMethod] = useState("select");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [addressDetail, setAddressDetail] = useState({
    address: selectedAddress,
    note: "",
    name: "",
    email: "",
    phone: "",
    method: "",
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const cart = location.state?.cart || [];
  const subtotal = location.state?.subtotal;
  const discount = location.state?.discount || {};

  useEffect(() => {
    getAddress(user.userId, user.token).then((res) => {
      console.log(res);
      setAddresses(res);
      const defaultAddr = res.find((item) => item.default);
      if (defaultAddr) {
        setAddressDetail((prev) => ({
          ...prev,
          address: defaultAddr.fullAddress + " (" + defaultAddr.title + ")",
        }));
        setSelectedAddress(
          defaultAddr.fullAddress + " (" + defaultAddr.title + ")"
        );
      }
    });
  }, [user]);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
    setAddressDetail({ ...addressDetail, method: event.target.value });
  };

  const handleSubmit = async () => {
    const { note, ...fieldsToCheck } = addressDetail;
    const isFilled = Object.values(fieldsToCheck).every(
      (value) => value && value.trim() !== ""
    );
    if (!isFilled) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    let orderData = {};

    if (discount.value) {
      orderData = {
        cartId: cart.id,
        deliveryInfo: {
          fullAddress: addressDetail.address,
          district: "Quận 3",
          city: "TP.HCM",
          customerName: addressDetail.name,
          customerPhone: addressDetail.phone,
          deliveryInstructions: addressDetail.note,
        },
        paymentInfo: {
          method: paymentMethod,
        },
        promoInfo: {
          code: discount.code || "",
        },
      };
    } else {
      orderData = {
        cartId: cart.id,
        deliveryInfo: {
          fullAddress: addressDetail.address,
          district: "Quận 3",
          city: "TP.HCM",
          customerName: addressDetail.name,
          customerPhone: addressDetail.phone,
          deliveryInstructions: addressDetail.note,
        },
        paymentInfo: {
          method: paymentMethod,
        },
      };
    }

    await createOrder(user.token, orderData); 

    navigate("/tracking", {
      state: { cart: cart.items, addressDetail, subtotal, discount },
    });
  };
  return (
    <div className="w-[70vw] mx-auto">
      <div className="flex items-center">
        <button
          className="flex items-center justify-start"
          onClick={() => navigate("/cart")}
        >
          <FontAwesomeIcon icon={faAngleLeft} className="text-xl mr-1" />
          trở lại
        </button>
        <h2 className="dancing-script-700 text-5xl flex-1 text-center">
          Thanh Toán
        </h2>
      </div>
      <div className="flex mt-8 space-x-10">
        <div className="w-[65%] space-y-5 ">
          <div className="p-4 shadow rounded-3xl bg-white px-7 space-y-3">
            <h3 className="font-semibold ">Giao đến</h3>
            <div className="flex items-center space-x-4">
              <input
                type="radio"
                name=""
                id=""
                value={"select"}
                checked={addressMethod === "select"}
                onChange={(e) => setAddressMethod(e.target.value)}
              />
              <p className="font-semibold text-sm text-gray-400">
                Chọn địa chỉ
              </p>
              <select
                value={selectedAddress}
                onChange={(e) => {
                  setSelectedAddress(e.target.value);
                  setAddressDetail({
                    ...addressDetail,
                    address: e.target.value,
                  });
                }}
                disabled={addressMethod !== "select"}
                className={`w-[80%] px-4 py-3 border ${
                  addressMethod !== "select"
                    ? "bg-gray-200 cursor-not-allowed text-gray-500"
                    : "hover:border-gray-400"
                } border-gray-300 rounded-lg focus:outline-none shadow-sm  transition-all duration-200 cursor-pointer`}
              >
                {addresses.map((item, index) => (
                  <option
                    value={item.fullAddress + " (" + item.title + ")"}
                    key={index}
                    className="py-2 px-4 text-gray-900 hover:bg-blue-50"
                  >
                    {item.fullAddress + " (" + item.title + ")"}
                  </option>
                ))}
              </select>
            </div>
            <div className="items-center flex space-x-4">
              <input
                type="radio"
                value={"write"}
                checked={addressMethod === "write"}
                onChange={(e) => setAddressMethod(e.target.value)}
              />
              <p className="font-semibold text-sm text-gray-400">
                Hoặc nhập địa chỉ
              </p>
              <input
                type="text"
                onChange={(e) =>
                  setAddressDetail({
                    ...addressDetail,
                    address: e.target.value,
                  })
                }
                disabled={addressMethod !== "write"}
                className={`w-[80%] px-4 py-3 border ${
                  addressMethod !== "write"
                    ? "bg-gray-200 cursor-not-allowed text-gray-500"
                    : "hover:border-gray-400"
                } border-gray-300 rounded-lg focus:outline-none shadow-sm  transition-all duration-200`}
              />
            </div>
            <p className="font-semibold my-3">Ghi chú</p>
            <input
              type="text"
              name=""
              id=""
              placeholder="Ghi chú cho giao hàng, ví dụ: tầng phòng,..."
              onChange={(e) =>
                setAddressDetail({ ...addressDetail, note: e.target.value })
              }
              className="border p-3 w-full rounded-2xl"
            />
          </div>
          <div className="p-4 shadow rounded-3xl bg-white px-7">
            <h3 className="font-semibold text-xl mb-7">Người đặt hàng</h3>
            <div>
              <p className="font-semibold my-3">Họ và tên</p>
              <input
                type="text"
                name=""
                id=""
                onChange={(e) =>
                  setAddressDetail({ ...addressDetail, name: e.target.value })
                }
                placeholder="Nhập họ tên đầy đủ của bạn"
                className="border p-3 w-full rounded-2xl"
              />
            </div>
            <div>
              <p className="font-semibold my-3">Email</p>
              <input
                type="text"
                name=""
                id=""
                onChange={(e) =>
                  setAddressDetail({ ...addressDetail, email: e.target.value })
                }
                placeholder="Nhập email của bạn"
                className="border p-3 w-full rounded-2xl"
              />
            </div>
            <div>
              <p className="font-semibold my-3">Số điện thoại</p>
              <input
                type="text"
                name=""
                id=""
                onChange={(e) =>
                  setAddressDetail({ ...addressDetail, phone: e.target.value })
                }
                placeholder="Nhập số điện thoại của bạn"
                className="border p-3 w-full rounded-2xl"
              />
            </div>
          </div>
          <div className="p-4 shadow rounded-3xl bg-white px-7">
            <h3 className="font-semibold text-xl mb-7">
              Phương thức thanh toán
            </h3>
            <ul className="space-y-5">
              <div className="flex items-center w-[25%] justify-between">
                <input
                  type="radio"
                  className="w-5 h-5 accent-blue-600 rounded-full"
                  value={"cash"}
                  checked={paymentMethod === "cash"}
                  onChange={handlePaymentMethodChange}
                />
                <img src={money} alt="" className="w-8" />
                <p>Tiền mặt</p>
              </div>
              <div className="flex items-center w-[25%] justify-between">
                <input
                  type="radio"
                  className="w-5 h-5 accent-blue-600 rounded-full"
                  value={"zalopay"}
                  checked={paymentMethod === "zalopay"}
                  onChange={handlePaymentMethodChange}
                />
                <img src={zalopay} alt="" className="w-8" />
                <p>ZaloPay</p>
              </div>
            </ul>
          </div>
        </div>
        <div className=" w-[30%]">
          <div className="space-y-7 p-4 shadow h-fit rounded-4xl font-semibold bg-white">
            <p>Chi tiết thanh toán</p>
            <div className="flex justify-between">
              <p>Tạm tính</p>
              <p>{formatCurrencyVN(subtotal)}</p>
            </div>
            <div className="flex justify-between">
              <p>Giảm giá</p>
              <p className="text-red-500">
                -{formatCurrencyVN(discount.value)}
              </p>
            </div>
            <div className="flex justify-between">
              <p>Phí giao hàng</p>
              <p>{formatCurrencyVN(30000)}</p>
            </div>
            <hr className="w-[80%] mx-auto" />
            <div className="flex justify-between text-xl">
              <p>Tổng cộng</p>
              <p className="text-green-500 ">
                {formatCurrencyVN(subtotal + 30000 - (discount.value || 0))}
              </p>
            </div>
          </div>
          <button
            className="w-full bg-[rgba(227,70,63,1)] hover:bg-red-700 transition rounded-3xl shadow font-bold p-3 text-white text-xl mt-7"
            onClick={handleSubmit}
          >
            Đặt hàng
          </button>
        </div>
      </div>
    </div>
  );
}
