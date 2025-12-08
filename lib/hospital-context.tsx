'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './auth-context';

// Importaciones de datos SQL pre-parseados (datos reales de la base de datos)
import {
  sqlPatients,
  sqlStaff,
  sqlRooms,
  sqlBeds,
  sqlMedications,
  sqlServices,
  sqlAdmissions,
  sqlMedicalOrders,
  sqlAsignacionesProfesionalPaciente,
  sqlPermisosAreaClinica,
  getPacientesAsignadosPorProfesional,
  profesionalTieneAccesoAPaciente
} from './sql-data';

// Importaciones de mock-data para datos que no están en SQL
import { 
  mockAppointments, 
  mockMedicalRecords, 
  mockVitalSigns,
  mockNursingNotes,
  mockClinicalScales,
  mockFluidBalance,
  mockWoundAssessments,
  mockMedicalEvolutions,
  mockDischargeChecklists,
  mockSystemNotifications,
  mockChatMessages,
  mockHospitalFloors,
  mockAIAssistant,
  mockFutureAppointments,
  mockFollowUpAlerts,
  mockPrivacySettings,
  mockAppointmentSummaries
} from './mock-data';

// Importar servicio de base de datos para persistencia
import * as dbService from './database/db-service';

import type { 
  Patient, 
  Room, 
  Bed, 
  Appointment, 
  Admission, 
  MedicalRecord, 
  VitalSigns, 
  Medication,
  Service,
  MedicalOrder,
  NursingNote,
  ClinicalScale,
  FluidBalance,
  WoundAssessment,
  MedicalEvolution,
  DischargeChecklist,
  SystemNotification,
  ChatMessage,
  HospitalFloor,
  AIAssistant,
  FutureAppointment,
  FollowUpAlert,
  PrivacySettings,
  AppointmentSummary,
  User,
  AsignacionProfesionalPaciente,
  PermisoAreaClinica,
  DataVisibilityFilter
} from './types';
import { roleDataVisibility } from './types';

interface HospitalContextType {
  // Estados
  patients: Patient[];
  rooms: Room[];
  beds: Bed[];
  appointments: Appointment[];
  admissions: Admission[];
  medicalRecords: MedicalRecord[];
  vitalSigns: VitalSigns[];
  medications: Medication[];
  services: Service[];
  medicalOrders: MedicalOrder[];
  nursingNotes: NursingNote[];
  clinicalScales: ClinicalScale[];
  fluidBalance: FluidBalance[];
  woundAssessments: WoundAssessment[];
  medicalEvolutions: MedicalEvolution[];
  dischargeChecklists: DischargeChecklist[];
  systemNotifications: SystemNotification[];
  chatMessages: ChatMessage[];
  hospitalFloors: HospitalFloor[];
  aiAssistants: AIAssistant[];
  futureAppointments: FutureAppointment[];
  followUpAlerts: FollowUpAlert[];
  privacySettings: PrivacySettings[];
  appointmentSummaries: AppointmentSummary[];
  staff: User[];
  
  // Sistema de control de acceso
  asignacionesProfesionalPaciente: AsignacionProfesionalPaciente[];
  permisosAreaClinica: PermisoAreaClinica[];
  
  // Estado de carga
  isDbLoading: boolean;
  dbError: string | null;
  
  // Funciones de control de acceso
  getFilteredPatients: () => Patient[];
  canAccessPatient: (patientId: string) => boolean;
  getPatientVisibilityFilter: () => DataVisibilityFilter | null;
  getMyAssignedPatients: () => Patient[];
  getAssignmentType: (patientId: string) => string | null;

  // Funciones para pacientes
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (patientId: string, updates: Partial<Patient>) => void;
  deletePatient: (patientId: string) => void;

  // Funciones para personal
  addStaff: (staff: Omit<User, 'id'>) => void;
  updateStaff: (staffId: string, updates: Partial<User>) => void;
  deleteStaff: (staffId: string) => void;

  // Funciones para citas
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (appointmentId: string, updates: Partial<Appointment>) => void;
  cancelAppointment: (appointmentId: string, reason: string) => void;
  deleteAppointment: (appointmentId: string) => void;

