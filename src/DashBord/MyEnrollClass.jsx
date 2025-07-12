import React, { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../AuthProvider/AuthProvider";
import { useNavigate } from "react-router";

const MyEnrollClass = () => {
  const { user } = useContext(AuthContext);
  const userEmail = user?.email;
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userEmail) return;

    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        setError(null);

        const enrollRes = await axiosSecure.get(
          `/enrollments?studentEmail=${encodeURIComponent(userEmail)}`
        );

        const classIds = enrollRes.data.map((enroll) => enroll.classId);

        if (classIds.length === 0) {
          setClasses([]);
          setLoading(false);
          return;
        }

        const classPromises = classIds.map((id) =>
          axiosSecure.get(`/classes/${id}`).then((res) => res.data)
        );

        const classesData = await Promise.all(classPromises);
        setClasses(classesData);

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch enrollments or classes:", err);
        setError("Failed to load data. Please try again.");
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [userEmail, axiosSecure]);

  if (!userEmail) {
    return <p>Please login to see your enrolled classes.</p>;
  }

  if (loading) {
    return <p>Loading your enrolled classes...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (classes.length === 0) {
    return <p>You have not enrolled in any classes yet.</p>;
  }

  const handleContinue = (classId) => {
    navigate(`/dashboard/myenroll-class/${classId}`);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "20px",
        padding: "20px",
      }}
    >
      {classes.map((cls) => (
        <div
          key={cls._id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            width: "320px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            textAlign: "center",
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2>{cls.title}</h2>
          <p>
            <strong>Name:</strong> {cls.name}
          </p>
          {cls.image && (
            <img
              src={cls.image}
              alt={cls.title}
              style={{ width: "100%", borderRadius: "8px", marginBottom: "15px" }}
            />
          )}
          <button
            onClick={() => handleContinue(cls._id)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Continue
          </button>
        </div>
      ))}
    </div>
  );
};

export default MyEnrollClass;
