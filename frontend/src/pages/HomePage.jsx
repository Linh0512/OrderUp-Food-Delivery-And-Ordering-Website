import Category from "../components/Category";
import Pagination from "../components/Pagination";
import ShopCard from "../components/ShopCard";


export default function HomePage() {
  const categories = [
    { name: 'Tất cả', color: 'bg-green-500' },
    { name: 'Cơm', color: 'bg-orange-400' },
    { name: 'Bún / Phở / Hủ tiếu', color: 'bg-red-400' },
    { name: 'Cháo / Soup / Canh', color: 'bg-blue-300' },
    { name: 'Bánh mì / Bánh cuốn', color: 'bg-pink-400' },
    { name: 'Burger / Pizza', color: 'bg-blue-400' },
    { name: 'Salad / Healthy', color: 'bg-green-400' },
  ];

  const priceRanges = [
  { name: 'Tất cả', color: 'bg-green-500' },
  { name: 'Dưới 20 nghìn', color: 'bg-yellow-400' },
  { name: '20 - 50 nghìn', color: 'bg-green-300' },
  { name: '50 - 100 nghìn', color: 'bg-green-600' },
  { name: 'Trên 100 nghìn', color: 'bg-green-700' },
];

const otherCriteria = [
  { name: 'Tất cả', color: 'bg-green-500' },
  { name: 'Được đánh giá cao',  color: 'bg-yellow-500' }, 
  { name: 'Giao nhanh', color: 'bg-blue-500' },     
  { name: 'Khuyến mãi', color: 'bg-pink-500' },       
];
  return (
    <div className="w-[80vw] mx-auto flex">
      <div className="w-[80%] space-y-3">
        <h1 className="text-center text-5xl m-2 mt-3 dancing-script-700">
          Các nhà hàng phổ biến
        </h1>
        <hr className="w-[90%] mx-auto mb-3" />
        <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-1 gap-7 mb-7">
          {Array.from({ length: 20 }).map((_, index) => (
            <ShopCard key={index} />
          ))}
        </div>
        <Pagination />
      </div>
      <div className="space-y-3 mt-10 ml-4">
        <Category header={'Danh mục món ăn'} items={categories}/>
        <Category header={'Mức giá'} items={priceRanges}/>
        <Category header={'Tiêu chí khác'} items={otherCriteria}/>
      </div>
    </div>
  );
}
