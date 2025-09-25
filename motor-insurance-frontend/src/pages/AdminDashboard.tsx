import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import type { InsurancePolicyDto, VehicleDto } from "../types/type";
import { useAuth } from "../hooks/useAuth";

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [vehicles, setVehicles] = useState<VehicleDto[]>([]);
  const [policies, setPolicies] = useState<InsurancePolicyDto[]>([]);

  useEffect(() => {
    // Mock API calls; replace with actual endpoints when available
    setVehicles([
      { id: "1", registrationNumber: "ABC123", make: "Toyota", model: "Camry", year: 2020, type: "Private" },
      { id: "2", registrationNumber: "XYZ789", make: "Honda", model: "Civic", year: 2019, type: "Private" },
    ]);
    setPolicies([
      { id: "1", vehicleId: "1", userId: "user1", type: "Comprehensive", startDate: "2025-09-01", durationQuarters: 2, amount: 1000, status: "Active" },
    ]);
  }, []);

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-primary">Admin Dashboard</h1>
        <button onClick={logout} className="bg-primary text-white p-2 rounded hover:bg-opacity-90">
          Logout
        </button>
      </header>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-primary mb-4">Vehicles</h2>
        <ul>
          {vehicles.map((v) => (
            <li key={v.id}>{v.registrationNumber} - {v.make} {v.model}</li>
          ))}
        </ul>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold text-primary mb-4">Policies</h2>
        <ul>
          {policies.map((p) => (
            <li key={p.id}>Policy for {p.vehicleId} - ${p.amount}</li>
          ))}
        </ul>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default AdminDashboard;