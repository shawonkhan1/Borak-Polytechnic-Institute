import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";

const InspirationTeacher = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      {/* Left Side: Teacher Image */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full"
      >
        <img
          src="https://i.ibb.co/Lz21qdm2/495448271-606424002421122-7882249999764344768-n.jpg"
          alt="Inspiring Teacher"
          className="w-full  rounded-lg shadow-lg object-cover"
        />
      </motion.div>

      {/* Right Side: Text */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-center md:text-left space-y-5"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Meet Our Inspirational Teachers
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Our experienced and passionate instructors are the backbone of Borak
          Polytechnic Institute. Learn from the best and be inspired every step
          of your academic journey.
        </p>
        <Link to="/allclass">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-full shadow transition">
            Explore All Classes
          </button>
        </Link>
      </motion.div>
    </div>
  );
};

export default InspirationTeacher;
