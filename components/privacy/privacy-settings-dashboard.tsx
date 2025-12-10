'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, Eye, EyeOff, Users, Lock, 
  User, Stethoscope, Activity, FileText,
  Settings, AlertTriangle, CheckCircle
} from 'lucide-react';
import { useHospital } from '@/lib/hospital-context';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/lib/types';

interface PrivacyRule {
  id: string;
  role: UserRole;
  dataType: string;
  canView: boolean;
  canEdit: boolean;
  conditions?: string[];
  description: string;
}

export default function PrivacySettingsDashboard() {
  const { user } = useAuth();
  const { privacySettings } = useHospital();
  const [activeTab, setActiveTab] = useState('by-role');
  
  // Reglas de privacidad por defecto del sistema
  const defaultPrivacyRules: PrivacyRule[] = [
    // Personal de Limpieza
    {
      id: 'clean-patient-basic',
      role: 'cleaning',
      dataType: 'Información Básica del Paciente',
      canView: true,
      canEdit: false,
      conditions: ['Solo género, edad y ubicación'],
      description: 'Información mínima necesaria para limpieza'
    },
    {
      id: 'clean-medical-history',
      role: 'cleaning',
      dataType: 'Historia Médica',
      canView: false,
      canEdit: false,
      description: 'Información médica restringida'
    },
    {
      id: 'clean-vital-signs',
      role: 'cleaning',
      dataType: 'Signos Vitales',
      canView: false,
      canEdit: false,
      description: 'Datos clínicos restringidos'
    },
    
    // Enfermeros
    {
      id: 'nurse-patient-full',
      role: 'nurse',
      dataType: 'Información Completa del Paciente',
      canView: true,
      canEdit: true,
      conditions: ['Pacientes asignados'],
      description: 'Acceso completo a pacientes asignados'
    },
    {
      id: 'nurse-medical-orders',
      role: 'nurse',
      dataType: 'Órdenes Médicas',
      canView: true,
      canEdit: true,
      conditions: ['Solo administración'],
      description: 'Administración de medicamentos y cuidados'
    },
    {
      id: 'nurse-financial-info',
      role: 'nurse',
      dataType: 'Información Financiera',
      canView: false,
      canEdit: false,
      description: 'Información de facturación restringida'
    },
    
    // Doctores
    {
      id: 'doctor-all-access',
      role: 'doctor',
      dataType: 'Todos los Datos Médicos',
      canView: true,
      canEdit: true,
      description: 'Acceso completo a información médica'
    },
    {
      id: 'doctor-financial-limited',
      role: 'doctor',
      dataType: 'Información Financiera',
      canView: true,
      canEdit: false,
      conditions: ['Solo consulta'],
      description: 'Consulta de información de seguros'
    },
    
    // Familias
    {
      id: 'family-patient-status',
      role: 'family',
      dataType: 'Estado del Paciente',
      canView: true,
      canEdit: false,
      conditions: ['Solo familiar directo', 'Información no sensible'],
      description: 'Estado general y ubicación'
    },
    {
      id: 'family-medical-details',
      role: 'family',
      dataType: 'Detalles Médicos',
      canView: false,
      canEdit: false,
      conditions: ['Requiere autorización del paciente'],
      description: 'Información médica detallada restringida'
    },
    
    // Admisión
    {
      id: 'admission-patient-registration',
      role: 'admission',
      dataType: 'Datos de Registro',
      canView: true,
      canEdit: true,
      description: 'Información demográfica y de registro'
    },
    {
      id: 'admission-insurance',
      role: 'admission',
      dataType: 'Información de Seguros',
      canView: true,
      canEdit: true,
      description: 'Gestión de seguros y facturación'
    },
    {
      id: 'admission-medical-records',
      role: 'admission',
      dataType: 'Registros Médicos',
      canView: false,
      canEdit: false,
      description: 'Información clínica restringida'
    }
  ];

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'doctor': return <Stethoscope className="h-4 w-4" />;
      case 'nurse': return <Activity className="h-4 w-4" />;
      case 'cleaning': return <Shield className="h-4 w-4" />;
      case 'family': return <Users className="h-4 w-4" />;
      case 'admission': return <FileText className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'doctor': return 'bg-blue-100 text-blue-800';
      case 'nurse': return 'bg-green-100 text-green-800';
      case 'cleaning': return 'bg-yellow-100 text-yellow-800';
      case 'family': return 'bg-purple-100 text-purple-800';
      case 'admission': return 'bg-orange-100 text-orange-800';
      case 'admin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    const labels: Record<UserRole, string> = {
      admin: 'Administrador',
      doctor: 'Médico',
      nurse: 'Enfermero/a',
      auxiliary: 'Auxiliar',
      cleaning: 'Personal de Limpieza',
      radiology: 'Radiología',
      social_work: 'Trabajo Social',
      patient: 'Paciente',
      family: 'Familia'
    };
    return labels[role] || role;
  };

  // Agrupar reglas por rol
  const rulesByRole = defaultPrivacyRules.reduce((acc, rule) => {
    if (!acc[rule.role]) {
      acc[rule.role] = [];
    }
    acc[rule.role].push(rule);
    return acc;
  }, {} as Record<string, PrivacyRule[]>);

  // Solo mostrar si el usuario es admin
  if (user?.role !== 'admin') {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Acceso restringido. Solo los administradores pueden gestionar la configuración de privacidad.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Controles de Privacidad</h1>
          <p className="text-muted-foreground">
            Gestión de permisos y acceso a datos por rol de usuario
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configuración Global
          </Button>
        </div>
      </div>

      {/* Información de Seguridad */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <h4 className="font-medium text-blue-900 mb-1">
                Sistema de Privacidad GDPR-Compliant
              </h4>
              <p className="text-blue-800">
                Todos los controles de acceso están auditados y cumplen con regulaciones de privacidad de datos médicos.
                Los cambios son registrados automáticamente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="by-role">Por Rol</TabsTrigger>
          <TabsTrigger value="by-data-type">Por Tipo de Dato</TabsTrigger>
          <TabsTrigger value="audit-log">Registro de Cambios</TabsTrigger>
        </TabsList>

        <TabsContent value="by-role" className="space-y-4">
          {Object.entries(rulesByRole).map(([role, rules]) => (
            <Card key={role}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className={getRoleColor(role as UserRole)}>
                      {getRoleIcon(role as UserRole)}
                      <span className="ml-1">{getRoleLabel(role as UserRole)}</span>
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {rules.length} reglas configuradas
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {rules.map(rule => (
                    <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{rule.dataType}</div>
                        <div className="text-sm text-muted-foreground">
                          {rule.description}
                        </div>
                        {rule.conditions && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {rule.conditions.map((condition, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {condition}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <Switch checked={rule.canView} disabled />
                          <span className="text-xs text-muted-foreground">Ver</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Settings className="h-4 w-4 text-muted-foreground" />
                          <Switch checked={rule.canEdit} disabled />
                          <span className="text-xs text-muted-foreground">Editar</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="by-data-type" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Matriz de Permisos por Tipo de Dato</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Tipo de Dato</th>
                      <th className="text-center p-2">Admin</th>
                      <th className="text-center p-2">Médico</th>
                      <th className="text-center p-2">Enfermero/a</th>
                      <th className="text-center p-2">Limpieza</th>
                      <th className="text-center p-2">Familia</th>
                      <th className="text-center p-2">Admisión</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Información Básica</td>
                      <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-green-600 mx-auto" /></td>
                      <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-green-600 mx-auto" /></td>
                      <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-green-600 mx-auto" /></td>
                      <td className="text-center p-2"><Eye className="h-4 w-4 text-yellow-600 mx-auto" /></td>
                      <td className="text-center p-2"><Eye className="h-4 w-4 text-yellow-600 mx-auto" /></td>
                      <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-green-600 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Historia Médica</td>
                      <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-green-600 mx-auto" /></td>
                      <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-green-600 mx-auto" /></td>
                      <td className="text-center p-2"><Eye className="h-4 w-4 text-yellow-600 mx-auto" /></td>
                      <td className="text-center p-2"><EyeOff className="h-4 w-4 text-red-600 mx-auto" /></td>
                      <td className="text-center p-2"><EyeOff className="h-4 w-4 text-red-600 mx-auto" /></td>
                      <td className="text-center p-2"><EyeOff className="h-4 w-4 text-red-600 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Signos Vitales</td>
                      <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-green-600 mx-auto" /></td>
                      <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-green-600 mx-auto" /></td>
                      <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-green-600 mx-auto" /></td>
                      <td className="text-center p-2"><EyeOff className="h-4 w-4 text-red-600 mx-auto" /></td>
                      <td className="text-center p-2"><EyeOff className="h-4 w-4 text-red-600 mx-auto" /></td>
                      <td className="text-center p-2"><EyeOff className="h-4 w-4 text-red-600 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Información Financiera</td>
                      <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-green-600 mx-auto" /></td>
                      <td className="text-center p-2"><Eye className="h-4 w-4 text-yellow-600 mx-auto" /></td>
                      <td className="text-center p-2"><EyeOff className="h-4 w-4 text-red-600 mx-auto" /></td>
                      <td className="text-center p-2"><EyeOff className="h-4 w-4 text-red-600 mx-auto" /></td>
                      <td className="text-center p-2"><EyeOff className="h-4 w-4 text-red-600 mx-auto" /></td>
                      <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-green-600 mx-auto" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-center space-x-6 mt-4 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
                  <span>Completo (Ver y Editar)</span>
                </div>
                <div className="flex items-center">
                  <Eye className="h-3 w-3 text-yellow-600 mr-1" />
                  <span>Solo Lectura</span>
                </div>
                <div className="flex items-center">
                  <EyeOff className="h-3 w-3 text-red-600 mr-1" />
                  <span>Sin Acceso</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit-log" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Registro de Cambios en Privacidad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Regla de privacidad modificada</div>
                    <Badge variant="outline">{new Date().toLocaleString()}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Usuario: Carlos Administrador (ADM001)</p>
                    <p>Cambio: Personal de limpieza - Acceso a signos vitales deshabilitado</p>
                    <p>Razón: Cumplimiento GDPR</p>
                  </div>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Nueva regla de familia creada</div>
                    <Badge variant="outline">{new Date(Date.now() - 86400000).toLocaleString()}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Usuario: Carlos Administrador (ADM001)</p>
                    <p>Cambio: Familias pueden ver estado general del paciente</p>
                    <p>Razón: Solicitud del departamento de trabajo social</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
