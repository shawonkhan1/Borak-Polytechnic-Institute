import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useEffect, useState, useContext } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { AuthContext } from "../AuthProvider/AuthProvider";
import { useNavigate } from "react-router";
import Loading from "../Share/Loading";

const PaymentForm = ({ id }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [classData, setClassData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [role, setRole] = useState(null); 

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

  //  fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await axiosSecure.get(`/users?email=${user?.email}`);
        setRole(res?.data?.[0]?.role || null);
      } catch (err) {
        console.error("Error fetching user role", err);
      }
    };

    if (user?.email) fetchUserRole();
  }, [user?.email, axiosSecure]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setProcessing(true);

  //   if (role !== "student") {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "Permission Denied",
  //       text: "Only students can enroll in this class.",
      
  //     });
  //     setProcessing(false);
  //     return navigate('/');
  //   }

  //   if (!stripe || !elements) return;

  //   const card = elements.getElement(CardElement);
  //   if (!card) return;

  //   const { error: methodError, paymentMethod } =
  //     await stripe.createPaymentMethod({
  //       type: "card",
  //       card,
  //     });

  //   if (methodError) {
  //     setError(methodError.message);
  //     setProcessing(false);
  //     return;
  //   }

  //   setError("");

  //   const { paymentIntent, error: confirmError } =
  //     await stripe.confirmCardPayment(clientSecret, {
  //       payment_method: paymentMethod.id,
  //     });

  //   if (confirmError) {
  //     setError(confirmError.message);
  //   } else {
  //     console.log(" Payment Successful:", paymentIntent);

  //     try {


  //       const response = await axiosSecure.post("/enrollments", {
  //         classId: id,
  //         studentEmail: user?.email,
  //       });

  //       if (response.data?.insertedId) {
  //         Swal.fire({
  //           title: "Payment Successful!",
  //           text: "You are now enrolled in this class.",
  //           icon: "success",
  //           confirmButtonText: "OK",
  //         }).then(() => {
  //           navigate("/dashboard/my-enroll-class");
  //         });
  //       } else if (response.data?.message === "Already enrolled") {
  //         Swal.fire({
  //           title: "Already Enrolled",
  //           text: "You are already enrolled in this class.",
  //           icon: "info",
  //           confirmButtonText: "OK",
  //         });
  //       } else {
  //         Swal.fire({
  //           title: "Enrollment Error",
  //           text: "Payment done but enrollment failed.",
  //           icon: "error",
  //         });
  //       }
  //     } catch (enrollErr) {
  //       console.error("Enrollment error:", enrollErr);
  //       Swal.fire({
  //         title: "Server Error",
  //         text: "Payment done but something went wrong while saving enrollment.",
  //         icon: "error",
  //       });
  //     }
  //   }

  //   setProcessing(false);
  // };
  
  const handleSubmit = async (e) => {
  e.preventDefault();
  setProcessing(true);

  if (role !== "student") {
    Swal.fire({
      icon: "warning",
      title: "Permission Denied",
      text: "Only students can enroll in this class.",
    });
    setProcessing(false);
    return navigate("/");
  }

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
    console.log("Payment Successful:", paymentIntent);

    try {
      // পেমেন্ট ডাটা তৈরি
      const paymentData = {
        classId: id,
        studentEmail: user?.email,
        amount: paymentIntent.amount / 100, // স্ট্রাইপ amount সেন্টে থাকে
        transactionId: paymentIntent.id,
        status: paymentIntent.status,
        paymentMethod: paymentIntent.payment_method_types[0],
        createdAt: new Date(),
      };

      // পেমেন্ট ডাটা আলাদা কালেকশনে সেভ করার API কল
      const paymentResponse = await axiosSecure.post("/payments", paymentData);

      if (!paymentResponse.data.insertedId) {
        Swal.fire({
          title: "Payment Data Save Error",
          text: "Payment was successful but failed to save payment data.",
          icon: "error",
        });
      }

      // এরপর এনরোলমেন্টের API কল
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
        }).then(() => {
          navigate("/dashboard/my-enroll-class");
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
    } catch (error) {
      console.error("Error during payment or enrollment:", error);
      Swal.fire({
        title: "Server Error",
        text: "Payment done but something went wrong on the server.",
        icon: "error",
      });
    }
  }

  setProcessing(false);
};


  if (loading)
    return <Loading></Loading>
  if (!classData) return <p className="text-center mt-10">No class found.</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl text-black font-semibold mb-4 text-center">
        {classData.title}
      </h2>
      <p className="text-center text-gray-600 mb-2">
        Instructor: {classData.name}
      </p>
      <p className="text-center text-black font-bold mb-4">
        Amount: ৳{classData.price}
      </p>

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
