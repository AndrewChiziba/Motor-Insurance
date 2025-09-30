import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  checkActivePolicy,
  createPolicy,
  type ActivePolicyResponse,
} from "../services/api/insurance";
import type { Vehicle } from "../services/api/vehicle";

interface LocationState {
  vehicle: Vehicle;
  coverType: "Comprehensive" | "Third Party";
  quarters: number;
  price: number;
  startDate: string;
  endDate: string;
}

const CreatePolicy = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as LocationState | undefined;

  const [showModal, setShowModal] = useState(false);
  const [activePolicy, setActivePolicy] = useState<ActivePolicyResponse | null>(
    null
  );
  const [pendingProceed, setPendingProceed] = useState(false);

  if (!state) {
    toast.error("Missing policy details!", {
      className: "toast-text",
      position: "top-center",
    });
    navigate("/search");
    return null;
  }

  const { vehicle, coverType, quarters, price, startDate, endDate } = state;

  const handleProceed = async () => {
    try {
      // 🔍 First check for active policy before creating
      const res = await checkActivePolicy(vehicle.id as string);

      if (res.data.hasActive) {
        setActivePolicy(res.data);
        setShowModal(true);
        setPendingProceed(true);
        return;
      }

      // If no active policy, create
      await proceedWithCreation();
    } catch {
      toast.error("Failed to check active policy", {
        className: "toast-text",
        position: "top-center",
      });
    }
  };

  const proceedWithCreation = async () => {
    try {
      const res = await createPolicy({
        vehicleId: vehicle.id as string,
        insuranceType: coverType === "Comprehensive" ? 0 : 1,
        startDate,
        endDate,
        durationQuarters: quarters,
        amount: price,
        proceedWithOverlap: !!activePolicy, // allow overlap if confirmed
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
    } finally {
      setShowModal(false);
      setPendingProceed(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">
        Insurance Policy Summary
      </h1>
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 mb-6">
        {/* Client details*/}
        <h2 className="font-semibold text-lg text-blue-600 mb-4">Client Details</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Name: <span className="font-medium">{localStorage.getItem("fullName")}</span></p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email: <span className="font-medium">{localStorage.getItem("email")}</span></p>
          </div>
        </div>

        <hr />

        {/* Vehicle details*/}
        <h2 className="font-semibold text-lg text-blue-600 mb-4">Vehicle Details</h2>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Registration: <span className="font-medium">{vehicle.registrationNumber}</span> </p>
            
          </div>
          <div>
            <p className="text-sm text-gray-600">Make: <span className="font-medium">{vehicle.make}</span> </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Model: <span className="font-medium">{vehicle.model}</span> </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Color: <span className="font-medium">{vehicle.colour}</span></p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Year of Manufacture: <span className="font-medium">{vehicle.year}</span> </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Type: <span className="font-medium">{vehicle.type === 0 ? "Private" : "Commercial"}</span> </p>
          </div>
        </div>
        <hr />
         {/* Cover details*/}
        <h2 className="font-semibold text-lg text-blue-600 mb-4">Cover Details</h2>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Cover: <span className="font-medium">{coverType}</span> </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Duration: <span className="font-medium">{quarters} quarter(s)</span> </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Start: <span className="font-medium">{new Date(startDate).toLocaleDateString()}</span></p>
          </div>
          <div>
            <p className="text-sm text-gray-600">End: <span className="font-medium"> {new Date(endDate).toLocaleDateString()}</span> </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Amount: <span className="font-medium">{price.toFixed(2)} ZMW</span> </p>
          </div>
        </div>
        
      </div>
     

      <button
        onClick={handleProceed}
        disabled={pendingProceed}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        Proceed
      </button>

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
            <p>
              <strong>Start:</strong>{" "}
              {new Date(activePolicy.startDate as string).toLocaleDateString()}
            </p>
            <p>
              <strong>End:</strong>{" "}
              {new Date(activePolicy.endDate as string).toLocaleDateString()}
            </p>
            <p className="text-gray-700 mt-2">
              Do you still want to create a new policy? (<strong>ONLY</strong> new policy will apply)
            </p>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  setActivePolicy(null);
                  setPendingProceed(false); // reset so Proceed button is clickable again
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={proceedWithCreation}
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
