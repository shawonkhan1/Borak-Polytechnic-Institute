import React from 'react';
import { FaBook, FaClipboardList, FaUpload } from 'react-icons/fa';

const About_Us = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl mt-10 px-6 py-16">
      <div className="max-w-5xl mx-auto text-center">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-blue-600">
          About Us
        </h1>

        {/* Intro */}
        <p className="text-lg text-black leading-relaxed mb-8">
          Welcome to <span className="font-semibold text-blue-600">Borak Polytechnic Institute</span> — 
          a modern learning platform where students can access courses, read notes, view assignments, 
          and submit their work online.  
          Our mission is to make education <span className="font-semibold">accessible, interactive, and career-focused</span> 
          for learners everywhere.
        </p>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {/* Feature 1: Course & Notes */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition">
            <div className="text-blue-600 text-4xl mb-3 flex justify-center">
              <FaBook />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-blue-600">
              Courses & Notes
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Access all courses and read notes to enhance your learning experience.
            </p>
          </div>

          {/* Feature 2: View Assignments */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition">
            <div className="text-blue-600 text-4xl mb-3 flex justify-center">
              <FaClipboardList />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-blue-600">
              View Assignments
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              See all assignments related to your courses and stay organized.
            </p>
          </div>

          {/* Feature 3: Submit Assignments */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition">
            <div className="text-blue-600 text-4xl mb-3 flex justify-center">
              <FaUpload />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-blue-600">
              Submit Assignments
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Submit your assignments directly through the platform with ease.
            </p>
          </div>
        </div>

        {/* Closing */}
        <div className="mt-12 text-black text-lg">
          <p>
            Whether you're just starting out or advancing your career, 
            <span className="font-semibold text-blue-600"> Borak Polytechnic Institute</span> 
            is here to help you achieve your learning goals.  
            <span className="text-blue-600 font-semibold"> Join thousands of students already growing with us!</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default About_Us;
