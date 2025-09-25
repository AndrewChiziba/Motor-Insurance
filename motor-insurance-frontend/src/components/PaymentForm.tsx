import React, { useState } from "react";
import { processPaymentApi } from "../services/api";
import type { CreatePaymentDto } from "../types/type";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface PaymentFormProps {
  policyId: string;
  amount: number;
  onSuccess: () => void;
}

export const PaymentForm = ({ policyId, amount, onSuccess }: PaymentFormProps) => {
  const [method, setMethod] = useState<"Card" | "MobileMoney">("Card");
  const [mobileNumber, setMobileNumber] = useState("");
  const [operator, setOperator] = useState<"MTN" | "Airtel" | "Vodacom">("MTN");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const paymentData: CreatePaymentDto = {
      policyId,
      method,
    };

    try {
      if (method === "MobileMoney" && !mobileNumber) {
        toast.error("Mobile number is required for Mobile Money payment.");
        return;
      }
      if (method === "Card" && (!cardNumber || !expiry || !cvv)) {
        toast.error("All card details are required.");
        return;
      }

      await processPaymentApi(paymentData);
      toast.success("Payment processed successfully!");
      onSuccess();
    } catch{
      toast.error("Failed to process payment. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-primary mb-4">Payment Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as "Card" | "MobileMoney")}
          className="w-full p-2 border rounded"
        >
          <option value="Card">Credit/Debit Card</option>
          <option value="MobileMoney">Mobile Money</option>
        </select>

        {method === "MobileMoney" && (
          <>
            <input
              type="text"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <select
              value={operator}
              onChange={(e) => setOperator(e.target.value as "MTN" | "Airtel" | "Vodacom")}
              className="w-full p-2 border rounded"
            >
              <option value="MTN">MTN</option>
              <option value="Airtel">Airtel</option>
              <option value="Vodacom">Vodacom</option>
            </select>
          </>
        )}

        {method === "Card" && (
          <>
            <input
              type="text"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Expiry (MM/YY)"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="CVV"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </>
        )}

        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded hover:bg-opacity-90"
        >
          Pay ${amount}
        </button>
      </form>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};