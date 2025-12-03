'use client';

import { useHospital } from '@/lib/hospital-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Bed, Calendar, Activity } from 'lucide-react';

export default function AnalyticsDashboard() {
  const { rooms, beds, patients, appointments, admissions } = useHospital();
  
  const totalBeds = beds.length;
  const occupiedBeds = beds.filter(bed => bed.isOccupied).length;
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
  
  const activeAdmissions = admissions.filter(adm => adm.status === 'Active').length;
  const todayAppointments = appointments.filter(apt => 
    apt.date.toDateString() === new Date().toDateString()
  ).length;

  // Datos simulados para gráficos
  const departmentData = [
    { department: 'Cardiología', occupancy: 85 },
    { department: 'UCI', occupancy: 95 },
    { department: 'Medicina Interna', occupancy: 70 },
    { department: 'Cirugía', occupancy: 60 }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics y Métricas</h1>
        <p className="text-muted-foreground">Dashboard de indicadores hospitalarios</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocupación General</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">
              {occupiedBeds}/{totalBeds} camas ocupadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAdmissions}</div>
            <p className="text-xs text-muted-foreground">Hospitalizados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments}</div>
            <p className="text-xs text-muted-foreground">Programadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eficiencia</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Promedio general</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ocupación por Departamento</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="occupancy" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Métricas de Calidad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Satisfacción del paciente</span>
                <Badge className="bg-green-100 text-green-800">4.8/5</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Tiempo promedio de estancia</span>
                <Badge variant="outline">4.2 días</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Tasa de readmisión</span>
                <Badge variant="secondary">5.2%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Tiempo de espera promedio</span>
                <Badge variant="outline">18 min</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Indicadores Operativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Rotación de camas</span>
                <Badge className="bg-blue-100 text-blue-800">2.3/día</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Utilización de quirófanos</span>
                <Badge variant="outline">87%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Cancelaciones de citas</span>
                <Badge variant="secondary">8.1%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Tiempo de limpieza promedio</span>
                <Badge variant="outline">28 min</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
