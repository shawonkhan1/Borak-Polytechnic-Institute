import React from "react";
import { Outlet } from "react-router";
import Navbar from "../Share/Navbar";

const HomeLayout = () => {
  return (
    <div>
     <Navbar></Navbar>
      <div className="lg:min-h-[calc(100vh-290px)] min-h-[calc(100vh-310px)]  md:min-h-[calc(100vh-300px)] lg:mr-[100px]  ml-[20px] mr-[20px] lg:ml-[100px]">
        <Outlet></Outlet>
      </div>
     <h1 className="text-4xl text-center">footer</h1>
    </div>
  );
};

export default HomeLayout;
