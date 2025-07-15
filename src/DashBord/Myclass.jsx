import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router"; // react-router-dom থেকে import করতে হবে
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../AuthProvider/AuthProvider";

const MyClass = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);


  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  
  const fetchMyClasses = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const res = await axiosSecure.get(
        `/classes/teacher?email=${user.email}&page=${currentPage}&limit=6`
      );
      setClasses(res.data.classes);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
      Swal.fire("Error", "Failed to load your classes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyClasses();
  }, [user, currentPage]);

 
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this class permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/classes/${id}`);
          if (res.data.message) {
            Swal.fire("Deleted!", "Your class has been deleted.", "success");
            fetchMyClasses();
          } else {
            Swal.fire("Error", "Delete failed", "error");
          }
        } catch (error) {
          console.error(error);
          Swal.fire("Error", "Delete failed", "error");
        }
      }
    });
  };


  const handleUpdate = (id) => {
    navigate(`/dashboard/updateMyclass/${id}`);
  };


  const handleSeeDetails = (cls) => {
    if (cls.status !== "accepted") {
      Swal.fire("Info", "This class is not approved yet.", "info");
      return;
    }
    navigate(`/dashboard/seeDetails/${cls._id}`);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading your classes...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">My Classes</h2>
      {classes.length === 0 ? (
        <p className="text-center text-gray-600">You have no classes added yet.</p>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            {classes.map((cls) => (
              <div
                key={cls._id}
                className="border rounded shadow p-4 flex flex-col"
              >
                <img
                  src={cls.image}
                  alt={cls.title}
                  className="w-full h-48 object-cover rounded mb-4"
                />
                <h3 className="text-xl font-semibold">{cls.title}</h3>
                <p>
                  <strong>Name:</strong> {cls.name}
                </p>
                <p>
                  <strong>Email:</strong> {cls.email}
                </p>
                <p>
                  <strong>Price:</strong> ${cls.price}
                </p>
                <p className="mb-4">
                  <strong>Description:</strong>{" "}
                  {cls.description || "No description provided."}
                </p>
                <p className="mb-4">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`capitalize font-semibold ${
                      cls.status === "pending"
                        ? "text-yellow-500"
                        : cls.status === "accepted"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {cls.status}
                  </span>
                </p>
                <div className="mt-auto flex justify-between space-x-2">
                  <button
                    onClick={() => handleUpdate(cls._id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(cls._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleSeeDetails(cls)}
                    disabled={cls.status !== "accepted"}
                    className={`px-4 py-2 rounded ${
                      cls.status === "accepted"
                        ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    See Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="flex items-center px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MyClass;
