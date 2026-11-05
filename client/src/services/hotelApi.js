/**
 * Lazfort Hotel ERP - Centralized Laravel API Client
 * Connects React frontend directly to Laravel REST API endpoints (http://127.0.0.1:8000/api)
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

/**
 * Universal fetch wrapper with error handling & JSON parsing
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const error = new Error(errorBody.message || `API error ${response.status}: ${response.statusText}`);
      error.status = response.status;
      error.data = errorBody;
      throw error;
    }
    return await response.json();
  } catch (error) {
    // If backend is unavailable or not started yet, log clearly and bubble up
    console.warn(`[Hotel ERP API] Request to ${endpoint} failed:`, error.message);
    throw error;
  }
}

export const hotelApi = {
  // Health
  checkHealth: () => apiRequest('/health'),

  // Hotels & Properties
  getHotels: () => apiRequest('/hotels'),
  createHotel: (data) => apiRequest('/hotels', { method: 'POST', body: JSON.stringify(data) }),
  updateHotel: (id, data) => apiRequest(`/hotels/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteHotel: (id) => apiRequest(`/hotels/${id}`, { method: 'DELETE' }),

  // Rooms
  getRooms: () => apiRequest('/rooms'),
  createRoom: (data) => apiRequest('/rooms', { method: 'POST', body: JSON.stringify(data) }),
  updateRoom: (id, data) => apiRequest(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteRoom: (id) => apiRequest(`/rooms/${id}`, { method: 'DELETE' }),

  // Bookings
  getBookings: () => apiRequest('/bookings'),
  createBooking: (data) => apiRequest('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  updateBooking: (id, data) => apiRequest(`/bookings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBooking: (id) => apiRequest(`/bookings/${id}`, { method: 'DELETE' }),

  // Guests
  getGuests: () => apiRequest('/guests'),
  createGuest: (data) => apiRequest('/guests', { method: 'POST', body: JSON.stringify(data) }),
  updateGuest: (id, data) => apiRequest(`/guests/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGuest: (id) => apiRequest(`/guests/${id}`, { method: 'DELETE' }),

  // Payments & Invoices
  getPayments: () => apiRequest('/payments'),
  createPayment: (data) => apiRequest('/payments', { method: 'POST', body: JSON.stringify(data) }),
  getInvoices: () => apiRequest('/invoices'),
  createInvoice: (data) => apiRequest('/invoices', { method: 'POST', body: JSON.stringify(data) }),

  // Housekeeping
  getHousekeepingTasks: () => apiRequest('/housekeeping/tasks'),
  createHousekeepingTask: (data) => apiRequest('/housekeeping/tasks', { method: 'POST', body: JSON.stringify(data) }),
  updateHousekeepingTask: (id, data) => apiRequest(`/housekeeping/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Maintenance
  getMaintenanceTickets: () => apiRequest('/maintenance/tickets'),
  createMaintenanceTicket: (data) => apiRequest('/maintenance/tickets', { method: 'POST', body: JSON.stringify(data) }),
  updateMaintenanceTicket: (id, data) => apiRequest(`/maintenance/tickets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Staff
  getStaff: () => apiRequest('/staff'),
  createStaff: (data) => apiRequest('/staff', { method: 'POST', body: JSON.stringify(data) }),
  updateStaff: (id, data) => apiRequest(`/staff/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteStaff: (id) => apiRequest(`/staff/${id}`, { method: 'DELETE' }),

  // Folios
  getFolios: () => apiRequest('/folios'),
  createFolio: (data) => apiRequest('/folios', { method: 'POST', body: JSON.stringify(data) }),
  updateFolio: (id, data) => apiRequest(`/folios/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Inventory
  getInventory: () => apiRequest('/inventory'),
  createInventory: (data) => apiRequest('/inventory', { method: 'POST', body: JSON.stringify(data) }),
  updateInventory: (id, data) => apiRequest(`/inventory/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Sync Initial Seed Data to MySQL
  seedInitialData: (data) => apiRequest('/sync-seed', { method: 'POST', body: JSON.stringify(data) }),
};

export default hotelApi;

