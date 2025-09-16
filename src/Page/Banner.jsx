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

  if (slides.length === 0) return <Loading />;

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
            {/* 👉 Overlay with gradient & bottom-left content */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/80
                         flex flex-col justify-end items-start p-6 md:p-10 space-y-4 text-white"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-3xl md:text-5xl font-bold max-w-xl"
              >
                {slide.title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-base md:text-lg text-gray-200 max-w-xl"
              >
                {slide.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <Link to="/allclass">
                  <button
                    aria-label="Explore Rooms"
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold
                               px-8 py-3 rounded-full shadow-lg transition duration-300
                               ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50"
                  >
                    Explore All Class
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
