import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialSuperAdminUsers } from '../data/mockSuperAdminModules';

const STORAGE_KEY = 'lazfort_superadmin_users_v1';

const SuperAdminUserContext = createContext(undefined);

export const SuperAdminUserProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return initialSuperAdminUsers;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  const addUser = userData => {
    const newUser = {
      ...userData,
      id: `usr-${Date.now().toString().slice(-4)}`,
      registeredDate: new Date().toISOString().split('T')[0],
      lastLogin: 'Never (New Account)',
    };
    setUsers(prev => [newUser, ...prev]);
  };

  const updateUser = (id, updates) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updates } : u)));
  };

  const suspendUser = (id, reason = 'Administrative clearance suspended by Super Admin.') => {
    setUsers(prev =>
      prev.map(u =>
        u.id === id
          ? {
              ...u,
              status: 'suspended',
              suspensionDate: new Date().toISOString().split('T')[0],
              suspensionReason: reason,
            }
          : u
      )
    );
  };

  const reactivateUser = id => {
    setUsers(prev =>
      prev.map(u =>
        u.id === id
          ? {
              ...u,
              status: 'active',
              suspensionDate: undefined,
              suspensionReason: undefined,
            }
          : u
      )
    );
  };

  const deleteUser = id => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <SuperAdminUserContext.Provider
      value={{
        users,
        addUser,
        updateUser,
        suspendUser,
        reactivateUser,
        deleteUser,
      }}
    >
      {children}
    </SuperAdminUserContext.Provider>
  );
};

export const useSuperAdminUsers = () => {
  const context = useContext(SuperAdminUserContext);
  if (!context) {
    throw new Error('useSuperAdminUsers must be used within a SuperAdminUserProvider');
  }
  return context;
};

export default SuperAdminUserProvider;

