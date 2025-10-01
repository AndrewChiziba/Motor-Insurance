import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { getBaseQuote, type QuoteRequest, type QuoteBaseResponse } from "../services/api/insurance";
import type { Vehicle } from "../services/api/vehicle";

const CoverType = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const vehicle: Vehicle | undefined = location.state?.vehicle;

  const [coverType, setCoverType] = useState<"Comprehensive" | "ThirdParty">("Comprehensive");

  if (!vehicle) {
    toast.error("No vehicle selected!", { className: "toast-text", position: "top-center" });
    navigate("/search");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: QuoteRequest = {
      vehicleId: vehicle.id || "",
      insuranceType: coverType === "Comprehensive" ? 0 : 1,
    };

    try {
      const res = await getBaseQuote(payload);
      const baseQuote: QuoteBaseResponse = res.data;

      toast.success("Base quote retrieved!", { className: "toast-text", position: "top-center" });

      navigate("/quote", {
        state: {
          vehicle,
          coverType,
          baseQuote,
        },
      });
    } catch {
      toast.error("Failed to retrieve base quote", { className: "toast-text", position: "top-center" });
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Select Cover Type</h1>

      {/* Vehicle Info */}
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 mb-6">
        <h2 className="font-semibold text-lg text-blue-600 mb-4">Vehicle Details</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
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
            <p className="text-sm text-gray-600">Manufacture Year: <span className="font-medium">{vehicle.year}</span></p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Type: <span className="font-medium">{vehicle.type === 0 ? "Private" : "Commercial"}</span></p>
          </div>
        </div>
      </div>

      {/* Cover Type Form */}
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-white shadow">
        <div>
          <h2 className="font-semibold text-lg text-blue-600 mb-4">Cover Type</h2>
          <select
            value={coverType}
            onChange={(e) => setCoverType(e.target.value as "Comprehensive" | "ThirdParty")}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="Comprehensive">Comprehensive</option>
            <option value="ThirdParty">Third Party</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Proceed to Quote
        </button>
      </form>
    </div>
  );
};

export default CoverType;
