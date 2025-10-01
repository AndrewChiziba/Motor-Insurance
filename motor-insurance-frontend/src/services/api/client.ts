import type { ClientPolicy } from "../../types/client";
import api from "./axios";


export async function getClientPolicies(): Promise<ClientPolicy[]> {
  const response = await api.get('/insurance/client-policies');
  return response.data;
}