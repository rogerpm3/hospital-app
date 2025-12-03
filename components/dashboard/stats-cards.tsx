'use client';

import { useHospital } from '@/lib/hospital-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Bed, Calendar, Activity, TrendingUp, AlertTriangle } from 'lucide-react';

export default function StatsCards() {
  const { patients, rooms, beds, appointments, admissions, vitalSigns } = useHospital();

  // Cálculos de estadísticas
  const totalPatients = patients.length;
  const hospitalizedPatients = patients.filter(p => p.roomId).length;
  
  const totalBeds = beds.length;
  const occupiedBeds = beds.filter(bed => bed.isOccupied).length;
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
  
  const today = new Date();
  const todayAppointments = appointments.filter(apt => 
    apt.date.toDateString() === today.toDateString()
  ).length;
  
  const activeAdmissions = admissions.filter(adm => adm.status === 'Active').length;

  // Alertas críticas basadas en signos vitales
  const criticalAlerts = vitalSigns.filter(vs => {
    return (
      vs.bloodPressure.systolic > 160 || 
      vs.bloodPressure.systolic < 90 ||
      vs.heartRate > 100 || 
      vs.heartRate < 60 ||
      vs.oxygenSaturation < 95 ||
      vs.temperature > 38.5 || 
      vs.temperature < 35
    );
  }).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pacientes Totales</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPatients}</div>
          <p className="text-xs text-muted-foreground">
            {hospitalizedPatients} hospitalizados
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ocupación de Camas</CardTitle>
          <Bed className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{occupancyRate}%</div>
          <p className="text-xs text-muted-foreground">
            {occupiedBeds} de {totalBeds} camas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Citas de Hoy</CardTitle>
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
          <CardTitle className="text-sm font-medium">Admisiones Activas</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{activeAdmissions}</div>
          <p className="text-xs text-muted-foreground">
            Pacientes ingresados
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Eficiencia</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">94%</div>
          <p className="text-xs text-muted-foreground">
            Índice general
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Alertas Críticas</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{criticalAlerts}</div>
          <p className="text-xs text-muted-foreground">
            Requieren atención
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
