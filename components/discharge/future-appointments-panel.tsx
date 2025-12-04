'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Calendar, Clock, Plus, MapPin, Stethoscope, 
  TestTube, Activity, Heart, Pill
} from 'lucide-react';
import { FutureAppointment } from '@/lib/types';
import { useHospital } from '@/lib/hospital-context';

interface FutureAppointmentsPanelProps {
  appointments: FutureAppointment[];
  onScheduleAppointment: (patientId: string, appointmentData: any) => void;
}

export default function FutureAppointmentsPanel({ 
  appointments, 
  onScheduleAppointment 
}: FutureAppointmentsPanelProps) {
  const { patients } = useHospital();
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patientId: '',
    type: 'Lab Test' as FutureAppointment['type'],
    description: '',
    scheduledDate: '',
    provider: '',
    location: '',
    instructions: '',
    reminderDays: [7, 1] // 7 días y 1 día antes
  });

  const getTypeIcon = (type: FutureAppointment['type']) => {
    switch (type) {
      case 'Lab Test': return <TestTube className="h-4 w-4" />;
      case 'Follow-up Consultation': return <Stethoscope className="h-4 w-4" />;
      case 'Procedure': return <Activity className="h-4 w-4" />;
      case 'Imaging': return <Heart className="h-4 w-4" />;
      case 'Therapy': return <Pill className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: FutureAppointment['type']) => {
    switch (type) {
      case 'Lab Test': return 'bg-blue-100 text-blue-800';
      case 'Follow-up Consultation': return 'bg-green-100 text-green-800';
      case 'Procedure': return 'bg-red-100 text-red-800';
      case 'Imaging': return 'bg-purple-100 text-purple-800';
      case 'Therapy': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Agrupar citas por paciente
  const appointmentsByPatient = appointments.reduce((acc, appointment) => {
    if (!acc[appointment.patientId]) {
      acc[appointment.patientId] = [];
    }
    acc[appointment.patientId].push(appointment);
    return acc;
  }, {} as Record<string, FutureAppointment[]>);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Citas Futuras Post-Alta</h2>
        <Dialog open={showNewAppointmentDialog} onOpenChange={setShowNewAppointmentDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Programar Cita Futura
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nueva Cita de Seguimiento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Paciente</label>
                <select 
                  className="w-full mt-1 p-2 border rounded-md"
                  value={newAppointment.patientId}
                  onChange={(e) => setNewAppointment({...newAppointment, patientId: e.target.value})}
                >
                  <option value="">Seleccionar paciente</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Tipo de Cita</label>
                <select 
                  className="w-full mt-1 p-2 border rounded-md"
                  value={newAppointment.type}
                  onChange={(e) => setNewAppointment({...newAppointment, type: e.target.value as FutureAppointment['type']})}
                >
                  <option value="Lab Test">Análisis de Laboratorio</option>
                  <option value="Follow-up Consultation">Consulta de Seguimiento</option>
                  <option value="Procedure">Procedimiento</option>
                  <option value="Imaging">Estudios de Imagen</option>
                  <option value="Therapy">Terapia</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Descripción</label>
                <Input
                  placeholder="ej: Control post-operatorio"
                  value={newAppointment.description}
                  onChange={(e) => setNewAppointment({...newAppointment, description: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Fecha Programada</label>
                <Input
                  type="date"
                  value={newAppointment.scheduledDate}
                  onChange={(e) => setNewAppointment({...newAppointment, scheduledDate: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Proveedor</label>
                <Input
                  placeholder="Dr. Ana García"
                  value={newAppointment.provider}
                  onChange={(e) => setNewAppointment({...newAppointment, provider: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Ubicación</label>
                <Input
                  placeholder="Consulta Cardiología - Planta 2"
                  value={newAppointment.location}
                  onChange={(e) => setNewAppointment({...newAppointment, location: e.target.value})}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowNewAppointmentDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => {
                  if (newAppointment.patientId && newAppointment.scheduledDate) {
                    onScheduleAppointment(newAppointment.patientId, {
                      ...newAppointment,
                      scheduledDate: new Date(newAppointment.scheduledDate)
                    });
                    setShowNewAppointmentDialog(false);
                    setNewAppointment({
                      patientId: '',
                      type: 'Lab Test',
                      description: '',
                      scheduledDate: '',
                      provider: '',
                      location: '',
                      instructions: '',
                      reminderDays: [7, 1]
                    });
                  }
                }}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Programar Cita
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{appointments.length}</div>
            <p className="text-xs text-muted-foreground">Total citas futuras</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {appointments.filter(a => a.type === 'Lab Test').length}
            </div>
            <p className="text-xs text-muted-foreground">Análisis pendientes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {appointments.filter(a => a.type === 'Follow-up Consultation').length}
            </div>
            <p className="text-xs text-muted-foreground">Consultas seguimiento</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {Object.keys(appointmentsByPatient).length}
            </div>
            <p className="text-xs text-muted-foreground">Pacientes con citas</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de citas por paciente */}
      <div className="space-y-4">
        {Object.entries(appointmentsByPatient).map(([patientId, patientAppointments]) => {
          const patient = patients.find(p => p.id === patientId);
          if (!patient) return null;
          
          return (
            <Card key={patientId}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{patient.firstName} {patient.lastName}</span>
                  <Badge variant="outline">
                    {patientAppointments.length} cita{patientAppointments.length !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patientAppointments
                    .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
                    .map(appointment => (
                    <div key={appointment.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`p-1 rounded ${getTypeColor(appointment.type)}`}>
                            {getTypeIcon(appointment.type)}
                          </div>
                          <div>
                            <div className="font-medium">{appointment.description}</div>
                            <div className="text-sm text-muted-foreground">
                              {appointment.type} • {appointment.provider}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {appointment.scheduledDate.toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {appointment.location}
                          </div>
                        </div>
                      </div>
                      
                      {appointment.instructions && (
                        <div className="text-xs bg-blue-50 p-2 rounded border-l-4 border-blue-200">
                          <strong>Instrucciones:</strong> {appointment.instructions}
                        </div>
                      )}
                      
                      {/* Recordatorios */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            Recordatorios: {appointment.reminderDays.map(d => `${d} día${d !== 1 ? 's' : ''}`).join(', ')} antes
                          </span>
                        </div>
                        
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                            Editar
                          </Button>
                          <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                            Notificar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {appointments.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay citas futuras programadas</p>
            <p className="text-sm text-muted-foreground">
              Las citas de seguimiento aparecerán aquí una vez programadas
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
