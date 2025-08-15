// MyClassCharts.jsx
import React, { useEffect, useState, useContext } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Loading from "../Share/Loading";
import { AuthContext } from "../AuthProvider/AuthProvider";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MyClassCharts = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const res = await axiosSecure.get(`/classes/teacher?email=${user.email}`);
        setClasses(res.data.classes || []);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load class data.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [user.email, axiosSecure]);

  if (loading) return <Loading />;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (classes.length === 0)
    return <p className="text-center mt-10">No classes found.</p>;

  // Chart Data: class createdAt date vs price
  const chartData = classes.map(cls => ({
    date: new Date(cls.createdAt).toLocaleDateString(),
    price: cls.price,
  }));

  return (
    <div className="max-w-full mx-auto mt-10 p-4 sm:p-6 md:p-8 rounded shadow bg-white">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-black">
        My Classes Charts
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
            <Bar dataKey="price" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MyClassCharts;
