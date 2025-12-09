'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie, Shield, Settings, X } from 'lucide-react';

// Evento global para mostrar el banner de cookies
const SHOW_COOKIE_BANNER_EVENT = 'show-cookie-consent';

// Función para mostrar el banner de cookies desde cualquier parte de la app
export function showCookieConsent() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SHOW_COOKIE_BANNER_EVENT));
  }
}

// Función para resetear las preferencias de cookies (útil para testing)
export function resetCookieConsent() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('medinsight-cookie-consent');
    window.dispatchEvent(new CustomEvent(SHOW_COOKIE_BANNER_EVENT));
  }
}

// Función para verificar si hay consentimiento
export function hasCookieConsent(): boolean {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('medinsight-cookie-consent') !== null;
  }
  return false;
}

export default function CookieConsent() {
  // Inicializar en null para evitar flash de contenido
  const [showBanner, setShowBanner] = useState<boolean | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Verificar si ya se aceptaron las cookies
    const consent = localStorage.getItem('medinsight-cookie-consent');
    // Si NO hay consentimiento, mostrar el banner inmediatamente
    setShowBanner(!consent);
    
    // Escuchar evento para mostrar el banner (desde el botón de preferencias)
    const handleShowBanner = () => setShowBanner(true);
    window.addEventListener(SHOW_COOKIE_BANNER_EVENT, handleShowBanner);
    
    return () => {
      window.removeEventListener(SHOW_COOKIE_BANNER_EVENT, handleShowBanner);
    };
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('medinsight-cookie-consent', JSON.stringify(allAccepted));
    setShowBanner(false);
  };

  const acceptSelected = () => {
    const selected = {
      ...preferences,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('medinsight-cookie-consent', JSON.stringify(selected));
    setShowBanner(false);
    setShowSettings(false);
  };

  const rejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('medinsight-cookie-consent', JSON.stringify(onlyNecessary));
    setShowBanner(false);
  };

  // No renderizar nada en el servidor o mientras se verifica el estado
  if (!isClient || showBanner === null || !showBanner) return null;

  return (
    <>
      {/* Overlay oscuro que bloquea toda la aplicación */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9998]" />
      
      {/* Banner de cookies centrado */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {!showSettings ? (
            // Vista principal
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Cookie className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    🍪 Configuración de Cookies
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    MedInsight utiliza cookies para mejorar tu experiencia, analizar el tráfico del sitio y 
                    personalizar el contenido. Al continuar navegando, aceptas nuestro uso de cookies conforme 
                    a nuestra <span className="text-blue-600 hover:underline cursor-pointer">Política de Privacidad</span>.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <Button 
                      onClick={acceptAll}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      Aceptar todas
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={rejectAll}
                    >
                      Solo necesarias
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowSettings(true)}
                      className="text-gray-600"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Personalizar
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Info de seguridad */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                <Shield className="h-4 w-4" />
                <span>Tus datos están protegidos conforme al RGPD y normativas sanitarias vigentes</span>
              </div>
            </div>
          ) : (
            // Vista de configuración
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Configurar preferencias</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="space-y-4 mb-6">
                {/* Cookies necesarias */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-900">Cookies necesarias</h4>
                    <p className="text-sm text-gray-600">Esenciales para el funcionamiento del sistema</p>
                  </div>
                  <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center justify-end px-1">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
                
                {/* Cookies funcionales */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-900">Cookies funcionales</h4>
                    <p className="text-sm text-gray-600">Recordar preferencias y configuraciones</p>
                  </div>
                  <button
                    onClick={() => setPreferences(p => ({ ...p, functional: !p.functional }))}
                    className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${preferences.functional ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'}`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow"></div>
                  </button>
                </div>
                
                {/* Cookies de análisis */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-900">Cookies de análisis</h4>
                    <p className="text-sm text-gray-600">Ayudarnos a mejorar el sistema</p>
                  </div>
                  <button
                    onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                    className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${preferences.analytics ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'}`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow"></div>
                  </button>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button onClick={acceptSelected} className="flex-1">
                  Guardar preferencias
                </Button>
                <Button variant="outline" onClick={() => setShowSettings(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

