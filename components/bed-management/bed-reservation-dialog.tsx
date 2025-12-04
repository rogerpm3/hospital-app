'use client';

import { useState } from 'react';
import { useHospital } from '@/lib/hospital-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';
import { CalendarIcon, Clock, User, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface BedReservationDialogProps {
  open: boolean;
  onClose: () => void;
  bedId: string;
}

export default function BedReservationDialog({ open, onClose, bedId }: BedReservationDialogProps) {
  const { beds, rooms, patients, updateBedStatus } = useHospital();
  const { user } = useAuth();
  const { toast } = useToast();

  const [reservationDate, setReservationDate] = useState<Date>();
  const [reservationTime, setReservationTime] = useState('');
  const [duration, setDuration] = useState('24'); // horas
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientDni, setPatientDni] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [reservationType, setReservationType] = useState<'existing' | 'new'>('existing');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Obtener información de la cama
  const bed = beds.find(b => b.id === bedId);
  const room = bed ? rooms.find(r => r.id === bed.roomId) : null;

  // Obtener pacientes disponibles (no hospitalizados actualmente)
  const availablePatients = patients.filter(p => !p.roomId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validaciones
      if (!reservationDate || !reservationTime) {
        toast({
          title: "Error de validación",
          description: "Por favor selecciona fecha y hora de la reserva",
          variant: "destructive",
        });
        return;
      }

      if (reservationType === 'existing' && !patientId) {
        toast({
          title: "Error de validación",
          description: "Por favor selecciona un paciente",
          variant: "destructive",
        });
        return;
      }

      if (reservationType === 'new' && (!patientName || !patientDni)) {
        toast({
          title: "Error de validación",
          description: "Por favor ingresa nombre y DNI del paciente",
          variant: "destructive",
        });
        return;
      }

      // Crear fecha y hora de expiración
      const [hours, minutes] = reservationTime.split(':').map(Number);
      const reservationDateTime = new Date(reservationDate);
      reservationDateTime.setHours(hours, minutes, 0, 0);
      
      const expirationDate = new Date(reservationDateTime);
      expirationDate.setHours(expirationDate.getHours() + parseInt(duration));

      // Preparar información del paciente
      const patientInfo = reservationType === 'existing' 
        ? patients.find(p => p.id === patientId)
        : { firstName: patientName.split(' ')[0], lastName: patientName.split(' ').slice(1).join(' '), dni: patientDni };

      // Crear objeto de reserva
      const reservationData = {
        status: 'Reserved' as const,
        reservationExpires: expirationDate,
        reservedFor: {
          patientId: reservationType === 'existing' ? patientId : `temp-${Date.now()}`,
          patientName: reservationType === 'existing' 
            ? `${patientInfo?.firstName} ${patientInfo?.lastName}`
            : patientName,
          patientDni: reservationType === 'existing' ? patientInfo?.dni : patientDni,
          reason: reason,
          reservationType: reservationType
        },
        notes: `Reservada para: ${reservationType === 'existing' 
          ? `${patientInfo?.firstName} ${patientInfo?.lastName}`
          : patientName
        }${reason ? ` - Motivo: ${reason}` : ''}${notes ? ` - Notas: ${notes}` : ''}`,
        reservationDate: reservationDateTime,
        reservedBy: user?.firstName + ' ' + user?.lastName || 'Usuario'
      };

      // Actualizar estado de la cama con todos los datos
      updateBedStatus(bedId, 'Reserved', reservationData);

      toast({
        title: "Reserva creada exitosamente",
        description: `La cama ha sido reservada hasta ${format(expirationDate, 'dd/MM/yyyy HH:mm', { locale: es })}`,
      });

      // Limpiar formulario y cerrar
      setReservationDate(undefined);
      setReservationTime('');
      setDuration('24');
      setPatientId('');
      setPatientName('');
      setPatientDni('');
      setReason('');
      setNotes('');
      setReservationType('existing');
      onClose();

    } catch (error) {
      toast({
        title: "Error al crear reserva",
        description: "No se pudo crear la reserva. Por favor intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Limpiar formulario
    setReservationDate(undefined);
    setReservationTime('');
    setDuration('24');
    setPatientId('');
    setPatientName('');
    setPatientDni('');
    setReason('');
    setNotes('');
    setReservationType('existing');
    onClose();
  };

  if (!bed || !room) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Reservar Cama - Habitación {room.number} - Cama {bed.number}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información de la cama */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Información de la Cama</h4>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span>Habitación:</span>
                <span className="font-medium">{room.number}</span>
              </div>
              <div className="flex justify-between">
                <span>Departamento:</span>
                <span>{room.department}</span>
              </div>
              <div className="flex justify-between">
                <span>Tipo:</span>
                <span>{room.type}</span>
              </div>
              <div className="flex justify-between">
                <span>Estado actual:</span>
                <span className="text-green-600">{bed.status}</span>
              </div>
            </div>
          </div>

          {/* Fecha y hora de reserva */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="reservation-date">Fecha de Reserva *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {reservationDate ? format(reservationDate, 'dd/MM/yyyy', { locale: es }) : 'Seleccionar fecha'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={reservationDate}
                    onSelect={setReservationDate}
                    disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reservation-time">Hora de Reserva *</Label>
              <Input
                id="reservation-time"
                type="time"
                value={reservationTime}
                onChange={(e) => setReservationTime(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Duración */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duración de la Reserva</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar duración" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hora</SelectItem>
                <SelectItem value="2">2 horas</SelectItem>
                <SelectItem value="4">4 horas</SelectItem>
                <SelectItem value="8">8 horas</SelectItem>
                <SelectItem value="12">12 horas</SelectItem>
                <SelectItem value="24">24 horas</SelectItem>
                <SelectItem value="48">48 horas</SelectItem>
                <SelectItem value="72">72 horas</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              La reserva expirará automáticamente después de este tiempo
            </p>
          </div>

          {/* Tipo de reserva */}
          <div className="space-y-4">
            <Label>Tipo de Reserva</Label>
            <div className="grid gap-4 md:grid-cols-2">
              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  reservationType === 'existing' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setReservationType('existing')}
              >
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">Paciente Existente</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Reservar para un paciente ya registrado en el sistema
                </p>
              </div>

              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  reservationType === 'new' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setReservationType('new')}
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">Nuevo Paciente</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Reservar para un paciente que será admitido próximamente
                </p>
              </div>
            </div>
          </div>

          {/* Selección de paciente existente */}
          {reservationType === 'existing' && (
            <div className="space-y-2">
              <Label htmlFor="patient-select">Seleccionar Paciente *</Label>
              <Select value={patientId} onValueChange={setPatientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Buscar y seleccionar paciente" />
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
                <p className="text-sm text-muted-foreground">
                  No hay pacientes disponibles (sin habitación asignada)
                </p>
              )}
            </div>
          )}

          {/* Datos de nuevo paciente */}
          {reservationType === 'new' && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="patient-name">Nombre Completo del Paciente *</Label>
                <Input
                  id="patient-name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Nombre y apellidos"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-dni">DNI del Paciente *</Label>
                <Input
                  id="patient-dni"
                  value={patientDni}
                  onChange={(e) => setPatientDni(e.target.value)}
                  placeholder="12345678A"
                  required
                />
              </div>
            </div>
          )}

          {/* Motivo de la reserva */}
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo de la Reserva</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar motivo (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned_admission">Ingreso Programado</SelectItem>
                <SelectItem value="surgery">Cirugía Programada</SelectItem>
                <SelectItem value="transfer">Transferencia de Otro Centro</SelectItem>
                <SelectItem value="emergency_expected">Emergencia Esperada</SelectItem>
                <SelectItem value="procedure">Procedimiento Médico</SelectItem>
                <SelectItem value="observation">Observación Post-procedimiento</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notas adicionales */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas Adicionales</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Información adicional, requerimientos especiales, etc."
              rows={3}
            />
          </div>

          {/* Información de expiración */}
          {reservationDate && reservationTime && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">Información de la Reserva</span>
              </div>
              <div className="text-sm text-blue-700">
                <p>
                  <strong>Inicio:</strong> {format(new Date(reservationDate.getTime() + (parseInt(reservationTime.split(':')[0]) * 60 + parseInt(reservationTime.split(':')[1])) * 60000), 'dd/MM/yyyy HH:mm', { locale: es })}
                </p>
                <p>
                  <strong>Expiración:</strong> {format(new Date(reservationDate.getTime() + (parseInt(reservationTime.split(':')[0]) * 60 + parseInt(reservationTime.split(':')[1])) * 60000 + parseInt(duration) * 60 * 60 * 1000), 'dd/MM/yyyy HH:mm', { locale: es })}
                </p>
                <p className="text-xs mt-1">
                  La cama se liberará automáticamente si no se utiliza antes de la expiración
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-white" />
                  Creando...
                </>
              ) : (
                <>
                  <CalendarIcon className="h-4 w-4" />
                  Crear Reserva
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
