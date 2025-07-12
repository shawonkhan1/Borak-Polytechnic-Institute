import React, { useState, useEffect } from "react";
import { FaUsers, FaChalkboardTeacher, FaBookOpen } from "react-icons/fa";
import useAxiosSecure from "../hooks/useAxiosSecure";

const SummarySection = () => {
  const axiosSecure = useAxiosSecure();

  const [summaryData, setSummaryData] = useState({
    users: 0,
    classes: 0,
    enrollments: 0,
  });

  useEffect(() => {
    // ✅ Load total users
    axiosSecure.get("/users")
      .then(res => {
        const usersCount = Array.isArray(res.data) ? res.data.length : 0;
        setSummaryData(prev => ({ ...prev, users: usersCount }));
      })
      .catch(err => {
        console.error("Failed to fetch users:", err);
      });

    // ✅ Load accepted classes only
    axiosSecure.get("/classes")
      .then(res => {
        const acceptedClasses = res.data?.filter(cls => cls.status === "accepted") || [];
        setSummaryData(prev => ({ ...prev, classes: acceptedClasses.length }));
      })
      .catch(err => {
        console.error("Failed to fetch classes:", err);
      });

    // ✅ Load total enrollments from new route
    axiosSecure.get("/enrollments/count-all")
      .then(res => {
        const enrollmentsCount = res.data?.count || 0;
        setSummaryData(prev => ({ ...prev, enrollments: enrollmentsCount }));
      })
      .catch(err => {
        console.error("Failed to fetch total enrollments count:", err);
      });

  }, [axiosSecure]);

  return (
    <section className="py-16 bg-white rounded-2xl">
      <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-12">

        {/* Summary Cards */}
        <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Users */}
          <div className="bg-blue-100 rounded-xl p-6 shadow text-center hover:shadow-lg transition">
            <FaUsers className="text-4xl mx-auto text-blue-600 mb-3" />
            <h3 className="text-xl font-bold text-blue-800">Total Users</h3>
            <p className="text-2xl font-semibold mt-1 text-blue-900">
              {summaryData.users.toLocaleString()}+
            </p>
          </div>

          {/* Accepted Classes */}
          <div className="bg-green-100 rounded-xl p-6 shadow text-center hover:shadow-lg transition">
            <FaChalkboardTeacher className="text-4xl mx-auto text-green-600 mb-3" />
            <h3 className="text-xl font-bold text-green-800">Accepted Classes</h3>
            <p className="text-2xl font-semibold mt-1 text-green-900">
              {summaryData.classes.toLocaleString()}+
            </p>
          </div>

          {/* Enrollments */}
          <div className="bg-yellow-100 rounded-xl p-6 shadow text-center hover:shadow-lg transition">
            <FaBookOpen className="text-4xl mx-auto text-yellow-600 mb-3" />
            <h3 className="text-xl font-bold text-yellow-800">Enrollments</h3>
            <p className="text-2xl font-semibold mt-1 text-yellow-900">
              {summaryData.enrollments.toLocaleString()}+
            </p>
          </div>
        </div>

        {/* Side Image */}
        <div className="w-full lg:w-1/3 flex justify-center">
          <img
            src="https://i.ibb.co/Csp8w4Qp/pexels-mart-production-8472795.jpg"
            alt="Study Group"
            className="w-full max-w-sm rounded-xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default SummarySection;
