// import { useLocation, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import type { Vehicle } from "../services/Vehicle/api";
// import type { QuoteBaseResponse } from "../services/Insurance/api";

// const Quote = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const vehicle: Vehicle | undefined = location.state?.vehicle;
//   const coverType: string | undefined = location.state?.coverType;
//   const baseQuote: QuoteBaseResponse | undefined = location.state?.baseQuote;

//   if (!vehicle || !baseQuote) {
//     toast.error("Missing quote information!", {
//       className: "toast-text",
//       position: "top-center",
//     });
//     navigate("/search");
//     return null;
//   }

//   const handleSelectQuarter = (quarters: number, price: number, startDate: string, endDate: string) => {
//     toast.success(
//       `Selected ${quarters} quarter(s) at ${price.toFixed(2)}`,
//       { className: "toast-text", position: "top-center" }
//     );

//     // pass plan to policy creation
//     navigate("/createpolicy", {
//       state: {
//         vehicle,
//         coverType,
//         quarters,
//         price,
//         startDate,
//         endDate,
//       },
//     });
//   };

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <h1 className="text-2xl font-bold text-blue-600 mb-4">Insurance Quote</h1>

//       {/* Vehicle & Cover Info */}
//       <div className="p-4 border rounded bg-gray-50 mb-6">
//         <h2 className="font-semibold text-lg text-blue-600">Vehicle</h2>
//         <p><strong>Reg:</strong> {vehicle.registrationNumber}</p>
//         <p><strong>Make/Model:</strong> {vehicle.make} {vehicle.model}</p>
//         <p><strong>Year:</strong> {vehicle.year}</p>
//         <p><strong>Type:</strong> {vehicle.type === 0 ? "Private" : "Commercial"}</p>
//         <p><strong>Cover Type:</strong> {coverType}</p>
//       </div>

//       {/* Quote Options */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {baseQuote.quotes.map((q) => (
//           <div
//             key={q.quarters}
//             className="p-4 border rounded shadow bg-white flex flex-col justify-between"
//           >
//             <div>
//               <h2 className="text-xl font-semibold text-blue-600">
//                 {q.quarters} Quarter{q.quarters > 1 && "s"}
//               </h2>
//               <p className="text-gray-600">
//                 Duration: {q.quarters * 3} months
//               </p>
//               <p className="text-gray-600">
//                 Start: {new Date(q.startDate).toLocaleDateString()}
//               </p>
//               <p className="text-gray-600">
//                 End: {new Date(q.endDate).toLocaleDateString()}
//               </p>
//               <p className="text-gray-800 font-bold mt-2">
//                 {q.amount.toFixed(2)}
//               </p>
//             </div>
//             <button
//               onClick={() => handleSelectQuarter(q.quarters, q.amount, q.startDate, q.endDate)}
//               className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
//             >
//               Select Plan
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Quote;
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import type { Vehicle } from "../services/api/vehicle";
import type { QuoteBaseResponse, ActivePolicyResponse } from "../services/api/insurance";
import { checkActivePolicy } from "../services/api/insurance";

const Quote = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const vehicle: Vehicle | undefined = location.state?.vehicle;
  const coverType: string | undefined = location.state?.coverType;
  const baseQuote: QuoteBaseResponse | undefined = location.state?.baseQuote;

  const [showModal, setShowModal] = useState(false);
  const [activePolicy, setActivePolicy] = useState<ActivePolicyResponse | null>(null);

  interface PendingPlan {
  quarters: number;
  price: number;
  startDate: string;
  endDate: string;
}

  // const [pendingPlan, setPendingPlan] = useState<any>(null);
  const [pendingPlan, setPendingPlan] = useState<PendingPlan | null>(null);


  if (!vehicle || !baseQuote) {
    toast.error("Missing quote information!", {
      className: "toast-text",
      position: "top-center",
    });
    navigate("/search");
    return null;
  }

  const handleSelectQuarter = async (quarters: number, price: number, startDate: string, endDate: string) => {
    try {
      const res = await checkActivePolicy(vehicle.id as string);

      if (res.data.hasActive) {
        // 🚨 show warning modal instead of immediate navigation
        setActivePolicy(res.data);
        setPendingPlan({ quarters, price, startDate, endDate });
        setShowModal(true);
        return;
      }

      //  safe to proceed
      navigate("/createpolicy", {
        state: {
          vehicle,
          coverType,
          quarters,
          price,
          startDate,
          endDate,
        },
      });
    } catch {
      toast.error("Failed to check active policy", {
        className: "toast-text",
        position: "top-center",
      });
    }
  };

  const proceedAnyway = () => {
    if (!pendingPlan) return;
    setShowModal(false);
    navigate("/createpolicy", {
      state: {
        vehicle,
        coverType,
        ...pendingPlan,
      },
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Insurance Quote</h1>

      {/* Vehicle & Cover Info */}
      <div className="p-4 border rounded bg-gray-50 mb-6">
        <h2 className="font-semibold text-lg text-blue-600">Vehicle</h2>
        <p><strong>Reg:</strong> {vehicle.registrationNumber}</p>
        <p><strong>Make/Model:</strong> {vehicle.make} {vehicle.model}</p>
        <p><strong>Year:</strong> {vehicle.year}</p>
        <p><strong>Type:</strong> {vehicle.type === 0 ? "Private" : "Commercial"}</p>
        <p><strong>Cover Type:</strong> {coverType}</p>
      </div>

      {/* Quote Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {baseQuote.quotes.map((q) => (
          <div
            key={q.quarters}
            className="p-4 border rounded shadow bg-white flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold text-blue-600">
                {q.quarters} Quarter{q.quarters > 1 && "s"}
              </h2>
              <p className="text-gray-600">
                Duration: {q.quarters * 3} months
              </p>
              <p className="text-gray-600">
                Start: {new Date(q.startDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                End: {new Date(q.endDate).toLocaleDateString()}
              </p>
              <p className="text-gray-800 font-bold mt-2">
                {q.amount.toFixed(2)}
              </p>
            </div>
            <button
              onClick={() =>
                handleSelectQuarter(q.quarters, q.amount, q.startDate, q.endDate)
              }
              className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>

      {/* Active Policy Warning Modal */}
      {showModal && activePolicy && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h2 className="text-xl font-bold text-red-600 mb-4">Warning!</h2>
            <p>
              This vehicle already has an active{" "}
              <strong>
                {activePolicy.type === 0 ? "Comprehensive" : "Third Party"}
              </strong>{" "}
              policy.
            </p>
            <p><strong>Start:</strong> {new Date(activePolicy.startDate as string).toLocaleDateString()}</p>
            <p><strong>End:</strong> {new Date(activePolicy.endDate as string).toLocaleDateString()}</p>
            <p className="text-gray-700 mt-2">
              Do you still want to create a new policy (overlap allowed)?
            </p>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={proceedAnyway}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Continue Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quote;
