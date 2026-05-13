import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkStatus = async () => {
    // @ts-ignore
    if (window.GammalTech && window.GammalTech.isLoggedIn()) {
      try {
        const result = await window.GammalTech.verify();
        if (result.success) {
          // Fetch additional data like bookings from user.get()
          const data = await window.GammalTech.user.get();
          setUser({ ...result.user, ...data });
        } else {
          window.GammalTech.logout();
        }
      } catch (e) {
        console.error("Status check failed", e);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const login = async () => {
    const token = await window.GammalTech.login();
    if (token) {
      const result = await window.GammalTech.verify();
      setUser(result.user);
      return result.user;
    }
    return null;
  };

  const logout = () => {
    window.GammalTech.logout();
    setUser(null);
    window.location.href = '/'; // يرجعه للرئيسية بعد الخروج
  };

  return { user, loading, login, logout };
};