import { createContext, useContext, useEffect, useState } from "react";
import {
  getUserData,
  getUserResId,
  getUserRole,
  IsLogin,
  login,
  logout,
} from "../../services/authServices/authServices";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(IsLogin());
  const [user, setUser] = useState(getUserData());
  const [role, setRole] = useState(getUserRole());
  const [resId, setResId] = useState("");

  const Login = async (email, password) => {
    const res = await login(email, password);
    if (res.token) {
      setIsLogin(true);
      setUser(getUserData());
      setRole(getUserRole());
      getUserResId(res.userId, res.token).then((id) => {
        setResId(id || "");
      });
    }
    return res;
  };

  const Logout = async () => {
    logout();
    setIsLogin(false);
    setUser({});
    setRole(null);
    setResId("");
  };

  useEffect(() => {
    if (IsLogin()) {
      setIsLogin(true);
      const userData = getUserData();
      setUser(userData);
      setRole(getUserRole());

      if (userData.userId && userData.token)
        getUserResId(userData.userId, userData.token).then((res) =>
          setResId(res)
        );
      else setResId("");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLogin, user, Login, Logout, role, resId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
