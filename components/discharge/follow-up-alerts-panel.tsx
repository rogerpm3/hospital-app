'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Bell, Plus, Calendar, Clock, AlertTriangle, 
  CheckCircle, Stethoscope, TestTube, Pill, UserCheck
} from 'lucide-react';
import { FollowUpAlert } from '@/lib/types';
import { useHospital } from '@/lib/hospital-context';

interface FollowUpAlertsPanelProps {
  alerts: FollowUpAlert[];
  onCreateAlert: (patientId: string, alertData: any) => void;
}

export default function FollowUpAlertsPanel({ 
  alerts, 
  onCreateAlert 
}: FollowUpAlertsPanelProps) {
  const { patients } = useHospital();
  const [showNewAlertDialog, setShowNewAlertDialog] = useState(false);
  const [newAlert, setNewAlert] = useState({
    patientId: '',
    type: 'appointment' as FollowUpAlert['alertType'],
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium' as FollowUpAlert['priority']
  });

  const getAlertIcon = (type: FollowUpAlert['alertType']) => {
    switch (type) {
      case 'appointment': return <Calendar className="h-4 w-4" />;
      case 'medication': return <Pill className="h-4 w-4" />;
      case 'test-result': return <TestTube className="h-4 w-4" />;
      case 'check-up': return <Stethoscope className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: FollowUpAlert['priority']) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (dueDate: Date, isCompleted: boolean) => {
    if (isCompleted) return 'bg-green-100 text-green-800';
    
    const today = new Date();
    const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff < 0) return 'bg-red-100 text-red-800'; // Vencida
    if (daysDiff <= 1) return 'bg-orange-100 text-orange-800'; // Próxima a vencer
    if (daysDiff <= 7) return 'bg-yellow-100 text-yellow-800'; // Esta semana
    return 'bg-blue-100 text-blue-800'; // Normal
  };

  const getStatusText = (dueDate: Date, isCompleted: boolean) => {
    if (isCompleted) return 'Completada';
    
    const today = new Date();
    const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff < 0) return `Vencida (${Math.abs(daysDiff)} días)`;
    if (daysDiff === 0) return 'Vence hoy';
    if (daysDiff === 1) return 'Vence mañana';
    if (daysDiff <= 7) return `Vence en ${daysDiff} días`;
    return `Vence en ${daysDiff} días`;
  };

  // Filtrar y agrupar alertas
  const activeAlerts = alerts.filter(alert => alert.isActive);
  const completedAlerts = alerts.filter(alert => !alert.isActive);
  const urgentAlerts = activeAlerts.filter(alert => {
    const daysDiff = Math.ceil((alert.dueDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    return daysDiff <= 1 || alert.priority === 'Critical';
  });

  // Agrupar por paciente
  const alertsByPatient = activeAlerts.reduce((acc, alert) => {
    if (!acc[alert.patientId]) {
      acc[alert.patientId] = [];
    }
    acc[alert.patientId].push(alert);
    return acc;
  }, {} as Record<string, FollowUpAlert[]>);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Alertas de Seguimiento</h2>
        <Dialog open={showNewAlertDialog} onOpenChange={setShowNewAlertDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Alerta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nueva Alerta de Seguimiento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Paciente</label>
                <select 
                  className="w-full mt-1 p-2 border rounded-md"
                  value={newAlert.patientId}
                  onChange={(e) => setNewAlert({...newAlert, patientId: e.target.value})}
                >
                  <option value="">Seleccionar paciente</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Tipo de Alerta</label>
                <select 
                  className="w-full mt-1 p-2 border rounded-md"
                  value={newAlert.type}
                  onChange={(e) => setNewAlert({...newAlert, type: e.target.value as FollowUpAlert['alertType']})}
                >
                  <option value="appointment">Cita médica</option>
                  <option value="medication">Control medicación</option>
                  <option value="test-result">Resultado de análisis</option>
                  <option value="check-up">Revisión médica</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input
                  placeholder="ej: Control cardiológico post-IAM"
                  value={newAlert.title}
                  onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Descripción</label>
                <Textarea
                  placeholder="Detalles de la alerta..."
                  value={newAlert.description}
                  onChange={(e) => setNewAlert({...newAlert, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Fecha de Vencimiento</label>
                <Input
                  type="date"
                  value={newAlert.dueDate}
                  onChange={(e) => setNewAlert({...newAlert, dueDate: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Prioridad</label>
                <select 
                  className="w-full mt-1 p-2 border rounded-md"
                  value={newAlert.priority}
                  onChange={(e) => setNewAlert({...newAlert, priority: e.target.value as FollowUpAlert['priority']})}
                >
                  <option value="Low">Baja</option>
                  <option value="Medium">Media</option>
                  <option value="High">Alta</option>
                  <option value="Critical">Crítica</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowNewAlertDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => {
                  if (newAlert.patientId && newAlert.dueDate && newAlert.title) {
                    onCreateAlert(newAlert.patientId, {
                      ...newAlert,
                      dueDate: new Date(newAlert.dueDate)
                    });
                    setShowNewAlertDialog(false);
                    setNewAlert({
                      patientId: '',
                      type: 'appointment',
                      title: '',
                      description: '',
                      dueDate: '',
                      priority: 'Medium'
                    });
                  }
                }}>
                  <Bell className="h-4 w-4 mr-2" />
                  Crear Alerta
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{activeAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Alertas activas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{urgentAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Urgentes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{completedAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Completadas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{Object.keys(alertsByPatient).length}</div>
            <p className="text-xs text-muted-foreground">Pacientes con alertas</p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas urgentes */}
      {urgentAlerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center text-red-800">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Alertas Urgentes ({urgentAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {urgentAlerts.map(alert => {
                const patient = patients.find(p => p.id === alert.patientId);
                return (
                  <div key={alert.id} className="p-3 bg-white border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getAlertIcon(alert.alertType)}
                        <div>
                          <div className="font-medium">{alert.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {patient?.firstName} {patient?.lastName} • {alert.alertType}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(alert.dueDate, false)}>
                          {getStatusText(alert.dueDate, false)}
                        </Badge>
                        <Button size="sm">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Marcar Completa
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alertas por paciente */}
      <div className="space-y-4">
        {Object.entries(alertsByPatient).map(([patientId, patientAlerts]) => {
          const patient = patients.find(p => p.id === patientId);
          if (!patient) return null;
          
          return (
            <Card key={patientId}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{patient.firstName} {patient.lastName}</span>
                  <Badge variant="outline">
                    {patientAlerts.length} alerta{patientAlerts.length !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patientAlerts
                    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
                    .map(alert => (
                    <div key={alert.id} className={`p-3 border rounded-lg ${getPriorityColor(alert.priority)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getAlertIcon(alert.alertType)}
                          <div>
                            <div className="font-medium">{alert.title}</div>
                            <div className="text-sm">{alert.description}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {alert.priority}
                          </Badge>
                          <Badge className={getStatusColor(alert.dueDate, false)}>
                            {getStatusText(alert.dueDate, false)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          Vence: {alert.dueDate.toLocaleDateString()}
                        </div>
                        
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                            Editar
                          </Button>
                          <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {activeAlerts.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay alertas de seguimiento activas</p>
            <p className="text-sm text-muted-foreground">
              Las alertas de seguimiento aparecerán aquí una vez programadas
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
