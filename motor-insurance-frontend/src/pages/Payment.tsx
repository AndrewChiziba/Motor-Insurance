// import { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { processPayment } from "../services/api/payment";

// type PaymentMethod = "card" | "mobile";

// interface Vehicle {
//   id: string;
//   registrationNumber: string;
//   model: string;
// }

// interface Policy {
//   id: string;
//   type: number; // 0 = Comprehensive, 1 = Third Party
//   startDate: string;
//   endDate: string;
//   durationQuarters: number;
//   amount: number;
//   status: string;
//   vehicleId: string;
//   userId: string;
// }

// export default function PaymentPage() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { vehicle, policy } = location.state as {
//     vehicle: Vehicle;
//     policy: Policy;
//   };

//   const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
//   const [showModal, setShowModal] = useState(false);

//   // Card inputs
//   const [cardNumber, setCardNumber] = useState("");
//   const [expiry, setExpiry] = useState("");
//   const [cvv, setCvv] = useState("");

//   // Mobile Money inputs
//   const [phone, setPhone] = useState("");
//   const [provider, setProvider] = useState("");

//   const handleSelectMethod = (method: PaymentMethod) => {
//     setPaymentMethod(method);
//     setShowModal(true);
//   };

//   const handlePayment = async () => {
//     try {
//       const res = await processPayment({
//         insurancePolicyId: policy.id,
//         paymentMethod: paymentMethod === "card" ? "Card" : "MobileMoney",
//       });

//       const payment = res.data;

//       if (payment.status === "Completed") {
//         toast.success("Payment completed! Your policy has been activated.", {
//           className: "toast-text",
//           position: "top-center",
//         });
//       } else {
//         toast.error("Payment not completed. Policy not activated.", {
//           className: "toast-text",
//           position: "top-center",
//         });
//       }

//       navigate("/Search");
//     } catch (err) {
//       console.error(err);
//       toast.error("Payment failed. Please try again.", {
//         className: "toast-text",
//         position: "top-center",
//       });
//     } finally {
//       setShowModal(false);
//     }
//   };

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <h1 className="text-2xl font-bold text-blue-600 mb-4">
//         Payment
//       </h1>
//       {/* new */}
//       <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 mb-6">
//         {/* Payment details*/}
//         <h2 className="font-semibold text-lg text-blue-600 mb-4">Details</h2>
//         <div className="grid grid-cols-1 gap-4 mb-4">
//           <div>
//             <p className="text-sm text-gray-600">Hello <span className="font-medium">{localStorage.getItem("fullName")}</span>, complete your <span className="font-medium">{policy?.type === 0 ? "Comprehensive" : "Third Party"}</span> insurance policy purchase for vehicle with registration number <span className="font-medium">{vehicle?.registrationNumber} </span> by paying  <span className="font-medium">{policy?.amount} ZMW.</span></p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-600">This policy will be active from <span className="font-medium"> {new Date(policy?.startDate).toLocaleDateString()}</span> to  <span className="font-medium">{new Date(policy?.endDate).toLocaleDateString()}</span></p>
//           </div>
//         </div>

//       </div>
//       <button
//         className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full mb-3"
//         onClick={() => handleSelectMethod("card")}
//       >
//         Pay by Card
//       </button>

