/**
 * Lazfort Hotel ERP - Complete Enterprise Resource Planning Data Models
 * Pure JavaScript Module with Schemas, Categories & Factory Functions
 */

// ==========================================
// 1. FOLIO & CHARGE CATEGORIES
// ==========================================
export const FOLIO_CHARGE_CATEGORIES = [
  'room_charge',
  'restaurant',
  'room_service',
  'restaurant_order',
  'spa_wellness',
  'laundry',
  'minibar',
  'transport',
  'tax',
  'late_checkout',
  'damages',
];

export const FOLIO_STATUSES = [
  'open',
  'settled',
  'closed',
  'void',
];

export const INVOICE_PAYMENT_STATUSES = [
  'paid',
  'partial',
  'unpaid',
  'refunded',
];

// ==========================================
// 2. RESTAURANT & POS CATEGORIES
// ==========================================
export const RESTAURANT_ORDER_TYPES = [
  'Dine-In',
  'Room Service',
  'Poolside',
  'Takeaway',
];

export const RESTAURANT_ORDER_STATUSES = [
  'received',
  'preparing',
  'ready',
  'delivered',
  'billed',
  'cancelled',
];

export const MENU_CATEGORIES = [
  'Appetizers',
  'Main Course',
  'Fine Wines & Spirits',
  'Desserts',
  'Caviar & Seafood',
  'Breakfast',
];

// ==========================================
// 3. INVENTORY & PROCUREMENT CATEGORIES
// ==========================================
export const INVENTORY_CATEGORIES = [
  'Food & Beverage',
  'Housekeeping & Linen',
  'Guest Amenities',
  'Engineering & Maintenance',
  'Office & Stationery',
  'Fine Wine & Spirits',
];

export const STOCK_MOVEMENT_TYPES = [
  'receipt',
  'issue',
  'transfer',
  'adjustment',
  'return',
];

// ==========================================
// 4. MAINTENANCE CATEGORIES
// ==========================================
export const MAINTENANCE_CATEGORIES = [
  'HVAC & Climate',
  'Plumbing',
  'Electrical',
  'Carpentry & Furniture',
  'Audio/Visual',
  'Elevator',
];

export const MAINTENANCE_PRIORITIES = [
  'low',
  'medium',
  'high',
  'critical',
];

export const MAINTENANCE_STATUSES = [
  'open',
  'in_progress',
  'waiting_parts',
  'resolved',
  'closed',
];

// ==========================================
// 5. FIXED ASSETS CATEGORIES
// ==========================================
export const FIXED_ASSET_CATEGORIES = [
  'Furniture & Fixtures',
  'Kitchen Equipment',
  'Spa Machinery',
  'IT & Network',
  'Vehicles & Chauffeur',
];

// ==========================================
// 6. FINANCE & ACCOUNTING CATEGORIES
// ==========================================
export const ACCOUNT_TYPES = [
  'Asset',
  'Liability',
  'Equity',
  'Revenue',
  'Expense',
];

// ==========================================
// 7. AUDIT LOG CONSTANTS
// ==========================================
export const AUDIT_MODULES = [
  'Front Desk',
  'Reservations',
  'Housekeeping',
  'Restaurant',
  'Inventory',
  'Finance',
  'HR',
  'Maintenance',
  'Security',
  'Management',
  'Platform Setting',
  'Platform Management',
];

export const AUDIT_ACTIONS = [
  'CREATE',
  'UPDATE',
  'DELETE',
  'CHECK_IN',
  'CHECK_OUT',
  'CANCEL',
  'POST_CHARGE',
  'DISBURSE_PAYROLL',
  'RECEIVE_STOCK',
];

// ==========================================
// 8. FACTORY FUNCTIONS
// ==========================================

export const createDefaultFolio = (overrides = {}) => ({
  id: '',
  bookingId: '',
  bookingCode: '',
  guestId: '',
  guestName: '',
  roomNumber: '',
  status: 'open',
  charges: [],
  payments: [],
  subtotal: 0,
  totalTax: 0,
  grandTotal: 0,
  totalPaid: 0,
  balanceDue: 0,
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const createDefaultInvoice = (overrides = {}) => ({
  id: '',
  invoiceNumber: '',
  folioId: '',
  bookingCode: '',
  guestName: '',
  guestEmail: '',
  issuedDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  items: [],
  subtotal: 0,
  taxRate: 10,
  taxAmount: 0,
  discountAmount: 0,
  totalAmount: 0,
  amountPaid: 0,
  balance: 0,
  paymentStatus: 'unpaid',
  ...overrides,
});

export const createDefaultInventoryItem = (overrides = {}) => ({
  id: '',
  sku: '',
  name: '',
  category: 'Food & Beverage',
  department: '',
  unitOfMeasure: 'Units',
  currentStock: 0,
  minimumStock: 5,
  reorderPoint: 10,
  unitCost: 0,
  supplierId: '',
  supplierName: '',
  location: '',
  lastRestockedDate: new Date().toISOString().split('T')[0],
  status: 'in_stock',
  ...overrides,
});

export const createDefaultMaintenanceTicket = (overrides = {}) => ({
  id: '',
  ticketNumber: '',
  hotelId: '',
  location: '',
  category: 'Plumbing',
  title: '',
  description: '',
  priority: 'medium',
  status: 'open',
  blocksRoom: false,
  reportedBy: '',
  totalCost: 0,
  createdAt: new Date().toISOString(),
  ...overrides,
});

