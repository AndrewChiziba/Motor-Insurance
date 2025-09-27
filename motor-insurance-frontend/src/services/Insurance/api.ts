import api from "../../api/axios";

export interface QuoteRequest {
  vehicleId: string;
  insuranceType: number; // 0 = Comprehensive, 1 = Third Party
}

export interface QuoteBaseResponse {
  basePremium: number;
  currency: string;
}

export async function getBaseQuote(data: QuoteRequest) {
  return api.post<QuoteBaseResponse>("/Insurance/quote", data);
}
