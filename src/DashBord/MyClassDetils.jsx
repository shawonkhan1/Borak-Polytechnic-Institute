import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Loading from "../Share/Loading";

const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

const MyClassDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  const [classInfo, setClassInfo] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  console.log(enrollmentCount,"this is count problm");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // 🔁 Fetch everything
  const fetchClassDetails = async () => {
    setLoading(true);
    try {
      const classRes = await axiosSecure.get(`/classes/${id}`);
      setClassInfo(classRes.data);

      const enrollmentRes = await axiosSecure.get(`/enrollments/count?classId=${id}`);
      setEnrollmentCount(enrollmentRes.data.count || 0);

      const assignmentRes = await axiosSecure.get(`/assignments?classId=${id}`);
      const fetchedAssignments = assignmentRes.data;

      const assignmentsWithCounts = await Promise.all(
        fetchedAssignments.map(async (a) => {
          try {
            const res = await axiosSecure.get(`/submissions/count-by-assignment?assignmentId=${a._id}`);
            return { ...a, submissionCount: res.data.count || 0 };
          } catch {
            return { ...a, submissionCount: 0 };
          }
        })
      );

      setAssignments(assignmentsWithCounts);

      const totalSubmissions = assignmentsWithCounts.reduce((sum, a) => sum + a.submissionCount, 0);
      setSubmissionCount(totalSubmissions);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load class details", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassDetails();
  }, [id]);

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    reset();
  };

  const uploadImageToImgbb = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) return data.data.url;
    else throw new Error("Image upload failed");
  };

  const onSubmit = async (formData) => {
    try {
      let imageUrl = "";
      if (formData.image?.length > 0) {
        imageUrl = await uploadImageToImgbb(formData.image[0]);
      }

      const payload = {
        title: formData.title,
        deadline: formData.deadline,
        description: formData.description || "",
        image: imageUrl,
        classId: id,
        createdAt: new Date(),
      };

      const res = await axiosSecure.post("/assignments", payload);

      if (res.data.insertedId) {
        Swal.fire("Success", "Assignment added successfully", "success");
        closeModal();
        fetchClassDetails();
      } else {
        Swal.fire("Error", "Failed to add assignment", "error");
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  if (loading) return <Loading></Loading>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">{classInfo?.title}</h1>

      {/* Class Progress */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 ">📊 Class Progress</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 border rounded shadow bg-white">
            <h3 className="text-gray-700 font-medium">Total Enrollment</h3>
            <p className="text-3xl font-bold text-blue-600">{enrollmentCount}</p>
          </div>
          <div className="p-4 border rounded shadow bg-white">
            <h3 className="text-gray-700 font-medium">Total Assignments</h3>
            <p className="text-3xl font-bold text-green-600">{assignments.length}</p>
          </div>
          <div className="p-4 border rounded shadow bg-white">
            <h3 className="text-gray-700 font-medium">Total Submissions</h3>
            <p className="text-3xl font-bold text-purple-600">{submissionCount}</p>
          </div>
        </div>
      </section>

      {/* Assignment Cards */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold ">📚 Assignments</h2>
          <button
            onClick={openModal}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            ➕ Add Assignment
          </button>
        </div>

        {assignments.length === 0 ? (
          <p className="">No assignments available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((a) => (
              <div key={a._id} className="border rounded shadow p-4 bg-white">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{a.title}</h3>
                <p className="text-sm mb-2 text-black">
                  📅 Deadline:{" "}
                  <span className="font-medium">{new Date(a.deadline).toLocaleDateString()}</span>
                </p>
                {a.image && (
                  <img
                    src={a.image}
                    alt={a.title}
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                )}
                {a.description && (
                  <p className="text-sm  text-black mb-2">{a.description}</p>
                )}
                <p className="text-sm font-medium text-blue-600">
                  📤 Submissions: {a.submissionCount}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
      

      {/* Modal for New Assignment */}
      {modalOpen && (
        <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-2xl font-bold text-gray-700 hover:text-red-600"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4 text-black text-center">Add New Assignment</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" encType="multipart/form-data">
              <div>
                <label className="block mb-1 font-medium text-black">Assignment Title *</label>
                <input
                  type="text"
                  {...register("title", { required: "Title is required" })}
                  className="w-full border text-black rounded px-3 py-2"
                placeholder="Title"
                />
                {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block mb-1 text-black font-medium">Deadline *</label>
                <input
                  type="date"
                  {...register("deadline", {
                    required: "Deadline is required",
                    validate: (value) => {
                      const selected = new Date(value);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return selected >= today || "Deadline can't be in the past";
                    },
                  })}
                  className="w-full text-black border rounded px-3 py-2"
                />
                {errors.deadline && <p className="text-sm text-red-600">{errors.deadline.message}</p>}
              </div>

              <div>
                <label className="block mb-1 text-black font-medium">Description</label>
                <textarea
                  {...register("description")}
                  rows={3}
                  placeholder="Description"
                  className="w-full text-black border rounded px-3 py-2"
                ></textarea>
              </div>

              <div>
                <label className="block text-black mb-1 font-medium">Assignment Image *</label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("image", { required: "Image is required" })}
                  className="w-full text-black border rounded px-3 py-2"
                />
                {errors.image && <p className="text-sm text-red-600">{errors.image.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {isSubmitting ? <Loading></Loading> : "Add Assignment"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyClassDetails;
