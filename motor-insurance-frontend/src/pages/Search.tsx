import { useState } from "react";
import { toast } from "react-toastify";
import { searchVehicle, addVehicle, type Vehicle } from "../services/Vehicle/api";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [registration, setRegistration] = useState("");
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState<Vehicle>({
    registrationNumber: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    type: 0,
  });

  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await searchVehicle(registration.toUpperCase());
      setVehicle(res.data);
      setShowAddForm(false);
      toast.success("Vehicle found!", { className: "toast-text", position: "top-center" });
    } catch {
      setVehicle(null);
      setShowAddForm(true);
      toast.error("Vehicle not found. Please add it.", { className: "toast-text", position: "top-center" });
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      newVehicle.registrationNumber = newVehicle.registrationNumber.toUpperCase();
      const res = await addVehicle(newVehicle);
      setVehicle(res.data);
      setShowAddForm(false);
      toast.success("Vehicle added successfully!", { className: "toast-text", position: "top-center" });
    } catch {
      toast.error("Failed to add vehicle.", { className: "toast-text", position: "top-center" });
    }
  };

  const handleProceedToQuote = () => {
    if (vehicle) {
      navigate("/covertype", { state: { vehicle } });
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Search Vehicle</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter Registration Number"
          value={registration}
          onChange={(e) => setRegistration(e.target.value)}
          className="flex-1 px-3 py-2 border rounded uppercase"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {/* Vehicle Found */}
      {vehicle && (
        <div className="p-4 border rounded bg-gray-50 mb-4">
          <h2 className="font-semibold text-lg text-blue-600">Vehicle Found</h2>
          <p><strong>Reg:</strong> {vehicle.registrationNumber}</p>
          <p><strong>Make/Model:</strong> {vehicle.make} {vehicle.model}</p>
          <p><strong>Year:</strong> {vehicle.year}</p>
          <p><strong>Type:</strong> {vehicle.type === 0 ? "Private" : "Commercial"}</p>

          <button
            onClick={handleProceedToQuote}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Get Insurance Quote
          </button>
        </div>
      )}

      {/* Add Vehicle Form */}
      {showAddForm && (
        <form onSubmit={handleAddVehicle} className="space-y-4 p-4 border rounded bg-white shadow">
          <h2 className="text-lg font-semibold text-blue-600">Add Vehicle</h2>

          <input
            type="text"
            placeholder="Registration Number"
            value={newVehicle.registrationNumber}
            onChange={(e) => setNewVehicle({ ...newVehicle, registrationNumber: e.target.value })}
            className="w-full px-3 py-2 border rounded uppercase"
            required
          />
          <input
            type="text"
            placeholder="Make"
            value={newVehicle.make}
            onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Model"
            value={newVehicle.model}
            onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Year"
            min={1900}
            max={new Date().getFullYear()}
            value={newVehicle.year}
            onChange={(e) => setNewVehicle({ ...newVehicle, year: Number(e.target.value) })}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <select
            value={newVehicle.type}
            onChange={(e) => setNewVehicle({ ...newVehicle, type: Number(e.target.value) })}
            className="w-full px-3 py-2 border rounded"
          >
            <option value={0}>Private</option>
            <option value={1}>Commercial</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Add Vehicle
          </button>
        </form>
      )}
    </div>
  );
};

export default Search;
