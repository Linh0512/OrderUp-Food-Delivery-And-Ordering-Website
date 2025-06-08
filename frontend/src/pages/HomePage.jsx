import React, { useState, useEffect } from 'react';
import Banner from '../components/Banner';
import ShopCard from '../components/ShopCard';
import Pagination from '../components/Pagination';
import Category from '../components/Category';

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedCriteria, setSelectedCriteria] = useState('all');
  
  // Các dữ liệu mẫu
  const categories = [
    { name: 'Tất cả', value: 'all', color: 'bg-green-500' },
    { name: 'Món Á', value: 'asian', color: 'bg-red-500' },
    { name: 'Món Âu', value: 'western', color: 'bg-blue-500' },
    { name: 'Đồ ăn nhanh', value: 'fast_food', color: 'bg-yellow-500' },
    { name: 'Ăn vặt', value: 'snack', color: 'bg-pink-500' },
  ];

  const priceRanges = [
    { name: 'Tất cả', value: 'all', color: 'bg-green-500' },
    { name: 'Dưới 20 nghìn', value: 'under_20k', color: 'bg-green-200' },
    { name: '20 - 50 nghìn', value: '20k_50k', color: 'bg-green-300' },
    { name: '50 - 100 nghìn', value: '50k_100k', color: 'bg-green-600' },
    { name: 'Trên 100 nghìn', value: 'over_100k', color: 'bg-green-700' },
  ];

  const otherCriteria = [
    { name: 'Tất cả', value: 'all', color: 'bg-green-500' },
    { name: 'Được đánh giá cao', value: 'high_rating', color: 'bg-yellow-500' }, 
    { name: 'Giao nhanh', value: 'fast_delivery', color: 'bg-blue-500' },     
    { name: 'Khuyến mãi', value: 'promotion', color: 'bg-pink-500' },       
  ];
  
  useEffect(() => {
    // gọi API để lấy dữ liệu nhà hàng
    // dựa trên currentPage, selectedCategory, selectedPrice và selectedCriteria
    console.log('Fetching data with filters:', { 
      page: currentPage, 
      category: selectedCategory,
      price: selectedPrice,
      criteria: selectedCriteria
    });
  }, [currentPage, selectedCategory, selectedPrice, selectedCriteria]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Cuộn lên đầu trang khi chuyển trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 md:px-8">
      {/* Banner nằm trên cùng, chiếm toàn bộ chiều rộng */}
      <Banner />
      
      {/* Tiêu đề */}
      <h1 className="text-2xl font-bold my-6">
        Các nhà hàng phổ biến
      </h1>
      
      {/* Layout chính - chia thành 2 cột trên desktop */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Cột trái - danh mục lọc */}
        <div className="w-full md:w-1/4 lg:w-1/5 mb-6 md:mb-0">
          <div className="sticky top-4 space-y-4">
            <Category 
              header={'Danh mục món ăn'} 
              items={categories} 
              onSelect={setSelectedCategory}
            />
            <Category 
              header={'Mức giá'} 
              items={priceRanges}
              onSelect={setSelectedPrice}
            />
            <Category 
              header={'Tiêu chí khác'} 
              items={otherCriteria}
              onSelect={setSelectedCriteria}
            />
          </div>
        </div>
        
        {/* Cột phải - danh sách nhà hàng */}
        <div className="w-full md:w-3/4 lg:w-4/5">
          {/* Grid shop cards với căn lề hợp lý */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 lg:gap-6">
            {Array.from({ length: 20 }).map((_, index) => (
              <ShopCard key={index} id={index + 1} />
            ))}
          </div>
          
          {/* Phân trang */}
          <div className="mt-8 mb-4">
            <Pagination 
              currentPage={currentPage} 
              totalPages={10} 
              onPageChange={handlePageChange} 
            />
          </div>
        </div>
{/* =======
import { useEffect, useState } from "react";
import Category from "../components/Category";
import Pagination from "../components/Pagination";
import ShopCard from "../components/ShopCard";

export default function HomePage() {
  const SHOP_LIMIT = 12;
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

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
  const [shops, setShops] = useState([]);

  const fetchShops = async () => {
    try {
      const response = await fetch("/sampleData/shopDetail.json");
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        return {};
      }
    } catch (error) {
      console.log("Error fetching shop data:", error);
    }
  };

  useEffect(() => {
    fetchShops().then((res) => {
      setShops(res.data);
      setCount(res.count);
    });
  }, []);
  return (
    <div className="w-[80vw] mx-auto flex">
      <div className="w-[80%] space-y-3">
        <h1 className="text-center text-5xl m-2 mt-3 dancing-script-700">
          Các nhà hàng phổ biến
        </h1>
        <hr className="w-[90%] mx-auto mb-3" />
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-10 mb-7">
          {Array.isArray(shops) &&
            shops.slice((page-1)*SHOP_LIMIT,page*SHOP_LIMIT).map((item, index) => (
              <ShopCard key={index} shopDetail={item} />
            ))}
        </div>
        <Pagination
          limit={SHOP_LIMIT}
          count={count}
          current={page}
          onPageChange={setPage}
        />
      </div>
      <div className="space-y-3 mt-10 ml-4">
        <Category header={"Danh mục món ăn"} items={categories} />
        <Category header={"Mức giá"} items={priceRanges} />
        <Category header={"Tiêu chí khác"} items={otherCriteria} />
>>>>>>> vinh */}
      </div>
    </div>
  );
}