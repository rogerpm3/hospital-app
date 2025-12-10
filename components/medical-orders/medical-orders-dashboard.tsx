'use client';

import { useState, useMemo } from 'react';
import { useHospital } from '@/lib/hospital-context';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Plus, Stethoscope, AlertTriangle, CheckCircle, Clock, Search, User, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function MedicalOrdersDashboard() {
  const { medicalOrders, patients, getFilteredPatients, addMedicalOrder, updateMedicalOrder } = useHospital();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showNewOrderDialog, setShowNewOrderDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Form state para nueva orden
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [orderType, setOrderType] = useState<string>('Medication');
  const [orderCategory, setOrderCategory] = useState<string>('Routine');
  const [orderDescription, setOrderDescription] = useState('');
  const [orderInstructions, setOrderInstructions] = useState('');
  
  const isAdmin = user?.role === 'admin';
  const isDoctor = user?.role === 'doctor';
  const isNurse = user?.role === 'nurse' || user?.role === 'auxiliary';
  
  // Pacientes asignados al profesional
  const myPatients = useMemo(() => getFilteredPatients(), [getFilteredPatients]);
  
  // Filtrar órdenes según rol: médicos/enfermería ven las de sus pacientes, admin ve todas
  const myOrders = useMemo(() => {
    if (isAdmin) return medicalOrders;
    
    // Para médicos y enfermería: mostrar órdenes de sus pacientes asignados
    const myPatientIds = myPatients.map(p => p.id);
    const myProfessionalId = user?.professionalId || user?.id;
    
    return medicalOrders.filter(order => 
      myPatientIds.includes(order.patientId) || 
      order.physicianId === myProfessionalId ||
      order.physicianId === user?.id
    );
  }, [medicalOrders, myPatients, user, isAdmin]);
  
  // Aplicar filtros de búsqueda
  const filteredOrders = useMemo(() => {
    return myOrders.filter(order => {
      const patient = patients.find(p => p.id === order.patientId);
      const matchesSearch = searchTerm === '' ||
        order.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.physicianName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient?.lastName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [myOrders, patients, searchTerm, statusFilter]);

  const pendingOrders = myOrders.filter(order => order.status === 'Pending');
  const inProgressOrders = myOrders.filter(order => order.status === 'In Progress');
  const completedOrders = myOrders.filter(order => order.status === 'Completed');

  const handleCreateOrder = () => {
    if (!selectedPatientId) {
      toast({
        title: "Error",
        description: "Debe seleccionar un paciente",
        variant: "destructive",
      });
      return;
    }
    
    if (!orderDescription.trim()) {
      toast({
        title: "Error",
        description: "Debe ingresar una descripción de la orden",
        variant: "destructive",
      });
      return;
    }
    
    const selectedPatient = myPatients.find(p => p.id === selectedPatientId);
    
    addMedicalOrder({
      patientId: selectedPatientId,
      physicianId: user?.professionalId || user?.id || '',
      physicianName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Médico',
      orderDate: new Date(),
      type: orderType as any,
      category: orderCategory as any,
      description: orderDescription,
      instructions: orderInstructions,
      status: 'Pending',
      cost: 0,
      requiresConsent: false
    });
    
    toast({
      title: "Orden creada",
      description: `Orden médica creada para ${selectedPatient?.firstName} ${selectedPatient?.lastName}`,
    });
    
    // Reset form
    setSelectedPatientId('');
    setOrderType('Medication');
    setOrderCategory('Routine');
    setOrderDescription('');
    setOrderInstructions('');
    setShowNewOrderDialog(false);
  };

  const orderTypes = [
    { value: 'Medication', label: 'Medicación' },
    { value: 'Laboratory', label: 'Laboratorio' },
    { value: 'Imaging', label: 'Imagen' },
    { value: 'Procedure', label: 'Procedimiento' },
    { value: 'Diet', label: 'Dieta' },
    { value: 'Activity', label: 'Actividad' },
    { value: 'Nursing', label: 'Cuidados de Enfermería' },
    { value: 'Consultation', label: 'Interconsulta' },
    { value: 'Other', label: 'Otro' }
  ];

  const orderCategories = [
    { value: 'Routine', label: 'Rutina' },
    { value: 'Urgent', label: 'Urgente' },
    { value: 'STAT', label: 'STAT (Inmediato)' },
    { value: 'PRN', label: 'PRN (Si necesario)' }
  ];

  // Función para cambiar el estado de una orden
  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateMedicalOrder(orderId, { status: newStatus as any });
    toast({
      title: "Estado actualizado",
      description: `La orden médica ha sido actualizada a: ${
        newStatus === 'Completed' ? 'Completada' :
        newStatus === 'In Progress' ? 'En Progreso' :
        newStatus === 'Cancelled' ? 'Cancelada' : 'Pendiente'
      }`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Órdenes Médicas (CPOE)</h1>
          <p className="text-muted-foreground">
            {isAdmin 
              ? 'Sistema de prescripción electrónica - Todas las órdenes'
              : isNurse 
                ? 'Órdenes médicas de pacientes asignados - Puede actualizar el estado'
                : `Órdenes médicas de mis pacientes asignados`
            }
          </p>
        </div>
        {isDoctor && !isNurse && (
          <Dialog open={showNewOrderDialog} onOpenChange={setShowNewOrderDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nueva Orden
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-blue-600" />
                  Nueva Orden Médica
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {/* Selección de paciente */}
                <div className="space-y-2">
                  <Label>Paciente *</Label>
                  <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar paciente..." />
                    </SelectTrigger>
                    <SelectContent>
                      {myPatients.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No tiene pacientes asignados
                        </SelectItem>
                      ) : (
                        myPatients.map(patient => (
                          <SelectItem key={patient.id} value={patient.id}>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {patient.firstName} {patient.lastName}
                              {patient.roomId && (
                                <Badge variant="outline" className="ml-2">
                                  Hab. {patient.roomId}
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Tipo y categoría */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Orden</Label>
                    <Select value={orderType} onValueChange={setOrderType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {orderTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Prioridad</Label>
                    <Select value={orderCategory} onValueChange={setOrderCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {orderCategories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Descripción */}
                <div className="space-y-2">
                  <Label>Descripción de la Orden *</Label>
                  <Textarea
                    value={orderDescription}
                    onChange={(e) => setOrderDescription(e.target.value)}
                    placeholder="Describa la orden médica..."
                    rows={3}
                  />
                </div>
                
                {/* Instrucciones */}
                <div className="space-y-2">
                  <Label>Instrucciones Adicionales</Label>
                  <Textarea
                    value={orderInstructions}
                    onChange={(e) => setOrderInstructions(e.target.value)}
                    placeholder="Instrucciones especiales, dosis, frecuencia..."
                    rows={2}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewOrderDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateOrder}>
                  <FileText className="h-4 w-4 mr-2" />
                  Crear Orden
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Órdenes</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myOrders.length}</div>
            <p className="text-xs text-muted-foreground">
              {isAdmin ? 'En el sistema' : 'De mis pacientes'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingOrders.length}</div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgressOrders.length}</div>
            <p className="text-xs text-muted-foreground">En ejecución</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedOrders.length}</div>
            <p className="text-xs text-muted-foreground">Finalizadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por descripción, médico, paciente..."
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
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="Pending">Pendientes</SelectItem>
                <SelectItem value="In Progress">En Proceso</SelectItem>
                <SelectItem value="Completed">Completadas</SelectItem>
                <SelectItem value="Cancelled">Canceladas</SelectItem>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Órdenes Médicas ({filteredOrders.length} de {medicalOrders.length} totales)
          </CardTitle>
          <CardDescription>
            {isAdmin 
              ? 'Todas las órdenes médicas del sistema'
              : 'Órdenes de mis pacientes asignados'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-10">
              <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No hay órdenes médicas</h3>
              <p className="text-muted-foreground">
                {medicalOrders.length === 0 
                  ? 'No hay órdenes médicas en el sistema'
                  : myOrders.length === 0 
                    ? 'No tiene órdenes médicas para sus pacientes asignados'
                    : 'No se encontraron órdenes con los filtros aplicados'
                }
              </p>
              {medicalOrders.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Total en sistema: {medicalOrders.length} órdenes
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Tabla de órdenes */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3 font-medium">ID</th>
                      <th className="text-left p-3 font-medium">Paciente</th>
                      <th className="text-left p-3 font-medium">Médico</th>
                      <th className="text-left p-3 font-medium">Texto Orden</th>
                      <th className="text-left p-3 font-medium">Tipo</th>
                      <th className="text-left p-3 font-medium">Fecha</th>
                      <th className="text-left p-3 font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => {
                      const patient = patients.find(p => p.id === order.patientId);
                      return (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-mono text-xs">{order.id}</td>
                          <td className="p-3">
                            <div className="font-medium">{patient?.firstName} {patient?.lastName}</div>
                            <div className="text-xs text-gray-500">{order.patientId}</div>
                          </td>
                          <td className="p-3">
                            <div>{order.physicianName}</div>
                            <div className="text-xs text-gray-500">ID: {order.physicianId}</div>
                          </td>
                          <td className="p-3 max-w-md">
                            <div className="font-medium text-gray-900">{order.description}</div>
                            {order.instructions && (
                              <div className="text-xs text-gray-500 mt-1 truncate" title={order.instructions}>
                                {order.instructions}
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="flex flex-col gap-1">
                              <Badge variant={
                                order.category === 'Stat' || order.category === 'STAT' ? 'destructive' : 'secondary'
                              } className="text-xs w-fit">
                                {order.category}
                              </Badge>
                              <Badge variant="outline" className="text-xs w-fit">{order.type}</Badge>
                            </div>
                          </td>
                          <td className="p-3 text-xs">
                            {order.orderDate instanceof Date 
                              ? order.orderDate.toLocaleDateString('es-ES', {
                                  day: '2-digit',
                                  month: '2-digit', 
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : String(order.orderDate)
                            }
                          </td>
                          <td className="p-3">
                            {(isNurse || isDoctor || isAdmin) && order.status !== 'Cancelled' ? (
                              <Select
                                value={order.status}
                                onValueChange={(value) => handleStatusChange(order.id, value)}
                              >
                                <SelectTrigger className="w-[130px] h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pending">Pendiente</SelectItem>
                                  <SelectItem value="In Progress">En Progreso</SelectItem>
                                  <SelectItem value="Completed">Completada</SelectItem>
                                  {(isDoctor || isAdmin) && (
                                    <SelectItem value="Cancelled">Cancelada</SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Badge variant={
                                order.status === 'Completed' ? 'default' :
                                order.status === 'In Progress' ? 'outline' : 
                                order.status === 'Cancelled' ? 'destructive' : 'secondary'
                              } className="text-xs">
                                {order.status === 'Pending' ? 'Pendiente' :
                                 order.status === 'In Progress' ? 'En Progreso' :
                                 order.status === 'Completed' ? 'Completada' : 'Cancelada'}
                              </Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