  // Funciones para camas
  updateBedStatus: (bedId: string, status: Bed['status']) => void;
  updateBedCleaning: (bedId: string, cleaningStatus: Bed['cleaningStatus'], cleanedBy?: string) => void;
  reserveBed: (bedId: string, expirationDate: Date, notes?: string) => void;

  // Funciones para signos vitales
  addVitalSigns: (vitalSigns: Omit<VitalSigns, 'id'>) => void;

  // Funciones para órdenes médicas
  addMedicalOrder: (order: Omit<MedicalOrder, 'id'>) => void;
  updateMedicalOrder: (orderId: string, updates: Partial<MedicalOrder>) => void;
  deleteMedicalOrder: (orderId: string) => void;

  // Funciones para notas de enfermería
  addNursingNote: (note: Omit<NursingNote, 'id'>) => void;
  updateNursingNote: (noteId: string, updates: Partial<NursingNote>) => void;

  // Funciones para plan de alta
  addDischargePlan: (plan: Omit<DischargeChecklist, 'id'>) => void;
  updateDischargePlan: (planId: string, updates: Partial<DischargeChecklist>) => void;

  // Funciones para mensajes
  addChatMessage: (message: Omit<ChatMessage, 'id'>) => void;
  markMessageAsRead: (messageId: string) => void;
  markAllMessagesAsRead: () => void;
  getFilteredChatMessages: () => ChatMessage[];

  // Funciones para evoluciones médicas
  addMedicalEvolution: (evolution: Omit<MedicalEvolution, 'id'>) => void;
  
