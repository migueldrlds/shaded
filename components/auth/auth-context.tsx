'use client';

import { Customer } from 'lib/shopify/types';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  customer: Customer | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; needsActivation?: boolean; customerId?: string; errors?: string[] }>;
  logout: () => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<{ success: boolean; needsActivation?: boolean; customerId?: string; errors?: string[] }>;
  refreshCustomer: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener información del customer al cargar
  const fetchCustomer = async () => {
    try {
      const response = await fetch('/api/customer');
      const data = await response.json();
      
      if (data.customer) {
        setCustomer(data.customer);
      }
    } catch (error) {
      console.error('Error fetching customer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Login
  const login = async (email: string, password: string): Promise<{ success: boolean; needsActivation?: boolean; customerId?: string; errors?: string[] }> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Obtener información actualizada del customer
        await fetchCustomer();
        return { success: true };
      } else {
        // Check if the error indicates need for activation
        const needsActivation = data.errors?.some((error: string) => 
          error.toLowerCase().includes('unidentified') || 
          error.toLowerCase().includes('activation') ||
          error.toLowerCase().includes('verify')
        );
        
        if (needsActivation) {
          return { 
            success: false, 
            needsActivation: true, 
            customerId: data.customerId,
            errors: data.errors || [data.error || 'Login failed'] 
          };
        }
        
        return { 
          success: false, 
          errors: data.errors || [data.error || 'Login failed'] 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        errors: ['An error occurred during login'] 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      setCustomer(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Register
  const register = async (firstName: string, lastName: string, email: string, password: string): Promise<{ success: boolean; needsActivation?: boolean; customerId?: string; errors?: string[] }> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Registration successful, might need activation
        return { 
          success: true, 
          needsActivation: !!data.customer?.id,
          customerId: data.customer?.id
        };
      } else {
        return { 
          success: false, 
          errors: data.errors || [data.error || 'Registration failed'] 
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        errors: ['An error occurred during registration'] 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh customer data
  const refreshCustomer = async () => {
    await fetchCustomer();
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  const value: AuthContextType = {
    customer,
    isLoading,
    login,
    logout,
    register,
    refreshCustomer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
