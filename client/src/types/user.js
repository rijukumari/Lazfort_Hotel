/**
 * Lazfort Hotel ERP - User & Authentication Domain Models
 * Pure JavaScript Module with Role Constants & Factory Functions
 */

export const USER_ROLES = [
  'super_admin',
  'hotel_admin',
  'receptionist',
  'customer',
  'housekeeping',
  'staff',
];

export const MEMBERSHIP_TIERS = [
  'Standard',
  'VIP',
  'Diamond',
];

export const USER_STATUSES = [
  'active',
  'suspended',
  'pending',
];

/**
 * Factory to create a default User object
 * @param {Partial<Object>} overrides
 * @returns {Object}
 */
export const createDefaultUser = (overrides = {}) => ({
  id: '',
  name: '',
  email: '',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  hotelId: '',
  hotelName: '',
  department: '',
  status: 'active',
  lastActive: new Date().toISOString(),
  membershipTier: 'Standard',
  vipStatus: false,
  phone: '',
  nationality: '',
  address: '',
  idNumber: '',
  loyaltyPoints: 0,
  totalStays: 0,
  totalSpent: 0,
  preferences: [],
  ...overrides,
});

