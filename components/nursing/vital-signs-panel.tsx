'use client';

import { useState } from 'react';
import { useHospital } from '@/lib/hospital-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { 
  Plus, 
  Heart, 
  Thermometer, 
  Activity, 
  Droplets,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye
} from 'lucide-react';
import { VitalSigns } from '@/lib/types';

export default function VitalSignsPanel() {
  const { patients, vitalSigns, addVitalSigns } = useHospital();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedPatient, setSelectedPatient] = useState('');
  const [newVitalSigns, setNewVitalSigns] = useState({
    systolic: '',
    diastolic: '',
    heartRate: '',
    temperature: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    painLevel: '',
    glucoseLevel: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Obtener solo pacientes hospitalizados
  const hospitalizedPatients = patients.filter(p => p.roomId);

  // Obtener signos vitales recientes
  const recentVitalSigns = vitalSigns
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 20);

  // Función para determinar si un valor está fuera de rango normal
  const isAbnormal = (type: string, value: number) => {
    switch (type) {
      case 'systolic':
        return value > 140 || value < 90;
      case 'diastolic':
        return value > 90 || value < 60;
      case 'heartRate':
        return value > 100 || value < 60;
      case 'temperature':
        return value > 37.5 || value < 36;
      case 'respiratoryRate':
        return value > 20 || value < 12;
      case 'oxygenSaturation':
        return value < 95;
      case 'painLevel':
        return value > 3;
      default:
        return false;
    }
  };

  // Obtener tendencia de signos vitales para un paciente
  const getPatientVitalsTrend = (patientId: string) => {
    return vitalSigns
      .filter(vs => vs.patientId === patientId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .slice(-10); // Últimos 10 registros
  };

  // Manejar envío de nuevos signos vitales
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!selectedPatient) {
        toast({
          title: "Error de validación",
          description: "Por favor selecciona un paciente",
          variant: "destructive",
        });
        return;
      }

      const vitalSignsData: Omit<VitalSigns, 'id'> = {
        patientId: selectedPatient,
        timestamp: new Date(),
        recordedBy: user?.firstName + " " + user?.lastName || 'Enfermero/a',
        bloodPressure: {
          systolic: parseInt(newVitalSigns.systolic) || 0,
          diastolic: parseInt(newVitalSigns.diastolic) || 0
        },
        heartRate: parseInt(newVitalSigns.heartRate) || 0,
        temperature: parseFloat(newVitalSigns.temperature) || 0,
        respiratoryRate: parseInt(newVitalSigns.respiratoryRate) || 0,
        oxygenSaturation: parseInt(newVitalSigns.oxygenSaturation) || 0,
        painLevel: newVitalSigns.painLevel ? parseInt(newVitalSigns.painLevel) : undefined,
        glucoseLevel: newVitalSigns.glucoseLevel ? parseInt(newVitalSigns.glucoseLevel) : undefined,
        notes: newVitalSigns.notes || undefined,
        alerts: []
      };

      // Generar alertas automáticas
      const alerts: string[] = [];
      if (isAbnormal('systolic', vitalSignsData.bloodPressure.systolic)) {
        alerts.push(`Presión sistólica anormal: ${vitalSignsData.bloodPressure.systolic} mmHg`);
      }
      if (isAbnormal('diastolic', vitalSignsData.bloodPressure.diastolic)) {
        alerts.push(`Presión diastólica anormal: ${vitalSignsData.bloodPressure.diastolic} mmHg`);
      }
      if (isAbnormal('heartRate', vitalSignsData.heartRate)) {
        alerts.push(`Frecuencia cardíaca anormal: ${vitalSignsData.heartRate} bpm`);
      }
      if (isAbnormal('temperature', vitalSignsData.temperature)) {
        alerts.push(`Temperatura anormal: ${vitalSignsData.temperature}°C`);
      }
      if (isAbnormal('oxygenSaturation', vitalSignsData.oxygenSaturation)) {
        alerts.push(`Saturación de oxígeno baja: ${vitalSignsData.oxygenSaturation}%`);
      }
      if (vitalSignsData.painLevel && isAbnormal('painLevel', vitalSignsData.painLevel)) {
        alerts.push(`Dolor elevado: ${vitalSignsData.painLevel}/10`);
      }

      vitalSignsData.alerts = alerts;

      // Añadir signos vitales
      addVitalSigns(vitalSignsData);

      // Limpiar formulario
      setNewVitalSigns({
        systolic: '',
        diastolic: '',
        heartRate: '',
        temperature: '',
        respiratoryRate: '',
        oxygenSaturation: '',
        painLevel: '',
        glucoseLevel: '',
        notes: ''
      });
      setSelectedPatient('');
      setShowAddDialog(false);

      toast({
        title: "Signos vitales registrados",
        description: alerts.length > 0 ? `Registrados con ${alerts.length} alerta(s)` : "Registrados exitosamente",
        variant: alerts.length > 0 ? "destructive" : "default",
      });

    } catch (error) {
      toast({
        title: "Error al registrar signos vitales",
        description: "No se pudieron guardar los signos vitales",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Obtener color para el valor según si es normal o no
  const getValueColor = (type: string, value: number) => {
    return isAbnormal(type, value) ? 'text-red-600' : 'text-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Header con botón de agregar */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Panel de Signos Vitales</h3>
          <p className="text-sm text-muted-foreground">
            Registra y monitorea signos vitales de pacientes
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Registrar Signos Vitales
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registrar Nuevos Signos Vitales</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Seleccionar paciente */}
              <div className="space-y-2">
                <Label htmlFor="patient-select">Paciente *</Label>
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {hospitalizedPatients.map(patient => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName} - Hab. {patient.roomId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Signos vitales */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="systolic">Presión Sistólica (mmHg) *</Label>
                  <Input
                    id="systolic"
                    type="number"
                    value={newVitalSigns.systolic}
                    onChange={(e) => setNewVitalSigns(prev => ({ ...prev, systolic: e.target.value }))}
                    placeholder="120"
                    min="50"
                    max="250"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diastolic">Presión Diastólica (mmHg) *</Label>
                  <Input
                    id="diastolic"
                    type="number"
                    value={newVitalSigns.diastolic}
                    onChange={(e) => setNewVitalSigns(prev => ({ ...prev, diastolic: e.target.value }))}
                    placeholder="80"
                    min="30"
                    max="150"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heartRate">Frecuencia Cardíaca (bpm) *</Label>
                  <Input
                    id="heartRate"
                    type="number"
                    value={newVitalSigns.heartRate}
                    onChange={(e) => setNewVitalSigns(prev => ({ ...prev, heartRate: e.target.value }))}
                    placeholder="72"
                    min="30"
                    max="200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperatura (°C) *</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    value={newVitalSigns.temperature}
                    onChange={(e) => setNewVitalSigns(prev => ({ ...prev, temperature: e.target.value }))}
                    placeholder="36.5"
                    min="30"
                    max="45"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="respiratoryRate">Frecuencia Respiratoria (rpm) *</Label>
                  <Input
                    id="respiratoryRate"
                    type="number"
                    value={newVitalSigns.respiratoryRate}
                    onChange={(e) => setNewVitalSigns(prev => ({ ...prev, respiratoryRate: e.target.value }))}
                    placeholder="16"
                    min="5"
                    max="50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="oxygenSaturation">Saturación O₂ (%) *</Label>
                  <Input
                    id="oxygenSaturation"
                    type="number"
                    value={newVitalSigns.oxygenSaturation}
                    onChange={(e) => setNewVitalSigns(prev => ({ ...prev, oxygenSaturation: e.target.value }))}
                    placeholder="98"
                    min="50"
                    max="100"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="painLevel">Nivel de Dolor (0-10)</Label>
                  <Select 
                    value={newVitalSigns.painLevel} 
                    onValueChange={(value) => setNewVitalSigns(prev => ({ ...prev, painLevel: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(11)].map((_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i} - {i === 0 ? 'Sin dolor' : i <= 3 ? 'Leve' : i <= 6 ? 'Moderado' : 'Severo'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="glucoseLevel">Glucosa (mg/dL)</Label>
                  <Input
                    id="glucoseLevel"
                    type="number"
                    value={newVitalSigns.glucoseLevel}
                    onChange={(e) => setNewVitalSigns(prev => ({ ...prev, glucoseLevel: e.target.value }))}
                    placeholder="90"
                    min="20"
                    max="500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observaciones</Label>
                <Textarea
                  id="notes"
                  value={newVitalSigns.notes}
                  onChange={(e) => setNewVitalSigns(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Observaciones adicionales..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? 'Guardando...' : 'Registrar Signos Vitales'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de signos vitales recientes */}
      <Card>
        <CardHeader>
          <CardTitle>Signos Vitales Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentVitalSigns.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay signos vitales registrados.
              </div>
            ) : (
              recentVitalSigns.map(vital => {
                const patient = patients.find(p => p.id === vital.patientId);
                const hasAlerts = vital.alerts && vital.alerts.length > 0;
                
                return (
                  <Card key={vital.id} className={`${hasAlerts ? 'border-red-200 bg-red-50' : ''}`}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">
                            {patient?.firstName} {patient?.lastName}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Habitación {patient?.roomId} • {vital.timestamp.toLocaleString()} • {vital.recordedBy}
                          </p>
                        </div>
                        {hasAlerts && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {vital.alerts?.length} Alerta(s)
                          </Badge>
                        )}
                      </div>

                      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-red-500" />
                          <div>
                            <div className="text-xs text-muted-foreground">Presión</div>
                            <div className={`font-medium ${
                              isAbnormal('systolic', vital.bloodPressure.systolic) || 
                              isAbnormal('diastolic', vital.bloodPressure.diastolic) 
                                ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {vital.bloodPressure.systolic}/{vital.bloodPressure.diastolic}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-red-500" />
                          <div>
                            <div className="text-xs text-muted-foreground">FC</div>
                            <div className={`font-medium ${getValueColor('heartRate', vital.heartRate)}`}>
                              {vital.heartRate} bpm
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4 text-blue-500" />
                          <div>
                            <div className="text-xs text-muted-foreground">Temp</div>
                            <div className={`font-medium ${getValueColor('temperature', vital.temperature)}`}>
                              {vital.temperature}°C
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-purple-500" />
                          <div>
                            <div className="text-xs text-muted-foreground">FR</div>
                            <div className={`font-medium ${getValueColor('respiratoryRate', vital.respiratoryRate)}`}>
                              {vital.respiratoryRate} rpm
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-green-500" />
                          <div>
                            <div className="text-xs text-muted-foreground">SpO₂</div>
                            <div className={`font-medium ${getValueColor('oxygenSaturation', vital.oxygenSaturation)}`}>
                              {vital.oxygenSaturation}%
                            </div>
                          </div>
                        </div>

                        {vital.painLevel !== undefined && (
                          <div className="flex items-center gap-2">
                            <Minus className="h-4 w-4 text-orange-500" />
                            <div>
                              <div className="text-xs text-muted-foreground">Dolor</div>
                              <div className={`font-medium ${getValueColor('painLevel', vital.painLevel)}`}>
                                {vital.painLevel}/10
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {vital.alerts && vital.alerts.length > 0 && (
                        <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded">
                          <h5 className="font-medium text-red-800 text-sm mb-1">Alertas:</h5>
                          <ul className="text-sm text-red-700 space-y-1">
                            {vital.alerts.map((alert, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                {alert}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {vital.notes && (
                        <div className="mt-3 p-2 bg-blue-50 border border-blue-100 rounded text-sm">
                          <span className="font-medium text-blue-900">Observaciones:</span>{" "}
                          <span className="text-blue-800">{vital.notes}</span>
                        </div>
                      )}

                      <div className="mt-3 flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="flex items-center gap-2">
                              <Eye className="h-3 w-3" />
                              Ver Tendencia
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>
                                Tendencia de Signos Vitales - {patient?.firstName} {patient?.lastName}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              {(() => {
                                const trendData = getPatientVitalsTrend(vital.patientId).map(vs => ({
                                  time: vs.timestamp.toLocaleTimeString(),
                                  systolic: vs.bloodPressure.systolic,
                                  diastolic: vs.bloodPressure.diastolic,
                                  heartRate: vs.heartRate,
                                  temperature: vs.temperature,
                                  oxygenSaturation: vs.oxygenSaturation
                                }));

                                return (
                                  <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                      <h4 className="font-medium mb-2">Presión Arterial y Frecuencia Cardíaca</h4>
                                      <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={trendData}>
                                          <CartesianGrid strokeDasharray="3 3" />
                                          <XAxis dataKey="time" />
                                          <YAxis />
                                          <Tooltip />
                                          <Line type="monotone" dataKey="systolic" stroke="#ef4444" name="Sistólica" />
                                          <Line type="monotone" dataKey="diastolic" stroke="#f97316" name="Diastólica" />
                                          <Line type="monotone" dataKey="heartRate" stroke="#ec4899" name="FC" />
                                        </LineChart>
                                      </ResponsiveContainer>
                                    </div>

                                    <div>
                                      <h4 className="font-medium mb-2">Temperatura y Saturación O₂</h4>
                                      <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={trendData}>
                                          <CartesianGrid strokeDasharray="3 3" />
                                          <XAxis dataKey="time" />
                                          <YAxis />
                                          <Tooltip />
                                          <Line type="monotone" dataKey="temperature" stroke="#3b82f6" name="Temperatura" />
                                          <Line type="monotone" dataKey="oxygenSaturation" stroke="#22c55e" name="SpO₂" />
                                        </LineChart>
                                      </ResponsiveContainer>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
