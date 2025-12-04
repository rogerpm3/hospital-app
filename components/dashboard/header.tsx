'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Bell, Menu, Settings, LogOut, User, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

interface HeaderProps {
  onToggleSidebar: () => void;
  title: string;
}

export default function Header({ onToggleSidebar, title }: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  if (!user) return null;

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Administrador',
      doctor: 'Médico',
      nurse: 'Enfermero/a',
      auxiliary: 'Auxiliar',
      cleaning: 'Limpieza',
      pharmacy: 'Farmacia',
      radiology: 'Radiología',
      admission: 'Admisiones',
      social_work: 'Trabajo Social',
      patient: 'Paciente',
      family: 'Familiar'
    };
    return labels[role] || role;
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      {/* Lado izquierdo - Menú y título */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Lado derecho - Notificaciones y perfil */}
      <div className="flex items-center gap-3">
        {/* Notificaciones */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <div className="space-y-2 p-2">
              <div className="p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Código Azul - Habitación 102</p>
                    <p className="text-xs text-gray-500">Hace 5 minutos</p>
                  </div>
                </div>
              </div>
              
              <div className="p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">UCI al 95% de ocupación</p>
                    <p className="text-xs text-gray-500">Hace 15 minutos</p>
                  </div>
                </div>
              </div>
              
              <div className="p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nueva cita programada</p>
                    <p className="text-xs text-gray-500">Hace 30 minutos</p>
                  </div>
                </div>
              </div>
            </div>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center">
              Ver todas las notificaciones
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Tema */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Cambiar tema</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Claro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Oscuro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              Sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Perfil de usuario */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-3 hover:bg-gray-100">
              <Avatar className="h-8 w-8 border-2 border-blue-100">
                <AvatarImage src={user.profilePicture} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                  {user.firstName[0]}{user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
                  {getRoleLabel(user.role)}
                </Badge>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            
            <DropdownMenuItem className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuración
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <div className="p-2">
              <div className="text-xs text-gray-500 mb-1">Estado de conexión</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs">En línea</span>
              </div>
            </div>
            
            <div className="p-2">
              <div className="text-xs text-gray-500 mb-1">Información</div>
              <div className="text-xs space-y-1">
                <div>DNI: {user.dni}</div>
                {user.department && <div>Departamento: {user.department}</div>}
                {user.lastLogin && (
                  <div>Último acceso: {user.lastLogin.toLocaleString()}</div>
                )}
              </div>
            </div>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              className="flex items-center gap-2 text-red-600 focus:text-red-600"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
