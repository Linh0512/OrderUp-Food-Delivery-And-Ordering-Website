import { Navigate, Outlet, useLocation } from 'react-router-dom';
import authService from '../../services/auth';

// Route yêu cầu đăng nhập, chuyển hướng về login nếu chưa đăng nhập
export function RequireAuth({ children }) {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    // Lưu lại URL hiện tại để sau khi đăng nhập có thể quay lại
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children ? children : <Outlet />;
}

// Route chỉ cho user thông thường truy cập
export function RequireUser({ children }) {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Route chỉ cho admin truy cập
export function RequireAdmin({ children }) {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getUserRole();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (userRole !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children ? children : <Outlet />;
}

// Route chỉ cho chủ nhà hàng truy cập
export function RequireRestaurantHost({ children }) {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getUserRole();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (userRole !== 'restaurantHost') {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children ? children : <Outlet />;
}

export function RequireAnonymous({ children }) {
    return children ? children : <Outlet />;
}