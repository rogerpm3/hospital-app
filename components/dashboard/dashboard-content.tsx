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
import CleaningDashboard from '../cleaning/cleaning-dashboard';

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

// Componente de plantas hospitalarias
import HospitalFloorsDashboard from '../hospital-floors/hospital-floors-dashboard';

// Componente de asistente IA
import AIAssistantDashboard from '../ai-assistant/ai-assistant-dashboard';

// Componente de logs de acceso
import AccessLogsPanel from '../security/access-logs-panel';

// Componente de configuración de privacidad
import PrivacySettingsDashboard from '../privacy/privacy-settings-dashboard';

// Componente de gestión de usuarios
import UserManagementDashboard from '../user-management/user-management-dashboard';

// Componente de encuesta de satisfacción del paciente
import SatisfactionSurvey from '../patient/satisfaction-survey';

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
  Stethoscope,
  Bot,
  MessageSquare,
  Heart,
  Phone,
  FileText
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
                    className="w-full justify-start bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    onClick={() => setActiveSection('ai-assistant')}
                  >
                    <Bot className="mr-2 h-4 w-4" />
                    Asistente IA
                  </Button>
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
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveSection('communication')}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Comunicación
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

      // Dashboard específico para pacientes - sin datos globales del hospital
      case 'patient':
        return (
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Heart className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-blue-900">
                      ¡Bienvenido/a a tu portal de paciente!
                    </h2>
                    <p className="text-blue-700">
                      Aquí puedes ver tus citas y gestionar tu información médica.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mis Próximas Citas</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {appointments.filter(apt => {
                      const now = new Date();
                      return apt.date >= now;
                    }).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Citas programadas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tu Médico Asignado</CardTitle>
                  <Stethoscope className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold">Dr. García López</div>
                  <p className="text-xs text-muted-foreground">
                    Medicina General
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
                    onClick={() => setActiveSection('appointments')}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Ver mis citas
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveSection('satisfaction-survey')}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Encuesta de satisfacción
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Nombre:</strong> {user.firstName} {user.lastName}</p>
                    <p><strong>DNI:</strong> {user.dni}</p>
                    {user.phone && <p><strong>Teléfono:</strong> {user.phone}</p>}
                    {user.email && <p><strong>Email:</strong> {user.email}</p>}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">
                      ¿Cómo fue tu experiencia?
                    </p>
                    <p className="text-sm text-green-700">
                      Tu opinión es importante para nosotros. 
                      <Button 
                        variant="link" 
                        className="text-green-700 font-semibold p-0 h-auto ml-1"
                        onClick={() => setActiveSection('satisfaction-survey')}
                      >
                        Completa nuestra encuesta de satisfacción
                      </Button>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // Dashboard específico para familiares - sin datos globales del hospital
      case 'family':
        return (
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-purple-900">
                      Portal para Familiares
                    </h2>
                    <p className="text-purple-700">
                      Mantente informado sobre el estado de tu ser querido.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Estado del Paciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-medium text-green-800">Estable</span>
                  </div>
                  <p className="text-sm text-green-700">
                    El paciente se encuentra en buen estado. 
                    Última actualización hace 2 horas.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Horarios de Visita</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Mañana</span>
                    <span className="text-muted-foreground">10:00 - 13:00</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Tarde</span>
                    <span className="text-muted-foreground">16:00 - 20:00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
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
      return <CleaningDashboard />;

    case 'hospital-floors':
      return <HospitalFloorsDashboard />;

    case 'ai-assistant':
      return <AIAssistantDashboard />;

    case 'access-logs':
      return <AccessLogsPanel />;

    case 'privacy-settings':
      return <PrivacySettingsDashboard />;

    case 'user-management':
      return <UserManagementDashboard />;

    // Encuesta de satisfacción del paciente
    case 'satisfaction-survey':
      return <SatisfactionSurvey />;

    // Vistas para familiares
    case 'patient-status':
      return (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Estado Clínico del Paciente</h1>
              <p className="text-muted-foreground">Información actualizada de tu familiar hospitalizado</p>
            </div>
          </div>

          {/* Estado general destacado */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Heart className="h-8 w-8 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-green-800">Estado: Estable</h2>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-green-700">Última actualización: Hoy a las 14:30</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información principal */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Datos de Hospitalización
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Ubicación</p>
                    <p className="font-semibold">Planta 3 - Hab. 302</p>
                    <p className="text-sm text-muted-foreground">Cama A</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Médico Responsable</p>
                    <p className="font-semibold">Dra. Ana García</p>
                    <p className="text-sm text-muted-foreground">Medicina Interna</p>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-600 font-medium">Motivo de Ingreso</p>
                  <p className="font-semibold text-blue-900">Observación post-operatoria</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Fecha de Ingreso</p>
                    <p className="font-medium">10 Dic 2024</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Alta Estimada</p>
                    <p className="font-medium text-green-600">14 Dic 2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-red-500" />
                  Últimos Signos Vitales
                </CardTitle>
                <p className="text-xs text-muted-foreground">Registrados hoy a las 08:00</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Presión Arterial</p>
                    <p className="text-lg font-bold text-blue-600">120/80</p>
                    <p className="text-xs text-green-600">Normal</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Frecuencia Cardíaca</p>
                    <p className="text-lg font-bold text-red-600">72</p>
                    <p className="text-xs text-green-600">Normal</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Temperatura</p>
                    <p className="text-lg font-bold text-orange-600">36.5°C</p>
                    <p className="text-xs text-green-600">Normal</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Saturación O₂</p>
                    <p className="text-lg font-bold text-cyan-600">98%</p>
                    <p className="text-xs text-green-600">Normal</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Evolución clínica */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-500" />
                Última Evolución Médica
              </CardTitle>
              <p className="text-xs text-muted-foreground">9 Dic 2024 - 18:45</p>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-900">
                  Paciente evoluciona favorablemente. Tolerancia oral adecuada. 
                  Herida quirúrgica con buen aspecto, sin signos de infección. 
                  Se mantiene tratamiento actual. Pendiente resultado de analítica de control.
                  <span className="block mt-2 text-xs text-purple-600">— Dra. Ana García</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Información de contacto */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">
                    ¿Tienes dudas sobre el estado de tu familiar?
                  </p>
                  <p className="text-sm text-blue-700">
                    Contacta con el control de enfermería de Planta 3: <strong>Ext. 3302</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );

    case 'visiting-hours':
      return (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Horarios de Visita</h1>
              <p className="text-muted-foreground">Información sobre horarios y normas de visita</p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Horarios Permitidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Mañana</span>
                    <span>10:00 - 13:00</span>
                  </div>
                  <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Tarde</span>
                    <span>17:00 - 20:00</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    * Horarios especiales para UCI: Consultar con personal de enfermería
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Normas de Visita</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    Máximo 2 visitantes por paciente
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    Usar gel hidroalcohólico al entrar
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    Mantener silencio en pasillos
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    No traer alimentos sin autorización
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    No está permitido pernoctar
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      );

    // Registro de pacientes para admisiones
    case 'patient-registration':
      return <AdmissionsDashboard />;

    case 'bed-overview':
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
