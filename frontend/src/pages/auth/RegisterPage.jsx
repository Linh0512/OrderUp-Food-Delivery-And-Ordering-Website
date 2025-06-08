import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import loginImage from "../../assets/loginImage.png";
import {
  faEnvelope,
  faLock,
  faUser,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      setIsLoading(false);
      return;
    }

    try {
      // Giả lập đăng ký thành công
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setError("Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-white flex flex-col justify-center items-center p-10">
        <img src={logo} alt="Logo" className="h-20 mb-10" />
        <h1 className="text-4xl mb-6">Đăng ký</h1>

        {error && (
          <div className="w-2/3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-2/3">
          <div className="mb-4">
            <label htmlFor="email" className="block font-bold mb-2">Email</label>
            <div className="flex border-b-2 py-2">
              <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 mr-3" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="flex-1 outline-none"
                placeholder="Nhập email của bạn"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="firstName" className="block font-bold mb-2">Họ</label>
              <div className="flex border-b-2 py-2">
                <FontAwesomeIcon icon={faUser} className="text-gray-500 mr-3" />
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="flex-1 outline-none"
                  placeholder="Họ"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="lastName" className="block font-bold mb-2">Tên</label>
              <div className="flex border-b-2 py-2">
                <FontAwesomeIcon icon={faUser} className="text-gray-500 mr-3" />
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="flex-1 outline-none"
                  placeholder="Tên"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block font-bold mb-2">Số điện thoại</label>
            <div className="flex border-b-2 py-2">
              <FontAwesomeIcon icon={faPhone} className="text-gray-500 mr-3" />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="flex-1 outline-none"
                placeholder="Nhập số điện thoại của bạn"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block font-bold mb-2">Mật khẩu</label>
            <div className="flex border-b-2 py-2">
              <FontAwesomeIcon icon={faLock} className="text-gray-500 mr-3" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="flex-1 outline-none"
                placeholder="Nhập mật khẩu của bạn"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block font-bold mb-2">Xác nhận mật khẩu</label>
            <div className="flex border-b-2 py-2">
              <FontAwesomeIcon icon={faLock} className="text-gray-500 mr-3" />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="flex-1 outline-none"
                placeholder="Nhập lại mật khẩu của bạn"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>

          <div className="text-center mt-4">
            Đã có tài khoản? <a href="/login" className="text-red-500 hover:underline">Đăng nhập</a>
          </div>
        </form>
      </div>

      <div className="w-1/2 bg-red-500">
        <img
          src={loginImage}
          alt="Login Banner"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import loginImage from "../assets/loginImage.png";
// import {
//   faEnvelope,
//   faLockOpen,
//   faUser,
// } from "@fortawesome/free-solid-svg-icons";

// export default function SignUpPage() {
//   return (
//     <div className="relative w-[65vw] mx-auto">
//       <img src={loginImage} alt="" className="mx-auto"/>
//       <div className="absolute inset-0 space-y-12 flex flex-col w-[30%] top-25 left-40">
//         <p className="text-9xl text-white dancing-script-700 text-center">
//           Register
//         </p>
//         <div>
//           <div className="text-white border-b py-2 text-xl space-x-2 opacity-90 flex items-center">
//             <FontAwesomeIcon icon={faUser} />
//             <input
//               type="text"
//               name=""
//               id=""
//               placeholder="Full Name"
//               className="focus:outline-none focus:ring-0 focus:border-none w-full"
//             />
//           </div>
//           <div className="text-white border-b py-2 text-xl space-x-2 opacity-90 flex items-center mt-7">
//             <FontAwesomeIcon icon={faEnvelope} />
//             <input
//               type="text"
//               name=""
//               id=""
//               placeholder="Email"
//               className="focus:outline-none focus:ring-0 focus:border-none w-full"
//             />
//           </div>
//           <div className="text-white border-b py-2 text-xl space-x-2 opacity-90 flex items-center mt-7">
//             <FontAwesomeIcon icon={faLockOpen} />
//             <input
//               type="text"
//               name=""
//               id=""
//               placeholder="Password"
//               className="focus:outline-none focus:ring-0 focus:border-none w-full"
//             />
//           </div>
//         </div>
//         <button className="w-[90%] mx-auto bg-lime-500 p-3 text-xl text-white rounded-3xl mt-5">
//           Sign up
//         </button>
//         <p className="text-center text-white font-light">
//           If you have an account? <span className="text-lime-500">Login</span>
//         </p>
//         <p className="text-center text-sm text-white my-auto font-light">
//           By creating an account, you agree to our{" "}
//           <span className="text-lime-500">Terms & Conditions</span>
//         </p>
//       </div>
//     </div>
//   );
// }