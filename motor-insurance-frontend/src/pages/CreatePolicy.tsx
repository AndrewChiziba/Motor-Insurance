import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { checkActivePolicy, createPolicy } from "../services/api/insurance";
import type { Vehicle } from "../services/api/vehicle";

interface LocationState {
  vehicle: Vehicle;
  coverType: "Comprehensive" | "Third Party";
  quarters: number;
  price: number;
  startDate: string;
  endDate: string;
}

interface ActivePolicyResponse {
  hasActive: boolean;
  type: number; // 0 = Comprehensive, 1 = Third Party
  startDate: string;
  endDate: string;
  amount: number;
}

const CreatePolicy = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as LocationState | undefined;

  // Hooks must come first
  const [showModal, setShowModal] = useState(false);
  const [activePolicy, setActivePolicy] = useState<ActivePolicyResponse | null>(
    null
  );

  //  Guard against missing state
  useEffect(() => {
    if (!state) {
      toast.error("Missing policy details!", {
        className: "toast-text",
        position: "top-center",
      });
      navigate("/search");
      return;
    }

    if (!state.vehicle?.id) return;

    checkActivePolicy(state.vehicle.id)
      .then((res) => {
        if (res.data.hasActive) {
          setActivePolicy(res.data);
          setShowModal(true);
        }
      })
      .catch(() => {
        toast.error("Failed to check active policy", {
          className: "toast-text",
          position: "top-center",
        });
      });
  }, [state, navigate]);

  if (!state) return null;

  const { vehicle, coverType, quarters, price, startDate, endDate } = state;

  const handleProceed = async () => {
    try {
      const res = await createPolicy({
        vehicleId: vehicle.id as string,
        insuranceType: coverType === "Comprehensive" ? 0 : 1,
        startDate,
        endDate,
        durationQuarters: quarters,
        amount: price,
        proceedWithOverlap: !!activePolicy, // if they chose "continue anyway"
      });

      const newPolicy = res.data;

      navigate("/payment", {
        state: {
          vehicle,
          policy: newPolicy,
        },
      });
    } catch {
      toast.error("Failed to create policy", {
        className: "toast-text",
        position: "top-center",
      });
    }
  };


  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">
        Confirm Insurance Policy
      </h1>

      {/* Vehicle & Cover Info */}
      <div className="p-4 border rounded bg-gray-50 mb-6">
        <h2 className="font-semibold text-lg text-blue-600">Vehicle</h2>
        <p><strong>Reg:</strong> {vehicle.registrationNumber}</p>
        <p><strong>Make/Model:</strong> {vehicle.make} {vehicle.model}</p>
        <p><strong>Year:</strong> {vehicle.year}</p>
        <p><strong>Type:</strong> {vehicle.type === 0 ? "Private" : "Commercial"}</p>
      </div>
      <div className="p-4 border rounded bg-gray-50 mb-6">
        <p><strong>Cover:</strong> {coverType}</p>
        <p><strong>Duration:</strong> {quarters} quarter(s)</p>
        <p><strong>Start:</strong> {new Date(startDate).toLocaleDateString()}</p>
        <p><strong>End:</strong> {new Date(endDate).toLocaleDateString()}</p>
        <p><strong>Price:</strong> {price.toFixed(2)}</p>
      </div>

      <button
        onClick={handleProceed}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Proceed
      </button>

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
            <p>
              <strong>Start:</strong>{" "}
              {new Date(activePolicy.startDate).toLocaleDateString()}
            </p>
            <p>
              <strong>End:</strong>{" "}
              {new Date(activePolicy.endDate).toLocaleDateString()}
            </p>
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
                onClick={handleProceed}
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

export default CreatePolicy;
