'use client';

import { useState } from 'react';
import { useHospital } from '@/lib/hospital-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BedReservationDialog from './bed-reservation-dialog';
import { 
  Bed, 
  User, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Wrench,
  MapPin,
  Eye,
  Calendar
} from 'lucide-react';
import { Bed as BedType } from '@/lib/types';

export default function BedMapView() {
  const { rooms, beds, patients } = useHospital();
  const [selectedBed, setSelectedBed] = useState<BedType | null>(null);
  const [showReservation, setShowReservation] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');

  // Agrupar habitaciones por piso
  const floors = [...new Set(rooms.map(room => room.floor))].sort();
  const filteredRooms = selectedFloor === 'all' 
    ? rooms 
    : rooms.filter(room => room.floor === selectedFloor);

  // Función para obtener el color y icono según el estado de la cama
  const getBedStyle = (bed: BedType) => {
    switch (bed.status) {
      case 'Occupied':
        return {
          bgColor: 'bg-red-100 border-red-300',
          textColor: 'text-red-800',
          icon: User,
          iconColor: 'text-red-600'
        };
      case 'Available':
        return {
          bgColor: 'bg-green-100 border-green-300',
          textColor: 'text-green-800',
          icon: CheckCircle,
          iconColor: 'text-green-600'
        };
      case 'Cleaning Required':
        return {
          bgColor: 'bg-orange-100 border-orange-300',
          textColor: 'text-orange-800',
          icon: AlertCircle,
          iconColor: 'text-orange-600'
        };
      case 'Maintenance':
        return {
          bgColor: 'bg-gray-100 border-gray-300',
          textColor: 'text-gray-800',
          icon: Wrench,
          iconColor: 'text-gray-600'
        };
      case 'Reserved':
        return {
          bgColor: 'bg-blue-100 border-blue-300',
          textColor: 'text-blue-800',
          icon: Clock,
          iconColor: 'text-blue-600'
        };
      default:
        return {
          bgColor: 'bg-gray-100 border-gray-300',
          textColor: 'text-gray-800',
          icon: Bed,
          iconColor: 'text-gray-600'
        };
    }
  };

  // Obtener información del paciente si la cama está ocupada
  const getPatientInfo = (bedId: string) => {
    const bed = beds.find(b => b.id === bedId);
    if (bed?.patientId) {
      return patients.find(p => p.id === bed.patientId);
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Controles de filtro */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Vista del Hospital por Pisos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedFloor === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedFloor('all')}
              size="sm"
            >
              Todos los Pisos
            </Button>
            {floors.map(floor => (
              <Button
                key={floor}
                variant={selectedFloor === floor ? 'default' : 'outline'}
                onClick={() => setSelectedFloor(floor)}
                size="sm"
              >
                Piso {floor}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leyenda */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span>Ocupada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span>Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
              <span>Requiere Limpieza</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
              <span>Mantenimiento</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
              <span>Reservada</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mapa de habitaciones */}
      <div className="grid gap-6">
        {floors.map(floor => {
          const floorRooms = rooms.filter(room => 
            room.floor === floor && 
            (selectedFloor === 'all' || selectedFloor === floor)
          );
          
          if (floorRooms.length === 0) return null;

          return (
            <Card key={floor}>
              <CardHeader>
                <CardTitle>Piso {floor}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {floorRooms.map(room => {
                    const roomBeds = beds.filter(bed => bed.roomId === room.id);
                    
                    return (
                      <Card key={room.id} className="relative">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">
                              Habitación {room.number}
                            </CardTitle>
                            <Badge variant="outline" className="text-xs">
                              {room.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {room.department}
                          </p>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-2">
                            {roomBeds.map(bed => {
                              const style = getBedStyle(bed);
                              const IconComponent = style.icon;
                              const patient = getPatientInfo(bed.id);
                              
                              return (
                                <div
                                  key={bed.id}
                                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${style.bgColor}`}
                                  onClick={() => setSelectedBed(bed)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <IconComponent className={`h-4 w-4 ${style.iconColor}`} />
                                      <span className={`text-sm font-medium ${style.textColor}`}>
                                        Cama {bed.number}
                                      </span>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedBed(bed);
                                      }}
                                    >
                                      <Eye className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  {patient && (
                                    <div className="mt-1 text-xs text-gray-600">
                                      {patient.firstName} {patient.lastName}
                                    </div>
                                  )}
                                  {bed.status === 'Reserved' && bed.reservationExpires && (
                                    <div className="mt-1 text-xs text-blue-600">
                                      Expira: {bed.reservationExpires.toLocaleTimeString()}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dialog de detalles de cama */}
      <Dialog open={!!selectedBed} onOpenChange={() => setSelectedBed(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Detalles - Habitación {rooms.find(r => r.id === selectedBed?.roomId)?.number} - Cama {selectedBed?.number}
            </DialogTitle>
          </DialogHeader>
          {selectedBed && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">Estado de la Cama</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Estado:</span>
                      <Badge variant="outline">{selectedBed.status}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Limpieza:</span>
                      <Badge variant="secondary">{selectedBed.cleaningStatus}</Badge>
                    </div>
                    {selectedBed.lastCleaned && (
                      <div className="flex justify-between">
                        <span>Última limpieza:</span>
                        <span>{selectedBed.lastCleaned.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedBed.cleanedBy && (
                      <div className="flex justify-between">
                        <span>Limpiado por:</span>
                        <span>{selectedBed.cleanedBy}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Información Adicional</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Cama eléctrica:</span>
                      <span>{selectedBed.isElectric ? 'Sí' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Barandillas:</span>
                      <span>{selectedBed.hasBedrails ? 'Sí' : 'No'}</span>
                    </div>
                    {selectedBed.equipment && selectedBed.equipment.length > 0 && (
                      <div>
                        <span className="font-medium">Equipamiento:</span>
                        <div className="mt-1">
                          {selectedBed.equipment.map((item, index) => (
                            <Badge key={index} variant="outline" className="mr-1 mb-1 text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedBed.patientId && (() => {
                const patient = patients.find(p => p.id === selectedBed.patientId);
                return patient && (
                  <div>
                    <h4 className="font-semibold mb-2">Paciente Asignado</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span>Nombre:</span>
                          <span className="font-medium">{patient.firstName} {patient.lastName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>DNI:</span>
                          <span>{patient.dni}</span>
                        </div>
                        {patient.attendingPhysician && (
                          <div className="flex justify-between">
                            <span>Médico:</span>
                            <span>{patient.attendingPhysician}</span>
                          </div>
                        )}
                        {patient.admissionDate && (
                          <div className="flex justify-between">
                            <span>Ingreso:</span>
                            <span>{patient.admissionDate.toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {selectedBed.notes && (
                <div>
                  <h4 className="font-semibold mb-2">Notas</h4>
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-sm">
                    {selectedBed.notes}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                {selectedBed.status === 'Available' && (
                  <Button
                    onClick={() => {
                      setSelectedBed(null);
                      setShowReservation(true);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Reservar Cama
                  </Button>
                )}
                <Button variant="outline" onClick={() => setSelectedBed(null)}>
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de reserva */}
      <BedReservationDialog
        open={showReservation}
        onClose={() => setShowReservation(false)}
        bedId={selectedBed?.id || ''}
      />
    </div>
  );
}
