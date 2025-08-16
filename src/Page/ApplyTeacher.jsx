import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthProvider/AuthProvider";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import Loading from "../Share/Loading";

const categories = [
  "Math",
  "English",
  "Physics",
  "Chemistry",
  "Bangla",
  "History",
];

const experiences = ["Less than 1 year", "1–2 years", "3–5 years", "5–10 years", "10+ years"];

const ApplyTeacher = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    experience: experiences[0],
    title: "",
    category: categories[0],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await axiosSecure.get("/users");
        const currentUser = res.data.find((u) => u.email === user?.email);
        setRole(currentUser?.role || "student");
      } catch (error) {
        console.error("Error fetching user role", error);
      } finally {
        setRoleLoading(false);
      }
    };

    if (user?.email) {
      fetchUserRole();
    }
  }, [user, axiosSecure]);

  if (roleLoading) {
    return <Loading></Loading>;
  }

 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const dataToSend = {
        ...formData,
        image: user?.photoURL,
        status: "pending",
        userId: user?.uid,
      };

      const res = await axiosSecure.post("/teacher-requests", dataToSend);
      navigate("/");
      if (res.data.id) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Your request has been submitted and is pending approval.",
          timer: 3000,
          showConfirmButton: false,
        });

        setFormData({
          ...formData,
          title: "",
          experience: experiences[0],
          category: categories[0],
        });
      } else {
        setMessage("Failed to submit request. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred. Please try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Apply for Teacher
      </h2>

      {/* User Image */}
      {user?.photoURL && (
        <div className="flex justify-center mb-6">
          <img
            src={user.photoURL}
            alt="User"
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold text-black">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
        />

        <label className="block mb-2 font-semibold text-black">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          readOnly
          className="w-full p-2 border border-gray-300 rounded mb-4 bg-gray-100 text-black cursor-not-allowed"
        />

        <label className="block mb-2 font-semibold text-black">
          Experience
        </label>
        <select
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 text-black rounded mb-4"
          required
        >
          {experiences.map((exp) => (
            <option key={exp} value={exp}>
              {exp}
            </option>
          ))}
        </select>

        <label className="block mb-2 font-semibold text-black">Subject Name</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="E.g. Math"
          className="w-full text-black p-2 border border-gray-300 rounded mb-4"
        />

        <label className="block mb-2 font-semibold text-black">Subject Options:</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full text-black p-2 border border-gray-300 rounded mb-6"
          required
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {/* button */}
        <button
          type="submit"
          disabled={loading || role === "admin" || role === "teacher"}
          className={`w-full py-3 rounded transition ${
            loading || role === "admin" || role === "teacher"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? (
            <Loading />
          ) : role === "admin" || role === "teacher" ? (
            "You are not allowed"
          ) : (
            "Submit for Review"
          )}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-center ${
            message.includes("error") || message.includes("Failed")
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default ApplyTeacher;
