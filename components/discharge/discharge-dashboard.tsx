'use client';

import { useHospital } from '@/lib/hospital-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, FileText, CheckCircle, Clock, Users } from 'lucide-react';

export default function DischargeDashboard() {
  const { patients, dischargeChecklists } = useHospital();
  
  const hospitalizedPatients = patients.filter(p => p.roomId);
  const pendingDischarges = dischargeChecklists.filter(dc => dc.status === 'In Progress');
  const readyForDischarge = dischargeChecklists.filter(dc => dc.status === 'Ready');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Altas Hospitalarias</h1>
          <p className="text-muted-foreground">Planificación y proceso de alta</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Plan de Alta
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Hospitalizados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hospitalizedPatients.length}</div>
            <p className="text-xs text-muted-foreground">Total activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Altas en Proceso</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingDischarges.length}</div>
            <p className="text-xs text-muted-foreground">En planificación</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listos para Alta</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{readyForDischarge.length}</div>
            <p className="text-xs text-muted-foreground">Completados</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Planes de Alta Activos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dischargeChecklists.map(checklist => {
              const patient = patients.find(p => p.id === checklist.patientId);
              return (
                <div key={checklist.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">
                      {patient?.firstName} {patient?.lastName}
                    </div>
                    <Badge variant={
                      checklist.status === 'Ready' ? 'default' : 
                      checklist.status === 'In Progress' ? 'outline' : 'secondary'
                    }>
                      {checklist.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Fecha esperada: {checklist.expectedDischargeDate.toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Habitación {patient?.roomId}
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
