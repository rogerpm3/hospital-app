'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Bed, User, Clock, AlertTriangle, CheckCircle, 
  XCircle, RefreshCw, Settings, Eye, Sparkles
} from 'lucide-react';
import { useHospital } from '@/lib/hospital-context';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Bed as BedType } from '@/lib/types';
import BedReservationDialog from '@/components/bed-management/bed-reservation-dialog';

interface BedMapViewProps {
  selectedFloor: string;
  selectedUnit: string;
  filters: {
    bedStatus: string;
    bedType: string;
    cleaningStatus: string;
  };
}

export default function BedMapView({ selectedFloor, selectedUnit, filters }: BedMapViewProps) {
  const { hospitalFloors, beds, patients, rooms, reserveBed, updateBedCleaning } = useHospital();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedBed, setSelectedBed] = useState<BedType | null>(null);
  const [showReservationDialog, setShowReservationDialog] = useState(false);
  const [bedToReserve, setBedToReserve] = useState<BedType | null>(null);

  const floor = hospitalFloors.find(f => f.id === selectedFloor);
  if (!floor) return <div>Planta no encontrada</div>;

  const units = selectedUnit === 'all' ? floor.units : floor.units.filter(u => u.id === selectedUnit);

  const getBedColor = (bed: BedType) => {
    switch (bed.status) {
      case 'Available': return 'bg-green-100 border-green-300 hover:bg-green-200';
      case 'Occupied': return 'bg-red-100 border-red-300 hover:bg-red-200';
      case 'Cleaning Required': return 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200';
      case 'Maintenance': return 'bg-gray-100 border-gray-300 hover:bg-gray-200';
      case 'Reserved': return 'bg-blue-100 border-blue-300 hover:bg-blue-200';
      default: return 'bg-gray-100 border-gray-300 hover:bg-gray-200';
    }
  };

  const getBedIcon = (bed: BedType) => {
    switch (bed.status) {
      case 'Available': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Occupied': return <User className="h-4 w-4 text-red-600" />;
      case 'Cleaning Required': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'Maintenance': return <Settings className="h-4 w-4 text-gray-600" />;
      case 'Reserved': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <XCircle className="h-4 w-4 text-gray-600" />;
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
          condition: canViewClinicalData ? patient.currentCondition : 'Información restringida'
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

    return true;
  });

  const canMarkCleaningRequired = user?.role === 'cleaning' || user?.role === 'admin';
  const canReserveBed = user?.role === 'nurse' || user?.role === 'admin' || user?.role === 'admission';

  return (
    <div className="space-y-6">
      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Leyenda del Mapa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
              <span className="text-sm">Disponible</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
              <span className="text-sm">Ocupada</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded"></div>
              <span className="text-sm">Requiere Limpieza</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></div>
              <span className="text-sm">Reservada</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded"></div>
              <span className="text-sm">Mantenimiento</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bed Map */}
      {units.map(unit => (
        <Card key={unit.id}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bed className="h-5 w-5 mr-2" />
              {unit.name}
              <Badge variant="outline" className="ml-2">
                {filteredBeds.filter(bed => {
                  const room = rooms.find(r => r.id === bed.roomId);
                  return room && unit.rooms.includes(room.id);
                }).length} camas
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredBeds
                .filter(bed => {
                  const room = rooms.find(r => r.id === bed.roomId);
                  return room && unit.rooms.includes(room.id);
                })
                .map(bed => {
                  const room = rooms.find(r => r.id === bed.roomId);
                  const patientInfo = getPatientInfo(bed);
                  
                  return (
                    <Dialog key={bed.id}>
                      <DialogTrigger asChild>
                        <div
                          className={`
                            relative p-3 rounded-lg border-2 cursor-pointer transition-all
                            ${getBedColor(bed)}
                          `}
                          onClick={() => setSelectedBed(bed)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium">
                              {room?.number}-{bed.number}
                            </span>
                            {getBedIcon(bed)}
                          </div>
                          
                          <div className="space-y-1">
                            {patientInfo ? (
                              <>
                                <p className="text-xs font-medium truncate">
                                  {patientInfo.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {patientInfo.gender}, {patientInfo.age} años
                                </p>
                                <Badge 
                                  variant={
                                    patientInfo.condition === 'Critical' ? 'destructive' :
                                    patientInfo.condition === 'Serious' ? 'secondary' : 'outline'
                                  }
                                  className="text-xs"
                                >
                                  {patientInfo.condition}
                                </Badge>
                              </>
                            ) : (
                              <p className="text-xs text-muted-foreground">
                                {bed.status}
                              </p>
                            )}
                          </div>

                          {/* Cleaning status indicator */}
                          <div className="absolute top-1 right-1">
                            <Badge 
                              variant={bed.cleaningStatus === 'Clean' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {bed.cleaningStatus === 'Clean' ? 'L' : bed.cleaningStatus === 'Dirty' ? 'S' : 'P'}
                            </Badge>
                          </div>
                        </div>
                      </DialogTrigger>

                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>
                            Cama {room?.number}-{bed.number}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium">Estado</h4>
                              <Badge variant={bed.status === 'Available' ? 'default' : 'secondary'}>
                                {bed.status}
                              </Badge>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">Limpieza</h4>
                              <Badge variant={bed.cleaningStatus === 'Clean' ? 'default' : 'secondary'}>
                                {bed.cleaningStatus}
                              </Badge>
                            </div>
                          </div>

                          {patientInfo && (
                            <div className="p-3 bg-muted rounded-lg">
                              <h4 className="text-sm font-medium mb-2">Paciente</h4>
                              <p className="text-sm">{patientInfo.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {patientInfo.gender}, {patientInfo.age} años • {patientInfo.condition}
                              </p>
                            </div>
                          )}

                          {bed.lastCleaned && (
                            <div>
                              <h4 className="text-sm font-medium">Última Limpieza</h4>
                              <p className="text-xs text-muted-foreground">
                                {new Date(bed.lastCleaned).toLocaleString()} 
                                {bed.cleanedBy && ` por ${bed.cleanedBy}`}
                              </p>
                            </div>
                          )}

                          {bed.equipment && bed.equipment.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium">Equipamiento</h4>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {bed.equipment.map((equipment, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {equipment}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2 pt-2 border-t">
                            {canMarkCleaningRequired && bed.status !== 'Occupied' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  updateBedCleaning(bed.id, 'In Progress', user?.firstName + ' ' + user?.lastName);
                                  toast({
                                    title: "Estado de limpieza actualizado",
                                    description: `Cama ${room?.number}-${bed.number} marcada para limpieza`,
                                  });
                                }}
                              >
                                <Sparkles className="h-4 w-4 mr-2" />
                                Marcar Limpieza
                              </Button>
                            )}
                            
                            {canReserveBed && bed.status === 'Available' && (
                              <Button 
                                size="sm" 
                                variant="default"
                                onClick={() => {
                                  setBedToReserve(bed);
                                  setShowReservationDialog(true);
                                }}
                              >
                                <Clock className="h-4 w-4 mr-2" />
                                Reservar
                              </Button>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Diálogo de reserva de cama */}
      {bedToReserve && (
        <BedReservationDialog
          open={showReservationDialog}
          onOpenChange={(open) => {
            setShowReservationDialog(open);
            if (!open) setBedToReserve(null);
          }}
          bed={bedToReserve}
          room={rooms.find(r => r.id === bedToReserve.roomId)}
        />
      )}
    </div>
  );
}
