import React, { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useNavigate } from "react-router";
import Loading from "../Share/Loading";

const AllClass = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [enrollmentsCount, setEnrollmentsCount] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // search state
  const [selectedSubject, setSelectedSubject] = useState("All"); // subject filter

  const subjects = [
    "All",
    "Math",
    "English",
    "Physics",
    "Chemistry",
    "Biology",
  ];
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
          const countRes = await axiosSecure.get(
            `/enrollments/count?classId=${cls._id}`
          );
          counts[cls._id] = countRes.data.count || 0;
        })
      );
      setEnrollmentsCount(counts);
    } catch (error) {
      console.error("Failed to fetch classes", error);
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

  // Filter classes by searchQuery and selectedSubject
  const filteredClasses = classes
    .filter((cls) => selectedSubject === "All" || cls.title === selectedSubject)
    .filter((cls) =>
      cls.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-blue-600">
        Available Classes
      </h1>

      {/* Search + Subject Filter */}
      <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search - center */}
        <div className="flex justify-center w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by Subject Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered w-full max-w-md px-4 py-2 text-sm sm:text-base"
          />
        </div>

        {/* Subject Filter - right */}
        <div className="w-full sm:w-auto flex justify-center sm:justify-end">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="input input-bordered w-40 px-4 py-2 text-sm sm:text-base"
          >
            {subjects.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredClasses.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No classes found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((cls) => (
              <div
                key={cls._id}
                className="border rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-5 flex flex-col bg-white"
              >
                <img
                  src={cls.image}
                  alt={cls.title}
                  className="w-full h-44 object-cover rounded-md mb-4"
                />
                <h2 className="text-xl font-semibold mb-1 text-gray-800">
                  {cls.title}
                </h2>
                <p className="text-gray-600 mb-2 text-sm">
                  By: <span className="font-medium">{cls.name}</span>
                </p>
                <p className="text-gray-600 mb-2 text-sm line-clamp-2">
                  {cls.description || "No description provided."}
                </p>
                <p className="text-blue-700 font-semibold mb-1">
                  Price: ৳{cls.price}
                </p>
                <p className="text-gray-700 mb-4 text-sm">
                  Total Enrolled: {enrollmentsCount[cls._id] || 0}
                </p>
                <button
                  onClick={() => navigate(`/class/${cls._id}`)}
                  className="mt-auto bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
                >
                  Enroll
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 text-black rounded-md bg-gray-300 hover:bg-gray-400 disabled:opacity-50 transition"
            >
              Previous
            </button>
            <span className="px-4 text-blue-600 font-medium text-sm sm:text-base">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-black rounded-md bg-gray-300 hover:bg-gray-400 disabled:opacity-50 transition"
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
