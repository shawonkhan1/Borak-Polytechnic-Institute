import React, { useState, useEffect, useRef, useContext } from "react";
import { FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router"; // react-router-dom এ পরিবর্তন
import NavLinks from "./Links"; // NavLinks: লিঙ্কগুলোর কম্পোনেন্ট
import { AuthContext } from "../AuthProvider/AuthProvider";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const Navbar = () => {
  const { user, Logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // থিম সেটিং
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // ক্লিক আউটসাইডে dropdown বন্ধ করা
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // theme toggole
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // (desktop ও mobile)
  const menuLinks = (
    <>
      <NavLinks />
    </>
  );

  return (
    <nav className="bg-base-100 shadow-md sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
      {/* Logo */}
      <div
        className="text-2xl font-extrabold cursor-pointer text-blue-600 "
        onClick={() => (window.location.href = "/")}
      >
        BPI
      </div>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center font-semibold text-lg space-x-6">
        {menuLinks}
      </div>

      {/* Right Section: Theme toggle + User + Mobile menu button */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-ghost btn-square tooltip tooltip-bottom"
          data-tip={theme === "light" ? "Switch to Dark" : "Switch to Light"}
          aria-label="Toggle Theme"
        >
          {theme === "light" ? (
            <FaMoon className="w-6 h-6 text-gray-700" />
          ) : (
            <FaSun className="w-6 h-6 text-yellow-400" />
          )}
        </button>

        {/* User Section */}
        {!user ? (
          <Link to="/register">
            <button className="btn btn-primary">Sign In</button>
          </Link>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="btn btn-ghost btn-circle avatar"
              aria-label="User Menu"
            >
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                <img src={user.photoURL} alt="profile" />
              </div>
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <ul className="absolute right-0 mt-2 w-48 bg-base-100 border border-gray-300 rounded-md shadow-lg z-50">
                <li className="px-4 py-2 font-bold border-b">
                  {user.displayName}
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 hover:text-black"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/profile"
                    className="block px-4 py-2 hover:bg-gray-100 hover:text-black"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 hover:text-black"
                    onClick={() => {
                      setDropdownOpen(false);
                       toast.success("Account Logout successfully!");
                      Logout();
                    }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        )}

        {/* Mobile menu button */}
        <button
          className="md:hidden btn btn-ghost btn-square"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? (
            <FaTimes className="w-6 h-6" />
          ) : (
            <FaBars className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile menu (small screens) */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-base-100 shadow-md border-t border-gray-200 z-40">
          <div className="flex flex-col space-y-1 p-4">
            {menuLinks}

            {!user && (
              <Link
                to="/register"
                className="btn btn-primary w-full text-center mt-2"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
