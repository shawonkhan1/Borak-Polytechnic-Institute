import React, { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const TeacherRequestsTable = () => {
  const axiosSecure = useAxiosSecure();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await axiosSecure.get("/teacher-requests");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch teacher requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (request) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to approve this request.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Approve",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.patch(`/users/role/${request.email}`, {
          role: "teacher",
        });
        await axiosSecure.delete(`/teacher-requests/${request._id}`);
        fetchRequests();

        Swal.fire("Approved!", "User promoted to Teacher.", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to approve request", "error");
      }
    }
  };

  const handleReject = async (requestId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This request will be permanently rejected.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Reject",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/teacher-requests/${requestId}`);
        fetchRequests();
        Swal.fire("Rejected!", "Request has been removed.", "info");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to reject request", "error");
      }
    }
  };

  if (loading) return <p className="text-center mt-10">Loading requests...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Teacher Requests</h2>

      <div className="overflow-x-auto md:overflow-visible">
        <table className="w-full border border-gray-300 text-sm md:text-base">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Experience</th>
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
                <td className="border px-4 py-2">
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
                    <button
                      onClick={() => setSelectedRequest(req)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 w-full sm:w-auto"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleApprove(req)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 w-full sm:w-auto"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(req._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 w-full sm:w-auto"
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

      {/* Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md relative text-black">
            <button
              onClick={() => setSelectedRequest(null)}
              className="absolute top-2 right-2 text-gray-700 hover:text-black text-xl"
            >
              ✕
            </button>
            <div className="text-center">
              {selectedRequest.image && (
                <img
                  src={selectedRequest.image}
                  alt="User"
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
              )}
              <h3 className="text-xl font-bold mb-2">Request Details</h3>
              <p><strong>Name:</strong> {selectedRequest.name}</p>
              <p><strong>Email:</strong> {selectedRequest.email}</p>
              <p><strong>Title:</strong> {selectedRequest.title}</p>
              <p><strong>Category:</strong> {selectedRequest.category}</p>
              <p><strong>Experience:</strong> {selectedRequest.experience}</p>
              <p><strong>Status:</strong> {selectedRequest.status}</p>
              <p><strong>Submitted:</strong> {new Date(selectedRequest.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherRequestsTable;
