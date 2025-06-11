import { useEffect, useState } from "react";
import Category from "../components/Category";
import Pagination from "../components/Pagination";
import ShopCard from "../components/ShopCard";
import { restaurantService } from "../services/userServices/restaurantService";

export default function HomePage() {
  const SHOP_LIMIT = 12;
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { name: "Tất cả", color: "bg-green-500" },
    { name: "Cơm", color: "bg-orange-400" },
    { name: "Bún / Phở / Hủ tiếu", color: "bg-red-400" },
    { name: "Cháo / Soup / Canh", color: "bg-blue-300" },
    { name: "Bánh mì / Bánh cuốn", color: "bg-pink-400" },
    { name: "Burger / Pizza", color: "bg-blue-400" },
    { name: "Salad / Healthy", color: "bg-green-400" },
  ];

  const priceRanges = [
    { name: "Tất cả", color: "bg-green-500" },
    { name: "Dưới 20 nghìn", color: "bg-yellow-400" },
    { name: "20 - 50 nghìn", color: "bg-green-300" },
    { name: "50 - 100 nghìn", color: "bg-green-600" },
    { name: "Trên 100 nghìn", color: "bg-green-700" },
  ];

  const otherCriteria = [
    { name: "Tất cả", color: "bg-green-500" },
    { name: "Được đánh giá cao", color: "bg-yellow-500" },
    { name: "Giao nhanh", color: "bg-blue-500" },
    { name: "Khuyến mãi", color: "bg-pink-500" },
  ];

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        // Tính toán page cho backend (backend sử dụng 0-based index)
        const backendPage = page - 1;
        const data = await restaurantService.getAllShops(backendPage, SHOP_LIMIT);
        setShops(data.data || []);
        setCount(data.count || 0);
      } catch (error) {
        console.error('Error fetching shops:', error);
        setError('Không thể tải danh sách cửa hàng. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [page]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Đang tải danh sách nhà hàng...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <p className="text-red-600 text-lg">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Thử lại
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-[90vw] mx-auto flex gap-4 py-6">
        {/* Main content */}
        <div className="flex-1 space-y-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-800 mb-2 dancing-script-700">
              Các nhà hàng phổ biến
            </h1>
            <p className="text-gray-600">Khám phá những nhà hàng tuyệt vời xung quanh bạn</p>
          </div>
          
          <hr className="border-gray-300" />
          
          {/* Cards grid - Giảm gap và tối ưu spacing */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center">
            {Array.isArray(shops) &&
              shops.map((item, index) => (
                <ShopCard key={item.id || index} shopDetail={item} />
              ))}
          </div>
          
          {/* Pagination */}
          {count > 0 && (
            <div className="flex justify-center pt-8">
              <Pagination
                limit={SHOP_LIMIT}
                count={count}
                current={page}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
        
        {/* Sidebar - Giảm width */}
        <div className="w-60 space-y-4 sticky top-6 h-fit">
          <Category header={"Danh mục món ăn"} items={categories} />
          <Category header={"Mức giá"} items={priceRanges} />
          <Category header={"Tiêu chí khác"} items={otherCriteria} />
        </div>
      </div>
    </div>
  );
}


// import { useEffect, useState } from "react";
// import Category from "../components/Category";
// import Pagination from "../components/Pagination";
// import ShopCard from "../components/ShopCard";

// export default function HomePage() {
//   const SHOP_LIMIT = 12;
//   const [page, setPage] = useState(1);
//   const [count, setCount] = useState(0);

//   const categories = [
//     { name: "Tất cả", color: "bg-green-500" },
//     { name: "Cơm", color: "bg-orange-400" },
//     { name: "Bún / Phở / Hủ tiếu", color: "bg-red-400" },
//     { name: "Cháo / Soup / Canh", color: "bg-blue-300" },
//     { name: "Bánh mì / Bánh cuốn", color: "bg-pink-400" },
//     { name: "Burger / Pizza", color: "bg-blue-400" },
//     { name: "Salad / Healthy", color: "bg-green-400" },
//   ];

//   const priceRanges = [
//     { name: "Tất cả", color: "bg-green-500" },
//     { name: "Dưới 20 nghìn", color: "bg-yellow-400" },
//     { name: "20 - 50 nghìn", color: "bg-green-300" },
//     { name: "50 - 100 nghìn", color: "bg-green-600" },
//     { name: "Trên 100 nghìn", color: "bg-green-700" },
//   ];

//   const otherCriteria = [
//     { name: "Tất cả", color: "bg-green-500" },
//     { name: "Được đánh giá cao", color: "bg-yellow-500" },
//     { name: "Giao nhanh", color: "bg-blue-500" },
//     { name: "Khuyến mãi", color: "bg-pink-500" },
//   ];
//   const [shops, setShops] = useState([]);

//   const fetchShops = async () => {
//     try {
//       const response = await fetch("/sampleData/ShopDetail.json");
//       if (response.ok) {
//         const data = await response.json();
//         return data;
//       } else {
//         return {};
//       }
//     } catch (error) {
//       console.log("Error fetching shop data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchShops().then((res) => {
//       setShops(res.data);
//       setCount(res.count);
//     });
//   }, []);
//   return (
//     <div className="w-[80vw] mx-auto flex">
//       <div className="w-[80%] space-y-3">
//         <h1 className="text-center text-5xl m-2 mt-3 dancing-script-700">
//           Các nhà hàng phổ biến
//         </h1>
//         <hr className="w-[90%] mx-auto mb-3" />
//         <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-10 mb-7">
//           {Array.isArray(shops) &&
//             shops.slice((page-1)*SHOP_LIMIT,page*SHOP_LIMIT).map((item, index) => (
//               <ShopCard key={index} shopDetail={item} />
//             ))}
//         </div>
//         <Pagination
//           limit={SHOP_LIMIT}
//           count={count}
//           current={page}
//           onPageChange={setPage}
//         />
//       </div>
//       <div className="space-y-3 mt-10 ml-4">
//         <Category header={"Danh mục món ăn"} items={categories} />
//         <Category header={"Mức giá"} items={priceRanges} />
//         <Category header={"Tiêu chí khác"} items={otherCriteria} />
//       </div>
//     </div>
//   );
// }