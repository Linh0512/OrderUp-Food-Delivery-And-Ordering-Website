import { Route, Router, Routes } from "react-router-dom";
import HomePageLayout from "./layouts/HomePageLayout";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import LoginPage from "./pages/auth/LoginPage";
import NoBannerLayout from "./layouts/NoBannerLayout";
import SignUpPage from "./pages/auth/SignUpPage";
import ForgetPage from "./pages/auth/ForgetPage";
import CartPage from "./pages/user/CartPage";
import PaymentPage from "./pages/user/PaymentPage";
import TrackingPage from "./pages/user/TrackingPage";
import ProfilePage from "./pages/user/ProfilePage";
import HistoryPage from "./pages/user/HistoryPage";
import ChatPage from "./pages/user/ChatPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import RestaurentLayout from "./layouts/RestaurentLayout";
import Dashboard from "./pages/hostRes/Dashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePageLayout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
      </Route>
      <Route path="/" element={<NoBannerLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="forget" element={<ForgetPage />} />
        <Route path="cart" element={<CartPage/>}/>
        <Route path="payment" element={<PaymentPage/>}/>
        <Route path="tracking" element={<TrackingPage/>}/>
        <Route path="profile" element={<ProfilePage/>}/>
        <Route path="history" element={<HistoryPage/>}/>
        <Route path="chat" element={<ChatPage/>}/>
        <Route path="unAuth" element={<UnauthorizedPage/>}/>
      </Route>
      <Route path="/" element={<RestaurentLayout/>}>
        <Route path="resDashBoard" element={<Dashboard/>}/>
      </Route>
    </Routes>
  );
}

// function Layout({ children, hideHeaderFooter = false }) {
//   return (
//     <>
//       {!hideHeaderFooter && <Header />}
//       <main className="min-h-screen">
//         {children}
//       </main>
//       {!hideHeaderFooter && <Footer />}
//     </>
//   );
// }

// // Component kiểm tra nếu người dùng đã đăng nhập
// function ProtectedRoute({ children, redirectTo = "/login" }) {
//   const isAuthenticated = authService.isAuthenticated();
  
//   console.log('ProtectedRoute Check:', { isAuthenticated });
  
//   if (!isAuthenticated) {
//     console.log('Not authenticated, redirecting to:', redirectTo);
//     return <Navigate to={redirectTo} replace />;
//   }
  
//   return children;
// }

// // Component chỉ cho phép người dùng chưa đăng nhập
// function PublicOnlyRoute({ children, redirectTo = "/home" }) {
//   const isAuthenticated = authService.isAuthenticated();
  
//   console.log('PublicOnlyRoute Check:', { isAuthenticated });
  
//   if (isAuthenticated) {
//     console.log('Already authenticated, redirecting to:', redirectTo);
//     return <Navigate to={redirectTo} replace />;
//   }
  
//   return children;
// }

// function App() {
//   return (
//     <Routes>
//       {/* Route mặc định - Chuyển hướng người dùng đã đăng nhập đến /home, chưa đăng nhập đến /login */}
//       <Route path="/" element={
//         authService.isAuthenticated() 
//           ? <Navigate to="/home" replace /> 
//           : <Navigate to="/login" replace />
//       } />
      
//       {/* Các trang KHÔNG yêu cầu đăng nhập và KHÔNG cho phép người dùng đã đăng nhập truy cập */}
//       <Route path="/login" element={
//         <PublicOnlyRoute>
//           <LoginPage />
//         </PublicOnlyRoute>
//       } />
//       <Route path="/register" element={
//         <PublicOnlyRoute>
//           <RegisterPage />
//         </PublicOnlyRoute>
//       } />
//       <Route path="/forgot-password" element={
//         <PublicOnlyRoute>
//           <ForgotPasswordPage />
//         </PublicOnlyRoute>
//       } />
      
//       {/* Trang Home - PHẢI yêu cầu đăng nhập */}
//       <Route path="/home" element={
//         <ProtectedRoute>
//           <Layout>
//             <HomePage />
//           </Layout>
//         </ProtectedRoute>
//       } />
      
//       {/* Trang giỏ hàng - yêu cầu đăng nhập */}
//       <Route path="/cart" element={
//         <ProtectedRoute>
//           <Layout>
//             <CartPage />
//           </Layout>
//         </ProtectedRoute>
//       } />
      
//       {/* Trang profile - yêu cầu đăng nhập */}
//       <Route path="/profile" element={
//         <ProtectedRoute>
//           <Layout>
//             <ProfilePage />
//           </Layout>
//         </ProtectedRoute>
//       } />
      
//       {/* Trang lịch sử - yêu cầu đăng nhập */}
//       <Route path="/history" element={
//         <ProtectedRoute>
//           <Layout>
//             <HistoryPage />
//           </Layout>
//         </ProtectedRoute>
//       } />
      
//       {/* Trang chat - yêu cầu đăng nhập */}
//       <Route path="/chat" element={
//         <ProtectedRoute>
//           <Layout>
//             <ChatPage />
//           </Layout>
//         </ProtectedRoute>
//       } />
      
//       {/* Error pages */}
//       <Route path="/unauthorized" element={<UnauthorizedPage />} />
//       <Route path="*" element={<NotFoundPage />} />
//     </Routes>
//   );
// }