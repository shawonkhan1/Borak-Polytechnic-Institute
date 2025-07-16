import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Rating from "react-rating";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { AuthContext } from "../AuthProvider/AuthProvider";
import Loading from "../Share/Loading";

Modal.setAppElement("#root");

const MyEnrollClassDetails = () => {
  const { user } = useContext(AuthContext);
  const email = user?.email;
  const name = user?.displayName;
  const photo = user?.photoURL;
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [submitFeedbackLoading, setSubmitFeedbackLoading] = useState(false);
  const [submissionTexts, setSubmissionTexts] = useState({});

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosSecure.get(`/assignments?classId=${id}`);
        setAssignments(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load assignments.");
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [id, axiosSecure]);

  const handleSubmissionChange = (assignmentId, value) => {
    setSubmissionTexts((prev) => ({ ...prev, [assignmentId]: value }));
  };

  const handleSubmitAssignment = async (assignmentId) => {
    const submissionText = submissionTexts[assignmentId];
    if (!submissionText || submissionText.trim() === "") {
      toast.error("Please enter submission text.");
      return;
    }
    try {
      await axiosSecure.post(`/assignments/${assignmentId}/submit`, {
        submissionText,
      });
      toast.success("Assignment submitted successfully!");
      setSubmissionTexts((prev) => ({ ...prev, [assignmentId]: "" }));
      const res = await axiosSecure.get(`/assignments?classId=${id}`);
      setAssignments(res.data);
    } catch (err) {
      toast.error("Failed to submit assignment.");
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setDescription("");
    setRating(0);
  };

  const handleSendFeedback = async () => {
    if (!description.trim()) {
      toast.error("Please enter feedback description.");
      return;
    }
    if (rating === 0) {
      toast.error("Please provide a rating.");
      return;
    }
    try {
      setSubmitFeedbackLoading(true);
      await axiosSecure.post("/teaching-evaluations", {
        name,
        email,
        photo,
        classId: id,
        description,
        rating,
      });
      toast.success("Feedback sent successfully!");
      setSubmitFeedbackLoading(false);
      closeModal();
    } catch (err) {
      toast.error("Failed to send feedback.");
      setSubmitFeedbackLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error)
    return <p className="text-center mt-10 text-red-500 font-semibold">{error}</p>;

  return (
    <div className="pt-6 px-4 md:px-6 lg:px-12 min-h-screen text-black">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-blue-600 text-white px-6 py-4 rounded-md mb-6 gap-4">
        <h2 className="text-xl font-bold">Class Assignments</h2>
        <button
          onClick={openModal}
          className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-md hover:bg-yellow-300 transition"
        >
          Teaching Evaluation Report (TER)
        </button>
      </div>

      {/* Assignment Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <div
            key={assignment._id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold mb-2 text-blue-700">
                {assignment.title}
              </h3>
              <p className="text-sm text-gray-700 mb-2">
                {assignment.description}
              </p>
              <p className="text-sm font-medium mb-3 text-gray-600">
                Deadline:{" "}
                {new Date(assignment.deadline).toLocaleDateString()}
              </p>
            </div>
            <div>
              <textarea
                rows="3"
                className="w-full p-2 border border-gray-300 rounded-md mb-3 resize-none"
                placeholder="Write your submission here..."
                value={submissionTexts[assignment._id] || ""}
                onChange={(e) =>
                  handleSubmissionChange(assignment._id, e.target.value)
                }
              />
              <button
                onClick={() => handleSubmitAssignment(assignment._id)}
                className="bg-blue-600 w-full text-white py-2 rounded-md hover:bg-blue-500 font-semibold transition"
              >
                Submit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Teaching Evaluation Report"
        style={{
          content: {
            maxWidth: "480px",
            margin: "auto",
            borderRadius: "10px",
            padding: "20px",
            color: "#000",
          },
          overlay: {
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1000,
          },
        }}
      >
        <h2 className="text-xl text-blue-600 font-semibold mb-4">
          Teaching Evaluation Report
        </h2>
        <div className="mb-4">
          <label className="block font-medium mb-1">Description:</label>
          <textarea
            rows="4"
            className="w-full p-2 border rounded-md"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Rating:</label>
          <Rating
            initialRating={rating}
            onChange={setRating}
            emptySymbol={<span className="text-3xl text-gray-300">☆</span>}
            fullSymbol={<span className="text-3xl text-yellow-400">★</span>}
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={closeModal}
            className="bg-gray-400 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSendFeedback}
            disabled={submitFeedbackLoading}
            className={`px-4 py-2 rounded-md text-white ${
              submitFeedbackLoading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } transition`}
          >
            {submitFeedbackLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default MyEnrollClassDetails;
