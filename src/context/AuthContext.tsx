import { createContext, useContext, useState, useEffect } from "react";

export interface AppUser {
  id: string;
  email: string;
  password: string;
  role: 'seller' | 'client';
  name: string;
}

const USERS: AppUser[] = [
  { id: "vendedor1", email: "admin@app.com", password: "1234", role: "seller", name: "Vendedor Blum" },
  { id: "cliente1", email: "cliente@app.com", password: "1234", role: "client", name: "Cliente Blum" }
];

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => false,
  logout: () => {}
});

export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("blum_user");
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    const found = USERS.find(u => u.email === email && u.password === password);
    if (!found) return false;
    setUser(found);
    localStorage.setItem("blum_user", JSON.stringify(found));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("blum_user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);