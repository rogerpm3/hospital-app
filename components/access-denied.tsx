'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowLeft, Lock, UserX, Building2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface AccessDeniedProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  resourceType?: 'patient' | 'area' | 'data' | 'general';
}

export default function AccessDenied({ 
  title = 'Acceso Denegado',
  message,
  showBackButton = true,
  onBack,
  resourceType = 'general'
}: AccessDeniedProps) {
  const { user } = useAuth();

  const getIcon = () => {
    switch (resourceType) {
      case 'patient':
        return <UserX className="h-16 w-16 text-red-500" />;
      case 'area':
        return <Building2 className="h-16 w-16 text-red-500" />;
      case 'data':
        return <Lock className="h-16 w-16 text-red-500" />;
      default:
        return <ShieldAlert className="h-16 w-16 text-red-500" />;
    }
  };

  const getDefaultMessage = () => {
    switch (resourceType) {
      case 'patient':
        return 'No tienes asignación activa con este paciente. Solo puedes acceder a pacientes que te han sido asignados por el sistema.';
      case 'area':
        return 'Tu rol no tiene permisos para acceder a esta área del sistema.';
      case 'data':
        return 'No tienes permisos para ver estos datos sensibles.';
      default:
        return 'No tienes los permisos necesarios para acceder a este recurso.';
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <Card className="max-w-md w-full border-red-200 dark:border-red-800">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getIcon()}
          </div>
          <CardTitle className="text-2xl text-red-600 dark:text-red-400">
            {title}
          </CardTitle>
          <CardDescription className="text-base">
            {message || getDefaultMessage()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 text-sm">
            <p className="font-medium mb-2">Información de tu sesión:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Rol: <span className="font-medium capitalize">{user?.role || 'No definido'}</span></li>
              <li>• ID Profesional: <span className="font-medium">{user?.professionalId || user?.id || 'No definido'}</span></li>
              <li>• Departamento: <span className="font-medium">{user?.department || 'No asignado'}</span></li>
            </ul>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>
              Si necesitas acceso a este recurso, contacta con:
            </p>
            <ul className="mt-2 space-y-1">
              <li>• Tu supervisor directo</li>
              <li>• El departamento de administración</li>
              <li>• El equipo de TI del hospital</li>
            </ul>
          </div>

          {showBackButton && (
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={onBack || (() => window.history.back())}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Componente de wrapper para verificar acceso
interface AccessGuardProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: string[];
  fallback?: React.ReactNode;
  resourceType?: 'patient' | 'area' | 'data' | 'general';
}

export function AccessGuard({ 
  children, 
  requiredPermission,
  requiredRole,
  fallback,
  resourceType = 'general'
}: AccessGuardProps) {
  const { user, hasPermission } = useAuth();

  // Verificar autenticación
  if (!user) {
    return fallback || <AccessDenied title="No autenticado" message="Debes iniciar sesión para acceder a este recurso." resourceType={resourceType} />;
  }

  // Verificar permiso específico
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback || <AccessDenied resourceType={resourceType} />;
  }

  // Verificar rol
  if (requiredRole && !requiredRole.includes(user.role)) {
    return fallback || <AccessDenied 
      title="Rol no autorizado"
      message={`Se requiere uno de los siguientes roles: ${requiredRole.join(', ')}`}
      resourceType={resourceType}
    />;
  }

  return <>{children}</>;
}

// Badge de nivel de acceso
interface AccessLevelBadgeProps {
  level: 'completo' | 'parcial' | 'solo_lectura' | 'denegado';
  showLabel?: boolean;
}

export function AccessLevelBadge({ level, showLabel = true }: AccessLevelBadgeProps) {
  const config = {
    completo: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100', label: 'Acceso Completo' },
    parcial: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100', label: 'Acceso Parcial' },
    solo_lectura: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100', label: 'Solo Lectura' },
    denegado: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100', label: 'Sin Acceso' }
  };

  const { color, label } = config[level];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {level === 'completo' && <Lock className="h-3 w-3 mr-1" />}
      {level === 'parcial' && <ShieldAlert className="h-3 w-3 mr-1" />}
      {showLabel && label}
    </span>
  );
}

