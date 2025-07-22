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
import GeminiChatBot from "../HOOKS/ChatBot/GeminiChatBot ";
import SuccessStudent from "../Page/SuccessStudent";

const HomePage = () => {
  const { user } = useContext(AuthContext);
  console.log(user);
  return (
    <div>
      <Banner></Banner>

      <OurPatner></OurPatner>

      {user && <GeminiChatBot />}

      <TopEnrolledClasses></TopEnrolledClasses>

      <SummarySection></SummarySection>

      <InspirationTeacher></InspirationTeacher>

      <Events></Events>

      <BlogSection></BlogSection>
      <SuccessStudent></SuccessStudent>

      <Faq></Faq>
      <Revew></Revew>
    </div>
  );
};

export default HomePage;
