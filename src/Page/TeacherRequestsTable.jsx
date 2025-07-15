import React, { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const TeacherRequestsTable = () => {
  const axiosSecure = useAxiosSecure();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchCategory, setSearchCategory] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get(
        `/teacher-requests?page=${currentPage}&limit=5&category=${searchCategory}`
      );
      setRequests(res.data.requests);
      setTotalPages(res.data.totalPages);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch teacher requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [currentPage, searchCategory]);

  const handleApprove = async (req) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to approve this request.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Approve",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.patch(`/users/role/${req.email}`, {
          role: "teacher",
        });
        await axiosSecure.patch(`/teacher-requests/status/${req.email}`, {
          status: "approved",
        });
        fetchRequests();
        setSelectedRequest(null);
        Swal.fire("Approved!", "User promoted to Teacher.", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to approve request", "error");
      }
    }
  };

  const handleReject = async (req) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This request will be marked as rejected.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Reject",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.patch(`/teacher-requests/reject/${req.email}`);
        fetchRequests();
        setSelectedRequest(null);
        Swal.fire("Rejected!", "Request marked as rejected.", "info");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to reject request", "error");
      }
    }
  };

  const handleSearch = (e) => {
    setSearchCategory(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Teacher Requests</h2>

      {/* 🔍 Search Category */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search by category..."
          value={searchCategory}
          onChange={handleSearch}
          className="border p-2 rounded w-60"
        />
      </div>

      {loading ? (
        <p className="text-center mt-10">Loading requests...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border text-sm md:text-base">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Title</th>
                  <th className="border px-4 py-2">Category</th>
                  <th className="border px-4 py-2">Experience</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req._id} className="text-center border-t">
                    <td className="border px-4 py-2">{req.name}</td>
                    <td className="border px-4 py-2">{req.email}</td>
                    <td className="border px-4 py-2">{req.title}</td>
                    <td className="border px-4 py-2">{req.category}</td>
                    <td className="border px-4 py-2">{req.experience}</td>
                    <td className="border px-4 py-2 capitalize">{req.status}</td>
                    <td className="border px-4 py-2">
                      <div className="flex gap-2 flex-wrap justify-center">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleApprove(req)}
                          disabled={req.status === "approved" || req.status === "rejected"}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(req)}
                          disabled={req.status === "approved" || req.status === "rejected"}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🔢 Pagination */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span>
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

      {/* Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative">
            <button
              onClick={() => setSelectedRequest(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4 text-center">
              Request Details
            </h3>
            <p><strong>Name:</strong> {selectedRequest.name}</p>
            <p><strong>Email:</strong> {selectedRequest.email}</p>
            <p><strong>Title:</strong> {selectedRequest.title}</p>
            <p><strong>Category:</strong> {selectedRequest.category}</p>
            <p><strong>Experience:</strong> {selectedRequest.experience}</p>
            <p><strong>Status:</strong> {selectedRequest.status}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherRequestsTable;
