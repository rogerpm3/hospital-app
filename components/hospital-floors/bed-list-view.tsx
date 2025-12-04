'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Search, User, Clock, AlertTriangle, CheckCircle, 
  XCircle, Settings, Sparkles, Eye, Calendar
} from 'lucide-react';
import { useHospital } from '@/lib/hospital-context';
import { useAuth } from '@/lib/auth-context';
import { Bed as BedType } from '@/lib/types';

interface BedListViewProps {
  selectedFloor: string;
  selectedUnit: string;
  filters: {
    bedStatus: string;
    bedType: string;
    cleaningStatus: string;
  };
}

export default function BedListView({ selectedFloor, selectedUnit, filters }: BedListViewProps) {
  const { hospitalFloors, beds, patients, rooms, reserveBed } = useHospital();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const floor = hospitalFloors.find(f => f.id === selectedFloor);
  if (!floor) return <div>Planta no encontrada</div>;

  const units = selectedUnit === 'all' ? floor.units : floor.units.filter(u => u.id === selectedUnit);

  const getBedStatusBadge = (status: string) => {
    switch (status) {
      case 'Available':
        return <Badge className="bg-green-100 text-green-800">Disponible</Badge>;
      case 'Occupied':
        return <Badge className="bg-red-100 text-red-800">Ocupada</Badge>;
      case 'Cleaning Required':
        return <Badge className="bg-yellow-100 text-yellow-800">Requiere Limpieza</Badge>;
      case 'Maintenance':
        return <Badge className="bg-gray-100 text-gray-800">Mantenimiento</Badge>;
      case 'Reserved':
        return <Badge className="bg-blue-100 text-blue-800">Reservada</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const getCleaningStatusBadge = (status: string) => {
    switch (status) {
      case 'Clean':
        return <Badge variant="default">Limpia</Badge>;
      case 'Dirty':
        return <Badge variant="destructive">Sucia</Badge>;
      case 'In Progress':
        return <Badge variant="secondary">En Proceso</Badge>;
      default:
        return <Badge variant="outline">N/A</Badge>;
    }
  };

  const getPatientInfo = (bed: BedType) => {
    if (bed.patientId) {
      const patient = patients.find(p => p.id === bed.patientId);
      if (patient) {
        // Control de privacidad según el rol del usuario
        const canViewFullName = user?.role === 'admin' || user?.role === 'doctor' || user?.role === 'nurse';
        const canViewClinicalData = user?.role === 'admin' || user?.role === 'doctor' || user?.role === 'nurse';

        if (user?.role === 'cleaning' || user?.role === 'auxiliary') {
          // Personal de limpieza solo ve información básica
          return {
            name: patient.anonymousId || `Paciente ${patient.id.slice(-4)}`,
            gender: patient.gender,
            age: new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear(),
            condition: patient.currentCondition || 'Estable'
          };
        }

        return {
          name: canViewFullName ? `${patient.firstName} ${patient.lastName}` : (patient.anonymousId || `Paciente ${patient.id.slice(-4)}`),
          gender: patient.gender,
          age: new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear(),
          condition: canViewClinicalData ? patient.currentCondition : 'Información restringida',
          dni: canViewFullName ? patient.dni : 'Restringido'
        };
      }
    }
    return null;
  };

  const filteredBeds = beds.filter(bed => {
    const room = rooms.find(r => r.id === bed.roomId);
    if (!room) return false;

    const unitRoomIds = units.flatMap(u => u.rooms);
    if (!unitRoomIds.includes(room.id)) return false;

    if (filters.bedStatus !== 'all' && bed.status !== filters.bedStatus) return false;
    if (filters.cleaningStatus !== 'all' && bed.cleaningStatus !== filters.cleaningStatus) return false;

    // Filtro de búsqueda
    if (searchTerm) {
      const patient = getPatientInfo(bed);
      const searchFields = [
        room.number + '-' + bed.number,
        patient?.name || '',
        bed.status,
        bed.cleaningStatus
      ].join(' ').toLowerCase();
      
      if (!searchFields.includes(searchTerm.toLowerCase())) return false;
    }

    return true;
  });

  const canMarkCleaningRequired = user?.role === 'cleaning' || user?.role === 'admin';
  const canReserveBed = user?.role === 'nurse' || user?.role === 'admin' || user?.role === 'admission';

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Búsqueda y Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por habitación, paciente, estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Bed List Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Camas</span>
            <Badge variant="outline">{filteredBeds.length} camas encontradas</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Habitación</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Limpieza</TableHead>
                <TableHead>Última Limpieza</TableHead>
                <TableHead>Equipamiento</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBeds.map(bed => {
                const room = rooms.find(r => r.id === bed.roomId);
                const unit = units.find(u => u.rooms.includes(room?.id || ''));
                const patientInfo = getPatientInfo(bed);

                return (
                  <TableRow key={bed.id}>
                    <TableCell className="font-medium">
                      <div>
                        <span>{room?.number}-{bed.number}</span>
                        <p className="text-xs text-muted-foreground">{unit?.name}</p>
                      </div>
                    </TableCell>

                    <TableCell>
                      {patientInfo ? (
                        <div>
                          <p className="font-medium">{patientInfo.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {patientInfo.gender}, {patientInfo.age} años
                          </p>
                          <Badge 
                            variant={
                              patientInfo.condition === 'Critical' ? 'destructive' :
                              patientInfo.condition === 'Serious' ? 'secondary' : 'outline'
                            }
                            className="text-xs mt-1"
                          >
                            {patientInfo.condition}
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No asignado</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {getBedStatusBadge(bed.status)}
                    </TableCell>

                    <TableCell>
                      {getCleaningStatusBadge(bed.cleaningStatus)}
                    </TableCell>

                    <TableCell>
                      {bed.lastCleaned ? (
                        <div>
                          <p className="text-sm">
                            {new Date(bed.lastCleaned).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(bed.lastCleaned).toLocaleTimeString()}
                          </p>
                          {bed.cleanedBy && (
                            <p className="text-xs text-muted-foreground">
                              por {bed.cleanedBy}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Sin datos</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {bed.equipment && bed.equipment.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {bed.equipment.map((equipment, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {equipment}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Sin equipamiento</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex space-x-1">
                        {canMarkCleaningRequired && bed.status !== 'Occupied' && (
                          <Button size="sm" variant="outline" className="h-8 px-2">
                            <Sparkles className="h-3 w-3" />
                          </Button>
                        )}
                        
                        {canReserveBed && bed.status === 'Available' && (
                          <Button size="sm" variant="outline" className="h-8 px-2">
                            <Calendar className="h-3 w-3" />
                          </Button>
                        )}

                        <Button size="sm" variant="outline" className="h-8 px-2">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredBeds.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No se encontraron camas con los filtros seleccionados
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
