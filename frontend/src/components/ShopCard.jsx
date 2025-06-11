import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import food1 from "../assets/food1.jpg";
import { faClock, faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function ShopCard({ shopDetail }) {
  const navigate = useNavigate();

  function handleMove() {
    navigate("shop");
  }
  
  // Fallback cho các trường có thể undefined
  const name = shopDetail?.name || "Chưa cập nhật";
  const address = shopDetail?.address || "Chưa cập nhật";
  const review = shopDetail?.review || 0;
  const star = shopDetail?.star || 0;
  const isActive = shopDetail?.active !== undefined ? shopDetail.active : shopDetail?.isActive;
  const timeRange = shopDetail?.timeRange || "Chưa cập nhật";
  const priceRange = shopDetail?.priceRange || "Chưa cập nhật";
  const image = shopDetail?.image || food1;

  // Format priceRange để hiển thị đẹp hơn
  const formatPriceRange = (range) => {
    switch(range) {
      case 'budget': return '< 50k';
      case 'mid-range': return '50k - 150k';
      case 'upscale': return '> 150k';
      default: return range;
    }
  };

  return (
    <div className="flex flex-col rounded-2xl shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 min-w-[250px] max-w-[280px]">
      <div className="relative">
        <img 
          src={image} 
          alt={name} 
          className="rounded-t-2xl h-40 w-full object-cover"
          onError={(e) => { e.target.src = food1; }}
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isActive 
              ? "bg-green-100 text-green-700" 
              : "bg-red-100 text-red-700"
          }`}>
            {isActive ? "Mở cửa" : "Đóng cửa"}
          </span>
        </div>
      </div>
      
      <div className="p-3 space-y-2 flex flex-col justify-between flex-grow">
        {/* Header info */}
        <div className="space-y-1">
          <h3 className="font-bold text-base leading-tight line-clamp-2" title={name}>
            {name}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-2" title={address}>
            {address}
          </p>
        </div>

        <hr className="border-gray-200" />
        
        {/* Rating and Reviews */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-yellow-500">
            <div className="flex items-center space-x-1">
              <span className="text-xs font-medium">{review}</span>
              <span className="text-xs text-gray-500">reviews</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-xs font-medium">{star}</span>
              <span className="text-yellow-400">★</span>
            </div>
          </div>
          
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-xl text-xs font-medium transition-colors duration-200"
            onClick={handleMove}
          >
            Đặt món
          </button>
        </div>
        
        {/* Time and Status */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1 text-gray-600">
            <FontAwesomeIcon icon={faClock} className="text-xs" />
            <span>{timeRange}</span>
          </div>
          
          <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-1 ${
                isActive ? "bg-green-400" : "bg-red-400"
              }`}
            />
            <span className={`text-xs font-medium ${
              isActive ? "text-green-600" : "text-red-600"
            }`}>
              {isActive ? "Đang mở" : "Đã đóng"}
            </span>
          </div>
        </div>
        
        {/* Price Range */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
          <div className="flex items-center space-x-1">
            <FontAwesomeIcon icon={faMoneyBill} className="text-green-600 text-xs" />
            <span className="text-xs font-medium text-gray-700">
              {formatPriceRange(priceRange)}
            </span>
          </div>
          
          {/* Optional delivery info */}
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            Giao hàng
          </span>
        </div>
      </div>
    </div>
  );
}

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import food1 from "../assets/food1.jpg";
// import { faClock, faMoneyBill } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// export default function ShopCard({ shopDetail }) {
//   const navigate = useNavigate();

//   function handleMove() {
//     navigate("shop");
//   }
//   return (
//     <div className="flex flex-col rounded-2xl shadow-xl bg-white">
//       <img src={food1} alt="" className="rounded-t-2xl" />
//       <div className="p-2 space-y-1 flex flex-col justify-center">
//         <h3 className="font-bold text-xl py-2 truncate">{shopDetail.name}</h3>
//         <p className="text-sm">{shopDetail.address}</p>
//         <hr />
//         <div className="flex items-center justify-between text-yellow-500">
//           <div className="flex space-x-2">
//             <p>{shopDetail.review}</p>
//             <p> {shopDetail.star} ★ </p>
//           </div>
//           <button
//             className="bg-[rgba(60,152,80,1)] border text-white p-1 px-2 rounded-2xl hover:opacity-80"
//             onClick={handleMove}
//           >
//             Đặt món
//           </button>
//         </div>
//         <div className="flex justify-between items-center ">
//           <p
//             className={`${
//               shopDetail.isActive ? "text-[rgba(109,213,29,1)]" : "text-red-600"
//             } flex items-center`}
//           >
//             <div
//               className={`size-3 rounded-full mr-2 ${
//                 shopDetail.isActive ? "bg-[rgba(109,213,29,1)]" : "bg-red-600"
//               }`}
//             ></div>
//             {shopDetail.isActive ? "Mở cửa" : "Đóng cửa"}
//           </p>
//           <div className="space-x-2 flex items-center">
//             <FontAwesomeIcon icon={faClock} />
//             <p>{shopDetail.timeRange}</p>
//           </div>
//         </div>
//         <p className="text-xl py-2">
//           <FontAwesomeIcon icon={faMoneyBill} /> {shopDetail.priceRange}
//         </p>
//       </div>
//     </div>
//   );
// }
