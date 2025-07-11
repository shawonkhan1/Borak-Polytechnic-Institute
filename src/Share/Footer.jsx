import React from "react";
import NavLinks from "./Links";


const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content px-4 py-10 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-primary mb-2">EduManage</h2>
          <p className="text-sm leading-relaxed">
            Empowering students and teachers through seamless online class & learning management.
          </p>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <div className="flex flex-col space-y-1">
            <NavLinks />
          </div>
        </div>

        {/* Contact or Social (optional) */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact</h3>
          <p>Email: shawon505214@gmail.com</p>
          <p>Phone: +8801883717078</p>
        </div>
      </div>

      <div className="text-center mt-10 border-t border-base-300 pt-6 text-sm">
        © {new Date().getFullYear()} EduManage. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
