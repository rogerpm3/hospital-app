'use client';

import { useHospital } from '@/lib/hospital-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Bed, 
  Clock,
  Users,
  Building2,
  Calendar,
  AlertTriangle
} from 'lucide-react';

export default function BedStatistics() {
  const { rooms, beds, patients } = useHospital();

  // Cálculos básicos
  const totalBeds = beds.length;
  const occupiedBeds = beds.filter(bed => bed.isOccupied).length;
  const availableBeds = beds.filter(bed => bed.status === 'Available').length;
  const cleaningRequiredBeds = beds.filter(bed => bed.status === 'Cleaning Required').length;
  const maintenanceBeds = beds.filter(bed => bed.status === 'Maintenance').length;
  const reservedBeds = beds.filter(bed => bed.status === 'Reserved').length;
  
  const occupancyRate = totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;

  // Estadísticas por departamento
  const departmentStats = rooms.reduce((acc, room) => {
    const roomBeds = beds.filter(bed => bed.roomId === room.id);
    const occupiedRoomBeds = roomBeds.filter(bed => bed.isOccupied).length;
    
    if (!acc[room.department]) {
      acc[room.department] = {
        department: room.department,
        totalBeds: 0,
        occupiedBeds: 0,
        availableBeds: 0,
        occupancyRate: 0
      };
    }
    
    acc[room.department].totalBeds += roomBeds.length;
    acc[room.department].occupiedBeds += occupiedRoomBeds;
    acc[room.department].availableBeds = acc[room.department].totalBeds - acc[room.department].occupiedBeds;
    acc[room.department].occupancyRate = acc[room.department].totalBeds > 0 
      ? (acc[room.department].occupiedBeds / acc[room.department].totalBeds) * 100 
      : 0;
    
    return acc;
  }, {} as Record<string, any>);

  const departmentData = Object.values(departmentStats);

  // Estadísticas por tipo de habitación
  const roomTypeStats = rooms.reduce((acc, room) => {
    const roomBeds = beds.filter(bed => bed.roomId === room.id);
    const occupiedRoomBeds = roomBeds.filter(bed => bed.isOccupied).length;
    
    if (!acc[room.type]) {
      acc[room.type] = {
        type: room.type,
        totalBeds: 0,
        occupiedBeds: 0
      };
    }
    
    acc[room.type].totalBeds += roomBeds.length;
    acc[room.type].occupiedBeds += occupiedRoomBeds;
    
    return acc;
  }, {} as Record<string, any>);

  const roomTypeData = Object.values(roomTypeStats);

  // Datos para el gráfico circular de estados
  const statusData = [
    { name: 'Ocupadas', value: occupiedBeds, color: '#ef4444' },
    { name: 'Disponibles', value: availableBeds, color: '#22c55e' },
    { name: 'Limpieza Requerida', value: cleaningRequiredBeds, color: '#f59e0b' },
    { name: 'Mantenimiento', value: maintenanceBeds, color: '#6b7280' },
    { name: 'Reservadas', value: reservedBeds, color: '#3b82f6' }
  ];

  // Datos simulados para tendencia semanal (en una implementación real vendría de la base de datos)
  const weeklyTrendData = [
    { day: 'Lun', occupancy: 78 },
    { day: 'Mar', occupancy: 82 },
    { day: 'Mié', occupancy: 75 },
    { day: 'Jue', occupancy: 88 },
    { day: 'Vie', occupancy: 85 },
    { day: 'Sáb', occupancy: 72 },
    { day: 'Dom', occupancy: 68 }
  ];

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Ocupación</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {occupancyRate.toFixed(1)}%
            </div>
            <Progress value={occupancyRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {occupiedBeds} de {totalBeds} camas ocupadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio de Estancia</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2 días</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 text-green-600" />
              -0.3 días vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rotación Diaria</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5</div>
            <p className="text-xs text-muted-foreground">
              Pacientes por cama/día
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo de Limpieza</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28 min</div>
            <p className="text-xs text-muted-foreground">
              Promedio por cama
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos principales */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Gráfico de barras por departamento */}
        <Card>
          <CardHeader>
            <CardTitle>Ocupación por Departamento</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="occupiedBeds" fill="#3b82f6" name="Ocupadas" />
                <Bar dataKey="availableBeds" fill="#22c55e" name="Disponibles" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico circular de estados */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Estados</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {statusData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span>{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tendencia semanal y estadísticas por tipo */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Tendencia semanal */}
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Ocupación Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Ocupación']} />
                <Line 
                  type="monotone" 
                  dataKey="occupancy" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Estadísticas por tipo de habitación */}
        <Card>
          <CardHeader>
            <CardTitle>Ocupación por Tipo de Habitación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roomTypeData.map((type, index) => {
                const occupancyRate = type.totalBeds > 0 
                  ? (type.occupiedBeds / type.totalBeds) * 100 
                  : 0;
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{type.type}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {occupancyRate.toFixed(0)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {type.occupiedBeds}/{type.totalBeds}
                        </div>
                      </div>
                    </div>
                    <Progress value={occupancyRate} />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas y recomendaciones */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas Operativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {occupancyRate > 85 && (
                <div className="flex items-center gap-2 text-orange-700">
                  <Badge variant="destructive">Crítico</Badge>
                  <span className="text-sm">Ocupación muy alta ({occupancyRate.toFixed(1)}%)</span>
                </div>
              )}
              {cleaningRequiredBeds > 5 && (
                <div className="flex items-center gap-2 text-orange-700">
                  <Badge variant="outline">Atención</Badge>
                  <span className="text-sm">{cleaningRequiredBeds} camas requieren limpieza</span>
                </div>
              )}
              {maintenanceBeds > 0 && (
                <div className="flex items-center gap-2 text-orange-700">
                  <Badge variant="outline">Mantenimiento</Badge>
                  <span className="text-sm">{maintenanceBeds} camas en mantenimiento</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recomendaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {occupancyRate > 80 && (
                <div className="text-blue-700">
                  • Considerar gestión proactiva de altas
                </div>
              )}
              {cleaningRequiredBeds > 3 && (
                <div className="text-blue-700">
                  • Reforzar equipo de limpieza en turno actual
                </div>
              )}
              <div className="text-blue-700">
                • Revisar eficiencia en rotación de camas
              </div>
              <div className="text-blue-700">
                • Optimizar procesos de admisión
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
