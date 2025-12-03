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
  const [physicianName, setPhysicianName] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!appointmentDate || !startTime || !patientId || !serviceId || !physicianName) {
        toast({
          title: "Error de validación",
          description: "Por favor completa todos los campos requeridos",
          variant: "destructive",
        });
        return;
      }

      const patient = patients.find(p => p.id === patientId);
      const service = services.find(s => s.id === serviceId);
      
      if (!patient || !service) {
        toast({
          title: "Error",
          description: "Paciente o servicio no encontrado",
          variant: "destructive",
        });
        return;
      }

      const [hours, minutes] = startTime.split(':').map(Number);
      const endTime = new Date(appointmentDate);
      endTime.setHours(hours + Math.floor(service.duration / 60), minutes + (service.duration % 60));

      const newAppointment = {
        patientId: patient.id,
        patientName: `${patient.firstName} ${patient.lastName}`,
        physicianId: 'physician-1', // En implementación real, sería seleccionable
        physicianName,
        serviceId: service.id,
        serviceName: service.name,
        date: appointmentDate,
        startTime,
        endTime: format(endTime, 'HH:mm'),
        duration: service.duration,
        status: 'Scheduled' as const,
        type: 'Consultation' as const,
        location: location || `Consulta - ${service.department}`,
        notes,
        priority,
        createdBy: 'current-user',
        createdAt: new Date(),
        estimatedCost: service.cost
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
      setPhysicianName('');
      setLocation('');
      setPriority('Medium');
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
              <Select value={serviceId} onValueChange={setServiceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar servicio" />
                </SelectTrigger>
                <SelectContent>
                  {services.map(service => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - {service.duration} min
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Fecha de la Cita *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {appointmentDate ? format(appointmentDate, 'dd/MM/yyyy', { locale: es }) : 'Seleccionar fecha'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={appointmentDate}
                    onSelect={setAppointmentDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
