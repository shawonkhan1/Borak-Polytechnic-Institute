import React from "react";
import { Outlet } from "react-router";
import Navbar from "../Share/Navbar";
import Footer from "../Share/Footer";

const HomeLayout = () => {
  return (
    <div>
     <Navbar></Navbar>
      <div className="lg:min-h-[calc(100vh-410px)] min-h-[calc(100vh-310px)]  md:min-h-[calc(100vh-410px)] lg:mr-[100px]  ml-[20px] mr-[20px] lg:ml-[100px]">
        <Outlet></Outlet>
      </div>
    <Footer></Footer>
    </div>
  );
};

export default HomeLayout;
