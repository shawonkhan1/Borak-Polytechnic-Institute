import React, { useContext } from "react";
import { AuthContext } from "../AuthProvider/AuthProvider";
import Banner from "../Page/Banner";
import OurPatner from "../Page/OurPatner";
import InspirationTeacher from "../Page/InspirationTeacher ";
import Events from "../Page/Events";
import Faq from "../Page/Faq";
import SummarySection from "../Page/SummarySection ";

const HomePage = () => {
  const { user } = useContext(AuthContext);
  console.log(user);
  return (
    <div>
      <Banner></Banner>
      <OurPatner></OurPatner>
      {/* <section>
        Popular Class
      </section> */}

      {/* <section>
        🔹 Feedback Section 
      </section> */}

      {/* <section>
        SummarySection 
        total user
        total class 
      </section> */}
      <SummarySection></SummarySection>

      <InspirationTeacher></InspirationTeacher>
      <Events></Events>
      <Faq></Faq>
    </div>
  );
};

export default HomePage;
