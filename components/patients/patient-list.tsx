'use client';

import { useState, useMemo } from 'react';
import { useHospital } from '@/lib/hospital-context';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import PatientForm from './patient-form';
import PatientDetails from './patient-details';
import { Search, Filter, Plus, Eye, Edit, Users, Trash2, Shield, ShieldAlert, UserCheck, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PatientList() {
  const { 
    patients, 
    deletePatient, 
    getFilteredPatients, 
    canAccessPatient, 
    getAssignmentType,
    getPatientVisibilityFilter
  } = useHospital();
  const { user, hasPermission } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAccessDeniedDialog, setShowAccessDeniedDialog] = useState(false);

  // Obtener pacientes filtrados según permisos del usuario
  const accessiblePatients = useMemo(() => getFilteredPatients(), [getFilteredPatients]);
  const visibilityFilter = getPatientVisibilityFilter();
  const isAdmin = user?.role === 'admin';
  const canCreatePatients = hasPermission('manage_admissions') || hasPermission('view_all_patients');
  const canDeletePatients = hasPermission('view_all_patients'); // Solo admin

  const filteredPatients = accessiblePatients.filter(patient => {
    const matchesSearch = searchTerm === '' || 
      patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (visibilityFilter?.mostrarDNI && patient.dni.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'hospitalized' && patient.roomId) ||
      (statusFilter === 'outpatient' && !patient.roomId);
    
    return matchesSearch && matchesStatus;
  });

  const hospitalizedPatients = accessiblePatients.filter(p => p.roomId).length;

  // Obtener el badge de tipo de asignación
  const getAssignmentBadge = (patientId: string) => {
    const assignmentType = getAssignmentType(patientId);
    if (!assignmentType) return null;
    
    const variants: Record<string, { variant: "default" | "secondary" | "outline"; label: string; icon: React.ReactNode }> = {
      'responsable': { variant: 'default', label: 'Responsable', icon: <UserCheck className="h-3 w-3 mr-1" /> },
      'equipo': { variant: 'secondary', label: 'Equipo', icon: <Users className="h-3 w-3 mr-1" /> },
      'consulta': { variant: 'outline', label: 'Consulta', icon: <Eye className="h-3 w-3 mr-1" /> },
      'temporal': { variant: 'outline', label: 'Temporal', icon: <Shield className="h-3 w-3 mr-1" /> }
    };
    
    const config = variants[assignmentType] || variants['equipo'];
    return (
      <Badge variant={config.variant} className="text-xs flex items-center">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-2 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Pacientes</h1>
          <p className="text-muted-foreground">
            {isAdmin 
              ? 'Administra la información de todos los pacientes'
              : `Pacientes asignados a tu perfil profesional (${user?.professionalId || user?.id})`
            }
          </p>
        </div>
        {canCreatePatients && (
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Paciente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Paciente</DialogTitle>
              </DialogHeader>
              <PatientForm onClose={() => setShowAddDialog(false)} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Banner de Control de Acceso */}
      {!isAdmin && (
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  Control de Acceso Activo
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Solo puedes ver los pacientes que tienes asignados. Los datos mostrados 
                  se filtran según tu rol: <strong>{user?.role}</strong>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isAdmin ? 'Total Pacientes' : 'Mis Pacientes'}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accessiblePatients.length}</div>
            <p className="text-xs text-muted-foreground">
              {isAdmin ? 'Registrados en el sistema' : 'Asignados a mi perfil'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hospitalizados</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{hospitalizedPatients}</div>
            <p className="text-xs text-muted-foreground">Pacientes internados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ambulatorios</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {accessiblePatients.length - hospitalizedPatients}
            </div>
            <p className="text-xs text-muted-foreground">Pacientes externos</p>
          </CardContent>
        </Card>

        {!isAdmin && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nivel de Acceso</CardTitle>
              <Shield className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-purple-600 capitalize">
                {user?.role === 'doctor' ? 'Clínico' : 
                 user?.role === 'nurse' ? 'Enfermería' : 
                 user?.role || 'Limitado'}
              </div>
              <p className="text-xs text-muted-foreground">
                {visibilityFilter?.mostrarHistorialMedico ? 'Datos clínicos' : 'Datos básicos'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o DNI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="hospitalized">Hospitalizados</SelectItem>
                <SelectItem value="outpatient">Ambulatorios</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
            >
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de pacientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Lista de Pacientes ({filteredPatients.length})
            {!isAdmin && <Badge variant="outline" className="ml-2"><Lock className="h-3 w-3 mr-1" />Acceso Restringido</Badge>}
          </CardTitle>
          {!isAdmin && (
            <CardDescription>
              Mostrando solo pacientes asignados a tu perfil profesional
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {filteredPatients.length === 0 ? (
            <div className="text-center py-10">
              <ShieldAlert className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No hay pacientes disponibles</h3>
              <p className="text-muted-foreground">
                {isAdmin 
                  ? 'No hay pacientes registrados en el sistema'
                  : 'No tienes pacientes asignados actualmente. Contacta con el administrador si necesitas acceso a algún paciente.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  {visibilityFilter?.mostrarDNI && <TableHead>DNI</TableHead>}
                  <TableHead>Edad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Habitación</TableHead>
                  {!isAdmin && <TableHead>Mi Rol</TableHead>}
                  {isAdmin && <TableHead>Médico</TableHead>}
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map(patient => {
                  const age = new Date().getFullYear() - patient.dateOfBirth.getFullYear();
                  const hasFullAccess = canAccessPatient(patient.id);
                  const assignmentType = getAssignmentType(patient.id);
                  
                  return (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {visibilityFilter?.mostrarNombreCompleto 
                              ? `${patient.firstName} ${patient.lastName}`
                              : patient.anonymousId || `Paciente ${patient.id.slice(-4)}`
                            }
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {visibilityFilter?.mostrarContactosEmergencia 
                              ? patient.phone 
                              : '***'}
                          </div>
                        </div>
                      </TableCell>
                      {visibilityFilter?.mostrarDNI && (
                        <TableCell>{patient.dni}</TableCell>
                      )}
                      <TableCell>{age} años</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant={patient.roomId ? "default" : "secondary"}>
                            {patient.roomId ? "Hospitalizado" : "Ambulatorio"}
                          </Badge>
                          {patient.currentCondition && (
                            <Badge 
                              variant="outline" 
                              className={
                                patient.currentCondition === 'Critical' ? 'border-red-500 text-red-500' :
                                patient.currentCondition === 'Serious' ? 'border-orange-500 text-orange-500' :
                                'border-green-500 text-green-500'
                              }
                            >
                              {patient.currentCondition}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {patient.roomId ? `Hab. ${patient.roomId}` : "-"}
                      </TableCell>
                      {!isAdmin && (
                        <TableCell>
                          {getAssignmentBadge(patient.id)}
                        </TableCell>
                      )}
                      {isAdmin && (
                        <TableCell>
                          {patient.attendingPhysician || "-"}
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedPatient(patient.id)}
                                title={hasFullAccess ? "Ver detalles" : "Acceso limitado"}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  Detalles del Paciente
                                  {!isAdmin && (
                                    <Badge variant="outline">
                                      <Shield className="h-3 w-3 mr-1" />
                                      {assignmentType === 'responsable' ? 'Acceso Completo' : 'Acceso Parcial'}
                                    </Badge>
                                  )}
                                </DialogTitle>
                                {!isAdmin && (
                                  <DialogDescription>
                                    Algunos datos pueden estar ocultos según tu nivel de acceso
                                  </DialogDescription>
                                )}
                              </DialogHeader>
                              <PatientDetails patientId={patient.id} />
                            </DialogContent>
                          </Dialog>
                          
                          {(assignmentType === 'responsable' || isAdmin) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedPatient(patient.id);
                                setShowEditDialog(true);
                              }}
                              title="Editar paciente"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {canDeletePatients && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => {
                                if (confirm(`¿Estás seguro de eliminar al paciente ${patient.firstName} ${patient.lastName}?`)) {
                                  deletePatient(patient.id);
                                  toast({
                                    title: "Paciente eliminado",
                                    description: "El paciente ha sido eliminado correctamente",
                                  });
                                }
                              }}
                              title="Eliminar paciente"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog de edición */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Paciente</DialogTitle>
          </DialogHeader>
          <PatientForm 
            patientId={selectedPatient} 
            onClose={() => {
              setShowEditDialog(false);
              setSelectedPatient(null);
            }} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
