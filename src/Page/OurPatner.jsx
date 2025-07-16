import React, { useEffect, useState } from "react";
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
    return <Loading></Loading>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 p-25">
      <h2 className="text-4xl font-bold text-center text-blue-600 mb-8">Our Partners</h2>
     
      <div className="grid  grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 items-center justify-center">
        {partners.map((partner) => (
          <div key={partner.id} className="flex items-center justify-center h-50px">
            <img
              src={partner.logo}
              alt={partner.name}
              className="w-24 h-auto object-contain grayscale hover:grayscale-0 transition duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurPartner;
