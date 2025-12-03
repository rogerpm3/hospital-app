'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, Lock, CheckCircle } from 'lucide-react';

interface PasswordRecoveryProps {
  onBack: () => void;
}

export default function PasswordRecovery({ onBack }: PasswordRecoveryProps) {
  const [step, setStep] = useState<'email' | 'code' | 'newPassword' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulación de envío de código
    setTimeout(() => {
      setLoading(false);
      setStep('code');
      toast({
        title: "Código enviado",
        description: "Se ha enviado un código de recuperación a tu email",
      });
    }, 2000);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulación de verificación
    setTimeout(() => {
      setLoading(false);
      if (code === '123456') {
        setStep('newPassword');
      } else {
        toast({
          title: "Código incorrecto",
          description: "El código ingresado no es válido",
          variant: "destructive",
        });
      }
    }, 1000);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Simulación de cambio de contraseña
    setTimeout(() => {
      setLoading(false);
      setStep('success');
      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido actualizada exitosamente",
      });
    }, 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle className="text-2xl">Recuperar Contraseña</CardTitle>
            <CardDescription>
              {step === 'email' && 'Ingresa tu email para recuperar tu cuenta'}
              {step === 'code' && 'Ingresa el código que enviamos a tu email'}
              {step === 'newPassword' && 'Crea una nueva contraseña segura'}
              {step === 'success' && 'Tu contraseña ha sido actualizada'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {step === 'email' && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-white" />
                  Enviando...
                </div>
              ) : (
                'Enviar Código de Recuperación'
              )}
            </Button>
          </form>
        )}

        {step === 'code' && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código de Verificación</Label>
              <Input
                id="code"
                type="text"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                className="text-center text-2xl tracking-widest"
                required
              />
              <p className="text-sm text-muted-foreground text-center">
                Se envió un código de 6 dígitos a <strong>{email}</strong>
              </p>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-white" />
                    Verificando...
                  </div>
                ) : (
                  'Verificar Código'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('email')}
              >
                Reenviar
              </Button>
            </div>
          </form>
        )}

        {step === 'newPassword' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Requisitos de la contraseña:</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li className={`flex items-center gap-1 ${newPassword.length >= 6 ? 'text-green-800' : ''}`}>
                  <CheckCircle className={`h-3 w-3 ${newPassword.length >= 6 ? 'text-green-600' : 'text-gray-400'}`} />
                  Al menos 6 caracteres
                </li>
                <li className={`flex items-center gap-1 ${/[A-Z]/.test(newPassword) ? 'text-green-800' : ''}`}>
                  <CheckCircle className={`h-3 w-3 ${/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-gray-400'}`} />
                  Una letra mayúscula
                </li>
                <li className={`flex items-center gap-1 ${/[0-9]/.test(newPassword) ? 'text-green-800' : ''}`}>
                  <CheckCircle className={`h-3 w-3 ${/[0-9]/.test(newPassword) ? 'text-green-600' : 'text-gray-400'}`} />
                  Un número
                </li>
              </ul>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-white" />
                  Actualizando...
                </div>
              ) : (
                'Actualizar Contraseña'
              )}
            </Button>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-green-900">
                ¡Contraseña Actualizada!
              </h3>
              <p className="text-sm text-green-700 mt-2">
                Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
              </p>
            </div>

            <Button onClick={onBack} className="w-full">
              Volver al Inicio de Sesión
            </Button>
          </div>
        )}

        {/* Información de ayuda */}
        {step !== 'success' && (
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              ¿Necesitas ayuda? Contacta al administrador del sistema
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
