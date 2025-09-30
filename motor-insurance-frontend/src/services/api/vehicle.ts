import api from "./axios";

export interface Vehicle {
  id?: string;
  registrationNumber: string;
  make: string;
  model: string;
  colour: string;
  year: number;
  type: number; // 0 = Private, 1 = Commercial
}

export async function searchVehicle(registrationNumber: string) {
  return api.get(`/Vehicles/search/${registrationNumber}`);
}

export async function addVehicle(vehicle: Vehicle) {
  return api.post("/Vehicles", vehicle);
}
