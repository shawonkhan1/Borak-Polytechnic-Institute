import React, { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

const AllClass = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [enrollmentsCount, setEnrollmentsCount] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // 🔍 search state

  const limit = 6;

  const fetchClasses = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axiosSecure.get(`/classes?page=${page}&limit=${limit}`);
      const fetchedClasses = res.data.classes;
      setClasses(fetchedClasses);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);

      // Enrollments count fetch
      const counts = {};
      await Promise.all(
        fetchedClasses.map(async (cls) => {
          const countRes = await axiosSecure.get(`/enrollments/count?classId=${cls._id}`);
          counts[cls._id] = countRes.data.count || 0;
        })
      );
      setEnrollmentsCount(counts);
    } catch (error) {
      console.error("Failed to fetch classes", error);
      Swal.fire("Error", "Failed to load classes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses(currentPage);
  }, [currentPage]);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // 🔍 Filter classes by searchQuery (title match)
  const filteredClasses = classes.filter((cls) =>
    cls.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p className="text-center mt-10">Loading classes...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Classes</h1>

      {/* 🔍 Search Box */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input input-bordered w-full max-w-md"
        />
      </div>

      {filteredClasses.length === 0 ? (
        <p className="text-center">No classes found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((cls) => (
              <div
                key={cls._id}
                className="border rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
              >
                <img
                  src={cls.image}
                  alt={cls.title}
                  className="w-full h-40 object-cover rounded mb-4"
                />
                <h2 className="text-xl font-semibold mb-1">{cls.title}</h2>
                <p className="text-gray-600 mb-2">By: {cls.name}</p>
                <p className="text-gray-700 mb-2 line-clamp-2">
                  {cls.description || "No description provided."}
                </p>
                <p className="font-bold mb-2">Price: ৳{cls.price}</p>
                <p className="mb-4">
                  Total Enrolled: {enrollmentsCount[cls._id] || 0}
                </p>
                <button
                  onClick={() => navigate(`/class/${cls._id}`)}
                  className="mt-auto bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                  Enroll
                </button>
              </div>
            ))}
          </div>

          {/* Pagination Buttons */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 font-semibold text-blue-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AllClass;
