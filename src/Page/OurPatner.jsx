import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import Loading from "../Share/Loading";

const OurPartner = () => {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    fetch("/Patners.json")
      .then((res) => res.json())
      .then((data) => setPartners(data))
      .catch((err) => console.error("Failed to load partners:", err));
  }, []);

  if (partners.length === 0) {
    return <Loading />;
  }

  return (
    <div className="py-16 ">
      <h2 className="text-2xl md:text-4xl font-extrabold text-center text-blue-600 mb-5">
        Our Trusted Partners
      </h2>
      <p className="text-center mb-10 max-w-2xl mx-auto text-gray-600">
        We proudly collaborate with these leading organizations to deliver the best services.
      </p>

      <Marquee
        gradient={false}
        speed={50}
        pauseOnHover={true}
      >
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="flex-shrink-0 flex items-center justify-center mx-8 bg-gray-50 rounded-lg p-4 shadow hover:shadow-xl transition duration-300"
          >
            <img
              src={partner.logo}
              alt={partner.name}
              className="h-16 w-auto object-contain transition duration-300"
            />
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default OurPartner;
