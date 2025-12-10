'use client';

import { useMemo, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import type { 
  Patient, 
  UserRole, 
  AccessContext, 
  AccessCheckResult,
  DataVisibilityFilter,
  AsignacionProfesionalPaciente
} from '@/lib/types';
import { roleDataVisibility } from '@/lib/types';

// Datos de asignaciones profesional-paciente (sincronizado con SQL)
export const asignacionesProfesionalPaciente: AsignacionProfesionalPaciente[] = [
  // Dr. Josep Blanch Alsina (27512) - Ginecología
  { id: 'ASG001', profesionalId: '27512', pacienteId: 'IFV_0001', tipoAsignacion: 'responsable', fechaInicio: new Date('2014-01-02'), departamento: 'Ginecología y Obstetricia', activo: true, notas: 'Médico responsable del embarazo' },
  
  // Dr. Eugenio Magriñá (19621) - Obstetricia
  { id: 'ASG002', profesionalId: '19621', pacienteId: 'IFV_0001', tipoAsignacion: 'equipo', fechaInicio: new Date('2014-07-03'), fechaFin: new Date('2014-07-07'), departamento: 'Obstetricia', activo: true },
  { id: 'ASG003', profesionalId: '19621', pacienteId: 'PIF_0010', tipoAsignacion: 'responsable', fechaInicio: new Date('2014-07-03'), departamento: 'Pediatría', activo: true },
  { id: 'ASG004', profesionalId: '19621', pacienteId: 'MIF_0011', tipoAsignacion: 'responsable', fechaInicio: new Date('2014-07-03'), departamento: 'Pediatría', activo: true },
  
  // Dr. Laura Martinez (12345) - Urgencias
  { id: 'ASG005', profesionalId: '12345', pacienteId: 'JML_0001', tipoAsignacion: 'responsable', fechaInicio: new Date('2022-09-10'), fechaFin: new Date('2022-09-14'), departamento: 'Urgencias', activo: true },
  
  // Dr. Orestes García (56345) - Cirugía
  { id: 'ASG006', profesionalId: '56345', pacienteId: 'SVP_0001', tipoAsignacion: 'responsable', fechaInicio: new Date('2015-09-14'), fechaFin: new Date('2015-09-16'), departamento: 'Cirugía General', activo: true },
  
  // Dr. Clara Dolz (33272) - Anestesiología
  { id: 'ASG007', profesionalId: '33272', pacienteId: 'SVP_0001', tipoAsignacion: 'equipo', fechaInicio: new Date('2015-09-14'), fechaFin: new Date('2015-09-14'), departamento: 'Anestesiología', activo: true },
  
  // Dr. Román Sampedro (35678) - Medicina Interna
  { id: 'ASG008', profesionalId: '35678', pacienteId: 'JAV_0001', tipoAsignacion: 'responsable', fechaInicio: new Date('2014-10-14'), fechaFin: new Date('2014-10-17'), departamento: 'Medicina Interna', activo: true },
  
  // Dr. Miguel Serrano (30123) / Laura Mora (7777) - UCI/Hospitalización
  { id: 'ASG009', profesionalId: '30123', pacienteId: 'MRS_0001', tipoAsignacion: 'responsable', fechaInicio: new Date('2022-05-10'), fechaFin: new Date('2022-05-20'), departamento: 'UCI', activo: true },
  { id: 'ASG010', profesionalId: '7777', pacienteId: 'MRS_0001', tipoAsignacion: 'responsable', fechaInicio: new Date('2022-05-20'), fechaFin: new Date('2022-06-02'), departamento: 'Hospitalización General', activo: true },
  
  // Dr. José Frontela (12171) - Pediatría
  { id: 'ASG011', profesionalId: '12171', pacienteId: 'PIF_0010', tipoAsignacion: 'equipo', fechaInicio: new Date('2014-07-03'), departamento: 'Pediatría', activo: true },
  { id: 'ASG012', profesionalId: '12171', pacienteId: 'MIF_0011', tipoAsignacion: 'equipo', fechaInicio: new Date('2014-07-03'), departamento: 'Pediatría', activo: true },
  
  // Enfermera Montserrat Valls (43234) - Obstetricia
  { id: 'ASG013', profesionalId: '43234', pacienteId: 'IFV_0001', tipoAsignacion: 'equipo', fechaInicio: new Date('2014-01-02'), fechaFin: new Date('2014-07-07'), departamento: 'Obstetricia', activo: true },
  { id: 'ASG014', profesionalId: '43234', pacienteId: 'PIF_0010', tipoAsignacion: 'equipo', fechaInicio: new Date('2014-07-03'), fechaFin: new Date('2014-07-07'), departamento: 'Obstetricia', activo: true },
  { id: 'ASG015', profesionalId: '43234', pacienteId: 'MIF_0011', tipoAsignacion: 'equipo', fechaInicio: new Date('2014-07-03'), fechaFin: new Date('2014-07-07'), departamento: 'Obstetricia', activo: true },
  
  // Enfermera Lucía Cabañes (18376) - Urgencias
  { id: 'ASG016', profesionalId: '18376', pacienteId: 'SVP_0001', tipoAsignacion: 'equipo', fechaInicio: new Date('2015-09-14'), departamento: 'Urgencias', activo: true },
  
  // Enfermeras de Hospitalización (25437, 61765, 43256) - Varios pacientes
  { id: 'ASG017', profesionalId: '25437', pacienteId: 'SVP_0001', tipoAsignacion: 'equipo', fechaInicio: new Date('2015-09-14'), departamento: 'Hospitalización', activo: true },
  { id: 'ASG018', profesionalId: '61765', pacienteId: 'SVP_0001', tipoAsignacion: 'equipo', fechaInicio: new Date('2015-09-15'), departamento: 'Hospitalización', activo: true },
  
  // Enfermera Nuria Bòria (6234) - Medicina Interna
  { id: 'ASG019', profesionalId: '6234', pacienteId: 'JAV_0001', tipoAsignacion: 'equipo', fechaInicio: new Date('2014-10-14'), departamento: 'Hospitalización', activo: true },
  { id: 'ASG020', profesionalId: '8512', pacienteId: 'JAV_0001', tipoAsignacion: 'equipo', fechaInicio: new Date('2014-10-15'), departamento: 'Hospitalización', activo: true },
];

// Roles que tienen acceso a todos los pacientes
const rolesConAccesoTotal: UserRole[] = ['admin'];

// Roles que pueden ver pacientes de su unidad/departamento
const rolesConAccesoUnidad: UserRole[] = ['nurse', 'auxiliary'];

// Roles que solo pueden ver datos básicos (sin información clínica)
const rolesSoloBasico: UserRole[] = ['cleaning', 'admission'];

/**
 * Hook para gestionar el acceso de pacientes basado en el profesional actual
 */
export function usePatientAccess() {
  const { user, hasPermission } = useAuth();

  /**
   * Obtiene el contexto de acceso del usuario actual
   */
  const accessContext = useMemo((): AccessContext | null => {
    if (!user) return null;

    const professionalId = user.professionalId || user.id;
    const esAdmin = user.role === 'admin';
    
    // Obtener pacientes asignados al profesional
    const asignacionesActivas = asignacionesProfesionalPaciente.filter(
      a => a.profesionalId === professionalId && a.activo
    );
    
    const pacientesAsignados = [...new Set(asignacionesActivas.map(a => a.pacienteId))];

    return {
      userId: user.id,
      userRole: user.role,
      professionalId,
      departamento: user.department,
      unidadAsignada: user.assignedUnit,
      pacientesAsignados,
      permisos: [], // Se cargarán desde la base de datos
      esAdmin,
      puedeVerTodosPacientes: esAdmin || rolesConAccesoTotal.includes(user.role)
    };
  }, [user]);

  /**
   * Verifica si el usuario puede acceder a un paciente específico
   */
  const canAccessPatient = useCallback((patientId: string): AccessCheckResult => {
    if (!accessContext) {
      return { permitido: false, razon: 'Usuario no autenticado', nivelAcceso: 'denegado' };
    }

    // Admin tiene acceso total
    if (accessContext.esAdmin) {
      return { permitido: true, nivelAcceso: 'completo' };
    }

    // Verificar si el paciente está asignado al profesional
    const tieneAsignacion = accessContext.pacientesAsignados.includes(patientId);
    
    if (tieneAsignacion) {
      // Determinar nivel de acceso según el tipo de asignación
      const asignacion = asignacionesProfesionalPaciente.find(
        a => a.profesionalId === accessContext.professionalId && 
             a.pacienteId === patientId && 
             a.activo
      );

      if (asignacion?.tipoAsignacion === 'responsable') {
        return { permitido: true, nivelAcceso: 'completo' };
      } else if (asignacion?.tipoAsignacion === 'equipo') {
        return { permitido: true, nivelAcceso: 'parcial' };
      } else if (asignacion?.tipoAsignacion === 'consulta') {
        return { permitido: true, nivelAcceso: 'solo_lectura' };
      } else {
        return { permitido: true, nivelAcceso: 'solo_lectura' };
      }
    }

    // Roles con acceso a unidad pueden ver pacientes de su unidad
    if (rolesConAccesoUnidad.includes(accessContext.userRole)) {
      // TODO: Verificar si el paciente está en la unidad del profesional
      return { 
        permitido: false, 
        razon: 'Paciente no asignado a su unidad',
        nivelAcceso: 'denegado' 
      };
    }

    // Roles con acceso básico (limpieza, admisiones)
    if (rolesSoloBasico.includes(accessContext.userRole)) {
      return { 
        permitido: true, 
        razon: 'Acceso limitado a datos básicos',
        nivelAcceso: 'solo_lectura',
        datosOcultos: ['historialMedico', 'diagnosticos', 'medicaciones', 'notasClinicas']
      };
    }

    return { 
      permitido: false, 
      razon: 'No tiene asignación activa con este paciente',
      nivelAcceso: 'denegado' 
    };
  }, [accessContext]);

  /**
   * Filtra una lista de pacientes según los permisos del usuario
   */
  const filterPatients = useCallback((patients: Patient[]): Patient[] => {
    if (!accessContext) return [];

    // Admin ve todos los pacientes
    if (accessContext.puedeVerTodosPacientes) {
      return patients;
    }

    // Médicos y enfermeras solo ven sus pacientes asignados
    return patients.filter(patient => {
      const accessResult = canAccessPatient(patient.id);
      return accessResult.permitido;
    });
  }, [accessContext, canAccessPatient]);

  /**
   * Obtiene el filtro de visibilidad de datos según el rol del usuario
   */
  const getDataVisibilityFilter = useCallback((): DataVisibilityFilter | null => {
    if (!user) return null;
    return roleDataVisibility[user.role];
  }, [user]);

  /**
   * Aplica el filtro de visibilidad a los datos de un paciente
   */
  const applyVisibilityFilter = useCallback((patient: Patient): Partial<Patient> => {
    if (!user) return {};
    
    const filter = roleDataVisibility[user.role];
    
    // Para personal de limpieza, usar identificador anónimo
    if (filter.usarIdentificadorAnonimo) {
      return {
        id: patient.id,
        firstName: patient.anonymousId || `Paciente ${patient.id.slice(-4)}`,
        lastName: '',
        roomId: patient.roomId,
        bedNumber: patient.bedNumber,
      };
    }

    const filteredPatient: Partial<Patient> = {
      id: patient.id,
      firstName: filter.mostrarNombreCompleto ? patient.firstName : patient.anonymousId || 'Paciente',
      lastName: filter.mostrarNombreCompleto ? patient.lastName : '',
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      roomId: patient.roomId,
      bedNumber: patient.bedNumber,
      currentCondition: patient.currentCondition,
      riskLevel: patient.riskLevel,
    };

    if (filter.mostrarDNI) {
      filteredPatient.dni = patient.dni;
      filteredPatient.socialSecurityNumber = patient.socialSecurityNumber;
    }

    if (filter.mostrarHistorialMedico) {
      filteredPatient.medicalHistory = patient.medicalHistory;
      filteredPatient.allergies = patient.allergies;
    }

    if (filter.mostrarMedicaciones) {
      filteredPatient.currentMedications = patient.currentMedications;
    }

    if (filter.mostrarContactosEmergencia) {
      filteredPatient.emergencyContact = patient.emergencyContact;
    }

    return filteredPatient;
  }, [user]);

  /**
   * Obtiene las asignaciones del profesional actual
   */
  const getMyAssignments = useCallback((): AsignacionProfesionalPaciente[] => {
    if (!accessContext?.professionalId) return [];
    
    return asignacionesProfesionalPaciente.filter(
      a => a.profesionalId === accessContext.professionalId && a.activo
    );
  }, [accessContext]);

  /**
   * Verifica si el usuario tiene un permiso específico
   */
  const checkPermission = useCallback((permission: string): boolean => {
    return hasPermission(permission);
  }, [hasPermission]);

  /**
   * Obtiene información resumida del acceso del usuario
   */
  const getAccessSummary = useCallback(() => {
    if (!accessContext) {
      return {
        autenticado: false,
        rol: null,
        totalPacientesAsignados: 0,
        puedeVerTodosPacientes: false,
        departamento: null
      };
    }

    return {
      autenticado: true,
      rol: accessContext.userRole,
      totalPacientesAsignados: accessContext.pacientesAsignados.length,
      puedeVerTodosPacientes: accessContext.puedeVerTodosPacientes,
      departamento: accessContext.departamento,
      professionalId: accessContext.professionalId
    };
  }, [accessContext]);

  return {
    accessContext,
    canAccessPatient,
    filterPatients,
    getDataVisibilityFilter,
    applyVisibilityFilter,
    getMyAssignments,
    checkPermission,
    getAccessSummary,
    // Exportar datos para uso en otros componentes
    asignaciones: asignacionesProfesionalPaciente
  };
}

export default usePatientAccess;

