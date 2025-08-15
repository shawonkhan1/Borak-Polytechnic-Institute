// PaymentCharts.jsx
import React, { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Loading from "../Share/Loading";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const PaymentCharts = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const res = await axiosSecure.get("/payments");
        setPayments(res.data.payments || []);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load payment data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [axiosSecure]);

  if (loading) return <Loading />;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (payments.length === 0)
    return <p className="text-center mt-10">No payment records found.</p>;

  // Chart Data: sum of amount per date
  const chartData = payments.reduce((acc, curr) => {
    const date = new Date(curr.createdAt).toLocaleDateString(); // date only
    const existing = acc.find((item) => item.date === date);
    if (existing) {
      existing.amount += curr.amount;
    } else {
      acc.push({ date, amount: curr.amount });
    }
    return acc;
  }, []);

  return (
    <div className="max-w-full mx-auto mt-10 p-4 sm:p-6 md:p-8 rounded shadow bg-white">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-black">
        Payment Charts
      </h1>

      <div className="w-full h-96 sm:h-[400px] md:h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: "#000000", fontSize: 12, fontWeight: 500 }}
              angle={-30} 
              textAnchor="end"
              interval={0} 
            />
            <YAxis tick={{ fill: "#000000", fontSize: 12, fontWeight: 500 }} />
            <Tooltip />
            <Bar dataKey="amount" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PaymentCharts;
