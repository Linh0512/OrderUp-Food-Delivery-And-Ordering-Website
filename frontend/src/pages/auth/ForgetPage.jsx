import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import loginImage from "../../assets/loginImage.png";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function ForgetPage() {
  return (
    <div className="relative w-[65vw] mx-auto ">
      <img src={loginImage} alt="" className="mx-auto" />
      <div className="absolute inset-0 space-y-12 flex flex-col w-[50%] top-25 left-15">
        <div>
          <p className="text-7xl text-white dancing-script-700 text-center">
            Forgot Password
          </p>
          <p className="text-xl text-white text-center mt-4">
            Enter your email to reset password
          </p>
        </div>

        <div className="w-[60%] mx-auto">
          <div className="text-white border-b py-2 text-xl space-x-2 opacity-90 flex items-center">
            <FontAwesomeIcon icon={faEnvelope} />
            <input
              type="text"
              name=""
              id=""
              placeholder="Email"
              className="focus:outline-none focus:ring-0 focus:border-none w-full"
            />
          </div>
          <Link to={'/login'} ><p className="text-end text-lime-500 font-light mt-2">
            You have account?
          </p></Link>
        </div>
        <button className="w-[50%] mx-auto bg-lime-500 p-3 text-xl text-white rounded-3xl ">
          Reset password
        </button>
        <p className="text-center text-white my-auto font-light">
          Don’t have an account? <Link to={'/signup'} className="text-lime-500">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
