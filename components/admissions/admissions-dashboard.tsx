'use client';

import { useState } from 'react';
import { useHospital } from '@/lib/hospital-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Plus, Users, Clock, CheckCircle, AlertTriangle, Search, Bed, User } from 'lucide-react';

export default function AdmissionsDashboard() {
  const { admissions, patients, rooms, beds, staff, addAdmission } = useHospital();
  const { toast } = useToast();
  
  const [showNewAdmission, setShowNewAdmission] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Formulario de nueva admisión
  const [formData, setFormData] = useState({
    patientId: '',
    roomId: '',
    bedId: '',
    admittingPhysician: '',
    reason: '',
    notes: '',
    priority: 'Normal' as 'Low' | 'Normal' | 'High' | 'Urgent',
    admissionType: 'Emergency' as 'Emergency' | 'Scheduled' | 'Transfer'
  });

  const activeAdmissions = admissions.filter(adm => adm.status === 'Active');
  const todayAdmissions = admissions.filter(adm => 
    adm.admissionDate.toDateString() === new Date().toDateString()
  );

  // Filtrar admisiones por búsqueda
  const filteredAdmissions = admissions.filter(admission => {
    const patient = patients.find(p => p.id === admission.patientId);
    const patientName = patient ? `${patient.firstName} ${patient.lastName}`.toLowerCase() : '';
    return patientName.includes(searchTerm.toLowerCase()) || 
           admission.reason.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Pacientes disponibles (no hospitalizados)
  const availablePatients = patients.filter(p => !p.roomId);
  
  // Médicos disponibles
  const doctors = staff.filter(s => s.role === 'doctor');
  
  // Camas disponibles
  const availableBeds = beds.filter(b => b.status === 'Available');
  
  // Actualizar camas disponibles cuando se selecciona una habitación
  const bedsInSelectedRoom = formData.roomId 
    ? availableBeds.filter(b => b.roomId === formData.roomId)
    : availableBeds;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.patientId || !formData.reason || !formData.admittingPhysician) {
        toast({
          title: "Error de validación",
          description: "Por favor completa todos los campos requeridos",
          variant: "destructive",
        });
        return;
      }

      const patient = patients.find(p => p.id === formData.patientId);
      const room = rooms.find(r => r.id === formData.roomId);
      
      const newAdmission = {
        patientId: formData.patientId,
        roomId: formData.roomId || undefined,
        bedId: formData.bedId || undefined,
        admissionDate: new Date(),
        admittingPhysician: formData.admittingPhysician,
        reason: formData.reason,
        status: 'Active' as const,
        priority: formData.priority,
        admissionType: formData.admissionType,
        notes: formData.notes,
        department: room?.department || 'General'
      };

      if (typeof addAdmission === 'function') {
        addAdmission(newAdmission);
      }

      toast({
        title: "Admisión registrada",
        description: `${patient?.firstName} ${patient?.lastName} ha sido admitido exitosamente`,
      });

      // Limpiar y cerrar
      setFormData({
        patientId: '',
        roomId: '',
        bedId: '',
        admittingPhysician: '',
        reason: '',
        notes: '',
        priority: 'Normal',
        admissionType: 'Emergency'
      });
      setShowNewAdmission(false);

    } catch (error) {
      toast({
        title: "Error al registrar admisión",
        description: "No se pudo crear la admisión. Por favor intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Admisiones</h1>
          <p className="text-muted-foreground">Control de ingresos hospitalarios</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setShowNewAdmission(true)}>
          <Plus className="h-4 w-4" />
          Nueva Admisión
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admisiones Activas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAdmissions.length}</div>
            <p className="text-xs text-muted-foreground">Pacientes hospitalizados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Hoy</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{todayAdmissions.length}</div>
            <p className="text-xs text-muted-foreground">Nuevos ingresos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Camas Disponibles</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableBeds.length}</div>
            <p className="text-xs text-muted-foreground">Listas para asignar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocupación</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {beds.length > 0 ? Math.round(((beds.length - availableBeds.length) / beds.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Capacidad utilizada</p>
          </CardContent>
        </Card>
      </div>

      {/* Búsqueda */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por paciente o motivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admisiones Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAdmissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No se encontraron admisiones
              </div>
            ) : (
              filteredAdmissions.slice(0, 15).map(admission => {
                const patient = patients.find(p => p.id === admission.patientId);
                const room = rooms.find(r => r.id === admission.roomId);
                const bed = patient?.bedNumber || beds.find(b => b.patientId === patient?.id)?.number;
                const age = patient?.dateOfBirth ? new Date().getFullYear() - patient.dateOfBirth.getFullYear() : null;
                
                return (
                  <div key={admission.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    {/* Encabezado con datos principales del paciente */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-lg text-gray-900">
                            {patient?.firstName} {patient?.lastName}
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium">
                              DNI: {patient?.dni || 'No registrado'}
                            </span>
                            {patient?.socialSecurityNumber && (
                              <span className="text-gray-500">
                                NSS: {patient.socialSecurityNumber}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          admission.status === 'Active' ? 'default' : 
                          admission.status === 'Discharged' ? 'secondary' : 'outline'
                        }>
                          {admission.status === 'Active' ? 'Activo' : 
                           admission.status === 'Discharged' ? 'Alta' : admission.status}
                        </Badge>
                        {admission.priority === 'Urgent' && (
                          <Badge variant="destructive">Urgente</Badge>
                        )}
                        {admission.priority === 'High' && (
                          <Badge variant="outline" className="border-orange-500 text-orange-600">Alta Prioridad</Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Datos demográficos del paciente */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500 text-xs uppercase">Edad</span>
                          <p className="font-medium text-gray-900">{age ? `${age} años` : 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs uppercase">Género</span>
                          <p className="font-medium text-gray-900">
                            {patient?.gender === 'M' ? 'Masculino' : patient?.gender === 'F' ? 'Femenino' : 'Otro'}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs uppercase">Teléfono</span>
                          <p className="font-medium text-gray-900">{patient?.phone || 'No registrado'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs uppercase">Email</span>
                          <p className="font-medium text-gray-900 truncate">{patient?.email || 'No registrado'}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Información de la admisión */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 text-xs uppercase">Motivo de ingreso</span>
                        <p className="font-medium text-gray-900">{admission.reason}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs uppercase">Ubicación</span>
                        <p className="font-medium text-gray-900">
                          {room ? `Hab. ${room.number}${bed ? ` - Cama ${bed}` : ''}` : 'No asignada'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs uppercase">Fecha de ingreso</span>
                        <p className="font-medium text-gray-900">{format(admission.admissionDate, 'dd/MM/yyyy HH:mm')}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs uppercase">Médico responsable</span>
                        <p className="font-medium text-gray-900">{admission.admittingPhysician}</p>
                      </div>
                    </div>
                    
                    {/* Contacto de emergencia si existe */}
                    {patient?.emergencyContact?.name && (
                      <div className="mt-3 pt-3 border-t text-sm">
                        <span className="text-gray-500 text-xs uppercase">Contacto de emergencia: </span>
                        <span className="text-gray-900">
                          {patient.emergencyContact.name} ({patient.emergencyContact.relationship}) - {patient.emergencyContact.phone}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de Nueva Admisión */}
      <Dialog open={showNewAdmission} onOpenChange={setShowNewAdmission}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nueva Admisión Hospitalaria</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selección de paciente */}
            <div className="space-y-2">
              <Label htmlFor="patient">Paciente *</Label>
              <Select value={formData.patientId} onValueChange={(v) => setFormData({...formData, patientId: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar paciente" />
                </SelectTrigger>
                <SelectContent>
                  {availablePatients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName} - {patient.dni}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availablePatients.length === 0 && (
                <p className="text-sm text-amber-600">No hay pacientes disponibles para admisión</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Tipo de admisión */}
              <div className="space-y-2">
                <Label htmlFor="admissionType">Tipo de Admisión *</Label>
                <Select value={formData.admissionType} onValueChange={(v: any) => setFormData({...formData, admissionType: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Emergency">Emergencia</SelectItem>
                    <SelectItem value="Scheduled">Programada</SelectItem>
                    <SelectItem value="Transfer">Transferencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Prioridad */}
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridad *</Label>
                <Select value={formData.priority} onValueChange={(v: any) => setFormData({...formData, priority: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Baja</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="High">Alta</SelectItem>
                    <SelectItem value="Urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Médico responsable */}
            <div className="space-y-2">
              <Label htmlFor="physician">Médico Responsable *</Label>
              <Select value={formData.admittingPhysician} onValueChange={(v) => setFormData({...formData, admittingPhysician: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar médico" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map(doctor => (
                    <SelectItem key={doctor.id} value={`Dr. ${doctor.firstName} ${doctor.lastName}`}>
                      Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization || doctor.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Motivo de ingreso */}
            <div className="space-y-2">
              <Label htmlFor="reason">Motivo de Ingreso *</Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                placeholder="Describir el motivo de la admisión..."
                rows={3}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Habitación */}
              <div className="space-y-2">
                <Label htmlFor="room">Habitación (opcional)</Label>
                <Select value={formData.roomId} onValueChange={(v) => setFormData({...formData, roomId: v, bedId: ''})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar habitación" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map(room => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.number} - {room.department} ({room.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cama */}
              <div className="space-y-2">
                <Label htmlFor="bed">Cama (opcional)</Label>
                <Select value={formData.bedId} onValueChange={(v) => setFormData({...formData, bedId: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cama" />
                  </SelectTrigger>
                  <SelectContent>
                    {bedsInSelectedRoom.map(bed => {
                      const room = rooms.find(r => r.id === bed.roomId);
                      return (
                        <SelectItem key={bed.id} value={bed.id}>
                          Cama {bed.number} - Hab. {room?.number}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {bedsInSelectedRoom.length === 0 && (
                  <p className="text-sm text-amber-600">No hay camas disponibles</p>
                )}
              </div>
            </div>

            {/* Notas adicionales */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notas Adicionales</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Observaciones, antecedentes relevantes, etc."
                rows={2}
              />
            </div>

            <DialogFooter className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setShowNewAdmission(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Registrando...' : 'Registrar Admisión'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
