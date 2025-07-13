import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthProvider/AuthProvider";
import { Link } from "react-router"; // ✅ use react-router-dom
import useAxiosSecure from "../hooks/useAxiosSecure";

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user?.email) {
        try {
          const res = await axiosSecure.get(`/users?email=${user.email}`);
          const userData = res.data[0];
          setRole(userData?.role || "student");
        } catch (err) {
          console.error("Error fetching user role", err);
        }
      }
    };
    fetchUserRole();
  }, [user, axiosSecure]);

  return (
    <div className="min-h-[80vh] flex justify-center items-center bg-base-200 px-4">
      <div className="bg-base-100 shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        {/* Profile Image */}
        <div className="flex justify-center mb-4">
          <img
            src={user?.photoURL || "https://via.placeholder.com/150"}
            alt="User"
            className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-md"
          />
        </div>

        {/* User Info */}
        <h2 className="text-2xl font-bold text-primary mb-1">
          {user?.displayName || "No Name"}
        </h2>
        <p className="text-sm text-gray-500 mb-1">
          {user?.email || "No Email Available"}
        </p>

        {/* ✅ Show Role */}
        <p className="text-sm text-gray-500 mb-4 capitalize">
          Role: <span className="font-medium text-primary">{role}</span>
        </p>

        {/* Divider */}
        <div className="divider my-4">Action</div>

        {/* Update Button */}
        <Link to="/updateProfile">
          <button className="btn btn-outline btn-primary w-full">
            Update Profile
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UserProfile;
