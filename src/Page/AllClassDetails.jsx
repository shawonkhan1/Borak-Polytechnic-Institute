import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import Loading from "../Share/Loading";

const AllClassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [classDetails, setClassDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(classDetails);
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axiosSecure
      .get(`/classes/${id}`)
      .then((res) => {
        setClassDetails(res.data);
      })
      .catch((error) => {
        console.error("Failed to fetch class details", error);
        Swal.fire("Error", "Failed to load class details", "error");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handlePayClick = () => {
    navigate(`/payments/${id}`);
  };

  if (loading) return <Loading />;
  if (!classDetails)
    return (
      <p className="text-center mt-10 text-gray-500">No class details found.</p>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-blue-700 mb-6">
        {classDetails.title}
      </h1>

      {/* Responsive, Clean Image Preview */}
      <div className="w-full h-[250px] sm:h-[350px] md:h-[450px] overflow-hidden rounded-lg shadow mb-6">
        <img
          src={classDetails.image}
          alt={classDetails.title}
          className="w-full h-full object-cover rounded"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md space-y-4 text-gray-800">
        <p className="text-lg">
          <strong className="text-blue-600">Instructor:</strong>{" "}
          {classDetails.name}
        </p>
        <p className="text-lg">
          <strong className="text-blue-600">Course Fees:</strong> ৳
          {classDetails.price}
        </p>
        <div>
          <p className="text-gray-700 mt-2 leading-relaxed">
            {classDetails.description || "No description available."}
          </p>
        </div>

        <div className="pt-6 text-center">
          <button
            onClick={handlePayClick}
            className="inline-block bg-green-600 hover:bg-green-700 transition-colors text-white px-6 py-3 rounded-lg text-lg shadow-md"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllClassDetails;
