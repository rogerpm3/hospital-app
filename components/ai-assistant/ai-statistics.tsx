'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
  AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Activity, Users, Bed, 
  Calendar, AlertTriangle, CheckCircle, Clock, Download
} from 'lucide-react';
import { useHospital } from '@/lib/hospital-context';

const COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#6b7280', '#3b82f6'];

export default function AIStatistics() {
  const { patients, beds, appointments, hospitalFloors, rooms } = useHospital();

  // Estadísticas generales
  const totalPatients = patients.length;
  const criticalPatients = patients.filter(p => p.currentCondition === 'Critical').length;
  const availableBeds = beds.filter(bed => bed.status === 'Available').length;
  const occupiedBeds = beds.filter(bed => bed.status === 'Occupied').length;
  const occupancyRate = Math.round((occupiedBeds / beds.length) * 100);
  const todayAppointments = appointments.filter(apt => 
    apt.date.toDateString() === new Date().toDateString()
  ).length;

  // Datos para gráfico de ocupación por planta
  const floorOccupancyData = hospitalFloors.map(floor => {
    const floorBeds = beds.filter(bed => {
      const room = rooms.find(r => r.id === bed.roomId);
      return room && room.floor === floor.number;
    });
    const floorOccupied = floorBeds.filter(bed => bed.status === 'Occupied').length;
    const occupancyPercentage = floorBeds.length > 0 
      ? Math.round((floorOccupied / floorBeds.length) * 100) 
      : 0;
    
    return {
      name: `Planta ${floor.number}`,
      occupancy: occupancyPercentage,
      occupied: floorOccupied,
      total: floorBeds.length
    };
  });

  // Datos para gráfico de pacientes por condición
  const conditionData = [
    { name: 'Estable', value: patients.filter(p => p.currentCondition === 'Stable').length, color: '#22c55e' },
    { name: 'Crítico', value: patients.filter(p => p.currentCondition === 'Critical').length, color: '#ef4444' },
    { name: 'Serio', value: patients.filter(p => p.currentCondition === 'Serious').length, color: '#f59e0b' },
    { name: 'Regular', value: patients.filter(p => p.currentCondition === 'Fair').length, color: '#6b7280' },
    { name: 'Bueno', value: patients.filter(p => p.currentCondition === 'Good').length, color: '#3b82f6' }
  ];

  // Datos simulados para tendencias semanales
  const weeklyTrends = [
    { day: 'Lun', admissions: 12, discharges: 8, occupancy: 75 },
    { day: 'Mar', admissions: 15, discharges: 10, occupancy: 78 },
    { day: 'Mié', admissions: 18, discharges: 12, occupancy: 82 },
    { day: 'Jue', admissions: 14, discharges: 16, occupancy: 78 },
    { day: 'Vie', admissions: 16, discharges: 14, occupancy: 80 },
    { day: 'Sáb', admissions: 10, discharges: 12, occupancy: 76 },
    { day: 'Dom', admissions: 8, discharges: 6, occupancy: 74 }
  ];

  // Estados de camas
  const bedStatusData = [
    { status: 'Disponible', count: beds.filter(b => b.status === 'Available').length },
    { status: 'Ocupada', count: beds.filter(b => b.status === 'Occupied').length },
    { status: 'Limpieza', count: beds.filter(b => b.status === 'Cleaning Required').length },
    { status: 'Reservada', count: beds.filter(b => b.status === 'Reserved').length },
    { status: 'Mantenimiento', count: beds.filter(b => b.status === 'Maintenance').length }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Totales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-500 mr-1" />
              +5% vs semana anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocupación</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate}%</div>
            <Progress value={occupancyRate} className="mt-2" />
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
            <CardTitle className="text-sm font-medium">Pacientes Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalPatients}</div>
            <p className="text-xs text-muted-foreground">
              Requieren atención inmediata
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Floor Occupancy */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Ocupación por Planta</CardTitle>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={floorOccupancyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    `${value}%`, 
                    'Ocupación'
                  ]}
                />
                <Bar dataKey="occupancy" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Patient Conditions */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Condición</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={conditionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {conditionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Tendencias Semanales</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="admissions" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Admisiones"
                />
                <Line 
                  type="monotone" 
                  dataKey="discharges" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Altas"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bed Status */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de Camas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bedStatusData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="status" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="#6b7280" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights & Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Predicciones y Análisis IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Prediction 1 */}
            <div className="space-y-3">
              <h3 className="font-medium flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                Predicción de Ocupación
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Próximas 24h</span>
                  <Badge className="bg-green-100 text-green-800">85%</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Próximas 48h</span>
                  <Badge className="bg-yellow-100 text-yellow-800">92%</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Fin de semana</span>
                  <Badge className="bg-blue-100 text-blue-800">78%</Badge>
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <div className="space-y-3">
              <h3 className="font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-blue-500" />
                Recomendaciones
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Programar limpieza preventiva en Planta 3</li>
                <li>• Considerar traslados desde UCI</li>
                <li>• Optimizar horarios de quirófano</li>
                <li>• Reforzar personal de enfermería turno noche</li>
              </ul>
            </div>

            {/* Alerts */}
            <div className="space-y-3">
              <h3 className="font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2 text-orange-500" />
                Alertas Predictivas
              </h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <AlertTriangle className="h-3 w-3 mr-2 text-red-500" />
                  <span>Posible sobrecarga UCI en 6h</span>
                </div>
                <div className="flex items-center text-sm">
                  <AlertTriangle className="h-3 w-3 mr-2 text-yellow-500" />
                  <span>Mantenimiento preventivo debido</span>
                </div>
                <div className="flex items-center text-sm">
                  <AlertTriangle className="h-3 w-3 mr-2 text-blue-500" />
                  <span>Pico de admisiones esperado</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
