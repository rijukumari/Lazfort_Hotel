import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialSuperAdminUsers } from '../data/mockSuperAdminModules';
import { hotelApi } from '../services/hotelApi';

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

  const [isLoading, setIsLoading] = useState(false);

  // Initial fetch from MySQL Backend
  useEffect(() => {
    let isMounted = true;
    const fetchBackendUsers = async () => {
      try {
        setIsLoading(true);
        const backendUsers = await hotelApi.getUsers();
        if (isMounted && Array.isArray(backendUsers) && backendUsers.length > 0) {
          setUsers(backendUsers);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(backendUsers));
        }
      } catch (err) {
        console.warn('[SuperAdminUserContext] Using local users store:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchBackendUsers();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  const addUser = async (userData) => {
    const newUserObj = {
      ...userData,
      id: `usr-${Date.now().toString().slice(-4)}`,
      registeredDate: new Date().toISOString().split('T')[0],
      lastLogin: 'Never (New Account)',
      status: userData.status || 'active',
    };

    // Update state immediately for rapid responsive UI
    setUsers(prev => [newUserObj, ...prev]);

    // Persist asynchronously directly to Laravel REST API + MySQL
    try {
      const savedUser = await hotelApi.createUser(newUserObj);
      if (savedUser && savedUser.id) {
        setUsers(prev => prev.map(u => u.id === newUserObj.id ? { ...u, ...savedUser } : u));
      }
    } catch (err) {
      console.error('[SuperAdminUserContext] Error persisting user to MySQL:', err);
    }
  };

  const updateUser = async (id, updates) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updates } : u)));
    try {
      await hotelApi.updateUser(id, updates);
    } catch (err) {
      console.warn('[SuperAdminUserContext] Update user sync error:', err.message);
    }
  };

  const suspendUser = async (id, reason = 'Administrative clearance suspended by Super Admin.') => {
    const updates = {
      status: 'suspended',
      suspensionDate: new Date().toISOString().split('T')[0],
      suspensionReason: reason,
    };
    setUsers(prev =>
      prev.map(u => (u.id === id ? { ...u, ...updates } : u))
    );
    try {
      await hotelApi.updateUser(id, updates);
    } catch (err) {
      console.warn('[SuperAdminUserContext] Suspend user sync error:', err.message);
    }
  };

  const reactivateUser = async (id) => {
    const updates = {
      status: 'active',
      suspensionDate: null,
      suspensionReason: null,
    };
    setUsers(prev =>
      prev.map(u => (u.id === id ? { ...u, ...updates } : u))
    );
    try {
      await hotelApi.updateUser(id, updates);
    } catch (err) {
      console.warn('[SuperAdminUserContext] Reactivate user sync error:', err.message);
    }
  };

  const deleteUser = async (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    try {
      await hotelApi.deleteUser(id);
    } catch (err) {
      console.warn('[SuperAdminUserContext] Delete user sync error:', err.message);
    }
  };

  return (
    <SuperAdminUserContext.Provider
      value={{
        users,
        isLoading,
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
