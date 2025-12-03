// lib/auth.js
import api from './api';

export function isLoggedIn() {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('access');
}

export function logout() {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('currentUser');
}

// Fetch current user from backend (returns user object or null)
export async function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('access');
  if (!token) return null;
  try {
    const res = await api.get('/auth/user/');
    localStorage.setItem('currentUser', JSON.stringify(res.data));
    return res.data;
  } catch (err) {
    localStorage.removeItem('currentUser');
    return null;
  }
}

// lightweight helper to get cached user synchronously (may be stale)
export function getCachedUser() {
  if (typeof window === 'undefined') return null;
  const s = localStorage.getItem('currentUser');
  return s ? JSON.parse(s) : null;
}
