import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AuthContext } from './authContext';

const ACTIVE_USER_KEY = 'ai_music_auth_user';
const REGISTERED_USERS_KEY = 'ai_music_registered_users';

// Initial demo users stored in database
const INITIAL_REGISTERED_USERS = [
  {
    id: 'usr-demo-001',
    name: 'Music Lover',
    email: 'demo@aimusic.com',
    password: 'password123',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=MusicLover',
    joinedAt: 'Jan 2026',
    isPremium: true,
  },
];

export const AuthProvider = ({ children }) => {
  // 1. Load active session
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 2. Load registered users database from localStorage
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(REGISTERED_USERS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(INITIAL_REGISTERED_USERS));
      return INITIAL_REGISTERED_USERS;
    } catch {
      return INITIAL_REGISTERED_USERS;
    }
  });

  // 3. Modal state & notifications
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'signup'
  const [authToast, setAuthToast] = useState(null);

  useEffect(() => {
    if (authToast) {
      const timer = setTimeout(() => setAuthToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [authToast]);

  const showToast = (message, type = 'success') => {
    setAuthToast({ message, type });
  };

  const openAuthModal = useCallback((mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  // 4. SIGN UP: Creates a new user account in database
  const signup = useCallback((name, email, password) => {
    if (!name || !email || !password) {
      return { success: false, message: 'Please fill in all required fields.' };
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name.trim();

    // Check if account already exists
    const existing = registeredUsers.find((u) => u.email === cleanEmail);
    if (existing) {
      return {
        success: false,
        message: 'An account already exists with this email! Please Log In instead.',
      };
    }

    // Create new registered user
    const newUser = {
      id: `usr-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password: password, // In production this would be hashed
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(cleanName)}`,
      joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      isPremium: true,
    };

    const updatedList = [...registeredUsers, newUser];
    setRegisteredUsers(updatedList);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updatedList));

    // Automatically log in newly created user
    setUser(newUser);
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(newUser));
    setIsAuthModalOpen(false);
    showToast(`Account created! Welcome to SonicAI Music, ${newUser.name}! 🎉`, 'success');
    return { success: true };
  }, [registeredUsers]);

  // 5. LOG IN: Only allows registered users with matching password
  const login = useCallback((email, password) => {
    if (!email || !password) {
      return { success: false, message: 'Please enter both email and password.' };
    }

    const cleanEmail = email.toLowerCase().trim();

    // Find account in database
    const matchedAccount = registeredUsers.find((u) => u.email === cleanEmail);

    if (!matchedAccount) {
      return {
        success: false,
        message: 'Account not found! Please Sign Up first to create your account.',
        notRegistered: true,
      };
    }

    // Check password match
    if (matchedAccount.password !== password) {
      return {
        success: false,
        message: 'Incorrect password! Please check your password and try again.',
      };
    }

    // Login successful
    setUser(matchedAccount);
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(matchedAccount));
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${matchedAccount.name}! 🎵`, 'success');
    return { success: true };
  }, [registeredUsers]);

  // 6. Quick Demo Guest Login (Logs into verified demo account)
  const loginAsGuest = useCallback(() => {
    const demoUser = INITIAL_REGISTERED_USERS[0];
    setUser(demoUser);
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(demoUser));
    setIsAuthModalOpen(false);
    showToast('Logged in with Demo Account (demo@aimusic.com)! ✨', 'success');
  }, []);

  // 7. Log Out
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(ACTIVE_USER_KEY);
    showToast('Logged out successfully. See you soon!', 'info');
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      registeredUsers,
      isAuthModalOpen,
      authModalMode,
      authToast,
      setAuthModalMode,
      openAuthModal,
      closeAuthModal,
      login,
      signup,
      loginAsGuest,
      logout,
    }),
    [
      user,
      registeredUsers,
      isAuthModalOpen,
      authModalMode,
      authToast,
      openAuthModal,
      closeAuthModal,
      login,
      signup,
      loginAsGuest,
      logout,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
