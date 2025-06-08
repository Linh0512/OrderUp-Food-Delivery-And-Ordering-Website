import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import authService from './services/auth';

import Header from './components/Header';
import Footer from './components/Footer';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Public Pages
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// User Pages
import CartPage from './pages/user/CartPage';
import ProfilePage from './pages/user/ProfilePage';
import HistoryPage from './pages/user/HistoryPage';
import ChatPage from './pages/user/ChatPage';

function Layout({ children, hideHeaderFooter = false }) {
  return (
    <>
      {!hideHeaderFooter && <Header />}
      <main className="min-h-screen">
        {children}
      </main>
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

// Component kiểm tra nếu người dùng đã đăng nhập
function ProtectedRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    // Nếu không xác thực, chuyển hướng đến trang đăng nhập
    return <Navigate to="/login" replace />;
  }
  
  // Nếu đã xác thực, hiển thị nội dung được bảo vệ
  return children;
}

function App() {
  return (
    <Routes>
      {/* Route mặc định - chuyển hướng đến /home nếu đã đăng nhập, hoặc /login nếu chưa */}
      <Route index element={
        authService.isAuthenticated() 
          ? <Navigate to="/home" replace />
          : <Navigate to="/login" replace />
      } />
      
      {/* Các trang không yêu cầu đăng nhập */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      
      {/* Trang Home - KHÔNG yêu cầu đăng nhập */}
      <Route path="/" element={
        <Layout>
          <HomePage />
        </Layout>
      } />
      
      <Route path="/home" element={
        <Layout>
          <HomePage />
        </Layout>
      } />
      
      {/* Trang giỏ hàng - yêu cầu đăng nhập */}
      <Route path="/cart" element={
        <Layout>
          <CartPage />
        </Layout>
      } />
      
      {/* Trang profile - yêu cầu đăng nhập */}
      <Route path="/profile" element={
        <Layout>
          <ProfilePage />
        </Layout>
      } />
      
      {/* Trang lịch sử - yêu cầu đăng nhập */}
      <Route path="/history" element={
        <Layout>
          <HistoryPage />
        </Layout>
      } />
      
      {/* Trang chat - yêu cầu đăng nhập */}
      <Route path="/chat" element={
        <Layout>
          <ChatPage />
        </Layout>
      } />
      
      {/* Error pages */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;