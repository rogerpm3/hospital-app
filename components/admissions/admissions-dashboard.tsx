'use client';

import { useState } from 'react';
import { useHospital } from '@/lib/hospital-context';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Plus, Users, Clock, CheckCircle, Search, Bed, User, DollarSign, Calendar, FileText, CreditCard } from 'lucide-react';

export default function AdmissionsDashboard() {
  const { admissions, patients, rooms, beds, staff, addAdmission, appointments, addAppointment, addPatient } = useHospital();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [showNewAdmission, setShowNewAdmission] = useState(false);
  const [showNewPatient, setShowNewPatient] = useState(false);
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('admissions');
  
  // Formulario de nueva admisión
  const [formData, setFormData] = useState({
    patientId: '',
    roomId: '',
    bedId: '',
    admittingPhysician: '',
    reason: '',
    notes: '',
    priority: 'Normal' as 'Low' | 'Normal' | 'High' | 'Urgent',
    admissionType: 'Emergency' as 'Emergency' | 'Scheduled' | 'Transfer'
  });

  // Formulario de nuevo paciente
  const [patientForm, setPatientForm] = useState({
    dni: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'M' as 'M' | 'F' | 'Other',
    phone: '',
    email: '',
    address: { street: '', city: '', postalCode: '', country: 'España' },
    emergencyContact: { name: '', relationship: '', phone: '' },
    insuranceProvider: '',
    policyNumber: ''
  });

  // Formulario de nueva cita
  const [appointmentForm, setAppointmentForm] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    type: 'Consultation',
    notes: ''
  });

  const activeAdmissions = admissions.filter(adm => adm.status === 'Active');
  const todayAdmissions = admissions.filter(adm => 
    adm.admissionDate.toDateString() === new Date().toDateString()
  );

  // Citas de hoy y futuras
  const today = new Date();
  const todayAppointments = appointments.filter(apt => 
    apt.date.toDateString() === today.toDateString()
  );
  const futureAppointments = appointments.filter(apt => apt.date > today);

  // Filtrar admisiones por búsqueda
  const filteredAdmissions = admissions.filter(admission => {
    const patient = patients.find(p => p.id === admission.patientId);
    const patientName = patient ? `${patient.firstName} ${patient.lastName}`.toLowerCase() : '';
    return patientName.includes(searchTerm.toLowerCase()) || 
           admission.reason.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Pacientes disponibles (no hospitalizados)
  const availablePatients = patients.filter(p => !p.roomId);
  
  // Médicos disponibles
  const doctors = staff.filter(s => s.role === 'doctor');
  
  // Camas disponibles
  const availableBeds = beds.filter(b => b.status === 'Available');
  
  // Actualizar camas disponibles cuando se selecciona una habitación
  const bedsInSelectedRoom = formData.roomId 
    ? availableBeds.filter(b => b.roomId === formData.roomId)
    : availableBeds;

  // Información financiera básica por paciente
  const getPatientFinancialInfo = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    const patientAdmissions = admissions.filter(a => a.patientId === patientId);
    const daysHospitalized = patientAdmissions.reduce((acc, adm) => {
      if (adm.status === 'Active') {
        const days = Math.ceil((new Date().getTime() - adm.admissionDate.getTime()) / (1000 * 60 * 60 * 24));
        return acc + days;
      }
      return acc;
    }, 0);
    
    const room = patient?.roomId ? rooms.find(r => r.id === patient.roomId) : null;
    const dailyRate = room?.dailyRate || 150;
    const estimatedCost = daysHospitalized * dailyRate;

    return {
      insurance: patient?.insuranceInfo?.provider || 'No registrado',
      policyNumber: patient?.insuranceInfo?.policyNumber || 'N/A',
      daysHospitalized,
      dailyRate,
      estimatedCost
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.patientId || !formData.reason || !formData.admittingPhysician) {
        toast({
          title: "Error de validación",
          description: "Por favor completa todos los campos requeridos",
          variant: "destructive",
        });
        return;
      }

      const patient = patients.find(p => p.id === formData.patientId);
      const room = rooms.find(r => r.id === formData.roomId);
      
      const newAdmission = {
        patientId: formData.patientId,
        roomId: formData.roomId || undefined,
        bedId: formData.bedId || undefined,
        admissionDate: new Date(),
        admittingPhysician: formData.admittingPhysician,
        reason: formData.reason,
        status: 'Active' as const,
        priority: formData.priority,
        admissionType: formData.admissionType,
        notes: formData.notes,
        department: room?.department || 'General'
      };

      if (typeof addAdmission === 'function') {
        addAdmission(newAdmission);
      }

      toast({
        title: "Admisión registrada",
        description: `${patient?.firstName} ${patient?.lastName} ha sido admitido exitosamente`,
      });

      // Limpiar y cerrar
      setFormData({
        patientId: '',
        roomId: '',
        bedId: '',
        admittingPhysician: '',
        reason: '',
        notes: '',
        priority: 'Normal',
        admissionType: 'Emergency'
      });
      setShowNewAdmission(false);

    } catch (error) {
      toast({
        title: "Error al registrar admisión",
        description: "No se pudo crear la admisión. Por favor intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar creación de paciente
  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!patientForm.dni || !patientForm.firstName || !patientForm.lastName || !patientForm.dateOfBirth) {
        toast({
          title: "Error de validación",
          description: "Por favor completa todos los campos requeridos (DNI, nombre, apellidos, fecha de nacimiento)",
          variant: "destructive",
        });
        return;
      }

      const newPatient = {
        dni: patientForm.dni,
        firstName: patientForm.firstName,
        lastName: patientForm.lastName,
        dateOfBirth: new Date(patientForm.dateOfBirth),
        gender: patientForm.gender,
        phone: patientForm.phone,
        email: patientForm.email,
        address: patientForm.address,
        emergencyContact: patientForm.emergencyContact,
        allergies: [],
        medicalHistory: [],
        currentMedications: [],
        insuranceInfo: patientForm.insuranceProvider ? {
          provider: patientForm.insuranceProvider,
          policyNumber: patientForm.policyNumber,
          groupNumber: '',
          expirationDate: new Date(new Date().getFullYear() + 1, 11, 31)
        } : undefined
      };

      if (typeof addPatient === 'function') {
        addPatient(newPatient);
      }

      toast({
        title: "Paciente registrado",
        description: `${patientForm.firstName} ${patientForm.lastName} ha sido registrado exitosamente`,
      });

      setPatientForm({
        dni: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'M',
        phone: '',
        email: '',
        address: { street: '', city: '', postalCode: '', country: 'España' },
        emergencyContact: { name: '', relationship: '', phone: '' },
        insuranceProvider: '',
        policyNumber: ''
      });
      setShowNewPatient(false);
    } catch (error) {
      toast({
        title: "Error al registrar paciente",
        description: "No se pudo crear el paciente. Por favor intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar creación de cita
  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!appointmentForm.patientId || !appointmentForm.doctorId || !appointmentForm.date || !appointmentForm.time) {
        toast({
          title: "Error de validación",
          description: "Por favor completa todos los campos requeridos",
          variant: "destructive",
        });
        return;
      }

      const patient = patients.find(p => p.id === appointmentForm.patientId);
      const doctor = doctors.find(d => d.id === appointmentForm.doctorId);

      const newAppointment = {
        patientId: appointmentForm.patientId,
        doctorId: appointmentForm.doctorId,
        date: new Date(`${appointmentForm.date}T${appointmentForm.time}`),
        type: appointmentForm.type as 'Consultation' | 'Follow-up' | 'Procedure' | 'Emergency' | 'Telemedicine',
        status: 'Scheduled' as const,
        reason: appointmentForm.notes || 'Cita programada',
        duration: 30,
        notes: appointmentForm.notes
      };

      if (typeof addAppointment === 'function') {
        addAppointment(newAppointment);
      }

      toast({
        title: "Cita programada",
        description: `Cita para ${patient?.firstName} ${patient?.lastName} con Dr. ${doctor?.firstName} ${doctor?.lastName}`,
      });

      setAppointmentForm({
        patientId: '',
        doctorId: '',
        date: '',
        time: '',
        type: 'Consultation',
        notes: ''
      });
      setShowNewAppointment(false);
    } catch (error) {
      toast({
        title: "Error al programar cita",
        description: "No se pudo crear la cita. Por favor intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Admisiones</h1>
          <p className="text-muted-foreground">Control de ingresos hospitalarios, pacientes y citas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowNewPatient(true)}>
            <User className="h-4 w-4" />
            Nuevo Paciente
          </Button>
          <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowNewAppointment(true)}>
            <Calendar className="h-4 w-4" />
            Nueva Cita
          </Button>
          <Button className="flex items-center gap-2" onClick={() => setShowNewAdmission(true)}>
            <Plus className="h-4 w-4" />
            Nueva Admisión
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admisiones Activas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAdmissions.length}</div>
            <p className="text-xs text-muted-foreground">Pacientes hospitalizados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Hoy</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{todayAdmissions.length}</div>
            <p className="text-xs text-muted-foreground">Nuevos ingresos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Camas Disponibles</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableBeds.length}</div>
            <p className="text-xs text-muted-foreground">Listas para asignar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{todayAppointments.length}</div>
            <p className="text-xs text-muted-foreground">Programadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocupación</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {beds.length > 0 ? Math.round(((beds.length - availableBeds.length) / beds.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Capacidad utilizada</p>
          </CardContent>
        </Card>
      </div>

      {/* Pestañas principales */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="admissions">
            <FileText className="h-4 w-4 mr-2" />
            Admisiones
          </TabsTrigger>
          <TabsTrigger value="patients">
            <User className="h-4 w-4 mr-2" />
            Pacientes
          </TabsTrigger>
          <TabsTrigger value="appointments">
            <Calendar className="h-4 w-4 mr-2" />
            Citas
          </TabsTrigger>
          <TabsTrigger value="financial">
            <DollarSign className="h-4 w-4 mr-2" />
            Info. Financiera
          </TabsTrigger>
        </TabsList>

        {/* Pestaña de Admisiones */}
        <TabsContent value="admissions">
          {/* Búsqueda */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por paciente o motivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Admisiones Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAdmissions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No se encontraron admisiones
                  </div>
                ) : (
                  filteredAdmissions.slice(0, 15).map(admission => {
                    const patient = patients.find(p => p.id === admission.patientId);
                    const room = rooms.find(r => r.id === admission.roomId);
                    const bed = patient?.bedNumber || beds.find(b => b.patientId === patient?.id)?.number;
                    const age = patient?.dateOfBirth ? new Date().getFullYear() - patient.dateOfBirth.getFullYear() : null;
                    
                    return (
                      <div key={admission.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        {/* Encabezado con datos principales del paciente */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-lg text-gray-900">
                                {patient?.firstName} {patient?.lastName}
                              </div>
                              <div className="flex items-center gap-3 text-sm">
                                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium">
                                  DNI: {patient?.dni || 'No registrado'}
                                </span>
                                {patient?.socialSecurityNumber && (
                                  <span className="text-gray-500">
                                    NSS: {patient.socialSecurityNumber}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              admission.status === 'Active' ? 'default' : 
                              admission.status === 'Discharged' ? 'secondary' : 'outline'
                            }>
                              {admission.status === 'Active' ? 'Activo' : 
                               admission.status === 'Discharged' ? 'Alta' : admission.status}
                            </Badge>
                            {admission.priority === 'Urgent' && (
                              <Badge variant="destructive">Urgente</Badge>
                            )}
                            {admission.priority === 'High' && (
                              <Badge variant="outline" className="border-orange-500 text-orange-600">Alta Prioridad</Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Datos demográficos del paciente - SIN información médica */}
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <span className="text-gray-500 text-xs uppercase">Edad</span>
                              <p className="font-medium text-gray-900">{age ? `${age} años` : 'N/A'}</p>
                            </div>
                            <div>
                              <span className="text-gray-500 text-xs uppercase">Género</span>
                              <p className="font-medium text-gray-900">
                                {patient?.gender === 'M' ? 'Masculino' : patient?.gender === 'F' ? 'Femenino' : 'Otro'}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-500 text-xs uppercase">Teléfono</span>
                              <p className="font-medium text-gray-900">{patient?.phone || 'No registrado'}</p>
                            </div>
                            <div>
                              <span className="text-gray-500 text-xs uppercase">Email</span>
                              <p className="font-medium text-gray-900 truncate">{patient?.email || 'No registrado'}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Información de la admisión */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500 text-xs uppercase">Motivo de ingreso</span>
                            <p className="font-medium text-gray-900">{admission.reason}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs uppercase">Ubicación</span>
                            <p className="font-medium text-gray-900">
                              {room ? `Hab. ${room.number}${bed ? ` - Cama ${bed}` : ''}` : 'No asignada'}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs uppercase">Fecha de ingreso</span>
                            <p className="font-medium text-gray-900">{format(admission.admissionDate, 'dd/MM/yyyy HH:mm')}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs uppercase">Médico responsable</span>
                            <p className="font-medium text-gray-900">{admission.admittingPhysician}</p>
                          </div>
                        </div>
                        
                        {/* Contacto de emergencia si existe */}
                        {patient?.emergencyContact?.name && (
                          <div className="mt-3 pt-3 border-t text-sm">
                            <span className="text-gray-500 text-xs uppercase">Contacto de emergencia: </span>
                            <span className="text-gray-900">
                              {patient.emergencyContact.name} ({patient.emergencyContact.relationship}) - {patient.emergencyContact.phone}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de Pacientes (solo información básica - SIN datos médicos) */}
        <TabsContent value="patients">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Listado de Pacientes</CardTitle>
                <CardDescription>Información básica de pacientes - Sin datos clínicos ni médicos</CardDescription>
              </div>
              <Button onClick={() => setShowNewPatient(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Paciente
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>DNI</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Edad</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Seguro</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map(patient => {
                    const age = patient.dateOfBirth ? new Date().getFullYear() - patient.dateOfBirth.getFullYear() : null;
                    const isHospitalized = patient.roomId !== undefined && patient.roomId !== null;
                    
                    return (
                      <TableRow key={patient.id}>
                        <TableCell className="font-mono">{patient.dni}</TableCell>
                        <TableCell className="font-medium">{patient.firstName} {patient.lastName}</TableCell>
                        <TableCell>{age ? `${age} años` : 'N/A'}</TableCell>
                        <TableCell>{patient.phone || 'N/A'}</TableCell>
                        <TableCell className="truncate max-w-[150px]">{patient.email || 'N/A'}</TableCell>
                        <TableCell>{patient.insuranceInfo?.provider || 'Sin seguro'}</TableCell>
                        <TableCell>
                          <Badge variant={isHospitalized ? 'default' : 'secondary'}>
                            {isHospitalized ? 'Hospitalizado' : 'Ambulatorio'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de Citas */}
        <TabsContent value="appointments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Gestión de Citas</CardTitle>
                <CardDescription>Programación y confirmación de citas médicas</CardDescription>
              </div>
              <Button onClick={() => setShowNewAppointment(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Cita
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha/Hora</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>DNI</TableHead>
                    <TableHead>Médico</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...todayAppointments, ...futureAppointments].slice(0, 20).map(apt => {
                    const patient = patients.find(p => p.id === apt.patientId);
                    const doctor = staff.find(s => s.id === apt.doctorId);
                    
                    return (
                      <TableRow key={apt.id}>
                        <TableCell className="font-medium">
                          {format(apt.date, 'dd/MM/yyyy HH:mm')}
                        </TableCell>
                        <TableCell>{patient?.firstName} {patient?.lastName}</TableCell>
                        <TableCell className="font-mono">{patient?.dni || 'N/A'}</TableCell>
                        <TableCell>Dr. {doctor?.firstName} {doctor?.lastName}</TableCell>
                        <TableCell>
                          {apt.type === 'Consultation' ? 'Consulta' :
                           apt.type === 'Follow-up' ? 'Seguimiento' :
                           apt.type === 'Procedure' ? 'Procedimiento' :
                           apt.type === 'Emergency' ? 'Emergencia' : 'Telemedicina'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            apt.status === 'Scheduled' ? 'default' :
                            apt.status === 'Confirmed' ? 'secondary' :
                            apt.status === 'Completed' ? 'outline' : 'destructive'
                          }>
                            {apt.status === 'Scheduled' ? 'Programada' :
                             apt.status === 'Confirmed' ? 'Confirmada' :
                             apt.status === 'Completed' ? 'Completada' : 'Cancelada'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Confirmar
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {todayAppointments.length === 0 && futureAppointments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No hay citas programadas
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de Información Financiera */}
        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Información Financiera de Pacientes
              </CardTitle>
              <CardDescription>Datos de seguro y costes estimados de hospitalización</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paciente</TableHead>
                    <TableHead>DNI</TableHead>
                    <TableHead>Aseguradora</TableHead>
                    <TableHead>Nº Póliza</TableHead>
                    <TableHead>Días Hospitalizado</TableHead>
                    <TableHead>Tarifa/Día</TableHead>
                    <TableHead>Coste Estimado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeAdmissions.map(admission => {
                    const patient = patients.find(p => p.id === admission.patientId);
                    if (!patient) return null;
                    
                    const financial = getPatientFinancialInfo(patient.id);
                    
                    return (
                      <TableRow key={admission.id}>
                        <TableCell className="font-medium">{patient.firstName} {patient.lastName}</TableCell>
                        <TableCell className="font-mono">{patient.dni}</TableCell>
                        <TableCell>{financial.insurance}</TableCell>
                        <TableCell>{financial.policyNumber}</TableCell>
                        <TableCell>{financial.daysHospitalized} días</TableCell>
                        <TableCell>{financial.dailyRate.toFixed(2)} €</TableCell>
                        <TableCell className="font-semibold text-green-700">
                          {financial.estimatedCost.toFixed(2)} €
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {activeAdmissions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No hay pacientes hospitalizados actualmente
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de Nueva Admisión */}
      <Dialog open={showNewAdmission} onOpenChange={setShowNewAdmission}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nueva Admisión Hospitalaria</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selección de paciente */}
            <div className="space-y-2">
              <Label htmlFor="patient">Paciente *</Label>
              <Select value={formData.patientId} onValueChange={(v) => setFormData({...formData, patientId: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar paciente" />
                </SelectTrigger>
                <SelectContent>
                  {availablePatients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName} - {patient.dni}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availablePatients.length === 0 && (
                <p className="text-sm text-amber-600">No hay pacientes disponibles para admisión</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Tipo de admisión */}
              <div className="space-y-2">
                <Label htmlFor="admissionType">Tipo de Admisión *</Label>
                <Select value={formData.admissionType} onValueChange={(v: 'Emergency' | 'Scheduled' | 'Transfer') => setFormData({...formData, admissionType: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Emergency">Emergencia</SelectItem>
                    <SelectItem value="Scheduled">Programada</SelectItem>
                    <SelectItem value="Transfer">Transferencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Prioridad */}
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridad *</Label>
                <Select value={formData.priority} onValueChange={(v: 'Low' | 'Normal' | 'High' | 'Urgent') => setFormData({...formData, priority: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Baja</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="High">Alta</SelectItem>
                    <SelectItem value="Urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Médico responsable */}
            <div className="space-y-2">
              <Label htmlFor="physician">Médico Responsable *</Label>
              <Select value={formData.admittingPhysician} onValueChange={(v) => setFormData({...formData, admittingPhysician: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar médico" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map(doctor => (
                    <SelectItem key={doctor.id} value={`Dr. ${doctor.firstName} ${doctor.lastName}`}>
                      Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization || doctor.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Motivo de ingreso */}
            <div className="space-y-2">
              <Label htmlFor="reason">Motivo de Ingreso *</Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                placeholder="Describir el motivo de la admisión..."
                rows={3}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Habitación */}
              <div className="space-y-2">
                <Label htmlFor="room">Habitación (opcional)</Label>
                <Select value={formData.roomId} onValueChange={(v) => setFormData({...formData, roomId: v, bedId: ''})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar habitación" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map(room => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.number} - {room.department} ({room.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cama */}
              <div className="space-y-2">
                <Label htmlFor="bed">Cama (opcional)</Label>
                <Select value={formData.bedId} onValueChange={(v) => setFormData({...formData, bedId: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cama" />
                  </SelectTrigger>
                  <SelectContent>
                    {bedsInSelectedRoom.map(bed => {
                      const room = rooms.find(r => r.id === bed.roomId);
                      return (
                        <SelectItem key={bed.id} value={bed.id}>
                          Cama {bed.number} - Hab. {room?.number}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {bedsInSelectedRoom.length === 0 && (
                  <p className="text-sm text-amber-600">No hay camas disponibles</p>
                )}
              </div>
            </div>

            {/* Notas adicionales */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notas Adicionales</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Observaciones, antecedentes relevantes, etc."
                rows={2}
              />
            </div>

            <DialogFooter className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setShowNewAdmission(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Registrando...' : 'Registrar Admisión'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Nuevo Paciente */}
      <Dialog open={showNewPatient} onOpenChange={setShowNewPatient}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registrar Nuevo Paciente</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleCreatePatient} className="space-y-6">
            {/* Datos principales */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dni">DNI *</Label>
                <Input
                  id="dni"
                  value={patientForm.dni}
                  onChange={(e) => setPatientForm({...patientForm, dni: e.target.value})}
                  placeholder="12345678A"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Fecha de Nacimiento *</Label>
                <Input
                  id="dob"
                  type="date"
                  value={patientForm.dateOfBirth}
                  onChange={(e) => setPatientForm({...patientForm, dateOfBirth: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre *</Label>
                <Input
                  id="firstName"
                  value={patientForm.firstName}
                  onChange={(e) => setPatientForm({...patientForm, firstName: e.target.value})}
                  placeholder="Nombre"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellidos *</Label>
                <Input
                  id="lastName"
                  value={patientForm.lastName}
                  onChange={(e) => setPatientForm({...patientForm, lastName: e.target.value})}
                  placeholder="Apellidos"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="gender">Género *</Label>
                <Select value={patientForm.gender} onValueChange={(v: 'M' | 'F' | 'Other') => setPatientForm({...patientForm, gender: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Femenino</SelectItem>
                    <SelectItem value="Other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={patientForm.phone}
                  onChange={(e) => setPatientForm({...patientForm, phone: e.target.value})}
                  placeholder="+34 600 000 000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={patientForm.email}
                  onChange={(e) => setPatientForm({...patientForm, email: e.target.value})}
                  placeholder="email@ejemplo.com"
                />
              </div>
            </div>

            {/* Dirección */}
            <div className="space-y-2">
              <Label>Dirección</Label>
              <div className="grid gap-2 md:grid-cols-2">
                <Input
                  value={patientForm.address.street}
                  onChange={(e) => setPatientForm({...patientForm, address: {...patientForm.address, street: e.target.value}})}
                  placeholder="Calle y número"
                />
                <Input
                  value={patientForm.address.city}
                  onChange={(e) => setPatientForm({...patientForm, address: {...patientForm.address, city: e.target.value}})}
                  placeholder="Ciudad"
                />
                <Input
                  value={patientForm.address.postalCode}
                  onChange={(e) => setPatientForm({...patientForm, address: {...patientForm.address, postalCode: e.target.value}})}
                  placeholder="Código postal"
                />
                <Input
                  value={patientForm.address.country}
                  onChange={(e) => setPatientForm({...patientForm, address: {...patientForm.address, country: e.target.value}})}
                  placeholder="País"
                />
              </div>
            </div>

            {/* Contacto de emergencia */}
            <div className="space-y-2">
              <Label>Contacto de Emergencia</Label>
              <div className="grid gap-2 md:grid-cols-3">
                <Input
                  value={patientForm.emergencyContact.name}
                  onChange={(e) => setPatientForm({...patientForm, emergencyContact: {...patientForm.emergencyContact, name: e.target.value}})}
                  placeholder="Nombre"
                />
                <Input
                  value={patientForm.emergencyContact.relationship}
                  onChange={(e) => setPatientForm({...patientForm, emergencyContact: {...patientForm.emergencyContact, relationship: e.target.value}})}
                  placeholder="Relación"
                />
                <Input
                  value={patientForm.emergencyContact.phone}
                  onChange={(e) => setPatientForm({...patientForm, emergencyContact: {...patientForm.emergencyContact, phone: e.target.value}})}
                  placeholder="Teléfono"
                />
              </div>
            </div>

            {/* Información de seguro */}
            <div className="space-y-2">
              <Label>Información de Seguro (opcional)</Label>
              <div className="grid gap-2 md:grid-cols-2">
                <Input
                  value={patientForm.insuranceProvider}
                  onChange={(e) => setPatientForm({...patientForm, insuranceProvider: e.target.value})}
                  placeholder="Aseguradora"
                />
                <Input
                  value={patientForm.policyNumber}
                  onChange={(e) => setPatientForm({...patientForm, policyNumber: e.target.value})}
                  placeholder="Número de póliza"
                />
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setShowNewPatient(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Registrando...' : 'Registrar Paciente'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Nueva Cita */}
      <Dialog open={showNewAppointment} onOpenChange={setShowNewAppointment}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Programar Nueva Cita</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleCreateAppointment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="aptPatient">Paciente *</Label>
              <Select value={appointmentForm.patientId} onValueChange={(v) => setAppointmentForm({...appointmentForm, patientId: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar paciente" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName} - {patient.dni}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="aptDoctor">Médico *</Label>
              <Select value={appointmentForm.doctorId} onValueChange={(v) => setAppointmentForm({...appointmentForm, doctorId: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar médico" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map(doctor => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization || doctor.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="aptDate">Fecha *</Label>
                <Input
                  id="aptDate"
                  type="date"
                  value={appointmentForm.date}
                  onChange={(e) => setAppointmentForm({...appointmentForm, date: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aptTime">Hora *</Label>
                <Input
                  id="aptTime"
                  type="time"
                  value={appointmentForm.time}
                  onChange={(e) => setAppointmentForm({...appointmentForm, time: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="aptType">Tipo de Cita *</Label>
              <Select value={appointmentForm.type} onValueChange={(v) => setAppointmentForm({...appointmentForm, type: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Consultation">Consulta</SelectItem>
                  <SelectItem value="Follow-up">Seguimiento</SelectItem>
                  <SelectItem value="Procedure">Procedimiento</SelectItem>
                  <SelectItem value="Emergency">Emergencia</SelectItem>
                  <SelectItem value="Telemedicine">Telemedicina</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="aptNotes">Notas</Label>
              <Textarea
                id="aptNotes"
                value={appointmentForm.notes}
                onChange={(e) => setAppointmentForm({...appointmentForm, notes: e.target.value})}
                placeholder="Motivo de la cita, observaciones..."
                rows={2}
              />
            </div>

            <DialogFooter className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setShowNewAppointment(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Programando...' : 'Programar Cita'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
