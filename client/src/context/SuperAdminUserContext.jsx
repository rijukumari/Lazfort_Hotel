import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { hotelApi, invalidateApiCache } from '../services/hotelApi';

const STORAGE_KEY = 'lazfort_superadmin_users_v1';

const SuperAdminUserContext = createContext(undefined);

export const SuperAdminUserProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const seen = new Set();
          return parsed.filter(u => {
            const key = u.db_id ? `db-${u.db_id}` : (u.id || u.email);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        }
      }
    } catch {
      // fallback
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(false);

  // Fetch users from backend MySQL database
  const refreshUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const backendUsers = await hotelApi.getUsers();
      if (Array.isArray(backendUsers)) {
        // Deduplicate users strictly by unique id, db_id, and email to ensure no duplicate keys
        const seen = new Set();
        const uniqueUsers = [];
        for (const u of backendUsers) {
          const key = String(u.id || u.db_id || u.email || Math.random());
          if (!seen.has(key)) {
            seen.add(key);
            uniqueUsers.push(u);
          }
        }
        setUsers(uniqueUsers);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(uniqueUsers));
      }
    } catch (err) {
      if (!err?.message?.includes('Failed to fetch')) {
        console.warn('[SuperAdminUserContext] Using local users store fallback:', err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Upload or change avatar for any user and persist to MySQL
  const uploadUserAvatar = async (id, fileOrData) => {
    try {
      let res;
      if (fileOrData instanceof File || fileOrData instanceof Blob) {
        const formData = new FormData();
        formData.append('avatar', fileOrData);
        res = await hotelApi.uploadAvatar(id, formData);
      } else {
        res = await hotelApi.uploadAvatar(id, fileOrData);
      }

      if (res && res.avatar) {
        setUsers(prev => prev.map(u => (u.id === id || String(u.db_id) === String(id) ? { ...u, avatar: res.avatar } : u)));
        return res.avatar;
      }
    } catch (err) {
      console.error('[SuperAdminUserContext] uploadUserAvatar error:', err);
      throw err;
    }
  };

  // Automatically fetch from backend MySQL on initial mount
  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  useEffect(() => {
    if (users && users.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
  }, [users]);

  const addUser = async (userData) => {
    const tempId = `usr-${Date.now().toString().slice(-4)}`;
    const hotelVal = userData.hotel || (Array.isArray(userData.hotelAccess) ? userData.hotelAccess[0] : userData.hotelAccess) || 'All Properties';
    const avatarFile = userData.avatarFile;
    const cleanUserData = { ...userData };
    delete cleanUserData.avatarFile;

    const newUserObj = {
      ...cleanUserData,
      id: tempId,
      hotel: hotelVal,
      hotelAccess: Array.isArray(userData.hotelAccess) ? userData.hotelAccess : [hotelVal],
      registeredDate: new Date().toISOString().split('T')[0],
      lastLogin: 'Never (New Account)',
      status: userData.status || 'active',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    };

    // Update state immediately for rapid responsive UI
    setUsers(prev => [newUserObj, ...prev]);

    // Persist directly to Laravel REST API + MySQL
    try {
      invalidateApiCache('/users');
      let savedUser;
      if (avatarFile instanceof File || avatarFile instanceof Blob) {
        const formData = new FormData();
        Object.keys(newUserObj).forEach(k => {
          if (newUserObj[k] !== undefined && newUserObj[k] !== null) {
            formData.append(k, typeof newUserObj[k] === 'object' ? JSON.stringify(newUserObj[k]) : newUserObj[k]);
          }
        });
        formData.append('avatar_file', avatarFile);
        savedUser = await hotelApi.createUser(formData);
      } else {
        savedUser = await hotelApi.createUser(newUserObj);
      }

      if (savedUser && savedUser.id) {
        setUsers(prev => prev.map(u => (u.id === tempId ? { ...u, ...savedUser } : u)));
        return savedUser;
      }
    } catch (err) {
      console.error('[SuperAdminUserContext] Error persisting user to MySQL:', err);
      throw err;
    }
  };

  const updateUser = async (id, updates) => {
    setUsers(prev => prev.map(u => (u.id === id || String(u.db_id) === String(id) ? { ...u, ...updates } : u)));
    try {
      invalidateApiCache('/users');
      const response = await hotelApi.updateUser(id, updates);
      if (response && response.user) {
        setUsers(prev => prev.map(u => (u.id === id || String(u.db_id) === String(id) ? { ...u, ...response.user } : u)));
      }
    } catch (err) {
      console.warn('[SuperAdminUserContext] Update user sync error:', err.message);
      throw err;
    }
  };

  const suspendUser = async (id, reason = 'Administrative clearance suspended by Super Admin.') => {
    const updates = {
      status: 'suspended',
      suspensionDate: new Date().toISOString().split('T')[0],
      suspensionReason: reason,
    };
    setUsers(prev =>
      prev.map(u => (u.id === id || String(u.db_id) === String(id) ? { ...u, ...updates } : u))
    );
    try {
      invalidateApiCache('/users');
      await hotelApi.updateUser(id, updates);
    } catch (err) {
      console.warn('[SuperAdminUserContext] Suspend user sync error:', err.message);
      throw err;
    }
  };

  const reactivateUser = async (id) => {
    const updates = {
      status: 'active',
      suspensionDate: null,
      suspensionReason: null,
    };
    setUsers(prev =>
      prev.map(u => (u.id === id || String(u.db_id) === String(id) ? { ...u, ...updates } : u))
    );
    try {
      invalidateApiCache('/users');
      await hotelApi.updateUser(id, updates);
    } catch (err) {
      console.warn('[SuperAdminUserContext] Reactivate user sync error:', err.message);
      throw err;
    }
  };

  const deleteUser = async (id) => {
    setUsers(prev => prev.filter(u => u.id !== id && String(u.db_id) !== String(id)));
    try {
      invalidateApiCache('/users');
      await hotelApi.deleteUser(id);
    } catch (err) {
      console.warn('[SuperAdminUserContext] Delete user sync error:', err.message);
      throw err;
    }
  };

  return (
    <SuperAdminUserContext.Provider
      value={{
        users,
        isLoading,
        refreshUsers,
        addUser,
        updateUser,
        uploadUserAvatar,
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
