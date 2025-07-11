import React, { useContext } from "react";
import { AuthContext } from "../AuthProvider/AuthProvider";
import Banner from "../Page/Banner";
import OurPatner from "../Page/OurPatner";
import InspirationTeacher from "../Page/InspirationTeacher ";
import Events from "../Page/Events";
import Faq from "../Page/Faq";

const HomePage = () => {
  const { user } = useContext(AuthContext);
  console.log(user);
  return (
    <div>
      <Banner></Banner>
      <OurPatner></OurPatner>
      <InspirationTeacher></InspirationTeacher>
      <Events></Events>
      <Faq></Faq>
    </div>
  );
};

export default HomePage;
