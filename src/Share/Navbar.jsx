import React, { useState, useEffect, useRef } from "react";

import { FaSun, FaMoon } from "react-icons/fa";
import NavLinks from "./Links";

const Navbar = ({ user, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  // থিম লোড & সেট করা
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // ক্লিক আউটসাইডে ড্রপডাউন বন্ধ
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <nav className="navbar bg-base-100 shadow-md sticky top-0 z-50 p-4 flex justify-between items-center">
      {/* Logo */}
      <div
        className="text-2xl font-extrabold cursor-pointer text-primary"
        onClick={() => (window.location.href = "/")}
      >
        EduManage
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex font-semibold text-lg">
        <NavLinks />
      </div>

      {/* Theme toggle + User */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
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
          <button
            onClick={() => (window.location.href = "/login")}
            className="btn btn-primary"
          >
            Sign In
          </button>
        ) : (
          <div className="dropdown dropdown-end relative" ref={dropdownRef}>
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={user.photoURL} alt="profile" />
              </div>
            </label>

            {dropdownOpen && (
              <ul className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <span className="font-bold cursor-default">
                    {user.displayName}
                  </span>
                </li>
                <li>
                  <a
                    href="/dashboard"
                    className="hover:text-primary"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <button
                    className="text-red-600"
                    onClick={() => {
                      setDropdownOpen(false);
                      onLogout();
                    }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
