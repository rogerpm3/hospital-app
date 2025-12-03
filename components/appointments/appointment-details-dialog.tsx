'use client';

import { useHospital } from '@/lib/hospital-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Clock, MapPin, User, Stethoscope, FileText } from 'lucide-react';

interface AppointmentDetailsDialogProps {
  appointmentId: string | null;
  open: boolean;
  onClose: () => void;
}

export default function AppointmentDetailsDialog({ appointmentId, open, onClose }: AppointmentDetailsDialogProps) {
  const { appointments, patients, services } = useHospital();
  
  const appointment = appointments.find(apt => apt.id === appointmentId);
  const patient = appointment ? patients.find(p => p.id === appointment.patientId) : null;
  const service = appointment ? services.find(s => s.id === appointment.serviceId) : null;

  if (!appointment) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Detalles de la Cita
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información básica */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Paciente</div>
                  <div className="text-sm text-muted-foreground">{appointment.patientName}</div>
                  {patient && (
                    <div className="text-xs text-muted-foreground">{patient.dni}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Médico</div>
                  <div className="text-sm text-muted-foreground">{appointment.physicianName}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Servicio</div>
                  <div className="text-sm text-muted-foreground">{appointment.serviceName}</div>
                  <div className="text-xs text-muted-foreground">{service?.department}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Fecha</div>
                  <div className="text-sm text-muted-foreground">
                    {appointment.date.toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Horario</div>
                  <div className="text-sm text-muted-foreground">
                    {appointment.startTime} - {appointment.endTime}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {appointment.duration} minutos
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Ubicación</div>
                  <div className="text-sm text-muted-foreground">{appointment.location}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Estado y prioridad */}
          <div className="flex items-center gap-4">
            <div>
              <div className="text-sm font-medium mb-1">Estado</div>
              <Badge variant={
                appointment.status === 'Completed' ? 'default' :
                appointment.status === 'In Progress' ? 'outline' :
                appointment.status === 'Confirmed' ? 'secondary' :
                appointment.status === 'Cancelled' ? 'destructive' : 'outline'
              }>
                {appointment.status}
              </Badge>
            </div>

            <div>
              <div className="text-sm font-medium mb-1">Prioridad</div>
              <Badge variant={
                appointment.priority === 'Urgent' ? 'destructive' :
                appointment.priority === 'High' ? 'outline' : 'secondary'
              }>
                {appointment.priority}
              </Badge>
            </div>

            <div>
              <div className="text-sm font-medium mb-1">Tipo</div>
              <Badge variant="outline">{appointment.type}</Badge>
            </div>
          </div>

          {/* Información adicional */}
          {appointment.notes && (
            <div>
              <div className="font-medium mb-2">Notas</div>
              <div className="bg-gray-50 p-3 rounded-lg text-sm">
                {appointment.notes}
              </div>
            </div>
          )}

          {appointment.estimatedCost && (
            <div>
              <div className="font-medium mb-2">Costo Estimado</div>
              <div className="text-lg font-semibold text-green-600">
                €{appointment.estimatedCost.toFixed(2)}
              </div>
            </div>
          )}

          {/* Información del paciente (si está disponible) */}
          {patient && (
            <div className="border-t pt-4">
              <div className="font-medium mb-3">Información del Paciente</div>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Teléfono:</span>
                  <span>{patient.phone}</span>
                </div>
                {patient.email && (
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span>{patient.email}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Fecha de nacimiento:</span>
                  <span>{patient.dateOfBirth.toLocaleDateString()}</span>
                </div>
                {patient.allergies.length > 0 && (
                  <div className="flex justify-between">
                    <span>Alergias:</span>
                    <span className="text-red-600">{patient.allergies.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
            {appointment.status === 'Scheduled' && (
              <Button>
                Confirmar Cita
              </Button>
            )}
            {appointment.status === 'Confirmed' && (
              <Button>
                Iniciar Consulta
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
