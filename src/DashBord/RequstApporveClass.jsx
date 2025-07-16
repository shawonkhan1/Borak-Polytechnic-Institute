import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Loading from "../Share/Loading";

const RequstApproveClass = () => {
  const axiosSecure = useAxiosSecure();

  const [pendingClasses, setPendingClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 6; 

  const fetchPendingClasses = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axiosSecure.get(`/classes?status=pending&page=${page}&limit=${limit}`);

      if (Array.isArray(res.data.classes)) {
        setPendingClasses(res.data.classes);
        setTotalPages(res.data.totalPages || 1);
        setCurrentPage(res.data.currentPage || 1);
      } else {
        setPendingClasses([]);
      }
    } catch (error) {
      console.error("Failed to fetch pending classes", error);
      Swal.fire("Error", "Failed to fetch pending classes", "error");
      setPendingClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingClasses(currentPage);
  }, [currentPage]);

  const openDetailsModal = (classItem) => {
    setSelectedClass(classItem);
    setModalOpen(true);
  };

  const closeDetailsModal = () => {
    setSelectedClass(null);
    setModalOpen(false);
  };

  const handleApprove = async (id) => {
    try {
      const res = await axiosSecure.patch(`/classes/approve/${id}`, {
        status: "accepted",
      });
      if (res.data.message) {
        Swal.fire("Approved!", "Class has been approved.", "success");
        fetchPendingClasses(currentPage); // 
      } else {
        Swal.fire("Oops", "Approval failed.", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to approve class", "error");
    }
  };

  const handleDecline = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the class permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/classes/${id}`);
        if (res.data.message) {
          Swal.fire("Deleted!", "Class has been deleted.", "success");
       
          if (pendingClasses.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          } else {
            fetchPendingClasses(currentPage);
          }
        } else {
          Swal.fire("Oops", "Delete failed.", "error");
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to delete class", "error");
      }
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading)
    return (
      <Loading></Loading>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-4xl font-bold mb-6 text-center text-blue-600">Pending Classes</h2>

      {pendingClasses.length === 0 ? (
        <p className="text-center text-blue-600">No pending classes found.</p>
      ) : (
        <>
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Title</th>
                <th className="border border-gray-300 px-4 py-2">Teacher Name</th>
                <th className="border border-gray-300 px-4 py-2">Price</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingClasses.map((cls) => (
                <tr key={cls._id} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{cls.title}</td>
                  <td className="border border-gray-300 px-4 py-2">{cls.name}</td>
                  <td className="border border-gray-300 px-4 py-2">${cls.price}</td>
                  <td className="border border-gray-300 px-4 py-2 capitalize">{cls.status}</td>
                  <td className="border border-gray-300 px-4 py-2 space-x-2">
                    <button
                      onClick={() => openDetailsModal(cls)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleApprove(cls._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDecline(cls._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Decline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Details Modal */}
      {modalOpen && selectedClass && (
        <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full relative shadow-lg">
            <button
              onClick={closeDetailsModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl font-bold"
              aria-label="Close modal"
            >
              &times;
            </button>
            <h3 className="text-2xl font-semibold mb-4">{selectedClass.title}</h3>
            <img
              src={selectedClass.image}
              alt={selectedClass.title}
              className="mb-4 rounded max-h-48 object-contain w-full"
            />
            <p>
              <strong>Teacher:</strong> {selectedClass.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedClass.email}
            </p>
            <p>
              <strong>Price:</strong> ${selectedClass.price}
            </p>
            <p>
              <strong>Description:</strong> {selectedClass.description || "No description"}
            </p>
            <p>
              <strong>Status:</strong> {selectedClass.status}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequstApproveClass;
