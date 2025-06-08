// filepath: c:\Storage\Repo\Intellij\FP\frontend\src\pages\NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Không tìm thấy trang</h2>
      <p className="text-gray-600 mb-8 text-center">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </p>
      <Link 
        to="/login" 
        className="px-6 py-3 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors"
      >
        Quay lại trang đăng nhập
      </Link>
    </div>
  );
}