import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { getMe } from '../api/authApi';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginUser: (token: string, user: User) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('manager_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('manager_token');
    if (storedToken) {
      getMe()
        .then((res) => {
          // Backend returns { data: { user: {...} } } — normalize id → _id
          const raw = res.data.data as { user?: User } | User;
          const userData = (raw as { user?: User }).user ?? (raw as User);
          const user = { ...userData, _id: userData._id ?? (userData as unknown as { id: string }).id };
          setUser(user);
          setToken(storedToken);
        })
        .catch(() => {
          localStorage.removeItem('manager_token');
          localStorage.removeItem('manager_user');
          setToken(null);
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const loginUser = (newToken: string, newUser: User) => {
    localStorage.setItem('manager_token', newToken);
    localStorage.setItem('manager_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logoutUser = () => {
    localStorage.removeItem('manager_token');
    localStorage.removeItem('manager_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, isAuthenticated: !!token, loginUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
