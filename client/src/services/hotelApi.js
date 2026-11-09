/**
 * Lazfort Hotel ERP - Centralized Laravel API Client
 * Connects React frontend directly to Laravel REST API endpoints (http://127.0.0.1:8000/api)
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

/**
 * In-memory Request Deduplication & Cache Store
 */
const requestCache = new Map();
const inFlightRequests = new Map();

/**
 * Universal fetch wrapper with caching & request deduplication
 */
async function apiRequest(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const url = `${API_BASE_URL}${endpoint}`;
  const isGet = method === 'GET';

  // For GET requests, check if a valid cached response exists
  const cacheKey = `${method}:${endpoint}`;
  const now = Date.now();
  const ttl = options.ttl !== undefined ? options.ttl : 120000; // 2 minutes cache: prevents repeated calls on re-clicking

  if (isGet && !options.skipCache && ttl > 0 && requestCache.has(cacheKey)) {
    const entry = requestCache.get(cacheKey);
    if (now - entry.timestamp < ttl) {
      return entry.data;
    } else {
      requestCache.delete(cacheKey);
    }
  }

  // Deduplicate simultaneous in-flight requests: return the ongoing promise directly
  if (isGet && inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  const token = localStorage.getItem('lazfort_token');
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const defaultHeaders = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };

  const fetchOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  delete fetchOptions.ttl;
  delete fetchOptions.skipCache;

  const executeRequest = async () => {
    try {
      const response = await fetch(url, fetchOptions);
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const error = new Error(errorBody.message || `API error ${response.status}: ${response.statusText}`);
        error.status = response.status;
        error.data = errorBody;
        throw error;
      }
      const data = await response.json();

      if (isGet) {
        requestCache.set(cacheKey, { timestamp: Date.now(), data });
      } else if (endpoint.startsWith('/auth/')) {
        // Keep read cache warm during auth requests to prevent cache dumps
      } else {
        requestCache.clear();
      }

      return data;
    } catch (error) {
      // Don't clutter console if backend is temporarily unreachable or user is unauthenticated during me checks
      if (error?.message?.includes('Failed to fetch') || (endpoint === '/auth/me' && error?.status === 401)) {
        // Suppress expected unauthenticated state
      } else {
        console.warn(`[Hotel ERP API] Request to ${endpoint} failed:`, error.message);
      }
      throw error;
    } finally {
      if (isGet) {
        inFlightRequests.delete(cacheKey);
      }
    }
  };

  if (isGet) {
    const promise = executeRequest();
    inFlightRequests.set(cacheKey, promise);
    return promise;
  }

  return executeRequest();
}

/**
 * Cache invalidation helper
 */
export function invalidateApiCache(prefix = '') {
  if (!prefix) {
    requestCache.clear();
  } else {
    for (const key of requestCache.keys()) {
      if (key.includes(prefix)) {
        requestCache.delete(key);
      }
    }
  }
}

