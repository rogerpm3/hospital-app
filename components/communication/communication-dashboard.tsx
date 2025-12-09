'use client';

import { useState } from 'react';
import { useHospital } from '@/lib/hospital-context';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, MessageSquare, Bell, Users, AlertTriangle, Info } from 'lucide-react';
import MessagingPanel from './messaging-panel';

export default function CommunicationDashboard() {
  const { getFilteredChatMessages, systemNotifications } = useHospital();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('messages');

  // Verificar si es paciente o familia
  const isPatientOrFamily = user?.role === 'patient' || user?.role === 'family';

  // Obtener mensajes filtrados por el rol del usuario
  const chatMessages = getFilteredChatMessages();

  // Para pacientes/familia, no mostrar notificaciones del sistema interno
  const filteredNotifications = isPatientOrFamily 
    ? [] // Pacientes no ven notificaciones del sistema
    : systemNotifications;

  const unreadMessages = chatMessages.filter(msg => !msg.isRead && msg.senderId !== user?.id).length;
  const unreadNotifications = filteredNotifications.filter(notif => !notif.isRead).length;
  const criticalNotifications = filteredNotifications.filter(notif => 
    notif.priority === 'Critical' && !notif.isRead
  ).length;

  // Vista para pacientes/familia: simplificada
  if (isPatientOrFamily) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Mensajes</h1>
            <p className="text-gray-600">Comunicación con el equipo médico</p>
          </div>
        </div>

        {/* Información para pacientes */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">
                  Centro de Mensajes del Paciente
                </p>
                <p className="text-sm text-blue-700">
                  Aquí puedes ver los mensajes que el equipo médico te ha enviado. 
                  Para consultas, contacta con el personal de admisión o tu médico asignado.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">Mensajes Recibidos</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{chatMessages.length}</div>
            <p className="text-xs text-gray-500">{unreadMessages} sin leer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">Mensajes</CardTitle>
          </CardHeader>
          <CardContent>
            {chatMessages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No tienes mensajes</p>
                <p className="text-sm">Los mensajes del equipo médico aparecerán aquí</p>
              </div>
            ) : (
              <div className="space-y-3">
                {chatMessages.map(msg => (
                  <div key={msg.id} className={`p-4 border rounded-lg ${!msg.isRead ? 'bg-blue-50 border-blue-200' : ''}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{msg.senderName}</span>
                      <span className="text-xs text-gray-500">
                        {msg.timestamp.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{msg.content}</p>
                    {!msg.isRead && (
                      <Badge variant="secondary" className="mt-2">Nuevo</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Vista para personal del hospital
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Centro de Comunicaciones</h1>
          <p className="text-gray-600">Mensajes, notificaciones y comunicación interna</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensajes No Leídos</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{unreadMessages}</div>
            <p className="text-xs text-muted-foreground">Pendientes de leer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notificaciones</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{unreadNotifications}</div>
            <p className="text-xs text-muted-foreground">Sin revisar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Críticas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalNotifications}</div>
            <p className="text-xs text-muted-foreground">Urgentes</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Mensajes
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificaciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-4">
          <MessagingPanel />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notificaciones del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No hay notificaciones</p>
                  </div>
                ) : (
                  filteredNotifications.slice(0, 10).map(notification => (
                    <div key={notification.id} className={`p-3 border rounded-lg ${
                      notification.priority === 'Critical' ? 'border-red-200 bg-red-50' : ''
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-gray-900">{notification.title}</div>
                        <Badge variant={
                          notification.priority === 'Critical' ? 'destructive' :
                          notification.priority === 'High' ? 'outline' : 'secondary'
                        }>
                          {notification.priority}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        {notification.message}
                      </div>
                      <div className="text-xs text-gray-500">
                        {notification.timestamp.toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
