import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router";
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
  FaInfoCircle,
  FaCheckCircle,
} from "react-icons/fa";

import { AuthContext } from "../AuthProvider/AuthProvider";
import useAxiosSecure from "../hooks/useAxiosSecure";

const DashBordLayouts = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { Logout, user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [userRole, setUserRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);
  console.log(userRole);

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

  const isActive = (path) => location.pathname === path;

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
            icon: <FaCheckCircle size={20} />, // চেক মার্ক আইকন
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
          // {
          //   name: "My Enroll Class Details",
          //   path: "my-enroll-class-details",
          //   icon: <FaInfoCircle size={20} />,
          // },
          {
            name: "Profile",
            path: "profile",
            icon: <FaUserCircle size={20} />,
          },
        ]
      : []),
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md flex items-center justify-between px-4 py-3 md:hidden z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700"
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          <h1 className="text-xl font-semibold text-gray-900">BPI</h1>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          w-80 md:w-72
          pt-16 md:pt-6
          md:translate-x-0
          z-40
        `}
      >
        <nav className="flex flex-col h-full px-10 space-y-2">
          {links.map(({ name, path, icon }) => (
            <Link
              key={name}
              to={path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-md font-medium transition-colors
                ${
                  isActive(path)
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                }
              `}
            >
              <span>{icon}</span>
              <span>{name}</span>
            </Link>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-md font-medium text-red-600 hover:bg-red-100 mt-6"
          >
            <FaSignOutAlt size={20} />
            <span>Logout</span>
          </button>
        </nav>

        <footer className="mt-auto text-center text-gray-400 text-sm py-4">
          © 2025 YourCompany
        </footer>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pt-16 md:pt-6 px-5 md:ml-[0px]">
        <Outlet />
      </main>
    </div>
  );
};

export default DashBordLayouts;
