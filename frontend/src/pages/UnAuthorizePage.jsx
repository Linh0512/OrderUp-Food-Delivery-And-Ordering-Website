
import { Link } from 'react-router-dom'

export default function UnAuthorizedPage() {
  return (
     <div className="flex flex-col items-center justify-center h-[70vh] bg-gray-100 px-4">
      <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
      <h2 className="text-2xl font-semibold mb-4">Không có quyền truy cập</h2>
      <p className="text-gray-600 mb-8 text-center">
        Bạn không có quyền truy cập vào trang này.
      </p>
      <div className="flex space-x-4">
        <Link 
          to="/" 
          className="px-6 py-3 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors"
        >
          Trang chủ
        </Link>
      </div>
    </div>
  )
}