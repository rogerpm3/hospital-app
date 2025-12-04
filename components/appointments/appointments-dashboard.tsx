'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useHospital } from '@/lib/hospital-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppointmentList from './appointment-list';
import AppointmentCalendar from './appointment-calendar';
import AppointmentBookingDialog from './appointment-booking-dialog';
import { 
  Calendar,
  Clock,
  Users,
  Plus,
  List,
  CalendarDays,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function AppointmentsDashboard() {
  const { user } = useAuth();
  const { appointments, patients } = useHospital();
  const [activeTab, setActiveTab] = useState('overview');
  const [showBookingDialog, setShowBookingDialog] = useState(false);

  // Filtrar citas según permisos del usuario
  const userAppointments = user?.role === 'patient' 
    ? appointments.filter(apt => apt.patientId === user.id)
    : appointments;

  // Estadísticas
  const today = new Date();
  const todayAppointments = userAppointments.filter(apt => 
    apt.date.toDateString() === today.toDateString()
  );
  
  const upcomingAppointments = userAppointments.filter(apt => 
    apt.date > today && apt.status !== 'Cancelled'
  );
  
  const completedToday = todayAppointments.filter(apt => 
    apt.status === 'Completed'
  );
  
  const pendingConfirmation = userAppointments.filter(apt => 
    apt.status === 'Scheduled' && apt.date > today
  );

  const canCreateAppointments = ['admin', 'doctor', 'admission'].includes(user?.role || '');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Citas</h1>
          <p className="text-muted-foreground">
            {user?.role === 'patient' 
              ? 'Visualiza y gestiona tus citas médicas'
              : 'Programa y gestiona citas médicas del hospital'
            }
          </p>
        </div>
        {canCreateAppointments && (
          <Button 
            onClick={() => setShowBookingDialog(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nueva Cita
          </Button>
        )}
      </div>

      {/* Cards de estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas de Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              Programadas para hoy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximas Citas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{upcomingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              Próximamente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas Hoy</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedToday.length}</div>
            <p className="text-xs text-muted-foreground">
              Finalizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes Confirmación</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingConfirmation.length}</div>
            <p className="text-xs text-muted-foreground">
              Sin confirmar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Citas de hoy - vista rápida */}
      {todayAppointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Citas de Hoy ({todayAppointments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayAppointments.slice(0, 5).map(appointment => (
                <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium">
                      {appointment.startTime} - {appointment.endTime}
                    </div>
                    <div>
                      <div className="font-medium">{appointment.patientName}</div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.serviceName} • {appointment.physicianName}
                      </div>
                    </div>
                  </div>
                  <Badge variant={
                    appointment.status === 'Completed' ? 'default' :
                    appointment.status === 'In Progress' ? 'outline' :
                    appointment.status === 'Confirmed' ? 'secondary' : 'outline'
                  }>
                    {appointment.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pestañas principales */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Lista
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Calendario
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Próximas Citas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingAppointments.slice(0, 5).map(appointment => (
                    <div key={appointment.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium">{appointment.patientName}</div>
                        <Badge variant="outline" className="text-xs">
                          {appointment.priority}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.date.toLocaleDateString()} • {appointment.startTime}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.serviceName}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estadísticas de la Semana</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total programadas</span>
                    <Badge variant="secondary">{userAppointments.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completadas</span>
                    <Badge className="bg-green-100 text-green-800">
                      {userAppointments.filter(a => a.status === 'Completed').length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Canceladas</span>
                    <Badge variant="outline">
                      {userAppointments.filter(a => a.status === 'Cancelled').length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">No show</span>
                    <Badge className="bg-red-100 text-red-800">
                      {userAppointments.filter(a => a.status === 'No Show').length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <AppointmentList />
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <AppointmentCalendar />
        </TabsContent>
      </Tabs>

      {/* Dialog de nueva cita */}
      <AppointmentBookingDialog
        open={showBookingDialog}
        onClose={() => setShowBookingDialog(false)}
      />
    </div>
  );
}
