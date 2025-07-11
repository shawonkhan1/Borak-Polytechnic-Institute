import React, { useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../AuthProvider/AuthProvider";
import { useLocation, useNavigate } from "react-router";


const GoogleLoginButton = () => {
  const { googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();
  const location = useLocation();
  const handleClick = () => {
    googleLogin()
      .then(result => {
        console.log("Google Login Success:", result.user);
          navigate(`${location.state ? location.state : "/"}`);
        // এখানে তুমি চাইলে ইউজার ডাটা সেভ করতে পারো বা রিডাইরেক্ট করতে পারো
      })
      .catch(error => {
        console.error("Google Login Error:", error.message);
      });
  };

  return (
    <button
      onClick={handleClick}
      className="btn btn-outline w-full flex items-center justify-center gap-2 mt-4"
    >
      <FcGoogle className="text-2xl" />
      Continue with Google
    </button>
  );
};

export default GoogleLoginButton;
