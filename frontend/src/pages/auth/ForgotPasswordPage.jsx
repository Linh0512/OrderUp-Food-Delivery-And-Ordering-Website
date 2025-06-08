import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import loginImage from "../../assets/loginImage.png";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/logo.png";

export default function ForgetPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Giả lập gửi email khôi phục mật khẩu
      setTimeout(() => {
        setIsSubmitted(true);
      }, 1500);
    } catch (error) {
      setError("Có lỗi xảy ra khi gửi email khôi phục. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-white flex flex-col justify-center items-center p-10">
        <img src={logo} alt="Logo" className="h-20 mb-10" />
        <h1 className="text-4xl mb-6">Quên mật khẩu</h1>

        {error && (
          <div className="w-2/3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {isSubmitted ? (
          <div className="w-2/3 text-center">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Một email đã được gửi đến {email} với hướng dẫn đặt lại mật khẩu.
            </div>
            <p className="mb-4">
              Nếu bạn không nhận được email, hãy kiểm tra thư mục spam hoặc thử
              lại.
            </p>
            <a
              href="/login"
              className="inline-block bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Quay lại đăng nhập
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-2/3">
            <div className="mb-6">
              <label htmlFor="email" className="block font-bold mb-2">
                Email
              </label>
              <div className="flex border-b-2 py-2">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="text-gray-500 mr-3"
                />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 outline-none"
                  placeholder="Nhập email của bạn"
                  required
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Chúng tôi sẽ gửi một liên kết đặt lại mật khẩu đến email của
                bạn.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Đang gửi..." : "Gửi liên kết đặt lại mật khẩu"}
            </button>

            <div className="text-center mt-4">
              Nhớ mật khẩu?{" "}
              <a href="/login" className="text-red-500 hover:underline">
                Quay lại đăng nhập
              </a>
            </div>
          </form>
        )}
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
// import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

// export default function ForgetPage() {
//   return (
//     <div className="relative w-[65vw] mx-auto ">
//       <img src={loginImage} alt="" className="mx-auto" />
//       <div className="absolute inset-0 space-y-12 flex flex-col w-[50%] top-25 left-15">
//         <div>
//           <p className="text-7xl text-white dancing-script-700 text-center">
//             Forgot Password
//           </p>
//           <p className="text-xl text-white text-center mt-4">
//             Enter your email to reset password
//           </p>
//         </div>

//         <div className="w-[60%] mx-auto">
//           <div className="text-white border-b py-2 text-xl space-x-2 opacity-90 flex items-center">
//             <FontAwesomeIcon icon={faEnvelope} />
//             <input
//               type="text"
//               name=""
//               id=""
//               placeholder="Email"
//               className="focus:outline-none focus:ring-0 focus:border-none w-full"
//             />
//           </div>
//           <p className="text-end text-lime-500 font-light mt-2">
//             You have account?
//           </p>
//         </div>
//         <button className="w-[50%] mx-auto bg-lime-500 p-3 text-xl text-white rounded-3xl ">
//           Login
//         </button>
//         <p className="text-center text-white my-auto font-light">
//           Don’t have an account? <span className="text-lime-500">Sign Up</span>
//         </p>
//       </div>
//     </div>
//   );
// }