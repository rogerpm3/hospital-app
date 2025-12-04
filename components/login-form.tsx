'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, User, Lock, Stethoscope, Shield, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  onForgotPassword: () => void;
}

export default function LoginForm({ onForgotPassword }: LoginFormProps) {
  const { login } = useAuth();
  const { toast } = useToast();
  
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [professionalId, setProfessionalId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar si la cuenta está bloqueada
    if (isLocked) {
      toast({
        title: "Cuenta Bloqueada",
        description: `Cuenta bloqueada por seguridad. Espera ${lockTimeRemaining} minutos.`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Validar que todos los campos estén completos
      if (!dni || !password || !professionalId) {
        throw new Error('Todos los campos son obligatorios');
      }

      // Registrar intento de acceso
      console.log('Intento de acceso:', {
        dni,
        professionalId,
        timestamp: new Date(),
        ipAddress: 'Simulado: 192.168.1.100'
      });

      await login(dni, password, rememberMe, professionalId);
      
      // Si el login es exitoso, reiniciar contador de intentos
      setFailedAttempts(0);
      
      toast({
        title: "Acceso exitoso",
        description: "Bienvenido al sistema hospitalario",
        variant: "default",
      });

    } catch (error) {
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);

      // Registrar intento fallido
      console.log('Intento de acceso fallido:', {
        dni,
        professionalId,
        attemptNumber: newFailedAttempts,
        timestamp: new Date(),
        ipAddress: 'Simulado: 192.168.1.100',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });

      if (newFailedAttempts >= 3) {
        setIsLocked(true);
        setLockTimeRemaining(15); // 15 minutos de bloqueo
        
        // Simular countdown
        const countdown = setInterval(() => {
          setLockTimeRemaining(prev => {
            if (prev <= 1) {
              setIsLocked(false);
              setFailedAttempts(0);
              clearInterval(countdown);
              return 0;
            }
            return prev - 1;
          });
        }, 60000); // Cada minuto

        toast({
          title: "Cuenta Bloqueada por Seguridad",
          description: "Demasiados intentos fallidos. La cuenta se desbloqueará en 15 minutos.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error de autenticación",
          description: `Credenciales incorrectas. Intentos restantes: ${3 - newFailedAttempts}`,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Usuarios de demostración
  const demoUsers = [
    { dni: '12345678A', password: 'admin123', professionalId: 'ADM001', role: 'Administrador' },
    { dni: '23456789B', password: 'doctor123', professionalId: 'MED001', role: 'Médico' },
    { dni: '45678901D', password: 'nurse123', professionalId: 'ENF001', role: 'Enfermero/a' },
    { dni: '56789012E', password: 'clean123', professionalId: 'LIM001', role: 'Limpieza' }
  ];

  const handleDemoLogin = (demoUser: typeof demoUsers[0]) => {
    setDni(demoUser.dni);
    setPassword(demoUser.password);
    setProfessionalId(demoUser.professionalId);
  };

  return (
    <div className="space-y-6">
      {/* Header del login */}
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Stethoscope className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">HospitalIMS</h1>
        <p className="text-gray-600">Sistema de Gestión Hospitalaria</p>
      </div>

      {/* Formulario de login */}
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales para acceder al sistema
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Alertas de seguridad */}
          {isLocked && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 text-red-800">
                <Shield className="h-4 w-4" />
                <span className="font-medium">Cuenta Bloqueada por Seguridad</span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                Se detectaron múltiples intentos de acceso fallidos. 
                La cuenta se desbloqueará automáticamente en {lockTimeRemaining} minutos.
              </p>
            </div>
          )}
          
          {failedAttempts > 0 && !isLocked && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2 text-yellow-800">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Advertencia de Seguridad</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Intentos fallidos: {failedAttempts}/3. La cuenta se bloqueará temporalmente después del tercer intento.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo DNI */}
            <div className="space-y-2">
              <Label htmlFor="dni">DNI</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="dni"
                  type="text"
                  placeholder="12345678A"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Campo ID Profesional */}
            <div className="space-y-2">
              <Label htmlFor="professionalId">ID Profesional</Label>
              <div className="relative">
                <Stethoscope className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="professionalId"
                  type="text"
                  placeholder="ADM001, MED001, ENF001..."
                  value={professionalId}
                  onChange={(e) => setProfessionalId(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {/* Opciones adicionales */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                />
                <Label htmlFor="remember" className="text-sm">
                  Recordarme
                </Label>
              </div>
              
              <Button
                type="button"
                variant="link"
                className="px-0 text-sm"
                onClick={onForgotPassword}
              >
                ¿Olvidaste tu contraseña?
              </Button>
            </div>

            {/* Botón de login */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-white" />
                  Iniciando sesión...
                </div>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Iniciar Sesión
                </>
              )}
            </Button>
          </form>

          {/* Usuarios de demostración */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>Usuarios de demostración:</span>
            </div>
            
            <div className="grid gap-2">
              {demoUsers.map((user, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin(user)}
                  className="justify-start text-left"
                >
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <div className="font-medium">{user.role}</div>
                      <div className="text-xs text-muted-foreground">
                        DNI: {user.dni}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ID: {user.professionalId} • Pass: {user.password}
                      </div>
                    </div>
                    <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Probar
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <h4 className="font-medium text-blue-900 mb-1">
                  Sistema de Seguridad Avanzado
                </h4>
                <ul className="text-blue-800 space-y-1">
                  <li>• Autenticación con ID profesional obligatorio</li>
                  <li>• Bloqueo automático tras 3 intentos fallidos</li>
                  <li>• Registro completo de accesos</li>
                  <li>• Comunicaciones cifradas end-to-end</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground">
            <p>© 2024 HospitalIMS. Todos los derechos reservados.</p>
            <p className="mt-1">Versión 1.0.0 - Sistema de Gestión Hospitalaria</p>
          </div>
        </CardContent>
      </Card>

      {/* Información del sistema */}
      <div className="text-center space-y-2">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="space-y-1">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Shield className="h-4 w-4 text-green-600" />
            </div>
            <p className="font-medium">Seguro</p>
            <p className="text-muted-foreground text-xs">Datos protegidos</p>
          </div>
          
          <div className="space-y-1">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Stethoscope className="h-4 w-4 text-blue-600" />
            </div>
            <p className="font-medium">Médico</p>
            <p className="text-muted-foreground text-xs">Gestión integral</p>
          </div>
          
          <div className="space-y-1">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <User className="h-4 w-4 text-purple-600" />
            </div>
            <p className="font-medium">Amigable</p>
            <p className="text-muted-foreground text-xs">Fácil de usar</p>
          </div>
        </div>
      </div>
    </div>
  );
}
