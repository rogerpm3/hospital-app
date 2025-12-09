'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building, Building2, Users, Bed, Activity, Filter, 
  MapPin, Stethoscope, Heart, Baby, User, Shield
} from 'lucide-react';
import { useHospital } from '@/lib/hospital-context';
import { useAuth } from '@/lib/auth-context';
import { HospitalFloor, HospitalUnit } from '@/lib/types';
import BedMapView from './bed-map-view';
import BedListView from './bed-list-view';
import FloorStatistics from './floor-statistics';

export default function HospitalFloorsDashboard() {
  const { hospitalFloors, beds, patients } = useHospital();
  const { user } = useAuth();
  const [selectedFloor, setSelectedFloor] = useState<string>('all');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [filters, setFilters] = useState({
    bedStatus: 'all',
    bedType: 'all',
    cleaningStatus: 'all'
  });

  // Para limpieza, no mostrar botones de cambio de vista (Vista Mapa/Lista)
  const isCleaningRole = user?.role === 'cleaning';

  const getFloorIcon = (floor: HospitalFloor) => {
    switch (floor.number) {
      case 1: return <Building className="h-5 w-5" />;
      case 2: return <Activity className="h-5 w-5" />;
      case 3: return <Baby className="h-5 w-5" />;
      case 4: return <Stethoscope className="h-5 w-5" />;
      case 5: return <Heart className="h-5 w-5" />;
      default: return <Building2 className="h-5 w-5" />;
    }
  };

  const getUnitIcon = (specialization: string) => {
    switch (specialization) {
      case 'Emergency': return <Shield className="h-4 w-4 text-red-500" />;
      case 'ICU': return <Heart className="h-4 w-4 text-red-600" />;
      case 'Surgery': return <Activity className="h-4 w-4 text-blue-500" />;
      case 'Maternity': return <Baby className="h-4 w-4 text-pink-500" />;
      case 'Recovery': return <Activity className="h-4 w-4 text-green-500" />;
      default: return <Bed className="h-4 w-4 text-gray-500" />;
    }
  };

  const getOccupancyColor = (occupancy: number, capacity: number) => {
    const percentage = (occupancy / capacity) * 100;
    if (percentage >= 90) return 'text-red-600 bg-red-50';
    if (percentage >= 75) return 'text-orange-600 bg-orange-50';
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const filteredFloors = hospitalFloors.filter(floor => 
    selectedFloor === 'all' || floor.id === selectedFloor
  );

  const filteredUnits = selectedFloor === 'all' 
    ? [] 
    : hospitalFloors.find(f => f.id === selectedFloor)?.units.filter(unit =>
        selectedUnit === 'all' || unit.id === selectedUnit
      ) || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Plantas Hospitalarias</h1>
          <p className="text-muted-foreground">
            {isCleaningRole 
              ? 'Estado de limpieza de habitaciones y camas del hospital'
              : 'Visualización estructurada de todas las plantas y unidades del hospital'
            }
          </p>
        </div>
        {/* Ocultar botones Vista Mapa/Lista para rol de limpieza */}
        {!isCleaningRole && (
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('map')}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Vista Mapa
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <Building2 className="h-4 w-4 mr-2" />
              Vista Lista
            </Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros y Selección
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Planta</label>
              <Select value={selectedFloor} onValueChange={setSelectedFloor}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar planta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las plantas</SelectItem>
                  {hospitalFloors.map(floor => (
                    <SelectItem key={floor.id} value={floor.id}>
                      Planta {floor.number} - {floor.name.split('—')[1]?.trim()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Unidad</label>
              <Select 
                value={selectedUnit} 
                onValueChange={setSelectedUnit}
                disabled={selectedFloor === 'all'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar unidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las unidades</SelectItem>
                  {filteredFloors[0]?.units.map(unit => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Estado de Cama</label>
              <Select 
                value={filters.bedStatus} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, bedStatus: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="Available">Disponible</SelectItem>
                  <SelectItem value="Occupied">Ocupada</SelectItem>
                  <SelectItem value="Cleaning Required">Requiere Limpieza</SelectItem>
                  <SelectItem value="Maintenance">Mantenimiento</SelectItem>
                  <SelectItem value="Reserved">Reservada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Estado de Limpieza</label>
              <Select 
                value={filters.cleaningStatus} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, cleaningStatus: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Clean">Limpia</SelectItem>
                  <SelectItem value="Dirty">Sucia</SelectItem>
                  <SelectItem value="In Progress">En Proceso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floor Overview Cards */}
      {selectedFloor === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hospitalFloors.map(floor => (
            <Card 
              key={floor.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                floor.isRestricted ? 'border-red-200 bg-red-50/30' : ''
              }`}
              onClick={() => setSelectedFloor(floor.id)}
            >
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="flex items-center space-x-2 flex-1">
                  {getFloorIcon(floor)}
                  <div>
                    <CardTitle className="text-lg">Planta {floor.number}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {floor.name.split('—')[1]?.trim()}
                    </p>
                  </div>
                </div>
                {floor.isRestricted && (
                  <Badge variant="destructive" className="text-xs">Restringida</Badge>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Ocupación:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      getOccupancyColor(floor.currentOccupancy, floor.totalCapacity)
                    }`}>
                      {floor.currentOccupancy}/{floor.totalCapacity} 
                      ({Math.round((floor.currentOccupancy/floor.totalCapacity)*100)}%)
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Unidades:</span>
                    <span className="font-medium">{floor.units.length}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {floor.units.map(unit => (
                      <div key={unit.id} className="flex items-center space-x-1 text-xs">
                        {getUnitIcon(unit.specialization)}
                        <span className="text-muted-foreground">{unit.name.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Selected Floor Details */}
      {selectedFloor !== 'all' && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Vista General</TabsTrigger>
            <TabsTrigger value="beds">Mapa de Camas</TabsTrigger>
            <TabsTrigger value="statistics">Estadísticas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {filteredFloors.map(floor => (
              <div key={floor.id} className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {getFloorIcon(floor)}
                      <span className="ml-2">{floor.name}</span>
                      {floor.isRestricted && (
                        <Badge variant="destructive" className="ml-2">Acceso Restringido</Badge>
                      )}
                    </CardTitle>
                    <p className="text-muted-foreground">{floor.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {floor.units.map(unit => (
                        <Card key={unit.id}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center">
                              {getUnitIcon(unit.specialization)}
                              <span className="ml-2">{unit.name}</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Capacidad:</span>
                                <span className="font-medium">{unit.capacity} camas</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Habitaciones:</span>
                                <span className="font-medium">{unit.rooms.length}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Personal:</span>
                                <span className="font-medium">{unit.staff.length}</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                {unit.description}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="beds">
            {viewMode === 'map' ? (
              <BedMapView 
                selectedFloor={selectedFloor}
                selectedUnit={selectedUnit}
                filters={filters}
              />
            ) : (
              <BedListView 
                selectedFloor={selectedFloor}
                selectedUnit={selectedUnit}
                filters={filters}
              />
            )}
          </TabsContent>

          <TabsContent value="statistics">
            <FloorStatistics 
              selectedFloor={selectedFloor}
              selectedUnit={selectedUnit}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
