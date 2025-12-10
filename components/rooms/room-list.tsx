'use client';

import { useState, useEffect } from 'react';
import { useHospital } from '@/lib/hospital-context';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Search, Building2, Bed, CheckCircle, AlertCircle, Edit, Eye, Wrench, Sparkles, RefreshCw, Save } from 'lucide-react';
import { Room } from '@/lib/types';

export default function RoomList() {
  const { rooms, beds, patients, updateBedStatus, updateBedCleaning, updateRoom, staff } = useHospital();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Estados para diálogos
  const [showRoomDialog, setShowRoomDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showEditRoomDialog, setShowEditRoomDialog] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Partial<Room>>({});
  
  // Personal de limpieza
  const cleaningStaff = staff.filter(s => s.role === 'cleaning');

  // Refresco automático cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = searchTerm === '' || 
      room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || room.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'occupied' && room.isOccupied) ||
      (statusFilter === 'available' && !room.isOccupied);
    const matchesDepartment = departmentFilter === 'all' || room.department === departmentFilter;
    
    return matchesSearch && matchesType && matchesStatus && matchesDepartment;
  });

  // Estadísticas
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(room => room.isOccupied).length;
  const availableRooms = totalRooms - occupiedRooms;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  // Obtener departamentos únicos
  const departments = [...new Set(rooms.map(room => room.department))];

  // Obtener camas de una habitación
  const getRoomBeds = (roomId: string) => {
    return beds.filter(bed => bed.roomId === roomId);
  };

  // Obtener pacientes de una habitación
  const getRoomPatients = (roomId: string) => {
    const roomBeds = getRoomBeds(roomId);
    return roomBeds
      .filter(bed => bed.patientId)
      .map(bed => patients.find(patient => patient.id === bed.patientId))
      .filter(Boolean);
  };

  // Abrir diálogo de edición
  const handleEditRoom = (room: Room) => {
    setEditingRoom({ ...room });
    setShowEditRoomDialog(true);
  };

  // Guardar cambios de habitación
  const handleSaveRoom = () => {
    if (!editingRoom.id) return;
    
    updateRoom(editingRoom.id, {
      isOccupied: editingRoom.isOccupied,
      status: editingRoom.status,
      cleaningStatus: editingRoom.cleaningStatus,
      type: editingRoom.type,
      dailyRate: editingRoom.dailyRate
    });
    
    toast({
      title: "Habitación actualizada",
      description: `Los cambios en la habitación ${editingRoom.number} han sido guardados`,
    });
    
    setShowEditRoomDialog(false);
    setEditingRoom({});
    setRefreshKey(prev => prev + 1);
  };

  // Manejar cambio de estado de cama con limpieza
  const handleBedStatusChange = (bedId: string, newStatus: string) => {
    updateBedStatus(bedId, newStatus as any);
    
    // Si cambia a "Cleaning Required", también actualizar cleaningStatus
    if (newStatus === 'Cleaning Required') {
      updateBedCleaning(bedId, 'Cleaning Required');
    }
    
    toast({
      title: "Estado actualizado",
      description: "El estado de la cama ha sido actualizado correctamente",
    });
    
    setRefreshKey(prev => prev + 1);
  };

  // Manejar cambio de limpieza
  const handleBedCleaningChange = (bedId: string, cleaningStatus: string, cleanerName?: string) => {
    updateBedCleaning(bedId, cleaningStatus as any, cleanerName);
    
    toast({
      title: "Limpieza actualizada",
      description: `Estado de limpieza actualizado${cleanerName ? ` - Asignado a ${cleanerName}` : ''}`,
    });
    
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="p-6 space-y-6" key={refreshKey}>
      <div className="flex flex-col space-y-2 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Habitaciones</h1>
          <p className="text-muted-foreground">
            Administra las habitaciones y su disponibilidad
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setRefreshKey(prev => prev + 1)}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Habitaciones</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRooms}</div>
            <p className="text-xs text-muted-foreground">En el hospital</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocupadas</CardTitle>
            <Bed className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{occupiedRooms}</div>
            <p className="text-xs text-muted-foreground">Con pacientes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableRooms}</div>
            <p className="text-xs text-muted-foreground">Libres</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocupación</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">Tasa de ocupación</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-5">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar habitación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="Single">Individual</SelectItem>
                <SelectItem value="Double">Doble</SelectItem>
                <SelectItem value="ICU">UCI</SelectItem>
                <SelectItem value="CCU">UCC</SelectItem>
                <SelectItem value="Emergency">Emergencia</SelectItem>
                <SelectItem value="Surgery">Cirugía</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="occupied">Ocupadas</SelectItem>
                <SelectItem value="available">Disponibles</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('all');
                setStatusFilter('all');
                setDepartmentFilter('all');
              }}
            >
              Limpiar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de habitaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Habitaciones ({filteredRooms.length})</CardTitle>
          <CardDescription>Haz clic en "Ver" para gestionar las camas o en "Editar" para modificar la habitación</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Habitación</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Camas</TableHead>
                <TableHead>Pacientes</TableHead>
                <TableHead>Tarifa Diaria</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRooms.map(room => {
                const roomBeds = getRoomBeds(room.id);
                const roomPatients = getRoomPatients(room.id);
                const needsCleaning = roomBeds.some(b => 
                  b.cleaningStatus === 'Cleaning Required' || 
                  b.cleaningStatus === 'In Progress' ||
                  b.status === 'Cleaning Required'
                );
                
                return (
                  <TableRow key={room.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">Habitación {room.number}</div>
                        <div className="text-sm text-muted-foreground">
                          Piso {room.floor}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{room.type}</Badge>
                    </TableCell>
                    <TableCell>{room.department}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant={room.isOccupied ? "destructive" : "default"}>
                          {room.isOccupied ? "Ocupada" : "Disponible"}
                        </Badge>
                        {needsCleaning && (
                          <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Req. Limpieza
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{roomBeds.length} camas total</div>
                        <div className="text-muted-foreground">
                          {roomBeds.filter(bed => bed.status === 'Occupied').length} ocupadas
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {roomPatients.length > 0 ? (
                          roomPatients.map((patient: any, index) => (
                            <div key={index} className="truncate">
                              {patient?.firstName} {patient?.lastName}
                            </div>
                          ))
                        ) : (
                          <span className="text-muted-foreground">Sin pacientes</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">€{room.dailyRate?.toFixed(2) || '0.00'}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedRoom(room);
                            setShowRoomDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        {(user?.role === 'admin' || user?.role === 'nurse') && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleEditRoom(room)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Diálogo de detalle de habitación con camas */}
      <Dialog open={showRoomDialog} onOpenChange={setShowRoomDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Habitación {selectedRoom?.number} - {selectedRoom?.department}
            </DialogTitle>
          </DialogHeader>
          {selectedRoom && (
            <div className="space-y-6">
              {/* Info de la habitación */}
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-sm text-muted-foreground">Tipo</div>
                    <div className="font-semibold">{selectedRoom.type}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-sm text-muted-foreground">Piso</div>
                    <div className="font-semibold">{selectedRoom.floor}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-sm text-muted-foreground">Capacidad</div>
                    <div className="font-semibold">{selectedRoom.capacity} camas</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-sm text-muted-foreground">Tarifa</div>
                    <div className="font-semibold">€{selectedRoom.dailyRate?.toFixed(2)}/día</div>
                  </CardContent>
                </Card>
              </div>

              {/* Lista de camas de la habitación */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bed className="h-5 w-5" />
                    Camas de la habitación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cama</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Limpieza</TableHead>
                        <TableHead>Paciente</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getRoomBeds(selectedRoom.id).map(bed => {
                        const patient = bed.patientId ? patients.find(p => p.id === bed.patientId) : null;
                        return (
                          <TableRow key={bed.id}>
                            <TableCell className="font-medium">Cama {bed.number}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  bed.status === 'Available' ? 'default' :
                                  bed.status === 'Occupied' ? 'destructive' :
                                  bed.status === 'Reserved' ? 'secondary' :
                                  'outline'
                                }
                              >
                                {bed.status === 'Available' && 'Disponible'}
                                {bed.status === 'Occupied' && 'Ocupada'}
                                {bed.status === 'Reserved' && 'Reservada'}
                                {bed.status === 'Maintenance' && 'Mantenimiento'}
                                {bed.status === 'Cleaning Required' && 'Requiere limpieza'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline"
                                className={
                                  bed.cleaningStatus === 'Clean' ? 'border-green-500 text-green-700' :
                                  bed.cleaningStatus === 'Sanitized' ? 'border-emerald-500 text-emerald-700' :
                                  bed.cleaningStatus === 'Cleaning Required' ? 'border-red-500 text-red-700' :
                                  'border-yellow-500 text-yellow-700'
                                }
                              >
                                {bed.cleaningStatus === 'Clean' && '✓ Limpia'}
                                {bed.cleaningStatus === 'Sanitized' && '✓ Desinfectada'}
                                {bed.cleaningStatus === 'Cleaning Required' && '✗ Requiere limpieza'}
                                {bed.cleaningStatus === 'In Progress' && '⟳ Limpiando'}
                              </Badge>
                              {bed.cleanedBy && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  Por: {bed.cleanedBy}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              {patient ? (
                                <span>{patient.firstName} {patient.lastName}</span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex flex-col gap-2">
                                <Select 
                                  value={bed.status}
                                  onValueChange={(value) => handleBedStatusChange(bed.id, value)}
                                >
                                  <SelectTrigger className="w-[140px] h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Available">Disponible</SelectItem>
                                    <SelectItem value="Occupied">Ocupada</SelectItem>
                                    <SelectItem value="Reserved">Reservada</SelectItem>
                                    <SelectItem value="Maintenance">Mantenimiento</SelectItem>
                                    <SelectItem value="Cleaning Required">Req. Limpieza</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Select 
                                  value={bed.cleaningStatus}
                                  onValueChange={(value) => {
                                    // Si selecciona "In Progress", permitir asignar limpiador
                                    if (value === 'In Progress' && cleaningStaff.length > 0) {
                                      const cleaner = cleaningStaff[0];
                                      handleBedCleaningChange(bed.id, value, `${cleaner.firstName} ${cleaner.lastName}`);
                                    } else {
                                      handleBedCleaningChange(bed.id, value);
                                    }
                                  }}
                                >
                                  <SelectTrigger className="w-[140px] h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Clean">Limpia</SelectItem>
                                    <SelectItem value="Sanitized">Desinfectada</SelectItem>
                                    <SelectItem value="In Progress">En proceso</SelectItem>
                                    <SelectItem value="Cleaning Required">Req. Limpieza</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {getRoomBeds(selectedRoom.id).length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                            No hay camas registradas en esta habitación
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-2">
                {(user?.role === 'admin' || user?.role === 'nurse') && (
                  <Button onClick={() => handleEditRoom(selectedRoom)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Editar Habitación
                  </Button>
                )}
                <Button variant="outline" onClick={() => setShowRoomDialog(false)}>
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de edición de habitación */}
      <Dialog open={showEditRoomDialog} onOpenChange={setShowEditRoomDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Habitación {editingRoom.number}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roomType">Tipo de Habitación</Label>
              <Select 
                value={editingRoom.type} 
                onValueChange={(value) => setEditingRoom({...editingRoom, type: value as any})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single">Individual</SelectItem>
                  <SelectItem value="Double">Doble</SelectItem>
                  <SelectItem value="ICU">UCI</SelectItem>
                  <SelectItem value="CCU">UCC</SelectItem>
                  <SelectItem value="Emergency">Emergencia</SelectItem>
                  <SelectItem value="Surgery">Cirugía</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dailyRate">Tarifa Diaria (€)</Label>
              <Input
                id="dailyRate"
                type="number"
                value={editingRoom.dailyRate || ''}
                onChange={(e) => setEditingRoom({...editingRoom, dailyRate: parseFloat(e.target.value) || 0})}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isOccupied">Marcar como ocupada</Label>
              <Switch
                id="isOccupied"
                checked={editingRoom.isOccupied || false}
                onCheckedChange={(checked) => setEditingRoom({...editingRoom, isOccupied: checked})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado General</Label>
              <Select 
                value={editingRoom.status || 'Active'} 
                onValueChange={(value) => setEditingRoom({...editingRoom, status: value as any})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Activa</SelectItem>
                  <SelectItem value="Maintenance">Mantenimiento</SelectItem>
                  <SelectItem value="Closed">Cerrada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cleaningStatus">Estado de Limpieza</Label>
              <Select 
                value={editingRoom.cleaningStatus || 'Clean'} 
                onValueChange={(value) => setEditingRoom({...editingRoom, cleaningStatus: value as any})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Clean">Limpia</SelectItem>
                  <SelectItem value="In Progress">En proceso de limpieza</SelectItem>
                  <SelectItem value="Pending">Pendiente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowEditRoomDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveRoom}>
              <Save className="h-4 w-4 mr-1" />
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
