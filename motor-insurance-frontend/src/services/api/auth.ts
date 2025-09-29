import api from "./axios";

export interface RegisterPayload {
  email: string;
  fullname: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function registerUser(payload: RegisterPayload) {
  return api.post("/Auth/register", payload);
}

export async function loginUser(payload: LoginPayload) {
  return api.post("/Auth/login", payload);
}
