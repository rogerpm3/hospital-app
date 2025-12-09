'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, User, Lock, Stethoscope, Shield, AlertCircle, Activity, Heart, Brain } from 'lucide-react';

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
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);
  
  // Persistir contador de intentos fallidos en sessionStorage
  const [failedAttempts, setFailedAttempts] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('medinsight-failed-attempts');
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });
  
  // Actualizar sessionStorage cuando cambian los intentos
  const updateFailedAttempts = (newCount: number) => {
    setFailedAttempts(newCount);
    if (typeof window !== 'undefined') {
      if (newCount === 0) {
        sessionStorage.removeItem('medinsight-failed-attempts');
      } else {
        sessionStorage.setItem('medinsight-failed-attempts', newCount.toString());
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      if (!dni || !password || !professionalId) {
        throw new Error('Todos los campos son obligatorios');
      }

      await login(dni, password, rememberMe, professionalId);
      updateFailedAttempts(0);
      
      toast({
        title: "Acceso exitoso",
        description: "Bienvenido a MedInsight",
        variant: "default",
      });

    } catch (error) {
      const newFailedAttempts = failedAttempts + 1;
      updateFailedAttempts(newFailedAttempts);

      if (newFailedAttempts >= 3) {
        setIsLocked(true);
        setLockTimeRemaining(15);
        
        const countdown = setInterval(() => {
          setLockTimeRemaining(prev => {
            if (prev <= 1) {
              setIsLocked(false);
              updateFailedAttempts(0);
              clearInterval(countdown);
              return 0;
            }
            return prev - 1;
          });
        }, 60000);

        toast({
          title: "Cuenta Bloqueada por Seguridad",
          description: "Demasiados intentos fallidos. La cuenta se desbloqueará en 15 minutos.",
          variant: "destructive",
        });
      } else {
        const remaining = 3 - newFailedAttempts;
        toast({
          title: "Error de autenticación",
          description: `Credenciales incorrectas. ${remaining === 1 ? 'Queda 1 intento' : `Quedan ${remaining} intentos`}`,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Usuarios de demostración organizados por categoría
  const demoUsers = {
    clinical: [
      { dni: '12345678A', password: 'admin123', professionalId: 'ADM001', role: 'Administrador', color: 'from-purple-500 to-indigo-600' },
      { dni: '23456789B', password: 'doctor123', professionalId: 'MED001', role: 'Médico', color: 'from-blue-500 to-cyan-600' },
      { dni: '45678901D', password: 'nurse123', professionalId: 'ENF001', role: 'Enfermero/a', color: 'from-emerald-500 to-teal-600' },
    ],
    support: [
      { dni: 'ADM001001', password: 'admision123', professionalId: 'ADM-001', role: 'Admisiones', color: 'from-pink-500 to-rose-600' },
      { dni: '56789012E', password: 'clean123', professionalId: 'LIM001', role: 'Limpieza', color: 'from-amber-500 to-orange-600' },
    ],
    patients: [
      { dni: 'PAC001001', password: 'paciente123', professionalId: 'PAC-001', role: 'Paciente', color: 'from-sky-500 to-blue-600' },
      { dni: 'FAM001001', password: 'familiar123', professionalId: 'FAM-001', role: 'Familiar', color: 'from-teal-500 to-emerald-600' },
    ]
  };

  const handleDemoLogin = (demoUser: typeof demoUsers.clinical[0]) => {
    setDni(demoUser.dni);
    setPassword(demoUser.password);
    setProfessionalId(demoUser.professionalId);
  };

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500 rounded-full blur-3xl"></div>
        </div>
        
        {/* Iconos flotantes */}
        <div className="absolute inset-0 overflow-hidden">
          <Activity className="absolute top-1/4 left-1/4 w-16 h-16 text-blue-400/20 animate-pulse" />
          <Heart className="absolute top-1/3 right-1/4 w-12 h-12 text-red-400/20 animate-pulse" style={{ animationDelay: '1s' }} />
          <Brain className="absolute bottom-1/3 left-1/3 w-14 h-14 text-purple-400/20 animate-pulse" style={{ animationDelay: '2s' }} />
          <Stethoscope className="absolute bottom-1/4 right-1/3 w-10 h-10 text-cyan-400/20 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
        
        {/* Contenido del branding */}
        <div className="relative z-10 flex flex-col justify-center px-16">
          {/* Logo */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30">
                <Activity className="h-9 w-9 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">MedInsight</h1>
                <p className="text-blue-300 text-sm font-medium">operado por datamedics</p>
              </div>
            </div>
          </div>
          
          {/* Tagline */}
          <h2 className="text-3xl font-light text-white mb-6 leading-relaxed">
            Gestión Hospitalaria<br />
            <span className="text-cyan-400 font-semibold">Inteligente y Segura</span>
          </h2>
          
          <p className="text-blue-200/80 text-lg mb-12 max-w-md">
            Plataforma integral para la administración eficiente de centros de salud, 
            diseñada para profesionales que exigen excelencia.
          </p>
          
          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Seguridad Avanzada</h3>
                <p className="text-blue-300/70 text-sm">Protección de datos certificada HIPAA</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Tiempo Real</h3>
                <p className="text-blue-300/70 text-sm">Monitorización continua 24/7</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                <Brain className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">IA Integrada</h3>
                <p className="text-blue-300/70 text-sm">Asistente inteligente para decisiones</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer del panel izquierdo */}
        <div className="absolute bottom-8 left-16 right-16">
          <div className="border-t border-white/10 pt-6">
            <p className="text-blue-300/50 text-sm">
              © 2024 MedInsight by Datamedics. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-md space-y-8">
          {/* Logo móvil */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-900">MedInsight</h1>
                <p className="text-gray-500 text-xs">operado por datamedics</p>
              </div>
            </div>
          </div>

          {/* Header del formulario */}
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Bienvenido de nuevo</h2>
            <p className="text-gray-600">Ingresa tus credenciales para acceder al sistema</p>
          </div>

          {/* Alertas de seguridad */}
          {isLocked && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center space-x-2 text-red-800">
                <Shield className="h-5 w-5" />
                <span className="font-semibold">Cuenta Bloqueada</span>
              </div>
              <p className="text-sm text-red-700 mt-2">
                Se detectaron múltiples intentos fallidos. Desbloqueo en {lockTimeRemaining} minutos.
              </p>
            </div>
          )}
          
          {failedAttempts > 0 && !isLocked && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-center space-x-2 text-amber-800">
                <AlertCircle className="h-5 w-5" />
                <span className="font-semibold">Advertencia</span>
              </div>
              <p className="text-sm text-amber-700 mt-1">
                Intentos fallidos: {failedAttempts}/3
              </p>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="dni" className="text-gray-700 font-medium">DNI</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="dni"
                  type="text"
                  placeholder="12345678A"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  className="pl-12 h-12 bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="professionalId" className="text-gray-700 font-medium">ID Profesional</Label>
              <div className="relative">
                <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="professionalId"
                  type="text"
                  placeholder="ADM001, MED001..."
                  value={professionalId}
                  onChange={(e) => setProfessionalId(e.target.value)}
                  className="pl-12 h-12 bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-12 bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-gray-100 rounded-lg"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                  className="rounded"
                />
                <Label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                  Recordarme
                </Label>
              </div>
              
              <Button
                type="button"
                variant="link"
                className="px-0 text-sm text-blue-600 hover:text-blue-700"
                onClick={onForgotPassword}
              >
                ¿Olvidaste tu contraseña?
              </Button>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all duration-200" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Iniciando sesión...
                </div>
              ) : (
                <>
                  <Shield className="mr-2 h-5 w-5" />
                  Iniciar Sesión
                </>
              )}
            </Button>
          </form>

          {/* Usuarios de demostración */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-gray-500 px-2">Acceso rápido demo</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
            
            <div className="space-y-3">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Personal Clínico</p>
              <div className="grid grid-cols-3 gap-2">
                {demoUsers.clinical.map((user, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDemoLogin(user)}
                    className={`p-3 rounded-xl bg-gradient-to-r ${user.color} text-white text-center transition-all duration-200 hover:scale-105 hover:shadow-lg`}
                  >
                    <div className="text-xs font-bold">{user.role}</div>
                    <div className="text-[10px] opacity-80 mt-0.5">{user.professionalId}</div>
                  </button>
                ))}
              </div>
              
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-4">Personal de Apoyo</p>
              <div className="grid grid-cols-3 gap-2">
                {demoUsers.support.map((user, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDemoLogin(user)}
                    className={`p-3 rounded-xl bg-gradient-to-r ${user.color} text-white text-center transition-all duration-200 hover:scale-105 hover:shadow-lg`}
                  >
                    <div className="text-xs font-bold">{user.role}</div>
                    <div className="text-[10px] opacity-80 mt-0.5">{user.professionalId}</div>
                  </button>
                ))}
              </div>
              
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-4">Pacientes y Familiares</p>
              <div className="grid grid-cols-2 gap-2">
                {demoUsers.patients.map((user, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDemoLogin(user)}
                    className={`p-3 rounded-xl bg-gradient-to-r ${user.color} text-white text-center transition-all duration-200 hover:scale-105 hover:shadow-lg`}
                  >
                    <div className="text-xs font-bold">{user.role}</div>
                    <div className="text-[10px] opacity-80 mt-0.5">{user.professionalId}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-400 pt-4">
            <p>Sistema protegido con cifrado end-to-end</p>
            <p className="mt-1">v2.0.0 - MedInsight Platform</p>
            <button
              type="button"
              onClick={() => {
                // Importar y llamar showCookieConsent
                import('@/components/cookie-consent').then(({ showCookieConsent }) => {
                  showCookieConsent();
                });
              }}
              className="mt-2 text-blue-500 hover:text-blue-600 hover:underline"
            >
              🍪 Gestionar cookies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
