import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../AuthProvider/AuthProvider";
import Loading from "../Share/Loading";

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

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-4xl font-bold text-center text-blue-700 mb-10">
        My Classes
      </h2>

      {classes.length === 0 ? (
        <p className="text-center text-gray-600">You have no classes added yet.</p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => (
              <div
                key={cls._id}
                className="bg-white shadow-md rounded-2xl overflow-hidden border hover:shadow-xl transition duration-300"
              >
                <img
                  src={cls.image}
                  alt={cls.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5 flex flex-col gap-2">
                  <h3 className="text-xl font-bold text-black">{cls.title}</h3>
                  <p className="text-sm text-black"><strong>Instructor:</strong> {cls.name}</p>
                  <p className="text-sm text-black "><strong>Email:</strong> {cls.email}</p>
                  <p className="text-sm text-black"><strong>Price:</strong> ${cls.price}</p>
                  <p className="text-sm text-black">
                    <strong>Description:</strong>{" "}
                    {cls.description || "No description provided."}
                  </p>
                  <p className="text-sm font-semibold">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`capitalize ${
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

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
                    <button
                      onClick={() => handleUpdate(cls._id)}
                      className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(cls._id)}
                      className="bg-red-600 text-white py-2 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleSeeDetails(cls)}
                      disabled={cls.status !== "accepted"}
                      className={`py-2 rounded ${
                        cls.status === "accepted"
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                    >
                      See Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
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
