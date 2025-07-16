import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router"; // ✅ correct import
import axios from "axios";
import { AuthContext } from "../AuthProvider/AuthProvider";
import GoogleLoginButton from "./GoogleLoginButton ";
import { toast } from "react-toastify";
 // ✅ fixed path
// ✅ optional: use toast if needed

const Register = () => {
  const { createUser, updateUserProfiles } = useContext(AuthContext);
     const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [preview, setPreview] = useState(null);

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
    const imageFile = data.image[0];
    const formData = new FormData();
    formData.append("image", imageFile);

    const imgbbAPIKey = import.meta.env.VITE_IMGBB_API_KEY;

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`,
      formData
    );

    if (response.data.success) {
      const imageUrl = response.data.data.url;

      // ফায়ারবেসে ইউজার তৈরি করো
      await createUser(data.email, data.password);
      await updateUserProfiles(data.name, imageUrl);

      // ব্যাকএন্ডে ইউজার ডেটা POST করো
      const finalUserData = {
        name: data.name,
        email: data.email,
        photoURL: imageUrl,
      };
      await axios.post("http://localhost:5000/users", finalUserData);

      console.log("User Created and saved to DB:", finalUserData);
        toast.success("Account created successfully!");

      navigate(`${location.state ? location.state : "/"}`);
      reset();
      setPreview(null);
    } else {
      console.error("Image upload failed");
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-md bg-base-100 p-8 rounded shadow">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">
          Create Account
        </h2>

        {/* ✅ Image Preview */}
        {preview && (
          <div className="flex justify-center mb-4">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-full border-2 border-primary"
            />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className="input input-bordered w-full"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="input input-bordered w-full"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="label">
              <span className="label-text">Upload Photo</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              {...register("image", {
                required: "Image is required",
              })}
              onChange={handleImageChange} // ✅ handled properly
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`btn btn-primary w-full ${
              isSubmitting ? "loading" : ""
            }`}
            disabled={isSubmitting}
          >
            Register
          </button>
        </form>

        {/* Divider */}
        <div className="divider">OR</div>

        {/* Google Login */}
        <GoogleLoginButton />

        {/* Bottom Link */}
        <div className="flex justify-center gap-2 mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
