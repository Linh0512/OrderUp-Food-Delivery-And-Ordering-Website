import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import loginImage from "../../assets/loginImage.png";
import { faEnvelope, faLockOpen } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../components/common/AuthContext";

export default function LoginPage() {
  const [account, setAccount] = useState({ email: "", password: "" });
  const { Login } = useAuth();
  const nav = useNavigate();

  const handleLogin = async () => {
    const res = await Login(account.email, account.password);
    if (res.token)
    {
      if(res.role==='admin')
        window.location.href = `http://localhost:8080/api/admin-auth/login-with-token?token=${res.token}`
      else if(res.role==='restaurantHost')
        nav('hostres')
      else
        nav('/')
    }
    else
      alert('đăng nhập thất bại')
  };

  return (
    <div className="relative w-[65vw] mx-auto">
      <img src={loginImage} alt="" className="mx-auto"/>
      <div className="absolute inset-0 space-y-12 flex flex-col w-[30%] top-25 left-40">
        <p className="text-9xl text-white dancing-script-700 text-center">
          Login
        </p>
        <div>
          <div className="text-white border-b py-2 text-xl space-x-2 opacity-90 flex items-center">
            <FontAwesomeIcon icon={faEnvelope} />
            <input
              type="text"
              placeholder="Email"
              className="focus:outline-none focus:ring-0 focus:border-none w-full"
              onChange={(e) =>
                setAccount({ ...account, email: e.target.value })
              }
            />
          </div>
          <div className="text-white border-b py-2 text-xl space-x-2 opacity-90 flex items-center mt-7">
            <FontAwesomeIcon icon={faLockOpen} />
            <input
              type="text"
              placeholder="Password"
              className="focus:outline-none focus:ring-0 focus:border-none w-full"
              onChange={(e) =>
                setAccount({ ...account, password: e.target.value })
              }
            />
          </div>
          <Link to={"/forget"}>
            <p className="text-end text-lime-500 font-light mt-2">
              Forget Password?
            </p>
          </Link>
        </div>
        <button
          className="w-[90%] mx-auto bg-lime-500 p-3 text-xl text-white rounded-3xl mt-5"
          onClick={handleLogin}
        >
          Login
        </button>
        <p className="text-center text-white my-auto font-light">
          Don’t have an account?{" "}
          <Link to={"/signup"}>
            <span className="text-lime-500">Sign Up</span>
          </Link>
        </p>
      </div>
    </div>
  );
}