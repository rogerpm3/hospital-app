'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useHospital } from '@/lib/hospital-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VitalSignsPanel from './vital-signs-panel';
import { 
  Activity, 
  Thermometer, 
  Heart, 
  Droplets,
  Pill,
  FileText,
  AlertTriangle,
  TrendingUp,
  Clock,
  Users,
  Plus,
  Stethoscope
} from 'lucide-react';

export default function NursingDashboard() {
  const { user } = useAuth();
  const { patients, vitalSigns, medications, nursingNotes } = useHospital();
  const [activeTab, setActiveTab] = useState('overview');

  // Pacientes asignados al enfermero actual (simulación)
  const assignedPatients = patients.filter(patient => patient.roomId); // Pacientes hospitalizados
  
  // Signos vitales recientes
  const recentVitalSigns = vitalSigns
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 10);

  // Medicaciones pendientes (simulación)
  const pendingMedications = medications.filter(med => med.status === 'Active').length;

  // Alertas críticas
  const criticalAlerts = vitalSigns.filter(vs => {
    // Criterios de alerta (simplificados)
    return (
      vs.bloodPressure.systolic > 160 || 
      vs.bloodPressure.systolic < 90 ||
      vs.heartRate > 100 || 
      vs.heartRate < 60 ||
      vs.oxygenSaturation < 95 ||
      vs.temperature > 38.5 || 
      vs.temperature < 35 ||
      (vs.painLevel && vs.painLevel > 7)
    );
  });

  // Notas de enfermería del turno actual
  const today = new Date();
  const todayNotes = nursingNotes.filter(note => 
    note.timestamp.toDateString() === today.toDateString()
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documentación de Enfermería</h1>
          <p className="text-muted-foreground">
            Gestiona cuidados de enfermería, signos vitales y medicaciones
          </p>
        </div>
      </div>

      {/* Cards de resumen */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Asignados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedPatients.length}</div>
            <p className="text-xs text-muted-foreground">
              En mi turno
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Críticas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              Requieren atención
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medicaciones Pendientes</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingMedications}</div>
            <p className="text-xs text-muted-foreground">
              Próximas 2 horas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notas del Turno</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayNotes.length}</div>
            <p className="text-xs text-muted-foreground">
              Registradas hoy
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas críticas */}
      {criticalAlerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas Críticas de Signos Vitales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {criticalAlerts.slice(0, 3).map(alert => {
                const patient = patients.find(p => p.id === alert.patientId);
                return (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <div>
                        <div className="font-medium text-red-800">
                          {patient?.firstName} {patient?.lastName} - Hab. {patient?.roomId}
                        </div>
                        <div className="text-sm text-red-600">
                          {alert.bloodPressure.systolic > 160 && 'Hipertensión severa'}
                          {alert.bloodPressure.systolic < 90 && 'Hipotensión'}
                          {alert.heartRate > 100 && 'Taquicardia'}
                          {alert.heartRate < 60 && 'Bradicardia'}
                          {alert.oxygenSaturation < 95 && 'Saturación baja O₂'}
                          {alert.temperature > 38.5 && 'Fiebre alta'}
                          {alert.temperature < 35 && 'Hipotermia'}
                          {alert.painLevel && alert.painLevel > 7 && 'Dolor severo'}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-red-600">
                      {alert.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pestañas principales */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="vital-signs" className="flex items-center gap-2">
            <Thermometer className="h-4 w-4" />
            Signos Vitales
          </TabsTrigger>
          <TabsTrigger value="medications" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            Medicaciones
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Notas
          </TabsTrigger>
          <TabsTrigger value="assessments" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Evaluaciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Lista de pacientes asignados */}
            <Card>
              <CardHeader>
                <CardTitle>Mis Pacientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assignedPatients.slice(0, 5).map(patient => {
                    const latestVitals = vitalSigns
                      .filter(vs => vs.patientId === patient.id)
                      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
                    
                    return (
                      <div key={patient.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">
                            {patient.firstName} {patient.lastName}
                          </div>
                          <Badge 
                            variant={
                              patient.currentCondition === 'Critical' ? 'destructive' :
                              patient.currentCondition === 'Serious' ? 'outline' : 'secondary'
                            }
                          >
                            {patient.currentCondition}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          Habitación {patient.roomId} • {patient.attendingPhysician}
                        </div>
                        {latestVitals && (
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="flex items-center gap-1">
                              <Heart className="h-3 w-3 text-red-500" />
                              <span>{latestVitals.heartRate} bpm</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Thermometer className="h-3 w-3 text-blue-500" />
                              <span>{latestVitals.temperature}°C</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Activity className="h-3 w-3 text-green-500" />
                              <span>{latestVitals.oxygenSaturation}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Próximas medicaciones */}
            <Card>
              <CardHeader>
                <CardTitle>Próximas Medicaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {medications.filter(med => med.status === 'Active').slice(0, 5).map(medication => {
                    const patient = patients.find(p => p.id === medication.patientId);
                    return (
                      <div key={medication.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{medication.name}</div>
                          <Badge variant="outline">{medication.dosage}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {patient?.firstName} {patient?.lastName} - Hab. {patient?.roomId}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {medication.frequency} • {medication.route}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vital-signs" className="space-y-4">
          <VitalSignsPanel />
        </TabsContent>

        <TabsContent value="medications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Administración de Medicamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medications.filter(med => med.status === 'Active').map(medication => {
                  const patient = patients.find(p => p.id === medication.patientId);
                  return (
                    <div key={medication.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{medication.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {patient?.firstName} {patient?.lastName} - Habitación {patient?.roomId}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{medication.dosage}</div>
                          <div className="text-sm text-muted-foreground">{medication.frequency}</div>
                        </div>
                      </div>
                      <div className="grid gap-2 md:grid-cols-3 text-sm">
                        <div>
                          <span className="font-medium">Vía:</span> {medication.route}
                        </div>
                        <div>
                          <span className="font-medium">Prescrito por:</span> {medication.prescribedBy}
                        </div>
                        <div>
                          <span className="font-medium">Inicio:</span> {medication.startDate.toLocaleDateString()}
                        </div>
                      </div>
                      {medication.instructions && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          <span className="font-medium">Instrucciones:</span> {medication.instructions}
                        </div>
                      )}
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" className="flex items-center gap-2">
                          <Plus className="h-3 w-3" />
                          Administrar
                        </Button>
                        <Button size="sm" variant="outline">
                          Ver Historial
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Notas de Enfermería</CardTitle>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nueva Nota
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nursingNotes.map(note => {
                  const patient = patients.find(p => p.id === note.patientId);
                  return (
                    <div key={note.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">
                            {patient?.firstName} {patient?.lastName} - Habitación {patient?.roomId}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {note.nurseName} • {note.timestamp.toLocaleString()} • Turno {note.shift}
                          </p>
                        </div>
                        <Badge variant="outline">{note.category}</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Subjetivo:</span> {note.subjective}
                        </div>
                        <div>
                          <span className="font-medium">Objetivo:</span> {note.objective}
                        </div>
                        <div>
                          <span className="font-medium">Plan:</span> {note.plan}
                        </div>
                      </div>
                      {note.flaggedForPhysician && (
                        <div className="mt-2">
                          <Badge variant="destructive">Marcado para médico</Badge>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evaluaciones Clínicas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Balance Hídrico</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Control de ingresos y egresos de líquidos
                  </p>
                  <Button size="sm" className="w-full">
                    Registrar Balance
                  </Button>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Escalas Clínicas</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Glasgow, Braden, Morse, Dolor, etc.
                  </p>
                  <Button size="sm" className="w-full">
                    Nueva Evaluación
                  </Button>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Evaluación de Heridas</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Valoración y seguimiento de heridas
                  </p>
                  <Button size="sm" className="w-full">
                    Evaluar Heridas
                  </Button>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
