import api from "../../api/axios";
import { type Vehicle } from "../Vehicle/api";

export interface QuoteRequest {
  vehicleId: string;
  insuranceType: number;
}

export interface QuoteOption {
  quarters: number;
  startDate: string;
  endDate: string;
  amount: number;
}

export interface QuoteBaseResponse {
  vehicle: Vehicle;
  quotes: QuoteOption[];
}


export async function getBaseQuote(data: QuoteRequest) {
  return api.post<QuoteBaseResponse>("/Insurance/quote", data);
}

export interface ActivePolicyResponse {
  hasActive: boolean;
  type: number; // 0 = Comprehensive, 1 = Third Party
  startDate: string;
  endDate: string;
  amount: number;
}

export async function checkActivePolicy(vehicleId: string) {
  return api.get<ActivePolicyResponse>(`/Insurance/active/${vehicleId}`);
}
