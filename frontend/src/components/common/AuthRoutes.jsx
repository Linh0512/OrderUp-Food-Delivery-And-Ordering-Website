import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function RequireAuth({ children }) {
  const location = useLocation();
  const { isLogin } = useAuth();

  if (!isLogin) {
    // Lưu lại URL hiện tại để sau khi đăng nhập có thể quay lại
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}

// Route chỉ cho chủ nhà hàng truy cập
export function RequireRestaurantHost({ children }) {
  const location = useLocation();
  const { isLogin, role } = useAuth();

  if (!isLogin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role !== "restaurantHost") {
    return <Navigate to="/unAuth" replace />;
  }

  return children ? children : <Outlet />;
}

export function RequireAnonymous({ children }) {
  const { isLogin } = useAuth();
  if (isLogin) return <Navigate to="/" replace />;

  return children ? children : <Outlet />;
}
