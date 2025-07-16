import React from 'react';
import Lottie from 'lottie-react';
import error from '../assets/Lottie/Error 404.json'; // পাথ ঠিকমতো আছে কিনা চেক করো

const ErrorPage = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-blue-100 px-4 text-center">
      <div className="w-72 h-72">
        <Lottie animationData={error} loop={true} />
      </div>
      <h2 className="text-3xl font-bold text-blue-700 mt-4">Oops! Page Not Found</h2>
      <p className="text-blue-600 mt-2">The page you are looking for might have been removed or doesn’t exist.</p>
      <a
        href="/"
        className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Go Back Home
      </a>
    </div>
  );
};

export default ErrorPage;
