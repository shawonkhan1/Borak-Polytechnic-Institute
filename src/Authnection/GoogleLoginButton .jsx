import React from "react";
import { FcGoogle } from "react-icons/fc";

const GoogleLoginButton = () => {
  const handleClick = () => {
    console.log("Google Login Clicked");
    // 👉 পরে এখানে Firebase/Auth call করবে
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
