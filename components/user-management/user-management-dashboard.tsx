'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, Plus, Search, Filter, Eye, Edit, Trash2,
  Shield, Heart, User, UserPlus, Family, Phone,
  Mail, Lock, Unlock, AlertTriangle, CheckCircle
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/lib/types';

interface ExtendedUser {
  id: string;
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  department?: string;
  professionalId?: string;
  isActive: boolean;
  lastLogin?: Date;
  anonymousId?: string;
  // Campos específicos para familias
  relatedPatientId?: string;
  relationshipToPatient?: string;
  accessLevel?: 'full' | 'limited' | 'basic';
  // Estado de seguridad
  failedLoginAttempts?: number;
  isLocked?: boolean;
  createdAt: Date;
}

export default function UserManagementDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all-users');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    dni: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'patient' as UserRole,
    department: '',
    professionalId: '',
    relatedPatientId: '',
    relationshipToPatient: '',
    accessLevel: 'basic' as 'full' | 'limited' | 'basic'
  });

  // Datos simulados de usuarios extendidos
  const extendedUsers: ExtendedUser[] = [
    // Staff existente
    {
      id: '1',
      dni: '12345678A',
      firstName: 'Carlos',
      lastName: 'Administrador',
      email: 'admin@hospital.com',
      phone: '+34 600 000 001',
      role: 'admin',
      department: 'Administración',
      professionalId: 'ADM001',
      isActive: true,
      lastLogin: new Date('2024-01-15T08:30:00Z'),
      anonymousId: 'ADMIN-001',
      failedLoginAttempts: 0,
      isLocked: false,
      createdAt: new Date('2024-01-01T00:00:00Z')
    },
    {
      id: '2',
      dni: '23456789B',
      firstName: 'Ana',
      lastName: 'García',
      email: 'ana.garcia@hospital.com',
      phone: '+34 600 000 002',
      role: 'doctor',
      department: 'Cardiología',
      professionalId: 'MED001',
      isActive: true,
      lastLogin: new Date('2024-01-15T09:15:00Z'),
      anonymousId: 'DOC-001',
      failedLoginAttempts: 0,
      isLocked: false,
      createdAt: new Date('2024-01-01T00:00:00Z')
    },
    // Pacientes
    {
      id: 'patient-1',
      dni: '11111111A',
      firstName: 'Juan',
      lastName: 'Pérez González',
      email: 'juan.perez@email.com',
      phone: '+34 600 111 001',
      role: 'patient',
      isActive: true,
      anonymousId: 'PAT-001',
      createdAt: new Date('2024-01-10T00:00:00Z')
    },
    {
      id: 'patient-2',
      dni: '22222222B',
      firstName: 'Elena',
      lastName: 'Martín Ruiz',
      email: 'elena.martin@email.com',
      phone: '+34 600 222 001',
      role: 'patient',
      isActive: true,
      anonymousId: 'PAT-002',
      createdAt: new Date('2024-01-12T00:00:00Z')
    },
    // Familias
    {
      id: 'family-1',
      dni: '33333333C',
      firstName: 'María',
      lastName: 'Pérez López',
      email: 'maria.perez@email.com',
      phone: '+34 600 333 001',
      role: 'family',
      isActive: true,
      anonymousId: 'FAM-001',
      relatedPatientId: 'patient-1',
      relationshipToPatient: 'Esposa',
      accessLevel: 'limited',
      createdAt: new Date('2024-01-10T00:00:00Z')
    },
    {
      id: 'family-2',
      dni: '44444444D',
      firstName: 'Carlos',
      lastName: 'Martín Fernández',
      email: 'carlos.martin@email.com',
      phone: '+34 600 444 001',
      role: 'family',
      isActive: true,
      anonymousId: 'FAM-002',
      relatedPatientId: 'patient-2',
      relationshipToPatient: 'Hermano',
      accessLevel: 'basic',
      createdAt: new Date('2024-01-12T00:00:00Z')
    }
  ];

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'doctor': return <Heart className="h-4 w-4" />;
      case 'nurse': return <User className="h-4 w-4" />;
      case 'patient': return <User className="h-4 w-4" />;
      case 'family': return <Users className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'doctor': return 'bg-blue-100 text-blue-800';
      case 'nurse': return 'bg-green-100 text-green-800';
      case 'patient': return 'bg-purple-100 text-purple-800';
      case 'family': return 'bg-pink-100 text-pink-800';
      case 'cleaning': return 'bg-yellow-100 text-yellow-800';
      case 'admission': return 'bg-orange-100 text-orange-800';
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
      family: 'Familiar'
    };
    return labels[role] || role;
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'full': return 'bg-green-100 text-green-800';
      case 'limited': return 'bg-yellow-100 text-yellow-800';
      case 'basic': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = extendedUsers.filter(u => {
    const matchesSearch = searchTerm === '' || 
      u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.dni.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.anonymousId && u.anonymousId.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const usersByRole = extendedUsers.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalUsers = extendedUsers.length;
  const activeUsers = extendedUsers.filter(u => u.isActive).length;
  const patientUsers = extendedUsers.filter(u => u.role === 'patient').length;
  const familyUsers = extendedUsers.filter(u => u.role === 'family').length;

  // Solo mostrar si el usuario es admin
  if (user?.role !== 'admin') {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Acceso restringido. Solo los administradores pueden gestionar usuarios.
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
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Administración de personal, pacientes y familias del sistema
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nombre</label>
                  <Input
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Apellidos</label>
                  <Input
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">DNI</label>
                <Input
                  value={newUser.dni}
                  onChange={(e) => setNewUser({...newUser, dni: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Rol</label>
                <select 
                  className="w-full mt-1 p-2 border rounded-md"
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}
                >
                  <option value="patient">Paciente</option>
                  <option value="family">Familiar</option>
                  <option value="doctor">Médico</option>
                  <option value="nurse">Enfermero/a</option>
                  <option value="cleaning">Personal de Limpieza</option>
                </select>
              </div>

              {newUser.role === 'family' && (
                <>
                  <div>
                    <label className="text-sm font-medium">Paciente Relacionado</label>
                    <select 
                      className="w-full mt-1 p-2 border rounded-md"
                      value={newUser.relatedPatientId}
                      onChange={(e) => setNewUser({...newUser, relatedPatientId: e.target.value})}
                    >
                      <option value="">Seleccionar paciente</option>
                      {extendedUsers.filter(u => u.role === 'patient').map(patient => (
                        <option key={patient.id} value={patient.id}>
                          {patient.firstName} {patient.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Relación</label>
                    <Input
                      placeholder="ej: Esposa, Hijo, Hermano..."
                      value={newUser.relationshipToPatient}
                      onChange={(e) => setNewUser({...newUser, relationshipToPatient: e.target.value})}
                    />
                  </div>
                </>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => {
                  console.log('Creando usuario:', newUser);
                  setShowCreateDialog(false);
                  // Reset form
                  setNewUser({
                    dni: '', firstName: '', lastName: '', email: '', phone: '',
                    role: 'patient', department: '', professionalId: '',
                    relatedPatientId: '', relationshipToPatient: '', accessLevel: 'basic'
                  });
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Usuario
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">{activeUsers} activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes</CardTitle>
            <User className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{patientUsers}</div>
            <p className="text-xs text-muted-foreground">Registrados en el sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Familias</CardTitle>
            <Users className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">{familyUsers}</div>
            <p className="text-xs text-muted-foreground">Con acceso al sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personal</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalUsers - patientUsers - familyUsers}
            </div>
            <p className="text-xs text-muted-foreground">Staff hospitalario</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all-users">Todos los Usuarios</TabsTrigger>
          <TabsTrigger value="patients">Pacientes</TabsTrigger>
          <TabsTrigger value="families">Familias</TabsTrigger>
          <TabsTrigger value="staff">Personal</TabsTrigger>
        </TabsList>

        {/* Filtros */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, DNI, email o ID anónimo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <select 
                className="px-3 py-2 border rounded-md"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">Todos los roles</option>
                <option value="patient">Pacientes</option>
                <option value="family">Familias</option>
                <option value="doctor">Médicos</option>
                <option value="nurse">Enfermeros</option>
                <option value="admin">Administradores</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <TabsContent value="all-users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lista Completa de Usuarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredUsers.map(usr => (
                  <div key={usr.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${getRoleColor(usr.role)}`}>
                        {getRoleIcon(usr.role)}
                      </div>
                      <div>
                        <div className="font-medium">
                          {usr.firstName} {usr.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {usr.dni} • {usr.email}
                        </div>
                        {usr.anonymousId && (
                          <div className="text-xs text-muted-foreground">
                            ID Anónimo: {usr.anonymousId}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={getRoleColor(usr.role)}>
                        {getRoleLabel(usr.role)}
                      </Badge>
                      
                      {usr.role === 'family' && usr.accessLevel && (
                        <Badge className={getAccessLevelColor(usr.accessLevel)}>
                          {usr.accessLevel}
                        </Badge>
                      )}
                      
                      {usr.isActive ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      )}
                      
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline" className="h-8 px-2">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 px-2">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-purple-600" />
                Pacientes Registrados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredUsers.filter(u => u.role === 'patient').map(patient => (
                  <div key={patient.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">
                        {patient.firstName} {patient.lastName}
                      </div>
                      <Badge variant="outline">{patient.anonymousId}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>DNI: {patient.dni}</p>
                      <p>Email: {patient.email}</p>
                      <p>Teléfono: {patient.phone}</p>
                      <p>Registrado: {patient.createdAt.toLocaleDateString()}</p>
                    </div>
                    
                    {/* Buscar familias relacionadas */}
                    {(() => {
                      const relatedFamilies = extendedUsers.filter(
                        u => u.role === 'family' && u.relatedPatientId === patient.id
                      );
                      return relatedFamilies.length > 0 && (
                        <div className="mt-2 pt-2 border-t">
                          <div className="text-xs text-muted-foreground mb-1">Familias:</div>
                          {relatedFamilies.map(fam => (
                            <Badge key={fam.id} variant="outline" className="mr-1 text-xs">
                              {fam.firstName} ({fam.relationshipToPatient})
                            </Badge>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="families" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-pink-600" />
                Familiares con Acceso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredUsers.filter(u => u.role === 'family').map(family => {
                  const relatedPatient = extendedUsers.find(u => u.id === family.relatedPatientId);
                  return (
                    <div key={family.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-medium">
                            {family.firstName} {family.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {family.relationshipToPatient} de {relatedPatient?.firstName} {relatedPatient?.lastName}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getAccessLevelColor(family.accessLevel || 'basic')}>
                            {family.accessLevel}
                          </Badge>
                          <Badge variant="outline">{family.anonymousId}</Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>
                          <p>DNI: {family.dni}</p>
                          <p>Email: {family.email}</p>
                        </div>
                        <div>
                          <p>Teléfono: {family.phone}</p>
                          <p>Registrado: {family.createdAt.toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex justify-end space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3 mr-1" />
                          Editar Permisos
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                Personal del Hospital
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredUsers.filter(u => !['patient', 'family'].includes(u.role)).map(staff => (
                  <div key={staff.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${getRoleColor(staff.role)}`}>
                          {getRoleIcon(staff.role)}
                        </div>
                        <div>
                          <div className="font-medium">
                            {staff.firstName} {staff.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {staff.department} • {staff.professionalId}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge className={getRoleColor(staff.role)}>
                          {getRoleLabel(staff.role)}
                        </Badge>
                        {staff.lastLogin && (
                          <div className="text-xs text-muted-foreground">
                            Último acceso: {staff.lastLogin.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
