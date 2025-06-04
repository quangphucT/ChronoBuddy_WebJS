// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import "./index.scss";

// import required modules
import { Pagination } from "swiper/modules";
import { Image } from "antd";
import imageBanner1 from "../../assets/images/business-team-meeting-boardroom.jpg"; // Có thể thay ảnh khác nếu không phù hợp

export default function Subcarousel() {
  return (
    <div>
      <Swiper
        pagination={true}
        modules={[Pagination]}
        className="w-full h-[500px]"
      >
        <SwiperSlide>
          <div className="relative w-full h-full">
            <Image
              src={imageBanner1}
              preview={false}
              className="w-full h-[400px] object-cover"
            />
           
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
