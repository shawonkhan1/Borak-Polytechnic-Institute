import React, { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Loading from "../Share/Loading";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1); // 
  const [totalPages, setTotalPages] = useState(1); 
  const limit = 6; 

  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
     
        const res = await axiosSecure.get(`/payments?page=${page}&limit=${limit}`);
        setPayments(res.data.payments); 
        setTotalPages(res.data.totalPages); // 
        setError("");
      } catch (err) {
        setError("Failed to load payment history.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [page, axiosSecure]);

  if (loading) return <Loading></Loading>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (payments.length === 0) return <p className="text-center  mt-10">No payment records found.</p>;

  return (
    <div className="max-w-7xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">Payment History</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-600 text-white text-sm md:text-base">
              <th className="border border-gray-300 px-2 md:px-4 py-2">Transaction ID</th>
              <th className="border border-gray-300 px-2 md:px-4 py-2">Email</th>
              <th className="border border-gray-300 px-2 md:px-4 py-2">Class ID</th>
              <th className="border border-gray-300 px-2 md:px-4 py-2">Amount </th>
              <th className="border border-gray-300 px-2 md:px-4 py-2">Status</th>
              <th className="border border-gray-300 px-2 md:px-4 py-2">Payment Method</th>
              <th className="border border-gray-300 px-2 md:px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => {
              let statusColor = "text-gray-800";
              if (p.status === "succeeded") statusColor = "text-green-600 font-semibold";
              else if (p.status === "pending") statusColor = "text-yellow-600 font-semibold";
              else if (p.status === "failed") statusColor = "text-red-600 font-semibold";

              return (
                <tr key={p.transactionId} className="text-center text-xs md:text-sm">
                  <td className="border border-gray-300 px-1 md:px-4 py-2 break-all text-black">{p.transactionId}</td>
                  <td className="border border-gray-300 px-1 md:px-4 py-2 text-gray-700 truncate max-w-[150px] md:max-w-full">{p.studentEmail}</td>
                  <td className="border border-gray-300 px-1 md:px-4 py-2 text-gray-700">{p.classId}</td>
                  <td className="border border-gray-300 px-1 md:px-4 py-2 text-black font-medium">{p.amount}</td>
                  <td className={`border border-gray-300 px-1 md:px-4 py-2 ${statusColor} capitalize`}>{p.status}</td>
                  <td className="border border-gray-300 px-1 md:px-4 py-2 text-gray-700">{p.paymentMethod}</td>
                  <td className="border border-gray-300 px-1 md:px-4 py-2 text-gray-700 whitespace-nowrap">
                    {new Date(p.createdAt).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Buttons */}
      <div className="flex justify-center gap-2 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 text-black rounded ${page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`px-4 py-2 rounded ${
              page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200  text-black hover:bg-blue-600"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className={`px-4 py-2 text-black rounded ${page === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaymentHistory;
