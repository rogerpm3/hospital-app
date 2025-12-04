'use client';

import { useState } from 'react';
import { useHospital } from '@/lib/hospital-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, MessageSquare, Bell, Users, AlertTriangle } from 'lucide-react';
import MessagingPanel from './messaging-panel';

export default function CommunicationDashboard() {
  const { chatMessages, systemNotifications } = useHospital();
  const [activeTab, setActiveTab] = useState('messages');

  const unreadMessages = chatMessages.filter(msg => !msg.isRead).length;
  const unreadNotifications = systemNotifications.filter(notif => !notif.isRead).length;
  const criticalNotifications = systemNotifications.filter(notif => 
    notif.priority === 'Critical' && !notif.isRead
  ).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Centro de Comunicaciones</h1>
          <p className="text-muted-foreground">Mensajes, notificaciones y comunicación interna</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Mensaje
        </Button>
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Mensajes
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="channels" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Canales
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
                {systemNotifications.slice(0, 10).map(notification => (
                  <div key={notification.id} className={`p-3 border rounded-lg ${
                    notification.priority === 'Critical' ? 'border-red-200 bg-red-50' : ''
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{notification.title}</div>
                      <Badge variant={
                        notification.priority === 'Critical' ? 'destructive' :
                        notification.priority === 'High' ? 'outline' : 'secondary'
                      }>
                        {notification.priority}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {notification.message}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {notification.timestamp.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Canales de Equipo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium">General</div>
                    <div className="text-sm text-muted-foreground">Comunicación general del hospital</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium">Enfermería</div>
                    <div className="text-sm text-muted-foreground">Canal del equipo de enfermería</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium">Médicos</div>
                    <div className="text-sm text-muted-foreground">Comunicación médica</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usuarios Activos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Dr. Ana García - Cardiología</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Luis Martínez - Enfermería</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <span>Dr. María Rodríguez - Medicina Interna</span>
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
