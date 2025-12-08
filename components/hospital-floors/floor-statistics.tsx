'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { 
  Bed, Users, Activity, Clock, CheckCircle, 
  AlertTriangle, TrendingUp, TrendingDown, Minus
} from 'lucide-react';
import { useHospital } from '@/lib/hospital-context';

interface FloorStatisticsProps {
  selectedFloor: string;
  selectedUnit: string;
}

const COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#6b7280', '#3b82f6'];

export default function FloorStatistics({ selectedFloor, selectedUnit }: FloorStatisticsProps) {
  const { hospitalFloors, beds, patients, rooms } = useHospital();

  const floor = hospitalFloors.find(f => f.id === selectedFloor);
  if (!floor) return <div className="text-gray-900">Planta no encontrada</div>;

  const units = selectedUnit === 'all' ? floor.units : floor.units.filter(u => u.id === selectedUnit);

  // Obtener todas las habitaciones de esta planta
  const floorRooms = rooms.filter(r => r.floor === floor.number);
  const floorRoomIds = floorRooms.map(r => r.id);
  
  // Obtener todas las camas de esta planta
  const floorBeds = beds.filter(bed => {
    const room = rooms.find(r => r.id === bed.roomId);
    return room && room.floor === floor.number;
  });

  // Estadísticas de camas por estado - basado en todas las camas del piso
  const bedStats = floorBeds.reduce((acc, bed) => {
    acc[bed.status] = (acc[bed.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Estadísticas de limpieza
  const cleaningStats = floorBeds.reduce((acc, bed) => {
    acc[bed.cleaningStatus] = (acc[bed.cleaningStatus] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Estadísticas por unidad - basado en datos reales
  const unitStats = units.map(unit => {
    // Buscar camas que pertenezcan a habitaciones asignadas a esta unidad o al piso
    const unitRoomIds = unit.rooms.length > 0 ? unit.rooms : floorRoomIds;
    const unitBeds = beds.filter(bed => {
      const room = rooms.find(r => r.id === bed.roomId);
      return room && unitRoomIds.includes(room.id);
    });

    const occupiedBeds = unitBeds.filter(bed => bed.status === 'Occupied').length;
    const availableBeds = unitBeds.filter(bed => bed.status === 'Available').length;
    const cleaningRequiredBeds = unitBeds.filter(bed => bed.status === 'Cleaning Required').length;
    const totalUnitBeds = unitBeds.length;
    
    // Usar el número real de camas o la capacidad declarada
    const effectiveCapacity = totalUnitBeds > 0 ? totalUnitBeds : unit.capacity;

    return {
      name: unit.name.split(' ')[0], // Nombre corto
      fullName: unit.name,
      capacity: effectiveCapacity,
      occupied: occupiedBeds,
      available: availableBeds,
      cleaning: cleaningRequiredBeds,
      totalBeds: totalUnitBeds,
      occupancy: effectiveCapacity > 0 ? Math.round((occupiedBeds / effectiveCapacity) * 100) : 0
    };
  });

  // Datos para gráfico de barras
  const bedStatusData = [
    { status: 'Disponible', count: bedStats['Available'] || 0, color: '#22c55e' },
    { status: 'Ocupada', count: bedStats['Occupied'] || 0, color: '#ef4444' },
    { status: 'Limpieza', count: bedStats['Cleaning Required'] || 0, color: '#f59e0b' },
    { status: 'Reservada', count: bedStats['Reserved'] || 0, color: '#3b82f6' },
    { status: 'Mantenimiento', count: bedStats['Maintenance'] || 0, color: '#6b7280' }
  ];

  // Datos para gráfico circular de limpieza
  const cleaningData = [
    { name: 'Limpia', value: cleaningStats['Clean'] || 0, color: '#22c55e' },
    { name: 'Sucia', value: cleaningStats['Dirty'] || 0, color: '#ef4444' },
    { name: 'En Proceso', value: cleaningStats['In Progress'] || 0, color: '#f59e0b' }
  ];

  const totalBeds = floorBeds.length;
  const occupancyRate = totalBeds > 0 ? Math.round(((bedStats['Occupied'] || 0) / totalBeds) * 100) : 0;
  const availabilityRate = totalBeds > 0 ? Math.round(((bedStats['Available'] || 0) / totalBeds) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Camas</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBeds}</div>
            <p className="text-xs text-muted-foreground">
              En {units.length} unidad{units.length !== 1 ? 'es' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Ocupación</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{occupancyRate}%</div>
            <Progress value={occupancyRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Camas Disponibles</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{bedStats['Available'] || 0}</div>
            <p className="text-xs text-muted-foreground">
              {availabilityRate}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requieren Limpieza</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {bedStats['Cleaning Required'] || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Pendientes de limpieza
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bed Status Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de Camas por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bedStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="status" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="count" 
                  fill={(entry: any) => entry.color}
                  radius={[4, 4, 0, 0]}
                >
                  {bedStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cleaning Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de Limpieza</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={cleaningData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {cleaningData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Unit Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas por Unidad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {unitStats.map(unit => (
              <div key={unit.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{unit.fullName}</h4>
                    <p className="text-sm text-gray-600">
                      {unit.totalBeds > 0 ? `${unit.totalBeds} camas asignadas` : `Capacidad: ${unit.capacity} camas`}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={unit.occupancy > 90 ? 'destructive' : 
                                  unit.occupancy > 75 ? 'secondary' : 'default'}>
                      {unit.occupancy}% ocupación
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div className="text-center p-2 bg-red-50 rounded">
                    <div className="font-bold text-red-600">{unit.occupied}</div>
                    <div className="text-xs text-muted-foreground">Ocupadas</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="font-bold text-green-600">{unit.available}</div>
                    <div className="text-xs text-muted-foreground">Disponibles</div>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 rounded">
                    <div className="font-bold text-yellow-600">{unit.cleaning}</div>
                    <div className="text-xs text-muted-foreground">Limpieza</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-bold text-gray-600">
                      {unit.capacity - unit.occupied - unit.available - unit.cleaning}
                    </div>
                    <div className="text-xs text-muted-foreground">Otras</div>
                  </div>
                </div>
                
                <Progress value={unit.occupancy} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
