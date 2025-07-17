import React, { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useNavigate } from "react-router";
import Loading from "../Share/Loading";

const TopEnrolledClasses = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [topClasses, setTopClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopEnrolledClasses = async () => {
      setLoading(true);
      try {
        const res = await axiosSecure.get("/classes?status=accepted");
        const classes = res.data.classes;
      console.log("Response data:", res.data);


        const classWithEnrollment = await Promise.all(
          classes.map(async (cls) => {
            const countRes = await axiosSecure.get(
              `/enrollments/count?classId=${cls._id}`
            );
            return {
              ...cls,
              enrollmentCount: countRes.data.count || 0,
            };
          })
        );

        const sorted = classWithEnrollment
          .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
          .slice(0, 6);

        setTopClasses(sorted);
      } catch (err) {
        console.error("Failed to load top enrolled classes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopEnrolledClasses();
  }, []);

  if (loading) return <Loading></Loading>;
  if (topClasses.length === 0) return null;
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-6 text-green-700">
        🎓 Top Enrolled Classes
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topClasses.map((cls) => (
          <div
            key={cls._id}
            className="border rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
          >
            <img
              src={cls.image}
              alt={cls.title}
              className="w-full h-40 object-cover rounded mb-4"
            />
            <h3 className="text-xl font-semibold mb-1">{cls.title}</h3>
            <p className="text-gray-600 mb-2">Instructor: {cls.name}</p>
            <p className="font-bold mb-2">Price: ৳{cls.price}</p>
            <p className="mb-2 text-blue-700 font-medium">
              Total Enrolled: {cls.enrollmentCount}
            </p>
            <button
              onClick={() => navigate(`/class/${cls._id}`)}
              className="mt-auto bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              View Class
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopEnrolledClasses;
