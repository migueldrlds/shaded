'use client';

import { Customer } from 'lib/shopify/types';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  customer: Customer | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; needsActivation?: boolean; customerId?: string; errors?: string[] }>;
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

  // Login - Now only requires email (uses Customer Account API with OAuth 2.0)
  const login = async (email: string, password?: string): Promise<{ success: boolean; needsActivation?: boolean; customerId?: string; errors?: string[] }> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.authorizationUrl) {
        // Redirect will happen in the component
        // Return success so component can redirect
        return { success: true };
      } else {
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
