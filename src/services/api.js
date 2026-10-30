/**
 * API client service for Lazfort Hotel ERP
 */

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || '/api';

export const apiClient = {
  get: async (endpoint) => {
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`[API Client GET] ${endpoint} fallback:`, err.message);
      return null;
    }
  },

  post: async (endpoint, data) => {
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`[API Client POST] ${endpoint} fallback:`, err.message);
      return null;
    }
  },
};

export default apiClient;

