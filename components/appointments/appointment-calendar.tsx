'use client';

import { useState } from 'react';
import { useHospital } from '@/lib/hospital-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarDays, Clock, Users } from 'lucide-react';

export default function AppointmentCalendar() {
  const { appointments } = useHospital();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const selectedDateAppointments = appointments.filter(apt =>
    selectedDate && apt.date.toDateString() === selectedDate.toDateString()
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Calendario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={es}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Citas para {selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: es }) : 'Selecciona una fecha'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateAppointments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay citas programadas para esta fecha.
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDateAppointments
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map(appointment => (
                  <div key={appointment.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">
                        {appointment.startTime} - {appointment.endTime}
                      </div>
                      <Badge variant={
                        appointment.status === 'Completed' ? 'default' :
                        appointment.status === 'In Progress' ? 'outline' :
                        appointment.status === 'Confirmed' ? 'secondary' : 'outline'
                      }>
                        {appointment.status}
                      </Badge>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">{appointment.patientName}</div>
                      <div className="text-muted-foreground">
                        {appointment.serviceName} • {appointment.physicianName}
                      </div>
                      <div className="text-muted-foreground">
                        {appointment.location}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
