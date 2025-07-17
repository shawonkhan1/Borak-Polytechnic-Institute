import React, { useContext } from "react";
import { AuthContext } from "../AuthProvider/AuthProvider";
import Banner from "../Page/Banner";
import OurPatner from "../Page/OurPatner";
import InspirationTeacher from "../Page/InspirationTeacher ";
import Events from "../Page/Events";
import Faq from "../Page/Faq";
import SummarySection from "../Page/SummarySection ";
import TopEnrolledClasses from "../Page/TopEnrolledClasses ";
import Revew from "../Page/Revew";
import Loading from "../Share/Loading";
import BlogSection from "../Page/BlogSection";

const HomePage = () => {
  const { user } = useContext(AuthContext);
  console.log(user);
  return (
    <div>
      <Banner></Banner>

      <OurPatner></OurPatner>

      <TopEnrolledClasses></TopEnrolledClasses>

      <Revew></Revew>

      <SummarySection></SummarySection>

      <InspirationTeacher></InspirationTeacher>
     
      <Events></Events>
      
      <BlogSection></BlogSection>
      
      <Faq></Faq>
    </div>
  );
};

export default HomePage;
