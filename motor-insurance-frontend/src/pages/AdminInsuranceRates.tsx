import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminApi } from '../services/api/admin';
import { VehicleType, InsuranceType } from '../types/enums';
import type { InsuranceRate, UpdateInsuranceRateDto } from '../types/admin';

const AdminInsuranceRates: React.FC = () => {
  const [rates, setRates] = useState<InsuranceRate[]>([]);
  const [editingRate, setEditingRate] = useState<InsuranceRate | null>(null);
  const [editForm, setEditForm] = useState<UpdateInsuranceRateDto>({
    ratePerQuarter: 0,
  });

  const loadRates = async () => {
    try {
      const ratesData = await adminApi.getInsuranceRates();
      setRates(ratesData);
    } catch {
      toast.error('Failed to load insurance rates');
    }
  };

  useEffect(() => {
    loadRates();
  }, []);

  const handleEdit = (rate: InsuranceRate) => {
    setEditingRate(rate);
    setEditForm({ ratePerQuarter: rate.ratePerQuarter });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRate) return;

    try {
      const updatedRate = await adminApi.updateInsuranceRate(editingRate.id, editForm);
      setRates(rates.map(r => r.id === updatedRate.id ? updatedRate : r));
      setEditingRate(null);
      toast.success('Insurance rate updated successfully');
    } catch {
      toast.error('Failed to update insurance rate');
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Insurance Rates Management</h1>
        
        {/* Rates Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Insurance Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate Per Quarter (ZMW)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rates.map((rate) => (
                <tr key={rate.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {VehicleType[rate.vehicleType as keyof typeof VehicleType]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {InsuranceType[rate.insuranceType as keyof typeof InsuranceType]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    K{rate.ratePerQuarter.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(rate)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {editingRate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Edit Insurance Rate</h2>
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <p className="font-semibold">
                  {VehicleType[editingRate.vehicleType as keyof typeof VehicleType]} - 
                  {InsuranceType[editingRate.insuranceType as keyof typeof InsuranceType]}
                </p>
              </div>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rate Per Quarter (ZMW)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editForm.ratePerQuarter}
                    onChange={(e) => setEditForm({...editForm, ratePerQuarter: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingRate(null)}
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Update Rate
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInsuranceRates;