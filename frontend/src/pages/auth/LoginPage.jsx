import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import loginImage from '../../assets/loginImage.png';
import authService from '../../services/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const lastEmail = localStorage.getItem('last_email');
      if (lastEmail) {
        setEmail(lastEmail);
        console.log('Last used email loaded:', lastEmail);
      }
    } catch (error) {
      console.error('Error loading last email:', error);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    setIsLoading(true);

    try {
      console.log('Attempting login with:', { email });
      
      // Gọi API đăng nhập
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
        // Tính thời gian hết hạn (24 giờ từ bây giờ)
        const expiresAt = new Date().getTime() + 24 * 60 * 60 * 1000;
        
        // Lưu dữ liệu người dùng với thời gian hết hạn
        const userData = {
          userId: data.userId,
          role: data.role,
          token: data.token,
          email: email,
          expiresAt: expiresAt
        };
        
        localStorage.setItem('user_data', JSON.stringify(userData));
        console.log('User data saved to localStorage with expiration:', new Date(expiresAt).toLocaleString());
                
        // Điều hướng dựa trên role
        if (data.role === 'admin') {
          window.location.href = `http://localhost:8080/api/admin-auth/login-with-token?token=${data.token}`;
        } else if (data.role === 'restaurantHost') {
          navigate('/restaurant/dashboard');
        } else {
          navigate('/home');
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
                className="bg-transparent outline-none w-full"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="text-white border-b py-2 text-xl space-x-2 mt-5 opacity-90 flex items-center">
              <FontAwesomeIcon icon={faLock} />
              <input
                type="password"
                className="bg-transparent outline-none w-full"
                placeholder="Nhập mật khẩu của bạn"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-4">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className={`w-full py-2 rounded-xl mt-5 text-white text-lg font-semibold ${
              isLoading ? "bg-gray-500" : "bg-[rgba(227,70,63,1)] hover:bg-red-700"
            } transition`}
            disabled={isLoading}
          >
            {isLoading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
          </button>
          <div className="flex mt-2 justify-between text-white">
            <a href="/forgot-password" className="opacity-80 hover:underline">
              Quên mật khẩu
            </a>
            <a href="/register" className="opacity-80 hover:underline">
              Đăng ký
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}