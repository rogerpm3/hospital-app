'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bed, Users, Calendar, Activity, AlertTriangle, 
  TrendingUp, Building2, Stethoscope, FileText,
  Search, Clock, CheckCircle
} from 'lucide-react';
import { useHospital } from '@/lib/hospital-context';

export default function AIQuickActions() {
  const { beds, patients, appointments, hospitalFloors } = useHospital();

  const quickActions = [
    {
      id: 'available-beds-icu',
      title: 'Camas Disponibles UCI',
      description: 'Ver camas libres en Unidad de Cuidados Intensivos',
      icon: Bed,
      color: 'bg-red-100 text-red-600',
      action: () => console.log('Show ICU beds'),
      result: `${beds.filter(bed => bed.status === 'Available').length} camas disponibles`,
      priority: 'high'
    },
    {
      id: 'critical-patients',
      title: 'Pacientes Críticos',
      description: 'Lista de pacientes en estado crítico',
      icon: AlertTriangle,
      color: 'bg-orange-100 text-orange-600',
      action: () => console.log('Show critical patients'),
      result: `${patients.filter(p => p.currentCondition === 'Critical').length} pacientes críticos`,
      priority: 'high'
    },
    {
      id: 'today-appointments',
      title: 'Citas de Hoy',
      description: 'Resumen de citas programadas para hoy',
      icon: Calendar,
      color: 'bg-blue-100 text-blue-600',
      action: () => console.log('Show today appointments'),
      result: `${appointments.filter(apt => 
        apt.date.toDateString() === new Date().toDateString()
      ).length} citas programadas`,
      priority: 'medium'
    },
    {
      id: 'hospital-occupancy',
      title: 'Ocupación Hospitalaria',
      description: 'Estado general de ocupación por plantas',
      icon: Building2,
      color: 'bg-green-100 text-green-600',
      action: () => console.log('Show occupancy'),
      result: 'Ocupación promedio: 78%',
      priority: 'medium'
    },
    {
      id: 'pending-orders',
      title: 'Órdenes Pendientes',
      description: 'Órdenes médicas sin completar',
      icon: Stethoscope,
      color: 'bg-purple-100 text-purple-600',
      action: () => console.log('Show pending orders'),
      result: '12 órdenes pendientes',
      priority: 'medium'
    },
    {
      id: 'discharge-ready',
      title: 'Listos para Alta',
      description: 'Pacientes con proceso de alta completo',
      icon: CheckCircle,
      color: 'bg-teal-100 text-teal-600',
      action: () => console.log('Show discharge ready'),
      result: '8 pacientes listos',
      priority: 'low'
    }
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge className="bg-red-100 text-red-800">Alta</Badge>;
      case 'medium': return <Badge variant="secondary">Media</Badge>;
      case 'low': return <Badge variant="outline">Baja</Badge>;
      default: return <Badge variant="outline">Normal</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <Card key={action.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  {getPriorityBadge(action.priority)}
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {action.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-600">
                    {action.result}
                  </span>
                  <Button size="sm" onClick={action.action}>
                    Ver Detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Command Center */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Centro de Comandos IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hospital Status */}
            <div>
              <h3 className="font-medium mb-3">Estado del Hospital</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm">Plantas Operativas</span>
                  <Badge variant="default">{hospitalFloors.length}/5</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm">Pacientes Hospitalizados</span>
                  <Badge variant="secondary">{patients.length}</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm">Camas Totales</span>
                  <Badge variant="outline">{beds.length}</Badge>
                </div>
              </div>
            </div>

            {/* Quick Commands */}
            <div>
              <h3 className="font-medium mb-3">Comandos Rápidos</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="justify-start">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar Paciente
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <Bed className="h-4 w-4 mr-2" />
                  Reservar Cama
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Nueva Cita
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Generar Reporte
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Insights Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium">Tendencia Positiva</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Los tiempos de espera han disminuido un 15% esta semana
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span className="text-sm font-medium">Requiere Atención</span>
              </div>
              <p className="text-sm text-muted-foreground">
                La planta 3 tiene mayor ocupación de lo habitual
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-sm font-medium">Recomendación</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Considerar transferir 2 pacientes de UCI a cuidados intermedios
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
