import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import money from "../../assets/money.png";
import zalopay from "../../assets/zalopay.png";

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [address, setAddress] = useState({
    address: "Số 100 đường A, Phường B, Quận 7, Hồ Chí Minh, Việt Nam",
    note: "",
    name: "",
    email: "",
    phone: "",
    method: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const cart = location.state?.cart || [];
  const subtotal=location.state?.subtotal
  const discount=location.state?.discount||0

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
    setAddress({...address,method:event.target.value})
  };

  const handleSubmit = () => {
    const { note, ...fieldsToCheck } = address;
    const isFilled = Object.values(fieldsToCheck).every(
      (value) => value && value.trim() !== ""
    );
    if (!isFilled) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    navigate("/tracking", { state: { cart,address } })
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
          <div className="p-4 shadow rounded-3xl bg-white px-7">
            <h3 className="font-semibold ">Giao đến</h3>
            <p>Số 100 đường A, Phường B, Quận 7, Hồ Chí Minh, Việt Nam</p>
            <p className="font-semibold my-3">Ghi chú</p>
            <input
              type="text"
              name=""
              id=""
              placeholder="Ghi chú cho giao hàng, ví dụ: tầng phòng,..."
              onChange={(e)=>setAddress({...address,note:e.target.value})}
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
                onChange={(e)=>setAddress({...address,name:e.target.value})}
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
                onChange={(e)=>setAddress({...address,email:e.target.value})}
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
                onChange={(e)=>setAddress({...address,phone:e.target.value})}
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
            <p>chi tiết thanh toán</p>
            <div className="flex justify-between">
              <p>Tạm tính</p>
              <p>{subtotal}</p>
            </div>
            <div className="flex justify-between">
              <p>Giảm giá</p>
              <p className="text-red-500">-{discount}</p>
            </div>
            <div className="flex justify-between">
              <p>Phí giao hàng</p>
              <p>30000</p>
            </div>
            <hr className="w-[80%] mx-auto" />
            <div className="flex justify-between text-xl">
              <p>Tổng cộng</p>
              <p className="text-green-500 ">{subtotal+30000-discount}</p>
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
