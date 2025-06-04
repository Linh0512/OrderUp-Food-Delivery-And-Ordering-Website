import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import loginImage from "../assets/loginImage.png";
import { faEnvelope, faLockOpen } from "@fortawesome/free-solid-svg-icons";

export default function LoginPage() {
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
              name=""
              id=""
              placeholder="Email"
              className="focus:outline-none focus:ring-0 focus:border-none w-full"
            />
          </div>
          <div className="text-white border-b py-2 text-xl space-x-2 opacity-90 flex items-center mt-7">
            <FontAwesomeIcon icon={faLockOpen} />
            <input
              type="text"
              name=""
              id=""
              placeholder="Password"
              className="focus:outline-none focus:ring-0 focus:border-none w-full"
            />
          </div>
          <p className="text-end text-lime-500 font-light mt-2">
            Forget Password?
          </p>
        </div>
        <button className="w-[90%] mx-auto bg-lime-500 p-3 text-xl text-white rounded-3xl mt-5">
          Login
        </button>
        <p className="text-center text-white my-auto font-light">Don’t have an account? <span className="text-lime-500">Sign Up</span></p>
      </div>
    </div>
  );
}
