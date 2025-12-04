'use client';

import { useState } from 'react';
import { useHospital } from '@/lib/hospital-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppointmentDetailsDialog from './appointment-details-dialog';
import { Search, Filter, Eye, Edit, Calendar, XCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AppointmentList() {
  const { appointments, cancelAppointment, deleteAppointment } = useHospital();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = searchTerm === '' || 
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.physicianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por paciente, médico o servicio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="Scheduled">Programada</SelectItem>
                <SelectItem value="Confirmed">Confirmada</SelectItem>
                <SelectItem value="In Progress">En Progreso</SelectItem>
                <SelectItem value="Completed">Completada</SelectItem>
                <SelectItem value="Cancelled">Cancelada</SelectItem>
                <SelectItem value="No Show">No Show</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de citas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Citas ({filteredAppointments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha y Hora</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Médico</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map(appointment => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{appointment.date.toLocaleDateString()}</div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.startTime} - {appointment.endTime}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{appointment.patientName}</div>
                      <div className="text-sm text-muted-foreground">{appointment.type}</div>
                    </div>
                  </TableCell>
                  <TableCell>{appointment.physicianName}</TableCell>
                  <TableCell>{appointment.serviceName}</TableCell>
                  <TableCell>
                    <Badge variant={
                      appointment.status === 'Completed' ? 'default' :
                      appointment.status === 'In Progress' ? 'outline' :
                      appointment.status === 'Confirmed' ? 'secondary' :
                      appointment.status === 'Cancelled' ? 'destructive' : 'outline'
                    }>
                      {appointment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      appointment.priority === 'Urgent' ? 'destructive' :
                      appointment.priority === 'High' ? 'outline' : 'secondary'
                    }>
                      {appointment.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedAppointment(appointment.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {appointment.status !== 'Cancelled' && appointment.status !== 'Completed' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-orange-500 hover:text-orange-600"
                          onClick={() => {
                            const reason = prompt('Motivo de cancelación:');
                            if (reason) {
                              cancelAppointment(appointment.id, reason);
                              toast({
                                title: "Cita cancelada",
                                description: "La cita ha sido cancelada correctamente",
                              });
                            }
                          }}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm(`¿Estás seguro de eliminar esta cita de ${appointment.patientName}?`)) {
                            deleteAppointment(appointment.id);
                            toast({
                              title: "Cita eliminada",
                              description: "La cita ha sido eliminada correctamente",
                            });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AppointmentDetailsDialog
        appointmentId={selectedAppointment}
        open={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />
    </div>
  );
}
