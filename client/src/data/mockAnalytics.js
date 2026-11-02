export const monthlyRevenueData = [
  { label: 'May', value: 920000, secondaryValue: 810000 },
  { label: 'Jun', value: 1150000, secondaryValue: 940000 },
  { label: 'Jul', value: 1420000, secondaryValue: 1200000 },
  { label: 'Aug', value: 1680000, secondaryValue: 1350000 },
  { label: 'Sep', value: 1310000, secondaryValue: 1100000 },
  { label: 'Oct', value: 1490000, secondaryValue: 1240000 }
];

export const weeklyOccupancyData = [
  { label: 'Mon', value: 78 },
  { label: 'Tue', value: 84 },
  { label: 'Wed', value: 89 },
  { label: 'Thu', value: 92 },
  { label: 'Fri', value: 98 },
  { label: 'Sat', value: 100 },
  { label: 'Sun', value: 86 }
];

export const roomCategoryDistribution = [
  { label: 'Presidential Suites', count: 12, percentage: 15, color: '#C6A66B' },
  { label: 'Royal Penthouses', count: 18, percentage: 22, color: '#1B2432' },
  { label: 'Deluxe Ocean Villas', count: 24, percentage: 30, color: '#4F772D' },
  { label: 'Executive Suites', count: 26, percentage: 33, color: '#3A5A40' }
];

export const superAdminMetrics = {
  totalRevenue: '$4,110,000',
  revenueGrowth: '+18.4% vs last mo',
  activeHotels: '18 Global Properties',
  hotelGrowth: '+3 this quarter',
  totalBookings: '3,842 Stays',
  bookingGrowth: '+12.6%',
  averageDailyRate: '$1,890 / night',
  adrGrowth: '+6.2%'
};

export const hotelAdminMetrics = {
  todaysOccupancy: '91.4%',
  occupancyNote: '+4.2% higher than seasonal target',
  revPar: '$1,680',
  revParNote: '+9.1% RevPAR index',
  activeGuests: '184 VIP Guests',
  guestsInHouse: '142 Suites Checked-In',
  staffOnDuty: '38 Personnel On Shift'
};

export default {
  monthlyRevenueData,
  weeklyOccupancyData,
  roomCategoryDistribution,
  superAdminMetrics,
  hotelAdminMetrics
};

