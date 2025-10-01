import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { VehicleType, InsuranceType } from '../types/enums';
import type { ClientPolicy } from '../types/client';
import { getClientPolicies } from '../services/api/client'; // Updated import

const ClientDashboard: React.FC = () => {
  const [policies, setPolicies] = useState<ClientPolicy[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPolicies = async () => {
    try {
      const policiesData = await getClientPolicies(); // Updated API call
      setPolicies(policiesData);
    } catch {
      toast.error('Failed to load your insurance policies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPolicies();
  }, []);

  const calculateDaysRemaining = (endDate: string): number => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading your policies...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-600 mb-2">My Insurance Policies</h1>
      <p className="text-gray-600 mb-6">View and manage your active insurance policies</p>
      
      {policies.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4 text-lg">You don't have any active insurance policies.</p>
          <button 
            onClick={() => window.location.href = '/search'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Get Insurance Now
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {policies.map((policy) => {
            const daysRemaining = calculateDaysRemaining(policy.endDate);
            const isExpiringSoon = daysRemaining <= 30;
            
            return (
              <div key={policy.policyId} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Policy Header */}
                <div className={`p-4 text-white ${isExpiringSoon ? 'bg-orange-500' : 'bg-blue-600'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{policy.registrationNumber}</h3>
                      <p className="text-blue-100 text-sm">
                        {VehicleType[policy.vehicleType as keyof typeof VehicleType]} •{' '}
                        {InsuranceType[policy.insuranceType as keyof typeof InsuranceType]}
                      </p>
                    </div>
                    {isExpiringSoon && (
                      <span className="bg-white text-orange-600 text-xs font-bold px-2 py-1 rounded-full">
                        Expiring Soon
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Vehicle Details */}
                <div className="p-4 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Vehicle Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600 block text-xs">Make/Model</span>
                      <p className="font-medium">{policy.make} {policy.model}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 block text-xs">Colour</span>
                      <p className="font-medium">{policy.colour}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 block text-xs">Year</span>
                      <p className="font-medium">{policy.year}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 block text-xs">Type</span>
                      <p className="font-medium">{VehicleType[policy.vehicleType as keyof typeof VehicleType]}</p>
                    </div>
                  </div>
                </div>

                {/* Policy Details */}
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Policy Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Coverage:</span>
                      <span className="font-medium text-blue-600">
                        {InsuranceType[policy.insuranceType as keyof typeof InsuranceType]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium">{new Date(policy.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">End Date:</span>
                      <span className="font-medium">{new Date(policy.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{policy.durationQuarters} quarter{policy.durationQuarters > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <span className="text-gray-600 font-semibold">Amount Paid:</span>
                      <span className="font-bold text-green-600">K{policy.amount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Status and Remaining Time */}
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Active
                      </span>
                      <span className={`text-xs font-medium ${isExpiringSoon ? 'text-orange-600' : 'text-gray-500'}`}>
                        {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Expires today'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;