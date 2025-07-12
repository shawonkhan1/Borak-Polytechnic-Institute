import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Rating from "react-rating";
import Modal from "react-modal";

Modal.setAppElement("#root");

const MyEnrollClassDetails = () => {
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
      alert("Please enter submission text.");
      return;
    }
    try {
      await axiosSecure.post(`/assignments/${assignmentId}/submit`, {
        submissionText,
      });
      alert("Assignment submitted successfully!");
      setSubmissionTexts((prev) => ({ ...prev, [assignmentId]: "" }));
      const res = await axiosSecure.get(`/assignments?classId=${id}`);
      setAssignments(res.data);
    } catch (err) {
      alert("Failed to submit assignment.");
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
      alert("Please enter feedback description.");
      return;
    }
    if (rating === 0) {
      alert("Please provide a rating.");
      return;
    }
    try {
      setSubmitFeedbackLoading(true);
      await axiosSecure.post("/teaching-evaluations", {
        classId: id,
        description,
        rating,
      });
      alert("Feedback sent successfully!");
      setSubmitFeedbackLoading(false);
      closeModal();
    } catch (err) {
      alert("Failed to send feedback.");
      setSubmitFeedbackLoading(false);
    }
  };

  if (loading) return <p>Loading assignments...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="pt-6 md:pl-80 p-5 bg-gray-50 min-h-screen text-black">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap bg-blue-600 text-white px-6 py-3 rounded-md mb-6">
        <h2 className="text-xl font-semibold">Class Assignments</h2>
        <button
          onClick={openModal}
          className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-md hover:bg-yellow-300"
        >
          Teaching Evaluation Report (TER)
        </button>
      </div>

      {/* Assignment Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <div
            key={assignment._id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold mb-2">{assignment.title}</h3>
              <p className="text-sm mb-2">{assignment.description}</p>
              <p className="text-sm font-semibold mb-3">
                Deadline: {new Date(assignment.deadline).toLocaleDateString()}
              </p>
            </div>
            <div>
              <textarea
                rows="3"
                className="w-full p-2 border rounded-md mb-3"
                placeholder="Write your submission here..."
                value={submissionTexts[assignment._id] || ""}
                onChange={(e) =>
                  handleSubmissionChange(assignment._id, e.target.value)
                }
              />
              <button
                onClick={() => handleSubmitAssignment(assignment._id)}
                className="bg-green-600 w-full text-white py-2 rounded-md hover:bg-green-500 font-semibold"
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
          },
        }}
      >
        <h2 className="text-xl font-semibold mb-4">Teaching Evaluation Report</h2>
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
              submitFeedbackLoading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600"
            }`}
          >
            {submitFeedbackLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default MyEnrollClassDetails;
