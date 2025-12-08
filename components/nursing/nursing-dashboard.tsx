'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useHospital } from '@/lib/hospital-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import VitalSignsPanel from './vital-signs-panel';
import MedicationAdministrationPanel from './medication-administration-panel';
import NursingNotesPanel from './nursing-notes-panel';
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
  Stethoscope,
  Scale,
  Bandage
} from 'lucide-react';

export default function NursingDashboard() {
  const { user } = useAuth();
  const { patients, vitalSigns, medications, nursingNotes, getFilteredPatients } = useHospital();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Estados para diálogos de evaluaciones
  const [showBalanceDialog, setShowBalanceDialog] = useState(false);
  const [showScaleDialog, setShowScaleDialog] = useState(false);
  const [showWoundDialog, setShowWoundDialog] = useState(false);
  const [selectedPatientForEval, setSelectedPatientForEval] = useState('');

  // Obtener pacientes filtrados según rol del usuario (asignados a enfermería)
  const filteredPatients = getFilteredPatients();
  
  // Pacientes hospitalizados (con habitación asignada)
  const assignedPatients = filteredPatients.filter(patient => patient.roomId);
  
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
          <MedicationAdministrationPanel />
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <NursingNotesPanel />
        </TabsContent>

        <TabsContent value="assessments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Evaluaciones Clínicas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Balance Hídrico */}
                <Card className="p-4 border-l-4 border-l-blue-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Balance Hídrico</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Control de ingresos y egresos de líquidos
                  </p>
                  <Dialog open={showBalanceDialog} onOpenChange={setShowBalanceDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="w-full">
                        <Droplets className="h-4 w-4 mr-2" />
                        Registrar Balance
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="text-gray-900">Registrar Balance Hídrico</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-gray-900">Paciente *</Label>
                          <Select value={selectedPatientForEval} onValueChange={setSelectedPatientForEval}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar paciente" />
                            </SelectTrigger>
                            <SelectContent>
                              {assignedPatients.map(p => (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.firstName} {p.lastName} - Hab. {p.roomId}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-gray-900">Ingresos (ml)</Label>
                            <Input type="number" placeholder="Ej: 2000" />
                          </div>
                          <div>
                            <Label className="text-gray-900">Egresos (ml)</Label>
                            <Input type="number" placeholder="Ej: 1800" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-gray-900">Vía oral (ml)</Label>
                            <Input type="number" placeholder="0" />
                          </div>
                          <div>
                            <Label className="text-gray-900">Vía IV (ml)</Label>
                            <Input type="number" placeholder="0" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-gray-900">Diuresis (ml)</Label>
                            <Input type="number" placeholder="0" />
                          </div>
                          <div>
                            <Label className="text-gray-900">Otras pérdidas (ml)</Label>
                            <Input type="number" placeholder="0" />
                          </div>
                        </div>
                        <div>
                          <Label className="text-gray-900">Observaciones</Label>
                          <Textarea placeholder="Notas adicionales..." rows={2} />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowBalanceDialog(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={() => {
                          if (!selectedPatientForEval) {
                            toast({ title: "Error", description: "Seleccione un paciente", variant: "destructive" });
                            return;
                          }
                          toast({ title: "Balance registrado", description: "Balance hídrico guardado correctamente" });
                          setShowBalanceDialog(false);
                          setSelectedPatientForEval('');
                        }}>
                          Guardar Balance
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </Card>

                {/* Escalas Clínicas */}
                <Card className="p-4 border-l-4 border-l-purple-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Scale className="h-5 w-5 text-purple-600" />
                    <h4 className="font-semibold text-gray-900">Escalas Clínicas</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Glasgow, Braden, Morse, Dolor, etc.
                  </p>
                  <Dialog open={showScaleDialog} onOpenChange={setShowScaleDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="w-full">
                        <Stethoscope className="h-4 w-4 mr-2" />
                        Nueva Evaluación
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="text-gray-900">Registrar Escala Clínica</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-gray-900">Paciente *</Label>
                          <Select value={selectedPatientForEval} onValueChange={setSelectedPatientForEval}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar paciente" />
                            </SelectTrigger>
                            <SelectContent>
                              {assignedPatients.map(p => (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.firstName} {p.lastName} - Hab. {p.roomId}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-gray-900">Tipo de Escala *</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar escala" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="glasgow">Escala de Glasgow (Conciencia)</SelectItem>
                              <SelectItem value="braden">Escala de Braden (Úlceras por presión)</SelectItem>
                              <SelectItem value="morse">Escala de Morse (Riesgo de caídas)</SelectItem>
                              <SelectItem value="eva">Escala EVA (Dolor)</SelectItem>
                              <SelectItem value="barthel">Índice de Barthel (Dependencia)</SelectItem>
                              <SelectItem value="norton">Escala de Norton (Úlceras)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-gray-900">Puntuación *</Label>
                          <Input type="number" placeholder="Ej: 15" />
                        </div>
                        <div>
                          <Label className="text-gray-900">Observaciones</Label>
                          <Textarea placeholder="Detalles de la evaluación..." rows={3} />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowScaleDialog(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={() => {
                          if (!selectedPatientForEval) {
                            toast({ title: "Error", description: "Seleccione un paciente", variant: "destructive" });
                            return;
                          }
                          toast({ title: "Evaluación registrada", description: "Escala clínica guardada correctamente" });
                          setShowScaleDialog(false);
                          setSelectedPatientForEval('');
                        }}>
                          Guardar Evaluación
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </Card>

                {/* Evaluación de Heridas */}
                <Card className="p-4 border-l-4 border-l-orange-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Bandage className="h-5 w-5 text-orange-600" />
                    <h4 className="font-semibold text-gray-900">Evaluación de Heridas</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Valoración y seguimiento de heridas
                  </p>
                  <Dialog open={showWoundDialog} onOpenChange={setShowWoundDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="w-full">
                        <Bandage className="h-4 w-4 mr-2" />
                        Evaluar Heridas
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="text-gray-900">Evaluación de Heridas</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-gray-900">Paciente *</Label>
                          <Select value={selectedPatientForEval} onValueChange={setSelectedPatientForEval}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar paciente" />
                            </SelectTrigger>
                            <SelectContent>
                              {assignedPatients.map(p => (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.firstName} {p.lastName} - Hab. {p.roomId}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-gray-900">Tipo de Herida *</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="surgical">Herida Quirúrgica</SelectItem>
                              <SelectItem value="pressure">Úlcera por Presión</SelectItem>
                              <SelectItem value="vascular">Úlcera Vascular</SelectItem>
                              <SelectItem value="diabetic">Pie Diabético</SelectItem>
                              <SelectItem value="traumatic">Herida Traumática</SelectItem>
                              <SelectItem value="other">Otra</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-gray-900">Localización *</Label>
                          <Input placeholder="Ej: Región sacra, Talón derecho..." />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label className="text-gray-900">Largo (cm)</Label>
                            <Input type="number" step="0.1" placeholder="0" />
                          </div>
                          <div>
                            <Label className="text-gray-900">Ancho (cm)</Label>
                            <Input type="number" step="0.1" placeholder="0" />
                          </div>
                          <div>
                            <Label className="text-gray-900">Profundidad (cm)</Label>
                            <Input type="number" step="0.1" placeholder="0" />
                          </div>
                        </div>
                        <div>
                          <Label className="text-gray-900">Estado de la Herida</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="granulating">Granulando</SelectItem>
                              <SelectItem value="epithelializing">Epitelizando</SelectItem>
                              <SelectItem value="necrotic">Necrótica</SelectItem>
                              <SelectItem value="infected">Infectada</SelectItem>
                              <SelectItem value="sloughy">Con Esfacelos</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-gray-900">Observaciones</Label>
                          <Textarea placeholder="Descripción del exudado, bordes, piel perilesional..." rows={2} />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowWoundDialog(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={() => {
                          if (!selectedPatientForEval) {
                            toast({ title: "Error", description: "Seleccione un paciente", variant: "destructive" });
                            return;
                          }
                          toast({ title: "Evaluación registrada", description: "Evaluación de herida guardada correctamente" });
                          setShowWoundDialog(false);
                          setSelectedPatientForEval('');
                        }}>
                          Guardar Evaluación
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
