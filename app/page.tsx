'use client';

import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { HospitalProvider } from '@/lib/hospital-context';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import LoginForm from '@/components/login-form';
import PasswordRecovery from '@/components/password-recovery';
import DashboardContent from '@/components/dashboard/dashboard-content';
import Header from '@/components/dashboard/header';
import Sidebar from '@/components/dashboard/sidebar';
import { Loader2 } from 'lucide-react';

// Función para obtener el título de la sección
export function getSectionTitle(section: string): string {
  const titles: Record<string, string> = {
    dashboard: 'Dashboard Principal',
    patients: 'Gestión de Pacientes',
    staff: 'Gestión de Personal',
    rooms: 'Gestión de Habitaciones',
    'bed-management': 'Gestión de Camas',
    appointments: 'Citas Médicas',
    admissions: 'Admisiones',
    'medical-orders': 'Órdenes Médicas',
    nursing: 'Documentación de Enfermería',
    rounds: 'Rondas Médicas',
    discharge: 'Alta Hospitalaria',
    analytics: 'Métricas y Analítica',
    communication: 'Comunicación Interna',
    audit: 'Auditoría del Sistema',
    settings: 'Configuración',
    cleaning: 'Panel de Limpieza'
  };
  return titles[section] || 'Sistema Hospitalario';
}

function AppContent() {
  const { user, loading, showPasswordRecovery, setShowPasswordRecovery } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    // Cerrar sidebar en móvil cuando se cambia de sección
    setSidebarOpen(false);
  }, [activeSection]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando sistema hospitalario...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md">
            {showPasswordRecovery ? (
              <PasswordRecovery onBack={() => setShowPasswordRecovery(false)} />
            ) : (
              <LoginForm onForgotPassword={() => setShowPasswordRecovery(true)} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        open={sidebarOpen} 
        setOpen={setSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title={getSectionTitle(activeSection)}
        />
        <main className="flex-1 overflow-auto">
          <DashboardContent 
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AuthProvider>
        <HospitalProvider>
          <AppContent />
          <Toaster />
        </HospitalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
