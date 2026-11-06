import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockRooms } from '../data/mockRooms';
import { mockBookings } from '../data/mockBookings';
import { mockGuests } from '../data/mockGuests';
import { mockHotels } from '../data/mockHotels';
import { mockStaff } from '../data/mockStaff';
import { mockHousekeepingTasks as mockCleaningTasks } from '../data/mockHousekeeping';
import { mockSubscriptionPlans, mockPlanFeatures } from '../data/mockSubscriptions';
import {
  mockGuestFolios,
  mockInvoices,
  mockRestaurantOrders,
  mockInventoryItems,
  mockStockMovements,
  mockSuppliers,
  mockMaintenanceTickets,
  mockFixedAssets,
  mockChartOfAccounts,
  mockJournalEntries,
  mockPayrollRun,
  mockAuditLogs
} from '../data/mockERPData';
import {
  mockMenuCategories,
  mockMenuItemsData,
  mockRestaurantTables,
  mockInitialFoodOrders,
  mockRestaurantBills,
} from '../data/mockRestaurantData';
import { useAuth } from './AuthContext';
import { hotelApi, invalidateApiCache } from '../services/hotelApi';
import { DEFAULT_CURRENCIES, getCurrencySymbol } from '../data/mockCurrencies';
import {
  initialPaymentTransactions,
  initialRefundRequests,
  initialBillingInvoices,
  initialAnnouncements,
  initialSupportTickets,
  initialComplaints,
  initialContactRequests,
} from '../data/mockSuperAdminModules';

const STORAGE_KEY = 'lazfort_erp_database_v1';

const ERPContext = createContext(undefined);

