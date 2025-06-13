import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';


export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CreatePreferenceRequest {
  amount: number;
  description: string;
}

export interface CreatePreferenceResponse {
  id: string;
  init_point: string;
  sandbox_init_point?: string;
}

export const createPaymentPreference = async (
  data: CreatePreferenceRequest
): Promise<CreatePreferenceResponse> => {
  const response = await api.post('/payments/create-preference', data);
  return response.data;
};