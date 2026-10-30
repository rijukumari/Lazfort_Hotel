export const mockHousekeepingTasks = [
  {
    id: 'tsk-201',
    roomId: 'room-101',
    roomNumber: 'PH-1201',
    roomType: 'Presidential Suite',
    assignedStaffId: 'stf-003',
    assignedStaffName: 'Margaux Dubois',
    priority: 'urgent',
    status: 'in_progress',
    cleaningType: 'Full Turnover',
    estimatedMinutes: 90,
    checklist: [
      { item: 'Replace Frette 1000-thread Egyptian sheets & silk duvets', completed: true },
      { item: 'Restock Bulgari luxury amenity set & plush slippers', completed: true },
      { item: 'Disinfect marble bathroom, steam sauna & whirlpool', completed: false },
      { item: 'Inspect infinity pool pH & heated temperature', completed: false },
      { item: 'Arrange fresh white orchids and Dom Pérignon welcome tray', completed: false }
    ],
    notes: 'VIP Sir Alexander arriving at 17:00. High attention to balcony terrace glass.',
    updatedAt: '14:20 Today'
  },
  {
    id: 'tsk-202',
    roomId: 'room-104',
    roomNumber: 'EX-510',
    roomType: 'Executive Suite',
    assignedStaffId: 'stf-005',
    assignedStaffName: 'Elena Rostova',
    priority: 'high',
    status: 'pending',
    cleaningType: 'Daily Refresh',
    estimatedMinutes: 45,
    checklist: [
      { item: 'Tidy bed and refresh bolster cushions', completed: false },
      { item: 'Empty and sanitize espresso station', completed: false },
      { item: 'Replenish sparkling Acqua Panna water', completed: false },
      { item: 'Vacuum plush wool carpets and polish desk surface', completed: false }
    ],
    notes: 'Guest requested extra lavender pillow mist.',
    updatedAt: '13:45 Today'
  },
  {
    id: 'tsk-203',
    roomId: 'room-102',
    roomNumber: 'ST-804',
    roomType: 'Royal Penthouse',
    assignedStaffId: 'stf-003',
    assignedStaffName: 'Margaux Dubois',
    priority: 'medium',
    status: 'completed',
    cleaningType: 'Deep Sanitization',
    estimatedMinutes: 60,
    checklist: [
      { item: 'Deep clean Carrara marble fireplace', completed: true },
      { item: 'Sanitize climate controls and touch panels', completed: true },
      { item: 'Restock private terrace minibar', completed: true }
    ],
    notes: 'Passed executive hygiene inspection with 100% score.',
    updatedAt: '11:30 Today'
  },
  {
    id: 'tsk-204',
    roomId: 'room-106',
    roomNumber: 'JN-402',
    roomType: 'Junior Suite',
    assignedStaffId: 'stf-005',
    assignedStaffName: 'Elena Rostova',
    priority: 'medium',
    status: 'inspected',
    cleaningType: 'Inspection',
    estimatedMinutes: 30,
    checklist: [
      { item: 'Check plumbing pressure and heated towel rails', completed: true },
      { item: 'Verify acoustic sound insulation and blackout blinds', completed: true },
      { item: 'Audit electronic lock battery and safe code reset', completed: true }
    ],
    notes: 'Ready for guest check-in.',
    updatedAt: '09:15 Today'
  }
];

export default mockHousekeepingTasks;

