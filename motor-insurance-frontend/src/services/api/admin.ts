import api from "./axios";
import type { CreateAdminDto, InsuranceRate, UpdateInsuranceRateDto, UpdateVehicleDto, Vehicle, VehiclesResponse } from "../../types/admin";

export const adminApi = {
  // Vehicle operations
  getVehicles: async (search?: string, page: number = 1): Promise<VehiclesResponse> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('page', page.toString());
    
    const response = await api.get(`/admin/vehicles?${params}`);
    return response.data;
  },

  getVehicle: async (id: string): Promise<Vehicle> => {
    const response = await api.get(`/admin/vehicles/${id}`);
    return response.data;
  },

  updateVehicle: async (id: string, data: UpdateVehicleDto): Promise<Vehicle> => {
    const response = await api.put(`/admin/vehicles/${id}`, data);
    return response.data;
  },

  deleteVehicle: async (id: string): Promise<void> => {
    await api.delete(`/admin/vehicles/${id}`);
  },

  // Insurance Rate operations
  getInsuranceRates: async (): Promise<InsuranceRate[]> => {
    const response = await api.get('/admin/insurance-rates');
    return response.data;
  },

  updateInsuranceRate: async (id: string, data: UpdateInsuranceRateDto): Promise<InsuranceRate> => {
    const response = await api.put(`/admin/insurance-rates/${id}`, data);
    return response.data;
  },

  // User operations
  createAdmin: async (data: CreateAdminDto): Promise<{ message: string }> => {
    const response = await api.post('/admin/users', data);
    return response.data;
  },
};