export const hotelApi = {
  // Authentication
  login: (data) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  signup: (data) => apiRequest('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => apiRequest('/auth/logout', { method: 'POST', skipCache: true }),
  getCurrentUser: () => apiRequest('/auth/me'),

  // Health & Diagnostics
  checkHealth: () => apiRequest('/health'),
  checkDb: () => apiRequest('/diag/db-test'),

  // Users
  getUsers: () => apiRequest('/users'),
  createUser: (data) => {
    if (data instanceof FormData) {
      return apiRequest('/users', {
        method: 'POST',
        body: data,
        headers: {}, // Let browser set multipart boundary
      });
    }
    return apiRequest('/users', { method: 'POST', body: JSON.stringify(data) });
  },
  updateUser: (id, data) => apiRequest(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (id) => apiRequest(`/users/${id}`, { method: 'DELETE' }),
  uploadAvatar: (id, data) => {
    if (data instanceof FormData) {
      return apiRequest(`/users/${id}/avatar`, {
        method: 'POST',
        body: data,
        headers: {}, // Let browser set multipart boundary
      });
    }
    return apiRequest(`/users/${id}/avatar`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Currencies
  getCurrencies: () => apiRequest('/currencies'),
  createCurrency: (data) => apiRequest('/currencies', { method: 'POST', body: JSON.stringify(data) }),
  updateCurrency: (id, data) => apiRequest(`/currencies/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCurrency: (id) => apiRequest(`/currencies/${id}`, { method: 'DELETE' }),

  // Hotels & Properties
  getHotels: (options = {}) => apiRequest('/hotels', { ttl: 0, skipCache: true, ...options }),
  createHotel: (data) => {
    invalidateApiCache('/hotels');
    return apiRequest('/hotels', { method: 'POST', body: JSON.stringify(data) });
  },
  updateHotel: (id, data) => {
    invalidateApiCache('/hotels');
    return apiRequest(`/hotels/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  deleteHotel: (id) => {
    invalidateApiCache('/hotels');
    return apiRequest(`/hotels/${id}`, { method: 'DELETE' });
  },
  uploadHotelLogo: (id, formData) => {
    invalidateApiCache('/hotels');
    const isFormData = typeof FormData !== 'undefined' && formData instanceof FormData;
    return apiRequest(`/hotels/${id}/logo`, {
      method: 'POST',
      body: isFormData ? formData : JSON.stringify(formData),
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    });
  },

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
  getPayments: (options = {}) => apiRequest('/payments', { ttl: 0, skipCache: true, ...options }),
  createPayment: (data) => apiRequest('/payments', { method: 'POST', body: JSON.stringify(data) }),
  getInvoices: (options = {}) => apiRequest('/invoices', { ttl: 0, skipCache: true, ...options }),
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

  // ==========================================
  // SUPER ADMIN BACKEND REST APIS
  // ==========================================

  // Dashboard Stats & Analytics
  getSuperAdminStats: (options = {}) => apiRequest('/super-admin/dashboard-stats', { ttl: 0, skipCache: true, ...options }),

  // Subscription Plans
  getSubscriptionPlans: () => apiRequest('/super-admin/subscription-plans'),
  createSubscriptionPlan: (data) => apiRequest('/super-admin/subscription-plans', { method: 'POST', body: JSON.stringify(data) }),
  updateSubscriptionPlan: (id, data) => apiRequest(`/super-admin/subscription-plans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSubscriptionPlan: (id) => apiRequest(`/super-admin/subscription-plans/${id}`, { method: 'DELETE' }),

  // Subscriptions (Active/Expired)
  getSubscriptions: (status, options = {}) => {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return apiRequest(`/super-admin/subscriptions${query}`, { ttl: 0, skipCache: true, ...options });
  },
  createSubscription: (data) => apiRequest('/super-admin/subscriptions', { method: 'POST', body: JSON.stringify(data) }),
  updateSubscription: (id, data) => apiRequest(`/super-admin/subscriptions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Plan Features
  getPlanFeatures: () => apiRequest('/super-admin/plan-features'),
  createPlanFeature: (data) => apiRequest('/super-admin/plan-features', { method: 'POST', body: JSON.stringify(data) }),

  // Refunds
  getRefundRequests: (options = {}) => apiRequest('/super-admin/refund-requests', { ttl: 0, skipCache: true, ...options }),
  createRefundRequest: (data) => apiRequest('/super-admin/refund-requests', { method: 'POST', body: JSON.stringify(data) }),
  updateRefundRequest: (id, data) => apiRequest(`/super-admin/refund-requests/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Announcements
  getAnnouncements: () => apiRequest('/super-admin/announcements'),
  createAnnouncement: (data) => apiRequest('/super-admin/announcements', { method: 'POST', body: JSON.stringify(data) }),
  deleteAnnouncement: (id) => apiRequest(`/super-admin/announcements/${id}`, { method: 'DELETE' }),

  // Support Tickets, Complaints & Contact Requests
  getSupportTickets: () => apiRequest('/super-admin/support-tickets'),
  createSupportTicket: (data) => apiRequest('/super-admin/support-tickets', { method: 'POST', body: JSON.stringify(data) }),
  updateSupportTicket: (id, data) => apiRequest(`/super-admin/support-tickets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  getComplaints: () => apiRequest('/super-admin/complaints'),
  createComplaint: (data) => apiRequest('/super-admin/complaints', { method: 'POST', body: JSON.stringify(data) }),
  updateComplaint: (id, data) => apiRequest(`/super-admin/complaints/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  getContactRequests: () => apiRequest('/super-admin/contact-requests'),
  createContactRequest: (data) => apiRequest('/super-admin/contact-requests', { method: 'POST', body: JSON.stringify(data) }),
  updateContactRequest: (id, data) => apiRequest(`/super-admin/contact-requests/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Audit Logs & Platform Settings
  getAuditLogs: () => apiRequest('/super-admin/audit-logs'),
  createAuditLog: (data) => apiRequest('/super-admin/audit-logs', { method: 'POST', body: JSON.stringify(data) }),
  getPlatformSettings: () => apiRequest('/super-admin/platform-settings'),
  savePlatformSettings: (data) => apiRequest('/super-admin/platform-settings', { method: 'POST', body: JSON.stringify(data) }),

  // Dedicated Hotel Management Submenus
  getHotelDetails: (id = '') => apiRequest(`/super-admin/hotels/details${id ? `/${id}` : ''}`),
  getHotelApprovals: () => apiRequest('/super-admin/hotels/approvals'),
  getHotelStatuses: () => apiRequest('/super-admin/hotels/status'),

  // Dedicated Hotel Admin Management Submenus
  getHotelAdminAddData: (options = {}) => apiRequest('/super-admin/hotel-admins/add-data', { ttl: 0, skipCache: true, ...options }),
  getHotelAdminPermissionsData: (options = {}) => apiRequest('/super-admin/hotel-admins/permissions-data', { ttl: 0, skipCache: true, ...options }),

  // Dedicated User Management Submenus
  getUsersAllData: () => apiRequest('/super-admin/users/all-data'),
  getActiveUsersData: () => apiRequest('/super-admin/users/active-data'),
  getSuspendedUsersData: () => apiRequest('/super-admin/users/suspended-data'),

  // Dedicated Platform Reports Submenus
  getRevenueReportsData: (period = 'Annual', hotelId = '') => apiRequest(`/super-admin/reports/revenue-analytics?period=${encodeURIComponent(period)}${hotelId ? `&hotel_id=${encodeURIComponent(hotelId)}` : ''}`),

  // Dedicated Front Desk Submenus
  getCheckedInBookingsData: () => apiRequest('/front-desk/check-in-data'),
  getCheckedOutBookingsData: () => apiRequest('/front-desk/check-out-data'),

  // Notifications API
  getNotifications: (role = '') => apiRequest(`/notifications${role ? `?role=${role}` : ''}`, { ttl: 30000 }),
  markAllNotificationsRead: () => apiRequest('/notifications/mark-all-read', { method: 'POST' }),
  markNotificationRead: (id) => apiRequest(`/notifications/${id}/read`, { method: 'POST' }),

  // Universal Global Search API
  globalSearch: (query, role = '') => apiRequest(`/global-search?q=${encodeURIComponent(query)}${role ? `&role=${encodeURIComponent(role)}` : ''}`, { skipCache: true }),

  // Real MySQL Data Export
  exportModuleData: (module) => apiRequest(`/export/${module}`, { skipCache: true }),
};

export default hotelApi;

