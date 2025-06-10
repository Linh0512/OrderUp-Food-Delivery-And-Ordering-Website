import {
  faCartShopping,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import CustomIconButtonSelect from "./ProfileSelect";
import { useAuth } from "./common/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { isLogin } = useAuth();
  console.log(isLogin);

  return (
    <div className="flex space-x-3 w-full py-5 items-center px-20 caret-transparent">
      <img
        src={logo}
        alt="logo"
        className="w-[8%]"
        onClick={() => navigate("/")}
      />
      <div className="flex space-x-5 items-center ml-5">
        <Link
          to={"/"}
          className="text-2xl font-extralight hover:font-normal transition"
        >
          Trang chủ
        </Link>
        <Link
          to={"/resDashboard"}
          className="text-2xl font-extralight hover:font-normal transition"
        >
          Cửa hàng
        </Link>
      </div>
      <div className=" border border-gray-400 rounded-2xl caret-black px-4 ml-auto">
        <input
          type="text"
          id=""
          placeholder="tìm kiếm..."
          className="py-2 focus:outline-none w-[20vw]"
        />
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          color="gray"
          className="shadow-2xl"
        />
      </div>
      {isLogin ? (
        <div className="flex space-x-5">
          <div
            className="p-2 rounded-2xl space-x-1 border px-4 hover:bg-black/20"
            onClick={() => navigate("/cart")}
          >
            <span className="text-xl">0</span>
            <FontAwesomeIcon icon={faCartShopping} />
          </div>
          <CustomIconButtonSelect />
        </div>
      ) : (
        <div className="flex space-x-5">
          <button
            className="border rounded-2xl p-2 px-4 hover:bg-black/20 transition"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </button>
          {userRole === 'admin' && (
            <button
              onClick={() => {
                onAdminClick();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              Quản trị
            </button>
          )}
          
          <div className="border-t border-gray-200 my-1"></div>
          
          <button
            className="border rounded-2xl p-2 px-4 hover:bg-black/20 transition"
            onClick={() => navigate("/signup")}
          >
            Đăng Ký
            <button
            onClick={() => {
              onLogoutClick();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  // const isloggedIn = isLogin();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState(null);
  
  useEffect(() => {
    // Kiểm tra đăng nhập một lần khi component mount
    const checkLoginStatus = () => {
      try {
        const loggedIn = authService.isAuthenticated();
        setIsLoggedIn(loggedIn);
        
        if (loggedIn) {
          const userData = authService.getUserData();
          setUserName(userData?.name || userData?.email || 'User');
          setUserRole(userData?.role || null);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };
    
    checkLoginStatus();
    
    // Event listener để cập nhật UI khi localStorage thay đổi
    const handleStorageChange = (e) => {
      if (e.key === 'user_data' || e.key === null) {
        checkLoginStatus();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const handleLogout = () => {
    // Giữ lại email để tiện cho lần đăng nhập sau
    let userEmail = '';
    try {
      const userData = authService.getUserData();
      if (userData && userData.email) {
        userEmail = userData.email;
      }
    } catch (e) {
      console.error('Error retrieving user email:', e);
    }
    
    // Đăng xuất và xóa dữ liệu người dùng
    authService.logout();
    
    // Lưu lại email vào localStorage (nhưng không phải trong user_data)
    if (userEmail) {
      try {
        localStorage.setItem('last_email', userEmail);
      } catch (e) {
        console.error('Error saving last email:', e);
      }
    }
    
    // Chuyển hướng đến trang đăng nhập
    navigate('/login');
  };

  return (
    <div className="flex justify-between items-center py-3 px-20 bg-white z-50 w-full">
      <div className="flex items-center space-x-10">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-12" />
        </Link>
        
        <div className="flex space-x-5">
          <Link to="/home" className="text-lg hover:text-[rgba(227,70,63,1)] transition">
            Trang chủ
          </Link>
          <Link to="/restaurants" className="text-lg hover:text-[rgba(227,70,63,1)] transition">
            Nhà hàng
          </Link>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative w-full lg:w-[20vw]">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full border border-gray-300 rounded-xl py-1.5 px-3 pr-10 focus:outline-none focus:border-[rgba(227,70,63,1)]"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
        
        <Link to="/cart" className="relative">
          <FontAwesomeIcon
            icon={faShoppingCart}
            className="text-xl text-[rgba(227,70,63,1)]"
          />
          <span className="absolute -top-2 -right-2 bg-[rgba(227,70,63,1)] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            0
          </span>
        </Link>
        
        {/* ProfileSelect sẽ xử lý phần đăng nhập/đăng xuất và điều hướng đến profile */}
        <CustomIconButtonSelect 
          isLoggedIn={isLoggedIn} 
          userRole={userRole} 
          onProfileClick={() => navigate('/profile')}
          onHistoryClick={() => navigate('/history')}
          onChatClick={() => navigate('/chat')}
          onShoppingCartClick={() => navigate('/cart')}
          onLoginClick={() => navigate('/login')}
          onLogoutClick={handleLogout}
          // localhost:8080/ sẽ là trang quản trị, chỉ hiển thị nếu người dùng là admin
          onAdminClick={userRole === 'admin' ? () => window.location.href = 'http://localhost:8080/' : undefined}
        />
      </div>
    </div>
  );
}