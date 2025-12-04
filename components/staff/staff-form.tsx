'use client';

import { useState, useEffect } from 'react';
import { useHospital } from '@/lib/hospital-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';
import type { UserRole } from '@/lib/types';

interface StaffFormProps {
  staffId?: string | null;
  onClose: () => void;
}

export default function StaffForm({ staffId, onClose }: StaffFormProps) {
  const { staff, addStaff, updateStaff } = useHospital();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    dni: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '' as UserRole | '',
    department: '',
    specialization: '',
    licenseNumber: '',
    isActive: true
  });

  useEffect(() => {
    if (staffId) {
      const staffMember = staff.find(u => u.id === staffId);
      if (staffMember) {
        setFormData({
          dni: staffMember.dni,
          firstName: staffMember.firstName,
          lastName: staffMember.lastName,
          email: staffMember.email,
          phone: staffMember.phone,
          role: staffMember.role,
          department: staffMember.department || '',
          specialization: staffMember.specialization || '',
          licenseNumber: staffMember.licenseNumber || '',
          isActive: staffMember.isActive
        });
      }
    }
  }, [staffId, staff]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.dni || !formData.firstName || !formData.lastName || !formData.email || !formData.role) {
      toast({
        title: "Error de validación",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    const userData = {
      dni: formData.dni,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      role: formData.role as UserRole,
      department: formData.department || undefined,
      specialization: formData.specialization || undefined,
      licenseNumber: formData.licenseNumber || undefined,
      isActive: formData.isActive
    };

    if (staffId) {
      updateStaff(staffId, userData);
      toast({
        title: "Personal actualizado",
        description: "Los datos del personal han sido actualizados exitosamente",
      });
    } else {
      addStaff(userData);
      toast({
        title: "Personal registrado",
        description: "El nuevo miembro del personal ha sido registrado exitosamente",
      });
    }

    onClose();
  };

  const departments = [
    'Administración',
    'Cardiología',
    'Medicina Interna',
    'UCI',
    'Cirugía',
    'Pediatría',
    'Ginecología',
    'Traumatología',
    'Neurología',
    'Oncología',
    'Farmacia',
    'Radiología',
    'Laboratorio',
    'Limpieza',
    'Admisiones',
    'Trabajo Social'
  ];

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
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="usuario@hospital.com"
            required
          />
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
          <Label htmlFor="role">Rol *</Label>
          <Select value={formData.role} onValueChange={(value: UserRole) => setFormData(prev => ({ ...prev, role: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrador</SelectItem>
              <SelectItem value="doctor">Médico</SelectItem>
              <SelectItem value="nurse">Enfermero/a</SelectItem>
              <SelectItem value="auxiliary">Auxiliar</SelectItem>
              <SelectItem value="cleaning">Limpieza</SelectItem>
              <SelectItem value="pharmacy">Farmacia</SelectItem>
              <SelectItem value="radiology">Radiología</SelectItem>
              <SelectItem value="admission">Admisiones</SelectItem>
              <SelectItem value="social_work">Trabajo Social</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Departamento</Label>
          <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar departamento" />
            </SelectTrigger>
            <SelectContent>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(formData.role === 'doctor' || formData.role === 'nurse') && (
          <div className="space-y-2">
            <Label htmlFor="specialization">Especialización</Label>
            <Input
              id="specialization"
              value={formData.specialization}
              onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
              placeholder="Ej: Cardiología Intervencionista"
            />
          </div>
        )}

        {formData.role === 'doctor' && (
          <div className="space-y-2">
            <Label htmlFor="licenseNumber">Número de Colegiado</Label>
            <Input
              id="licenseNumber"
              value={formData.licenseNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
              placeholder="COL12345"
            />
          </div>
        )}
      </div>

      {/* Estado activo */}
      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
        />
        <Label htmlFor="isActive">Personal activo</Label>
      </div>

      {/* Botones */}
      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          {staffId ? 'Actualizar' : 'Registrar'} Personal
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
