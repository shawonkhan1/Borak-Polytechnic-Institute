import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { Link } from "react-router";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Loading from "../Share/Loading";

const Banner = () => {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    fetch("/Banner.json")
      .then((res) => res.json())
      .then((data) => setSlides(data))
      .catch((err) => console.error("Failed to load slides:", err));
  }, []);

  if (slides.length === 0) {
    return <Loading></Loading>;
  }

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay, EffectFade]}
      effect="fade"
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop
      className="w-full mt-5 rounded-2xl h-[450px] md:h-[600px] lg:h-[700px] relative"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div
            className="relative h-full bg-cover bg-center rounded-2xl"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            {/* Overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 flex flex-col items-center justify-center px-8 md:px-20">
              <div className="max-w-4xl text-center space-y-6 flex-grow flex flex-col justify-center"></div>

              {/* Button at the bottom center */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
                className="mb-8" // margin bottom for some space
              >
                <Link to="/allclass">
                  <button
                    aria-label="Explore Rooms"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-12 py-4 rounded-full shadow-lg transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50"
                  >
                    Explore ALL Class
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Banner;
