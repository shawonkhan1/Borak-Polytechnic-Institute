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

  if (loading)
    return Loading;
  if (!classDetails)
    return <p className="text-center mt-10">No class details found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{classDetails.title}</h1>
      <img
        src={classDetails.image}
        alt={classDetails.title}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <p>
        <strong>Instructor:</strong> {classDetails.name}
      </p>
      <p>
        <strong>Price:</strong> ৳{classDetails.price}
      </p>
      <p className="mt-4">
        {classDetails.description || "No description available."}
      </p>

      <button
        onClick={handlePayClick}
        className="mt-6 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
      >
        Pay Now
      </button>
    </div>
  );
};

export default AllClassDetails;
