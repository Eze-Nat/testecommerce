import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, logoutUser } from '../api/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Inicializar usuario desde localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    setUser(storedUser ? JSON.parse(storedUser) : null);
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const userData = await loginUser(email, password);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      navigate('/');
      return userData;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const register = useCallback(async (userData) => {
    setLoading(true);
    try {
      const newUser = await registerUser(userData);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      navigate('/');
      return newUser;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    await logoutUser();
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};