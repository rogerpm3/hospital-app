'use client';

import { useHospital } from '@/lib/hospital-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Users, Route, FileText } from 'lucide-react';

export default function RoundsDashboard() {
  const { patients, medicalEvolutions } = useHospital();
  
  const hospitalizedPatients = patients.filter(p => p.roomId);
  const todayEvolutions = medicalEvolutions.filter(evolution => 
    evolution.date.toDateString() === new Date().toDateString()
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rondas y Evolución Médica</h1>
          <p className="text-muted-foreground">Seguimiento clínico de pacientes</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Evolución
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes en Ronda</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hospitalizedPatients.length}</div>
            <p className="text-xs text-muted-foreground">Para evaluar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evoluciones Hoy</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{todayEvolutions.length}</div>
            <p className="text-xs text-muted-foreground">Registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {hospitalizedPatients.length - todayEvolutions.length}
            </div>
            <p className="text-xs text-muted-foreground">Sin evolución</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes para Ronda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hospitalizedPatients.map(patient => {
              const hasEvolutionToday = todayEvolutions.some(ev => ev.patientId === patient.id);
              return (
                <div key={patient.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">
                      {patient.firstName} {patient.lastName}
                    </div>
                    <Badge variant={hasEvolutionToday ? 'default' : 'secondary'}>
                      {hasEvolutionToday ? 'Evaluado' : 'Pendiente'}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Habitación {patient.roomId} • {patient.attendingPhysician} • {patient.currentCondition}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
