'use client';

import { useAuth } from '@/lib/auth-context';
import { useHospital } from '@/lib/hospital-context';
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
import { Bell, Menu, LogOut, Shield, MessageSquare, CheckCheck, ArrowLeft, Home } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  title: string;
  activeSection?: string;
  onNavigateBack?: () => void;
}

export default function Header({ onToggleSidebar, title, activeSection, onNavigateBack }: HeaderProps) {
  const { user, logout } = useAuth();
  const { getFilteredChatMessages, markMessageAsRead, markAllMessagesAsRead, systemNotifications } = useHospital();
  
  const showBackButton = activeSection && activeSection !== 'dashboard';

  if (!user) return null;

  // Obtener mensajes filtrados para el usuario actual
  const chatMessages = getFilteredChatMessages();
  const unreadMessages = chatMessages.filter(msg => !msg.isRead && msg.senderId !== user.id);
  const unreadCount = unreadMessages.length;
  
  // Obtener las 3 últimas notificaciones
  const recentUnread = unreadMessages
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 3);

  const handleMarkAsRead = (messageId: string) => {
    markMessageAsRead(messageId);
  };

  const handleMarkAllAsRead = () => {
    markAllMessagesAsRead();
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Administrador',
      doctor: 'Médico',
      nurse: 'Enfermero/a',
      auxiliary: 'Auxiliar',
      cleaning: 'Limpieza',
      radiology: 'Radiología',
      social_work: 'Trabajo Social',
      admission: 'Admisiones',
      patient: 'Paciente',
      family: 'Familiar'
    };
    return labels[role] || role;
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
      {/* Lado izquierdo - Menú, botón atrás y título */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="lg:hidden text-gray-700 hover:bg-gray-100"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {/* Botón volver atrás */}
        {showBackButton && onNavigateBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onNavigateBack}
            className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Volver</span>
          </Button>
        )}
        
        {/* Separador visual */}
        {showBackButton && onNavigateBack && (
          <div className="h-6 w-px bg-gray-200 hidden sm:block" />
        )}
        
        <div>
          <div className="flex items-center gap-2">
            {activeSection === 'dashboard' && <Home className="h-5 w-5 text-blue-600" />}
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          </div>
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
        {/* Notificaciones y Mensajes */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-gray-700 hover:bg-gray-100">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center font-medium">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96 bg-white border border-gray-200">
            <div className="flex items-center justify-between px-3 py-2">
              <DropdownMenuLabel className="text-gray-900 font-semibold p-0">Mensajes</DropdownMenuLabel>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-blue-600 hover:text-blue-700 h-auto py-1 px-2"
                  onClick={handleMarkAllAsRead}
                >
                  <CheckCheck className="w-3 h-3 mr-1" />
                  Marcar todos como leídos
                </Button>
              )}
            </div>
            <DropdownMenuSeparator className="bg-gray-200" />
            
            <div className="max-h-80 overflow-y-auto">
              {recentUnread.length === 0 ? (
                <div className="p-6 text-center">
                  <MessageSquare className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm text-gray-500">No tienes mensajes sin leer</p>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {recentUnread.map((message) => (
                    <div 
                      key={message.id} 
                      className="p-3 hover:bg-gray-50 rounded-md cursor-pointer transition-colors border-l-2 border-l-blue-500"
                      onClick={() => handleMarkAsRead(message.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                          message.priority === 'Urgent' || message.priority === 'urgent' ? 'bg-red-500' :
                          message.priority === 'High' || message.priority === 'high' ? 'bg-orange-500' :
                          'bg-blue-500'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-sm font-medium text-gray-900 truncate">{message.senderName}</p>
                            <Badge variant="outline" className="text-xs py-0">
                              {getRoleLabel(message.senderRole)}
                            </Badge>
                          </div>
                          {message.subject && (
                            <p className="text-sm text-gray-800 font-medium truncate">{message.subject}</p>
                          )}
                          <p className="text-xs text-gray-600 truncate">{message.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {message.timestamp.toLocaleString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {unreadCount > 3 && (
              <>
                <DropdownMenuSeparator className="bg-gray-200" />
                <div className="p-2 text-center">
                  <p className="text-xs text-gray-500">
                    Y {unreadCount - 3} mensaje{unreadCount - 3 > 1 ? 's' : ''} más sin leer
                  </p>
                </div>
              </>
            )}
            
            <DropdownMenuSeparator className="bg-gray-200" />
            <DropdownMenuItem className="justify-center text-blue-600 font-medium cursor-pointer">
              Ver todos los mensajes
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Perfil de usuario */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 px-3 hover:bg-gray-100 h-auto py-2">
              <Avatar className="h-9 w-9 border-2 border-blue-200">
                <AvatarImage src={user.profilePicture} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-sm">
                  {user.firstName[0]}{user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <p className="text-sm font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                <div className="flex items-center gap-1.5">
                  <Badge variant="outline" className="text-xs font-medium text-gray-600 border-gray-300 bg-gray-50 px-2 py-0">
                    {getRoleLabel(user.role)}
                  </Badge>
                  {user.professionalId && (
                    <span className="text-xs text-blue-600 flex items-center gap-0.5">
                      <Shield className="h-3 w-3" />
                      {user.professionalId}
                    </span>
                  )}
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-white border border-gray-200">
            <DropdownMenuLabel className="text-gray-900 font-semibold">Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200" />
            
            <div className="px-3 py-2">
              <div className="text-xs font-medium text-gray-500 mb-1.5">Estado de conexión</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-700">En línea</span>
              </div>
            </div>
            
            <div className="px-3 py-2 bg-gray-50 rounded mx-2 mb-2">
              <div className="text-xs font-medium text-gray-500 mb-1.5">Información</div>
              <div className="text-xs space-y-1 text-gray-700">
                <div><span className="text-gray-500">DNI:</span> {user.dni}</div>
                {user.department && <div><span className="text-gray-500">Departamento:</span> {user.department}</div>}
                {user.professionalId && <div><span className="text-gray-500">ID Profesional:</span> {user.professionalId}</div>}
                {user.lastLogin && (
                  <div><span className="text-gray-500">Último acceso:</span> {user.lastLogin.toLocaleString()}</div>
                )}
              </div>
            </div>
            
            <DropdownMenuSeparator className="bg-gray-200" />
            
            <DropdownMenuItem 
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer mx-2 mb-1 rounded"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              <span className="font-medium">Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
