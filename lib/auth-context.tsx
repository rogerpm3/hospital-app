'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { mockUsers, mockAuditLogs } from './mock-data';
import type { User, UserRole, AuditLog } from './types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  showPasswordRecovery: boolean;
  setShowPasswordRecovery: (show: boolean) => void;
  login: (dni: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  createUser: (userData: Omit<User, 'id' | 'lastLogin'>) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'userId' | 'userRole' | 'timestamp' | 'ipAddress' | 'userAgent' | 'severity'>) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Credenciales por defecto para demostración
const defaultCredentials: Record<string, { password: string; role: UserRole }> = {
  '12345678A': { password: 'admin123', role: 'admin' },
  '23456789B': { password: 'doctor123', role: 'doctor' },
  '34567890C': { password: 'doctor123', role: 'doctor' },
  '45678901D': { password: 'nurse123', role: 'nurse' },
  '56789012E': { password: 'clean123', role: 'cleaning' },
  '67890123F': { password: 'nurse123', role: 'nurse' },
  '78901234G': { password: 'pharmacy123', role: 'pharmacy' },
  '89012345H': { password: 'radiology123', role: 'radiology' },
  '90123456I': { password: 'admission123', role: 'admission' },
  '01234567J': { password: 'social123', role: 'social_work' }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordRecovery, setShowPasswordRecovery] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);

  // Inicializar autenticación al cargar
  useEffect(() => {
    const savedUser = localStorage.getItem('hospital_user');
    const rememberMe = localStorage.getItem('hospital_remember');
    
    if (savedUser && rememberMe === 'true') {
      try {
        const userData = JSON.parse(savedUser);
        const foundUser = mockUsers.find(u => u.dni === userData.dni);
        if (foundUser) {
          setUser(foundUser);
        }
      } catch (error) {
        console.error('Error loading saved user:', error);
        localStorage.removeItem('hospital_user');
        localStorage.removeItem('hospital_remember');
      }
    }
    
    setLoading(false);
  }, []);

  const login = useCallback(async (dni: string, password: string, rememberMe = false): Promise<void> => {
    setLoading(true);
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Buscar usuario en mock data
    const foundUser = mockUsers.find(u => u.dni === dni);
    const credentials = defaultCredentials[dni];
    
    if (!foundUser || !credentials || credentials.password !== password) {
      setLoading(false);
      throw new Error('DNI o contraseña incorrectos');
    }
    
    // Actualizar último login
    const updatedUser = {
      ...foundUser,
      lastLogin: new Date()
    };
    
    setUser(updatedUser);
    
    // Guardar en localStorage si remember me está activado
    if (rememberMe) {
      localStorage.setItem('hospital_user', JSON.stringify({ dni: updatedUser.dni }));
      localStorage.setItem('hospital_remember', 'true');
    }
    
    // Registro de auditoría
    addAuditLog({
      action: 'LOGIN',
      resource: 'system',
      details: { 
        successful: true,
        rememberMe,
        loginMethod: 'password'
      }
    });
    
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    if (user) {
      addAuditLog({
        action: 'LOGOUT',
        resource: 'system',
        details: { 
          sessionDuration: user.lastLogin ? Date.now() - user.lastLogin.getTime() : 0
        }
      });
    }
    
    setUser(null);
    localStorage.removeItem('hospital_user');
    localStorage.removeItem('hospital_remember');
  }, [user]);

  const createUser = useCallback((userData: Omit<User, 'id' | 'lastLogin'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      lastLogin: undefined
    };
    
    // En una implementación real, esto se guardaría en la base de datos
    console.log('Creating user:', newUser);
    
    addAuditLog({
      action: 'CREATE',
      resource: 'user',
      resourceId: newUser.id,
      details: { 
        newUserRole: newUser.role,
        newUserDni: newUser.dni
      }
    });
  }, []);

  const updateUser = useCallback((userId: string, updates: Partial<User>) => {
    // En una implementación real, esto se actualizaría en la base de datos
    console.log('Updating user:', userId, updates);
    
    addAuditLog({
      action: 'UPDATE',
      resource: 'user',
      resourceId: userId,
      details: updates
    });
  }, []);

  const deleteUser = useCallback((userId: string) => {
    // En una implementación real, esto se eliminaría de la base de datos
    console.log('Deleting user:', userId);
    
    addAuditLog({
      action: 'DELETE',
      resource: 'user',
      resourceId: userId
    });
  }, []);

  const addAuditLog = useCallback((logData: Omit<AuditLog, 'id' | 'userId' | 'userRole' | 'timestamp' | 'ipAddress' | 'userAgent' | 'severity'>) => {
    if (!user) return;
    
    const newLog: AuditLog = {
      ...logData,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      userRole: user.role,
      timestamp: new Date(),
      ipAddress: '192.168.1.100', // En producción sería la IP real
      userAgent: navigator.userAgent,
      severity: getSeverityFromAction(logData.action)
    };
    
    setAuditLogs(prev => [newLog, ...prev]);
  }, [user]);

  const getSeverityFromAction = (action: string): AuditLog['severity'] => {
    const criticalActions = ['DELETE', 'LOGIN_FAILED', 'UNAUTHORIZED_ACCESS'];
    const highActions = ['CREATE', 'UPDATE', 'LOGIN', 'LOGOUT'];
    const mediumActions = ['READ', 'SEARCH', 'EXPORT'];
    
    if (criticalActions.includes(action)) return 'Critical';
    if (highActions.includes(action)) return 'High';
    if (mediumActions.includes(action)) return 'Medium';
    return 'Low';
  };

  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<void> => {
    if (!user) throw new Error('Usuario no autenticado');
    
    // Verificar contraseña actual
    const credentials = defaultCredentials[user.dni];
    if (!credentials || credentials.password !== currentPassword) {
      throw new Error('Contraseña actual incorrecta');
    }
    
    // En una implementación real, aquí se actualizaría la contraseña en la base de datos
    console.log('Password changed for user:', user.dni);
    
    addAuditLog({
      action: 'CHANGE_PASSWORD',
      resource: 'user',
      resourceId: user.id,
      details: { success: true }
    });
  }, [user, addAuditLog]);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!user) return false;
    
    // Importar permisos del archivo types
    const { rolePermissions } = require('./types');
    const userPermissions = rolePermissions[user.role] || [];
    
    return userPermissions.includes(permission);
  }, [user]);

  const requestPasswordReset = useCallback(async (email: string): Promise<void> => {
    // Simular envío de email
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Password reset requested for:', email);
    
    addAuditLog({
      action: 'REQUEST_PASSWORD_RESET',
      resource: 'system',
      details: { email }
    });
  }, [addAuditLog]);

  const resetPassword = useCallback(async (token: string, newPassword: string): Promise<void> => {
    // Simular validación de token y cambio de contraseña
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Password reset with token:', token);
    
    addAuditLog({
      action: 'RESET_PASSWORD',
      resource: 'system',
      details: { tokenUsed: token.substring(0, 8) + '...' }
    });
  }, [addAuditLog]);

  const value: AuthContextType = {
    user,
    loading,
    showPasswordRecovery,
    setShowPasswordRecovery,
    login,
    logout,
    createUser,
    updateUser,
    deleteUser,
    addAuditLog,
    changePassword,
    hasPermission,
    requestPasswordReset,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
