'use client';

import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { roleMenuItems } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  Bed,
  Calendar,
  ClipboardPlus,
  Stethoscope,
  PillBottle,
  Route,
  FileText,
  BarChart3,
  MessageSquare,
  Shield,
  Settings,
  Sparkles,
  UserPlus,
  Building,
  Bot,
  Lock,
  X
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

// Iconos para cada sección del menú
const menuIcons = {
  dashboard: LayoutDashboard,
  'hospital-floors': Building,
  patients: Users,
  staff: UserCheck,
  'user-management': UserPlus,
  rooms: Building2,
  'bed-management': Bed,
  appointments: Calendar,
  admissions: ClipboardPlus,
  'medical-orders': Stethoscope,
  nursing: PillBottle,
  rounds: Route,
  discharge: FileText,
  analytics: BarChart3,
  communication: MessageSquare,
  audit: Shield,
  'access-logs': Shield,
  'privacy-settings': Lock,
  'ai-assistant': Bot,
  settings: Settings,
  cleaning: Sparkles,
  'patient-registration': UserPlus,
  'bed-overview': Building2,
  'my-schedule': Calendar,
  'patient-status': Users,
  'visiting-hours': Calendar
};

// Etiquetas para cada sección
const menuLabels = {
  dashboard: 'Dashboard',
  'hospital-floors': 'Plantas Hospitalarias',
  patients: 'Pacientes',
  staff: 'Personal',
  'user-management': 'Gestión de Usuarios',
  rooms: 'Habitaciones',
  'bed-management': 'Gestión de Camas',
  appointments: 'Citas',
  admissions: 'Admisiones',
  'medical-orders': 'Órdenes Médicas',
  nursing: 'Enfermería',
  rounds: 'Rondas',
  discharge: 'Altas',
  analytics: 'Analítica',
  communication: 'Comunicación',
  audit: 'Auditoría',
  'access-logs': 'Logs de Acceso',
  'privacy-settings': 'Configuración de Privacidad',
  'ai-assistant': 'Asistente IA',
  settings: 'Configuración',
  cleaning: 'Limpieza',
  'patient-registration': 'Registro Pacientes',
  'bed-overview': 'Vista de Camas',
  'my-schedule': 'Mi Horario',
  'patient-status': 'Estado Paciente',
  'visiting-hours': 'Horas de Visita'
};

export default function Sidebar({ open, setOpen, activeSection, setActiveSection }: SidebarProps) {
  const { user, logout } = useAuth();

  if (!user) return null;

  // Obtener elementos del menú según el rol del usuario
  const userMenuItems = roleMenuItems[user.role] || [];

  const handleMenuClick = (section: string) => {
    setActiveSection(section);
    // En móvil, cerrar el sidebar al hacer click
    if (window.innerWidth < 1024) {
      setOpen(false);
    }
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 h-full w-64 transform bg-white shadow-lg transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">HospitalIMS</h2>
              <p className="text-xs text-gray-500">Sistema de Gestión</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Perfil del usuario */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.profilePicture} />
              <AvatarFallback>
                {user.firstName[0]}{user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate capitalize">
                {user.role === 'admin' && 'Administrador'}
                {user.role === 'doctor' && 'Médico'}
                {user.role === 'nurse' && 'Enfermero/a'}
                {user.role === 'auxiliary' && 'Auxiliar'}
                {user.role === 'cleaning' && 'Limpieza'}
                {user.role === 'pharmacy' && 'Farmacia'}
                {user.role === 'radiology' && 'Radiología'}
                {user.role === 'admission' && 'Admisiones'}
                {user.role === 'social_work' && 'Trabajo Social'}
                {user.role === 'patient' && 'Paciente'}
                {user.role === 'family' && 'Familiar'}
              </p>
              {user.department && (
                <p className="text-xs text-gray-400 truncate">{user.department}</p>
              )}
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-2">
            {userMenuItems.map((item) => {
              const Icon = menuIcons[item as keyof typeof menuIcons] || LayoutDashboard;
              const label = menuLabels[item as keyof typeof menuLabels] || item;
              const isActive = activeSection === item;

              return (
                <Button
                  key={item}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2 h-10 text-left",
                    isActive
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                  onClick={() => handleMenuClick(item)}
                >
                  <Icon className="h-4 w-4" />
                  <span className="truncate">{label}</span>
                </Button>
              );
            })}
          </div>

          {/* Sección especial para roles específicos */}
          {user.role === 'cleaning' && (
            <>
              <Separator className="mx-2 my-4" />
              <div className="px-2">
                <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Panel de Limpieza
                </p>
                <Button
                  variant={activeSection === 'cleaning' ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2 h-10 text-left",
                    activeSection === 'cleaning'
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                  onClick={() => handleMenuClick('cleaning')}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Tareas de Limpieza</span>
                </Button>
              </div>
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="space-y-2">
            {user.role === 'admin' && (
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => handleMenuClick('settings')}
              >
                <Settings className="h-4 w-4" />
                Configuración
              </Button>
            )}
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={logout}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Cerrar Sesión
            </Button>
          </div>

          {/* Estado de conexión */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>En línea</span>
              </div>
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
