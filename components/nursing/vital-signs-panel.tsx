'use client';

import { useState, useMemo } from 'react';
import { useHospital } from '@/lib/hospital-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  Plus, 
  ChevronDown,
  ChevronRight,
  Database,
  FileText
} from 'lucide-react';
import { VitalSigns } from '@/lib/types';
import { 
  sqlDetailVitalSigns, 
  sqlVitalSignParameters, 
  getVitalSignParameterName,
  getVitalSignParameterUnit 
} from '@/lib/sql-data';

export default function VitalSignsPanel() {
  const { patients, addVitalSigns, getFilteredPatients, rooms } = useHospital();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Helper para obtener el número de habitación
  const getRoomNumber = (roomId: string | undefined): string => {
    if (!roomId) return '';
    const room = rooms.find(r => r.id === roomId);
    return room?.number || roomId.replace('room-', '').replace(/^P\d+_\w+_/, '');
  };
  
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

  // Obtener pacientes según rol del usuario - solo hospitalizados (con roomId)
  const assignedPatients = getFilteredPatients();
  const hospitalizedPatients = assignedPatients.filter(p => p.roomId);

  // Estado para los desplegables de signos vitales del SQL
  const [expandedPatients, setExpandedPatients] = useState<Set<string>>(new Set());
  
  // Obtener IDs de pacientes asignados
  const myPatientIds = useMemo(() => {
    return assignedPatients.map(p => p.id);
  }, [assignedPatients]);
  
  // Filtrar signos vitales del SQL según rol
  const filteredSqlVitalSigns = useMemo(() => {
    if (user?.role === 'admin') {
      return sqlDetailVitalSigns;
    }
    // Enfermeras solo ven los de sus pacientes asignados
    return sqlDetailVitalSigns.filter(sv => myPatientIds.includes(sv.patientId));
  }, [user?.role, myPatientIds]);
  
  // Agrupar por paciente
  const sqlVitalSignsByPatient = useMemo(() => {
    const grouped = new Map<string, typeof sqlDetailVitalSigns>();
    
    for (const sign of filteredSqlVitalSigns) {
      const existing = grouped.get(sign.patientId) || [];
      existing.push(sign);
      grouped.set(sign.patientId, existing);
    }
    
    return grouped;
  }, [filteredSqlVitalSigns]);
  
  // Agrupar por registro dentro de cada paciente
  const getSignsGroupedByRegister = (patientId: string) => {
    const signs = sqlVitalSignsByPatient.get(patientId) || [];
    const grouped = new Map<string, typeof sqlDetailVitalSigns>();
    
    for (const sign of signs) {
      const existing = grouped.get(sign.registerId) || [];
      existing.push(sign);
      grouped.set(sign.registerId, existing);
    }
    
    // Ordenar por fecha descendente
    return Array.from(grouped.entries()).sort((a, b) => {
      const dateA = a[1][0]?.timestamp?.getTime() || 0;
      const dateB = b[1][0]?.timestamp?.getTime() || 0;
      return dateB - dateA;
    });
  };
  
  const togglePatientExpanded = (patientId: string) => {
    setExpandedPatients(prev => {
      const newSet = new Set(prev);
      if (newSet.has(patientId)) {
        newSet.delete(patientId);
      } else {
        newSet.add(patientId);
      }
      return newSet;
    });
  };

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
                    {hospitalizedPatients.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No hay pacientes hospitalizados asignados
                      </SelectItem>
                    ) : (
                      hospitalizedPatients.map(patient => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.firstName} {patient.lastName} - Hab. {getRoomNumber(patient.roomId)}{patient.bedNumber ? ` - Cama ${patient.bedNumber}` : ''}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {hospitalizedPatients.length === 0 && (
                  <p className="text-sm text-amber-600">
                    No tienes pacientes hospitalizados asignados actualmente.
                  </p>
                )}
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

      {/* Sección de Signos Vitales del SQL - Desplegable por paciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Historial Detallado de Signos Vitales
          </CardTitle>
          <CardDescription>
            {user?.role === 'admin' 
              ? `Todos los registros del sistema (${filteredSqlVitalSigns.length} mediciones)`
              : `Registros de tus pacientes asignados (${filteredSqlVitalSigns.length} mediciones)`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sqlVitalSignsByPatient.size === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay registros de signos vitales disponibles</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Array.from(sqlVitalSignsByPatient.entries()).map(([patientId, signs]) => {
                const patient = patients.find(p => p.id === patientId);
                const isExpanded = expandedPatients.has(patientId);
                const registersGrouped = getSignsGroupedByRegister(patientId);
                
                return (
                  <Card key={patientId} className="border">
                    <CardHeader 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => togglePatientExpanded(patientId)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          )}
                          <div>
                            <CardTitle className="text-base">
                              {patient?.firstName} {patient?.lastName}
                            </CardTitle>
                            <CardDescription>
                              ID: {patientId} • {registersGrouped.length} registro(s) • {signs.length} mediciones
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {signs.length} valores
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    {isExpanded && (
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          {registersGrouped.map(([registerId, registerSigns]) => {
                            const timestamp = registerSigns[0]?.timestamp;
                            return (
                              <div key={registerId} className="border rounded-lg p-4 bg-muted/30">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="font-mono text-xs">
                                      {registerId}
                                    </Badge>
                                  </div>
                                  {timestamp && (
                                    <span className="text-sm text-muted-foreground">
                                      {timestamp.toLocaleDateString('es-ES', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                  )}
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                  {registerSigns.map((sign, idx) => {
                                    const paramName = getVitalSignParameterName(sign.parameterId);
                                    const paramUnit = getVitalSignParameterUnit(sign.parameterId);
                                    const param = sqlVitalSignParameters.find(p => p.id === sign.parameterId);
                                    
                                    // Determinar color según categoría
                                    const categoryColors: Record<string, string> = {
                                      'vital': 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',
                                      'lab': 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800',
                                      'blood': 'bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800'
                                    };
                                    
                                    const colorClass = param?.category 
                                      ? categoryColors[param.category] 
                                      : 'bg-gray-50 border-gray-200';
                                    
                                    return (
                                      <div 
                                        key={`${sign.registerId}-${sign.parameterId}-${idx}`}
                                        className={`p-2 rounded border ${colorClass}`}
                                      >
                                        <p className="text-xs text-muted-foreground">{paramName}</p>
                                        <p className="font-semibold">
                                          {sign.value} <span className="text-xs font-normal">{paramUnit}</span>
                                        </p>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
