import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

export const logoutUser = async () => {
  await axios.post(`${API_URL}/auth/logout`);
};