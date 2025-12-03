'use client';

import { useAuth } from '@/lib/auth-context';
import { useHospital } from '@/lib/hospital-context';

// Componentes principales
import StatsCards from './stats-cards';
import PatientList from '../patients/patient-list';
import PatientForm from '../patients/patient-form';
import PatientDetails from '../patients/patient-details';
import StaffList from '../staff/staff-list';
import StaffForm from '../staff/staff-form';
import RoomList from '../rooms/room-list';
import AuditLogList from '../audit/audit-log-list';

// Componentes de gestión de camas
import BedManagementDashboard from '../bed-management/bed-management-dashboard';

// Componentes de enfermería
import NursingDashboard from '../nursing/nursing-dashboard';

// Componentes de citas
import AppointmentsDashboard from '../appointments/appointments-dashboard';

// Componentes de órdenes médicas
import MedicalOrdersDashboard from '../medical-orders/medical-orders-dashboard';

// Componentes de admisiones
import AdmissionsDashboard from '../admissions/admissions-dashboard';

// Componentes de alta hospitalaria
import DischargeDashboard from '../discharge/discharge-dashboard';

// Componentes de rondas médicas
import RoundsDashboard from '../rounds/rounds-dashboard';

// Componentes de analítica
import AnalyticsDashboard from '../analytics/analytics-dashboard';

// Componentes de comunicación
import CommunicationDashboard from '../communication/communication-dashboard';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Bed, 
  Activity, 
  Calendar,
  AlertTriangle,
  TrendingUp,
  Clock,
  UserCheck,
  Building2,
  Stethoscope
} from 'lucide-react';

interface DashboardContentProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function DashboardContent({ activeSection, setActiveSection }: DashboardContentProps) {
  const { user } = useAuth();
  const { 
    patients, 
    rooms, 
    appointments, 
    admissions,
    medicalOrders,
    systemNotifications
  } = useHospital();

  if (!user) return null;

  // Función para renderizar el dashboard específico por rol
  const renderRoleDashboard = () => {
    const totalPatients = patients.length;
    const occupiedRooms = rooms.filter(room => room.isOccupied).length;
    const totalRooms = rooms.length;
    const todayAppointments = appointments.filter(apt => {
      const today = new Date();
      return apt.date.toDateString() === today.toDateString();
    }).length;
    const activeAdmissions = admissions.filter(adm => adm.status === 'Active').length;
    const pendingOrders = medicalOrders.filter(order => order.status === 'Pending').length;
    const criticalNotifications = systemNotifications.filter(notif => 
      notif.priority === 'Critical' && !notif.isRead
    ).length;

    switch (user.role) {
      case 'admin':
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pacientes Activos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalPatients}</div>
                  <p className="text-xs text-muted-foreground">
                    +2 desde ayer
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ocupación</CardTitle>
                  <Bed className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{occupiedRooms}/{totalRooms}</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((occupiedRooms / totalRooms) * 100)}% ocupación
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{todayAppointments}</div>
                  <p className="text-xs text-muted-foreground">
                    Programadas para hoy
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Notificaciones</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{criticalNotifications}</div>
                  <p className="text-xs text-muted-foreground">
                    Críticas pendientes
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Acceso Rápido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveSection('bed-management')}
                  >
                    <Bed className="mr-2 h-4 w-4" />
                    Gestión de Camas
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveSection('analytics')}
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Analítica del Hospital
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveSection('staff')}
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Gestión de Personal
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estado del Sistema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Admisiones Activas</span>
                    <Badge variant="secondary">{activeAdmissions}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Órdenes Pendientes</span>
                    <Badge variant="outline">{pendingOrders}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sistema</span>
                    <Badge className="bg-green-100 text-green-800">Operativo</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'doctor':
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mis Pacientes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalPatients}</div>
                  <p className="text-xs text-muted-foreground">
                    Bajo mi cuidado
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{todayAppointments}</div>
                  <p className="text-xs text-muted-foreground">
                    Programadas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Órdenes Pendientes</CardTitle>
                  <Stethoscope className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    Por revisar
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveSection('patients')}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Ver Pacientes
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveSection('medical-orders')}
                  >
                    <Stethoscope className="mr-2 h-4 w-4" />
                    Órdenes Médicas
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveSection('rounds')}
                  >
                    <Activity className="mr-2 h-4 w-4" />
                    Rondas Médicas
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Agenda del Día</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>09:00 - Ronda matutina</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{todayAppointments} citas programadas</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Stethoscope className="h-4 w-4 text-muted-foreground" />
                      <span>Revisar órdenes pendientes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'nurse':
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pacientes Asignados</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.floor(totalPatients / 2)}</div>
                  <p className="text-xs text-muted-foreground">
                    En mi turno
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Medicaciones</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    Próximas 2 horas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Signos Vitales</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">
                    Pendientes
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Tareas del Turno</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveSection('nursing')}
                  >
                    <Activity className="mr-2 h-4 w-4" />
                    Documentación de Enfermería
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveSection('patients')}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Ver Pacientes
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveSection('bed-management')}
                  >
                    <Bed className="mr-2 h-4 w-4" />
                    Estado de Camas
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alertas de Turno</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Pacientes críticos</span>
                      <Badge variant="destructive">2</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Medicación vencida en 1h</span>
                      <Badge variant="outline">3</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Controles pendientes</span>
                      <Badge variant="secondary">5</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <StatsCards />
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Acceso Rápido</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Selecciona una opción del menú lateral para comenzar.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  // Renderizar contenido según la sección activa
  switch (activeSection) {
    case 'dashboard':
      return (
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Bienvenido/a, {user.firstName}
            </h1>
            <p className="text-muted-foreground">
              Aquí tienes un resumen de la actividad hospitalaria
            </p>
          </div>
          {renderRoleDashboard()}
        </div>
      );
    
    case 'patients':
      return <PatientList />;
    
    case 'staff':
      return <StaffList />;
    
    case 'rooms':
      return <RoomList />;

    case 'bed-management':
      return <BedManagementDashboard />;

    case 'nursing':
      return <NursingDashboard />;

    case 'appointments':
      return <AppointmentsDashboard />;

    case 'medical-orders':
      return <MedicalOrdersDashboard />;

    case 'admissions':
      return <AdmissionsDashboard />;

    case 'rounds':
      return <RoundsDashboard />;

    case 'discharge':
      return <DischargeDashboard />;

    case 'analytics':
      return <AnalyticsDashboard />;

    case 'communication':
      return <CommunicationDashboard />;

    case 'audit':
      return <AuditLogList />;

    case 'settings':
      return (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Configuración del Sistema</h2>
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                Panel de configuración en desarrollo...
              </p>
            </CardContent>
          </Card>
        </div>
      );

    case 'cleaning':
      return <BedManagementDashboard />;

    default:
      return (
        <div className="p-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                Sección no encontrada. Por favor, selecciona una opción válida del menú.
              </p>
            </CardContent>
          </Card>
        </div>
      );
  }
}
