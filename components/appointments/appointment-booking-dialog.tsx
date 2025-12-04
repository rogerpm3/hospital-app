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
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AppointmentBookingDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AppointmentBookingDialog({ open, onClose }: AppointmentBookingDialogProps) {
  const { patients, services, addAppointment } = useHospital();
  const { toast } = useToast();

  const [appointmentDate, setAppointmentDate] = useState<Date>();
  const [startTime, setStartTime] = useState('');
  const [patientId, setPatientId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [customService, setCustomService] = useState('');
  const [physicianName, setPhysicianName] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium');
  const [duration, setDuration] = useState(30);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const isCustomService = serviceId === 'custom';
      
      if (!appointmentDate || !startTime || !patientId || !physicianName) {
        toast({
          title: "Error de validación",
          description: "Por favor completa todos los campos requeridos",
          variant: "destructive",
        });
        return;
      }

      if (!isCustomService && !serviceId) {
        toast({
          title: "Error de validación",
          description: "Por favor selecciona un servicio",
          variant: "destructive",
        });
        return;
      }

      if (isCustomService && !customService) {
        toast({
          title: "Error de validación",
          description: "Por favor especifica el nombre del servicio",
          variant: "destructive",
        });
        return;
      }

      const patient = patients.find(p => p.id === patientId);
      const service = !isCustomService ? services.find(s => s.id === serviceId) : null;
      
      if (!patient) {
        toast({
          title: "Error",
          description: "Paciente no encontrado",
          variant: "destructive",
        });
        return;
      }

      const [hours, minutes] = startTime.split(':').map(Number);
      const appointmentDuration = service?.duration || duration;
      const endTime = new Date(appointmentDate);
      endTime.setHours(hours + Math.floor(appointmentDuration / 60), minutes + (appointmentDuration % 60));

      const newAppointment = {
        patientId: patient.id,
        patientName: `${patient.firstName} ${patient.lastName}`,
        physicianId: 'physician-1',
        physicianName,
        serviceId: isCustomService ? 'custom' : (service?.id || ''),
        serviceName: isCustomService ? customService : (service?.name || ''),
        date: appointmentDate,
        startTime,
        endTime: format(endTime, 'HH:mm'),
        duration: appointmentDuration,
        status: 'Scheduled' as const,
        type: 'Consultation' as const,
        location: location || (service ? `Consulta - ${service.department}` : 'Consulta'),
        notes,
        priority,
        createdBy: 'current-user',
        createdAt: new Date(),
        estimatedCost: service?.cost || 0
      };

      addAppointment(newAppointment);

      toast({
        title: "Cita programada exitosamente",
        description: `Cita creada para ${patient.firstName} ${patient.lastName} el ${format(appointmentDate, 'dd/MM/yyyy', { locale: es })}`,
      });

      // Limpiar formulario
      setAppointmentDate(undefined);
      setStartTime('');
      setPatientId('');
      setServiceId('');
      setCustomService('');
      setPhysicianName('');
      setLocation('');
      setPriority('Medium');
      setDuration(30);
      setNotes('');
      onClose();

    } catch (error) {
      toast({
        title: "Error al programar cita",
        description: "No se pudo crear la cita. Por favor intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Programar Nueva Cita</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="patient">Paciente *</Label>
              <Select value={patientId} onValueChange={setPatientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar paciente" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName} - {patient.dni}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">Servicio *</Label>
              <Select value={serviceId} onValueChange={(value) => {
                setServiceId(value);
                if (value !== 'custom') {
                  const service = services.find(s => s.id === value);
                  if (service) setDuration(service.duration);
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar servicio" />
                </SelectTrigger>
                <SelectContent>
                  {services.map(service => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - {service.duration} min
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Otro (especificar)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {serviceId === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="customService">Nombre del Servicio Personalizado *</Label>
              <Input
                id="customService"
                value={customService}
                onChange={(e) => setCustomService(e.target.value)}
                placeholder="Escribir nombre del servicio"
                required
              />
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="appointment-date">Fecha de la Cita *</Label>
              <Input
                id="appointment-date"
                type="date"
                value={appointmentDate ? format(appointmentDate, 'yyyy-MM-dd') : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    setAppointmentDate(new Date(e.target.value));
                  }
                }}
                min={format(new Date(), 'yyyy-MM-dd')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-time">Hora de Inicio *</Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duración *</Label>
              <Select value={duration.toString()} onValueChange={(v) => setDuration(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 min</SelectItem>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="45">45 min</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                  <SelectItem value="90">1h 30min</SelectItem>
                  <SelectItem value="120">2 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="physician">Médico *</Label>
              <Input
                id="physician"
                value={physicianName}
                onChange={(e) => setPhysicianName(e.target.value)}
                placeholder="Nombre del médico"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad</Label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Baja</SelectItem>
                  <SelectItem value="Medium">Media</SelectItem>
                  <SelectItem value="High">Alta</SelectItem>
                  <SelectItem value="Urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Ubicación</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Consulta, sala de procedimientos, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas adicionales, instrucciones especiales..."
              rows={3}
            />
          </div>

          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creando...' : 'Programar Cita'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
