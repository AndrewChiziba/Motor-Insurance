export interface Vehicle {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  colour: string;
  year: number;
  type: number; // 0 = Private, 1 = Commercial
}

export interface InsuranceRate {
  id: string;
  vehicleType: number; // 0 = Private, 1 = Commercial
  insuranceType: number; // 0 = Third Party, 1 = Comprehensive
  ratePerQuarter: number;
}

export interface UpdateVehicleDto {
  registrationNumber: string;
  make: string;
  model: string;
  colour: string;
  year: number;
  type: number;
}

export interface UpdateInsuranceRateDto {
  ratePerQuarter: number;
}

export interface CreateAdminDto {
  email: string;
  password: string;
  fullName: string;
}

export interface VehiclesResponse {
  vehicles: Vehicle[];
  totalCount: number;
}