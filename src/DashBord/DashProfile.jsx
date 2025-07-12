import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthProvider/AuthProvider";
import useAxiosSecure from "../hooks/useAxiosSecure";

const DashProfile = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.email) return;

    setLoading(true);
    axiosSecure
      .get(`/users?email=${user.email}`)
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setProfile(res.data[0]);
        } else {
          setError("User not found");
        }
      })
      .catch((err) => {
        setError("Failed to fetch profile");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [user?.email, axiosSecure]);

  if (loading)
    return <p className="text-center mt-10 text-lg">Loading profile...</p>;

  if (error)
    return (
      <p className="text-center mt-10 text-red-600 font-semibold">{error}</p>
    );

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">My Profile</h2>

      <div className="flex flex-col items-center space-y-4">
        {/* User Image */}
        <img
          src={profile.photoURL || "https://via.placeholder.com/150"}
          alt={profile.name || "User"}
          className="w-32 h-32 rounded-full object-cover"
        />

        {/* Name */}
        <p className="text-black">
          <strong className="text-black">Name: </strong> {profile.name || "N/A"}
        </p>

        {/* Email */}
        <p className="text-black">
          <strong >Email: </strong> {profile.email || "N/A"}
        </p>

        {/* Role */}
        <p className="text-black">
          <strong className="text-black">Role: </strong>{" "}
          <span className="capitalize text-black">{profile.role || "student"}</span>
        </p>
      </div>
    </div>
  );
};

export default DashProfile;
