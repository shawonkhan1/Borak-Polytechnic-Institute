import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../AuthProvider/AuthProvider";
import { useNavigate } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";

const UpdateProfile = () => {
  const { user, updateUserProfiles } = useContext(AuthContext);
  const { register, handleSubmit } = useForm();
  const [preview, setPreview] = useState(user?.photoURL || null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const onSubmit = async (data) => {
    try {
      let photoURL = user?.photoURL;

      // যদি নতুন ছবি দেয়
      if (data.image && data.image[0]) {
        const imageFile = data.image[0];
        const formData = new FormData();
        formData.append("image", imageFile);

        const imgbbAPIKey = import.meta.env.VITE_IMGBB_API_KEY;

        const response = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`,
          formData
        );

        if (response.data.success) {
          photoURL = response.data.data.url;
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Image upload failed!",
          });
          return;
        }
      }

      // Firebase Profile Update
      await updateUserProfiles(data.name, photoURL);

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been successfully updated!",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/profile");
    } catch (error) {
      console.error("Profile update failed:", error);
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: error.message || "Failed to update profile.",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow-md mt-10">
      <h2 className="text-xl font-bold text-black text-center mb-4">Update Profile</h2>

      {/* Image Preview */}
      {preview && (
        <div className="flex justify-center mb-4">
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 rounded-full object-cover border-2 border-primary"
          />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="label text-black">Name</label>
          <input
            type="text"
            defaultValue={user?.displayName}
            {...register("name", { required: "Name is required" })}
            className="input input-bordered w-full"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="label text-black">Upload New Photo</label>
          <input
            type="file"
            accept="image/*"
            {...register("image")}
            className="file-input file-input-bordered w-full"
            onChange={handleImageChange}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-full">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