  // Función para recargar datos
  refreshFromDatabase: () => Promise<void>;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export function HospitalProvider({ children }: { children: React.ReactNode }) {
  const { addAuditLog, user, hasPermission } = useAuth();
  
  // Estado de carga - siempre falso ya que los datos están pre-cargados
  const [isDbLoading] = useState(false);
  const [dbError] = useState<string | null>(null);
  
  // Estados para control de acceso
  const [asignacionesProfesionalPaciente] = useState<AsignacionProfesionalPaciente[]>(sqlAsignacionesProfesionalPaciente);
  const [permisosAreaClinica] = useState<PermisoAreaClinica[]>(sqlPermisosAreaClinica);
  
  // ============================================
  // ESTADOS PRINCIPALES - Datos SQL predeterminados
  // ============================================
  const [patients, setPatients] = useState<Patient[]>(sqlPatients);
  const [rooms, setRooms] = useState<Room[]>(sqlRooms);
  const [beds, setBeds] = useState<Bed[]>(sqlBeds);
  const [medications, setMedications] = useState<Medication[]>(sqlMedications);
  const [services, setServices] = useState<Service[]>(sqlServices);
  const [admissions, setAdmissions] = useState<Admission[]>(sqlAdmissions);
  const [medicalOrders, setMedicalOrders] = useState<MedicalOrder[]>(sqlMedicalOrders);
  const [staff, setStaff] = useState<User[]>(sqlStaff as User[]);
  
  // Estados con datos mock (no disponibles en SQL)
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(mockMedicalRecords);
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>(mockVitalSigns);
  const [nursingNotes, setNursingNotes] = useState<NursingNote[]>(mockNursingNotes);
  const [clinicalScales] = useState<ClinicalScale[]>(mockClinicalScales);
  const [fluidBalance] = useState<FluidBalance[]>(mockFluidBalance);
  const [woundAssessments] = useState<WoundAssessment[]>(mockWoundAssessments);
  const [medicalEvolutions, setMedicalEvolutions] = useState<MedicalEvolution[]>(mockMedicalEvolutions);
  const [dischargeChecklists, setDischargeChecklists] = useState<DischargeChecklist[]>(mockDischargeChecklists);
  const [systemNotifications] = useState<SystemNotification[]>(mockSystemNotifications);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  
  // Estados para funcionalidades avanzadas
  const [hospitalFloors] = useState<HospitalFloor[]>(mockHospitalFloors);
  const [aiAssistants] = useState<AIAssistant[]>(mockAIAssistant);
  const [futureAppointments, setFutureAppointments] = useState<FutureAppointment[]>(mockFutureAppointments);
  const [followUpAlerts, setFollowUpAlerts] = useState<FollowUpAlert[]>(mockFollowUpAlerts);
  const [privacySettings] = useState<PrivacySettings[]>(mockPrivacySettings);
  const [appointmentSummaries] = useState<AppointmentSummary[]>(mockAppointmentSummaries);

  // Inicializar servicio de base de datos al cargar
  useEffect(() => {
    console.log('🏥 Hospital Context inicializado con datos SQL:');
    console.log(`  - Pacientes: ${patients.length}`);
    console.log(`  - Personal: ${staff.length}`);
    console.log(`  - Habitaciones: ${rooms.length}`);
    console.log(`  - Camas: ${beds.length}`);
    console.log(`  - Medicamentos: ${medications.length}`);
    console.log(`  - Servicios: ${services.length}`);
    console.log(`  - Admisiones: ${admissions.length}`);
    console.log(`  - Órdenes médicas: ${medicalOrders.length}`);
    
    // Inicializar el servicio de base de datos para permitir persistencia
    dbService.initializeDatabase().then(() => {
      console.log('✅ Servicio de base de datos inicializado');
    }).catch(error => {
      console.warn('⚠️ No se pudo inicializar el servicio de base de datos:', error);
    });
  }, []);

  // Función para recargar datos desde la base de datos SQL
  const refreshFromDatabase = useCallback(async () => {
    try {
      // Reiniciar la base de datos y recargar
      await dbService.resetDatabase();
      
      // Obtener datos frescos
      const freshPatients = dbService.getPatients();
      const freshStaff = dbService.getStaff();
      const { rooms: freshRooms, beds: freshBeds } = dbService.getRoomsAndBeds();
      const freshMedications = dbService.getMedications();
      const freshServices = dbService.getServices();
      const freshAdmissions = dbService.getAdmissions();
      const freshOrders = dbService.getMedicalOrders();
      
      // Si hay datos del servicio, usarlos; si no, usar los datos estáticos
      if (freshPatients.length > 0) setPatients(freshPatients);
      else setPatients(sqlPatients);
      
      if (freshStaff.length > 0) setStaff(freshStaff);
      else setStaff(sqlStaff as User[]);
      
      if (freshRooms.length > 0) setRooms(freshRooms);
      else setRooms(sqlRooms);
      
      if (freshBeds.length > 0) setBeds(freshBeds);
      else setBeds(sqlBeds);
      
      if (freshMedications.length > 0) setMedications(freshMedications);
      else setMedications(sqlMedications);
      
      if (freshServices.length > 0) setServices(freshServices);
      else setServices(sqlServices);
      
      if (freshAdmissions.length > 0) setAdmissions(freshAdmissions);
      else setAdmissions(sqlAdmissions);
      
      if (freshOrders.length > 0) setMedicalOrders(freshOrders);
      else setMedicalOrders(sqlMedicalOrders);
      
      console.log('✅ Datos recargados desde la base de datos SQL');
    } catch (error) {
      console.error('❌ Error recargando datos:', error);
      // En caso de error, usar datos estáticos
      setPatients(sqlPatients);
      setStaff(sqlStaff as User[]);
      setRooms(sqlRooms);
      setBeds(sqlBeds);
      setMedications(sqlMedications);
      setServices(sqlServices);
      setAdmissions(sqlAdmissions);
      setMedicalOrders(sqlMedicalOrders);
    }
  }, []);

  // Funciones para pacientes - CON PERSISTENCIA SQL
  const addPatient = useCallback(async (patientData: Omit<Patient, 'id'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: `patient-${Date.now()}`
    } as Patient;
    
    // Actualizar estado local inmediatamente
    setPatients(prev => [...prev, newPatient]);
    
    // Persistir en archivos SQL
    try {
      await dbService.addPatient(patientData);
      console.log('✅ Paciente guardado en SQL');
    } catch (error) {
      console.error('❌ Error guardando paciente en SQL:', error);
    }
    
    addAuditLog({
      action: 'CREATE',
      resource: 'patient',
      resourceId: newPatient.id,
      details: { patientName: `${newPatient.firstName} ${newPatient.lastName}` }
    });
  }, [addAuditLog]);

