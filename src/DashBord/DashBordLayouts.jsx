import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate, NavLink } from "react-router";
import {
  FaHome,
  FaUserTie,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaPlusCircle,
  FaChalkboardTeacher,
  FaUserCircle,
  FaBookOpen,
  FaCheckCircle,
  FaCalendarPlus,
  FaMoon,
  FaSun,
} from "react-icons/fa";

import { AuthContext } from "../AuthProvider/AuthProvider";
import useAxiosSecure from "../hooks/useAxiosSecure";

const DashBordLayouts = () => {
  const [isOpen, setIsOpen] = useState(false); // sidebar মোবাইল টগল
  const location = useLocation();
  const navigate = useNavigate();
  const { Logout, user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [userRole, setUserRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  // Theme state
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Theme toggle function
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Apply theme on document root & save to localStorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!user?.email) return;

    setLoadingRole(true);
    axiosSecure
      .get(`/users?email=${user.email}`)
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setUserRole(res.data[0].role);
        } else {
          setUserRole(null);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user role:", err);
        setUserRole(null);
      })
      .finally(() => setLoadingRole(false));
  }, [user?.email, axiosSecure]);

  const handleLogout = async () => {
    try {
      await Logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loadingRole)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );

  const links = [
    { name: "Home", path: "/", icon: <FaHome size={20} /> },

    ...(userRole === "admin"
      ? [
          {
            name: "Teacher Requests",
            path: "teacher-requests",
            icon: <FaUserTie size={20} />,
          },
          {
            name: "Class Requests",
            path: "request-approve",
            icon: <FaCheckCircle size={20} />,
          },
          {
            name: "All Users",
            path: "usertoadmin",
            icon: <FaUserCircle size={20} />,
          },
          {
            name: "Add Event",
            path: "addevent",
            icon: <FaCalendarPlus size={20} />,
          },
          {
            name: "Profile",
            path: "profile",
            icon: <FaUserCircle size={20} />,
          },
        ]
      : []),

    ...(userRole === "teacher"
      ? [
          {
            name: "Add Class",
            path: "add-class",
            icon: <FaPlusCircle size={20} />,
          },
          {
            name: "My Class",
            path: "my-class",
            icon: <FaChalkboardTeacher size={20} />,
          },
          {
            name: "Profile",
            path: "profile",
            icon: <FaUserCircle size={20} />,
          },
        ]
      : []),

    ...(userRole === "student"
      ? [
          {
            name: "My Enroll Class",
            path: "my-enroll-class",
            icon: <FaBookOpen size={20} />,
          },
          {
            name: "Profile",
            path: "profile",
            icon: <FaUserCircle size={20} />,
          },
        ]
      : []),
  ];

  return (
    <div className={`flex min-h-screen ${theme === "light" ? "bg-gray-50" : "bg-gray-800"}`}>
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md flex items-center justify-between px-4 py-3 md:hidden z-50">
        <div className="flex items-center gap-3">
          {/* Hamburger button toggles sidebar */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700"
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          <h1 className="text-xl font-semibold text-gray-900">BPI</h1>
        </div>
        {/* Theme toggle on mobile top bar */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className={`text-2xl ${
            theme === "light" ? "text-gray-700" : "text-yellow-400"
          }`}
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          w-80 md:w-72 pt-16 md:pt-6 md:translate-x-0 z-40
        `}
        style={{
          backgroundColor: theme === "light" ? "#f9fafb" : "#1f2937",
          color: theme === "light" ? "#374151" : "#d1d5db",
        }}
      >
        {/* Theme toggle button on desktop sidebar */}
        <div className="hidden md:flex justify-end px-6 py-3 border-b border-gray-300">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className={`text-2xl ${
              theme === "light" ? "text-gray-700" : "text-yellow-400"
            }`}
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button>
        </div>

        <nav className="flex flex-col h-full px-8 space-y-2 mt-4">
          {links.map(({ name, path, icon }) => (
            <NavLink
              key={name}
              to={path}
              onClick={() => setIsOpen(false)} // sidebar auto close on mobile link click
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-md font-semibold transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow"
                    : theme === "light"
                    ? "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`
              }
            >
              <span className="text-lg">{icon}</span>
              <span>{name}</span>
            </NavLink>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-md font-semibold mt-6 transition-colors duration-200
          text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-700"
          >
            <FaSignOutAlt size={20} />
            <span>Logout</span>
          </button>
        </nav>

        <footer
          className={`mt-auto text-center text-sm py-4 ${
            theme === "light" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          © 2025 YourCompany
        </footer>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 pt-16 md:pt-6 px-6 md:ml-72 min-h-screen rounded-lg shadow-sm transition-colors duration-500 ${
          theme === "light" ? "bg-white" : "bg-gray-900 text-gray-100"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default DashBordLayouts;
