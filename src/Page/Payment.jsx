import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import { useParams } from "react-router";
import PaymentForm from "./PaymentForm";

const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_KEY);
const Payment = () => {
  const { id } = useParams();


  return (
    <Elements stripe={stripePromise}>
      <PaymentForm id={id}></PaymentForm>
    </Elements>
  );
};

export default Payment;
