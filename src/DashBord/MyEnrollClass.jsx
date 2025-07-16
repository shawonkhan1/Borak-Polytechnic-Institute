import React, { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../AuthProvider/AuthProvider";
import { useNavigate } from "react-router";
import Loading from "../Share/Loading";

const MyEnrollClass = () => {
  const { user } = useContext(AuthContext);
  const userEmail = user?.email;
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userEmail) return;

    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        setError(null);

        const enrollRes = await axiosSecure.get(
          `/enrollments?studentEmail=${encodeURIComponent(userEmail)}`
        );

        const classIds = enrollRes.data.map((enroll) => enroll.classId);

        if (classIds.length === 0) {
          setClasses([]);
          setLoading(false);
          return;
        }

        const classPromises = classIds.map((id) =>
          axiosSecure.get(`/classes/${id}`).then((res) => res.data)
        );

        const classesData = await Promise.all(classPromises);
        setClasses(classesData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch enrollments or classes:", err);
        setError("Failed to load data. Please try again.");
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [userEmail, axiosSecure]);

  if (!userEmail)
    return (
      <p className="text-center mt-10 text-red-500">
        Please login to see your enrolled classes.
      </p>
    );

  if (loading)
    return (
      <Loading></Loading>
    );

  if (error)
    return (
      <p className="text-center mt-10 text-red-600 font-semibold">{error}</p>
    );

  if (classes.length === 0)
    return (
      <p className="text-4xl font-bold md:text-center mt-10 text-blue-600">You have not enrolled in any classes yet.</p>
    );

  // Pagination Logic
  const totalPages = Math.ceil(classes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentClasses = classes.slice(startIndex, startIndex + itemsPerPage);

  const handleContinue = (classId) => {
    navigate(`/dashboard/myenroll-class/${classId}`);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-blue-600 md:text-center mb-8">My Enrolled Classes</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentClasses.map((cls) => (
          <div
            key={cls._id}
            className="card bg-base-100 shadow-lg rounded-lg flex flex-col"
          >
            {cls.image && (
              <figure>
                <img
                  src={cls.image}
                  alt={cls.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </figure>
            )}
            <div className="card-body flex flex-col justify-between">
              <h2 className="card-title">{cls.title}</h2>
              <p className="mb-4">
                <strong>Teacher:</strong> {cls.name}
              </p>
              <button
                onClick={() => handleContinue(cls._id)}
                className="btn text-white bg-blue-600 mt-auto"
              >
                Continue
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Buttons (Always show) */}
      <div className="flex justify-center items-center gap-4 mt-10">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="btn btn-outline"
        >
          Previous
        </button>
        <span className="font-semibold text-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="btn btn-outline"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MyEnrollClass;
