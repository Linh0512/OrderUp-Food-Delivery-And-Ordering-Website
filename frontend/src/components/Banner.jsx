
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import banner from '../assets/banner.jpg'

// import required modules
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

const bannerData = [
  {
    id: 1,
    title: 'ORDER UP',
    subtitle1: 'Tiết Kiệm Thời Gian',
    subtitle2: 'Ưu Đãi Ngập Tràn',
    buttonText: 'Đặt món ngay',
    backgroundImage: banner,
  },
  {
    id: 2,
    bgColor: 'bg-green-500', // Có thể đổi màu nếu muốn
    title: 'ORDER UP',
    subtitle1: 'Nhanh Chóng Tiện Lợi',
    subtitle2: 'Món Ngon Mỗi Ngày',
    buttonText: 'Đặt món ngay',
    backgroundImage: banner,
  },
  // Thêm các slide khác nếu cần
];

export default function Banner() {
  return (
    <div className="relative w-[80%] mx-auto h-auto mb-10">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0} // Không có khoảng cách giữa các slide
        slidesPerView={1} // Hiển thị 1 slide mỗi lần
        navigation // Kích hoạt nút điều hướng (trái/phải)
        pagination={{ clickable: true }} // Kích hoạt chấm tròn điều hướng
        loop={true} // Lặp lại banner
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        className="w-[66%]" // Tailwind class cho Swiper container
      >
        {bannerData.map((slide) => (
           <SwiperSlide
            key={slide.id}
            style={{ backgroundImage: `url(${slide.backgroundImage})` }}
            // Thêm bg-no-repeat và một màu nền fallback cho khoảng trống
            className="bg-contain bg-center bg-no-repeat relative bg-gray-100"
            // Nếu bạn muốn ảnh tối hơn và chữ dễ đọc hơn, lớp phủ vẫn có thể hữu ích
            // ngay cả với bg-contain, nhưng nó sẽ phủ cả vùng ảnh và vùng trống.
          >
            {/* Lớp phủ màu nhẹ (tùy chọn) - Nó sẽ phủ lên cả ảnh và vùng trống */}
            {/* <div className="absolute inset-0 bg-black bg-opacity-10"></div> */}

            <div className="container mx-auto flex flex-col items-center justify-center min-h-[300px] md:min-h-[500px] lg:min-h-[600px] text-white relative z-10 p-4 text-center">
              {/* <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-wider" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.7)'}}>{slide.title}</h1>
              <p className="text-lg md:text-2xl mt-3" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.7)'}}>{slide.subtitle1}</p>
              <p className="text-lg md:text-2xl font-semibold" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.7)'}}>{slide.subtitle2}</p>
              <button className="mt-8 bg-yellow-400 hover:bg-yellow-500 text-green-800 font-bold py-3 px-8 rounded-lg text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                {slide.buttonText}
              </button> */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}