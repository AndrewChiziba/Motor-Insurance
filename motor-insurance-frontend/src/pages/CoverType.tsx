import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { getBaseQuote, type QuoteRequest, type QuoteBaseResponse } from "../services/Insurance/api";
import type { Vehicle } from "../services/Vehicle/api";

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
      <div className="p-4 border rounded bg-gray-50 mb-6">
        <h2 className="font-semibold text-lg text-blue-600">Vehicle</h2>
        <p><strong>Reg:</strong> {vehicle.registrationNumber}</p>
        <p><strong>Make/Model:</strong> {vehicle.make} {vehicle.model}</p>
        <p><strong>Year:</strong> {vehicle.year}</p>
        <p><strong>Type:</strong> {vehicle.type === 0 ? "Private" : "Commercial"}</p>
      </div>

      {/* Cover Type Form */}
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-white shadow">
        <div>
          <label className="block mb-1 font-medium">Cover Type</label>
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
