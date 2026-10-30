import React, { createContext, useContext, useState, useEffect } from 'react';

export const ROLE_DEMO_CONFIGS = {
  super_admin: {
    role: 'super_admin',
    label: 'Super Admin',
    description: 'Global Hotel Chain Portfolio & Platform Controller',
    defaultPath: '/super-admin/dashboard',
    mockUser: {
      id: 'usr-sa-1',
      name: 'Julian St. Clair',
      email: 'julian@grandluxe-group.com',
      role: 'super_admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      status: 'active',
      department: 'Corporate Executive Suite',
    },
  },
  hotel_admin: {
    role: 'hotel_admin',
    label: 'Hotel Admin (GM)',
    description: 'Property General Manager — Lazfort Grand Palace Monaco',
    defaultPath: '/hotel-admin/dashboard',
    mockUser: {
      id: 'usr-ha-1',
      name: 'Lord Alistair Sterling',
      email: 'gm@lazfort.com',
      role: 'hotel_admin',
      hotelId: 'hotel-001',
      hotelName: 'Lazfort Grand Palace & Royal Spa',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      status: 'active',
      department: 'General Management',
    },
  },
  receptionist: {
    role: 'receptionist',
    label: 'Front Desk / Concierge',
    description: 'Front Desk Lead & VIP Guest Services Concierge',
    defaultPath: '/receptionist/dashboard',
    mockUser: {
      id: 'usr-rc-1',
      name: 'Camilla Valente',
      email: 'camilla.v@lazfort.com',
      role: 'receptionist',
      hotelId: 'hotel-001',
      hotelName: 'Lazfort Grand Palace',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      status: 'active',
      department: 'Front Office',
    },
  },
  customer: {
    role: 'customer',
    label: 'Customer',
    description: 'Guest Reservations, Suite Booking & Resident Portal',
    defaultPath: '/customer/dashboard',
    mockUser: {
      id: 'usr-cs-1',
      name: 'Sir Alexander Kensington',
      email: 'a.kensington@capitalgroup.co.uk',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      status: 'active',
      membershipTier: 'VIP',
      vipStatus: true,
      phone: '+44 20 7946 0912',
      nationality: 'Monaco / British',
      address: '7 Avenue Princesse Grace, Monte-Carlo',
      idNumber: 'MC-VIP-88190',
      loyaltyPoints: 34500,
      totalStays: 14,
      totalSpent: 168000,
      preferences: ['Penthouse Floor', 'Extra Dry Champagne', 'Private Chauffeur', 'Non-smoking'],
    },
  },
  housekeeping: {
    role: 'housekeeping',
    label: 'Housekeeping Lead',
    description: 'Suite Hygiene, Maintenance Inspections & Turnovers',
    defaultPath: '/housekeeping/dashboard',
    mockUser: {
      id: 'usr-hk-1',
      name: 'Margaux Dubois',
      email: 'margaux.d@lazfort.com',
      role: 'housekeeping',
      hotelId: 'hotel-001',
      hotelName: 'Lazfort Grand Palace',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
      status: 'active',
      department: 'Housekeeping Department',
    },
  },
  staff: {
    role: 'staff',
    label: 'Staff Member',
    description: 'Staff Operations, Shift Scheduling & Task Tracking',
    defaultPath: '/staff/dashboard',
    mockUser: {
      id: 'usr-st-1',
      name: 'Sebastian Laurent',
      email: 'sebastian.l@lazfort.com',
      role: 'staff',
      hotelId: 'hotel-001',
      hotelName: 'Lazfort Grand Palace',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
      status: 'active',
      department: 'Concierge Services',
    },
  },
};

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(() => {
    const saved = localStorage.getItem('aurelia_role');
    return saved && ROLE_DEMO_CONFIGS[saved] ? saved : 'hotel_admin';
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('aurelia_auth');
    return saved !== 'false';
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('lazfort_user') || localStorage.getItem('aurelia_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser.replace(/Aurelia/gi, 'Lazfort'));
      } catch (e) {
        // fallback
      }
    }
    return ROLE_DEMO_CONFIGS[role].mockUser;
  });

  const login = (targetRole, email, name) => {
    setRole(targetRole);
    const baseUser = ROLE_DEMO_CONFIGS[targetRole].mockUser;
    const finalUser = {
      ...baseUser,
      email: email || baseUser.email,
      name: name || baseUser.name,
      membershipTier: (email && email.toLowerCase().includes('standard')) ? 'Standard' : (baseUser.membershipTier || 'VIP'),
      vipStatus: (email && email.toLowerCase().includes('standard')) ? false : (baseUser.vipStatus ?? true),
    };
    setUser(finalUser);
    setIsAuthenticated(true);
    localStorage.setItem('aurelia_role', targetRole);
    localStorage.setItem('aurelia_auth', 'true');
    localStorage.setItem('aurelia_user', JSON.stringify(finalUser));
  };

  const updateUserProfile = updates => {
    setUser(prev => {
      const safeUpdates = { ...updates };
      if (prev.role === 'customer') {
        delete safeUpdates.membershipTier;
        delete safeUpdates.vipStatus;
      }
      const updated = { ...prev, ...safeUpdates };
      localStorage.setItem('aurelia_user', JSON.stringify(updated));
      return updated;
    });
  };

  const updateCustomerMembershipTier = tier => {
    setUser(prev => {
      const updated = {
        ...prev,
        membershipTier: tier,
        vipStatus: tier === 'VIP' || tier === 'Diamond',
      };
      localStorage.setItem('aurelia_user', JSON.stringify(updated));
      return updated;
    });
  };

  const signup = (name, email, targetRole, hotelName) => {
    setRole(targetRole);
    const baseUser = ROLE_DEMO_CONFIGS[targetRole].mockUser;
    const newUser = {
      ...baseUser,
      id: `usr-${Date.now()}`,
      name,
      email,
      role: targetRole,
      hotelName: hotelName || baseUser.hotelName,
    };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('aurelia_role', targetRole);
    localStorage.setItem('aurelia_auth', 'true');
    localStorage.setItem('aurelia_user', JSON.stringify(newUser));
  };

  const switchRole = newRole => {
    setRole(newRole);
    const newUser = ROLE_DEMO_CONFIGS[newRole].mockUser;
    setUser(newUser);
    localStorage.setItem('aurelia_role', newRole);
    localStorage.setItem('aurelia_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('aurelia_auth', 'false');
  };

  useEffect(() => {
    if (!localStorage.getItem('aurelia_user')) {
      setUser(ROLE_DEMO_CONFIGS[role].mockUser);
    }
  }, [role]);

  return (
    <AuthContext.Provider
      value={{
        role,
        user,
        isAuthenticated,
        login,
        signup,
        switchRole,
        updateUserProfile,
        updateCustomerMembershipTier,
        availableRoles: Object.values(ROLE_DEMO_CONFIGS),
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;

