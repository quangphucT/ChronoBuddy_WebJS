// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import "./index.scss";

// import required modules
import { Pagination } from "swiper/modules";
import { Image } from "antd";
import imageBanner1 from "../../assets/images/teamwordmain.jpeg"; // Có thể thay ảnh khác nếu không phù hợp

export default function Carousel() {
  return (
    <div>
      <Swiper
        pagination={true}
        modules={[Pagination]}
        className="w-full h-[620px]"
      >
        <SwiperSlide>
          <div className="relative w-full h-full">
            <Image
              src={imageBanner1}
              preview={false}
              className="w-full h-full object-cover"
            />
            <div className="overlay absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute font-mono inset-0 flex flex-col items-center justify-center text-white text-center z-10 px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Organize Your Tasks, Boost Your Productivity
              </h1>
              <p className="text-lg md:text-xl max-w-2xl leading-relaxed">
                Welcome to your personal task manager. Create, track, and
                complete your daily goals effortlessly. Stay focused and
                organized – all in one place.
              </p>
              <button className="mt-6 cursor-pointer bg-[#1e88e5] hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition-all duration-300">
                Get Started
              </button>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
