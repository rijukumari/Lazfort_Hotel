import { PaymentTransaction, RestaurantOrder } from '../types/hotel';

export const mockPayments: PaymentTransaction[] = [
  {
    id: 'pay-501',
    transactionId: 'TXN-9982401',
    bookingCode: 'AUR-9921',
    guestName: 'Sir Alexander Kensington',
    amount: 24000,
    currency: 'USD',
    method: 'Credit Card',
    status: 'completed',
    date: '2026-10-25 14:32'
  },
  {
    id: 'pay-502',
    transactionId: 'TXN-9982402',
    bookingCode: 'AUR-9922',
    guestName: 'Dr. Vivienne Moreau',
    amount: 7000,
    currency: 'USD',
    method: 'Luxury Concierge',
    status: 'completed',
    date: '2026-10-27 10:15'
  },
  {
    id: 'pay-503',
    transactionId: 'TXN-9982403',
    bookingCode: 'AUR-9923',
    guestName: 'Baron Mateo Rossi',
    amount: 14400,
    currency: 'USD',
    method: 'Wire Transfer',
    status: 'completed',
    date: '2026-10-15 16:40'
  },
  {
    id: 'pay-504',
    transactionId: 'TXN-9982404',
    bookingCode: 'AUR-9926',
    guestName: 'Marcus Aurelius Vance',
    amount: 2940,
    currency: 'USD',
    method: 'Credit Card',
    status: 'refunded',
    date: '2026-10-24 09:20'
  },
  {
    id: 'pay-505',
    transactionId: 'TXN-9982405',
    bookingCode: 'AUR-9924',
    guestName: 'Evelyn St. Claire',
    amount: 3300,
    currency: 'USD',
    method: 'Credit Card',
    status: 'pending',
    date: '2026-10-27 18:00'
  }
];

export const mockRestaurantOrders: RestaurantOrder[] = [
  {
    id: 'ord-301',
    orderNumber: 'RO-4401',
    roomNumber: 'PH-1201',
    guestName: 'Sir Alexander Kensington',
    items: [
      { name: 'Beluga Imperial Caviar (50g)', quantity: 1, price: 540 },
      { name: 'Kobe Wagyu Ribeye A5', quantity: 2, price: 380 },
      { name: 'Château Margaux 2010', quantity: 1, price: 1850 }
    ],
    total: 2770,
    status: 'delivered',
    time: '19:45'
  },
  {
    id: 'ord-302',
    orderNumber: 'RO-4402',
    tableNumber: 'Table 7 (Grand Veranda)',
    guestName: 'Dr. Vivienne Moreau',
    items: [
      { name: 'Brittany Blue Lobster Bisque', quantity: 2, price: 95 },
      { name: 'Black Winter Truffle Tagliolini', quantity: 2, price: 140 },
      { name: 'Cristal Louis Roederer 2014', quantity: 1, price: 650 }
    ],
    total: 1025,
    status: 'preparing',
    time: '20:10'
  }
];