export const ERPProvider = ({ children }) => {
  const { user } = useAuth();

  // Helper to load or initialize state
  const loadInitialData = (key, fallback) => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${key}`) || localStorage.getItem(`aurelia_erp_database_v1_${key}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn(`Failed to parse ERP state for ${key}`, e);
    }
    return fallback;
  };

  const [rooms, setRooms] = useState(() => loadInitialData('rooms', mockRooms));
  const [bookings, setBookings] = useState(() => loadInitialData('bookings', mockBookings));
  const [guests, setGuests] = useState(() => loadInitialData('guests', mockGuests));
  const [cleaningTasks, setCleaningTasks] = useState(() => loadInitialData('cleaningTasks', mockCleaningTasks));
  const [folios, setFolios] = useState(() => loadInitialData('folios', mockGuestFolios));
  const [invoices, setInvoices] = useState(() => loadInitialData('invoices', mockInvoices));
  const [restaurantOrders, setRestaurantOrders] = useState(() => loadInitialData('orders', mockInitialFoodOrders || mockRestaurantOrders));
  const [menuCategories, setMenuCategories] = useState(() => loadInitialData('restaurant_categories', mockMenuCategories));
  const [menuItems, setMenuItems] = useState(() => loadInitialData('restaurant_menu_items', mockMenuItemsData));
  const [restaurantTables, setRestaurantTables] = useState(() => loadInitialData('restaurant_tables', mockRestaurantTables));
  const [restaurantBills, setRestaurantBills] = useState(() => loadInitialData('restaurant_bills', mockRestaurantBills));
  const [inventoryItems, setInventoryItems] = useState(() => loadInitialData('inventory', mockInventoryItems));
  const [stockMovements, setStockMovements] = useState(() => loadInitialData('movements', mockStockMovements));
  const [suppliers, setSuppliers] = useState(() => loadInitialData('suppliers', mockSuppliers));
  const [maintenanceTickets, setMaintenanceTickets] = useState(() => loadInitialData('maintenance', mockMaintenanceTickets));
  const [fixedAssets, setFixedAssets] = useState(() => loadInitialData('assets', mockFixedAssets));
  const [chartOfAccounts, setChartOfAccounts] = useState(() => loadInitialData('coa', mockChartOfAccounts));
  const [journalEntries, setJournalEntries] = useState(() => loadInitialData('journal', mockJournalEntries));
  const [payrollRuns, setPayrollRuns] = useState(() => loadInitialData('payroll', [mockPayrollRun]));
  const [payments, setPayments] = useState(() => loadInitialData('payments', [
    {
      id: 'TX-98421',
      transactionRef: 'TX-98421',
      guestName: 'Duke William Somerset',
      bookingCode: 'AUR-9921',
      folioId: 'folio-001',
      paymentMethod: 'Centurion Black Card',
      amount: 14400,
      date: '2026-10-28',
      status: 'paid',
      notes: 'Advance deposit settled via luxury concierge terminal',
      createdAt: '2026-10-28T14:20:00Z',
    },
    {
      id: 'TX-98422',
      transactionRef: 'TX-98422',
      guestName: 'Baroness Genevieve von Stauffen',
      bookingCode: 'AUR-9922',
      folioId: 'folio-002',
      paymentMethod: 'International Wire Transfer',
      amount: 8600,
      date: '2026-10-29',
      status: 'paid',
      notes: 'Full penthouse stay settled via UBS Private Banking',
      createdAt: '2026-10-29T10:15:00Z',
    },
    {
      id: 'TX-98423',
      transactionRef: 'TX-98423',
      guestName: 'Sheikh Mansoor Al-Nahyan',
      bookingCode: 'AUR-9923',
      folioId: 'folio-001',
      paymentMethod: 'Centurion Black Card',
      amount: 32000,
      date: '2026-10-30',
      status: 'paid',
      notes: 'Royal Presidential Suite buyout settlement',
      createdAt: '2026-10-30T16:45:00Z',
    },
    {
      id: 'TX-98424',
      transactionRef: 'TX-98424',
      guestName: 'Countess Eleonora Rossi',
      bookingCode: 'AUR-9924',
      folioId: 'folio-002',
      paymentMethod: 'Visa Infinite',
      amount: 3800,
      date: '2026-10-30',
      status: 'pending',
      notes: 'Concierge yacht charter charge verification pending',
      createdAt: '2026-10-30T18:10:00Z',
    },
    {
      id: 'TX-98425',
      transactionRef: 'TX-98425',
      guestName: 'Lord Alistair Sterling',
      bookingCode: 'AUR-9925',
      folioId: 'folio-001',
      paymentMethod: 'Mastercard World Elite',
      amount: 1250,
      date: '2026-10-27',
      status: 'refunded',
      notes: 'Spa hydrotherapy cancellation refund processed',
      createdAt: '2026-10-27T11:30:00Z',
    }
  ]));
  const [auditLogs, setAuditLogs] = useState(() => loadInitialData('audit', mockAuditLogs));
  const [hotels, setHotels] = useState(() => loadInitialData('hotels', mockHotels));
  const [staff, setStaff] = useState(() => loadInitialData('staff', mockStaff));
  const [subscriptionPlans, setSubscriptionPlans] = useState(() => loadInitialData('plans', mockSubscriptionPlans));
  const [planFeatures, setPlanFeatures] = useState(() => loadInitialData('features', mockPlanFeatures));
  const [currencies, setCurrencies] = useState(() => loadInitialData('currencies', DEFAULT_CURRENCIES));
  const [refundRequests, setRefundRequests] = useState(() => loadInitialData('refund_requests', initialRefundRequests));
  const [announcements, setAnnouncements] = useState(() => loadInitialData('announcements', initialAnnouncements));
  const [supportTickets, setSupportTickets] = useState(() => loadInitialData('support_tickets', initialSupportTickets));
  const [complaints, setComplaints] = useState(() => loadInitialData('complaints', initialComplaints));
  const [contactRequests, setContactRequests] = useState(() => loadInitialData('contact_requests', initialContactRequests));
  const [platformSettings, setPlatformSettings] = useState(() => loadInitialData('platform_settings', {}));

  // Initial fetch from Laravel MySQL backend on mount: only essential session items (currencies & active hotel context)
  useEffect(() => {
    let isMounted = true;
    const fetchBackendData = async () => {
      try {
        const [apiCurrencies, apiHotels] = await Promise.allSettled([
          hotelApi.getCurrencies(),
          hotelApi.getHotels(),
        ]);

        if (!isMounted) return;

        // If backend returned currencies, sync them
        if (apiCurrencies.status === 'fulfilled' && Array.isArray(apiCurrencies.value) && apiCurrencies.value.length > 0) {
          setCurrencies(apiCurrencies.value);
          localStorage.setItem(`${STORAGE_KEY}_currencies`, JSON.stringify(apiCurrencies.value));
        }

        // If backend returned hotels, sync them
        if (apiHotels.status === 'fulfilled' && Array.isArray(apiHotels.value) && apiHotels.value.length > 0) {
          setHotels(apiHotels.value.map(h => ({
            ...h,
            totalRooms: h.total_rooms || h.totalRooms || 0,
            subscriptionPlan: h.subscription_plan || h.subscriptionPlan || 'Enterprise Luxury',
            currencyCode: h.currency_code || h.currencyCode || 'USD',
          })));
        }
      } catch (err) {
        console.warn('ERPContext initial sync deferred:', err);
      }
    };

    fetchBackendData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-sync state to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_staff`, JSON.stringify(staff));
  }, [staff]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_hotels`, JSON.stringify(hotels));
  }, [hotels]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_plans`, JSON.stringify(subscriptionPlans));
  }, [subscriptionPlans]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_features`, JSON.stringify(planFeatures));
  }, [planFeatures]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_rooms`, JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_bookings`, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_guests`, JSON.stringify(guests));
  }, [guests]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_folios`, JSON.stringify(folios));
  }, [folios]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_invoices`, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_orders`, JSON.stringify(restaurantOrders));
  }, [restaurantOrders]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_inventory`, JSON.stringify(inventoryItems));
  }, [inventoryItems]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_movements`, JSON.stringify(stockMovements));
  }, [stockMovements]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_maintenance`, JSON.stringify(maintenanceTickets));
  }, [maintenanceTickets]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_cleaningTasks`, JSON.stringify(cleaningTasks));
  }, [cleaningTasks]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_coa`, JSON.stringify(chartOfAccounts));
  }, [chartOfAccounts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_journal`, JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_payments`, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_orders`, JSON.stringify(restaurantOrders));
  }, [restaurantOrders]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_restaurant_categories`, JSON.stringify(menuCategories));
  }, [menuCategories]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_restaurant_menu_items`, JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_restaurant_tables`, JSON.stringify(restaurantTables));
  }, [restaurantTables]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_restaurant_bills`, JSON.stringify(restaurantBills));
  }, [restaurantBills]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_inventory`, JSON.stringify(inventoryItems));
  }, [inventoryItems]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_movements`, JSON.stringify(stockMovements));
  }, [stockMovements]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_suppliers`, JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_assets`, JSON.stringify(fixedAssets));
  }, [fixedAssets]);

  // Internal Audit Log Recorder
  const logAudit = (action, module, recordId, description) => {
    const newLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      userId: user?.id || 'usr-system',
      userName: user?.name || 'System Operator',
      role: user?.role || 'hotel_admin',
      action,
      module,
      recordId,
      description,
      ipAddress: '127.0.0.1 (Internal Gateway)',
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // Persist to Laravel REST API + MySQL database
    hotelApi.createAuditLog({
      action,
      module,
      targetId: recordId,
      description,
      performedBy: user?.name || 'Super Administrator',
    }).catch(() => {});
  };

  // =========================================================================
  // CURRENCIES MANAGEMENT (CRUD & RESOLVER)
  // =========================================================================
  const addCurrency = async (currencyData) => {
    const code = (currencyData.currency_code || currencyData.currencyCode || '').toUpperCase().trim();
    const newCurr = {
      ...currencyData,
      currency_code: code,
      currency_name: currencyData.currency_name || currencyData.currencyName,
      currency_symbol: currencyData.currency_symbol || currencyData.currencySymbol,
      id: currencyData.id || Date.now(),
      is_default: false,
      is_active: true,
    };

    setCurrencies(prev => {
      const exists = prev.some(c => c.currency_code?.toUpperCase() === code);
      if (exists) return prev;
      const updated = [...prev, newCurr];
      localStorage.setItem(`${STORAGE_KEY}_currencies`, JSON.stringify(updated));
      return updated;
    });

    try {
      const res = await hotelApi.createCurrency(newCurr);
      if (res && res.id) {
        setCurrencies(prev => prev.map(c => c.currency_code === code ? res : c));
      }
    } catch (err) {
      console.warn('Could not persist currency to MySQL:', err.message);
    }

    logAudit('CREATE', 'Currencies', code, `Added custom currency ${newCurr.currency_name} (${code} - ${newCurr.currency_symbol})`);
    return { success: true, currency: newCurr };
  };

  const updateCurrency = async (id, data) => {
    setCurrencies(prev => {
      const updated = prev.map(c => (c.id === id || c.currency_code === id ? { ...c, ...data } : c));
      localStorage.setItem(`${STORAGE_KEY}_currencies`, JSON.stringify(updated));
      return updated;
    });
    try {
      await hotelApi.updateCurrency(id, data);
    } catch (err) {
      console.warn('Could not update currency in MySQL:', err.message);
    }
    logAudit('UPDATE', 'Currencies', id, `Updated currency details for ${id}`);
    return { success: true };
  };

  const deleteCurrency = async (id) => {
    setCurrencies(prev => {
      const updated = prev.filter(c => c.id !== id && c.currency_code !== id);
      localStorage.setItem(`${STORAGE_KEY}_currencies`, JSON.stringify(updated));
      return updated;
    });
    try {
      await hotelApi.deleteCurrency(id);
    } catch (err) {
      console.warn('Could not delete currency in MySQL:', err.message);
    }
    logAudit('DELETE', 'Currencies', id, `Removed custom currency ${id}`);
    return { success: true };
  };

  /**
   * Helper to resolve the active hotel's currency symbol dynamically
   * Priority: passed hotelId -> logged-in user's hotelId -> active property -> fallback USD ($)
   */
  const getHotelCurrencySymbol = (hotelId) => {
    const targetHotelId = hotelId || user?.hotelId || 'hotel-001';
    const targetHotel = hotels.find(h => h.id === targetHotelId);
    const code = targetHotel?.currencyCode || targetHotel?.currency_code || 'USD';
    return getCurrencySymbol(code, currencies);
  };

  const getHotelCurrencyCode = (hotelId) => {
    const targetHotelId = hotelId || user?.hotelId || 'hotel-001';
    const targetHotel = hotels.find(h => h.id === targetHotelId);
    return targetHotel?.currencyCode || targetHotel?.currency_code || 'USD';
  };

  // =========================================================================
  // SUPER ADMIN: HOTEL PROPERTIES MANAGEMENT
  // =========================================================================
  const addHotel = async (hotelData) => {
    const newHotel = {
      ...hotelData,
      id: hotelData.id || `hotel-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
    };
    setHotels(prev => [newHotel, ...prev]);

    // Persist directly to Laravel REST API -> MySQL hotel_erp.hotels table
    try {
      await hotelApi.createHotel({
        id: newHotel.id,
        name: newHotel.name,
        location: newHotel.location,
        total_rooms: Number(newHotel.totalRooms || 0),
        subscription_plan: newHotel.subscriptionPlan || 'Palace Enterprise',
        currency_code: newHotel.currencyCode || 'USD',
        status: newHotel.status || 'active',
        brand: newHotel.brand || 'Lazfort Sovereign Portfolio',
        phone: newHotel.adminContact || newHotel.phone || '+1 (800) 555-0199',
        email: newHotel.adminEmail || newHotel.email || 'gm@resort.com',
        image: newHotel.image,
      });
    } catch (err) {
      console.warn('Could not persist hotel directly to MySQL backend:', err.message);
    }

    logAudit('CREATE', 'Platform Setting', newHotel.id, `Onboarded new luxury property: ${newHotel.name}`);
    invalidateApiCache('/super-admin/dashboard-stats');
    return { success: true, message: `Successfully onboarded ${newHotel.name}`, hotel: newHotel };
  };

  const updateHotelStatus = (hotelId, status) => {
    setHotels(prev =>
      prev.map(h => (h.id === hotelId ? { ...h, status } : h))
    );
    hotelApi.updateHotel(hotelId, { status }).catch(() => {});
    logAudit('UPDATE', 'Platform Setting', hotelId, `Updated property status to ${status}`);
  };

  const updateHotel = (hotelId, data) => {
    setHotels(prev =>
      prev.map(h => (h.id === hotelId ? { ...h, ...data } : h))
    );
    hotelApi.updateHotel(hotelId, {
      ...data,
      ...(data.currencyCode ? { currency_code: data.currencyCode } : {}),
      ...(data.totalRooms ? { total_rooms: data.totalRooms } : {}),
      ...(data.subscriptionPlan ? { subscription_plan: data.subscriptionPlan } : {}),
    }).catch(() => {});
    logAudit('UPDATE', 'Platform Setting', hotelId, `Updated property details for ${data?.name || hotelId}`);
  };

  const deleteHotel = (hotelId) => {
    setHotels(prev => prev.filter(h => h.id !== hotelId));
    hotelApi.deleteHotel(hotelId).catch(() => {});
    logAudit('DELETE', 'Platform Setting', hotelId, `Removed hotel property ${hotelId}`);
    invalidateApiCache('/super-admin/dashboard-stats');
    return { success: true };
  };

  // =========================================================================
  // WORKFLOW 1: RESERVATION CREATION (WITH CONFLICT CHECK & AUTO-FOLIO SETUP)
  // =========================================================================
  const createReservation = (data) => {
    if (!data.roomId || !data.guestName || !data.checkIn || !data.checkOut) {
      return { success: false, message: 'Missing mandatory reservation details (Room, Guest Name, or Dates).' };
    }

    const targetRoom = rooms.find(r => r.id === data.roomId);
    if (!targetRoom) {
      return { success: false, message: 'Assigned room does not exist in inventory.' };
    }

    const checkInDate = new Date(data.checkIn).getTime();
    const checkOutDate = new Date(data.checkOut).getTime();

    if (checkOutDate <= checkInDate) {
      return { success: false, message: 'Check-out date must be after check-in date.' };
    }

    const hasOverlap = bookings.some(b => {
      if (b.roomId !== data.roomId || b.status === 'cancelled' || b.status === 'checked_out') {
        return false;
      }
      const bIn = new Date(b.checkIn).getTime();
      const bOut = new Date(b.checkOut).getTime();
      return checkInDate < bOut && checkOutDate > bIn;
    });

    if (hasOverlap) {
      return {
        success: false,
        message: `Suite ${targetRoom.roomNumber} is already occupied or reserved during selected dates.`,
      };
    }

    const bookingId = `bkg-${Date.now()}`;
    const bookingCode = `LAZ-${Math.floor(1000 + Math.random() * 9000)}`;
    const nights = Math.max(1, Math.round((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)));
    const totalAmount = data.totalAmount || targetRoom.pricePerNight * nights;

    const newBooking = {
      id: bookingId,
      bookingCode,
      guestId: data.guestId || `gst-${Date.now()}`,
      guestName: data.guestName,
      guestEmail: data.guestEmail || `${data.guestName.toLowerCase().replace(/\s+/g, '.')}@luxuryguest.mc`,
      guestPhone: data.guestPhone || '+377 98 00 12 34',
      roomId: targetRoom.id,
      roomNumber: targetRoom.roomNumber,
      roomType: targetRoom.type,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      nights,
      adults: data.adults || 2,
      children: data.children || 0,
      totalAmount,
      paidAmount: data.paidAmount || 0,
      status: 'confirmed',
      paymentStatus: data.paymentStatus || ((data.paidAmount || 0) >= totalAmount ? 'paid' : (data.paidAmount || 0) > 0 ? 'partial' : 'pending'),
      paymentMethod: data.paymentMethod || 'pay_at_hotel',
      roomCount: data.roomCount || 1,
      baseAmount: data.baseAmount || targetRoom.pricePerNight * nights,
      taxAmount: data.taxAmount || Math.round(totalAmount * 0.1),
      serviceFee: data.serviceFee || Math.round(totalAmount * 0.05),
      discountAmount: data.discountAmount || 0,
      specialRequests: data.specialRequests,
      createdAt: new Date().toISOString(),
    };

    setRooms(prev =>
      prev.map(r => (r.id === targetRoom.id ? { ...r, status: 'reserved' } : r))
    );

    const newFolio = {
      id: `folio-${Date.now()}`,
      bookingId,
      bookingCode,
      guestId: newBooking.guestId,
      guestName: newBooking.guestName,
      roomNumber: newBooking.roomNumber,
      status: 'open',
      charges: [
        {
          id: `chg-${Date.now()}-1`,
          folioId: `folio-${Date.now()}`,
          date: data.checkIn,
          category: 'room_charge',
          description: `${targetRoom.type} — Accommodation (${nights} nights @ $${targetRoom.pricePerNight.toLocaleString()}/night)`,
          quantity: nights,
          unitPrice: targetRoom.pricePerNight,
          taxAmount: Math.round(totalAmount * 0.1),
          totalAmount: Math.round(totalAmount * 1.1),
          postedBy: 'Reservation Engine',
          createdAt: new Date().toISOString(),
        }
      ],
      payments: data.paidAmount && data.paidAmount > 0 ? [
        {
          id: `pay-${Date.now()}-1`,
          folioId: `folio-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          amount: data.paidAmount,
          paymentMethod: 'Credit Card',
          transactionReference: `TX-ADV-${Math.floor(10000 + Math.random() * 90000)}`,
          receivedBy: user?.name || 'Front Desk',
          notes: 'Advance reservation deposit',
        }
      ] : [],
      subtotal: totalAmount,
      totalTax: Math.round(totalAmount * 0.1),
      grandTotal: Math.round(totalAmount * 1.1),
      totalPaid: data.paidAmount || 0,
      balanceDue: Math.max(0, Math.round(totalAmount * 1.1) - (data.paidAmount || 0)),
      createdAt: new Date().toISOString(),
    };

    setBookings(prev => [newBooking, ...prev]);
    setFolios(prev => [newFolio, ...prev]);

    // Persist to Laravel MySQL backend
    hotelApi.createBooking({
      id: newBooking.id,
      booking_code: newBooking.bookingCode,
      guest_name: newBooking.guestName,
      guest_email: newBooking.guestEmail,
      guest_phone: newBooking.guestPhone,
      room_number: newBooking.roomNumber,
      room_type: newBooking.roomType,
      check_in_date: newBooking.checkIn || newBooking.checkInDate,
      check_out_date: newBooking.checkOut || newBooking.checkOutDate,
      adults: newBooking.adults || 1,
      children: newBooking.children || 0,
      total_amount: newBooking.totalAmount,
      paid_amount: newBooking.paidAmount || 0,
      status: newBooking.status,
      payment_status: newBooking.paymentStatus,
      booking_source: newBooking.bookingSource || 'Front Desk',
      special_requests: newBooking.specialRequests,
    }).catch(err => console.warn('Could not persist booking to MySQL backend:', err.message));

    logAudit(
      'CREATE',
      'Reservations',
      bookingCode,
      `New reservation created for ${newBooking.guestName} in Suite ${newBooking.roomNumber} (${nights} nights, $${totalAmount.toLocaleString()}).`
    );

    return {
      success: true,
      message: `Reservation ${bookingCode} confirmed for ${newBooking.guestName} in Suite ${newBooking.roomNumber}.`,
      booking: newBooking,
    };
  };

  // =========================================================================
  // WORKFLOW 1.5: BOOKING CANCELLATION & AVAILABILITY ENGINE
  // =========================================================================
  const cancelBooking = (bookingId, reason = 'Cancelled by customer request') => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
      return { success: false, message: 'Booking record not found.' };
    }

    if (booking.status === 'checked_in') {
      return { success: false, message: 'Cannot cancel an in-house stay that is already checked in. Please contact front desk.' };
    }

    if (booking.status === 'checked_out') {
      return { success: false, message: 'Cannot cancel a completed stay.' };
    }

    if (booking.status === 'cancelled') {
      return { success: false, message: 'Booking is already cancelled.' };
    }

    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId
          ? {
              ...b,
              status: 'cancelled',
              paymentStatus: b.paymentStatus === 'paid' ? 'refunded' : b.paymentStatus,
              cancellationReason: reason,
              cancelledAt: new Date().toISOString(),
            }
          : b
      )
    );

    // Sync cancellation to Laravel MySQL backend
    hotelApi.updateBooking(bookingId, {
      status: 'cancelled',
      payment_status: booking.paymentStatus === 'paid' ? 'refunded' : booking.paymentStatus,
    }).catch(err => console.warn('Could not update booking cancellation on backend:', err.message));

    setRooms(prev =>
      prev.map(r => (r.id === booking.roomId && (r.status === 'reserved' || r.status === 'occupied') ? { ...r, status: 'available' } : r))
    );

    setFolios(prev =>
      prev.map(f => (f.bookingId === bookingId ? { ...f, status: 'void' } : f))
    );

    logAudit(
      'CANCEL',
      'Reservations',
      booking.bookingCode,
      `Reservation ${booking.bookingCode} for ${booking.guestName} cancelled. Reason: ${reason}. Room ${booking.roomNumber} released to inventory.`
    );

    return {
      success: true,
      message: `Reservation ${booking.bookingCode} successfully cancelled. Room has been released.`,
    };
  };

  const approveBooking = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return { success: false, message: 'Booking not found.' };
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'confirmed' } : b));
    setRooms(prev => prev.map(r => r.id === booking.roomId && r.status === 'available' ? { ...r, status: 'reserved' } : r));
    hotelApi.updateBooking(bookingId, { status: 'confirmed' }).catch(() => {});
    logAudit('APPROVE', 'Reservations', booking.bookingCode, `Approved pending reservation for ${booking.guestName}`);
    return { success: true, message: `Reservation ${booking.bookingCode} confirmed successfully.` };
  };

  const updateBooking = (bookingId, updatedData) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, ...updatedData } : b));
    hotelApi.updateBooking(bookingId, updatedData).catch(() => {});
    logAudit('UPDATE', 'Reservations', bookingId, `Updated reservation details`);
    return { success: true, message: 'Reservation details updated successfully.' };
  };

  const deleteBooking = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    setBookings(prev => prev.filter(b => b.id !== bookingId));
    hotelApi.deleteBooking(bookingId).catch(() => {});
    if (booking) {
      setRooms(prev => prev.map(r => r.id === booking.roomId && r.status === 'reserved' ? { ...r, status: 'available' } : r));
      logAudit('DELETE', 'Reservations', booking.bookingCode, `Permanently deleted booking record.`);
    }
    return { success: true, message: 'Reservation record deleted.' };
  };

  const checkRoomAvailability = (roomId, checkIn, checkOut, excludeBookingId) => {
    const checkInTime = new Date(checkIn).getTime();
    const checkOutTime = new Date(checkOut).getTime();
    if (isNaN(checkInTime) || isNaN(checkOutTime) || checkOutTime <= checkInTime) {
      return false;
    }

    const hasConflict = bookings.some(b => {
      if (b.roomId !== roomId) return false;
      if (excludeBookingId && b.id === excludeBookingId) return false;
      if (b.status === 'cancelled' || b.status === 'checked_out') return false;

      const bIn = new Date(b.checkIn).getTime();
      const bOut = new Date(b.checkOut).getTime();
      return checkInTime < bOut && checkOutTime > bIn;
    });

    return !hasConflict;
  };

  const getAvailableRooms = (checkIn, checkOut, type, guests) => {
    return rooms.filter(room => {
      if (type && type !== 'all' && !room.type.toLowerCase().includes(type.toLowerCase())) {
        return false;
      }
      if (guests && room.capacity < guests) {
        return false;
      }
      return checkRoomAvailability(room.id, checkIn, checkOut);
    });
  };

  // =========================================================================
  // WORKFLOW 2: GUEST CHECK-IN
  // =========================================================================
  const checkInGuest = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
      return { success: false, message: 'Booking record not found.' };
    }

    if (booking.status === 'checked_in') {
      return { success: false, message: 'Guest is already checked-in.' };
    }

    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: 'checked_in' } : b))
    );

    setRooms(prev =>
      prev.map(r => (r.id === booking.roomId ? { ...r, status: 'occupied' } : r))
    );

    logAudit(
      'CHECK_IN',
      'Front Desk',
      booking.bookingCode,
      `Guest ${booking.guestName} formally checked into Suite ${booking.roomNumber}. Key allocated.`
    );

    return {
      success: true,
      message: `Guest ${booking.guestName} successfully checked into Suite ${booking.roomNumber}.`,
    };
  };

  // =========================================================================
  // WORKFLOW 3: GUEST CHECK-OUT (SETTLEMENT, INVOICE & HOUSEKEEPING TRIGGER)
  // =========================================================================
  const checkOutGuest = (bookingId, paymentMethod = 'Credit Card') => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
      return { success: false, message: 'Booking not found.' };
    }

    const folio = folios.find(f => f.bookingId === bookingId) || folios.find(f => f.roomNumber === booking.roomNumber && f.status === 'open');

    let updatedFolio = folio;
    let newInvoice;

    if (folio && folio.balanceDue > 0) {
      const settlementPayment = {
        id: `pay-${Date.now()}`,
        folioId: folio.id,
        date: new Date().toISOString().split('T')[0],
        amount: folio.balanceDue,
        paymentMethod,
        transactionReference: `TX-OUT-${Math.floor(100000 + Math.random() * 900000)}`,
        receivedBy: user?.name || 'Front Desk Cashier',
        notes: 'Final checkout folio settlement',
      };

      updatedFolio = {
        ...folio,
        payments: [...folio.payments, settlementPayment],
        totalPaid: folio.grandTotal,
        balanceDue: 0,
        status: 'settled',
        settledAt: new Date().toISOString(),
      };

      setFolios(prev => prev.map(f => (f.id === folio.id ? updatedFolio : f)));
    }

    if (updatedFolio) {
      const invNumber = `INV-LAZ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      newInvoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber: invNumber,
        folioId: updatedFolio.id,
        bookingCode: booking.bookingCode,
        guestName: booking.guestName,
        guestEmail: booking.guestEmail,
        issuedDate: new Date().toISOString().split('T')[0],
        dueDate: new Date().toISOString().split('T')[0],
        items: updatedFolio.charges,
        subtotal: updatedFolio.subtotal,
        taxRate: 10,
        taxAmount: updatedFolio.totalTax,
        discountAmount: 0,
        totalAmount: updatedFolio.grandTotal,
        amountPaid: updatedFolio.totalPaid,
        balance: updatedFolio.balanceDue,
        paymentStatus: 'paid',
        notes: 'Lazfort Luxury Hospitality Tax Settled in Full.',
      };
      setInvoices(prev => [newInvoice, ...prev]);
      hotelApi.createInvoice({
        id: newInvoice.id,
        invoice_number: newInvoice.invoiceNumber,
        booking_id: bookingId,
        guest_name: newInvoice.guestName,
        room_number: booking.roomNumber,
        subtotal: newInvoice.subtotal,
        tax_amount: newInvoice.taxAmount,
        total_amount: newInvoice.totalAmount,
        amount_paid: newInvoice.amountPaid,
        status: 'paid',
        items: newInvoice.items,
      }).catch(() => {});
    }

    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: 'checked_out', paymentStatus: 'paid' } : b))
    );
    hotelApi.updateBooking(bookingId, { status: 'checked_out', payment_status: 'paid' }).catch(() => {});

    setRooms(prev =>
      prev.map(r => (r.id === booking.roomId ? { ...r, status: 'cleaning', cleaningStatus: 'dirty' } : r))
    );

    const newCleaningTask = {
      id: `task-to-${Date.now()}`,
      roomId: booking.roomId,
      roomNumber: booking.roomNumber,
      roomType: booking.roomType,
      assignedStaffId: 'stf-002',
      assignedStaffName: 'Marie Laurent',
      priority: (booking.roomType || '').includes('Presidential') || (booking.roomType || '').includes('Royal') ? 'urgent' : 'high',
      status: 'pending',
      cleaningType: 'Full Turnover',
      estimatedMinutes: 60,
      checklist: [
        { item: 'Stripping bed linens & towels to laundry chute', completed: false },
        { item: 'Replace with fresh 1000-thread Egyptian cotton duvet', completed: false },
        { item: 'Restock Acqua Di Parma luxury guest amenities', completed: false },
        { item: 'Sanitize marble bathroom, Jacuzzi & glass surfaces', completed: false },
        { item: 'Restock private bar & fine champagne cellar', completed: false },
        { item: 'Supervisor white-glove inspection', completed: false }
      ],
      notes: `Checkout turnover after departure of ${booking.guestName}. Prepare for immediate arrival.`,
      updatedAt: new Date().toISOString(),
    };

    setCleaningTasks(prev => [newCleaningTask, ...prev]);

    logAudit(
      'CHECK_OUT',
      'Front Desk',
      booking.bookingCode,
      `Checkout completed for ${booking.guestName}. Folio settled ($${updatedFolio?.grandTotal?.toLocaleString() || '0'}), Invoice ${newInvoice?.invoiceNumber || ''} issued, Room ${booking.roomNumber} queued for Housekeeping turnover.`
    );

    return {
      success: true,
      message: `Checkout complete for ${booking.guestName}. Suite ${booking.roomNumber} set to cleaning; invoice finalized.`,
      invoice: newInvoice,
    };
  };

  // =========================================================================
  // WORKFLOW 4: POST CHARGES & PAYMENTS TO GUEST FOLIO
  // =========================================================================
  const postFolioCharge = (folioId, charge) => {
    const folio = folios.find(f => f.id === folioId);
    if (!folio) {
      return { success: false, message: 'Folio not found.' };
    }

    const newChargeItem = {
      ...charge,
      id: `chg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      folioId,
      createdAt: new Date().toISOString(),
    };

    const newSubtotal = folio.subtotal + (charge.quantity * charge.unitPrice);
    const newTax = folio.totalTax + charge.taxAmount;
    const newGrandTotal = folio.grandTotal + charge.totalAmount;
    const newBalanceDue = newGrandTotal - folio.totalPaid;

    setFolios(prev =>
      prev.map(f =>
        f.id === folioId
          ? {
              ...f,
              charges: [...f.charges, newChargeItem],
              subtotal: newSubtotal,
              totalTax: newTax,
              grandTotal: newGrandTotal,
              balanceDue: newBalanceDue,
            }
          : f
      )
    );

    logAudit(
      'POST_CHARGE',
      'Finance',
      folioId,
      `Posted ${charge.category} charge ($${charge.totalAmount.toLocaleString()}) to ${folio.guestName} (Room ${folio.roomNumber}): ${charge.description}.`
    );

    return { success: true, message: `Charge of $${charge.totalAmount.toLocaleString()} added to Room ${folio.roomNumber} folio.` };
  };

  const settleFolioPayment = (folioId, payment) => {
    const folio = folios.find(f => f.id === folioId);
    if (!folio) {
      return { success: false, message: 'Folio not found.' };
    }

    const newPaymentItem = {
      ...payment,
      id: `pay-${Date.now()}`,
      folioId,
    };

    // Persist payment to Laravel MySQL backend
    hotelApi.createPayment({
      id: newPaymentItem.id,
      transaction_ref: payment.transactionReference || `TX-FOL-${Math.floor(10000 + Math.random() * 90000)}`,
      booking_id: folio.bookingId,
      guest_name: folio.guestName,
      room_number: folio.roomNumber,
      amount: payment.amount,
      payment_method: payment.paymentMethod || 'Credit Card',
      status: 'completed',
      notes: payment.notes || 'Folio payment settlement',
    }).catch(err => console.warn('Could not persist payment to MySQL:', err.message));

    const newTotalPaid = folio.totalPaid + payment.amount;
    const newBalanceDue = Math.max(0, folio.grandTotal - newTotalPaid);
    const isSettled = newBalanceDue === 0;

    setFolios(prev =>
      prev.map(f =>
        f.id === folioId
          ? {
              ...f,
              payments: [...f.payments, newPaymentItem],
              totalPaid: newTotalPaid,
              balanceDue: newBalanceDue,
              status: isSettled ? 'settled' : f.status,
            }
          : f
      )
    );

    logAudit(
      'UPDATE',
      'Finance',
      folioId,
      `Payment of $${payment.amount.toLocaleString()} received via ${payment.paymentMethod} for ${folio.guestName} (Folio ${folio.bookingCode}).`
    );

    return { success: true, message: `Payment of $${payment.amount.toLocaleString()} successfully recorded.` };
  };

  // =========================================================================
  // GUEST FOLIOS EXTENDED CRUD
  // =========================================================================
  const createFolio = (folioData) => {
    const booking = bookings.find(b => b.id === folioData.bookingId || b.bookingCode === folioData.bookingCode);
    const newFolio = {
      id: `folio-${Date.now()}`,
      bookingId: folioData.bookingId || booking?.id || `bkg-${Date.now().toString().slice(-4)}`,
      bookingCode: folioData.bookingCode || booking?.bookingCode || `AUR-${Math.floor(1000 + Math.random() * 9000)}`,
      guestId: folioData.guestId || booking?.guestId || `gst-${Date.now().toString().slice(-4)}`,
      guestName: folioData.guestName || booking?.guestName || 'VIP Guest',
      roomNumber: folioData.roomNumber || booking?.roomNumber || '101',
      checkIn: folioData.checkIn || booking?.checkIn || new Date().toISOString().split('T')[0],
      checkOut: folioData.checkOut || booking?.checkOut || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      status: folioData.status || 'open',
      charges: folioData.charges || [],
      payments: folioData.payments || [],
      subtotal: Number(folioData.subtotal || 0),
      totalTax: Number(folioData.totalTax || 0),
      grandTotal: Number(folioData.grandTotal || 0),
      totalPaid: Number(folioData.totalPaid || 0),
      balanceDue: Number(folioData.balanceDue !== undefined ? folioData.balanceDue : (folioData.grandTotal || 0)),
      notes: folioData.notes || '',
      createdAt: new Date().toISOString(),
    };
    setFolios(prev => [newFolio, ...prev]);
    logAudit('CREATE', 'Folios', newFolio.id, `Created new guest folio for ${newFolio.guestName} (Suite ${newFolio.roomNumber})`);
    return { success: true, message: `Folio ${newFolio.bookingCode} created successfully.`, folio: newFolio };
  };

  const updateFolio = (folioId, updates) => {
    setFolios(prev =>
      prev.map(f => {
        if (f.id === folioId) {
          const updated = { ...f, ...updates };
          const chargesTotal = updated.charges?.reduce((sum, c) => sum + (Number(c.totalAmount) || 0), 0) || 0;
          const paymentsTotal = updated.payments?.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 0;
          updated.grandTotal = updates.grandTotal !== undefined ? Number(updates.grandTotal) : chargesTotal || updated.grandTotal;
          updated.totalPaid = updates.totalPaid !== undefined ? Number(updates.totalPaid) : paymentsTotal;
          updated.balanceDue = Math.max(0, updated.grandTotal - updated.totalPaid);
          if (updated.balanceDue === 0 && updated.totalPaid > 0) updated.status = 'settled';
          return updated;
        }
        return f;
      })
    );
    logAudit('UPDATE', 'Folios', folioId, `Updated folio details for ${folioId}`);
    return { success: true, message: 'Folio updated successfully.' };
  };

  const deleteFolio = (folioId) => {
    const target = folios.find(f => f.id === folioId);
    setFolios(prev => prev.filter(f => f.id !== folioId));
    logAudit('DELETE', 'Folios', folioId, `Purged folio record ${target?.bookingCode || folioId}`);
    return { success: true, message: 'Folio removed.' };
  };

  const removeFolioCharge = (folioId, chargeId) => {
    setFolios(prev =>
      prev.map(f => {
        if (f.id === folioId) {
          const remainingCharges = f.charges.filter(c => c.id !== chargeId);
          const subtotal = remainingCharges.reduce((sum, c) => sum + (c.quantity * c.unitPrice || c.totalAmount || 0), 0);
          const totalTax = remainingCharges.reduce((sum, c) => sum + (c.taxAmount || 0), 0);
          const grandTotal = remainingCharges.reduce((sum, c) => sum + (c.totalAmount || 0), 0);
          const balanceDue = Math.max(0, grandTotal - f.totalPaid);
          return {
            ...f,
            charges: remainingCharges,
            subtotal,
            totalTax,
            grandTotal,
            balanceDue,
            status: balanceDue === 0 && f.totalPaid > 0 ? 'settled' : f.status,
          };
        }
        return f;
      })
    );
    logAudit('REMOVE_CHARGE', 'Folios', folioId, `Removed charge ${chargeId} from folio.`);
    return { success: true, message: 'Charge removed from folio.' };
  };

  const refundFolioPayment = (folioId, paymentId, refundData) => {
    const refundAmount = Number(refundData?.amount || 0);
    setFolios(prev =>
      prev.map(f => {
        if (f.id === folioId) {
          const updatedPayments = f.payments.map(p =>
            p.id === paymentId ? { ...p, status: 'refunded', refundedAmount: refundAmount, refundReason: refundData?.reason || 'Guest Requested' } : p
          );
          const totalPaid = Math.max(0, f.totalPaid - refundAmount);
          const balanceDue = Math.max(0, f.grandTotal - totalPaid);
          return {
            ...f,
            payments: updatedPayments,
            totalPaid,
            balanceDue,
            status: 'open',
          };
        }
        return f;
      })
    );

    const newTx = {
      id: `TX-REF-${Date.now().toString().slice(-5)}`,
      transactionRef: `TX-REF-${Date.now().toString().slice(-5)}`,
      guestName: refundData?.guestName || 'VIP Guest',
      bookingCode: refundData?.bookingCode || 'REF',
      folioId,
      paymentMethod: refundData?.paymentMethod || 'Original Payment Method',
      amount: refundAmount,
      date: new Date().toISOString().split('T')[0],
      status: 'refunded',
      notes: refundData?.reason || 'Folio refund processed',
      createdAt: new Date().toISOString(),
    };
    setPayments(prev => [newTx, ...prev]);

    // Persist to Laravel MySQL backend
    hotelApi.createPayment({
      id: newTx.id,
      transaction_ref: newTx.transactionRef,
      booking_id: newTx.bookingCode,
      guest_name: newTx.guestName,
      amount: newTx.amount,
      payment_method: newTx.paymentMethod,
      status: newTx.status,
      payment_date: newTx.date,
      notes: newTx.notes,
    }).catch(err => console.warn('Could not persist payment transaction to backend:', err.message));

    logAudit('REFUND', 'Finance', folioId, `Processed refund of $${refundAmount} for folio ${folioId}.`);
    return { success: true, message: `Refund of $${refundAmount.toLocaleString()} recorded.` };
  };

  // =========================================================================
  // INVOICES EXTENDED CRUD
  // =========================================================================
  const createInvoice = (invData) => {
    const newInv = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invData.invoiceNumber || `INV-LAZ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      folioId: invData.folioId || null,
      bookingCode: invData.bookingCode || 'DIRECT',
      guestName: invData.guestName || 'VIP Client',
      guestEmail: invData.guestEmail || '',
      guestAddress: invData.guestAddress || '',
      companyName: invData.companyName || '',
      issuedDate: invData.issuedDate || new Date().toISOString().split('T')[0],
      dueDate: invData.dueDate || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      items: invData.items || [],
      subtotal: Number(invData.subtotal || 0),
      taxRate: Number(invData.taxRate || 10),
      taxAmount: Number(invData.taxAmount || 0),
      discountAmount: Number(invData.discountAmount || 0),
      totalAmount: Number(invData.totalAmount || 0),
      amountPaid: Number(invData.amountPaid || 0),
      balance: Number(invData.balance !== undefined ? invData.balance : (Number(invData.totalAmount || 0) - Number(invData.amountPaid || 0))),
      paymentStatus: invData.paymentStatus || (Number(invData.amountPaid) >= Number(invData.totalAmount) ? 'paid' : Number(invData.amountPaid) > 0 ? 'partially_paid' : 'issued'),
      status: invData.status || 'issued',
      notes: invData.notes || 'Luxury hospitality tax invoice.',
      createdAt: new Date().toISOString(),
    };

    setInvoices(prev => [newInv, ...prev]);
    logAudit('CREATE', 'Invoices', newInv.invoiceNumber, `Generated invoice ${newInv.invoiceNumber} for ${newInv.guestName} ($${newInv.totalAmount.toLocaleString()})`);
    return { success: true, message: `Invoice ${newInv.invoiceNumber} generated successfully.`, invoice: newInv };
  };

  const updateInvoice = (invId, updates) => {
    setInvoices(prev =>
      prev.map(inv => {
        if (inv.id === invId) {
          const updated = { ...inv, ...updates };
          if (updated.amountPaid !== undefined && updated.totalAmount !== undefined) {
            updated.balance = Math.max(0, Number(updated.totalAmount) - Number(updated.amountPaid));
            if (updated.balance === 0 && updated.totalAmount > 0) {
              updated.paymentStatus = 'paid';
              updated.status = 'paid';
            } else if (updated.amountPaid > 0) {
              updated.paymentStatus = 'partially_paid';
              updated.status = 'partially_paid';
            }
          }
          return updated;
        }
        return inv;
      })
    );
    logAudit('UPDATE', 'Invoices', invId, `Modified invoice parameters for ${invId}`);
    return { success: true, message: 'Invoice updated.' };
  };

  const cancelInvoice = (invId, reason) => {
    setInvoices(prev =>
      prev.map(inv => (inv.id === invId ? { ...inv, status: 'cancelled', paymentStatus: 'cancelled', cancellationReason: reason } : inv))
    );
    logAudit('CANCEL', 'Invoices', invId, `Cancelled invoice ${invId}. Reason: ${reason}`);
    return { success: true, message: 'Invoice marked as cancelled.' };
  };

  const recordInvoicePayment = (invId, paymentData) => {
    const payAmount = Number(paymentData?.amount || 0);
    let updatedInv = null;
    setInvoices(prev =>
      prev.map(inv => {
        if (inv.id === invId) {
          const amountPaid = (Number(inv.amountPaid) || 0) + payAmount;
          const balance = Math.max(0, Number(inv.totalAmount) - amountPaid);
          const isPaidInFull = balance === 0;
          updatedInv = {
            ...inv,
            amountPaid,
            balance,
            paymentStatus: isPaidInFull ? 'paid' : 'partially_paid',
            status: isPaidInFull ? 'paid' : 'partially_paid',
          };
          return updatedInv;
        }
        return inv;
      })
    );

    const newTx = {
      id: `TX-INV-${Date.now().toString().slice(-5)}`,
      transactionRef: `TX-INV-${Date.now().toString().slice(-5)}`,
      guestName: updatedInv?.guestName || 'VIP Guest',
      bookingCode: updatedInv?.invoiceNumber || 'INV',
      invoiceId: invId,
      paymentMethod: paymentData?.paymentMethod || 'Centurion Black Card',
      amount: payAmount,
      date: new Date().toISOString().split('T')[0],
      status: 'paid',
      notes: `Settlement for invoice ${updatedInv?.invoiceNumber || invId}`,
      createdAt: new Date().toISOString(),
    };
    setPayments(prev => [newTx, ...prev]);

    // Persist to Laravel MySQL backend
    hotelApi.createPayment({
      id: newTx.id,
      transaction_ref: newTx.transactionRef,
      booking_id: newTx.bookingCode,
      guest_name: newTx.guestName,
      amount: newTx.amount,
      payment_method: newTx.paymentMethod,
      status: newTx.status,
      payment_date: newTx.date,
      notes: newTx.notes,
    }).catch(err => console.warn('Could not persist payment transaction to backend:', err.message));

    logAudit('PAYMENT', 'Invoices', invId, `Recorded payment of $${payAmount.toLocaleString()} against invoice ${updatedInv?.invoiceNumber || invId}`);
    return { success: true, message: `Payment of $${payAmount.toLocaleString()} recorded.` };
  };

  const deleteInvoice = (invId) => {
    setInvoices(prev => prev.filter(inv => inv.id !== invId));
    logAudit('DELETE', 'Invoices', invId, `Deleted invoice record ${invId}`);
    return { success: true, message: 'Invoice deleted.' };
  };

  // =========================================================================
  // CHART OF ACCOUNTS CRUD
  // =========================================================================
  const addChartOfAccount = (data) => {
    const newAcc = {
      ...data,
      id: data.id || `coa-${Date.now().toString().slice(-6)}`,
      code: data.code || `ACC-${Math.floor(1000 + Math.random() * 9000)}`,
      name: data.name,
      type: data.type || 'Asset',
      category: data.category || data.parentAccount || 'General Accounts',
      parentAccount: data.parentAccount || data.category || null,
      openingBalance: Number(data.openingBalance || 0),
      debitBalance: Number(data.debitBalance || 0),
      creditBalance: Number(data.creditBalance || 0),
      balance: Number(data.balance !== undefined ? data.balance : (Number(data.openingBalance || 0) + Number(data.debitBalance || 0) - Number(data.creditBalance || 0))),
      currency: data.currency || 'EUR',
      description: data.description || '',
      isActive: data.isActive !== undefined ? data.isActive : (data.status === 'active' || true),
      isReconciled: data.isReconciled !== undefined ? data.isReconciled : true,
      subLedger: data.subLedger || 'General',
      createdAt: new Date().toISOString(),
    };
    setChartOfAccounts(prev => [newAcc, ...prev]);
    logAudit('CREATE', 'Chart of Accounts', newAcc.code, `Added G/L Account: ${newAcc.name} (${newAcc.code})`);
    return { success: true, message: `Account "${newAcc.name}" (${newAcc.code}) added successfully.`, account: newAcc };
  };

  const updateChartOfAccount = (accId, updates) => {
    setChartOfAccounts(prev =>
      prev.map(a => (a.id === accId || a.code === accId ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a))
    );
    logAudit('UPDATE', 'Chart of Accounts', accId, `Updated G/L Account parameters.`);
    return { success: true, message: 'Chart of Account updated.' };
  };

  const toggleAccountStatus = (accId) => {
    let nextStatus = true;
    setChartOfAccounts(prev =>
      prev.map(a => {
        if (a.id === accId || a.code === accId) {
          nextStatus = !a.isActive;
          return { ...a, isActive: nextStatus };
        }
        return a;
      })
    );
    logAudit('UPDATE', 'Chart of Accounts', accId, `Account status toggled to ${nextStatus ? 'Active' : 'Inactive'}.`);
    return { success: true, message: `Account is now ${nextStatus ? 'Active' : 'Deactivated'}.` };
  };

  const deleteChartOfAccount = (accId) => {
    setChartOfAccounts(prev => prev.filter(a => a.id !== accId && a.code !== accId));
    logAudit('DELETE', 'Chart of Accounts', accId, `Decommissioned G/L Account ${accId}`);
    return { success: true, message: 'Account removed from Chart of Accounts.' };
  };

  // =========================================================================
  // JOURNAL ENTRIES CRUD
  // =========================================================================
  const createJournalEntry = (jeData) => {
    const lines = jeData.lines || [];
    const totalDebit = lines.reduce((sum, l) => sum + (Number(l.debit) || 0), 0);
    const totalCredit = lines.reduce((sum, l) => sum + (Number(l.credit) || 0), 0);

    const difference = Math.abs(totalDebit - totalCredit);
    if (difference > 0.01) {
      return {
        success: false,
        message: `Debit and Credit must be balanced! Total Debit ($${totalDebit.toFixed(2)}) ≠ Total Credit ($${totalCredit.toFixed(2)}). Variance: $${difference.toFixed(2)}`,
      };
    }

    const newJE = {
      id: `je-${Date.now()}`,
      entryNumber: jeData.entryNumber || `JE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: jeData.date || new Date().toISOString().split('T')[0],
      reference: jeData.reference || `Manual Entry by ${user?.name || 'Chief Accountant'}`,
      description: jeData.description || 'General Ledger Journal Adjustment',
      lines,
      totalDebit,
      totalCredit,
      postedBy: user?.name || 'General Ledger Controller',
      approvedBy: jeData.status === 'posted' ? (user?.name || 'Director of Finance') : null,
      status: jeData.status || 'draft',
      createdAt: new Date().toISOString(),
    };

    setJournalEntries(prev => [newJE, ...prev]);

    if (newJE.status === 'posted') {
      lines.forEach(line => {
        setChartOfAccounts(prevCoa =>
          prevCoa.map(acc => {
            if (acc.id === line.accountId || acc.code === line.accountCode) {
              const debit = Number(line.debit) || 0;
              const credit = Number(line.credit) || 0;
              const isDebitType = acc.type === 'Asset' || acc.type === 'Expense';
              const balanceDelta = isDebitType ? (debit - credit) : (credit - debit);
              return {
                ...acc,
                balance: (Number(acc.balance) || 0) + balanceDelta,
                debitBalance: (Number(acc.debitBalance) || 0) + debit,
                creditBalance: (Number(acc.creditBalance) || 0) + credit,
              };
            }
            return acc;
          })
        );
      });
    }

    logAudit('CREATE', 'Journal Entries', newJE.entryNumber, `Created journal entry ${newJE.entryNumber} ($${totalDebit.toLocaleString()})`);
    return { success: true, message: `Journal entry ${newJE.entryNumber} recorded successfully.`, entry: newJE };
  };

  const updateJournalEntry = (jeId, updates) => {
    setJournalEntries(prev =>
      prev.map(je => (je.id === jeId ? { ...je, ...updates, updatedAt: new Date().toISOString() } : je))
    );
    logAudit('UPDATE', 'Journal Entries', jeId, `Updated journal entry details for ${jeId}`);
    return { success: true, message: 'Journal entry updated.' };
  };

  const approveJournalEntry = (jeId) => {
    setJournalEntries(prev =>
      prev.map(je =>
        je.id === jeId
          ? {
              ...je,
              status: 'approved',
              approvedBy: user?.name || 'Director of Finance',
              approvedAt: new Date().toISOString(),
            }
          : je
      )
    );
    logAudit('APPROVE', 'Journal Entries', jeId, `Approved journal entry ${jeId}`);
    return { success: true, message: 'Journal entry approved.' };
  };

  const rejectJournalEntry = (jeId, reason) => {
    setJournalEntries(prev =>
      prev.map(je =>
        je.id === jeId
          ? {
              ...je,
              status: 'rejected',
              rejectionReason: reason || 'Reviewer Request',
              rejectedBy: user?.name || 'Director of Finance',
            }
          : je
      )
    );
    logAudit('REJECT', 'Journal Entries', jeId, `Rejected journal entry ${jeId}. Reason: ${reason}`);
    return { success: true, message: 'Journal entry marked as rejected.' };
  };

  const postJournalEntry = (jeId) => {
    const entry = journalEntries.find(j => j.id === jeId);
    if (!entry) return { success: false, message: 'Journal entry not found.' };

    setJournalEntries(prev =>
      prev.map(je =>
        je.id === jeId
          ? {
              ...je,
              status: 'posted',
              postedBy: user?.name || 'General Ledger Controller',
              approvedBy: je.approvedBy || (user?.name || 'Director of Finance'),
              postedAt: new Date().toISOString(),
            }
          : je
      )
    );

    entry.lines?.forEach(line => {
      setChartOfAccounts(prevCoa =>
        prevCoa.map(acc => {
          if (acc.id === line.accountId || acc.code === line.accountCode) {
            const debit = Number(line.debit) || 0;
            const credit = Number(line.credit) || 0;
            const isDebitType = acc.type === 'Asset' || acc.type === 'Expense';
            const balanceDelta = isDebitType ? (debit - credit) : (credit - debit);
            return {
              ...acc,
              balance: (Number(acc.balance) || 0) + balanceDelta,
              debitBalance: (Number(acc.debitBalance) || 0) + debit,
              creditBalance: (Number(acc.creditBalance) || 0) + credit,
            };
          }
          return acc;
        })
      );
    });

    logAudit('POST', 'Journal Entries', entry.entryNumber, `Posted journal entry ${entry.entryNumber} to General Ledger.`);
    return { success: true, message: `Journal entry ${entry.entryNumber} successfully posted to General Ledger.` };
  };

  const reverseJournalEntry = (jeId, reason) => {
    const original = journalEntries.find(j => j.id === jeId);
    if (!original) return { success: false, message: 'Original journal entry not found.' };

    const reversedLines = original.lines.map(line => ({
      ...line,
      description: `Reversal: ${line.description}`,
      debit: line.credit,
      credit: line.debit,
    }));

    const reversalJE = {
      id: `je-rev-${Date.now()}`,
      entryNumber: `REV-${original.entryNumber}`,
      date: new Date().toISOString().split('T')[0],
      reference: `Reversal of ${original.entryNumber}: ${reason || 'Correction Adjustment'}`,
      description: `Automated accounting reversal for ${original.description}`,
      lines: reversedLines,
      totalDebit: original.totalCredit,
      totalCredit: original.totalDebit,
      postedBy: user?.name || 'General Ledger Controller',
      approvedBy: user?.name || 'Director of Finance',
      status: 'posted',
      createdAt: new Date().toISOString(),
    };

    setJournalEntries(prev => [
      reversalJE,
      ...prev.map(j => (j.id === jeId ? { ...j, status: 'reversed', reversedBy: reversalJE.entryNumber } : j))
    ]);

    reversedLines.forEach(line => {
      setChartOfAccounts(prevCoa =>
        prevCoa.map(acc => {
          if (acc.id === line.accountId || acc.code === line.accountCode) {
            const debit = Number(line.debit) || 0;
            const credit = Number(line.credit) || 0;
            const isDebitType = acc.type === 'Asset' || acc.type === 'Expense';
            const balanceDelta = isDebitType ? (debit - credit) : (credit - debit);
            return {
              ...acc,
              balance: (Number(acc.balance) || 0) + balanceDelta,
              debitBalance: (Number(acc.debitBalance) || 0) + debit,
              creditBalance: (Number(acc.creditBalance) || 0) + credit,
            };
          }
          return acc;
        })
      );
    });

    logAudit('REVERSE', 'Journal Entries', original.entryNumber, `Reversed journal entry ${original.entryNumber}. Reversal: ${reversalJE.entryNumber}`);
    return { success: true, message: `Journal entry ${original.entryNumber} reversed via ${reversalJE.entryNumber}.`, reversal: reversalJE };
  };

  const deleteJournalEntry = (jeId) => {
    setJournalEntries(prev => prev.filter(j => j.id !== jeId));
    logAudit('DELETE', 'Journal Entries', jeId, `Purged journal entry record ${jeId}`);
    return { success: true, message: 'Journal entry removed.' };
  };

  // =========================================================================
  // PAYMENT TRANSACTIONS CRUD
  // =========================================================================
  const processPayment = (paymentData) => {
    const newTx = {
      id: `TX-${Date.now().toString().slice(-6)}`,
      transactionRef: paymentData.transactionRef || `TX-${Date.now().toString().slice(-6)}`,
      guestName: paymentData.guestName || 'VIP Guest',
      bookingCode: paymentData.bookingCode || 'CONCIERGE',
      folioId: paymentData.folioId || null,
      paymentMethod: paymentData.paymentMethod || 'Centurion Black Card',
      amount: Number(paymentData.amount || 0),
      date: paymentData.date || new Date().toISOString().split('T')[0],
      status: paymentData.status || 'paid',
      notes: paymentData.notes || 'Concierge payment settlement',
      createdAt: new Date().toISOString(),
    };

    setPayments(prev => [newTx, ...prev]);

    // Persist to Laravel MySQL backend
    hotelApi.createPayment({
      id: newTx.id,
      transaction_ref: newTx.transactionRef,
      booking_id: newTx.bookingCode,
      guest_name: newTx.guestName,
      amount: newTx.amount,
      payment_method: newTx.paymentMethod,
      status: newTx.status,
      payment_date: newTx.date,
      notes: newTx.notes,
    }).catch(err => console.warn('Could not persist payment transaction to backend:', err.message));

    if (newTx.folioId && newTx.status === 'paid') {
      settleFolioPayment(newTx.folioId, {
        amount: newTx.amount,
        paymentMethod: newTx.paymentMethod,
        transactionReference: newTx.transactionRef,
        notes: newTx.notes,
        date: newTx.date,
      });
    }

    logAudit('PAYMENT', 'Finance', newTx.transactionRef, `Processed ${newTx.paymentMethod} payment of $${newTx.amount.toLocaleString()} for ${newTx.guestName}`);
    return { success: true, message: `Payment of $${newTx.amount.toLocaleString()} processed successfully.`, payment: newTx };
  };

  const refundPayment = (paymentId, reason) => {
    let refundedTx = null;
    setPayments(prev =>
      prev.map(p => {
        if (p.id === paymentId || p.transactionRef === paymentId) {
          refundedTx = {
            ...p,
            status: 'refunded',
            refundReason: reason || 'Executive Directive',
            refundedAt: new Date().toISOString(),
          };
          return refundedTx;
        }
        return p;
      })
    );

    logAudit('REFUND', 'Finance', paymentId, `Refunded payment ${paymentId}. Reason: ${reason || 'N/A'}`);
    return { success: true, message: `Payment ${paymentId} marked as refunded.` };
  };

  const deletePayment = (paymentId) => {
    setPayments(prev => prev.filter(p => p.id !== paymentId && p.transactionRef !== paymentId));
    logAudit('DELETE', 'Finance', paymentId, `Purged payment record ${paymentId}`);
    return { success: true, message: 'Payment record removed.' };
  };

  // =========================================================================
  // WORKFLOW 5: RESTAURANT ORDER (ROOM SERVICE & INVENTORY DEDUCTION)
  // =========================================================================
  const submitRestaurantOrder = (orderData) => {
    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const subtotal = orderData.items?.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0) || 0;
    const tax = Math.round(subtotal * 0.1);
    const serviceCharge = Math.round(subtotal * 0.05);
    const totalAmount = subtotal + tax + serviceCharge;

    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      outletId: orderData.outletId || 'out-01',
      outletName: orderData.outletName || 'Le Grand Colbert',
      orderType: orderData.orderType || 'Room Service',
      tableNumber: orderData.tableNumber,
      roomNumber: orderData.roomNumber,
      guestId: orderData.guestId,
      guestName: orderData.guestName,
      items: orderData.items || [],
      subtotal,
      tax,
      serviceCharge,
      totalAmount,
      status: 'delivered',
      paymentStatus: orderData.paymentStatus || (orderData.roomNumber ? 'charged_to_room' : 'pending'),
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    setRestaurantOrders(prev => [newOrder, ...prev]);

    if (newOrder.roomNumber && newOrder.paymentStatus === 'charged_to_room') {
      const activeFolio = folios.find(f => f.roomNumber === newOrder.roomNumber && f.status === 'open');
      if (activeFolio) {
        postFolioCharge(activeFolio.id, {
          date: new Date().toISOString().split('T')[0],
          category: 'room_service',
          description: `${newOrder.outletName} — Order #${newOrder.orderNumber} (${newOrder.items.length} items)`,
          quantity: 1,
          unitPrice: subtotal + serviceCharge,
          taxAmount: tax,
          totalAmount,
          referenceId: newOrder.orderNumber,
          postedBy: user?.name || 'Kitchen Dispatch',
        });
      }
    }

    logAudit(
      'CREATE',
      'Restaurant',
      orderNumber,
      `Order ${orderNumber} (${newOrder.orderType}) placed for $${totalAmount.toLocaleString()} — ${newOrder.paymentStatus === 'charged_to_room' ? `Charged to Room ${newOrder.roomNumber}` : 'Direct payment'}.`
    );

    return {
      success: true,
      message: `Order #${orderNumber} processed successfully! ${newOrder.roomNumber ? `Posted to Suite ${newOrder.roomNumber} folio.` : ''}`,
      order: newOrder,
    };
  };

  // =========================================================================
  // WORKFLOW 6: HOUSEKEEPING INSPECTION & ROOM AVAILABILITY TRANSITION
  // =========================================================================
  const updateCleaningTaskStatus = (taskId, status) => {
    setCleaningTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const updated = { ...t, status, updatedAt: new Date().toISOString() };
          
          if (status === 'inspected' || status === 'completed') {
            setRooms(rPrev =>
              rPrev.map(room => {
                if (room.id === t.roomId) {
                  const targetStatus = room.status === 'occupied' ? 'occupied' : 'available';
                  return { ...room, status: targetStatus, cleaningStatus: status === 'inspected' ? 'inspected' : 'clean' };
                }
                return room;
              })
            );
          }
          return updated;
        }
        return t;
      })
    );

    logAudit('UPDATE', 'Housekeeping', taskId, `Cleaning task ${taskId} updated to status: ${status}.`);
  };

  const toggleCleaningChecklist = (taskId, itemIndex) => {
    setCleaningTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const newChecklist = t.checklist.map((item, idx) =>
            idx === itemIndex ? { ...item, completed: !item.completed } : item
          );
          const allCompleted = newChecklist.every(c => c.completed);
          return {
            ...t,
            checklist: newChecklist,
            status: allCompleted ? 'completed' : t.status === 'pending' ? 'in_progress' : t.status,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );
  };

  const addRoom = (newRoom) => {
    setRooms(prev => [newRoom, ...prev]);
    hotelApi.createRoom({
      id: newRoom.id,
      room_number: newRoom.roomNumber,
      type: newRoom.type,
      price: newRoom.price || newRoom.pricePerNight || 0,
      floor: newRoom.floor || '1',
      status: newRoom.status || 'available',
      capacity: newRoom.capacity || 2,
      bed_type: newRoom.bedType,
      view: newRoom.view,
      amenities: newRoom.amenities,
      description: newRoom.description,
    }).catch(err => console.warn('Could not persist room to MySQL:', err.message));
    logAudit('CREATE', 'Reservations', newRoom.roomNumber, `New suite ${newRoom.roomNumber} (${newRoom.type}) added to hotel portfolio.`);
  };

  const updateRoomStatus = (roomId, status) => {
    setRooms(prev => prev.map(r => (r.id === roomId ? { ...r, status } : r)));
    hotelApi.updateRoom(roomId, { status }).catch(() => {});
    logAudit('UPDATE', 'Reservations', roomId, `Room status changed to ${status}.`);
  };

  const transferSuite = (bookingId, targetRoomId, reason) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return { success: false, message: 'Active booking not found.' };

    const targetRoom = rooms.find(r => r.id === targetRoomId);
    if (!targetRoom) return { success: false, message: 'Target suite not found.' };

    if (targetRoom.status !== 'available') {
      return { success: false, message: `Suite ${targetRoom.roomNumber} is currently ${targetRoom.status} and cannot receive transfers.` };
    }

    const previousRoomId = booking.roomId;
    const previousRoomNumber = booking.roomNumber;

    setRooms(prev =>
      prev.map(r => {
        if (r.id === previousRoomId) return { ...r, status: 'cleaning', cleaningStatus: 'dirty' };
        if (r.id === targetRoom.id) return { ...r, status: 'occupied', cleaningStatus: 'clean' };
        return r;
      })
    );

    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, roomId: targetRoom.id, roomNumber: targetRoom.roomNumber, roomType: targetRoom.type } : b))
    );

    setFolios(prev =>
      prev.map(f => (f.bookingId === bookingId ? { ...f, roomNumber: targetRoom.roomNumber } : f))
    );

    const newCleaningTask = {
      id: `task-tr-${Date.now()}`,
      roomId: previousRoomId,
      roomNumber: previousRoomNumber,
      roomType: booking.roomType,
      assignedStaffId: 'stf-002',
      assignedStaffName: 'Marie Laurent',
      priority: 'high',
      status: 'pending',
      cleaningType: 'Full Turnover',
      estimatedMinutes: 45,
      checklist: [
        { item: 'Full suite sanitization following VIP transfer', completed: false },
        { item: 'Linen and towel replacement', completed: false },
        { item: 'Replenish Bulgari and Acqua Di Parma amenities', completed: false }
      ],
      notes: `Suite vacated via transfer to Suite ${targetRoom.roomNumber}. Reason: ${reason}`,
      updatedAt: new Date().toISOString(),
    };
    setCleaningTasks(prev => [newCleaningTask, ...prev]);

    logAudit(
      'UPDATE',
      'Front Desk',
      booking.bookingCode,
      `Suite transfer executed for ${booking.guestName} from Suite ${previousRoomNumber} to Suite ${targetRoom.roomNumber}. Reason: ${reason}.`
    );

    return {
      success: true,
      message: `Suite transfer complete! ${booking.guestName} moved to Suite ${targetRoom.roomNumber}. Suite ${previousRoomNumber} queued for turnover.`,
    };
  };

  const addCleaningTask = (task) => {
    const newTask = {
      ...task,
      id: `task-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    setCleaningTasks(prev => [newTask, ...prev]);
    logAudit('CREATE', 'Housekeeping', newTask.roomNumber, `Scheduled cleaning task for Suite ${newTask.roomNumber} (${newTask.cleaningType}).`);
  };

  const addGuest = (newGuest) => {
    setGuests(prev => [newGuest, ...prev]);
    hotelApi.createGuest({
      id: newGuest.id,
      name: newGuest.name,
      email: newGuest.email,
      phone: newGuest.phone,
      nationality: newGuest.nationality,
      vip_tier: newGuest.vipTier || 'Standard',
      status: newGuest.status || 'active',
      address: newGuest.address,
    }).catch(err => console.warn('Could not persist guest to backend:', err.message));
    logAudit('CREATE', 'Front Desk', newGuest.id, `Registered Guest ${newGuest.name} (${newGuest.vipTier} Tier).`);
  };

  const updateGuestVipTier = (guestId, vipTier) => {
    let targetGuestName = '';
    setGuests(prev =>
      prev.map(g => {
        if (g.id === guestId) {
          targetGuestName = g.name;
          return { ...g, vipTier };
        }
        return g;
      })
    );
    hotelApi.updateGuest(guestId, { vip_tier: vipTier }).catch(() => {});

    logAudit('UPDATE', 'Platform Management', guestId, `Authorized Admin modified membership tier for ${targetGuestName || guestId} to ${vipTier}.`);

    return {
      success: true,
      message: `Membership tier for ${targetGuestName || 'Guest'} successfully updated to ${vipTier}.`,
    };
  };

  const updateGuest = (guestId, data) => {
    setGuests(prev =>
      prev.map(g => (g.id === guestId ? { ...g, ...data } : g))
    );
    hotelApi.updateGuest(guestId, data).catch(() => {});
    logAudit('UPDATE', 'Front Desk', guestId, `Updated profile for guest ${data?.name || guestId}`);
    return { success: true };
  };

  const updateRoom = (roomId, data) => {
    setRooms(prev =>
      prev.map(r => (r.id === roomId ? { ...r, ...data } : r))
    );
    hotelApi.updateRoom(roomId, data).catch(() => {});
    logAudit('UPDATE', 'Reservations', roomId, `Updated details for suite ${data?.roomNumber || roomId}`);
    return { success: true };
  };

  const addStaff = (data) => {
    const newStaff = {
      ...data,
      id: `stf-${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
      performanceScore: 95,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    };
    setStaff(prev => [newStaff, ...prev]);
    hotelApi.createStaff({
      id: newStaff.id,
      employee_code: newStaff.employeeCode,
      name: newStaff.name,
      email: newStaff.email,
      phone: newStaff.phone,
      role: newStaff.role,
      department: newStaff.department,
      shift: newStaff.shift || 'Morning',
      status: newStaff.status || 'active',
      salary: newStaff.salary || 0,
      joining_date: newStaff.joiningDate,
    }).catch(err => console.warn('Could not persist staff to backend:', err.message));
    logAudit('CREATE', 'HR', newStaff.id, `Hired staff member ${newStaff.name} (${newStaff.role}).`);
    return { success: true, staff: newStaff };
  };

  const updateStaff = (staffId, data) => {
    setStaff(prev =>
      prev.map(s => (s.id === staffId ? { ...s, ...data } : s))
    );
    hotelApi.updateStaff(staffId, data).catch(() => {});
    logAudit('UPDATE', 'HR', staffId, `Updated details for staff member ${data?.name || staffId}`);
    return { success: true };
  };

  const addSubscriptionPlan = async (data) => {
    const newPlan = {
      ...data,
      id: data.id || `plan-${Date.now()}`,
      status: data.status || 'active',
    };
    setSubscriptionPlans(prev => [newPlan, ...prev]);
    logAudit('CREATE', 'Platform Management', newPlan.id, `Created subscription plan ${newPlan.name} (${newPlan.tierCode}).`);

    try {
      await hotelApi.createSubscriptionPlan(newPlan);
    } catch (e) {
      console.warn('Could not persist plan to MySQL backend:', e.message);
    }
    return { success: true, plan: newPlan };
  };

  const updateSubscriptionPlan = async (planId, data) => {
    setSubscriptionPlans(prev =>
      prev.map(p => (p.id === planId ? { ...p, ...data } : p))
    );
    logAudit('UPDATE', 'Platform Management', planId, `Updated subscription plan ${data?.name || planId}.`);

    try {
      await hotelApi.updateSubscriptionPlan(planId, data);
    } catch (e) {
      console.warn('Could not persist plan update to MySQL backend:', e.message);
    }
    return { success: true };
  };

  const deleteSubscriptionPlan = async (planId) => {
    setSubscriptionPlans(prev => prev.filter(p => p.id !== planId));
    logAudit('DELETE', 'Platform Management', planId, `Removed subscription tier ${planId}`);

    try {
      await hotelApi.deleteSubscriptionPlan(planId);
    } catch (e) {
      console.warn('Could not delete plan from MySQL backend:', e.message);
    }
    return { success: true };
  };

  const addPlanFeature = async (data) => {
    const newFeature = {
      ...data,
      id: data.id || `feat-${Date.now()}`,
      status: data.status || 'enabled',
    };
    setPlanFeatures(prev => [newFeature, ...prev]);
    logAudit('CREATE', 'Platform Management', newFeature.id, `Created feature ${newFeature.name} (${newFeature.code}).`);

    try {
      await hotelApi.createPlanFeature(newFeature);
    } catch (e) {
      console.warn('Could not persist feature to MySQL:', e.message);
    }
    return { success: true, feature: newFeature };
  };

  const updatePlanFeature = (featureId, data) => {
    setPlanFeatures(prev =>
      prev.map(f => (f.id === featureId ? { ...f, ...data } : f))
    );
    logAudit('UPDATE', 'Platform Management', featureId, `Updated feature ${data?.name || featureId}.`);
    return { success: true };
  };

  const deletePlanFeature = (featureId) => {
    setPlanFeatures(prev => prev.filter(f => f.id !== featureId));
    logAudit('DELETE', 'Platform Management', featureId, `Removed plan feature ${featureId}`);
    return { success: true };
  };

  // Super Admin: Refunds Workflow
  const addRefundRequest = async (data) => {
    const newRef = {
      ...data,
      id: data.id || `ref-${Date.now()}`,
      requestId: data.requestId || `REF-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      status: data.status || 'pending',
      requestDate: data.requestDate || new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setRefundRequests(prev => [newRef, ...prev]);
    logAudit('CREATE', 'Billing & Refunds', newRef.requestId, `Logged refund request for ${newRef.guestName} ($${newRef.requestedAmount}).`);

    try {
      await hotelApi.createRefundRequest(newRef);
    } catch (e) {
      console.warn('Could not persist refund request to MySQL:', e.message);
    }
    return { success: true, refund: newRef };
  };

  const updateRefundRequestStatus = async (refundId, status) => {
    setRefundRequests(prev =>
      prev.map(r => (r.id === refundId || r.requestId === refundId ? { ...r, status, reviewedDate: new Date().toISOString() } : r))
    );
    logAudit('UPDATE', 'Billing & Refunds', refundId, `Refund request ${refundId} marked as ${status}.`);

    try {
      await hotelApi.updateRefundRequest(refundId, { status });
    } catch (e) {
      console.warn('Could not update refund status in MySQL:', e.message);
    }
    return { success: true };
  };

  // Super Admin: Announcements Workflow
  const addAnnouncement = async (data) => {
    const newAnn = {
      ...data,
      id: data.id || `ann-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
      status: data.status || 'Published',
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    logAudit('PUBLISH', 'Platform Announcements', newAnn.id, `Published announcement: ${newAnn.title}`);

    try {
      await hotelApi.createAnnouncement(newAnn);
    } catch (e) {
      console.warn('Could not persist announcement to MySQL:', e.message);
    }
    return { success: true, announcement: newAnn };
  };

  const deleteAnnouncement = async (annId) => {
    setAnnouncements(prev => prev.filter(a => a.id !== annId));
    logAudit('DELETE', 'Platform Announcements', annId, `Removed announcement ${annId}`);

    try {
      await hotelApi.deleteAnnouncement(annId);
    } catch (e) {
      console.warn('Could not delete announcement from MySQL:', e.message);
    }
    return { success: true };
  };

  // Super Admin: Support Tickets & Complaints
  const addSupportTicket = async (data) => {
    const newTkt = {
      ...data,
      id: data.id || `tkt-${Date.now()}`,
      ticketId: data.ticketId || `TKT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      createdDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: data.status || 'open',
    };
    setSupportTickets(prev => [newTkt, ...prev]);
    logAudit('CREATE', 'Support Tickets', newTkt.ticketId, `Raised ticket: ${newTkt.subject}`);

    try {
      await hotelApi.createSupportTicket(newTkt);
    } catch (e) {
      console.warn('Could not persist support ticket to MySQL:', e.message);
    }
    return { success: true, ticket: newTkt };
  };

  const updateSupportTicketStatus = async (ticketId, status) => {
    setSupportTickets(prev =>
      prev.map(t => (t.id === ticketId || t.ticketId === ticketId ? { ...t, status } : t))
    );
    logAudit('UPDATE', 'Support Tickets', ticketId, `Support ticket status updated to ${status}`);

    try {
      await hotelApi.updateSupportTicket(ticketId, { status });
    } catch (e) {
      console.warn('Could not update support ticket in MySQL:', e.message);
    }
    return { success: true };
  };

  const addComplaint = async (data) => {
    const newCmp = {
      ...data,
      id: data.id || `cmp-${Date.now()}`,
      complaintId: data.complaintId || `CMP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      submittedDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: data.status || 'under_review',
    };
    setComplaints(prev => [newCmp, ...prev]);
    logAudit('CREATE', 'Customer Complaints', newCmp.complaintId, `Registered complaint: ${newCmp.title}`);

    try {
      await hotelApi.createComplaint(newCmp);
    } catch (e) {
      console.warn('Could not persist complaint to MySQL:', e.message);
    }
    return { success: true, complaint: newCmp };
  };

  const updateComplaintStatus = async (complaintId, status) => {
    setComplaints(prev =>
      prev.map(c => (c.id === complaintId || c.complaintId === complaintId ? { ...c, status } : c))
    );
    logAudit('UPDATE', 'Customer Complaints', complaintId, `Complaint status updated to ${status}`);

    try {
      await hotelApi.updateComplaint(complaintId, { status });
    } catch (e) {
      console.warn('Could not update complaint in MySQL:', e.message);
    }
    return { success: true };
  };

  const addContactRequest = async (data) => {
    const newReq = {
      ...data,
      id: data.id || `cnt-${Date.now()}`,
      requestId: data.requestId || `REQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      receivedDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'new',
    };
    setContactRequests(prev => [newReq, ...prev]);

    try {
      await hotelApi.createContactRequest(newReq);
    } catch (e) {
      console.warn('Could not persist contact request to MySQL:', e.message);
    }
    return { success: true, request: newReq };
  };

  const updateContactRequestStatus = async (requestId, status) => {
    setContactRequests(prev =>
      prev.map(r => (r.id === requestId || r.requestId === requestId ? { ...r, status } : r))
    );

    try {
      await hotelApi.updateContactRequest(requestId, { status });
    } catch (e) {
      console.warn('Could not update contact request in MySQL:', e.message);
    }
    return { success: true };
  };

  const updateInventoryItem = (itemId, data) => {
    setInventoryItems(prev =>
      prev.map(item => (item.id === itemId ? { ...item, ...data } : item))
    );
    logAudit('UPDATE', 'Inventory', itemId, `Updated inventory item ${data?.name || itemId}.`);
    return { success: true };
  };

  const deleteRoom = (roomId) => {
    setRooms(prev => prev.filter(r => r.id !== roomId));
    logAudit('DELETE', 'Room Management', roomId, `Removed suite ${roomId}`);
    return { success: true };
  };

  const deleteStaff = (staffId) => {
    setStaff(prev => prev.filter(s => s.id !== staffId));
    logAudit('DELETE', 'HR', staffId, `Removed staff profile ${staffId}`);
    return { success: true };
  };

  const deleteGuest = (guestId) => {
    setGuests(prev => prev.filter(g => g.id !== guestId));
    logAudit('DELETE', 'Front Desk', guestId, `Removed guest dossier ${guestId}`);
    return { success: true };
  };

  const deleteInventoryItem = (itemId) => {
    setInventoryItems(prev => prev.filter(i => i.id !== itemId));
    logAudit('DELETE', 'Inventory', itemId, `Removed inventory SKU ${itemId}`);
    return { success: true };
  };

  const deleteMaintenanceTicket = (ticketId) => {
    setMaintenanceTickets(prev => prev.filter(t => t.id !== ticketId));
    logAudit('DELETE', 'Maintenance', ticketId, `Removed maintenance ticket ${ticketId}`);
    return { success: true };
  };

  const updateRestaurantOrderStatus = (orderId, status) => {
    setRestaurantOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status } : o))
    );
    logAudit('UPDATE', 'Restaurant', orderId, `Order ${orderId} status updated to: ${status}`);
    return { success: true };
  };

  const deleteRestaurantOrder = (orderId) => {
    setRestaurantOrders(prev => prev.filter(o => o.id !== orderId && o.orderNumber !== orderId));
    logAudit('DELETE', 'Restaurant', orderId, `Removed restaurant order ${orderId}`);
    return { success: true };
  };

  // ==========================================
  // RESTAURANT: CATEGORIES CRUD
  // ==========================================
  const addMenuCategory = (data) => {
    const newCategory = {
      ...data,
      id: `cat-${Date.now().toString().slice(-6)}`,
      totalItems: 0,
      status: data.status || 'Active',
      createdAt: new Date().toISOString(),
    };
    setMenuCategories(prev => [newCategory, ...prev]);
    logAudit('CREATE', 'Restaurant Categories', newCategory.id, `Created menu category ${newCategory.name}.`);
    return { success: true, message: `Category "${newCategory.name}" added successfully.`, category: newCategory };
  };

  const updateMenuCategory = (categoryId, data) => {
    setMenuCategories(prev =>
      prev.map(c => (c.id === categoryId ? { ...c, ...data, updatedAt: new Date().toISOString() } : c))
    );
    logAudit('UPDATE', 'Restaurant Categories', categoryId, `Updated category ${data?.name || categoryId}.`);
    return { success: true, message: 'Category updated successfully.' };
  };

  const deleteMenuCategory = (categoryId) => {
    const cat = menuCategories.find(c => c.id === categoryId);
    setMenuCategories(prev => prev.filter(c => c.id !== categoryId));
    logAudit('DELETE', 'Restaurant Categories', categoryId, `Deleted category ${cat?.name || categoryId}.`);
    return { success: true, message: 'Category removed successfully.' };
  };

  const toggleMenuCategoryStatus = (categoryId) => {
    setMenuCategories(prev =>
      prev.map(c => {
        if (c.id === categoryId) {
          const newStatus = c.status === 'Active' ? 'Inactive' : 'Active';
          logAudit('UPDATE', 'Restaurant Categories', categoryId, `Category ${c.name} status changed to ${newStatus}.`);
          return { ...c, status: newStatus };
        }
        return c;
      })
    );
    return { success: true };
  };

  // ==========================================
  // RESTAURANT: MENU ITEMS CRUD
  // ==========================================
  const addMenuItem = (data) => {
    const newItem = {
      ...data,
      id: `itm-${Date.now().toString().slice(-6)}`,
      isAvailable: data.isAvailable !== false,
      createdAt: new Date().toISOString(),
    };
    setMenuItems(prev => [newItem, ...prev]);
    if (data.categoryId) {
      setMenuCategories(cPrev =>
        cPrev.map(c => (c.id === data.categoryId ? { ...c, totalItems: (c.totalItems || 0) + 1 } : c))
      );
    }
    logAudit('CREATE', 'Restaurant Menu', newItem.id, `Added menu item ${newItem.name} ($${newItem.price}).`);
    return { success: true, message: `Menu item "${newItem.name}" added successfully.`, item: newItem };
  };

  const updateMenuItem = (itemId, data) => {
    setMenuItems(prev =>
      prev.map(item => (item.id === itemId ? { ...item, ...data, updatedAt: new Date().toISOString() } : item))
    );
    logAudit('UPDATE', 'Restaurant Menu', itemId, `Updated menu item ${data?.name || itemId}.`);
    return { success: true, message: 'Menu item updated successfully.' };
  };

  const deleteMenuItem = (itemId) => {
    const item = menuItems.find(i => i.id === itemId);
    setMenuItems(prev => prev.filter(i => i.id !== itemId));
    if (item?.categoryId) {
      setMenuCategories(cPrev =>
        cPrev.map(c => (c.id === item.categoryId ? { ...c, totalItems: Math.max(0, (c.totalItems || 1) - 1) } : c))
      );
    }
    logAudit('DELETE', 'Restaurant Menu', itemId, `Deleted menu item ${item?.name || itemId}.`);
    return { success: true, message: 'Menu item removed.' };
  };

  const toggleMenuItemAvailability = (itemId) => {
    setMenuItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const newAvail = !item.isAvailable;
          logAudit('UPDATE', 'Restaurant Menu', itemId, `Menu item ${item.name} availability toggled to ${newAvail ? 'Available' : 'Unavailable'}.`);
          return { ...item, isAvailable: newAvail };
        }
        return item;
      })
    );
    return { success: true };
  };

  // ==========================================
  // RESTAURANT: TABLES CRUD
  // ==========================================
  const addRestaurantTable = (data) => {
    const newTable = {
      ...data,
      id: `tbl-${Date.now().toString().slice(-6)}`,
      status: data.status || 'Available',
      createdAt: new Date().toISOString(),
    };
    setRestaurantTables(prev => [newTable, ...prev]);
    logAudit('CREATE', 'Restaurant Tables', newTable.id, `Added dining table ${newTable.tableNumber} (Capacity: ${newTable.capacity}).`);
    return { success: true, message: `Table "${newTable.tableNumber}" registered successfully.`, table: newTable };
  };

  const updateRestaurantTable = (tableId, data) => {
    setRestaurantTables(prev =>
      prev.map(t => (t.id === tableId ? { ...t, ...data } : t))
    );
    logAudit('UPDATE', 'Restaurant Tables', tableId, `Updated table ${data?.tableNumber || tableId}.`);
    return { success: true, message: 'Table updated successfully.' };
  };

  const deleteRestaurantTable = (tableId) => {
    const tbl = restaurantTables.find(t => t.id === tableId);
    setRestaurantTables(prev => prev.filter(t => t.id !== tableId));
    logAudit('DELETE', 'Restaurant Tables', tableId, `Deleted table ${tbl?.tableNumber || tableId}.`);
    return { success: true, message: 'Table removed.' };
  };

  const updateRestaurantTableStatus = (tableId, status) => {
    setRestaurantTables(prev =>
      prev.map(t => {
        if (t.id === tableId) {
          const updated = { ...t, status };
          if (status === 'Available' || status === 'Cleaning') {
            updated.currentOrder = null;
            updated.assignedGuest = null;
          }
          logAudit('UPDATE', 'Restaurant Tables', tableId, `Table ${t.tableNumber} marked as ${status}.`);
          return updated;
        }
        return t;
      })
    );
    return { success: true, message: `Table status updated to ${status}.` };
  };

  const reserveRestaurantTable = (tableId, guestName, notes) => {
    setRestaurantTables(prev =>
      prev.map(t =>
        t.id === tableId
          ? { ...t, status: 'Reserved', assignedGuest: guestName, notes: notes || t.notes }
          : t
      )
    );
    logAudit('UPDATE', 'Restaurant Tables', tableId, `Table reserved for guest ${guestName}.`);
    return { success: true, message: `Table reserved for ${guestName}.` };
  };

  // ==========================================
  // RESTAURANT: ORDERS & BILLING CRUD
  // ==========================================
  const addRestaurantOrder = (orderData) => {
    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const subtotal = orderData.items?.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice)), 0) || 0;
    const tax = Math.round(subtotal * 0.1);
    const serviceCharge = Math.round(subtotal * 0.05);
    const discount = Number(orderData.discount || 0);
    const totalAmount = Math.max(0, subtotal + tax + serviceCharge - discount);

    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      orderType: orderData.orderType || 'Dine-In',
      tableNumber: orderData.tableNumber || null,
      roomNumber: orderData.roomNumber || null,
      guestName: orderData.guestName || 'VIP Guest',
      items: orderData.items || [],
      quantity: orderData.items?.reduce((sum, item) => sum + Number(item.quantity), 0) || 1,
      subtotal,
      tax,
      discount,
      serviceCharge,
      totalAmount,
      orderTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: orderData.status || 'New',
      paymentStatus: orderData.paymentStatus || (orderData.roomNumber ? 'Charged to Room' : 'Pending'),
      kotPrinted: false,
      notes: orderData.notes || '',
      createdAt: new Date().toISOString(),
    };

    setRestaurantOrders(prev => [newOrder, ...prev]);

    if (newOrder.tableNumber) {
      setRestaurantTables(tPrev =>
        tPrev.map(t => (t.tableNumber === newOrder.tableNumber ? { ...t, status: 'Occupied', currentOrder: newOrder.orderNumber, assignedGuest: newOrder.guestName } : t))
      );
    }

    logAudit('CREATE', 'Restaurant Orders', orderNumber, `Created food order ${orderNumber} for ${newOrder.guestName} ($${totalAmount.toLocaleString()}).`);
    return { success: true, message: `Order #${orderNumber} successfully placed!`, order: newOrder };
  };

  const editRestaurantOrder = (orderId, updatedData) => {
    setRestaurantOrders(prev =>
      prev.map(o => (o.id === orderId || o.orderNumber === orderId ? { ...o, ...updatedData, updatedAt: new Date().toISOString() } : o))
    );
    logAudit('UPDATE', 'Restaurant Orders', orderId, `Modified food order ${orderId}.`);
    return { success: true, message: 'Order updated successfully.' };
  };

  const cancelRestaurantOrder = (orderId, reason) => {
    setRestaurantOrders(prev =>
      prev.map(o => {
        if (o.id === orderId || o.orderNumber === orderId) {
          return { ...o, status: 'Cancelled', notes: reason ? `${o.notes || ''} [Cancelled: ${reason}]` : o.notes };
        }
        return o;
      })
    );
    logAudit('CANCEL', 'Restaurant Orders', orderId, `Cancelled order ${orderId}. Reason: ${reason || 'N/A'}`);
    return { success: true, message: `Order ${orderId} has been cancelled.` };
  };

  const generateRestaurantBill = (order, customData = {}) => {
    const existingBill = restaurantBills.find(b => b.orderId === (order.orderNumber || order.id));
    if (existingBill) {
      return { success: false, message: `A bill already exists for Order #${order.orderNumber || order.id} (${existingBill.billNumber}).`, bill: existingBill };
    }

    const billNumber = `BIL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const subtotal = customData.subtotal !== undefined ? Number(customData.subtotal) : Number(order.subtotal || order.totalAmount || 0);
    const tax = customData.tax !== undefined ? Number(customData.tax) : Number(order.tax || Math.round(subtotal * 0.1));
    const discount = customData.discount !== undefined ? Number(customData.discount) : Number(order.discount || 0);
    const serviceCharge = customData.serviceCharge !== undefined ? Number(customData.serviceCharge) : Number(order.serviceCharge || Math.round(subtotal * 0.05));
    const grandTotal = Math.max(0, subtotal + tax + serviceCharge - discount);

    const newBill = {
      id: `bill-${Date.now()}`,
      billNumber,
      orderId: order.orderNumber || order.id,
      guestName: customData.guestName || order.guestName || 'VIP Guest',
      roomNumber: customData.roomNumber || order.roomNumber || null,
      tableNumber: customData.tableNumber || order.tableNumber || null,
      subtotal,
      tax,
      discount,
      serviceCharge,
      grandTotal,
      paymentMethod: customData.paymentMethod || (order.roomNumber ? 'Charge to Suite Folio' : 'Credit Card (Visa/Mastercard)'),
      paymentStatus: customData.paymentStatus || 'Unpaid',
      billDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      postedToFolio: false,
      folioRef: null,
      notes: customData.notes || `Invoice generated for Order ${order.orderNumber || order.id}`,
      createdAt: new Date().toISOString(),
    };

    setRestaurantBills(prev => [newBill, ...prev]);
    logAudit('CREATE', 'Restaurant Billing', billNumber, `Generated bill ${billNumber} for Order ${newBill.orderId} ($${grandTotal.toLocaleString()}).`);
    return { success: true, message: `Bill #${billNumber} generated successfully!`, bill: newBill };
  };

  const updateRestaurantBill = (billId, data) => {
    setRestaurantBills(prev =>
      prev.map(b => (b.id === billId || b.billNumber === billId ? { ...b, ...data, updatedAt: new Date().toISOString() } : b))
    );
    logAudit('UPDATE', 'Restaurant Billing', billId, `Updated bill ${billId}.`);
    return { success: true, message: 'Bill details updated successfully.' };
  };

  const recordRestaurantBillPayment = (billId, paymentMethod, amountPaid) => {
    const bill = restaurantBills.find(b => b.id === billId || b.billNumber === billId);
    if (!bill) return { success: false, message: 'Bill not found.' };

    const effectivePaid = Number(amountPaid) || bill.grandTotal;
    const isFull = effectivePaid >= bill.grandTotal;

    setRestaurantBills(prev =>
      prev.map(b => {
        if (b.id === billId || b.billNumber === billId) {
          return {
            ...b,
            paymentMethod: paymentMethod || b.paymentMethod,
            paymentStatus: isFull ? 'Paid' : 'Partially Paid',
            totalPaid: effectivePaid,
            paidAt: new Date().toISOString(),
          };
        }
        return b;
      })
    );

    setRestaurantOrders(oPrev =>
      oPrev.map(o => (o.orderNumber === bill.orderId || o.id === bill.orderId ? { ...o, paymentStatus: 'Paid', status: o.status === 'Served' ? 'Served' : 'Ready' } : o))
    );

    logAudit('UPDATE', 'Restaurant Billing', bill.billNumber, `Recorded payment of $${effectivePaid.toLocaleString()} for bill ${bill.billNumber} (${paymentMethod}).`);
    return { success: true, message: `Payment for Bill #${bill.billNumber} recorded successfully!` };
  };

  const postRestaurantBillToFolio = (billId, targetRoomNumber) => {
    const bill = restaurantBills.find(b => b.id === billId || b.billNumber === billId);
    if (!bill) return { success: false, message: 'Bill record not found.' };

    if (bill.postedToFolio) {
      return { success: false, message: `Bill ${bill.billNumber} has already been posted to folio (${bill.folioRef}). Duplicate charges are prevented.` };
    }

    const effectiveRoomNumber = targetRoomNumber || bill.roomNumber;
    if (!effectiveRoomNumber) {
      return { success: false, message: 'Please specify the guest room number to post this charge.' };
    }

    const targetFolio = folios.find(f => f.roomNumber === effectiveRoomNumber && f.status === 'open');
    if (!targetFolio) {
      return { success: false, message: `No active open folio found for Suite ${effectiveRoomNumber}. Please ensure guest is checked-in.` };
    }

    const alreadyOnFolio = targetFolio.charges?.some(c => c.referenceId === bill.billNumber);
    if (alreadyOnFolio) {
      return { success: false, message: `Charge for ${bill.billNumber} already exists on Suite ${effectiveRoomNumber} folio.` };
    }

    postFolioCharge(targetFolio.id, {
      date: new Date().toISOString().split('T')[0],
      category: 'dining',
      description: `Restaurant & Dining Bill #${bill.billNumber} (Order ${bill.orderId})`,
      quantity: 1,
      unitPrice: bill.subtotal,
      taxAmount: bill.tax,
      totalAmount: bill.grandTotal,
      referenceId: bill.billNumber,
      postedBy: user?.name || 'Restaurant Billing Clerk',
    });

    setRestaurantBills(prev =>
      prev.map(b =>
        b.id === bill.id
          ? {
              ...b,
              postedToFolio: true,
              paymentStatus: 'Paid',
              paymentMethod: 'Charge to Suite Folio',
              folioRef: targetFolio.bookingCode || targetFolio.id,
              roomNumber: effectiveRoomNumber,
            }
          : b
      )
    );

    setRestaurantOrders(oPrev =>
      oPrev.map(o => (o.orderNumber === bill.orderId || o.id === bill.orderId ? { ...o, paymentStatus: 'Charged to Room', roomNumber: effectiveRoomNumber } : o))
    );

    logAudit('POST_CHARGE', 'Restaurant Billing', bill.billNumber, `Posted bill ${bill.billNumber} ($${bill.grandTotal.toLocaleString()}) to Suite ${effectiveRoomNumber} folio.`);
    return { success: true, message: `Bill #${bill.billNumber} ($${bill.grandTotal.toLocaleString()}) successfully posted to Suite ${effectiveRoomNumber} folio!` };
  };

  // =========================================================================
  // WORKFLOW 7: MAINTENANCE TICKETS & FIXED CAPITAL ASSETS
  // =========================================================================
  const createMaintenanceTicket = (data) => {
    const ticketNumber = `MNT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newTicket = {
      ...data,
      id: `maint-${Date.now()}`,
      ticketNumber,
      hotelId: 'branch-001',
      roomId: data.roomId,
      roomNumber: data.roomNumber,
      location: data.location || (data.roomNumber ? `Suite ${data.roomNumber}` : 'General Hotel Property'),
      category: data.category || 'HVAC & Climate',
      title: data.title || data.issueTitle || 'General Maintenance Request',
      description: data.description || '',
      priority: data.priority || 'medium',
      status: data.status || 'open',
      blocksRoom: data.blocksRoom || data.priority === 'critical',
      assignedStaffId: data.assignedStaffId || 'stf-maint-01',
      assignedStaffName: data.assignedStaffName || data.assignedTechnician || 'Marco Bellini (Chief Engineer)',
      reportedBy: data.reportedBy || user?.name || 'Staff Member',
      reportedDate: data.reportedDate || new Date().toISOString().split('T')[0],
      expectedCompletion: data.expectedCompletion || data.expectedCompletionDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      attachments: data.attachments || [],
      notes: data.notes || '',
      totalCost: Number(data.totalCost) || 0,
      createdAt: new Date().toISOString(),
    };

    setMaintenanceTickets(prev => [newTicket, ...prev]);

    if (newTicket.blocksRoom && newTicket.roomId) {
      setRooms(prev =>
        prev.map(r => (r.id === newTicket.roomId ? { ...r, status: 'maintenance' } : r))
      );
    }

    logAudit(
      'CREATE',
      'Maintenance',
      ticketNumber,
      `Maintenance ticket ${ticketNumber} raised: ${newTicket.title} (${newTicket.priority.toUpperCase()}) ${newTicket.blocksRoom ? '— Suite BLOCKED' : ''}.`
    );

    return { success: true, message: `Maintenance ticket #${ticketNumber} created.`, ticket: newTicket };
  };

  const updateMaintenanceTicket = (ticketId, data) => {
    let unblockRoomId = null;
    let blockRoomId = null;

    setMaintenanceTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId || t.ticketNumber === ticketId) {
          const updated = {
            ...t,
            ...data,
            title: data.title || data.issueTitle || t.title,
            assignedStaffName: data.assignedStaffName || data.assignedTechnician || t.assignedStaffName,
            status: data.status || t.status,
            priority: data.priority || t.priority,
            notes: data.notes !== undefined ? data.notes : t.notes,
            updatedAt: new Date().toISOString(),
          };

          const isNowClosed = updated.status === 'completed' || updated.status === 'resolved' || updated.status === 'cancelled';
          if (isNowClosed && t.roomId) {
            unblockRoomId = t.roomId;
          } else if (updated.blocksRoom && updated.roomId && !isNowClosed) {
            blockRoomId = updated.roomId;
          }

          return updated;
        }
        return t;
      })
    );

    if (unblockRoomId) {
      setRooms(prev =>
        prev.map(r => (r.id === unblockRoomId && r.status === 'maintenance' ? { ...r, status: 'available' } : r))
      );
    }
    if (blockRoomId) {
      setRooms(prev =>
        prev.map(r => (r.id === blockRoomId ? { ...r, status: 'maintenance' } : r))
      );
    }

    logAudit('UPDATE', 'Maintenance', ticketId, `Updated maintenance ticket ${ticketId}.`);
    return { success: true, message: 'Maintenance ticket updated successfully.' };
  };

  const updateTicketStatus = (ticketId, status) => {
    return updateMaintenanceTicket(ticketId, { status });
  };

  const assignTechnicianToTicket = (ticketId, technicianName) => {
    return updateMaintenanceTicket(ticketId, {
      assignedStaffName: technicianName,
      status: 'assigned',
    });
  };

  const resolveMaintenanceTicket = (ticketId) => {
    return updateMaintenanceTicket(ticketId, {
      status: 'completed',
      resolvedAt: new Date().toISOString(),
    });
  };

  const addTicketMaintenanceNote = (ticketId, note) => {
    const target = maintenanceTickets.find(t => t.id === ticketId || t.ticketNumber === ticketId);
    if (!target) return { success: false, message: 'Ticket not found.' };

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const updatedNotes = target.notes ? `${target.notes}\n[${timestamp} - ${user?.name || 'Engineer'}]: ${note}` : `[${timestamp} - ${user?.name || 'Engineer'}]: ${note}`;

    return updateMaintenanceTicket(ticketId, { notes: updatedNotes });
  };

  // Fixed Assets CRUD
  const addFixedAsset = (data) => {
    const assetId = data.assetId || data.assetTag || `AST-${Date.now().toString().slice(-6)}`;
    const cost = Number(data.purchaseCost ?? data.purchasePrice ?? 0);
    const lifeYears = Number(data.usefulLife ?? data.usefulLifeYears ?? 5);
    const salvage = Number(data.salvageValue ?? (cost * 0.15));

    const newAsset = {
      ...data,
      id: `ast-${Date.now()}`,
      assetTag: assetId,
      assetId,
      name: data.name || data.assetName,
      category: data.category || 'General Machinery',
      department: data.department || 'Engineering & Facilities',
      location: data.location || 'Resort Grounds',
      purchaseDate: data.purchaseDate || new Date().toISOString().split('T')[0],
      purchaseCost: cost,
      purchasePrice: cost,
      usefulLifeYears: lifeYears,
      salvageValue: salvage,
      currentValue: cost,
      depreciationMethod: data.depreciationMethod || 'Straight Line',
      condition: data.condition || data.assetCondition || 'Excellent',
      warrantyExpiry: data.warrantyExpiry || new Date(Date.now() + 86400000 * 365).toISOString().split('T')[0],
      supplier: data.supplier || 'Approved Capital Vendor',
      status: data.status || 'operational',
      maintenanceHistory: data.maintenanceHistory || [
        {
          date: new Date().toISOString().split('T')[0],
          description: 'Initial commissioning and safety certification pass.',
          cost: 0,
          technician: 'Marco Bellini (Chief Engineer)',
        }
      ],
      createdAt: new Date().toISOString(),
    };

    setFixedAssets(prev => [newAsset, ...prev]);
    logAudit('CREATE', 'Fixed Assets', assetId, `Added capital asset: ${newAsset.name} (${assetId}) - $${cost.toLocaleString()}`);
    return { success: true, message: `Asset "${newAsset.name}" registered successfully.`, asset: newAsset };
  };

  const updateFixedAsset = (assetId, data) => {
    setFixedAssets(prev =>
      prev.map(a => {
        if (a.id === assetId || a.assetTag === assetId || a.assetId === assetId) {
          const cost = data.purchaseCost !== undefined ? Number(data.purchaseCost) : (data.purchasePrice !== undefined ? Number(data.purchasePrice) : a.purchaseCost);
          return {
            ...a,
            ...data,
            name: data.name || data.assetName || a.name,
            assetTag: data.assetId || data.assetTag || a.assetTag,
            assetId: data.assetId || data.assetTag || a.assetId,
            purchaseCost: cost,
            purchasePrice: cost,
            currentValue: data.currentValue !== undefined ? Number(data.currentValue) : a.currentValue,
            condition: data.condition || data.assetCondition || a.condition,
            updatedAt: new Date().toISOString(),
          };
        }
        return a;
      })
    );
    logAudit('UPDATE', 'Fixed Assets', assetId, `Updated capital asset ${assetId}.`);
    return { success: true, message: 'Fixed asset record updated successfully.' };
  };

  const updateAssetCondition = (assetId, condition) => {
    return updateFixedAsset(assetId, { condition, assetCondition: condition });
  };

  const deleteFixedAsset = (assetId) => {
    const target = fixedAssets.find(a => a.id === assetId || a.assetTag === assetId || a.assetId === assetId);
    setFixedAssets(prev => prev.filter(a => a.id !== assetId && a.assetTag !== assetId && a.assetId !== assetId));
    logAudit('DELETE', 'Fixed Assets', assetId, `Deleted fixed asset: ${target?.name || assetId}`);
    return { success: true, message: 'Asset removed from capital register.' };
  };

  // =========================================================================
  // WORKFLOW 8: INVENTORY MOVEMENTS, ITEMS & APPROVED SUPPLIERS
  // =========================================================================
  const recordStockMovement = (data) => {
    const item = inventoryItems.find(
      i => i.id === data.itemId || i.sku === data.itemCode || i.sku === data.sku || i.name === data.itemName
    );
    if (!item) return { success: false, message: 'Inventory SKU not found in central catalog.' };

    const prevQty = Number(item.currentStock ?? item.availableQuantity ?? 0);
    const qtyChange = Math.abs(Number(data.quantity ?? data.quantityChanged ?? 0));
    let newQty = prevQty;
    const normType = (data.movementType || data.type || 'Stock In').trim();

    if (normType === 'Stock In' || normType === 'receipt') {
      newQty = prevQty + qtyChange;
    } else if (normType === 'Stock Out' || normType === 'issue' || normType === 'Return') {
      if (qtyChange > prevQty) {
        return { success: false, message: `Cannot issue ${qtyChange} units. Only ${prevQty} units available in stock.` };
      }
      newQty = Math.max(0, prevQty - qtyChange);
    } else if (normType === 'Adjustment') {
      if (data.newQuantity !== undefined && data.newQuantity !== null && data.newQuantity !== '') {
        newQty = Math.max(0, Number(data.newQuantity));
      } else {
        newQty = Math.max(0, prevQty + (data.isDeduction ? -qtyChange : qtyChange));
      }
    } else if (normType === 'Department Transfer') {
      if (qtyChange > prevQty) {
        return { success: false, message: `Cannot transfer ${qtyChange} units. Only ${prevQty} units available in stock.` };
      }
      newQty = Math.max(0, prevQty - qtyChange);
    }

    const minStock = Number(item.minimumStock ?? item.minStock ?? 10);
    const updatedItemStatus = newQty === 0 ? 'out_of_stock' : newQty <= minStock ? 'low_stock' : 'in_stock';
    const txId = data.transactionId || `TX-MOV-${Date.now().toString().slice(-6)}`;
    const refNumber = data.referenceNumber || data.reference || `REF-${Math.floor(10000 + Math.random() * 90000)}`;
    const unitPrice = Number(item.unitCost ?? item.purchasePrice ?? item.unitPrice ?? 0);

    const newMovement = {
      id: `mv-${Date.now()}`,
      transactionId: txId,
      itemId: item.id,
      itemName: item.name,
      sku: item.sku || item.itemCode,
      movementType: normType,
      type: normType.toLowerCase().replace(/\s+/g, '_'),
      previousQuantity: prevQty,
      quantityChanged: qtyChange,
      quantity: qtyChange,
      newQuantity: newQty,
      referenceNumber: refNumber,
      department: data.department || item.department || 'Central Stores',
      destinationDepartment: data.destinationDepartment || null,
      unitPrice,
      totalMovementValue: Math.round(qtyChange * unitPrice),
      performedBy: data.performedBy || user?.name || 'Chief Storekeeper',
      transactionDate: data.transactionDate || new Date().toISOString().replace('T', ' ').slice(0, 16),
      reason: data.reason || `${normType} recorded in inventory stores.`,
      timestamp: new Date().toISOString(),
    };

    setInventoryItems(prev =>
      prev.map(i =>
        i.id === item.id
          ? {
              ...i,
              currentStock: newQty,
              availableQuantity: newQty,
              status: updatedItemStatus,
              totalValue: Math.round(newQty * unitPrice),
              lastRestockedDate: normType === 'Stock In' || normType === 'receipt' ? new Date().toISOString().split('T')[0] : i.lastRestockedDate,
            }
          : i
      )
    );

    setStockMovements(prev => [newMovement, ...prev]);

    logAudit(
      'STOCK_MOVEMENT',
      'Inventory',
      item.sku,
      `${normType.toUpperCase()} for ${item.name} (${qtyChange} units). New balance: ${newQty} ${item.unitOfMeasure || 'Units'}. Ref: ${refNumber}`
    );

    return {
      success: true,
      message: `${normType} of ${qtyChange} units recorded successfully! New stock balance is ${newQty}.`,
      movement: newMovement,
    };
  };

  const addInventoryItem = (data) => {
    const itemCode = data.itemCode || data.sku || `INV-${Math.floor(1000 + Math.random() * 9000)}-LX`;
    const openStock = Number(data.openingStock !== undefined ? data.openingStock : (data.currentStock || 0));
    const minStock = Number(data.minimumStock !== undefined ? data.minimumStock : (data.minStock || 10));
    const price = Number(data.purchasePrice !== undefined ? data.purchasePrice : (data.unitCost || data.unitPrice || 0));
    const status = openStock === 0 ? 'out_of_stock' : openStock <= minStock ? 'low_stock' : 'in_stock';

    const newItem = {
      ...data,
      id: `inv-${Date.now()}`,
      sku: itemCode,
      itemCode,
      name: data.name || data.itemName,
      category: data.category || 'General Supplies',
      department: data.department || 'Central Stores',
      description: data.description || '',
      supplierName: data.supplierName || data.supplier || 'Approved Purveyor',
      supplier: data.supplier || data.supplierName || 'Approved Purveyor',
      unitOfMeasure: data.unitOfMeasure || data.unit || 'Units',
      unit: data.unit || data.unitOfMeasure || 'Units',
      currentStock: openStock,
      availableQuantity: openStock,
      openingStock: openStock,
      minimumStock: minStock,
      minStock,
      unitCost: price,
      purchasePrice: price,
      unitPrice: price,
      totalValue: Math.round(openStock * price),
      location: data.location || data.storageLocation || 'Main Store Vault A',
      storageLocation: data.storageLocation || data.location || 'Main Store Vault A',
      lastRestockedDate: new Date().toISOString().split('T')[0],
      status,
      createdAt: new Date().toISOString(),
    };

    setInventoryItems(prev => [newItem, ...prev]);
    logAudit('CREATE', 'Inventory', newItem.sku, `Added new inventory item: ${newItem.name} (${newItem.sku})`);
    return { success: true, message: `Item "${newItem.name}" (${newItem.sku}) added to catalog.`, item: newItem };
  };

  const updateItemMinStock = (itemId, newMinStock) => {
    const minVal = Math.max(0, Number(newMinStock));
    setInventoryItems(prev =>
      prev.map(i => {
        if (i.id === itemId || i.sku === itemId) {
          const status = i.currentStock === 0 ? 'out_of_stock' : i.currentStock <= minVal ? 'low_stock' : 'in_stock';
          return { ...i, minimumStock: minVal, minStock: minVal, status };
        }
        return i;
      })
    );
    logAudit('UPDATE', 'Inventory', itemId, `Updated minimum stock threshold to ${minVal}.`);
    return { success: true, message: `Minimum stock level updated to ${minVal}.` };
  };

  const createInventoryReorder = (itemId, reorderQty) => {
    const item = inventoryItems.find(i => i.id === itemId || i.sku === itemId);
    if (!item) return { success: false, message: 'Item not found.' };

    const qty = Number(reorderQty) || Math.max(20, (item.minimumStock || 10) * 2 - (item.currentStock || 0));
    return recordStockMovement({
      itemId: item.id,
      movementType: 'Stock In',
      quantity: qty,
      reason: `Expedited restock reorder for low-stock SKU (${item.sku})`,
      department: item.department || 'Central Stores',
      referenceNumber: `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      performedBy: user?.name || 'Procurement Officer',
    });
  };

  // Suppliers Management CRUD
  const addSupplier = (data) => {
    const newSupplier = {
      ...data,
      id: `sup-${Date.now().toString().slice(-6)}`,
      code: data.code || `SUP-${Math.floor(100 + Math.random() * 900)}`,
      name: data.name || data.supplierName,
      contactPerson: data.contactPerson || '',
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      categories: Array.isArray(data.categories)
        ? data.categories
        : data.suppliedCategories
        ? (Array.isArray(data.suppliedCategories) ? data.suppliedCategories : [data.suppliedCategories])
        : (data.category ? [data.category] : ['General Supplies']),
      status: data.status || 'active',
      rating: Number(data.rating) || 5.0,
      leadTimeDays: Number(data.leadTimeDays) || 3,
      createdAt: new Date().toISOString(),
    };
    setSuppliers(prev => [newSupplier, ...prev]);
    logAudit('CREATE', 'Inventory Suppliers', newSupplier.id, `Onboarded approved supplier: ${newSupplier.name}`);
    return { success: true, message: `Supplier "${newSupplier.name}" added successfully.`, supplier: newSupplier };
  };

  const updateSupplier = (supplierId, data) => {
    setSuppliers(prev =>
      prev.map(s => (s.id === supplierId ? { ...s, ...data, updatedAt: new Date().toISOString() } : s))
    );
    logAudit('UPDATE', 'Inventory Suppliers', supplierId, `Updated supplier details for ${data?.name || supplierId}`);
    return { success: true, message: 'Supplier profile updated successfully.' };
  };

  const deleteSupplier = (supplierId) => {
    const target = suppliers.find(s => s.id === supplierId);
    setSuppliers(prev => prev.filter(s => s.id !== supplierId));
    logAudit('DELETE', 'Inventory Suppliers', supplierId, `Removed supplier ${target?.name || supplierId}`);
    return { success: true, message: 'Supplier removed from approved directory.' };
  };

  const toggleSupplierStatus = (supplierId) => {
    let nextStatus = 'active';
    setSuppliers(prev =>
      prev.map(s => {
        if (s.id === supplierId) {
          nextStatus = s.status === 'active' ? 'inactive' : 'active';
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
    logAudit('UPDATE', 'Inventory Suppliers', supplierId, `Supplier status toggled to ${nextStatus}.`);
    return { success: true, message: `Supplier status changed to ${nextStatus}.` };
  };

  // =========================================================================
  // WORKFLOW 9: PAYROLL APPROVAL & GENERAL LEDGER POSTING
  // =========================================================================
  const approvePayrollRun = (payrollRunId) => {
    const run = payrollRuns.find(p => p.id === payrollRunId);
    if (!run) return { success: false, message: 'Payroll run not found.' };

    setPayrollRuns(prev =>
      prev.map(p =>
        p.id === payrollRunId
          ? {
              ...p,
              status: 'approved',
              approvedBy: user?.name || 'Executive Directorate',
              payslips: p.payslips.map(ps => ({ ...ps, status: 'disbursed' })),
            }
          : p
      )
    );

    const newJE = {
      id: `je-${Date.now()}`,
      entryNumber: `JE-PAY-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      reference: `Payroll Disbursement: ${run.period}`,
      description: `Disbursement of ${run.period} salaries across ${run.totalEmployees} employees`,
      lines: [
        { accountId: 'coa-6010', accountCode: '6010', accountName: 'Staff Salaries & Executive Payroll', description: 'Gross employee compensation', debit: run.totalGrossPay, credit: 0 },
        { accountId: 'coa-1020', accountCode: '1020', accountName: 'Lazfort Operating Account', description: 'Net payroll wire transfer', debit: 0, credit: run.totalNetPay },
        { accountId: 'coa-2050', accountCode: '2050', accountName: 'Statutory Payroll Deductions Payable', description: 'Withheld taxes & provident fund', debit: 0, credit: run.totalDeductions }
      ],
      totalDebit: run.totalGrossPay,
      totalCredit: run.totalGrossPay,
      postedBy: user?.name || 'Payroll Controller',
      status: 'posted',
      createdAt: new Date().toISOString(),
    };

    setJournalEntries(prev => [newJE, ...prev]);

    logAudit(
      'DISBURSE_PAYROLL',
      'HR',
      payrollRunId,
      `Payroll for ${run.period} approved and disbursed ($${run.totalNetPay.toLocaleString()} net). Journal Entry ${newJE.entryNumber} posted.`
    );

    return { success: true, message: `Payroll for ${run.period} approved and accounting journal entry posted.` };
  };

  // =========================================================================
  // COMPUTED METRICS
  // =========================================================================
  const getOccupancyRate = () => {
    if (rooms.length === 0) return 0;
    const occupied = rooms.filter(r => r.status === 'occupied').length;
    return Math.round((occupied / rooms.length) * 100);
  };

  const getADR = () => {
    const occupiedRooms = rooms.filter(r => r.status === 'occupied');
    if (occupiedRooms.length === 0) return 1850;
    const totalRev = occupiedRooms.reduce((sum, r) => sum + r.pricePerNight, 0);
    return Math.round(totalRev / occupiedRooms.length);
  };

  const getRevPAR = () => {
    const occRate = getOccupancyRate() / 100;
    const adr = getADR();
    return Math.round(occRate * adr);
  };

  const getTodayRevenue = () => {
    const roomRev = rooms.filter(r => r.status === 'occupied').reduce((sum, r) => sum + r.pricePerNight, 0);
    const fbRev = restaurantOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    return roomRev + fbRev;
  };

  const getMonthlyRevenue = () => {
    return getTodayRevenue() * 28;
  };

  const getLowStockItems = () => {
    return inventoryItems.filter(i => {
      const current = Number(i.currentStock ?? i.availableQuantity ?? 0);
      const min = Number(i.minimumStock ?? i.minStock ?? 10);
      return current <= min || i.status === 'low_stock' || i.status === 'out_of_stock';
    });
  };

  const getPendingCleaningCount = () => {
    return cleaningTasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length;
  };

  const getActiveMaintenanceCount = () => {
    return maintenanceTickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
  };

  const resetToSeedData = () => {
    localStorage.clear();
    setRooms(mockRooms);
    setBookings(mockBookings);
    setGuests(mockGuests);
    setCleaningTasks(mockCleaningTasks);
    setFolios(mockGuestFolios);
    setInvoices(mockInvoices);
    setRestaurantOrders(mockInitialFoodOrders || mockRestaurantOrders);
    setMenuCategories(mockMenuCategories);
    setMenuItems(mockMenuItemsData);
    setRestaurantTables(mockRestaurantTables);
    setRestaurantBills(mockRestaurantBills);
    setInventoryItems(mockInventoryItems);
    setStockMovements(mockStockMovements);
    setSuppliers(mockSuppliers);
    setMaintenanceTickets(mockMaintenanceTickets);
    setFixedAssets(mockFixedAssets);
    setChartOfAccounts(mockChartOfAccounts);
    setJournalEntries(mockJournalEntries);
    setPayrollRuns([mockPayrollRun]);
    setAuditLogs(mockAuditLogs);
    setHotels(mockHotels);
    setStaff(mockStaff);
    setSubscriptionPlans(mockSubscriptionPlans);
    setPlanFeatures(mockPlanFeatures);
  };

  return (
    <ERPContext.Provider
      value={{
        hotels,
        addHotel,
        updateHotelStatus,
        updateHotel,
        deleteHotel,
        rooms,
        updateRoom,
        deleteRoom,
        bookings,
        guests,
        updateGuest,
        deleteGuest,
        staff,
        addStaff,
        updateStaff,
        deleteStaff,
        subscriptionPlans,
        addSubscriptionPlan,
        updateSubscriptionPlan,
        deleteSubscriptionPlan,
        planFeatures,
        addPlanFeature,
        updatePlanFeature,
        deletePlanFeature,
        refundRequests,
        addRefundRequest,
        updateRefundRequestStatus,
        announcements,
        addAnnouncement,
        deleteAnnouncement,
        supportTickets,
        addSupportTicket,
        updateSupportTicketStatus,
        complaints,
        addComplaint,
        updateComplaintStatus,
        contactRequests,
        addContactRequest,
        updateContactRequestStatus,
        platformSettings,
        updateInventoryItem,
        deleteInventoryItem,
        cleaningTasks,
        folios,
        createFolio,
        updateFolio,
        deleteFolio,
        removeFolioCharge,
        refundFolioPayment,
        invoices,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        cancelInvoice,
        recordInvoicePayment,
        payments,
        processPayment,
        refundPayment,
        deletePayment,
        restaurantOrders,
        updateRestaurantOrderStatus,
        deleteRestaurantOrder,
        addRestaurantOrder,
        editRestaurantOrder,
        cancelRestaurantOrder,
        menuCategories,
        addMenuCategory,
        updateMenuCategory,
        deleteMenuCategory,
        toggleMenuCategoryStatus,
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleMenuItemAvailability,
        restaurantTables,
        addRestaurantTable,
        updateRestaurantTable,
        deleteRestaurantTable,
        updateRestaurantTableStatus,
        reserveRestaurantTable,
        restaurantBills,
        generateRestaurantBill,
        updateRestaurantBill,
        recordRestaurantBillPayment,
        postRestaurantBillToFolio,
        inventoryItems,
        stockMovements,
        suppliers,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        toggleSupplierStatus,
        updateItemMinStock,
        createInventoryReorder,
        maintenanceTickets,
        createMaintenanceTicket,
        updateMaintenanceTicket,
        updateTicketStatus,
        assignTechnicianToTicket,
        resolveMaintenanceTicket,
        deleteMaintenanceTicket,
        addTicketMaintenanceNote,
        fixedAssets,
        addFixedAsset,
        updateFixedAsset,
        updateAssetCondition,
        deleteFixedAsset,
        chartOfAccounts,
        addChartOfAccount,
        updateChartOfAccount,
        deleteChartOfAccount,
        toggleAccountStatus,
        journalEntries,
        createJournalEntry,
        updateJournalEntry,
        approveJournalEntry,
        rejectJournalEntry,
        postJournalEntry,
        reverseJournalEntry,
        deleteJournalEntry,
        payrollRuns,
        auditLogs,
        currencies,
        addCurrency,
        updateCurrency,
        deleteCurrency,
        getHotelCurrencySymbol,
        getHotelCurrencyCode,
        addRoom,
        updateRoomStatus,
        transferSuite,
        addCleaningTask,
        addGuest,
        updateGuestVipTier,
        createReservation,
        cancelBooking,
        approveBooking,
        updateBooking,
        deleteBooking,
        checkRoomAvailability,
        getAvailableRooms,
        checkInGuest,
        checkOutGuest,
        postFolioCharge,
        settleFolioPayment,
        submitRestaurantOrder,
        updateCleaningTaskStatus,
        toggleCleaningChecklist,
        recordStockMovement,
        addInventoryItem,
        approvePayrollRun,
        getOccupancyRate,
        getADR,
        getRevPAR,
        getTodayRevenue,
        getMonthlyRevenue,
        getLowStockItems,
        getPendingCleaningCount,
        getActiveMaintenanceCount,
        resetToSeedData,
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
};

export default ERPContext;

