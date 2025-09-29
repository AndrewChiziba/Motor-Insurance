import api from "./axios";

export interface CreatePaymentRequest {
  insurancePolicyId: string;
  paymentMethod: string; // "Card" or "MobileMoney"
}

export async function processPayment(data: CreatePaymentRequest) {
  return api.post("/payments", data);
}