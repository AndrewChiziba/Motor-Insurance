import { useState } from "react";
import { toast } from "react-toastify";
import { searchVehicle, addVehicle, type Vehicle } from "../services/api/vehicle";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [registration, setRegistration] = useState("");
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [newVehicle, setNewVehicle] = useState<Vehicle>({
    registrationNumber: "",
    make: "",
    model: "",
    colour: "",
    year: new Date().getFullYear(),
    type: 0,
  });

  const navigate = useNavigate();

  // Dynamic title based on current state
  const getPageTitle = () => {
    if (showAddForm) {
      return "Add Vehicle";
    }
    return "Search Vehicle";
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    try {
      const res = await searchVehicle(registration.toUpperCase());
      setVehicle(res.data);
      setShowAddForm(false);
      toast.success("Vehicle found!", { className: "toast-text", position: "top-center" });
    } catch {
      setVehicle(null);
      toast.error("Vehicle not found.", { className: "toast-text", position: "top-center" });
    } finally {
      setIsSearching(false);
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

  const handleCancel = () => {
    // Reload the page to reset everything
    window.location.reload();
  };

  const showAddVehicleButton = !vehicle && !showAddForm;
  // const showCancelButton = vehicle || showAddForm;
  const showSearchForm = !showAddForm;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Dynamic Title */}
      <h1 className="text-2xl font-bold text-blue-600 mb-6">{getPageTitle()}</h1>

      {/* Search Form - Hidden when adding vehicle */}
      {showSearchForm && (
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Enter Registration Number, e.g. ABC1234 or BBA1212"
              value={registration}
              onChange={(e) => setRegistration(e.target.value.toUpperCase())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isSearching}
            />
            <button
              type="submit"
              disabled={isSearching}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>
        </form>
      )}

      {/* Add Vehicle Button - Only show when no vehicle found and not in add form */}
      {showAddVehicleButton && (
        <div className="text-center mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Add Vehicle
          </button>
        </div>
      )}

      {/* Vehicle Found Section */}
      {vehicle && (
        <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 mb-6">
          <h2 className="font-semibold text-lg text-blue-600 mb-4">Vehicle Found</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Registration</p>
              <p className="font-medium">{vehicle.registrationNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Make</p>
              <p className="font-medium">{vehicle.make}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Model</p>
              <p className="font-medium">{vehicle.model}</p>
            </div>
              <div>
              <p className="text-sm text-gray-600">Colour</p>
              <p className="font-medium">{vehicle.colour}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Manufacture Year</p>
              <p className="font-medium">{vehicle.year}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="font-medium">{vehicle.type === 0 ? "Private" : "Commercial"}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleProceedToQuote}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Get Insurance Quote
            </button>
          </div>
        </div>
      )}

      {/* Add Vehicle Form - Shows when Add Vehicle button is clicked */}
      {showAddForm && (
        <form onSubmit={handleAddVehicle} className="space-y-2 p-2 border border-gray-200 rounded-lg bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">New Vehicle</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registration Number
            </label>
            <input
              type="text"
              placeholder="e.g. ABC123"
              value={newVehicle.registrationNumber}
              onChange={(e) => setNewVehicle({ ...newVehicle, registrationNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Make
            </label>
            <input
              type="text"
              placeholder="e.g. Toyota"
              value={newVehicle.make}
              onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model
            </label>
            <input
              type="text"
              placeholder="e.g. Corolla"
              value={newVehicle.model}
              onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Colour
            </label>
            <input
              type="text"
              placeholder="e.g. White"
              value={newVehicle.colour}
              onChange={(e) => setNewVehicle({ ...newVehicle, colour: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year of Manufacture
            </label>
            <input
              type="number"
              placeholder="Year"
              min={1900}
              max={new Date().getFullYear()}
              value={newVehicle.year}
              onChange={(e) => setNewVehicle({ ...newVehicle, year: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Type
            </label>
            <select
              value={newVehicle.type}
              onChange={(e) => setNewVehicle({ ...newVehicle, type: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Private</option>
              <option value={1}>Commercial</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Vehicle
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Search;