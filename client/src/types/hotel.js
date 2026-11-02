/**
 * Lazfort Hotel ERP - Hotel & Property Domain Models
 * Pure JavaScript Module with JSDoc Type Definitions & Schema Constants
 */

export const ROOM_TYPES = [
  'Presidential Suite',
  'Royal Penthouse',
  'Executive Suite',
  'Deluxe Ocean Villa',
  'Grand Heritage Room',
  'Junior Suite',
];

export const ROOM_STATUSES = [
  'available',
  'occupied',
  'reserved',
  'cleaning',
  'maintenance',
];

export const CLEANING_STATUSES = [
  'clean',
  'in_progress',
  'dirty',
  'inspected',
];

export const BOOKING_STATUSES = [
  'confirmed',
  'pending',
  'checked_in',
  'checked_out',
  'cancelled',
];

export const PAYMENT_STATUSES = [
  'paid',
  'partial',
  'pending',
  'refunded',
];

export const VIP_TIERS = [
  'Standard',
  'Gold',
  'Platinum',
  'Diamond',
];

export const STAFF_DEPARTMENTS = [
  'Front Desk',
  'Housekeeping',
  'F&B Service',
  'Concierge',
  'Management',
  'Security',
];

export const STAFF_SHIFTS = [
  'Morning (07:00 - 15:30)',
  'Evening (15:00 - 23:30)',
  'Night (23:00 - 07:30)',
];

export const HOTEL_SUBSCRIPTION_PLANS = [
  'Palace Enterprise',
  'Grand Luxury',
  'Boutique Elite',
];

/**
 * Factory to create a default Room object
 * @param {Partial<Object>} overrides
 * @returns {Object}
 */
export const createDefaultRoom = (overrides = {}) => ({
  id: '',
  roomNumber: '',
  name: '',
  type: 'Executive Suite',
  floor: 1,
  capacity: 2,
  bedType: 'King',
  pricePerNight: 500,
  status: 'available',
  amenities: [],
  images: [],
  sizeSqFt: 650,
  view: 'Ocean Front',
  rating: 5,
  cleaningStatus: 'clean',
  description: '',
  ...overrides,
});

/**
 * Factory to create a default Booking object
 * @param {Partial<Object>} overrides
 * @returns {Object}
 */
export const createDefaultBooking = (overrides = {}) => ({
  id: '',
  bookingCode: '',
  guestId: '',
  guestName: '',
  guestEmail: '',
  guestPhone: '',
  roomId: '',
  roomNumber: '',
  roomType: 'Executive Suite',
  checkIn: new Date().toISOString().split('T')[0],
  checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  nights: 1,
  adults: 2,
  children: 0,
  totalAmount: 500,
  paidAmount: 0,
  status: 'confirmed',
  paymentStatus: 'pending',
  specialRequests: '',
  createdAt: new Date().toISOString(),
  ...overrides,
});

/**
 * Factory to create a default Guest object
 * @param {Partial<Object>} overrides
 * @returns {Object}
 */
export const createDefaultGuest = (overrides = {}) => ({
  id: '',
  name: '',
  email: '',
  phone: '',
  nationality: '',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  vipTier: 'Gold',
  totalStays: 1,
  totalSpent: 0,
  lastStay: new Date().toISOString().split('T')[0],
  status: 'active',
  idNumber: '',
  loyaltyPoints: 0,
  preferences: [],
  ...overrides,
});

/**
 * Factory to create a default HotelProperty object
 * @param {Partial<Object>} overrides
 * @returns {Object}
 */
export const createDefaultHotelProperty = (overrides = {}) => ({
  id: '',
  name: '',
  location: '',
  stars: 5,
  totalRooms: 50,
  occupancyRate: 85,
  revenueThisMonth: 120000,
  adminName: '',
  adminEmail: '',
  adminContact: '',
  status: 'active',
  subscriptionPlan: 'Palace Enterprise',
  image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  createdAt: new Date().toISOString(),
  ...overrides,
});

