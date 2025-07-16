import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../AuthProvider/AuthProvider";

const imggApiKey = import.meta.env.VITE_IMGBB_API_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${imggApiKey}`;

const AddClass = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [previewImage, setPreviewImage] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("image", data.image[0]);

      const imgRes = await fetch(image_hosting_api, {
        method: "POST",
        body: formData,
      });

      const imgData = await imgRes.json();
      const imageUrl = imgData?.data?.url;

      if (imageUrl) {
        const newClass = {
          title: data.title,
          name: user?.displayName,
          email: user?.email,
          price: parseFloat(data.price),
          description: data.description,
          image: imageUrl,
          status: "pending",
        };

        const res = await axiosSecure.post("/classes", newClass);
        if (res.data.insertedId) {
          Swal.fire("Success!", "Class submitted for review.", "success");
          reset();
          setPreviewImage(null);
          navigate("/dashboard");
        }
      } else {
        Swal.fire("Error", "Image upload failed!", "error");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      Swal.fire("Error", "Image upload failed!", "error");
    }
  };

  return (
    <section className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">
        Add a New Class
      </h2>

      {previewImage && (
        <div className="mb-4 flex justify-center">
          <img
            src={previewImage}
            alt="Preview"
            className="max-h-64 rounded object-contain"
          />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="font-medium text-black">Title</label>
          <input
            {...register("title", { required: true })}
            className="w-full border text-black p-2 rounded mt-1"
            placeholder="Enter class title"
          />
          {errors.title && (
            <span className="text-red-500">Title is required</span>
          )}
        </div>

        <div>
          <label className="font-medium text-black">Name</label>
          <input
            value={user?.displayName || ""}
            readOnly
            className="w-full border text-black p-2 rounded mt-1 bg-gray-100"
          />
        </div>

        <div>
          <label className="font-medium text-black">Email</label>
          <input
            value={user?.email || ""}
            readOnly
            className="w-full border text-black p-2 rounded mt-1 bg-gray-100"
          />
        </div>

        <div>
          <label className="font-medium text-black">Price</label>
          <input
            type="number"
            step="0.01"
            {...register("price", { required: true })}
            className="w-full border text-black p-2 rounded mt-1"
            placeholder="Enter price"
          />
          {errors.price && (
            <span className="text-red-500">Price is required</span>
          )}
        </div>

        <div>
          <label className="font-medium text-black">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            {...register("image", { required: true })}
            onChange={handleImageChange}
            className="w-full border text-black p-2 rounded mt-1"
          />
          {errors.image && (
            <span className="text-red-500">Image is required</span>
          )}
        </div>

        <div>
          <label className="font-medium text-black">Description</label>
          <textarea
            {...register("description")}
            className="w-full border p-2 text-black rounded mt-1"
            rows="4"
            placeholder="Class description"
          ></textarea>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
          >
            Add Class
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddClass;
