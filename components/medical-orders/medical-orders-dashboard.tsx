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
  const { medicalOrders, patients, getFilteredPatients, addMedicalOrder } = useHospital();
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Órdenes Médicas (CPOE)</h1>
          <p className="text-muted-foreground">
            {isAdmin 
              ? 'Sistema de prescripción electrónica - Todas las órdenes'
              : isNurse 
                ? 'Órdenes médicas de pacientes asignados (solo lectura)'
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
          <CardTitle>Órdenes Médicas ({filteredOrders.length})</CardTitle>
          <CardDescription>
            {isAdmin 
              ? 'Todas las órdenes del sistema'
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
                {myOrders.length === 0 
                  ? 'No tiene órdenes médicas para sus pacientes asignados'
                  : 'No se encontraron órdenes con los filtros aplicados'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.slice(0, 20).map(order => {
                const patient = patients.find(p => p.id === order.patientId);
                return (
                  <div key={order.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          order.category === 'STAT' ? 'destructive' :
                          order.category === 'Urgent' ? 'default' : 'secondary'
                        }>
                          {order.category}
                        </Badge>
                        <Badge variant="outline">{order.type}</Badge>
                      </div>
                      <Badge variant={
                        order.status === 'Completed' ? 'default' :
                        order.status === 'In Progress' ? 'outline' : 
                        order.status === 'Cancelled' ? 'destructive' : 'secondary'
                      }>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="font-medium text-gray-900">{order.description}</div>
                    {order.instructions && (
                      <p className="text-sm text-gray-600 mt-1">{order.instructions}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {patient?.firstName} {patient?.lastName}
                      </span>
                      <span>•</span>
                      <span>{order.physicianName}</span>
                      <span>•</span>
                      <span>{order.orderDate.toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
