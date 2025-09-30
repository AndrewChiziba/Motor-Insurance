import api from "./axios";

export interface RegisterPayload {
  email: string;
  fullname: string; // Note: backend might expect 'fullname' in request
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// Add response interface to match backend
export interface LoginResponse {
  token: string;
  expires: string;
  role: string;
  email: string;
  fullName: string; // Backend returns 'fullName'
}

export async function registerUser(payload: RegisterPayload) {
  return api.post("/Auth/register", payload);
}

export async function loginUser(payload: LoginPayload) {
  const response = await api.post<LoginResponse>("/Auth/login", payload);
  return response;
}