  const updatePatient = useCallback(async (patientId: string, updates: Partial<Patient>) => {
    // Actualizar estado local inmediatamente
    setPatients(prev => prev.map(patient => 
      patient.id === patientId ? { ...patient, ...updates } : patient
    ));
    
    // Persistir en archivos SQL
    try {
      await dbService.updatePatient(patientId, updates);
      console.log('✅ Paciente actualizado en SQL');
    } catch (error) {
      console.error('❌ Error actualizando paciente en SQL:', error);
    }
    
    addAuditLog({
      action: 'UPDATE',
      resource: 'patient',
      resourceId: patientId,
      details: updates
    });
  }, [addAuditLog]);

  const deletePatient = useCallback(async (patientId: string) => {
    // Actualizar estado local inmediatamente
    setPatients(prev => prev.filter(patient => patient.id !== patientId));
    
    // Persistir en archivos SQL
    try {
      await dbService.deletePatient(patientId);
      console.log('✅ Paciente eliminado de SQL');
    } catch (error) {
      console.error('❌ Error eliminando paciente de SQL:', error);
    }
    
    addAuditLog({
      action: 'DELETE',
      resource: 'patient',
      resourceId: patientId
    });
  }, [addAuditLog]);

  // Funciones para personal - CON PERSISTENCIA SQL
  const addStaff = useCallback(async (staffData: Omit<User, 'id'>) => {
    const newStaff: User = {
      ...staffData,
      id: `staff-${Date.now()}`
    } as User;
    
    // Actualizar estado local inmediatamente
    setStaff(prev => [...prev, newStaff]);
    
    // Persistir en archivos SQL
    try {
      await dbService.addStaff(staffData);
      console.log('✅ Personal guardado en SQL');
    } catch (error) {
      console.error('❌ Error guardando personal en SQL:', error);
    }
    
    addAuditLog({
      action: 'CREATE',
      resource: 'staff',
      resourceId: newStaff.id,
      details: { staffName: `${newStaff.firstName} ${newStaff.lastName}` }
    });
  }, [addAuditLog]);

  const updateStaff = useCallback(async (staffId: string, updates: Partial<User>) => {
    // Actualizar estado local inmediatamente
    setStaff(prev => prev.map(member => 
      member.id === staffId ? { ...member, ...updates } : member
    ));
    
    // Persistir en archivos SQL
    try {
      await dbService.updateStaff(staffId, updates);
      console.log('✅ Personal actualizado en SQL');
    } catch (error) {
      console.error('❌ Error actualizando personal en SQL:', error);
    }
    
    addAuditLog({
      action: 'UPDATE',
      resource: 'staff',
      resourceId: staffId,
      details: updates
    });
  }, [addAuditLog]);

  const deleteStaff = useCallback(async (staffId: string) => {
    // Actualizar estado local inmediatamente
    setStaff(prev => prev.filter(member => member.id !== staffId));
    
    // Persistir en archivos SQL (nota: no hay función específica en db-service, se maneja localmente)
    console.log('✅ Personal eliminado localmente');
    
    addAuditLog({
      action: 'DELETE',
      resource: 'staff',
      resourceId: staffId
    });
  }, [addAuditLog]);

