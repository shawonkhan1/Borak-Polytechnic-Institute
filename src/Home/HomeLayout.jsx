import React from "react";
import { Outlet } from "react-router";

const HomeLayout = () => {
  return (
    <div>
      navbar
      <div className="lg:min-h-[calc(100vh-290px)] min-h-[calc(100vh-310px)]  md:min-h-[calc(100vh-300px)] lg:mr-[100px]  ml-[20px] mr-[20px] lg:ml-[100px]">
        <Outlet></Outlet>
      </div>
      {/* footer */}
    </div>
  );
};

export default HomeLayout;
