/**
 * Lazfort Hotel ERP - Subscription & SaaS Tier Models
 * Pure JavaScript Module with Category Constants & Factory Functions
 */

export const FEATURE_CATEGORIES = [
  'Hotel Management',
  'Room Management',
  'Reservations and Booking',
  'Front Desk',
  'Customer Panel',
  'Housekeeping',
  'Restaurant and Room Service',
  'Inventory and Procurement',
  'Finance and Accounting',
  'HR and Payroll',
  'CRM and Guest Services',
  'Reports and Analytics',
  'Multi-Branch Management',
];

export const SUBSCRIPTION_STATUSES = [
  'active',
  'expiring_soon',
  'trial',
  'expired',
  'suspended',
];

export const SUBSCRIPTION_PAYMENT_STATUSES = [
  'paid',
  'pending',
  'overdue',
  'failed',
];

export const SUBSCRIPTION_TIERS = [
  'Boutique Elite',
  'Grand Luxury',
  'Palace Enterprise',
];

/**
 * Factory to create a default SubscriptionPlan
 * @param {Partial<Object>} overrides
 * @returns {Object}
 */
export const createDefaultSubscriptionPlan = (overrides = {}) => ({
  id: '',
  name: '',
  tierCode: '',
  description: '',
  monthlyPrice: 0,
  annualPrice: 0,
  roomLimit: 'Unlimited',
  userLimit: 'Unlimited',
  includedModules: [],
  features: [],
  trialDays: 14,
  status: 'active',
  isPopular: false,
  recommendedFor: '',
  accentColor: '',
  badge: '',
  ...overrides,
});

/**
 * Factory to create a default HotelSubscription
 * @param {Partial<Object>} overrides
 * @returns {Object}
 */
export const createDefaultHotelSubscription = (overrides = {}) => ({
  id: '',
  subscriptionId: '',
  hotelId: '',
  hotelName: '',
  hotelLocation: '',
  hotelStars: 5,
  hotelImage: '',
  planId: '',
  planName: 'Palace Enterprise',
  billingCycle: 'Monthly',
  amount: 4900,
  startDate: new Date().toISOString().split('T')[0],
  expiryDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
  paymentStatus: 'paid',
  status: 'active',
  autoRenew: true,
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  totalRenewals: 0,
  ...overrides,
});

/**
 * Factory to create a default PlanFeature
 * @param {Partial<Object>} overrides
 * @returns {Object}
 */
export const createDefaultPlanFeature = (overrides = {}) => ({
  id: '',
  code: '',
  name: '',
  description: '',
  category: 'Hotel Management',
  applicablePlans: ['Palace Enterprise', 'Grand Luxury'],
  configuredLimits: 'Unlimited',
  status: 'enabled',
  isCore: false,
  minTier: 'Palace Enterprise',
  ...overrides,
});

