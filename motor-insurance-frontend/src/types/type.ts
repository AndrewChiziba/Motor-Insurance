export interface VehicleDto {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  type: "Private" | "Commercial";
}

export interface InsuranceQuoteDto {
  vehicleId: string;
  insuranceType: "Comprehensive" | "ThirdParty";
  startDate: string;
  durationQuarters: number;
  amount: number;
}

export interface InsurancePolicyDto {
  id: string;
  vehicleId: string;
  userId: string;
  type: "Comprehensive" | "ThirdParty";
  startDate: string;
  durationQuarters: number;
  amount: number;
  status: string;
}

export interface PaymentDto {
  id: string;
  policyId: string;
  amount: number;
  method: string;
  status: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
}

export interface CreateVehicleDto {
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  type: "Private" | "Commercial";
}

export interface CreateInsuranceQuoteDto {
  vehicleId: string;
  insuranceType: "Comprehensive" | "ThirdParty";
  startDate: string;
  durationQuarters: number;
}

export interface CreateInsurancePolicyDto {
  quoteId: string;
  proceedWithOverlap: boolean;
}

export interface CreatePaymentDto {
  policyId: string;
  method: string;
}