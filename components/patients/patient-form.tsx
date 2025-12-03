'use client';

import { useState, useEffect } from 'react';
import { useHospital } from '@/lib/hospital-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PatientFormProps {
  patientId?: string | null;
  onClose: () => void;
}

export default function PatientForm({ patientId, onClose }: PatientFormProps) {
  const { patients, addPatient, updatePatient } = useHospital();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    dni: '',
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
    allergies: [] as string[],
    medicalHistory: [] as string[],
    currentMedications: [] as string[]
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
          firstName: patient.firstName,
          lastName: patient.lastName,
          dateOfBirth: patient.dateOfBirth,
          gender: patient.gender,
          bloodType: patient.bloodType || '',
          phone: patient.phone,
          email: patient.email || '',
          address: patient.address,
          emergencyContact: patient.emergencyContact,
          allergies: patient.allergies,
          medicalHistory: patient.medicalHistory,
          currentMedications: patient.currentMedications
        });
      }
    }
  }, [patientId, patients]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.dni || !formData.firstName || !formData.lastName || !formData.dateOfBirth) {
      toast({
        title: "Error de validación",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    const patientData = {
      dni: formData.dni,
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender as 'M' | 'F' | 'Other',
      bloodType: formData.bloodType,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      emergencyContact: formData.emergencyContact,
      allergies: formData.allergies,
      medicalHistory: formData.medicalHistory,
      currentMedications: formData.currentMedications
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
        description: "El nuevo paciente ha sido registrado exitosamente",
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
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto">
      {/* Información personal */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="dni">DNI *</Label>
          <Input
            id="dni"
            value={formData.dni}
            onChange={(e) => setFormData(prev => ({ ...prev, dni: e.target.value }))}
            placeholder="12345678A"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstName">Nombre *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Apellidos *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Fecha de Nacimiento *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dateOfBirth ? format(formData.dateOfBirth, 'dd/MM/yyyy', { locale: es }) : 'Seleccionar fecha'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.dateOfBirth}
                onSelect={(date) => setFormData(prev => ({ ...prev, dateOfBirth: date }))}
                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Género</Label>
          <Select value={formData.gender} onValueChange={(value: any) => setFormData(prev => ({ ...prev, gender: value }))}>
            <SelectTrigger>
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
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="paciente@email.com"
          />
        </div>
      </div>

      {/* Dirección */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Dirección</h3>
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
            />
          </div>
        </div>
      </div>

      {/* Contacto de emergencia */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Contacto de Emergencia</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="emergencyName">Nombre</Label>
            <Input
              id="emergencyName"
              value={formData.emergencyContact.name}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                emergencyContact: { ...prev.emergencyContact, name: e.target.value }
              }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="relationship">Relación</Label>
            <Input
              id="relationship"
              value={formData.emergencyContact.relationship}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                emergencyContact: { ...prev.emergencyContact, relationship: e.target.value }
              }))}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="emergencyPhone">Teléfono</Label>
            <Input
              id="emergencyPhone"
              value={formData.emergencyContact.phone}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
              }))}
            />
          </div>
        </div>
      </div>

      {/* Alergias */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Alergias</h3>
        <div className="flex gap-2">
          <Input
            value={allergyInput}
            onChange={(e) => setAllergyInput(e.target.value)}
            placeholder="Añadir alergia..."
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
