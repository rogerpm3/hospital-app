'use client';

import { useState, useMemo } from 'react';
import { useHospital } from '@/lib/hospital-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';
import BedReservationDialog from './bed-reservation-dialog';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Users,
  Bed,
  Clock,
  AlertCircle,
  CheckCircle,
  Wrench,
  CalendarClock
} from 'lucide-react';
import { Bed as BedType } from '@/lib/types';

export default function BedListView() {
  const { rooms, beds, patients, updateBedStatus, reserveBed } = useHospital();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [cleaningFilter, setCleaningFilter] = useState<string>('all');
  const [floorFilter, setFloorFilter] = useState<string>('all');
  const [selectedBed, setSelectedBed] = useState<BedType | null>(null);
  const [showReservationDialog, setShowReservationDialog] = useState(false);
  const [bedToReserve, setBedToReserve] = useState<BedType | null>(null);
  
  // Obtener pisos únicos
  const floors = [...new Set(rooms.map(room => room.floor))].sort((a, b) => a - b);

  // Obtener departamentos únicos
  const departments = [...new Set(rooms.map(room => room.department))];

  // Filtrar y buscar camas
  const filteredBeds = useMemo(() => {
    return beds.filter(bed => {
      const room = rooms.find(r => r.id === bed.roomId);
      if (!room) return false;

      const patient = bed.patientId ? patients.find(p => p.id === bed.patientId) : null;
      
      // Filtro por búsqueda
      const matchesSearch = searchTerm === '' || 
        room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bed.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (patient && `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()));

      // Filtro por estado
      const matchesStatus = statusFilter === 'all' || bed.status === statusFilter;

      // Filtro por departamento
      const matchesDepartment = departmentFilter === 'all' || room.department === departmentFilter;

      // Filtro por limpieza
      const matchesCleaning = cleaningFilter === 'all' || bed.cleaningStatus === cleaningFilter;
      
      // Filtro por piso
      const matchesFloor = floorFilter === 'all' || room.floor === parseInt(floorFilter);

      return matchesSearch && matchesStatus && matchesDepartment && matchesCleaning && matchesFloor;
    }).sort((a, b) => {
      // Ordenar por piso y habitación
      const roomA = rooms.find(r => r.id === a.roomId);
      const roomB = rooms.find(r => r.id === b.roomId);
      if (!roomA || !roomB) return 0;
      if (roomA.floor !== roomB.floor) return roomA.floor - roomB.floor;
      return roomA.number.localeCompare(roomB.number);
    });
  }, [beds, rooms, patients, searchTerm, statusFilter, departmentFilter, cleaningFilter, floorFilter]);

  // Función para obtener el icono según el estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Occupied':
        return <Users className="h-4 w-4 text-red-600" />;
      case 'Available':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Cleaning Required':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case 'Maintenance':
        return <Wrench className="h-4 w-4 text-gray-600" />;
      case 'Reserved':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <Bed className="h-4 w-4 text-gray-600" />;
    }
  };

  // Función para obtener el color del badge según el estado
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Occupied':
        return 'destructive';
      case 'Available':
        return 'default';
      case 'Cleaning Required':
        return 'outline';
      case 'Maintenance':
        return 'secondary';
      case 'Reserved':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const handleStatusChange = (bedId: string, newStatus: string) => {
    updateBedStatus(bedId, newStatus as any);
  };

  return (
    <div className="space-y-6">
      {/* Controles de filtro y búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Habitación, cama, paciente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="Occupied">Ocupada</SelectItem>
                  <SelectItem value="Available">Disponible</SelectItem>
                  <SelectItem value="Cleaning Required">Requiere Limpieza</SelectItem>
                  <SelectItem value="Maintenance">Mantenimiento</SelectItem>
                  <SelectItem value="Reserved">Reservada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Departamento</label>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los departamentos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los departamentos</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Limpieza</label>
              <Select value={cleaningFilter} onValueChange={setCleaningFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado de limpieza" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Clean">Limpia</SelectItem>
                  <SelectItem value="Dirty">Sucia</SelectItem>
                  <SelectItem value="In Progress">En Proceso</SelectItem>
                  <SelectItem value="Sanitized">Sanitizada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Piso</label>
              <Select value={floorFilter} onValueChange={setFloorFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los pisos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los pisos</SelectItem>
                  {floors.map(floor => (
                    <SelectItem key={floor} value={floor.toString()}>Piso {floor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Acciones</label>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setDepartmentFilter('all');
                  setCleaningFilter('all');
                  setFloorFilter('all');
                }}
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de resultados */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Mostrando {filteredBeds.length} de {beds.length} camas
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Ocupadas: {filteredBeds.filter(b => b.status === 'Occupied').length}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Disponibles: {filteredBeds.filter(b => b.status === 'Available').length}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Limpieza: {filteredBeds.filter(b => b.status === 'Cleaning Required').length}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de camas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Camas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-900">Piso</TableHead>
                <TableHead className="text-gray-900">Habitación</TableHead>
                <TableHead className="text-gray-900">Cama</TableHead>
                <TableHead className="text-gray-900">Departamento</TableHead>
                <TableHead className="text-gray-900">Estado</TableHead>
                <TableHead className="text-gray-900">Limpieza</TableHead>
                <TableHead className="text-gray-900">Paciente</TableHead>
                <TableHead className="text-gray-900">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBeds.map(bed => {
                const room = rooms.find(r => r.id === bed.roomId);
                const patient = bed.patientId ? patients.find(p => p.id === bed.patientId) : null;
                
                return (
                  <TableRow key={bed.id}>
                    <TableCell className="font-medium text-gray-900">
                      {room?.floor || 'N/A'}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {room?.number || 'N/A'}
                    </TableCell>
                    <TableCell className="text-gray-900">{bed.number}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-gray-700">{room?.department}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(bed.status)}
                        <Badge variant={getStatusBadgeVariant(bed.status)}>
                          {bed.status === 'Occupied' ? 'Ocupada' : 
                           bed.status === 'Available' ? 'Disponible' :
                           bed.status === 'Cleaning Required' ? 'Requiere Limpieza' :
                           bed.status === 'Maintenance' ? 'Mantenimiento' :
                           bed.status === 'Reserved' ? 'Reservada' : bed.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={bed.cleaningStatus === 'Clean' || bed.cleaningStatus === 'Sanitized' ? 'default' : 'secondary'}
                        className={
                          bed.cleaningStatus === 'Dirty' ? 'bg-red-100 text-red-800' :
                          bed.cleaningStatus === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : ''
                        }
                      >
                        {bed.cleaningStatus === 'Clean' ? 'Limpia' :
                         bed.cleaningStatus === 'Dirty' ? 'Sucia' :
                         bed.cleaningStatus === 'In Progress' ? 'En Proceso' :
                         bed.cleaningStatus === 'Sanitized' ? 'Sanitizada' : bed.cleaningStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {patient ? (
                        <div>
                          <div className="font-medium text-gray-900">{patient.firstName} {patient.lastName}</div>
                          <div className="text-sm text-gray-500">{patient.dni}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {/* Botón Ver Detalles */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedBed(bed)}
                              title="Ver detalles"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>
                                Detalles - Habitación {room?.number} - Cama {bed.number}
                              </DialogTitle>
                            </DialogHeader>
                            {selectedBed && (
                              <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <h4 className="font-semibold mb-2">Información de la Cama</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span>Estado:</span>
                                        <Badge variant={getStatusBadgeVariant(selectedBed.status)}>
                                          {selectedBed.status}
                                        </Badge>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Limpieza:</span>
                                        <Badge variant="secondary">{selectedBed.cleaningStatus}</Badge>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Cama eléctrica:</span>
                                        <span>{selectedBed.isElectric ? 'Sí' : 'No'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Barandillas:</span>
                                        <span>{selectedBed.hasBedrails ? 'Sí' : 'No'}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">Información de Limpieza</h4>
                                    <div className="space-y-2 text-sm">
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
                                </div>

                                {selectedBed.equipment && selectedBed.equipment.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Equipamiento</h4>
                                    <div className="flex flex-wrap gap-1">
                                      {selectedBed.equipment.map((item, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          {item}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {selectedBed.notes && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Notas</h4>
                                    <div className="bg-gray-50 p-3 rounded-lg text-sm">
                                      {selectedBed.notes}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        {/* Botón cambiar estado */}
                        <Select
                          value={bed.status}
                          onValueChange={(value) => {
                            handleStatusChange(bed.id, value);
                            toast({
                              title: "Estado actualizado",
                              description: `Cama ${bed.number} ahora está: ${value}`,
                            });
                          }}
                        >
                          <SelectTrigger className="w-auto h-8 text-xs" title="Cambiar estado">
                            <Edit className="h-3 w-3" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Available">Disponible</SelectItem>
                            <SelectItem value="Occupied">Ocupada</SelectItem>
                            <SelectItem value="Cleaning Required">Requiere Limpieza</SelectItem>
                            <SelectItem value="Maintenance">Mantenimiento</SelectItem>
                            <SelectItem value="Reserved">Reservada</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {/* Botón Reservar - solo para camas disponibles */}
                        {bed.status === 'Available' && (
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            title="Reservar cama"
                            onClick={() => {
                              setBedToReserve(bed);
                              setShowReservationDialog(true);
                            }}
                          >
                            <CalendarClock className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredBeds.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No se encontraron camas que coincidan con los filtros aplicados.
            </div>
          )}
        </CardContent>
      </Card>

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
