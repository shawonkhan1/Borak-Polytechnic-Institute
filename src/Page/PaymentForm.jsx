import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useEffect, useState, useContext } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { AuthContext } from "../AuthProvider/AuthProvider";
 // 🔁 ইউজার তথ্য

const PaymentForm = ({ id }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext); // 🔁 ইউজার কনটেক্সট থেকে ইমেইল

  const [classData, setClassData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await axiosSecure.get(`/classes/${id}`);
        setClassData(res.data);

        const paymentIntent = await axiosSecure.post("/create-payment-intent", {
          price: res.data.price,
        });
        setClientSecret(paymentIntent.data.clientSecret);
      } catch (err) {
        console.error("Failed to fetch class data", err);
        setError("Failed to load class information.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchClass();
  }, [id, axiosSecure]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (methodError) {
      setError(methodError.message);
      setProcessing(false);
      return;
    }

    setError("");

    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.id,
    });

    if (confirmError) {
      setError(confirmError.message);
    } else {
      console.log("✅ Payment Successful:", paymentIntent);

      try {
        const response = await axiosSecure.post("/enrollments", {
          classId: id,
          studentEmail: user?.email,
        });

        if (response.data?.insertedId) {
          Swal.fire({
            title: "Payment Successful!",
            text: "You are now enrolled in this class.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else if (response.data?.message === "Already enrolled") {
          Swal.fire({
            title: "Already Enrolled",
            text: "You are already enrolled in this class.",
            icon: "info",
            confirmButtonText: "OK",
          });
        } else {
          Swal.fire({
            title: "Enrollment Error",
            text: "Payment done but enrollment failed.",
            icon: "error",
          });
        }
      } catch (enrollErr) {
        console.error("Enrollment error:", enrollErr);
        Swal.fire({
          title: "Server Error",
          text: "Payment done but something went wrong while saving enrollment.",
          icon: "error",
        });
      }
    }

    setProcessing(false);
  };

  if (loading) return <p className="text-center mt-10">Loading class data...</p>;
  if (!classData) return <p className="text-center mt-10">No class found.</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl text-black font-semibold mb-4 text-center">{classData.title}</h2>
      <p className="text-center text-gray-600 mb-2">Instructor: {classData.name}</p>
      <p className="text-center text-black font-bold mb-4">Amount: ৳{classData.price}</p>

      <form onSubmit={handleSubmit}>
        <CardElement className="p-3 border rounded mb-4" />
        <button
          className="btn w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          type="submit"
          disabled={!stripe || !clientSecret || processing}
        >
          {processing ? "Processing..." : `Pay ৳${classData.price}`}
        </button>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
