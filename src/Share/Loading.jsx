import React from 'react';
import Lottie from 'lottie-react';
import loadingLottie from '../assets/Lottie/Loading.json'

const Loading = () => {
  return (
    <div className=" inset-0 z-50  flex justify-center items-center">
      <div className="w-30 h-30">
        <Lottie animationData={loadingLottie} loop={true} />
      </div>
     
    </div>
  );
};

export default Loading;
