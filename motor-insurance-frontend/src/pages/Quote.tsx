// export default Quote;
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { Vehicle } from "../services/api/vehicle";
import type { QuoteBaseResponse } from "../services/api/insurance";

const Quote = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const vehicle: Vehicle | undefined = location.state?.vehicle;
  const coverType: string | undefined = location.state?.coverType;
  const baseQuote: QuoteBaseResponse | undefined = location.state?.baseQuote;

  if (!vehicle || !baseQuote) {
    toast.error("Missing quote information!", {
      className: "toast-text",
      position: "top-center",
    });
    navigate("/search");
    return null;
  }

  const handleSelectQuarter = (
    quarters: number,
    price: number,
    startDate: string,
    endDate: string
  ) => {
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
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Insurance Quote</h1>
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 mb-6">
          <h2 className="font-semibold text-lg text-blue-600 mb-4">Vehicle Details</h2>
          {/* Vehicle details*/}
          <div className="grid grid-cols-3 gap-4 mb-0">
            <div>
              <p className="text-sm text-gray-600">Registration: <span className="font-medium">{vehicle.registrationNumber}</span></p>
             
            </div>
            <div>
              <p className="text-sm text-gray-600">Make: <span className="font-medium">{vehicle.make}</span></p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Model: <span className="font-medium">{vehicle.model}</span></p>
             
            </div>
              <div>
              <p className="text-sm text-gray-600">Colour: <span className="font-medium">{vehicle.colour}</span></p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Year of Manufacture: <span className="font-medium">{vehicle.year}</span> </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Type: <span className="font-medium">{vehicle.type === 0 ? "Private" : "Commercial"}</span> </p>
            </div>
          </div>
      </div>

      {/* Quote Options */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
                {q.quarters * 3} months
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
    </div>
  );
};

export default Quote;
// import { useLocation, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import type { Vehicle } from "../services/api/vehicle";
// import type { QuoteBaseResponse } from "../services/api/insurance";

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

//   const handleSelectQuarter = (
//     quarters: number,
//     price: number,
//     startDate: string,
//     endDate: string
//   ) => {
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
//     <div className="p-6 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold text-blue-600 mb-6">Insurance Quote</h1>
      
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Vehicle Details - Left Side */}
//         <div className="lg:col-span-1">
//           <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
//             <h2 className="font-semibold text-lg text-blue-600 mb-3">Vehicle Details</h2>
//             <div className="space-y-3">
//               <div>
//                 <p className="text-sm text-gray-600">Registration</p>
//                 <p className="font-medium">{vehicle.registrationNumber}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">Make & Model</p>
//                 <p className="font-medium">{vehicle.make} {vehicle.model}</p>
//               </div>
//               {vehicle.color && (
//                 <div>
//                   <p className="text-sm text-gray-600">Color</p>
//                   <p className="font-medium">{vehicle.color}</p>
//                 </div>
//               )}
//               <div>
//                 <p className="text-sm text-gray-600">Year</p>
//                 <p className="font-medium">{vehicle.year}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">Type</p>
//                 <p className="font-medium">{vehicle.type === 0 ? "Private" : "Commercial"}</p>
//               </div>
//               {coverType && (
//                 <div>
//                   <p className="text-sm text-gray-600">Cover Type</p>
//                   <p className="font-medium">{coverType}</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Quote Options - Right Side */}
//         <div className="lg:col-span-2">
//           <div className="p-4 border border-gray-200 rounded-lg bg-white">
//             <h2 className="font-semibold text-lg text-blue-600 mb-4">Available Plans</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//               {baseQuote.quotes.map((q) => (
//                 <div
//                   key={q.quarters}
//                   className="p-3 border border-gray-300 rounded-lg bg-white hover:shadow-md transition-shadow"
//                 >
//                   <div className="text-center mb-3">
//                     <h3 className="text-lg font-bold text-blue-600">
//                       {q.quarters} Quarter{q.quarters > 1 && "s"}
//                     </h3>
//                     <p className="text-xs text-gray-600">
//                       {q.quarters * 3} months
//                     </p>
//                   </div>
                  
//                   <div className="space-y-1 text-xs mb-3">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Start:</span>
//                       <span className="font-medium">{new Date(q.startDate).toLocaleDateString()}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">End:</span>
//                       <span className="font-medium">{new Date(q.endDate).toLocaleDateString()}</span>
//                     </div>
//                   </div>
                  
//                   <div className="text-center mb-3">
//                     <p className="font-medium">
//                       K{q.amount.toFixed(2)}
//                     </p>
//                   </div>
                  
//                   <button
//                     onClick={() =>
//                       handleSelectQuarter(q.quarters, q.amount, q.startDate, q.endDate)
//                     }
//                     className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors text-sm font-medium"
//                   >
//                     Select Plan
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Quote;
