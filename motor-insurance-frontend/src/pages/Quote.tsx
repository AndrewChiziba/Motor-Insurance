import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { type Vehicle } from "../services/Vehicle/api";
import type { QuoteBaseResponse } from "../services/Insurance/api";

const Quote = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const vehicle: Vehicle | undefined = location.state?.vehicle;
  const coverType: string | undefined = location.state?.coverType;
  const baseQuote: QuoteBaseResponse | undefined = location.state?.baseQuote;

  if (!vehicle || !baseQuote) {
    toast.error("Missing quote information!", { className: "toast-text", position: "top-center" });
    navigate("/search");
    return null;
  }

  const today = new Date();
  const startDate = today.toISOString().split("T")[0]; // yyyy-mm-dd

  const handleSelectQuarter = (quarters: number, price: number) => {
    toast.success(
      `Selected ${quarters} quarter(s) at ${baseQuote.currency} ${price.toFixed(2)}`,
      { className: "toast-text", position: "top-center" }
    );
    // 👉 next step: navigate to policy creation with selected plan
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
        <p><strong>Start Date:</strong> {startDate}</p>
      </div>

      {/* Quote Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((q) => {
          const months = q * 3;
          const price = baseQuote.basePremium * q; // simple scaling
          return (
            <div
              key={q}
              className="p-4 border rounded shadow bg-white flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-blue-600">
                  {q} Quarter{q > 1 && "s"}
                </h2>
                <p className="text-gray-600">Duration: {months} months</p>
                <p className="text-gray-800 font-bold mt-2">
                  {baseQuote.currency} {price.toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => handleSelectQuarter(q, price)}
                className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Select Plan
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Quote;