//       <button
//         className="bg-green-500 text-white px-4 py-2 rounded-lg w-full"
//         onClick={() => handleSelectMethod("mobile")}
//       >
//         Pay by Mobile Money
//       </button>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-xl w-96">
//             {paymentMethod === "card" ? (
//               <>
//                 <h2 className="text-lg font-bold mb-2">Enter Card Details</h2>
//                 <input
//                   type="text"
//                   placeholder="Card Number"
//                   value={cardNumber}
//                   onChange={(e) => setCardNumber(e.target.value)}
//                   className="border p-2 w-full rounded mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//                 <input
//                   type="text"
//                   placeholder="MM/YY"
//                   value={expiry}
//                   onChange={(e) => setExpiry(e.target.value)}
//                   className="border p-2 w-full rounded mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//                 <input
//                   type="password"
//                   placeholder="CVV"
//                   value={cvv}
//                   onChange={(e) => setCvv(e.target.value)}
//                   className="border p-2 w-full rounded mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </>
//             ) : (
//               <>
//                 <h2 className="text-lg font-bold mb-2">Enter Mobile Money Details</h2>
//                 <input
//                   type="tel"
//                   placeholder="Phone Number"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   className="border p-2 w-full rounded mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//                 <select
//                   value={provider}
//                   onChange={(e) => setProvider(e.target.value)}
//                   className="border p-2 w-full rounded mb-4"
//                 >
//                   <option value="">Select Provider</option>
//                   <option value="MTN">MTN</option>
//                   <option value="Airtel">Airtel</option>
//                   <option value="Zamtel">Zamtel</option>
//                 </select>
//               </>
//             )}

//             <div className="flex justify-between">
//               <button
//                 className="bg-gray-400 text-white px-4 py-2 rounded-lg"
//                 onClick={() => setShowModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg"
//                 onClick={handlePayment}
//               >
//                 Pay
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { processPayment } from "../services/api/payment";

type PaymentMethod = "card" | "mobile";

interface Vehicle {
  id: string;
  registrationNumber: string;
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

  // Validation functions
  const isCardFormValid = () => {
    return cardNumber.trim().length > 0 && 
           expiry.trim().length > 0 && 
           cvv.trim().length > 0;
  };

  const isMobileFormValid = () => {
    return phone.trim().length > 0 && 
           provider.trim().length > 0;
  };

  const canProceedWithPayment = () => {
    if (paymentMethod === "card") {
      return isCardFormValid();
    } else if (paymentMethod === "mobile") {
      return isMobileFormValid();
    }
    return false;
  };

  // Input handlers for numbers only
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    setCardNumber(value);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    setExpiry(value);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    setCvv(value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    setPhone(value);
  };

  const handlePayment = async () => {
    if (!canProceedWithPayment()) {
      toast.error("Please fill in all payment details", {
        className: "toast-text",
        position: "top-center",
      });
      return;
    }

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
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">
        Payment
      </h1>
      {/* new */}
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 mb-6">
        {/* Payment details*/}
        <h2 className="font-semibold text-lg text-blue-600 mb-4">Details</h2>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Hello <span className="font-medium">{localStorage.getItem("fullName")}</span>, complete your <span className="font-medium">{policy?.type === 0 ? "Comprehensive" : "Third Party"}</span> insurance policy purchase for vehicle with registration number <span className="font-medium">{vehicle?.registrationNumber} </span> by paying  <span className="font-medium">{policy?.amount} ZMW.</span></p>
          </div>
          <div>
            <p className="text-sm text-gray-600">This policy will be active from <span className="font-medium"> {new Date(policy?.startDate).toLocaleDateString()}</span> to  <span className="font-medium">{new Date(policy?.endDate).toLocaleDateString()}</span></p>
          </div>
        </div>

      </div>
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
                <h2 className="text-lg font-bold mb-4">Enter Card Details</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={16}
                      className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry (MMYY)
                      </label>
                      <input
                        type="text"
                        placeholder="MMYY"
                        value={expiry}
                        onChange={handleExpiryChange}
                        maxLength={4}
                        className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        placeholder="123"
                        value={cvv}
                        onChange={handleCvvChange}
                        maxLength={4}
                        className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold mb-4">Enter Mobile Money Details</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="0961234567"
                      value={phone}
                      onChange={handlePhoneChange}
                      maxLength={10}
                      className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Provider
                    </label>
                    <select
                      value={provider}
                      onChange={(e) => setProvider(e.target.value)}
                      className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Provider</option>
                      <option value="MTN">MTN</option>
                      <option value="Airtel">Airtel</option>
                      <option value="Zamtel">Zamtel</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-between mt-6">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded-lg transition-colors ${
                  canProceedWithPayment() 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                onClick={handlePayment}
                disabled={!canProceedWithPayment()}
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