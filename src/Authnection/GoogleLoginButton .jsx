import React, { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../AuthProvider/AuthProvider";
import { useLocation, useNavigate } from "react-router";
import Loading from "../Share/Loading";
import useAxiosSecure from "../hooks/useAxiosSecure";

const GoogleLoginButton = () => {
  const { googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  // POST function with axiosSecure
  const postUser = async (user) => {
    const res = await axiosSecure.post("/users", {
      email: user.email,
      name: user.displayName || "",
      photoURL: user.photoURL || "",
    });
    return res.data;
  };

  const mutation = useMutation({
    mutationFn: postUser,
    onSuccess: () => {
      // Optionally invalidate queries here
      navigate(location.state || "/");
    },
    onError: (error) => {
      console.error("Error saving user:", error);
    },
  });

  const handleClick = async () => {
    try {
      const result = await googleLogin();
      const user = result.user;
      mutation.mutate(user);
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={mutation.isLoading}
      className="btn btn-outline w-full flex items-center justify-center gap-2 mt-4"
    >
      <FcGoogle className="text-2xl" />
      {mutation.isLoading ? <Loading /> : "Continue with Google"}
    </button>
  );
};

export default GoogleLoginButton;
