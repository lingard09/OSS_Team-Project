import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

export const api = {
  // OTT 서비스 API
  getOttServices: () => axios.get(`${BASE_URL}/ottServices`),
  addOttService: (service) => axios.post(`${BASE_URL}/ottServices`, service),
  deleteOttService: (id) => axios.delete(`${BASE_URL}/ottServices/${id}`),

  // Watch Later API
  getWatchLater: () => axios.get(`${BASE_URL}/watchLater`),
  addToWatchLater: (movie) => axios.post(`${BASE_URL}/watchLater`, movie),
  deleteFromWatchLater: (id) => axios.delete(`${BASE_URL}/watchLater/${id}`),
  updateWatchLater: (id, data) => axios.put(`${BASE_URL}/watchLater/${id}`, data)
};