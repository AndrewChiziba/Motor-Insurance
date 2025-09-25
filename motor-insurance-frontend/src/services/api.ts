import axios from "axios";
import type { CreateInsurancePolicyDto, CreateInsuranceQuoteDto, CreatePaymentDto, CreateVehicleDto, InsurancePolicyDto, InsuranceQuoteDto, LoginDto, PaymentDto, SignUpDto, VehicleDto } from "../types/type";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginApi = async (credentials: LoginDto) =>
  api.post<{ token: string }>("/Auth/login", credentials).then((res) => res.data);

export const signupApi = async (userData: SignUpDto) =>
  api.post("/auth/Register", userData).then((res) => res.data);

export const searchVehicleApi = async (registrationNumber: string) =>
  api.get<VehicleDto | null>(`/Vehicles/search/${registrationNumber}`).then((res) => res.data);

export const addVehicleApi = async (vehicle: CreateVehicleDto) =>
  api.post<VehicleDto>("/Vehicles", vehicle).then((res) => res.data);

export const getQuoteApi = async (quoteData: CreateInsuranceQuoteDto) =>
  api.post<InsuranceQuoteDto>("/Insurance/quote", quoteData).then((res) => res.data);

export const createPolicyApi = async (policyData: CreateInsurancePolicyDto) =>
  api.post<InsurancePolicyDto>("/Insurance", policyData).then((res) => res.data);

export const processPaymentApi = async (paymentData: CreatePaymentDto) =>
  api.post<PaymentDto>("/Payments", paymentData).then((res) => res.data);

export const getMyPoliciesApi = async () =>
  api.get<InsurancePolicyDto[]>("/Pnsurance").then((res) => res.data);