'use client';

import { useState, useEffect } from 'react';
import { useHospital } from '@/lib/hospital-context';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Save, X, Stethoscope, Shield, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PatientFormProps {
  patientId?: string | null;
  onClose: () => void;
  restrictDemographicEdit?: boolean; // Si es true, solo permite editar datos clínicos
}

export default function PatientForm({ patientId, onClose, restrictDemographicEdit = false }: PatientFormProps) {
  const { patients, staff, addPatient, updatePatient } = useHospital();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Los médicos solo pueden editar información clínica, no datos demográficos
  const isDoctor = user?.role === 'doctor';
  const canEditDemographics = !restrictDemographicEdit && !isDoctor;

  // Obtener médicos disponibles para asignar
  const doctors = staff.filter(s => s.role === 'doctor');

  const [formData, setFormData] = useState({
    dni: '',
    socialSecurityNumber: '',
    firstName: '',
    lastName: '',
    dateOfBirth: undefined as Date | undefined,
    gender: '' as 'M' | 'F' | 'Other' | '',
    bloodType: '',
    phone: '',
    email: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: 'España'
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    insuranceInfo: {
      provider: '',
      policyNumber: '',
      expirationDate: undefined as Date | undefined
    },
    allergies: [] as string[],
    medicalHistory: [] as string[],
    currentMedications: [] as string[],
    attendingPhysician: '',
    attendingPhysicianId: '',
    admissionReason: '',
    currentCondition: 'Stable' as string,
    riskLevel: 'Low' as string
  });

  const [allergyInput, setAllergyInput] = useState('');
  const [historyInput, setHistoryInput] = useState('');
  const [medicationInput, setMedicationInput] = useState('');

  useEffect(() => {
    if (patientId) {
      const patient = patients.find(p => p.id === patientId);
      if (patient) {
        setFormData({
          dni: patient.dni,
          socialSecurityNumber: patient.socialSecurityNumber || '',
          firstName: patient.firstName,
          lastName: patient.lastName,
          dateOfBirth: patient.dateOfBirth,
          gender: patient.gender,
          bloodType: patient.bloodType || '',
          phone: patient.phone,
          email: patient.email || '',
          address: patient.address,
          emergencyContact: patient.emergencyContact,
          insuranceInfo: patient.insuranceInfo || { provider: '', policyNumber: '', expirationDate: undefined },
          allergies: patient.allergies,
          medicalHistory: patient.medicalHistory,
          currentMedications: patient.currentMedications,
          attendingPhysician: patient.attendingPhysician || '',
          attendingPhysicianId: '',
          admissionReason: patient.admissionReason || '',
          currentCondition: patient.currentCondition || 'Stable',
          riskLevel: patient.riskLevel || 'Low'
        });
      }
    }
  }, [patientId, patients]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.dni || !formData.firstName || !formData.lastName || !formData.dateOfBirth) {
      toast({
        title: "Error de validación",
        description: "Por favor completa todos los campos requeridos (DNI, nombre, apellidos, fecha de nacimiento)",
        variant: "destructive",
      });
      return;
    }

    // Obtener nombre del médico si se seleccionó uno
    const selectedDoctor = doctors.find(d => d.id === formData.attendingPhysicianId);
    const attendingPhysicianName = selectedDoctor 
      ? `Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}` 
      : formData.attendingPhysician;

    const patientData = {
      dni: formData.dni,
      socialSecurityNumber: formData.socialSecurityNumber,
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender as 'M' | 'F' | 'Other',
      bloodType: formData.bloodType,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      emergencyContact: formData.emergencyContact,
      insuranceInfo: formData.insuranceInfo,
      allergies: formData.allergies,
      medicalHistory: formData.medicalHistory,
      currentMedications: formData.currentMedications,
      attendingPhysician: attendingPhysicianName,
      admissionReason: formData.admissionReason,
      currentCondition: formData.currentCondition,
      riskLevel: formData.riskLevel
    };

    if (patientId) {
      updatePatient(patientId, patientData);
      toast({
        title: "Paciente actualizado",
        description: "Los datos del paciente han sido actualizados exitosamente",
      });
    } else {
      addPatient(patientData);
      toast({
        title: "Paciente registrado",
        description: `${formData.firstName} ${formData.lastName} ha sido registrado exitosamente`,
      });
    }

    onClose();
  };

  const addToArray = (arrayName: keyof typeof formData, value: string, setValue: (value: string) => void) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [arrayName]: [...(prev[arrayName] as string[]), value.trim()]
      }));
      setValue('');
    }
  };

  const removeFromArray = (arrayName: keyof typeof formData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: (prev[arrayName] as string[]).filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      {/* Banner de restricción para médicos */}
      {!canEditDemographics && patientId && (
        <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-amber-600" />
              <div>
                <p className="font-medium text-amber-900 dark:text-amber-100">
                  Modo de Edición Clínica
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Como médico, puedes editar información clínica (alergias, historial, medicación, estado). 
                  Los datos demográficos (DNI, nombre, dirección) solo pueden ser modificados por Admisiones.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información personal */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center justify-between">
          Datos Personales
          {!canEditDemographics && patientId && (
            <Badge variant="outline" className="text-amber-600 border-amber-300">
              <Lock className="h-3 w-3 mr-1" />
              Solo lectura
            </Badge>
          )}
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="dni">DNI / NIE *</Label>
            <Input
              id="dni"
              value={formData.dni}
              onChange={(e) => setFormData(prev => ({ ...prev, dni: e.target.value }))}
              placeholder="12345678A"
              required
              disabled={!canEditDemographics && !!patientId}
              className={!canEditDemographics && patientId ? 'bg-gray-100 cursor-not-allowed' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="socialSecurityNumber">Nº Seguridad Social</Label>
            <Input
              id="socialSecurityNumber"
              value={formData.socialSecurityNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, socialSecurityNumber: e.target.value }))}
              placeholder="12 12345678 90"
              disabled={!canEditDemographics && !!patientId}
              className={!canEditDemographics && patientId ? 'bg-gray-100 cursor-not-allowed' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName">Nombre *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              required
              disabled={!canEditDemographics && !!patientId}
              className={!canEditDemographics && patientId ? 'bg-gray-100 cursor-not-allowed' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Apellidos *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              required
              disabled={!canEditDemographics && !!patientId}
              className={!canEditDemographics && patientId ? 'bg-gray-100 cursor-not-allowed' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Fecha de Nacimiento *</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth ? format(formData.dateOfBirth, 'yyyy-MM-dd') : ''}
              onChange={(e) => {
                const dateValue = e.target.value;
                if (dateValue) {
                  setFormData(prev => ({ ...prev, dateOfBirth: new Date(dateValue) }));
                }
              }}
              max={format(new Date(), 'yyyy-MM-dd')}
              min="1900-01-01"
              required
              className={`w-full ${!canEditDemographics && patientId ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              disabled={!canEditDemographics && !!patientId}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Género *</Label>
            <Select 
              value={formData.gender} 
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, gender: value }))}
              disabled={!canEditDemographics && !!patientId}
            >
              <SelectTrigger className={!canEditDemographics && patientId ? 'bg-gray-100 cursor-not-allowed' : ''}>
                <SelectValue placeholder="Seleccionar género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Masculino</SelectItem>
                <SelectItem value="F">Femenino</SelectItem>
                <SelectItem value="Other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bloodType">Tipo de Sangre</Label>
            <Select value={formData.bloodType} onValueChange={(value) => setFormData(prev => ({ ...prev, bloodType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+34 600 000 000"
              required
              disabled={!canEditDemographics && !!patientId}
              className={!canEditDemographics && patientId ? 'bg-gray-100 cursor-not-allowed' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="paciente@email.com"
              disabled={!canEditDemographics && !!patientId}
              className={!canEditDemographics && patientId ? 'bg-gray-100 cursor-not-allowed' : ''}
            />
          </div>
        </div>
      </div>

      {/* Asignación médica */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2 justify-between">
          <span className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-blue-600" />
            Asignación Médica
          </span>
          {!canEditDemographics && patientId && (
            <Badge variant="default" className="bg-green-600">
              ✓ Editable
            </Badge>
          )}
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="attendingPhysician">Médico Responsable</Label>
            <Select 
              value={formData.attendingPhysicianId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, attendingPhysicianId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar médico..." />
              </SelectTrigger>
              <SelectContent>
                {doctors.length === 0 ? (
                  <SelectItem value="none" disabled>No hay médicos disponibles</SelectItem>
                ) : (
                  doctors.map(doctor => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      Dr. {doctor.firstName} {doctor.lastName}
                      {doctor.department && ` - ${doctor.department}`}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admissionReason">Motivo de Admisión</Label>
            <Input
              id="admissionReason"
              value={formData.admissionReason}
              onChange={(e) => setFormData(prev => ({ ...prev, admissionReason: e.target.value }))}
              placeholder="Ej: Dolor abdominal, control rutinario..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentCondition">Estado Actual</Label>
            <Select 
              value={formData.currentCondition} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, currentCondition: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Stable">Estable</SelectItem>
                <SelectItem value="Serious">Grave</SelectItem>
                <SelectItem value="Critical">Crítico</SelectItem>
                <SelectItem value="Improving">Mejorando</SelectItem>
                <SelectItem value="Observation">En Observación</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="riskLevel">Nivel de Riesgo</Label>
            <Select 
              value={formData.riskLevel} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, riskLevel: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Bajo</SelectItem>
                <SelectItem value="Medium">Medio</SelectItem>
                <SelectItem value="High">Alto</SelectItem>
                <SelectItem value="Critical">Crítico</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Información de seguro */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center justify-between">
          Información de Seguro
          {!canEditDemographics && patientId && (
            <Badge variant="outline" className="text-amber-600 border-amber-300">
              <Lock className="h-3 w-3 mr-1" />
              Solo lectura
            </Badge>
          )}
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="insuranceProvider">Aseguradora</Label>
            <Input
              id="insuranceProvider"
              value={formData.insuranceInfo.provider}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                insuranceInfo: { ...prev.insuranceInfo, provider: e.target.value }
              }))}
              placeholder="Ej: Seguridad Social, Sanitas, Adeslas..."
              disabled={!canEditDemographics && !!patientId}
              className={!canEditDemographics && patientId ? 'bg-gray-100 cursor-not-allowed' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="policyNumber">Nº de Póliza</Label>
            <Input
              id="policyNumber"
              value={formData.insuranceInfo.policyNumber}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                insuranceInfo: { ...prev.insuranceInfo, policyNumber: e.target.value }
              }))}
              placeholder="Número de póliza"
              disabled={!canEditDemographics && !!patientId}
              className={!canEditDemographics && patientId ? 'bg-gray-100 cursor-not-allowed' : ''}
            />
          </div>
        </div>
      </div>

      {/* Dirección */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center justify-between">
          Dirección
          {!canEditDemographics && patientId && (
            <Badge variant="outline" className="text-amber-600 border-amber-300">
              <Lock className="h-3 w-3 mr-1" />
              Solo lectura
            </Badge>
          )}
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="street">Calle y Número</Label>
            <Input
              id="street"
              value={formData.address.street}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                address: { ...prev.address, street: e.target.value }
              }))}
              placeholder="Ej: Calle Mayor 123, 2º B"
              disabled={!canEditDemographics && !!patientId}
              className={!canEditDemographics && patientId ? 'bg-gray-100 cursor-not-allowed' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Ciudad</Label>
            <Input
              id="city"
              value={formData.address.city}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                address: { ...prev.address, city: e.target.value }
              }))}
              placeholder="Ej: Madrid"
              disabled={!canEditDemographics && !!patientId}
              className={!canEditDemographics && patientId ? 'bg-gray-100 cursor-not-allowed' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postalCode">Código Postal</Label>
            <Input
              id="postalCode"
              value={formData.address.postalCode}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                address: { ...prev.address, postalCode: e.target.value }
              }))}
              placeholder="Ej: 28001"
              disabled={!canEditDemographics && !!patientId}
              className={!canEditDemographics && patientId ? 'bg-gray-100 cursor-not-allowed' : ''}
            />
          </div>
        </div>
      </div>

      {/* Contacto de emergencia */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center justify-between">
          Contacto de Emergencia
          {!canEditDemographics && patientId && (
            <Badge variant="outline" className="text-amber-600 border-amber-300">
              <Lock className="h-3 w-3 mr-1" />
              Solo lectura
            </Badge>
          )}
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="emergencyName">Nombre Completo</Label>
            <Input
              id="emergencyName"
              value={formData.emergencyContact.name}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                emergencyContact: { ...prev.emergencyContact, name: e.target.value }
              }))}
              placeholder="Nombre del contacto de emergencia"
              disabled={!canEditDemographics && !!patientId}
              className={!canEditDemographics && patientId ? 'bg-gray-100 cursor-not-allowed' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="relationship">Relación con el Paciente</Label>
            <Select 
              value={formData.emergencyContact.relationship} 
              onValueChange={(value) => setFormData(prev => ({ 
                ...prev, 
                emergencyContact: { ...prev.emergencyContact, relationship: value }
              }))}
              disabled={!canEditDemographics && !!patientId}
            >
              <SelectTrigger className={!canEditDemographics && patientId ? 'bg-gray-100 cursor-not-allowed' : ''}>
                <SelectValue placeholder="Seleccionar relación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cónyuge">Cónyuge</SelectItem>
                <SelectItem value="Padre/Madre">Padre/Madre</SelectItem>
                <SelectItem value="Hijo/a">Hijo/a</SelectItem>
                <SelectItem value="Hermano/a">Hermano/a</SelectItem>
                <SelectItem value="Otro familiar">Otro familiar</SelectItem>
                <SelectItem value="Amigo/a">Amigo/a</SelectItem>
                <SelectItem value="Tutor legal">Tutor legal</SelectItem>
                <SelectItem value="Otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="emergencyPhone">Teléfono de Emergencia</Label>
            <Input
              id="emergencyPhone"
              value={formData.emergencyContact.phone}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
              }))}
              placeholder="+34 600 000 000"
              disabled={!canEditDemographics && !!patientId}
              className={!canEditDemographics && patientId ? 'bg-gray-100 cursor-not-allowed' : ''}
            />
          </div>
        </div>
      </div>

      {/* Información médica */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center justify-between">
          Información Médica
          {!canEditDemographics && patientId && (
            <Badge variant="default" className="bg-green-600">
              ✓ Editable
            </Badge>
          )}
        </h3>
        
        {/* Alergias */}
        <div className="space-y-2">
          <Label>Alergias</Label>
          <div className="flex gap-2">
            <Input
              value={allergyInput}
              onChange={(e) => setAllergyInput(e.target.value)}
              placeholder="Añadir alergia (ej: Penicilina, Polen, Mariscos...)"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addToArray('allergies', allergyInput, setAllergyInput);
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => addToArray('allergies', allergyInput, setAllergyInput)}
            >
              Añadir
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.allergies.map((allergy, index) => (
              <div key={index} className="flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                {allergy}
                <button
                  type="button"
                  onClick={() => removeFromArray('allergies', index)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {formData.allergies.length === 0 && (
              <span className="text-sm text-gray-400">Sin alergias registradas</span>
            )}
          </div>
        </div>

        {/* Historial médico */}
        <div className="space-y-2">
          <Label>Antecedentes / Historial Médico</Label>
          <div className="flex gap-2">
            <Input
              value={historyInput}
              onChange={(e) => setHistoryInput(e.target.value)}
              placeholder="Añadir antecedente (ej: Diabetes, Hipertensión...)"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addToArray('medicalHistory', historyInput, setHistoryInput);
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => addToArray('medicalHistory', historyInput, setHistoryInput)}
            >
              Añadir
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.medicalHistory.map((history, index) => (
              <div key={index} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                {history}
                <button
                  type="button"
                  onClick={() => removeFromArray('medicalHistory', index)}
                  className="ml-1 hover:text-blue-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {formData.medicalHistory.length === 0 && (
              <span className="text-sm text-gray-400">Sin antecedentes registrados</span>
            )}
          </div>
        </div>

        {/* Medicación actual */}
        <div className="space-y-2">
          <Label>Medicación Actual</Label>
          <div className="flex gap-2">
            <Input
              value={medicationInput}
              onChange={(e) => setMedicationInput(e.target.value)}
              placeholder="Añadir medicación (ej: Paracetamol 500mg...)"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addToArray('currentMedications', medicationInput, setMedicationInput);
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => addToArray('currentMedications', medicationInput, setMedicationInput)}
            >
              Añadir
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.currentMedications.map((med, index) => (
              <div key={index} className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                {med}
                <button
                  type="button"
                  onClick={() => removeFromArray('currentMedications', index)}
                  className="ml-1 hover:text-green-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {formData.currentMedications.length === 0 && (
              <span className="text-sm text-gray-400">Sin medicación registrada</span>
            )}
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          {patientId ? 'Actualizar' : 'Registrar'} Paciente
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
