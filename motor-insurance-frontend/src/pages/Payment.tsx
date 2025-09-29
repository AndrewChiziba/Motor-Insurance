import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { processPayment } from "../services/api/payment";

type PaymentMethod = "card" | "mobile";

interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
}

interface Policy {
  id: string;
  type: number; // 0 = Comprehensive, 1 = Third Party
  startDate: string;
  endDate: string;
  durationQuarters: number;
  amount: number;
  status: string;
  vehicleId: string;
  userId: string;
}

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { vehicle, policy } = location.state as {
    vehicle: Vehicle;
    policy: Policy;
  };

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Card inputs
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Mobile Money inputs
  const [phone, setPhone] = useState("");
  const [provider, setProvider] = useState("");

  const handleSelectMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setShowModal(true);
  };

  const handlePayment = async () => {
    try {
      const res = await processPayment({
        insurancePolicyId: policy.id,
        paymentMethod: paymentMethod === "card" ? "Card" : "MobileMoney",
      });

      const payment = res.data;

      if (payment.status === "Completed") {
        toast.success("Payment completed! Your policy has been activated.", {
          className: "toast-text",
          position: "top-center",
        });
      } else {
        toast.error("Payment not completed. Policy not activated.", {
          className: "toast-text",
          position: "top-center",
        });
      }

      navigate("/Search");
    } catch (err) {
      console.error(err);
      toast.error("Payment failed. Please try again.", {
        className: "toast-text",
        position: "top-center",
      });
    } finally {
      setShowModal(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Confirm Payment</h1>

      <p className="mb-2">
        Vehicle: {vehicle?.plateNumber} ({vehicle?.model})
      </p>
      <p className="mb-2">
        Policy Type: {policy?.type === 0 ? "Comprehensive" : "Third Party"}
      </p>
      <p className="mb-2">
        Start Date: {new Date(policy?.startDate).toLocaleDateString()}
      </p>
      <p className="mb-2">
        End Date: {new Date(policy?.endDate).toLocaleDateString()}
      </p>
      <p className="mb-4 font-semibold">Amount: {policy?.amount} ZMW</p>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full mb-3"
        onClick={() => handleSelectMethod("card")}
      >
        Pay by Card
      </button>

      <button
        className="bg-green-500 text-white px-4 py-2 rounded-lg w-full"
        onClick={() => handleSelectMethod("mobile")}
      >
        Pay by Mobile Money
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96">
            {paymentMethod === "card" ? (
              <>
                <h2 className="text-lg font-bold mb-2">Enter Card Details</h2>
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="border p-2 w-full rounded mb-2"
                />
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="border p-2 w-full rounded mb-2"
                />
                <input
                  type="password"
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="border p-2 w-full rounded mb-4"
                />
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold mb-2">Enter Mobile Money Details</h2>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border p-2 w-full rounded mb-2"
                />
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="border p-2 w-full rounded mb-4"
                >
                  <option value="">Select Provider</option>
                  <option value="MTN">MTN</option>
                  <option value="Airtel">Airtel</option>
                  <option value="Zamtel">Zamtel</option>
                </select>
              </>
            )}

            <div className="flex justify-between">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded-lg"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                onClick={handlePayment}
              >
                Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
