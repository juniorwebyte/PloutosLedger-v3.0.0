import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import licenseService from '../services/licenseService';

// Tipagem aprimorada para o contexto
interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: string | null;
  license: any | null;
  setLicense: (lic: any | null) => void;
  role: 'user' | 'admin' | 'superadmin';
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [license, setLicense] = useState<any | null>(null);
  const [role, setRole] = useState<'user' | 'admin' | 'superadmin'>('user');
  const [isLoading, setIsLoading] = useState(true);

  // Função centralizada para carregar estado do localStorage
  const loadAuthState = useCallback(() => {
    try {
      const savedUser = localStorage.getItem('caixa_user');
      const lastLogin = localStorage.getItem('caixa_last_login');
      const savedRole = localStorage.getItem('caixa_role') as any;
      
      if (savedUser && lastLogin) {
        const lastLoginTime = new Date(lastLogin).getTime();
        const currentTime = new Date().getTime();
        const hoursSinceLogin = (currentTime - lastLoginTime) / (1000 * 60 * 60);
        
        // Sessão válida por 12 horas (aumentado de 8 para melhor UX)
        if (hoursSinceLogin < 12) {
          setIsAuthenticated(true);
          setUser(savedUser);
          setRole(savedRole || 'user');
          
          // Carregar licença
          const savedLicense = localStorage.getItem('ploutos_license');
          if (savedLicense) {
            setLicense(JSON.parse(savedLicense));
          }
        } else {
          // Sessão expirada
          logout();
        }
      }
    } catch (error) {
      console.error('Erro ao carregar estado de autenticação:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Inicialização e Sincronização entre abas
  useEffect(() => {
    loadAuthState();

    // Sincronizar logout/login entre abas do navegador
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'caixa_user' || e.key === 'auth_token') {
        loadAuthState();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadAuthState]);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Credenciais válidas (Simulação de Backend)
      const validCredentials = {
        'Webyte': { password: 'Webyte', role: 'user' },
        'admin': { password: 'admin123', role: 'superadmin' },
        'demo': { password: 'demo123', role: 'user' }
      };

      const userCreds = validCredentials[username as keyof typeof validCredentials];
      
      if (userCreds && userCreds.password === password) {
        const token = btoa(JSON.stringify({ username, role: userCreds.role, timestamp: Date.now() }));
        
        // Persistência Atômica
        localStorage.setItem('auth_token', token);
        localStorage.setItem('caixa_user', username);
        localStorage.setItem('caixa_last_login', new Date().toISOString());
        localStorage.setItem('caixa_role', userCreds.role);
        
        setIsAuthenticated(true);
        setUser(username);
        setRole(userCreds.role as any);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    setRole('user');
    setLicense(null);
    
    // Limpeza total de segurança
    localStorage.removeItem('caixa_user');
    localStorage.removeItem('caixa_last_login');
    localStorage.removeItem('caixa_role');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('ploutos_license');
    
    // Notificar outras abas
    window.dispatchEvent(new Event('storage'));
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    login,
    logout,
    user,
    license,
    setLicense,
    role,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
