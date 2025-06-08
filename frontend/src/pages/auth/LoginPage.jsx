import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLockOpen } from "@fortawesome/free-solid-svg-icons";
import loginImage from "../../assets/loginImage.png";
import authService from '../../services/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  // QUAN TRỌNG: Ngăn chặn form submit mặc định
  e.preventDefault();
  
  setError('');
  setIsLoading(true);

  try {
    console.log('Attempting login with:', { email });
    
    // Gọi API đăng nhập trực tiếp bằng fetch để tránh các vấn đề với axios
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    console.log('Login response data:', data);
    
    if (data.success) {
      // Lưu dữ liệu người dùng
      localStorage.setItem('user_data', JSON.stringify({
        userId: data.userId,
        role: data.role,
        token: data.token,
        email: email
      }));
      
      alert('Đăng nhập thành công! Chuyển hướng đến trang chủ...');
      
        // Điều hướng dựa trên role
      if (data.role === 'admin') {
        window.location.href = `http://localhost:8080/api/admin-auth/login-with-token?token=${data.token}`;
      } else if (data.role === 'restaurantHost') {
        window.location.href = '/restaurant/dashboard';
      } else {
        // Chuyển đến /home thay vì /
        window.location.href = '/home';
      }
    } else {
      setError(data.message || 'Đăng nhập thất bại');
    }
  } catch (error) {
    console.error('Login error:', error);
    setError(`Có lỗi xảy ra khi đăng nhập: ${error.message || 'Unknown error'}`);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="relative w-[65vw] mx-auto">
      <img src={loginImage} alt="" className="mx-auto"/>
      <div className="absolute inset-0 space-y-12 flex flex-col w-[30%] top-25 left-40">
        <p className="text-9xl text-white dancing-script-700 text-center">
          Login
        </p>
        <form onSubmit={handleSubmit}>
          <div>
            <div className="text-white border-b py-2 text-xl space-x-2 opacity-90 flex items-center">
              <FontAwesomeIcon icon={faEnvelope} />
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="focus:outline-none focus:ring-0 focus:border-none w-full bg-transparent"
                required
              />
            </div>
            <div className="text-white border-b py-2 text-xl space-x-2 opacity-90 flex items-center mt-7">
              <FontAwesomeIcon icon={faLockOpen} />
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="focus:outline-none focus:ring-0 focus:border-none w-full bg-transparent"
                required
              />
            </div>
            <p className="text-end text-lime-500 font-light mt-2">
              <a href="/forgot-password">Forget Password?</a>
            </p>
          </div>
          {error && (
            <div className="text-red-400 mt-2 text-center">
              {error}
            </div>
          )}
          <button 
            type="submit" 
            className="w-[90%] mx-auto bg-lime-500 p-3 text-xl text-white rounded-3xl mt-5"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-white my-auto font-light">
          Don't have an account? <span className="text-lime-500"><a href="/register">Sign Up</a></span>
        </p>
      </div>
    </div>
  );
}