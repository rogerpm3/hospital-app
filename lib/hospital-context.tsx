'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './auth-context';

// Importaciones de datos SQL pre-parseados (fallback en caso de error de SQLite)
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
  profesionalTieneAccesoAPaciente,
  getEpisodiosPorPaciente,
  getDiagnosticoActivoPaciente,
  getAlergiasPorPaciente,
  getDetalleAlergiasPaciente,
  sqlEpisodiosClinico,
  sqlAlergias,
  sqlAsignacionesAlergia,
  sqlDiagnosticos,
  type EpisodioClinico,
  type Alergia,
  type AsignacionAlergia,
  type Diagnostico
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

// ============================================
// FUNCIONES HELPER PARA API SQLite
// ============================================

/**
 * Convierte strings ISO a objetos Date en los datos recibidos
 */
function parsePatientDates(patients: any[]): any[] {
  return patients.map(p => ({
    ...p,
    dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth) : new Date(),
    admissionDate: p.admissionDate ? new Date(p.admissionDate) : undefined
  }));
}

function parseAdmissionDates(admissions: any[]): any[] {
  return admissions.map(a => ({
    ...a,
    admissionDate: a.admissionDate ? new Date(a.admissionDate) : new Date(),
    expectedDischargeDate: a.expectedDischargeDate ? new Date(a.expectedDischargeDate) : undefined,
    actualDischargeDate: a.actualDischargeDate ? new Date(a.actualDischargeDate) : undefined
  }));
}

function parseOrderDates(orders: any[]): any[] {
  return orders.map(o => ({
    ...o,
    orderDate: o.orderDate ? new Date(o.orderDate) : new Date()
  }));
}

function parseVitalSignDates(vitals: any[]): any[] {
  return vitals.map(v => ({
    ...v,
    timestamp: v.timestamp ? new Date(v.timestamp) : new Date()
  }));
}

function parseMedicationDates(medications: any[]): any[] {
  return medications.map(m => ({
    ...m,
    startDate: m.startDate ? new Date(m.startDate) : new Date(),
    endDate: m.endDate ? new Date(m.endDate) : undefined
  }));
}

function parseBedDates(beds: any[]): any[] {
  return beds.map(b => ({
    ...b,
    lastCleaned: b.lastCleaned ? new Date(b.lastCleaned) : new Date(),
    reservationExpires: b.reservationExpires ? new Date(b.reservationExpires) : undefined
  }));
}

function parseRoomDates(rooms: any[]): any[] {
  return rooms.map(r => ({
    ...r,
    lastCleaned: r.lastCleaned ? new Date(r.lastCleaned) : new Date(),
    beds: r.beds ? parseBedDates(r.beds) : []
  }));
}

