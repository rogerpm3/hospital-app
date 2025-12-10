'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, FileText, CheckCircle, Clock, Users, Download, 
  Calendar, AlertTriangle, Heart, Stethoscope, Pill,
  FileDown, Send, Bell, Home, ClipboardList, History
} from 'lucide-react';
import { useHospital } from '@/lib/hospital-context';
import { useAuth } from '@/lib/auth-context';
import DischargeChecklist from './discharge-checklist';
import FutureAppointmentsPanel from './future-appointments-panel';
import DischargeDocuments from './discharge-documents';
import FollowUpAlertsPanel from './follow-up-alerts-panel';
import { sqlDischarges, sqlPatientInstructions, getInstructionsByDischarge, Discharge, PatientInstruction } from '@/lib/sql-data';

export default function EnhancedDischargeDashboard() {
  const { 
    patients, 
    dischargeChecklists, 
    futureAppointments, 
    followUpAlerts,
    getFilteredPatients 
  } = useHospital();
  const { user } = useAuth();
  
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [showNewDischargeDialog, setShowNewDischargeDialog] = useState(false);
  const [dischargeInstructions, setDischargeInstructions] = useState('');
  const [medicalRecommendations, setMedicalRecommendations] = useState(['']);

  // Permisos según rol:
  // - Admin: ver todo, crear, editar
  // - Médico: ver sus pacientes, crear altas
  // - Enfermera: ver sus pacientes (solo lectura, no puede crear ni editar)
  const canCreateDischarge = user?.role === 'admin' || user?.role === 'doctor';
  const canEditDischarge = user?.role === 'admin' || user?.role === 'doctor';
  const isReadOnly = user?.role === 'nurse';

  // Obtener pacientes filtrados según el rol del usuario
  const accessiblePatients = getFilteredPatients();
  const hospitalizedPatients = accessiblePatients.filter(p => p.roomId);
  
  // Filtrar listas de checklists según pacientes accesibles
  const myPatientIds = accessiblePatients.map(p => p.id);
  
  const filteredDischargeChecklists = useMemo(() => {
    if (user?.role === 'admin') {
      return dischargeChecklists;
    }
    return dischargeChecklists.filter(dc => myPatientIds.includes(dc.patientId));
  }, [user?.role, dischargeChecklists, myPatientIds]);
  
  const pendingDischarges = filteredDischargeChecklists.filter(dc => dc.status === 'In Progress');
  const readyForDischarge = filteredDischargeChecklists.filter(dc => dc.status === 'Ready');
  const todayDischarges = filteredDischargeChecklists.filter(dc => 
    dc.expectedDischargeDate.toDateString() === new Date().toDateString()
  );

  // Obtener altas del SQL con instrucciones
  const sqlDischargesWithInstructions = useMemo(() => {
    return sqlDischarges.map(discharge => ({
      ...discharge,
      instructions: getInstructionsByDischarge(discharge.id),
      patient: patients.find(p => p.id === discharge.patientId)
    }));
  }, [patients]);

  // Filtrar altas según rol del usuario (médicos y enfermeras solo ven sus pacientes)
  const filteredSqlDischarges = useMemo(() => {
    if (user?.role === 'admin') {
      return sqlDischargesWithInstructions;
    }
    // Médicos y enfermeras solo ven altas de sus pacientes asignados
    return sqlDischargesWithInstructions.filter(d => myPatientIds.includes(d.patientId));
  }, [user?.role, myPatientIds, sqlDischargesWithInstructions]);

  const generateDischargePDF = (patientId: string) => {
    // Simular generación de PDF
    const patient = patients.find(p => p.id === patientId);
    const dischargePlan = dischargeChecklists.find(dc => dc.patientId === patientId);
    
    console.log('Generando PDF de alta para:', patient?.firstName, patient?.lastName);
    
    // En una implementación real, esto generaría el PDF
    const pdfContent = {
      patient: patient,
      dischargePlan: dischargePlan,
      instructions: dischargeInstructions,
      recommendations: medicalRecommendations.filter(r => r.trim() !== ''),
      futureAppointments: futureAppointments.filter(fa => fa.patientId === patientId),
      generatedAt: new Date(),
      generatedBy: user?.firstName + ' ' + user?.lastName
    };
    
    // Simular descarga
    alert('PDF de alta generado correctamente para ' + patient?.firstName + ' ' + patient?.lastName);
    return pdfContent;
  };

  const scheduleFollowUpAlert = (patientId: string, alertType: string, dueDate: Date) => {
    const newAlert = {
      id: Date.now().toString(),
      patientId,
      alertType: alertType as 'appointment' | 'medication' | 'test-result' | 'check-up',
      title: `Seguimiento: ${alertType}`,
      description: `Recordatorio de seguimiento para el paciente`,
      dueDate,
      priority: 'Medium' as const,
      isActive: true
    };
    
    console.log('Programando alerta de seguimiento:', newAlert);
    // En una implementación real, esto se guardaría en el estado
    alert(`Alerta de seguimiento programada para ${dueDate.toLocaleDateString()}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Alta Hospitalaria</h1>
          <p className="text-muted-foreground">
            {isReadOnly 
              ? `Consulta de altas (solo lectura) - ${accessiblePatients.length} pacientes asignados`
              : `Gestión de altas - ${accessiblePatients.length} pacientes asignados`
            }
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline"
            onClick={() => {
              // Generar reporte consolidado de todas las altas
              alert('Generando reporte consolidado de altas...');
            }}
          >
            <FileDown className="h-4 w-4 mr-2" />
            Reporte Completo
          </Button>
          {canCreateDischarge && (
            <Button onClick={() => setShowNewDischargeDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Plan de Alta
            </Button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Hospitalizados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hospitalizedPatients.length}</div>
            <p className="text-xs text-muted-foreground">Activos en el hospital</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Altas Programadas Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{todayDischarges.length}</div>
            <p className="text-xs text-muted-foreground">Programadas para hoy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listos para Alta</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{readyForDischarge.length}</div>
            <p className="text-xs text-muted-foreground">Documentación completa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas Futuras</CardTitle>
            <Bell className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{futureAppointments.length}</div>
            <p className="text-xs text-muted-foreground">Programadas post-alta</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="discharge-history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="discharge-history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Historial Altas ({filteredSqlDischarges.length})
          </TabsTrigger>
          <TabsTrigger value="discharge-queue">Cola de Altas</TabsTrigger>
          <TabsTrigger value="future-appointments">Citas Futuras</TabsTrigger>
          <TabsTrigger value="follow-up-alerts">Alertas de Seguimiento</TabsTrigger>
          <TabsTrigger value="documents">Documentación</TabsTrigger>
        </TabsList>

        {/* Historial de Altas del SQL */}
        <TabsContent value="discharge-history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Historial de Altas Hospitalarias
              </CardTitle>
              <CardDescription>
                Registro completo de altas con instrucciones al paciente
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredSqlDischarges.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay registros de altas disponibles</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredSqlDischarges.map(discharge => (
                    <div key={discharge.id} className="border rounded-lg p-4 bg-card">
                      {/* Header del alta */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-mono">{discharge.id}</Badge>
                            <Badge variant="secondary">{discharge.episodeId}</Badge>
                          </div>
                          <h3 className="text-lg font-semibold">
                            {discharge.patient?.firstName} {discharge.patient?.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            ID Paciente: {discharge.patientId}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-100 text-green-800">
                            <Home className="h-3 w-3 mr-1" />
                            {discharge.destinyDischarge}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            {discharge.dateTimeDischarge.toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Detalles del alta */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">Motivo:</span>
                            <span className="text-sm">{discharge.reasonDischarge}</span>
                          </div>
                          {discharge.diagnosticCode && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-muted-foreground">Diagnóstico:</span>
                              <Badge variant="outline">{discharge.diagnosticCode}</Badge>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          {discharge.clinicalSummary && (
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Resumen clínico:</span>
                              <p className="text-sm mt-1">{discharge.clinicalSummary}</p>
                            </div>
                          )}
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Tratamiento al alta:</span>
                            <p className="text-sm mt-1">{discharge.treatmentDischarge}</p>
                          </div>
                        </div>
                      </div>

                      {/* Instrucciones al paciente */}
                      {discharge.instructions.length > 0 && (
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Instrucciones al Paciente ({discharge.instructions.length})
                          </h4>
                          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
                            <ul className="space-y-2">
                              {discharge.instructions.map(instruction => (
                                <li key={instruction.id} className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <span>{instruction.textInstructions}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cola de Altas */}
        <TabsContent value="discharge-queue">
          <div className="space-y-4">
            {/* Altas programadas para hoy */}
            {todayDischarges.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-green-600" />
                    Altas Programadas para Hoy ({todayDischarges.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {todayDischarges.map(discharge => {
                      const patient = patients.find(p => p.id === discharge.patientId);
                      const futureAppts = futureAppointments.filter(fa => fa.patientId === discharge.patientId);
                      
                      return (
                        <div key={discharge.id} className="p-4 border rounded-lg bg-green-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div>
                                <div className="font-medium">
                                  {patient?.firstName} {patient?.lastName}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Habitación: {patient?.roomId} • 
                                  Dr. {patient?.attendingPhysician}
                                </div>
                              </div>
                              <Badge variant="default">{discharge.status}</Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">
                                {futureAppts.length} citas futuras
                              </Badge>
                              <Button
                                size="sm"
                                onClick={() => generateDischargePDF(discharge.patientId)}
                              >
                                <FileDown className="h-4 w-4 mr-2" />
                                PDF Alta
                              </Button>
                            </div>
                          </div>
                          
                          {/* Checklist rápido */}
                          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                            <div className={`flex items-center space-x-1 ${
                              discharge.checklist.medicalClearance ? 'text-green-600' : 'text-gray-500'
                            }`}>
                              <CheckCircle className="h-3 w-3" />
                              <span>Autorización médica</span>
                            </div>
                            <div className={`flex items-center space-x-1 ${
                              discharge.checklist.medicationReconciliation ? 'text-green-600' : 'text-gray-500'
                            }`}>
                              <Pill className="h-3 w-3" />
                              <span>Medicamentos</span>
                            </div>
                            <div className={`flex items-center space-x-1 ${
                              discharge.checklist.followUpAppointments ? 'text-green-600' : 'text-gray-500'
                            }`}>
                              <Calendar className="h-3 w-3" />
                              <span>Citas programadas</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Altas en proceso */}
            <Card>
              <CardHeader>
                <CardTitle>Altas en Proceso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingDischarges.map(discharge => {
                    const patient = patients.find(p => p.id === discharge.patientId);
                    const completedItems = Object.values(discharge.checklist).filter(Boolean).length;
                    const totalItems = Object.keys(discharge.checklist).length;
                    const progress = Math.round((completedItems / totalItems) * 100);
                    
                    return (
                      <div key={discharge.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-medium">
                              {patient?.firstName} {patient?.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Alta prevista: {discharge.expectedDischargeDate.toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{progress}% completo</div>
                            <div className="text-xs text-muted-foreground">
                              {completedItems}/{totalItems} items
                            </div>
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all" 
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Citas Futuras */}
        <TabsContent value="future-appointments">
          <FutureAppointmentsPanel 
            appointments={futureAppointments}
            onScheduleAppointment={(patientId, appointmentData) => {
              console.log('Programando cita futura:', patientId, appointmentData);
              alert('Cita futura programada exitosamente');
            }}
          />
        </TabsContent>

        {/* Alertas de Seguimiento */}
        <TabsContent value="follow-up-alerts">
          <FollowUpAlertsPanel 
            alerts={followUpAlerts}
            onCreateAlert={(patientId, alertData) => {
              scheduleFollowUpAlert(patientId, alertData.type, alertData.dueDate);
            }}
          />
        </TabsContent>

        {/* Documentación */}
        <TabsContent value="documents">
          <DischargeDocuments 
            discharges={dischargeChecklists}
            onGeneratePDF={generateDischargePDF}
            onSendDocuments={(patientId, documents) => {
              console.log('Enviando documentos:', patientId, documents);
              alert('Documentos enviados al paciente y médico de cabecera');
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Dialog para nuevo plan de alta */}
      <Dialog open={showNewDischargeDialog} onOpenChange={setShowNewDischargeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nuevo Plan de Alta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-900">Paciente *</label>
              {hospitalizedPatients.length === 0 ? (
                <div className="mt-2 p-4 border border-amber-200 bg-amber-50 rounded-lg">
                  <p className="text-amber-800 text-sm">
                    {user?.role === 'doctor' 
                      ? 'No tienes pacientes hospitalizados asignados actualmente. Solo puedes crear planes de alta para tus pacientes asignados que estén hospitalizados.'
                      : 'No hay pacientes hospitalizados disponibles para dar de alta.'
                    }
                  </p>
                </div>
              ) : (
                <select 
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-blue-500"
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                >
                  <option value="">Seleccionar paciente hospitalizado</option>
                  {hospitalizedPatients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName} - Habitación {patient.roomId}
                      {patient.currentCondition && ` (${patient.currentCondition})`}
                    </option>
                  ))}
                </select>
              )}
              {user?.role === 'doctor' && hospitalizedPatients.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Mostrando {hospitalizedPatients.length} paciente(s) hospitalizado(s) asignado(s) a ti
                </p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium">Instrucciones de Alta</label>
              <Textarea
                placeholder="Instrucciones detalladas para el paciente..."
                value={dischargeInstructions}
                onChange={(e) => setDischargeInstructions(e.target.value)}
                rows={4}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Recomendaciones Médicas</label>
              {medicalRecommendations.map((rec, index) => (
                <Input
                  key={index}
                  placeholder={`Recomendación ${index + 1}`}
                  value={rec}
                  onChange={(e) => {
                    const newRecs = [...medicalRecommendations];
                    newRecs[index] = e.target.value;
                    setMedicalRecommendations(newRecs);
                  }}
                  className="mt-2"
                />
              ))}
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setMedicalRecommendations([...medicalRecommendations, ''])}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Recomendación
              </Button>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowNewDischargeDialog(false)}
              >
                Cancelar
              </Button>
              <Button onClick={() => {
                if (selectedPatient) {
                  generateDischargePDF(selectedPatient);
                  setShowNewDischargeDialog(false);
                  setDischargeInstructions('');
                  setMedicalRecommendations(['']);
                  setSelectedPatient('');
                }
              }}>
                <Home className="h-4 w-4 mr-2" />
                Crear Plan de Alta
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
