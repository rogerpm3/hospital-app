'use client';

import { useHospital } from '@/lib/hospital-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Users, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export default function AdmissionsDashboard() {
  const { admissions, patients, rooms } = useHospital();

  const activeAdmissions = admissions.filter(adm => adm.status === 'Active');
  const todayAdmissions = admissions.filter(adm => 
    adm.admissionDate.toDateString() === new Date().toDateString()
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Admisiones</h1>
          <p className="text-muted-foreground">Control de ingresos hospitalarios</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Admisión
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
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
            <CardTitle className="text-sm font-medium">Ocupación</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round((activeAdmissions.length / rooms.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Capacidad utilizada</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admisiones Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {admissions.slice(0, 10).map(admission => {
              const patient = patients.find(p => p.id === admission.patientId);
              const room = rooms.find(r => r.id === admission.roomId);
              return (
                <div key={admission.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">
                      {patient?.firstName} {patient?.lastName}
                    </div>
                    <Badge variant={
                      admission.status === 'Active' ? 'default' : 'secondary'
                    }>
                      {admission.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {admission.reason} • Habitación {room?.number} • {admission.admissionDate.toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Médico: {admission.admittingPhysician}
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
