import React, { createContext, useContext, useState, useEffect } from 'react';
import { hotelApi } from '../services/hotelApi';

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
    const saved = localStorage.getItem('aurelia_role') || localStorage.getItem('lazfort_role');
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
    return ROLE_DEMO_CONFIGS[role]?.mockUser || ROLE_DEMO_CONFIGS.hotel_admin.mockUser;
  });

  /**
   * Connect to Laravel API Backend login
   */
  const login = async (targetRole, email, password) => {
    try {
      // Dispatch real authentication request to Laravel Backend + MySQL
      const res = await hotelApi.login({
        email: email.trim(),
        password: password || '••••••••••••',
        role: targetRole,
      });

      if (res && res.user) {
        const backendUser = res.user;
        const normalizedRole = backendUser.role || targetRole;
        const baseConfig = ROLE_DEMO_CONFIGS[normalizedRole] || ROLE_DEMO_CONFIGS.hotel_admin;

        const authUser = {
          ...baseConfig.mockUser,
          ...backendUser,
          id: backendUser.id || baseConfig.mockUser.id,
          name: backendUser.name,
          email: backendUser.email,
          role: normalizedRole,
          hotelName: backendUser.hotelName || baseConfig.mockUser.hotelName,
        };

        if (res.token) {
          localStorage.setItem('lazfort_token', res.token);
        }

        setRole(normalizedRole);
        setUser(authUser);
        setIsAuthenticated(true);
        localStorage.setItem('aurelia_role', normalizedRole);
        localStorage.setItem('lazfort_role', normalizedRole);
        localStorage.setItem('aurelia_auth', 'true');
        localStorage.setItem('aurelia_user', JSON.stringify(authUser));
        localStorage.setItem('lazfort_user', JSON.stringify(authUser));

        return { success: true, user: authUser };
      }
    } catch (err) {
      // If server rejected credentials with 401/422/403, bubble up error
      if (err.status === 401 || err.status === 403 || err.status === 422) {
        throw err;
      }

      // If backend is unreachable or local development fallback
      console.warn('[AuthContext] Backend login error, using local clearance:', err.message);
      setRole(targetRole);
      const baseUser = ROLE_DEMO_CONFIGS[targetRole]?.mockUser || ROLE_DEMO_CONFIGS.hotel_admin.mockUser;
      const finalUser = {
        ...baseUser,
        email: email || baseUser.email,
      };
      setUser(finalUser);
      setIsAuthenticated(true);
      localStorage.setItem('aurelia_role', targetRole);
      localStorage.setItem('aurelia_auth', 'true');
      localStorage.setItem('aurelia_user', JSON.stringify(finalUser));
      return { success: true, user: finalUser };
    }
  };

  /**
   * Connect to Laravel API Backend signup & save into MySQL
   */
  const signup = async (name, email, targetRole, hotelName, password) => {
    // Dispatch real registration request to Laravel Backend + MySQL
    const res = await hotelApi.signup({
      name: name.trim(),
      email: email.trim(),
      role: targetRole,
      hotelName: hotelName || 'Lazfort Grand Palace & Royal Spa',
      password: password || 'Lazfort#2026!',
    });

    if (res && res.user) {
      const backendUser = res.user;
      const normalizedRole = backendUser.role || targetRole;
      const baseConfig = ROLE_DEMO_CONFIGS[normalizedRole] || ROLE_DEMO_CONFIGS.customer;

      const newUser = {
        ...baseConfig.mockUser,
        ...backendUser,
        id: backendUser.id,
        name: backendUser.name,
        email: backendUser.email,
        role: normalizedRole,
        hotelName: backendUser.hotelName || hotelName,
      };

      if (res.token) {
        localStorage.setItem('lazfort_token', res.token);
      }

      setRole(normalizedRole);
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('aurelia_role', normalizedRole);
      localStorage.setItem('lazfort_role', normalizedRole);
      localStorage.setItem('aurelia_auth', 'true');
      localStorage.setItem('aurelia_user', JSON.stringify(newUser));
      localStorage.setItem('lazfort_user', JSON.stringify(newUser));

      return { success: true, user: newUser };
    }

    throw new Error('Registration failed. No user returned.');
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
      localStorage.setItem('lazfort_user', JSON.stringify(updated));
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
      localStorage.setItem('lazfort_user', JSON.stringify(updated));
      return updated;
    });
  };

  const switchRole = newRole => {
    setRole(newRole);
    const newUser = ROLE_DEMO_CONFIGS[newRole].mockUser;
    setUser(newUser);
    localStorage.setItem('aurelia_role', newRole);
    localStorage.setItem('aurelia_user', JSON.stringify(newUser));
    localStorage.setItem('lazfort_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('aurelia_auth', 'false');
    localStorage.removeItem('lazfort_token');
  };

  useEffect(() => {
    if (!localStorage.getItem('aurelia_user')) {
      setUser(ROLE_DEMO_CONFIGS[role]?.mockUser || ROLE_DEMO_CONFIGS.hotel_admin.mockUser);
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