  // Funciones para citas
  const addAppointment = useCallback((appointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: `apt-${Date.now()}`
    };
    
    setAppointments(prev => [...prev, newAppointment]);
    
    addAuditLog({
      action: 'CREATE',
      resource: 'appointment',
      resourceId: newAppointment.id,
      details: { 
        patientName: newAppointment.patientName,
        date: newAppointment.date.toISOString(),
        service: newAppointment.serviceName
      }
    });
  }, [addAuditLog]);

  const updateAppointment = useCallback((appointmentId: string, updates: Partial<Appointment>) => {
    setAppointments(prev => prev.map(appointment => 
      appointment.id === appointmentId ? { ...appointment, ...updates } : appointment
    ));
    
    addAuditLog({
      action: 'UPDATE',
      resource: 'appointment',
      resourceId: appointmentId,
      details: updates
    });
  }, [addAuditLog]);

  const cancelAppointment = useCallback((appointmentId: string, reason: string) => {
    setAppointments(prev => prev.map(appointment => 
      appointment.id === appointmentId 
        ? { ...appointment, status: 'Cancelled' as const, cancelReason: reason }
        : appointment
    ));
    
    addAuditLog({
      action: 'CANCEL',
      resource: 'appointment',
      resourceId: appointmentId,
      details: { reason }
    });
  }, [addAuditLog]);

  const deleteAppointment = useCallback((appointmentId: string) => {
    setAppointments(prev => prev.filter(appointment => appointment.id !== appointmentId));
    
    addAuditLog({
      action: 'DELETE',
      resource: 'appointment',
      resourceId: appointmentId
    });
  }, [addAuditLog]);

  // Funciones para camas - CON PERSISTENCIA SQL
  const updateBedStatus = useCallback(async (bedId: string, status: Bed['status']) => {
    // Actualizar estado local inmediatamente
    setBeds(prev => prev.map(bed => 
      bed.id === bedId ? { ...bed, status } : bed
    ));
    
    // Persistir en archivos SQL
    try {
      await dbService.updateBedStatus(bedId, status);
      console.log('✅ Estado de cama actualizado en SQL');
    } catch (error) {
      console.error('❌ Error actualizando cama en SQL:', error);
    }
    
    addAuditLog({
      action: 'UPDATE',
      resource: 'bed',
      resourceId: bedId,
      details: { newStatus: status }
    });
  }, [addAuditLog]);

  const updateBedCleaning = useCallback(async (bedId: string, cleaningStatus: Bed['cleaningStatus'], cleanedBy?: string) => {
    // Actualizar estado local inmediatamente
    setBeds(prev => prev.map(bed => 
      bed.id === bedId 
        ? { 
            ...bed, 
            cleaningStatus,
            lastCleaned: cleaningStatus === 'Clean' || cleaningStatus === 'Sanitized' ? new Date() : bed.lastCleaned,
            cleanedBy: cleanedBy || bed.cleanedBy
          }
        : bed
    ));
    
    // Persistir en archivos SQL
    try {
      await dbService.updateBedStatus(bedId, cleaningStatus === 'Cleaning Required' ? 'Cleaning Required' : 'Available');
      console.log('✅ Limpieza de cama actualizada en SQL');
    } catch (error) {
      console.error('❌ Error actualizando limpieza de cama en SQL:', error);
    }
    
    addAuditLog({
      action: 'UPDATE',
      resource: 'bed-cleaning',
      resourceId: bedId,
      details: { cleaningStatus, cleanedBy }
    });
  }, [addAuditLog]);

  const reserveBed = useCallback(async (bedId: string, expirationDate: Date, notes?: string) => {
    // Actualizar estado local inmediatamente
    setBeds(prev => prev.map(bed => 
      bed.id === bedId 
        ? { 
            ...bed, 
            status: 'Reserved' as const,
            reservationExpires: expirationDate,
            notes: notes || bed.notes
          }
        : bed
    ));
    
    // Persistir en archivos SQL
    try {
      await dbService.updateBedStatus(bedId, 'Reserved');
      console.log('✅ Reserva de cama guardada en SQL');
    } catch (error) {
      console.error('❌ Error reservando cama en SQL:', error);
    }
    
    addAuditLog({
      action: 'RESERVE',
      resource: 'bed',
      resourceId: bedId,
      details: { expirationDate: expirationDate.toISOString(), notes }
    });
  }, [addAuditLog]);

  // Funciones para signos vitales - CON PERSISTENCIA SQL
  const addVitalSigns = useCallback(async (vitalSignsData: Omit<VitalSigns, 'id'>) => {
    const newVitalSigns: VitalSigns = {
      ...vitalSignsData,
      id: `vs-${Date.now()}`
    };
    
    // Actualizar estado local inmediatamente
    setVitalSigns(prev => [...prev, newVitalSigns]);
    
    // Persistir en archivos SQL
    try {
      await dbService.addVitalSignsRecord(vitalSignsData);
      console.log('✅ Signos vitales guardados en SQL');
    } catch (error) {
      console.error('❌ Error guardando signos vitales en SQL:', error);
    }
    
    addAuditLog({
      action: 'CREATE',
      resource: 'vital-signs',
      resourceId: newVitalSigns.id,
      details: { 
        patientId: newVitalSigns.patientId,
        recordedBy: newVitalSigns.recordedBy,
        hasAlerts: (newVitalSigns.alerts?.length || 0) > 0
      }
    });
  }, [addAuditLog]);

  // Funciones para órdenes médicas - CON PERSISTENCIA SQL
  const addMedicalOrder = useCallback(async (orderData: Omit<MedicalOrder, 'id'>) => {
    const newOrder: MedicalOrder = {
      ...orderData,
      id: `order-${Date.now()}`
    };
    
    // Actualizar estado local inmediatamente
    setMedicalOrders(prev => [...prev, newOrder]);
    
    // Persistir en archivos SQL
    try {
      await dbService.addMedicalOrder(orderData);
      console.log('✅ Orden médica guardada en SQL');
    } catch (error) {
      console.error('❌ Error guardando orden médica en SQL:', error);
    }
    
    addAuditLog({
      action: 'CREATE',
      resource: 'medical-order',
      resourceId: newOrder.id,
      details: { 
        patientId: newOrder.patientId,
        type: newOrder.type,
        description: newOrder.description,
        physicianId: newOrder.physicianId
      }
    });
  }, [addAuditLog]);

  const updateMedicalOrder = useCallback(async (orderId: string, updates: Partial<MedicalOrder>) => {
    // Actualizar estado local inmediatamente
    setMedicalOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, ...updates } : order
    ));
    
    // Para órdenes médicas, los cambios de estado son importantes
    console.log('📝 Orden médica actualizada localmente');
    
    addAuditLog({
      action: 'UPDATE',
      resource: 'medical-order',
      resourceId: orderId,
      details: updates
    });
  }, [addAuditLog]);

  const deleteMedicalOrder = useCallback((orderId: string) => {
    setMedicalOrders(prev => prev.filter(order => order.id !== orderId));
    
    addAuditLog({
      action: 'DELETE',
      resource: 'medical-order',
      resourceId: orderId
    });
  }, [addAuditLog]);

  // Funciones para notas de enfermería - CON PERSISTENCIA SQL
  const addNursingNote = useCallback(async (noteData: Omit<NursingNote, 'id'>) => {
    const newNote: NursingNote = {
      ...noteData,
      id: `nn-${Date.now()}`
    };
    
    // Actualizar estado local inmediatamente
    setNursingNotes(prev => [...prev, newNote]);
    
    // Persistir en archivos SQL
    try {
      await dbService.addNursingDocument(
        noteData.patientId,
        noteData.nurseId,
        noteData.category,
        noteData.content
      );
      console.log('✅ Nota de enfermería guardada en SQL');
    } catch (error) {
      console.error('❌ Error guardando nota de enfermería en SQL:', error);
    }
    
    addAuditLog({
      action: 'CREATE',
      resource: 'nursing-note',
      resourceId: newNote.id,
      details: { 
        patientId: newNote.patientId,
        category: newNote.category,
        nurseId: newNote.nurseId
      }
    });
  }, [addAuditLog]);

  const updateNursingNote = useCallback(async (noteId: string, updates: Partial<NursingNote>) => {
    // Actualizar estado local inmediatamente
    setNursingNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, ...updates } : note
    ));
    
    console.log('📝 Nota de enfermería actualizada localmente');
    
    addAuditLog({
      action: 'UPDATE',
      resource: 'nursing-note',
      resourceId: noteId,
      details: updates
    });
  }, [addAuditLog]);

  // Funciones para plan de alta
  const addDischargePlan = useCallback((planData: Omit<DischargeChecklist, 'id'>) => {
    const newPlan: DischargeChecklist = {
      ...planData,
      id: `dc-${Date.now()}`
    };
    
    setDischargeChecklists(prev => [...prev, newPlan]);
    
    addAuditLog({
      action: 'CREATE',
      resource: 'discharge-plan',
      resourceId: newPlan.id,
      details: { 
        patientId: newPlan.patientId,
        expectedDate: newPlan.expectedDischargeDate.toISOString()
      }
    });
  }, [addAuditLog]);

  const updateDischargePlan = useCallback((planId: string, updates: Partial<DischargeChecklist>) => {
    setDischargeChecklists(prev => prev.map(plan => 
      plan.id === planId ? { ...plan, ...updates } : plan
    ));
    
    addAuditLog({
      action: 'UPDATE',
      resource: 'discharge-plan',
      resourceId: planId,
      details: updates
    });
  }, [addAuditLog]);

  // Funciones para mensajes
  const addChatMessage = useCallback((messageData: Omit<ChatMessage, 'id'>) => {
    const newMessage: ChatMessage = {
      ...messageData,
      id: `message-${Date.now()}`
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    
    addAuditLog({
      action: 'CREATE',
      resource: 'message',
      resourceId: newMessage.id,
      details: { type: newMessage.type }
    });
  }, [addAuditLog]);

  // Marcar mensaje como leído
  const markMessageAsRead = useCallback((messageId: string) => {
    setChatMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isRead: true } : msg
    ));
    
    addAuditLog({
      action: 'UPDATE',
      resource: 'message',
      resourceId: messageId,
      details: { action: 'marked_as_read' }
    });
  }, [addAuditLog]);

  // Marcar todos los mensajes como leídos
  const markAllMessagesAsRead = useCallback(() => {
    if (!user) return;
    
    setChatMessages(prev => prev.map(msg => {
      // Solo marcar como leído si el mensaje es para el usuario actual
      const isRecipient = 
        !msg.recipientRole || 
        msg.recipientRole === 'all' || 
        msg.recipientRole === user.role;
      
      if (isRecipient && !msg.isRead) {
        return { ...msg, isRead: true };
      }
      return msg;
    }));
    
    addAuditLog({
      action: 'UPDATE',
      resource: 'message',
      resourceId: 'all',
      details: { action: 'marked_all_as_read' }
    });
  }, [user, addAuditLog]);

  // Obtener mensajes filtrados por destinatario
  const getFilteredChatMessages = useCallback((): ChatMessage[] => {
    if (!user) return [];
    
    // Admin ve todos los mensajes
    if (user.role === 'admin') {
      return chatMessages;
    }
    
    // Filtrar mensajes donde:
    // 1. El usuario es el remitente (mensajes enviados)
    // 2. recipientRole es 'all' o undefined (broadcast)
    // 3. recipientRole coincide con el rol del usuario
    // 4. recipientId coincide con el ID del usuario
    return chatMessages.filter(msg => {
      // Mensajes enviados por el usuario
      if (msg.senderId === user.id) return true;
      
      // Mensajes broadcast (para todos)
      if (!msg.recipientRole || msg.recipientRole === 'all') return true;
      
      // Mensajes dirigidos al rol del usuario
      if (msg.recipientRole === user.role) return true;
      
      // Mensajes dirigidos específicamente al usuario
      if (msg.recipientId === user.id) return true;
      
      return false;
    });
  }, [user, chatMessages]);

  // Funciones para evoluciones médicas
  const addMedicalEvolution = useCallback((evolutionData: Omit<MedicalEvolution, 'id'>) => {
    const newEvolution: MedicalEvolution = {
      ...evolutionData,
      id: `evolution-${Date.now()}`
    };
    
    setMedicalEvolutions(prev => [...prev, newEvolution]);
    
    addAuditLog({
      action: 'CREATE',
      resource: 'medical_evolution',
      resourceId: newEvolution.id,
      details: { 
        patientId: newEvolution.patientId,
        physicianName: newEvolution.physicianName
      }
    });
  }, [addAuditLog]);

  // ============================================
  // FUNCIONES DE CONTROL DE ACCESO Y FILTRADO
  // ============================================

  /**
   * Verifica si el usuario actual puede acceder a un paciente específico
   */
  const canAccessPatient = useCallback((patientId: string): boolean => {
    if (!user) return false;
    
    // Admin tiene acceso a todos los pacientes
    if (user.role === 'admin') return true;
    
    // Verificar asignación profesional-paciente
    const professionalId = user.professionalId || user.id;
    return profesionalTieneAccesoAPaciente(professionalId, patientId);
  }, [user]);

  /**
   * Obtiene los pacientes filtrados según el rol y asignaciones del usuario actual
   */
  const getFilteredPatients = useCallback((): Patient[] => {
    if (!user) return [];
    
    // Admin y roles con acceso total ven todos los pacientes
    if (user.role === 'admin') {
      return patients;
    }
    
    // Para personal de limpieza, admisiones: mostrar datos básicos de todos
    if (user.role === 'cleaning' || user.role === 'admission') {
      return patients;
    }
    
    // Para médicos, enfermeras y otros roles clínicos: solo pacientes asignados
    const professionalId = user.professionalId || user.id;
    const pacientesAsignadosIds = getPacientesAsignadosPorProfesional(professionalId);
    
    return patients.filter(patient => pacientesAsignadosIds.includes(patient.id));
  }, [user, patients]);

  /**
   * Obtiene el filtro de visibilidad de datos según el rol del usuario
   */
  const getPatientVisibilityFilter = useCallback((): DataVisibilityFilter | null => {
    if (!user) return null;
    return roleDataVisibility[user.role];
  }, [user]);

  /**
   * Obtiene los pacientes asignados al profesional actual
   */
  const getMyAssignedPatients = useCallback((): Patient[] => {
    if (!user) return [];
    
    const professionalId = user.professionalId || user.id;
    const pacientesAsignadosIds = getPacientesAsignadosPorProfesional(professionalId);
    
    return patients.filter(patient => pacientesAsignadosIds.includes(patient.id));
  }, [user, patients]);

  /**
   * Obtiene el tipo de asignación para un paciente específico
   */
  const getAssignmentType = useCallback((patientId: string): string | null => {
    if (!user) return null;
    
    const professionalId = user.professionalId || user.id;
    const asignacion = asignacionesProfesionalPaciente.find(
      a => a.profesionalId === professionalId && a.pacienteId === patientId && a.activo
    );
    
    return asignacion?.tipoAsignacion || null;
  }, [user, asignacionesProfesionalPaciente]);

  const value: HospitalContextType = {
    // Estados
    patients,
    rooms,
    beds,
    appointments,
    admissions,
    medicalRecords,
    vitalSigns,
    medications,
    services,
    medicalOrders,
    nursingNotes,
    clinicalScales,
    fluidBalance,
    woundAssessments,
    medicalEvolutions,
    dischargeChecklists,
    systemNotifications,
    chatMessages,
    hospitalFloors,
    aiAssistants,
    futureAppointments,
    followUpAlerts,
    privacySettings,
    appointmentSummaries,
    staff,
    
    // Sistema de control de acceso
    asignacionesProfesionalPaciente,
    permisosAreaClinica,
    
    // Estado de carga
    isDbLoading,
    dbError,
    
    // Funciones de control de acceso
    getFilteredPatients,
    canAccessPatient,
    getPatientVisibilityFilter,
    getMyAssignedPatients,
    getAssignmentType,

    // Funciones
    addPatient,
    updatePatient,
    deletePatient,
    addStaff,
    updateStaff,
    deleteStaff,
    addAppointment,
    updateAppointment,
    cancelAppointment,
    deleteAppointment,
    updateBedStatus,
    updateBedCleaning,
    reserveBed,
    addVitalSigns,
    addMedicalOrder,
    updateMedicalOrder,
    deleteMedicalOrder,
    addNursingNote,
    updateNursingNote,
    addDischargePlan,
    updateDischargePlan,
    addChatMessage,
    markMessageAsRead,
    markAllMessagesAsRead,
    getFilteredChatMessages,
    addMedicalEvolution,
    refreshFromDatabase
  };

  return (
    <HospitalContext.Provider value={value}>
      {children}
    </HospitalContext.Provider>
  );
}

export function useHospital() {
  const context = useContext(HospitalContext);
  if (context === undefined) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
}
