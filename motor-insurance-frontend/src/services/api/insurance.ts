import api from "./axios";

export interface QuoteRequest {
  vehicleId: string;
  insuranceType: number; // 0 = Comprehensive, 1 = Third Party
}

export interface QuoteBaseResponse {
  vehicle: {
    id: string;
    registrationNumber: string;
    make: string;
    model: string;
    colour: string;
    year: number;
    type: number;
  };
  insuranceType: number;
  quotes: {
    quarters: number;
    startDate: string;
    endDate: string;
    amount: number;
  }[];
}

export interface ActivePolicyResponse {
  hasActive: boolean;
  type?: number;       // 0 = Comprehensive, 1 = Third Party
  startDate?: string;
  endDate?: string;
  amount?: number;
}

export interface CreatePolicyRequest {
  vehicleId: string;
  insuranceType: number; // 0 = Comprehensive, 1 = Third Party
  startDate: string;
  endDate: string;
  durationQuarters: number;
  amount: number;
  proceedWithOverlap?: boolean;
}

// get quote
export async function getBaseQuote(data: QuoteRequest) {
  return api.post<QuoteBaseResponse>("/Insurance/quote", data);
}

// check active policy
export async function checkActivePolicy(vehicleId: string) {
  return api.get<ActivePolicyResponse>(`/Insurance/active/${vehicleId}`);
}

// create policy (initially Pending)
export async function createPolicy(data: CreatePolicyRequest) {
  return api.post("/insurance", data);
}

// activate policy after payment
export async function activatePolicy(policyId: string) {
  return api.patch(`/Insurance/${policyId}/activate`);
}