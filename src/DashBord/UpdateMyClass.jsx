import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Loading from "../Share/Loading";

const UpdateMyClass = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    image: "",
  });


  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await axiosSecure.get(`/classes/${id}`);
        const cls = res.data;
        setFormData({
          title: cls.title || "",
          price: cls.price || "",
          description: cls.description || "",
          image: cls.image || "",
        });
      } catch (error) {
        console.error("Failed to fetch class data:", error);
        Swal.fire("Error", "Failed to load class data", "error");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClass();
    }
  }, [id, axiosSecure]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.image) {
      Swal.fire("Warning", "Please fill in all required fields", "warning");
      return;
    }

    try {
      const res = await axiosSecure.patch(`/classes/${id}`, {
        title: formData.title,
        price: Number(formData.price),
        description: formData.description,
        image: formData.image,
      });

      if (res.data.message) {
        Swal.fire("Success", "Class updated successfully", "success");
   navigate("/dashboard/my-class"); 

      }
    } catch (error) {
      console.error("Failed to update class:", error);
      Swal.fire("Error", "Failed to update class", "error");
    }
  };

  if (loading)
    return (
     <Loading></Loading>
    );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-4xl text-blue-600 font-bold mb-6  md:text-center">Update Class</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold" htmlFor="title">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="price">
            Price <span className="text-red-500">*</span>
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="image">
            Image URL <span className="text-red-500">*</span>
          </label>
          <input
            id="image"
            name="image"
            type="url"
            value={formData.image}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Update Class
        </button>
      </form>
    </div>
  );
};

export default UpdateMyClass;
