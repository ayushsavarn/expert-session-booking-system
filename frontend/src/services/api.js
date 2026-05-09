import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loadExperts = async (params = {}) => {
  const response = await api.get('/experts', { params });
  return response.data;
};

export const loadExpert = async (id) => {
  const response = await api.get(`/experts/${id}`);
  return response.data;
};

export const bookSession = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

export const updateStatus = async (id, status) => {
  const response = await api.patch(`/bookings/${id}/status`, { status });
  return response.data;
};

export const updateBooking = async (id, bookingData) => {
  const response = await api.patch(`/bookings/${id}`, bookingData);
  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await api.delete(`/bookings/${id}`);
  return response.data;
};

export const loadBookings = async (email = '') => {
  const response = await api.get('/bookings', { params: { email } });
  return response.data;
};

export default api;