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
  mockMaintenanceTickets,
  mockFixedAssets,
  mockChartOfAccounts,
  mockJournalEntries,
  mockPayrollRun,
  mockAuditLogs
} from '../data/mockERPData';
import { useAuth } from './AuthContext';

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
  const [restaurantOrders, setRestaurantOrders] = useState(() => loadInitialData('orders', mockRestaurantOrders));
  const [inventoryItems, setInventoryItems] = useState(() => loadInitialData('inventory', mockInventoryItems));
  const [stockMovements, setStockMovements] = useState(() => loadInitialData('movements', mockStockMovements));
  const [maintenanceTickets, setMaintenanceTickets] = useState(() => loadInitialData('maintenance', mockMaintenanceTickets));
  const [fixedAssets, setFixedAssets] = useState(() => loadInitialData('assets', mockFixedAssets));
  const [chartOfAccounts, setChartOfAccounts] = useState(() => loadInitialData('coa', mockChartOfAccounts));
  const [journalEntries, setJournalEntries] = useState(() => loadInitialData('journal', mockJournalEntries));
  const [payrollRuns, setPayrollRuns] = useState(() => loadInitialData('payroll', [mockPayrollRun]));
  const [auditLogs, setAuditLogs] = useState(() => loadInitialData('audit', mockAuditLogs));
  const [hotels, setHotels] = useState(() => loadInitialData('hotels', mockHotels));
  const [staff, setStaff] = useState(() => loadInitialData('staff', mockStaff));
  const [subscriptionPlans, setSubscriptionPlans] = useState(() => loadInitialData('plans', mockSubscriptionPlans));
  const [planFeatures, setPlanFeatures] = useState(() => loadInitialData('features', mockPlanFeatures));

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
    localStorage.setItem(`${STORAGE_KEY}_journal`, JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
  }, [auditLogs]);

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
  };

  // =========================================================================
  // SUPER ADMIN: HOTEL PROPERTIES MANAGEMENT
  // =========================================================================
  const addHotel = (hotelData) => {
    const newHotel = {
      ...hotelData,
      id: `hotel-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
    };
    setHotels(prev => [newHotel, ...prev]);
    logAudit('CREATE', 'Platform Setting', newHotel.id, `Onboarded new luxury property: ${newHotel.name}`);
    return { success: true, message: `Successfully onboarded ${newHotel.name}`, hotel: newHotel };
  };

  const updateHotelStatus = (hotelId, status) => {
    setHotels(prev =>
      prev.map(h => (h.id === hotelId ? { ...h, status } : h))
    );
    logAudit('UPDATE', 'Platform Setting', hotelId, `Updated property status to ${status}`);
  };

  const updateHotel = (hotelId, data) => {
    setHotels(prev =>
      prev.map(h => (h.id === hotelId ? { ...h, ...data } : h))
    );
    logAudit('UPDATE', 'Platform Setting', hotelId, `Updated property details for ${data?.name || hotelId}`);
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
    }

    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: 'checked_out', paymentStatus: 'paid' } : b))
    );

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
    logAudit('CREATE', 'Reservations', newRoom.roomNumber, `New suite ${newRoom.roomNumber} (${newRoom.type}) added to hotel portfolio.`);
  };

  const updateRoomStatus = (roomId, status) => {
    setRooms(prev => prev.map(r => (r.id === roomId ? { ...r, status } : r)));
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
    logAudit('UPDATE', 'Front Desk', guestId, `Updated profile for guest ${data?.name || guestId}`);
    return { success: true };
  };

  const updateRoom = (roomId, data) => {
    setRooms(prev =>
      prev.map(r => (r.id === roomId ? { ...r, ...data } : r))
    );
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
    logAudit('CREATE', 'HR', newStaff.id, `Hired staff member ${newStaff.name} (${newStaff.role}).`);
    return { success: true, staff: newStaff };
  };

  const updateStaff = (staffId, data) => {
    setStaff(prev =>
      prev.map(s => (s.id === staffId ? { ...s, ...data } : s))
    );
    logAudit('UPDATE', 'HR', staffId, `Updated details for staff member ${data?.name || staffId}`);
    return { success: true };
  };

  const addSubscriptionPlan = (data) => {
    const newPlan = {
      ...data,
      id: data.id || `plan-${Date.now()}`,
      status: data.status || 'active',
    };
    setSubscriptionPlans(prev => [newPlan, ...prev]);
    logAudit('CREATE', 'Platform Management', newPlan.id, `Created subscription plan ${newPlan.name} (${newPlan.tierCode}).`);
    return { success: true, plan: newPlan };
  };

  const updateSubscriptionPlan = (planId, data) => {
    setSubscriptionPlans(prev =>
      prev.map(p => (p.id === planId ? { ...p, ...data } : p))
    );
    logAudit('UPDATE', 'Platform Management', planId, `Updated subscription plan ${data?.name || planId}.`);
    return { success: true };
  };

  const addPlanFeature = (data) => {
    const newFeature = {
      ...data,
      id: data.id || `feat-${Date.now()}`,
      status: data.status || 'enabled',
    };
    setPlanFeatures(prev => [newFeature, ...prev]);
    logAudit('CREATE', 'Platform Management', newFeature.id, `Created feature ${newFeature.name} (${newFeature.code}).`);
    return { success: true, feature: newFeature };
  };

  const updatePlanFeature = (featureId, data) => {
    setPlanFeatures(prev =>
      prev.map(f => (f.id === featureId ? { ...f, ...data } : f))
    );
    logAudit('UPDATE', 'Platform Management', featureId, `Updated feature ${data?.name || featureId}.`);
    return { success: true };
  };

  const updateInventoryItem = (itemId, data) => {
    setInventoryItems(prev =>
      prev.map(item => (item.id === itemId ? { ...item, ...data } : item))
    );
    logAudit('UPDATE', 'Inventory', itemId, `Updated inventory item ${data?.name || itemId}.`);
    return { success: true };
  };

  // =========================================================================
  // WORKFLOW 7: MAINTENANCE & ROOM BLOCKING
  // =========================================================================
  const createMaintenanceTicket = (data) => {
    const ticketNumber = `MNT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newTicket = {
      id: `maint-${Date.now()}`,
      ticketNumber,
      hotelId: 'branch-001',
      roomId: data.roomId,
      roomNumber: data.roomNumber,
      location: data.location || (data.roomNumber ? `Suite ${data.roomNumber}` : 'General Hotel Property'),
      category: data.category || 'HVAC & Climate',
      title: data.title || 'General Maintenance Request',
      description: data.description || '',
      priority: data.priority || 'medium',
      status: 'open',
      blocksRoom: data.blocksRoom || data.priority === 'critical',
      assignedStaffId: data.assignedStaffId || 'stf-maint-01',
      assignedStaffName: data.assignedStaffName || 'Marco Bellini (Chief Engineer)',
      reportedBy: user?.name || 'Staff Member',
      totalCost: data.totalCost || 0,
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

    return { success: true, message: `Maintenance ticket #${ticketNumber} created.` };
  };

  const resolveMaintenanceTicket = (ticketId) => {
    setMaintenanceTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          if (t.roomId) {
            setRooms(rPrev =>
              rPrev.map(room => (room.id === t.roomId && room.status === 'maintenance' ? { ...room, status: 'available' } : room))
            );
          }
          return { ...t, status: 'resolved', resolvedAt: new Date().toISOString() };
        }
        return t;
      })
    );

    logAudit('UPDATE', 'Maintenance', ticketId, `Maintenance ticket ${ticketId} marked resolved.`);
  };

  // =========================================================================
  // WORKFLOW 8: INVENTORY MOVEMENTS & STOCK LEDGER
  // =========================================================================
  const recordStockMovement = (data) => {
    const item = inventoryItems.find(i => i.id === data.itemId);
    if (!item) return { success: false, message: 'Inventory item not found.' };

    const newMovement = {
      ...data,
      id: `mv-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    const newStock = data.type === 'receipt' 
      ? item.currentStock + data.quantity 
      : Math.max(0, item.currentStock - data.quantity);

    const updatedItemStatus = newStock === 0 ? 'out_of_stock' : newStock <= item.minimumStock ? 'low_stock' : 'in_stock';

    setInventoryItems(prev =>
      prev.map(i => (i.id === item.id ? { ...i, currentStock: newStock, status: updatedItemStatus } : i))
    );
    setStockMovements(prev => [newMovement, ...prev]);

    logAudit(
      'RECEIVE_STOCK',
      'Inventory',
      item.sku,
      `${data.type.toUpperCase()} recorded for ${item.name}: ${data.quantity} units (${data.reason}). New stock: ${newStock}.`
    );

    return { success: true, message: `Stock ${data.type} recorded. New balance: ${newStock} ${item.unitOfMeasure}.` };
  };

  const addInventoryItem = (data) => {
    const newItem = {
      ...data,
      id: `inv-${Date.now()}`,
      lastRestockedDate: new Date().toISOString().split('T')[0],
      status: data.currentStock <= data.minimumStock ? 'low_stock' : 'in_stock',
    };
    setInventoryItems(prev => [newItem, ...prev]);
    logAudit('CREATE', 'Inventory', newItem.sku, `Added new inventory SKU: ${newItem.name} (${newItem.sku})`);
    return { success: true, message: `Provisioned SKU ${newItem.sku} (${newItem.name}) into central store.`, item: newItem };
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
    return inventoryItems.filter(i => i.currentStock <= i.minimumStock);
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
    setRestaurantOrders(mockRestaurantOrders);
    setInventoryItems(mockInventoryItems);
    setStockMovements(mockStockMovements);
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
        rooms,
        updateRoom,
        bookings,
        guests,
        updateGuest,
        staff,
        addStaff,
        updateStaff,
        subscriptionPlans,
        addSubscriptionPlan,
        updateSubscriptionPlan,
        planFeatures,
        addPlanFeature,
        updatePlanFeature,
        updateInventoryItem,
        cleaningTasks,
        folios,
        invoices,
        restaurantOrders,
        inventoryItems,
        stockMovements,
        maintenanceTickets,
        fixedAssets,
        chartOfAccounts,
        journalEntries,
        payrollRuns,
        auditLogs,
        addRoom,
        updateRoomStatus,
        transferSuite,
        addCleaningTask,
        addGuest,
        updateGuestVipTier,
        createReservation,
        cancelBooking,
        checkRoomAvailability,
        getAvailableRooms,
        checkInGuest,
        checkOutGuest,
        postFolioCharge,
        settleFolioPayment,
        submitRestaurantOrder,
        updateCleaningTaskStatus,
        toggleCleaningChecklist,
        createMaintenanceTicket,
        resolveMaintenanceTicket,
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

