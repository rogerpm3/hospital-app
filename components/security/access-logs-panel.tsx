'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, AlertTriangle, CheckCircle, XCircle, 
  Search, Filter, Eye, Calendar, Clock, 
  User, Lock, Activity, TrendingUp
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface AccessLog {
  id: string;
  userId: string;
  userName: string;
  dni: string;
  professionalId: string;
  timestamp: Date;
  action: 'LOGIN' | 'LOGIN_FAILED' | 'LOGOUT' | 'PASSWORD_CHANGE';
  ipAddress: string;
  userAgent: string;
  success: boolean;
  failedReason?: string;
  location?: string;
}

export default function AccessLogsPanel() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');
  
  // Datos simulados de logs de acceso
  const accessLogs: AccessLog[] = [
    {
      id: '1',
      userId: '2',
      userName: 'Dr. Ana García',
      dni: '23456789B',
      professionalId: 'MED001',
      timestamp: new Date('2024-01-15T09:15:00Z'),
      action: 'LOGIN',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome/120.0',
      success: true,
      location: 'Sala de Doctores'
    },
    {
      id: '2',
      userId: 'unknown',
      userName: 'Usuario Desconocido',
      dni: '11111111X',
      professionalId: 'FAKE001',
      timestamp: new Date('2024-01-15T08:45:00Z'),
      action: 'LOGIN_FAILED',
      ipAddress: '192.168.1.150',
      userAgent: 'Firefox/121.0',
      success: false,
      failedReason: 'WRONG_PROFESSIONAL_ID'
    },
    {
      id: '3',
      userId: '4',
      userName: 'Luis Martínez',
      dni: '45678901D',
      professionalId: 'ENF001',
      timestamp: new Date('2024-01-15T07:30:00Z'),
      action: 'LOGIN',
      ipAddress: '192.168.1.101',
      userAgent: 'Chrome/120.0',
      success: true,
      location: 'UCI'
    },
    {
      id: '4',
      userId: 'unknown',
      userName: 'Intento Sospechoso',
      dni: '99999999Z',
      professionalId: 'HACK001',
      timestamp: new Date('2024-01-15T03:22:00Z'),
      action: 'LOGIN_FAILED',
      ipAddress: '203.45.67.89',
      userAgent: 'Bot/1.0',
      success: false,
      failedReason: 'USER_NOT_FOUND'
    }
  ];

  const getActionColor = (action: AccessLog['action'], success: boolean) => {
    if (action === 'LOGIN' && success) return 'bg-green-100 text-green-800';
    if (action === 'LOGIN_FAILED') return 'bg-red-100 text-red-800';
    if (action === 'LOGOUT') return 'bg-gray-100 text-gray-800';
    if (action === 'PASSWORD_CHANGE') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getActionIcon = (action: AccessLog['action'], success: boolean) => {
    if (action === 'LOGIN' && success) return <CheckCircle className="h-4 w-4" />;
    if (action === 'LOGIN_FAILED') return <XCircle className="h-4 w-4" />;
    if (action === 'LOGOUT') return <User className="h-4 w-4" />;
    if (action === 'PASSWORD_CHANGE') return <Lock className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  const getRiskLevel = (log: AccessLog) => {
    if (!log.success && log.ipAddress.startsWith('203.')) return 'high';
    if (!log.success && log.failedReason === 'WRONG_PROFESSIONAL_ID') return 'medium';
    if (!log.success) return 'low';
    return 'normal';
  };

  const filteredLogs = accessLogs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.dni.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.professionalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm);
      
    // Filtro por tiempo (simulado)
    return matchesSearch;
  });

  const successfulLogins = accessLogs.filter(log => log.action === 'LOGIN' && log.success).length;
  const failedLogins = accessLogs.filter(log => log.action === 'LOGIN_FAILED').length;
  const suspiciousAttempts = accessLogs.filter(log => getRiskLevel(log) === 'high').length;
  const uniqueUsers = new Set(accessLogs.filter(log => log.success).map(log => log.userId)).size;

  // Solo mostrar si el usuario es admin
  if (user?.role !== 'admin') {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              Acceso restringido. Solo los administradores pueden ver los logs de acceso.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Logs de Acceso y Seguridad</h1>
          <p className="text-muted-foreground">
            Monitor de accesos, intentos fallidos y alertas de seguridad
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Exportar Reporte
          </Button>
        </div>
      </div>

      {/* KPIs de Seguridad */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accesos Exitosos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{successfulLogins}</div>
            <p className="text-xs text-muted-foreground">Últimas 24 horas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intentos Fallidos</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{failedLogins}</div>
            <p className="text-xs text-muted-foreground">Requiere atención</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intentos Sospechosos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{suspiciousAttempts}</div>
            <p className="text-xs text-muted-foreground">Alto riesgo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <User className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{uniqueUsers}</div>
            <p className="text-xs text-muted-foreground">Únicos hoy</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent-activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent-activity">Actividad Reciente</TabsTrigger>
          <TabsTrigger value="security-alerts">Alertas de Seguridad</TabsTrigger>
          <TabsTrigger value="statistics">Estadísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="recent-activity" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nombre, DNI, ID profesional o IP..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <select 
                  className="px-3 py-2 border rounded-md"
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                >
                  <option value="today">Hoy</option>
                  <option value="week">Esta semana</option>
                  <option value="month">Este mes</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Registro de Actividad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredLogs.map(log => {
                  const riskLevel = getRiskLevel(log);
                  return (
                    <div 
                      key={log.id} 
                      className={`p-4 border rounded-lg ${
                        riskLevel === 'high' ? 'bg-red-50 border-red-200' :
                        riskLevel === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                        'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${getActionColor(log.action, log.success)}`}>
                            {getActionIcon(log.action, log.success)}
                          </div>
                          <div>
                            <div className="font-medium">{log.userName}</div>
                            <div className="text-sm text-muted-foreground">
                              {log.dni} • {log.professionalId}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <Badge className={getActionColor(log.action, log.success)}>
                            {log.action.replace('_', ' ')}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            {log.timestamp.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-2 pt-2 border-t">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
                          <div>
                            <span className="font-medium">IP:</span> {log.ipAddress}
                          </div>
                          <div>
                            <span className="font-medium">Navegador:</span> {log.userAgent}
                          </div>
                          {log.location && (
                            <div>
                              <span className="font-medium">Ubicación:</span> {log.location}
                            </div>
                          )}
                          {log.failedReason && (
                            <div className="text-red-600">
                              <span className="font-medium">Motivo:</span> {log.failedReason}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {riskLevel === 'high' && (
                        <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-xs text-red-800">
                          <AlertTriangle className="h-3 w-3 inline mr-1" />
                          <strong>Actividad Sospechosa Detectada:</strong> IP externa con credenciales inválidas
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security-alerts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                Alertas de Seguridad Activas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {accessLogs
                  .filter(log => getRiskLevel(log) === 'high')
                  .map(log => (
                  <div key={log.id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-red-900">
                          Intento de Acceso Sospechoso
                        </h4>
                        <p className="text-sm text-red-700">
                          IP: {log.ipAddress} • DNI: {log.dni} • ID: {log.professionalId}
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                          {log.timestamp.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Investigar
                        </Button>
                        <Button size="sm" variant="outline">
                          Bloquear IP
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Accesos por Hora</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                  <p>Gráfico de accesos disponible en la implementación completa</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tipos de Dispositivo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Chrome</span>
                    <Badge variant="outline">60%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Firefox</span>
                    <Badge variant="outline">25%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Safari</span>
                    <Badge variant="outline">10%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Otros</span>
                    <Badge variant="outline">5%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
