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
function ProtectedRoute({ children, redirectTo = "/login" }) {
  const isAuthenticated = authService.isAuthenticated();
  
  console.log('ProtectedRoute Check:', { isAuthenticated });
  
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to:', redirectTo);
    return <Navigate to={redirectTo} replace />;
  }
  
  return children;
}

// Component chỉ cho phép người dùng chưa đăng nhập
function PublicOnlyRoute({ children, redirectTo = "/home" }) {
  const isAuthenticated = authService.isAuthenticated();
  
  console.log('PublicOnlyRoute Check:', { isAuthenticated });
  
  if (isAuthenticated) {
    console.log('Already authenticated, redirecting to:', redirectTo);
    return <Navigate to={redirectTo} replace />;
  }
  
  return children;
}

function App() {
  return (
    <Routes>
      {/* Route mặc định - Chuyển hướng người dùng đã đăng nhập đến /home, chưa đăng nhập đến /login */}
      <Route path="/" element={
        authService.isAuthenticated() 
          ? <Navigate to="/home" replace /> 
          : <Navigate to="/login" replace />
      } />
      
      {/* Các trang KHÔNG yêu cầu đăng nhập và KHÔNG cho phép người dùng đã đăng nhập truy cập */}
      <Route path="/login" element={
        <PublicOnlyRoute>
          <LoginPage />
        </PublicOnlyRoute>
      } />
      <Route path="/register" element={
        <PublicOnlyRoute>
          <RegisterPage />
        </PublicOnlyRoute>
      } />
      <Route path="/forgot-password" element={
        <PublicOnlyRoute>
          <ForgotPasswordPage />
        </PublicOnlyRoute>
      } />
      
      {/* Trang Home - PHẢI yêu cầu đăng nhập */}
      <Route path="/home" element={
        <ProtectedRoute>
          <Layout>
            <HomePage />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Trang giỏ hàng - yêu cầu đăng nhập */}
      <Route path="/cart" element={
        <ProtectedRoute>
          <Layout>
            <CartPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Trang profile - yêu cầu đăng nhập */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout>
            <ProfilePage />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Trang lịch sử - yêu cầu đăng nhập */}
      <Route path="/history" element={
        <ProtectedRoute>
          <Layout>
            <HistoryPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Trang chat - yêu cầu đăng nhập */}
      <Route path="/chat" element={
        <ProtectedRoute>
          <Layout>
            <ChatPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Error pages */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;