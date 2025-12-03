'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useHospital } from '@/lib/hospital-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BedMapView from './bed-map-view';
import BedListView from './bed-list-view';
import BedStatistics from './bed-statistics';
import CleaningPanel from './cleaning-panel';
import { 
  Bed, 
  Grid3x3, 
  List, 
  BarChart3, 
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react';

export default function BedManagementDashboard() {
  const { user } = useAuth();
  const { rooms, beds, patients } = useHospital();
  const [activeTab, setActiveTab] = useState('map');

  // Cálculos de estadísticas
  const totalBeds = beds.length;
  const occupiedBeds = beds.filter(bed => bed.isOccupied).length;
  const availableBeds = beds.filter(bed => bed.status === 'Available').length;
  const cleaningRequiredBeds = beds.filter(bed => bed.status === 'Cleaning Required').length;
  const maintenanceBeds = beds.filter(bed => bed.status === 'Maintenance').length;
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(room => room.isOccupied).length;
  const availableRooms = rooms.filter(room => !room.isOccupied).length;

  // Cálculos específicos para personal de limpieza
  const dirtyBeds = beds.filter(bed => bed.cleaningStatus === 'Dirty').length;
  const cleaningInProgressBeds = beds.filter(bed => bed.cleaningStatus === 'In Progress').length;
  const cleanBeds = beds.filter(bed => bed.cleaningStatus === 'Clean' || bed.cleaningStatus === 'Sanitized').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {user?.role === 'cleaning' ? 'Panel de Limpieza' : 'Gestión de Camas'}
          </h1>
          <p className="text-muted-foreground">
            {user?.role === 'cleaning' 
              ? 'Gestiona las tareas de limpieza y estado de habitaciones'
              : 'Monitorea y gestiona el estado de camas y habitaciones del hospital'
            }
          </p>
        </div>
      </div>

      {/* Cards de estadísticas generales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Camas</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBeds}</div>
            <p className="text-xs text-muted-foreground">
              En {totalRooms} habitaciones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocupación</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupiedBeds}/{totalBeds}</div>
            <p className="text-xs text-muted-foreground">
              {occupancyRate}% ocupadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableBeds}</div>
            <p className="text-xs text-muted-foreground">
              Listas para uso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user?.role === 'cleaning' ? 'Pendientes Limpieza' : 'Requieren Atención'}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {cleaningRequiredBeds + maintenanceBeds}
            </div>
            <p className="text-xs text-muted-foreground">
              Limpieza + Mantenimiento
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cards específicas para personal de limpieza */}
      {user?.role === 'cleaning' && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Camas Sucias</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{dirtyBeds}</div>
              <p className="text-xs text-muted-foreground">
                Requieren limpieza urgente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{cleaningInProgressBeds}</div>
              <p className="text-xs text-muted-foreground">
                Limpieza en curso
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Limpias</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{cleanBeds}</div>
              <p className="text-xs text-muted-foreground">
                Listas para uso
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Alertas importantes */}
      {(cleaningRequiredBeds > 5 || occupancyRate > 85) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {occupancyRate > 85 && (
                <div className="flex items-center gap-2 text-orange-700">
                  <Badge variant="outline" className="border-orange-300">Alta Ocupación</Badge>
                  <span>Ocupación al {occupancyRate}% - Considerar gestión de altas</span>
                </div>
              )}
              {cleaningRequiredBeds > 5 && (
                <div className="flex items-center gap-2 text-orange-700">
                  <Badge variant="outline" className="border-orange-300">Limpieza</Badge>
                  <span>{cleaningRequiredBeds} camas requieren limpieza urgente</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pestañas principales */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Grid3x3 className="h-4 w-4" />
            Vista Mapa
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Lista Detallada
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Estadísticas
          </TabsTrigger>
          {user?.role === 'cleaning' && (
            <TabsTrigger value="cleaning" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Panel Limpieza
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="map" className="space-y-4">
          <BedMapView />
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <BedListView />
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <BedStatistics />
        </TabsContent>

        {user?.role === 'cleaning' && (
          <TabsContent value="cleaning" className="space-y-4">
            <CleaningPanel />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
