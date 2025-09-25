import { useState } from "react";
import { searchVehicleApi, addVehicleApi, getQuoteApi, createPolicyApi } from "../services/api";
import type { VehicleDto, CreateVehicleDto, CreateInsuranceQuoteDto, CreateInsurancePolicyDto, InsurancePolicyDto, InsuranceQuoteDto } from "../types/type";
import { StageIndicator } from "../components/StageIndicator";
import { PaymentForm } from "../components/PaymentForm";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";

const ClientDashboard = () => {
  const { logout } = useAuth();
  const [stage, setStage] = useState(0);
  const [vehicle, setVehicle] = useState<VehicleDto | null>(null);
  const [quote, setQuote] = useState<InsuranceQuoteDto | null>(null);
  const [policy, setPolicy] = useState<InsurancePolicyDto | null>(null);
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [newVehicle, setNewVehicle] = useState<CreateVehicleDto>({ registrationNumber: "", make: "", model: "", year: 0, type: "Private" });
  const [quoteData, setQuoteData] = useState<CreateInsuranceQuoteDto>({ vehicleId: "", insuranceType: "Comprehensive", startDate: "", durationQuarters: 1 });
  const [policyData, setPolicyData] = useState<CreateInsurancePolicyDto>({ quoteId: "", proceedWithOverlap: false });

  const handleSearch = async () => {
    const data = await searchVehicleApi(registrationNumber);
    if (data) {
      setVehicle(data);
      setStage(1);
    } else {
      toast.info("Vehicle not found. Please add a new vehicle.");
    }
  };

  const handleAddVehicle = async () => {
    const data = await addVehicleApi(newVehicle);
    setVehicle(data);
    setStage(1);
    toast.success("Vehicle added successfully!");
  };

  const handleGetQuote = async () => {
    if (vehicle) {
      const data = await getQuoteApi({ ...quoteData, vehicleId: vehicle.id });
      setQuote(data);
      setStage(2);
    }
  };

  const handleCreatePolicy = async () => {
    if (quote) {
      const data = await createPolicyApi({ ...policyData, quoteId: quote.vehicleId }); // Adjust quoteId logic based on backend
      setPolicy(data);
      setStage(3);
      toast.success("Policy created successfully!");
    }
  };

  const handlePaymentSuccess = () => {
    setStage(0);
    setVehicle(null);
    setQuote(null);
    setPolicy(null);
    toast.success("Payment completed!");
  };

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-primary">Client Dashboard</h1>
        <button onClick={logout} className="bg-primary text-white p-2 rounded hover:bg-opacity-90">
          Logout
        </button>
      </header>
      <StageIndicator currentStage={stage} />
      {stage === 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-primary mb-4">Search Vehicle</h2>
          <input
            type="text"
            placeholder="Registration Number"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button onClick={handleSearch} className="bg-primary text-white p-2 rounded mr-2 hover:bg-opacity-90">
            Search
          </button>
          {!vehicle && (
            <div>
              <h3 className="text-lg font-medium mb-2">Add New Vehicle</h3>
              <input
                type="text"
                placeholder="Registration Number"
                value={newVehicle.registrationNumber}
                onChange={(e) => setNewVehicle({ ...newVehicle, registrationNumber: e.target.value })}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                placeholder="Make"
                value={newVehicle.make}
                onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                placeholder="Model"
                value={newVehicle.model}
                onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="number"
                placeholder="Year"
                value={newVehicle.year}
                onChange={(e) => setNewVehicle({ ...newVehicle, year: parseInt(e.target.value) || 0 })}
                className="w-full p-2 border rounded mb-2"
              />
              <select
                value={newVehicle.type}
                onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value as "Private" | "Commercial" })}
                className="w-full p-2 border rounded mb-4"
              >
                <option value="Private">Private</option>
                <option value="Commercial">Commercial</option>
              </select>
              <button onClick={handleAddVehicle} className="bg-primary text-white p-2 rounded hover:bg-opacity-90">
                Add Vehicle
              </button>
            </div>
          )}
        </div>
      )}
      {stage === 1 && vehicle && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-primary mb-4">Get Quote</h2>
          <p>Vehicle: {vehicle.make} {vehicle.model} ({vehicle.type})</p>
          <select
            value={quoteData.insuranceType}
            onChange={(e) => setQuoteData({ ...quoteData, insuranceType: e.target.value as "Comprehensive" | "ThirdParty" })}
            className="w-full p-2 border rounded mb-2"
          >
            <option value="Comprehensive">Comprehensive</option>
            <option value="ThirdParty">Third Party</option>
          </select>
          <input
            type="date"
            value={quoteData.startDate}
            onChange={(e) => setQuoteData({ ...quoteData, startDate: e.target.value })}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="number"
            min="1"
            max="4"
            value={quoteData.durationQuarters}
            onChange={(e) => setQuoteData({ ...quoteData, durationQuarters: parseInt(e.target.value) || 1 })}
            className="w-full p-2 border rounded mb-4"
            placeholder="Quarters (1-4)"
          />
          <button onClick={handleGetQuote} className="bg-primary text-white p-2 rounded hover:bg-opacity-90">
            Get Quote
          </button>
        </div>
      )}
      {stage === 2 && quote && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-primary mb-4">Create Policy</h2>
          <p>Amount: ${quote.amount}</p>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={policyData.proceedWithOverlap}
              onChange={(e) => setPolicyData({ ...policyData, proceedWithOverlap: e.target.checked })}
              className="mr-2"
            />
            Proceed with overlap (if active policy exists)
          </label>
          <button onClick={handleCreatePolicy} className="bg-primary text-white p-2 rounded mt-4 hover:bg-opacity-90">
            Create Policy
          </button>
        </div>
      )}
      {stage === 3 && policy && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-primary mb-4">Payment</h2>
          <PaymentForm policyId={policy.id} amount={policy.amount} onSuccess={handlePaymentSuccess} />
        </div>
      )}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default ClientDashboard;