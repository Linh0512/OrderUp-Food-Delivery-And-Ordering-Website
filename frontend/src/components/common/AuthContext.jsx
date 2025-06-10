import {  createContext, useContext, useEffect, useState } from "react";
import {
  getUserData,
  getUserRole,
  IsLogin,
  login,
  logout,
} from "../../services/authServices/authServices";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState({});
  const [role, setRole] = useState(null);

  const Login = async (email, password) => {
    const res = await login(email, password);
    if (res.token) {
      setIsLogin(true);
      setUser(getUserData());
      setRole(getUserRole());
    }
    return res;
  };

  const Logout = async () => {
    logout()
    setIsLogin(false);
    setUser({});
    setRole(null);
  };

  useEffect(() => {
    if (IsLogin()) {
      setIsLogin(true);
      setUser(getUserData());
      setRole(getUserRole());
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLogin, user, Login, Logout, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth=()=> useContext(AuthContext)
