import React, { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import Loading from "../Share/Loading";

const MakeUserToAdmin = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // search query
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const axiosSecure = useAxiosSecure();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get("/users");
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load users");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (email, newRole) => {
    const confirm = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to make this user ${newRole}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: newRole === "admin" ? "#3085d6" : "#6c757d",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Confirm",
    });

    if (confirm.isConfirmed) {
      try {
        const response = await axiosSecure.patch(`/users/role/${email}`, {
          role: newRole,
        });

        if (response.status === 200) {
          await fetchUsers();
          Swal.fire("Success", `User role changed to ${newRole}`, "success");
        }
      } catch (error) {
        Swal.fire("Error", "Failed to update role", "error");
      }
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Get users for current page
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination handlers
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading) return <Loading />;
  if (error)
    return <p className="text-center text-red-500 font-semibold mt-6">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl md:text-4xl text-blue-600 font-bold mb-4 md:text-center">
        Manage Users Roles
      </h1>

      {/* Search Box */}
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search by email..."
          className="input input-bordered w-full max-w-md"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // reset page on search
          }}
        />
      </div>

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="min-w-[300px] md:min-w-full border text-sm md:text-base ">
          <thead>
            <tr>
              <th className="border px-2 py-2 md:px-4 md:py-2">Name</th>
              <th className="border px-2 py-2 md:px-4 md:py-2">Email</th>
              <th className="border px-2 py-2 md:px-4 md:py-2">Role</th>
              <th className="border px-2 py-2 md:px-4 md:py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No matching users found.
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr key={user.email} className="">
                  <td className="border px-2 py-1 md:px-4 md:py-2 flex items-center gap-2">
                    <img
                      src={user.photoURL || ""}
                      alt={user.name || "User"}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    {user.name || "-"}
                  </td>
                  <td className="border px-2 py-1 md:px-4 md:py-2">{user.email}</td>
                  <td className="border px-2 py-1 md:px-4 md:py-2 capitalize">
                    {user.role || "student"}
                  </td>
                  <td className="border px-2 py-1 md:px-4 md:py-2 space-x-1 md:space-x-2">
                    <button
                      onClick={() => handleRoleChange(user.email, "admin")}
                      disabled={user.role === "admin"}
                      className={`px-2 py-1 text-xs md:text-sm rounded ${
                        user.role === "admin"
                          ? "bg-green-400 cursor-not-allowed text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      Make Admin
                    </button>
                    <button
                      onClick={() => handleRoleChange(user.email, "student")}
                      disabled={user.role === "student" || !user.role}
                      className={`px-2 py-1 text-xs md:text-sm rounded ${
                        user.role === "student" || !user.role
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : "bg-gray-600 hover:bg-gray-700 text-white"
                      }`}
                    >
                      Make Student
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400"
          >
            Previous
          </button>
          <span className="font-semibold text-blue-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MakeUserToAdmin;
