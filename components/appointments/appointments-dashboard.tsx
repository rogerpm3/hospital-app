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
  const { appointments, patients, appointmentSummaries } = useHospital();
  const [activeTab, setActiveTab] = useState('daily-summary');
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="daily-summary" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Resumen Diario
          </TabsTrigger>
          <TabsTrigger value="weekly-list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Lista Semanal
          </TabsTrigger>
          <TabsTrigger value="monthly-calendar" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Calendario Mensual
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Estadísticas
          </TabsTrigger>
        </TabsList>

        {/* Resumen Diario */}
        <TabsContent value="daily-summary" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              Citas del {selectedDate.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
            <input 
              type="date" 
              className="px-3 py-2 border rounded-md"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
            />
          </div>

          {/* Resumen de citas del día seleccionado */}
          {(() => {
            const dayAppointments = userAppointments.filter(apt => 
              apt.date.toDateString() === selectedDate.toDateString()
            );
            const confirmedCount = dayAppointments.filter(apt => apt.status === 'Confirmed').length;
            const completedCount = dayAppointments.filter(apt => apt.status === 'Completed').length;
            const cancelledCount = dayAppointments.filter(apt => apt.status === 'Cancelled').length;
            const pendingCount = dayAppointments.filter(apt => apt.status === 'Scheduled').length;
            
            return (
              <div className="space-y-4">
                {/* Stats del día */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{dayAppointments.length}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Confirmadas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{confirmedCount}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Completadas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{completedCount}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Pendientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Timeline de citas */}
                <Card>
                  <CardHeader>
                    <CardTitle>Horario del Día</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {dayAppointments.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No hay citas programadas para este día
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {dayAppointments
                          .sort((a, b) => a.startTime.localeCompare(b.startTime))
                          .map(appointment => (
                          <div key={appointment.id} className="flex items-center p-4 border rounded-lg">
                            <div className="w-20 text-center">
                              <div className="text-sm font-medium">{appointment.startTime}</div>
                              <div className="text-xs text-muted-foreground">{appointment.endTime}</div>
                            </div>
                            <div className="flex-1 ml-4">
                              <div className="font-medium">{appointment.patientName}</div>
                              <div className="text-sm text-muted-foreground">{appointment.serviceName}</div>
                              <div className="text-sm text-muted-foreground">{appointment.physicianName}</div>
                            </div>
                            <div className="text-right">
                              <Badge variant={
                                appointment.status === 'Completed' ? 'default' :
                                appointment.status === 'Confirmed' ? 'secondary' :
                                appointment.status === 'Cancelled' ? 'destructive' : 'outline'
                              }>
                                {appointment.status}
                              </Badge>
                              <div className="text-xs text-muted-foreground mt-1">
                                {appointment.location}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })()}
        </TabsContent>

        {/* Lista Semanal */}
        <TabsContent value="weekly-list" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Citas de la Semana</h2>
            <div className="flex items-center space-x-2">
              <select 
                className="px-3 py-2 border rounded-md"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                <option value="all">Todas las especialidades</option>
                <option value="Cardiología">Cardiología</option>
                <option value="Medicina Interna">Medicina Interna</option>
                <option value="Radiología">Radiología</option>
                <option value="Urgencias">Urgencias</option>
              </select>
            </div>
          </div>

          {/* Citas agrupadas por día de la semana */}
          {(() => {
            const startOfWeek = new Date(selectedDate);
            startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
            
            const weekDays = Array.from({ length: 7 }, (_, i) => {
              const date = new Date(startOfWeek);
              date.setDate(startOfWeek.getDate() + i);
              return date;
            });

            return (
              <div className="space-y-4">
                {weekDays.map(day => {
                  const dayAppointments = userAppointments.filter(apt => {
                    const matchesDate = apt.date.toDateString() === day.toDateString();
                    const matchesSpecialty = selectedSpecialty === 'all' || apt.serviceName.includes(selectedSpecialty);
                    return matchesDate && matchesSpecialty;
                  });

                  return (
                    <Card key={day.toDateString()}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between">
                          <span>
                            {day.toLocaleDateString('es-ES', { 
                              weekday: 'long', 
                              day: 'numeric',
                              month: 'short'
                            })}
                          </span>
                          <Badge variant="outline">{dayAppointments.length} citas</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {dayAppointments.length === 0 ? (
                          <p className="text-muted-foreground text-sm">No hay citas programadas</p>
                        ) : (
                          <div className="space-y-2">
                            {dayAppointments
                              .sort((a, b) => a.startTime.localeCompare(b.startTime))
                              .map(appointment => (
                              <div key={appointment.id} className="flex items-center justify-between p-2 hover:bg-muted rounded">
                                <div className="flex items-center space-x-3">
                                  <span className="text-sm font-medium w-16">{appointment.startTime}</span>
                                  <div>
                                    <div className="font-medium text-sm">{appointment.patientName}</div>
                                    <div className="text-xs text-muted-foreground">{appointment.serviceName}</div>
                                  </div>
                                </div>
                                <Badge 
                                  variant={
                                    appointment.status === 'Completed' ? 'default' :
                                    appointment.status === 'Confirmed' ? 'secondary' : 'outline'
                                  }
                                  className="text-xs"
                                >
                                  {appointment.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            );
          })()}
        </TabsContent>

        {/* Calendario Mensual */}
        <TabsContent value="monthly-calendar" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              Calendario - {selectedDate.toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long' 
              })}
            </h2>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(selectedDate.getMonth() - 1);
                  setSelectedDate(newDate);
                }}
              >
                ← Anterior
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(selectedDate.getMonth() + 1);
                  setSelectedDate(newDate);
                }}
              >
                Siguiente →
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <Card>
            <CardContent className="p-6">
              <AppointmentCalendar 
                appointments={userAppointments} 
                selectedMonth={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </CardContent>
          </Card>

          {/* Legend for calendar colors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Código de Colores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Cardiología</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Medicina Interna</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Radiología</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Urgencias</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

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