async function fetchFromSQLite(action: string) {
  try {
    const response = await fetch(`/api/sqlite?action=${action}`);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error fetching ${action}:`, error);
    return null;
  }
}

async function postToSQLite(action: string, data: any) {
  try {
    const response = await fetch('/api/sqlite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, data })
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error posting ${action}:`, error);
    return { success: false, error };
  }
}

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
  
  // Funciones para diagnósticos y alergias
  getPatientDiagnosis: (patientId: string) => string | null;
  getPatientEpisodes: (patientId: string) => EpisodioClinico[];
  getPatientAllergies: (patientId: string) => Alergia[];
  getPatientAllergiesDetail: (patientId: string) => (AsignacionAlergia & { alergia: Alergia })[];
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
  updateBedStatus: (bedId: string, status: Bed['status'], patientId?: string) => void;
  updateBedCleaning: (bedId: string, cleaningStatus: Bed['cleaningStatus'], cleanedBy?: string) => void;
  reserveBed: (bedId: string, expirationDate: Date, notes?: string, patientId?: string) => void;
  unassignPatientFromBed: (bedId: string) => void;

  // Funciones para signos vitales
  addVitalSigns: (vitalSigns: Omit<VitalSigns, 'id'>) => void;

  // Funciones para órdenes médicas
  addMedicalOrder: (order: Omit<MedicalOrder, 'id'>) => void;
  updateMedicalOrder: (orderId: string, updates: Partial<MedicalOrder>) => void;
  deleteMedicalOrder: (orderId: string) => void;

  // Funciones para notas de enfermería
  addNursingNote: (note: Omit<NursingNote, 'id'>) => void;
  updateNursingNote: (noteId: string, updates: Partial<NursingNote>) => void;

  // Funciones para evaluaciones clínicas
  addClinicalScale: (scale: Omit<ClinicalScale, 'id'>) => void;
  addWoundAssessment: (assessment: Omit<WoundAssessment, 'id'>) => void;

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
  
  // Inicializar beds aplicando asignaciones de pacientes desde localStorage
  const [beds, setBeds] = useState<Bed[]>(() => {
    if (typeof window !== 'undefined') {
      const savedAssignments = localStorage.getItem('bedPatientAssignments');
      if (savedAssignments) {
        const assignments = JSON.parse(savedAssignments) as Record<string, { patientId?: string; status?: string }>;
        return sqlBeds.map(bed => {
          const savedBed = assignments[bed.id];
          // Si hay una entrada guardada para esta cama, usar sus valores
          // (incluso si patientId es undefined - significa que se desasignó)
          if (savedBed !== undefined) {
            return {
              ...bed,
              patientId: savedBed.patientId, // puede ser undefined si se desasignó
              status: (savedBed.status as Bed['status']) || bed.status
            };
          }
          return bed;
        });
      }
    }
    return sqlBeds;
  });
  const [medications, setMedications] = useState<Medication[]>(sqlMedications);
  const [services, setServices] = useState<Service[]>(sqlServices);
  const [admissions, setAdmissions] = useState<Admission[]>(sqlAdmissions);
  
  // Inicializar medicalOrders aplicando estados guardados desde localStorage
  const [medicalOrders, setMedicalOrders] = useState<MedicalOrder[]>(() => {
    if (typeof window !== 'undefined') {
      const savedOrderStatuses = localStorage.getItem('medicalOrderStatuses');
      if (savedOrderStatuses) {
        const statuses = JSON.parse(savedOrderStatuses) as Record<string, string>;
        return sqlMedicalOrders.map(order => ({
          ...order,
          status: (statuses[order.id] as MedicalOrder['status']) || order.status
        }));
      }
    }
    return sqlMedicalOrders;
  });
  const [staff, setStaff] = useState<User[]>(sqlStaff as User[]);
  
  // Estados con datos mock (no disponibles en SQL)
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(mockMedicalRecords);
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>(mockVitalSigns);
  const [nursingNotes, setNursingNotes] = useState<NursingNote[]>(mockNursingNotes);
  
  // Inicializar clinicalScales con datos de localStorage
  const [clinicalScales, setClinicalScales] = useState<ClinicalScale[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('clinicalScales');
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...mockClinicalScales, ...parsed.map((s: any) => ({
          ...s,
          timestamp: new Date(s.timestamp)
        }))];
      }
    }
    return mockClinicalScales;
  });
  
  const [fluidBalance, setFluidBalance] = useState<FluidBalance[]>(mockFluidBalance);
  
  // Inicializar woundAssessments con datos de localStorage
  const [woundAssessments, setWoundAssessments] = useState<WoundAssessment[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('woundAssessments');
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...mockWoundAssessments, ...parsed.map((w: any) => ({
          ...w,
          assessmentDate: new Date(w.assessmentDate)
        }))];
      }
    }
    return mockWoundAssessments;
  });
  const [medicalEvolutions, setMedicalEvolutions] = useState<MedicalEvolution[]>(mockMedicalEvolutions);
  const [dischargeChecklists, setDischargeChecklists] = useState<DischargeChecklist[]>(mockDischargeChecklists);
  const [systemNotifications] = useState<SystemNotification[]>(mockSystemNotifications);
  
  // Inicializar chatMessages aplicando los mensajes leídos desde localStorage
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      const readMessageIds = localStorage.getItem('readMessageIds');
      if (readMessageIds) {
        const ids = JSON.parse(readMessageIds) as string[];
        return mockChatMessages.map(msg => ({
          ...msg,
          isRead: ids.includes(msg.id) ? true : msg.isRead
        }));
      }
    }
    return mockChatMessages;
  });
  
  // Estados para funcionalidades avanzadas
  const [hospitalFloors] = useState<HospitalFloor[]>(mockHospitalFloors);
  const [aiAssistants] = useState<AIAssistant[]>(mockAIAssistant);
  const [futureAppointments, setFutureAppointments] = useState<FutureAppointment[]>(mockFutureAppointments);
  const [followUpAlerts, setFollowUpAlerts] = useState<FollowUpAlert[]>(mockFollowUpAlerts);
  const [privacySettings] = useState<PrivacySettings[]>(mockPrivacySettings);
  const [appointmentSummaries] = useState<AppointmentSummary[]>(mockAppointmentSummaries);

  // Inicializar base de datos SQLite al cargar
  useEffect(() => {
    console.log('🏥 Hospital Context inicializando...');
    
    // Cargar datos desde SQLite
    async function loadFromSQLite() {
      try {
        console.log('🔄 Cargando datos desde SQLite...');
        
        // Cargar todos los datos en paralelo
        const [
          patientsData,
          staffData,
          roomsBedsData,
          medicationsData,
          servicesData,
          admissionsData,
          ordersData,
          vitalsData
        ] = await Promise.all([
          fetchFromSQLite('patients'),
          fetchFromSQLite('staff'),
          fetchFromSQLite('rooms-beds'),
          fetchFromSQLite('medications'),
          fetchFromSQLite('services'),
          fetchFromSQLite('admissions'),
          fetchFromSQLite('orders'),
          fetchFromSQLite('vitals')
        ]);
        
        // Actualizar estados - usar SQLite si tiene más datos que los estáticos
        // Si SQLite tiene muy pocos datos, usar los datos estáticos de sql-data.ts
        
        // Pacientes: usar SQLite solo si tiene más pacientes que los estáticos
        if (patientsData?.length >= sqlPatients.length) {
          setPatients(parsePatientDates(patientsData));
        } else {
          console.log('⚠️ SQLite tiene menos pacientes, usando datos estáticos');
        }
        
        // Staff: usar SQLite solo si tiene más personal que los estáticos
        if (staffData?.length >= sqlStaff.length) {
          setStaff(staffData);
        } else {
          console.log('⚠️ SQLite tiene menos personal, usando datos estáticos');
        }
        
        // Habitaciones y camas
        if (roomsBedsData?.rooms?.length >= sqlRooms.length) {
          setRooms(parseRoomDates(roomsBedsData.rooms));
        }
        if (roomsBedsData?.beds?.length >= sqlBeds.length) {
          // Obtener asignaciones de localStorage como fallback
          const savedAssignments = typeof window !== 'undefined' 
            ? localStorage.getItem('bedPatientAssignments') 
            : null;
          const localAssignments: Record<string, { patientId?: string; status?: string }> = 
            savedAssignments ? JSON.parse(savedAssignments) : {};
          
          // Combinar datos de SQLite con localStorage (priorizar SQLite, fallback a localStorage)
          const bedsWithAssignments = parseBedDates(roomsBedsData.beds).map(bed => {
            // Si SQLite tiene datos de paciente, usar esos
            if (bed.patientId) {
              return bed;
            }
            // Si no, verificar si localStorage tiene una asignación guardada
            const localData = localAssignments[bed.id];
            if (localData !== undefined) {
              return {
                ...bed,
                patientId: localData.patientId,
                status: (localData.status as Bed['status']) || bed.status
              };
            }
            return bed;
          });
          
          setBeds(bedsWithAssignments);
        }
        
        // Medicamentos
        if (medicationsData?.length >= sqlMedications.length) {
          setMedications(parseMedicationDates(medicationsData));
        }
        
        // Servicios
        if (servicesData?.length >= sqlServices.length) {
          setServices(servicesData);
        }
        
        // Admisiones
        if (admissionsData?.length >= sqlAdmissions.length) {
          setAdmissions(parseAdmissionDates(admissionsData));
        }
        
        // Órdenes médicas - siempre usar las de sql-data.ts ya que están correctamente mapeadas
        // El adaptador SQLite no mapea correctamente episodio -> paciente
        // Las órdenes de sqlMedicalOrders ya tienen el patientId correcto
        console.log('📋 Usando órdenes de sql-data.ts:', sqlMedicalOrders.length);
        
        // Signos vitales - solo de SQLite si hay datos
        if (vitalsData?.length > 0) {
          setVitalSigns(parseVitalSignDates(vitalsData));
        }
        
        console.log('✅ Datos cargados desde SQLite');
        console.log(`  - Pacientes: ${patientsData?.length || patients.length}`);
        console.log(`  - Personal: ${staffData?.length || staff.length}`);
        console.log(`  - Habitaciones: ${roomsBedsData?.rooms?.length || rooms.length}`);
        console.log(`  - Camas: ${roomsBedsData?.beds?.length || beds.length}`);
        console.log(`  - Medicamentos: ${medicationsData?.length || medications.length}`);
        console.log(`  - Servicios: ${servicesData?.length || services.length}`);
        console.log(`  - Admisiones: ${admissionsData?.length || admissions.length}`);
        console.log(`  - Órdenes: ${ordersData?.length || medicalOrders.length}`);
        
      } catch (error) {
        console.warn('⚠️ Error cargando datos desde SQLite, usando datos estáticos:', error);
      }
    }
    
    loadFromSQLite();
  }, []);

  // Sincronizar roomId de pacientes basándose en las camas ocupadas
  useEffect(() => {
    // Crear un mapa de patientId -> roomId basándose en las camas
    const patientRoomMap = new Map<string, { roomId: string; bedNumber: string }>();
    
    beds.forEach(bed => {
      if (bed.patientId && bed.status === 'Occupied') {
        const room = rooms.find(r => r.id === bed.roomId);
        if (room) {
          patientRoomMap.set(bed.patientId, { 
            roomId: room.id, 
            bedNumber: bed.number 
          });
        }
      }
    });
    
    // Actualizar pacientes que tienen cama asignada pero sin roomId
    setPatients(prevPatients => {
      let needsUpdate = false;
      const updatedPatients = prevPatients.map(patient => {
        const bedInfo = patientRoomMap.get(patient.id);
        if (bedInfo && (!patient.roomId || patient.roomId !== bedInfo.roomId)) {
          needsUpdate = true;
          return { ...patient, roomId: bedInfo.roomId, bedNumber: bedInfo.bedNumber };
        }
        return patient;
      });
      
      if (needsUpdate) {
        console.log('🔄 Sincronizando roomId de pacientes con camas asignadas');
        return updatedPatients;
      }
      return prevPatients;
    });
  }, [beds, rooms]);

  // Función para recargar datos desde SQLite
  const refreshFromDatabase = useCallback(async () => {
    try {
      console.log('🔄 Recargando datos desde SQLite...');
      
      // Resetear y recargar
      await postToSQLite('reset', {});
      
      // Cargar todos los datos en paralelo
      const [
        patientsData,
        staffData,
        roomsBedsData,
        medicationsData,
        servicesData,
        admissionsData,
        ordersData,
        vitalsData
      ] = await Promise.all([
        fetchFromSQLite('patients'),
        fetchFromSQLite('staff'),
        fetchFromSQLite('rooms-beds'),
        fetchFromSQLite('medications'),
        fetchFromSQLite('services'),
        fetchFromSQLite('admissions'),
        fetchFromSQLite('orders'),
        fetchFromSQLite('vitals')
      ]);
      
      // Actualizar estados - convertir strings de fechas a objetos Date
      setPatients(patientsData?.length > 0 ? parsePatientDates(patientsData) : sqlPatients);
      setStaff(staffData?.length > 0 ? staffData : sqlStaff as User[]);
      setRooms(roomsBedsData?.rooms?.length > 0 ? parseRoomDates(roomsBedsData.rooms) : sqlRooms);
      
      // Camas: combinar SQLite con localStorage
      if (roomsBedsData?.beds?.length > 0) {
        const savedAssignments = typeof window !== 'undefined' 
          ? localStorage.getItem('bedPatientAssignments') 
          : null;
        const localAssignments: Record<string, { patientId?: string; status?: string }> = 
          savedAssignments ? JSON.parse(savedAssignments) : {};
        
        const bedsWithAssignments = parseBedDates(roomsBedsData.beds).map(bed => {
          if (bed.patientId) return bed;
          const localData = localAssignments[bed.id];
          if (localData !== undefined) {
            return {
              ...bed,
              patientId: localData.patientId,
              status: (localData.status as Bed['status']) || bed.status
            };
          }
          return bed;
        });
        setBeds(bedsWithAssignments);
      } else {
        setBeds(sqlBeds);
      }
      setMedications(medicationsData?.length > 0 ? parseMedicationDates(medicationsData) : sqlMedications);
      setServices(servicesData?.length > 0 ? servicesData : sqlServices);
      setAdmissions(admissionsData?.length > 0 ? parseAdmissionDates(admissionsData) : sqlAdmissions);
      // Siempre usar las órdenes de sql-data.ts (están correctamente mapeadas con episodio -> paciente)
      setMedicalOrders(sqlMedicalOrders);
      if (vitalsData?.length > 0) setVitalSigns(parseVitalSignDates(vitalsData));
      
      console.log('✅ Datos recargados desde SQLite');
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

  // Funciones para pacientes - CON PERSISTENCIA SQLite
  const addPatient = useCallback(async (patientData: Omit<Patient, 'id'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: `patient-${Date.now()}`
    } as Patient;
    
    // Actualizar estado local inmediatamente
    setPatients(prev => [...prev, newPatient]);
    
    // Persistir en SQLite
    const result = await postToSQLite('add-patient', patientData);
    if (result.success) {
      console.log('✅ Paciente guardado en SQLite');
    } else {
      console.error('❌ Error guardando paciente en SQLite:', result.error);
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
    
    // Persistir en SQLite
    const result = await postToSQLite('update-patient', { id: patientId, updates });
    if (result.success) {
      console.log('✅ Paciente actualizado en SQLite');
    } else {
      console.error('❌ Error actualizando paciente en SQLite:', result.error);
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
    
    // Persistir en SQLite
    const result = await postToSQLite('delete-patient', { id: patientId });
    if (result.success) {
      console.log('✅ Paciente eliminado de SQLite');
    } else {
      console.error('❌ Error eliminando paciente de SQLite:', result.error);
    }
    
    addAuditLog({
      action: 'DELETE',
      resource: 'patient',
      resourceId: patientId
    });
  }, [addAuditLog]);

  // Funciones para personal - CON PERSISTENCIA SQLite
  const addStaff = useCallback(async (staffData: Omit<User, 'id'>) => {
    const newStaff: User = {
      ...staffData,
      id: `staff-${Date.now()}`
    } as User;
    
    // Actualizar estado local inmediatamente
    setStaff(prev => [...prev, newStaff]);
    
    // Persistir en SQLite
    const result = await postToSQLite('add-staff', staffData);
    if (result.success) {
      console.log('✅ Personal guardado en SQLite');
    } else {
      console.error('❌ Error guardando personal en SQLite:', result.error);
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
    
    // Persistir en SQLite
    const result = await postToSQLite('update-staff', { id: staffId, updates });
    if (result.success) {
      console.log('✅ Personal actualizado en SQLite');
    } else {
      console.error('❌ Error actualizando personal en SQLite:', result.error);
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
    
    // Persistir en SQLite
    const result = await postToSQLite('delete-staff', { id: staffId });
    if (result.success) {
      console.log('✅ Personal eliminado de SQLite');
    } else {
      console.error('❌ Error eliminando personal de SQLite:', result.error);
    }
    
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

  // Función helper para persistir asignaciones de cama en localStorage
  const persistBedAssignments = useCallback((updatedBeds: Bed[]) => {
    if (typeof window !== 'undefined') {
      // Cargar asignaciones existentes para mantener el historial
      const existingSaved = localStorage.getItem('bedPatientAssignments');
      const existingAssignments: Record<string, { patientId?: string; status?: string }> = 
        existingSaved ? JSON.parse(existingSaved) : {};
      
      // Actualizar/añadir las camas modificadas
      updatedBeds.forEach(bed => {
        // Guardar TODAS las camas que tienen un estado diferente a Available O que tuvieron un paciente antes
        // Importante: también guardar cuando patientId es undefined (desasignación)
        const hadPreviousAssignment = existingAssignments[bed.id] !== undefined;
        
        if (bed.patientId || bed.status !== 'Available' || hadPreviousAssignment) {
          existingAssignments[bed.id] = { 
            patientId: bed.patientId, // será undefined si se desasignó
            status: bed.status 
          };
        }
      });
      
      localStorage.setItem('bedPatientAssignments', JSON.stringify(existingAssignments));
      console.log('💾 Asignaciones de camas persistidas:', existingAssignments);
    }
  }, []);

  // Funciones para camas - CON PERSISTENCIA SQLite y localStorage
  const updateBedStatus = useCallback(async (bedId: string, status: Bed['status'], patientId?: string) => {
    const bed = beds.find(b => b.id === bedId);
    
    // Actualizar estado local inmediatamente
    setBeds(prev => {
      const updated = prev.map(b => 
        b.id === bedId 
          ? { 
              ...b, 
              status,
              patientId: patientId !== undefined ? patientId : b.patientId 
            } 
          : b
      );
      // Persistir en localStorage
      persistBedAssignments(updated);
      return updated;
    });
    
    // Si se asignó un paciente, actualizar también el paciente
    if (patientId && bed) {
      setPatients(prev => prev.map(p => 
        p.id === patientId 
          ? { ...p, roomId: bed.roomId, bedNumber: bed.number }
          : p
      ));
      
      // Persistir cambio del paciente en SQLite
      await postToSQLite('update-patient', { 
        id: patientId, 
        updates: {
          roomId: bed.roomId, 
          bedNumber: bed.number 
        }
      });
    }
    
    // Persistir en SQLite
    const result = await postToSQLite('update-bed-status', { bedId, status, patientId });
    if (result.success) {
      console.log('✅ Estado de cama actualizado en SQLite y localStorage');
    } else {
      console.error('❌ Error actualizando cama en SQLite:', result.error);
    }
    
    addAuditLog({
      action: 'UPDATE',
      resource: 'bed',
      resourceId: bedId,
      details: { newStatus: status, patientId }
    });
  }, [addAuditLog, beds, persistBedAssignments]);

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
    
    // Persistir en SQLite
    const status = cleaningStatus === 'Cleaning Required' ? 'Cleaning Required' : 'Available';
    const result = await postToSQLite('update-bed-status', { bedId, status });
    if (result.success) {
      console.log('✅ Limpieza de cama actualizada en SQLite');
    } else {
      console.error('❌ Error actualizando limpieza de cama en SQLite:', result.error);
    }
    
    addAuditLog({
      action: 'UPDATE',
      resource: 'bed-cleaning',
      resourceId: bedId,
      details: { cleaningStatus, cleanedBy }
    });
  }, [addAuditLog]);

  const reserveBed = useCallback(async (bedId: string, expirationDate: Date, notes?: string, patientId?: string) => {
    // Actualizar estado local inmediatamente
    setBeds(prev => {
      const updated = prev.map(bed => 
        bed.id === bedId 
          ? { 
              ...bed, 
              status: 'Reserved' as const,
              reservationExpires: expirationDate,
              notes: notes || bed.notes,
              patientId: patientId || bed.patientId
            }
          : bed
      );
      // Persistir en localStorage
      persistBedAssignments(updated);
      return updated;
    });
    
    // Si se asignó un paciente, actualizar también el paciente con la habitación y cama
    if (patientId) {
      const bed = beds.find(b => b.id === bedId);
      if (bed) {
        setPatients(prev => prev.map(p => 
          p.id === patientId 
            ? { ...p, roomId: bed.roomId, bedNumber: bed.number }
            : p
        ));
      }
    }
    
    // Persistir en SQLite
    const result = await postToSQLite('update-bed-status', { bedId, status: 'Reserved', patientId });
    if (result.success) {
      console.log('✅ Reserva de cama guardada en SQLite y localStorage');
    } else {
      console.error('❌ Error reservando cama en SQLite:', result.error);
    }
    
    addAuditLog({
      action: 'RESERVE',
      resource: 'bed',
      resourceId: bedId,
      details: { expirationDate: expirationDate.toISOString(), notes, patientId }
    });
  }, [addAuditLog, beds, persistBedAssignments]);

  // Función para desasignar paciente de una cama - CON PERSISTENCIA SQLite y localStorage
  const unassignPatientFromBed = useCallback(async (bedId: string) => {
    const bed = beds.find(b => b.id === bedId);
    if (!bed) return;
    
    const previousPatientId = bed.patientId;
    
    // Actualizar estado de la cama - quitar paciente y marcar como disponible
    setBeds(prev => {
      const updated = prev.map(b => 
        b.id === bedId 
          ? { 
              ...b, 
              status: 'Cleaning Required' as const,
              patientId: undefined,
              reservationExpires: undefined,
              notes: `Paciente dado de alta/trasladado - ${new Date().toLocaleString()}`
            }
          : b
      );
      // Persistir en localStorage
      persistBedAssignments(updated);
      return updated;
    });
    
    // Actualizar el paciente - quitar habitación y cama
    if (previousPatientId) {
      setPatients(prev => prev.map(p => 
        p.id === previousPatientId 
          ? { ...p, roomId: undefined, bedNumber: undefined }
          : p
      ));
      
      // Persistir cambio en paciente en SQLite
      await postToSQLite('update-patient', { 
        id: previousPatientId, 
        updates: {
          roomId: null, 
          bedNumber: null 
        }
      });
    }
    
    // Persistir cambio de cama en SQLite
    const result = await postToSQLite('update-bed-status', { 
      bedId, 
      status: 'Cleaning Required',
      patientId: null 
    });
    
    if (result.success) {
      console.log('✅ Paciente desasignado de cama en SQLite y localStorage');
    } else {
      console.error('❌ Error desasignando paciente de cama:', result.error);
    }
    
    addAuditLog({
      action: 'UNASSIGN',
      resource: 'bed',
      resourceId: bedId,
      details: { previousPatientId, action: 'patient_unassigned' }
    });
  }, [addAuditLog, beds, persistBedAssignments]);

  // Funciones para signos vitales - CON PERSISTENCIA SQLite
  const addVitalSigns = useCallback(async (vitalSignsData: Omit<VitalSigns, 'id'>) => {
    const newVitalSigns: VitalSigns = {
      ...vitalSignsData,
      id: `vs-${Date.now()}`
    };
    
    // Actualizar estado local inmediatamente
    setVitalSigns(prev => [...prev, newVitalSigns]);
    
    // Persistir en SQLite
    const result = await postToSQLite('add-vital-signs', {
      ...vitalSignsData,
      timestamp: vitalSignsData.timestamp.toISOString()
    });
    if (result.success) {
      console.log('✅ Signos vitales guardados en SQLite');
    } else {
      console.error('❌ Error guardando signos vitales en SQLite:', result.error);
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

  // Funciones para órdenes médicas - CON PERSISTENCIA SQLite
  const addMedicalOrder = useCallback(async (orderData: Omit<MedicalOrder, 'id'>) => {
    const newOrder: MedicalOrder = {
      ...orderData,
      id: `order-${Date.now()}`
    };
    
    // Actualizar estado local inmediatamente
    setMedicalOrders(prev => [...prev, newOrder]);
    
    // Persistir en SQLite
    const result = await postToSQLite('add-medical-order', {
      ...orderData,
      orderDate: orderData.orderDate.toISOString()
    });
    if (result.success) {
      console.log('✅ Orden médica guardada en SQLite');
    } else {
      console.error('❌ Error guardando orden médica en SQLite:', result.error);
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
    
    // Persistir estado en localStorage
    if (typeof window !== 'undefined' && updates.status) {
      const savedOrderStatuses = localStorage.getItem('medicalOrderStatuses');
      const statuses = savedOrderStatuses ? JSON.parse(savedOrderStatuses) as Record<string, string> : {};
      statuses[orderId] = updates.status;
      localStorage.setItem('medicalOrderStatuses', JSON.stringify(statuses));
    }
    
    console.log('📝 Orden médica actualizada y persistida');
    
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

  // Funciones para notas de enfermería - CON PERSISTENCIA SQLite
  const addNursingNote = useCallback(async (noteData: Omit<NursingNote, 'id'>) => {
    const newNote: NursingNote = {
      ...noteData,
      id: `nn-${Date.now()}`
    };
    
    // Actualizar estado local inmediatamente
    setNursingNotes(prev => [...prev, newNote]);
    
    // Persistir en SQLite
    const result = await postToSQLite('add-nursing-document', {
      episodeId: noteData.patientId,
      professionalId: noteData.nurseId,
      documentType: noteData.category,
      text: noteData.content
    });
    if (result.success) {
      console.log('✅ Nota de enfermería guardada en SQLite');
    } else {
      console.error('❌ Error guardando nota de enfermería en SQLite:', result.error);
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

  // Funciones para evaluaciones clínicas
  const addClinicalScale = useCallback((scaleData: Omit<ClinicalScale, 'id'>) => {
    const newScale: ClinicalScale = {
      ...scaleData,
      id: `cs-${Date.now()}`
    };
    
    setClinicalScales(prev => {
      const updated = [...prev, newScale];
      // Persistir en localStorage (solo las nuevas, no las mock)
      if (typeof window !== 'undefined') {
        const toSave = updated.filter(s => s.id.startsWith('cs-'));
        localStorage.setItem('clinicalScales', JSON.stringify(toSave.map(s => ({
          ...s,
          timestamp: s.timestamp.toISOString()
        }))));
      }
      return updated;
    });
    
    addAuditLog({
      action: 'CREATE',
      resource: 'clinical-scale',
      resourceId: newScale.id,
      details: { 
        patientId: newScale.patientId,
        scaleType: newScale.scaleType,
        score: newScale.score
      }
    });
    
    console.log('✅ Escala clínica guardada');
  }, [addAuditLog]);

  const addWoundAssessment = useCallback((assessmentData: Omit<WoundAssessment, 'id'>) => {
    const newAssessment: WoundAssessment = {
      ...assessmentData,
      id: `wa-${Date.now()}`
    };
    
    setWoundAssessments(prev => {
      const updated = [...prev, newAssessment];
      // Persistir en localStorage (solo las nuevas, no las mock)
      if (typeof window !== 'undefined') {
        const toSave = updated.filter(w => w.id.startsWith('wa-'));
        localStorage.setItem('woundAssessments', JSON.stringify(toSave.map(w => ({
          ...w,
          assessmentDate: w.assessmentDate.toISOString()
        }))));
      }
      return updated;
    });
    
    addAuditLog({
      action: 'CREATE',
      resource: 'wound-assessment',
      resourceId: newAssessment.id,
      details: { 
        patientId: newAssessment.patientId,
        woundType: newAssessment.woundType,
        woundLocation: newAssessment.woundLocation
      }
    });
    
    console.log('✅ Evaluación de herida guardada');
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
    
    // Persistir en localStorage
    if (typeof window !== 'undefined') {
      const readMessageIds = localStorage.getItem('readMessageIds');
      const ids = readMessageIds ? JSON.parse(readMessageIds) as string[] : [];
      if (!ids.includes(messageId)) {
        ids.push(messageId);
        localStorage.setItem('readMessageIds', JSON.stringify(ids));
      }
    }
    
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
    
    const markedIds: string[] = [];
    
    setChatMessages(prev => prev.map(msg => {
      // Solo marcar como leído si el mensaje es para el usuario actual
      const isRecipient = 
        !msg.recipientRole || 
        msg.recipientRole === 'all' || 
        msg.recipientRole === user.role;
      
      if (isRecipient && !msg.isRead) {
        markedIds.push(msg.id);
        return { ...msg, isRead: true };
      }
      return msg;
    }));
    
    // Persistir en localStorage
    if (typeof window !== 'undefined' && markedIds.length > 0) {
      const readMessageIds = localStorage.getItem('readMessageIds');
      const ids = readMessageIds ? JSON.parse(readMessageIds) as string[] : [];
      const newIds = [...new Set([...ids, ...markedIds])];
      localStorage.setItem('readMessageIds', JSON.stringify(newIds));
    }
    
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
    
    // Roles clínicos que pueden ver comunicaciones internas clínicas
    const clinicalRoles = ['doctor', 'nurse', 'auxiliary'];
    
    // PACIENTE y FAMILIA: Solo ven mensajes dirigidos ESPECÍFICAMENTE a ellos
    // NO deben ver comunicaciones internas del hospital
    if (user.role === 'patient' || user.role === 'family') {
      return chatMessages.filter(msg => {
        // Solo mensajes dirigidos específicamente al usuario por ID
        if (msg.recipientId === user.id) return true;
        // O mensajes que el paciente/familiar ha enviado
        if (msg.senderId === user.id) return true;
        // NO mostrar broadcasts ni mensajes dirigidos a roles
        return false;
      });
    }
    
    // LIMPIEZA: Solo ver mensajes dirigidos a su rol o a ellos específicamente
    // NO deben ver comunicaciones clínicas entre médicos y enfermeros
    if (user.role === 'cleaning') {
      return chatMessages.filter(msg => {
        // Mensajes enviados por el usuario
        if (msg.senderId === user.id) return true;
        // Mensajes dirigidos específicamente al usuario
        if (msg.recipientId === user.id) return true;
        // Mensajes dirigidos al rol de limpieza
        if (msg.recipientRole === 'cleaning') return true;
        // Mensajes broadcast para todo el hospital (no clínicos)
        if (msg.recipientRole === 'all' && !clinicalRoles.includes(msg.senderRole || '')) return true;
        return false;
      });
    }
    
    
    
    // Para el resto del personal clínico (doctor, nurse, auxiliary): filtrar normalmente
    return chatMessages.filter(msg => {
      // Mensajes enviados por el usuario
      if (msg.senderId === user.id) return true;
      
      // Mensajes broadcast (para personal del hospital)
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
    
    // Admin ve todos los pacientes
    if (user.role === 'admin') {
      return patients;
    }
    
    // PACIENTE: Solo puede ver su propio perfil
    if (user.role === 'patient') {
      // El ID del usuario paciente debería coincidir con un patientId
      return patients.filter(patient => 
        patient.id === user.id || 
        patient.dni === user.professionalId ||
        patient.id === user.professionalId
      );
    }
    
    // FAMILIA: Solo puede ver el paciente vinculado
    if (user.role === 'family') {
      // El professionalId del familiar debería ser el ID del paciente relacionado
      return patients.filter(patient => 
        patient.id === user.professionalId ||
        patient.dni === user.professionalId
      );
    }
    
    // Para personal de admisiones: mostrar todos los pacientes
    if (user.role === 'admission') {
      return patients;
    }
    
    // Para personal de limpieza: NO mostrar información de pacientes
    if (user.role === 'cleaning') {
      return [];
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

  /**
   * Funciones para obtener diagnósticos y alergias
   */
  const getPatientDiagnosis = useCallback((patientId: string): string | null => {
    return getDiagnosticoActivoPaciente(patientId);
  }, []);

  const getPatientEpisodes = useCallback((patientId: string): EpisodioClinico[] => {
    return getEpisodiosPorPaciente(patientId);
  }, []);

  const getPatientAllergies = useCallback((patientId: string): Alergia[] => {
    return getAlergiasPorPaciente(patientId);
  }, []);

  const getPatientAllergiesDetail = useCallback((patientId: string): (AsignacionAlergia & { alergia: Alergia })[] => {
    return getDetalleAlergiasPaciente(patientId);
  }, []);

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
    
    // Funciones para diagnósticos y alergias
    getPatientDiagnosis,
    getPatientEpisodes,
    getPatientAllergies,
    getPatientAllergiesDetail,

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
    unassignPatientFromBed,
    addVitalSigns,
    addMedicalOrder,
    updateMedicalOrder,
    deleteMedicalOrder,
    addNursingNote,
    updateNursingNote,
    addClinicalScale,
    addWoundAssessment,
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
