import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";

const AddEventForm = () => {
  const { register, handleSubmit, reset } = useForm();
  const axiosSecure = useAxiosSecure(); // secured axios

  const onSubmit = async (data) => {
    try {
      const res = await axiosSecure.post("/events", data);
      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Event Added Successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        reset();
      }
    } catch (err) {
      console.error("Error adding event:", err);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Please try again later.",
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto my-10 bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Add New Event
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Event Title
          </label>
          <input
            type="text"
            {...register("title", { required: true })}
            className="w-full text-black border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-primary"
            placeholder="Enter event title"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Event Date
          </label>
          <input
            type="date"
            {...register("date", { required: true })}
            className="w-full text-black border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-primary"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Description
          </label>
          <textarea
            {...register("description", { required: true })}
            rows="4"
            className="w-full border text-black border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-primary"
            placeholder="Enter event description"
          ></textarea>
        </div>

        {/* Submit */}
       <div className="flex justify-center"> 
         <button
          type="submit"
          className="bg-blue-600 text-white font-medium py-2 px-6 rounded hover:bg-blue-600 transition"
        >
          Submit Event
        </button>
       </div>
      </form>
    </div>
  );
};

export default AddEventForm;
