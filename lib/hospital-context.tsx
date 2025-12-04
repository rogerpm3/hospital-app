'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './auth-context';
import { 
  mockPatients, 
  mockRooms, 
  mockBeds, 
  mockAppointments, 
  mockAdmissions, 
  mockMedicalRecords, 
  mockVitalSigns, 
  mockMedications,
  mockMedicalOrders,
  mockNursingNotes,
  mockClinicalScales,
  mockFluidBalance,
  mockWoundAssessments,
  mockMedicalEvolutions,
  mockDischargeChecklists,
  mockSystemNotifications,
  mockChatMessages,
  mockServices
} from './mock-data';
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
  ChatMessage
} from './types';

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

  // Funciones para pacientes
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (patientId: string, updates: Partial<Patient>) => void;
  deletePatient: (patientId: string) => void;

  // Funciones para citas
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (appointmentId: string, updates: Partial<Appointment>) => void;
  cancelAppointment: (appointmentId: string, reason: string) => void;

  // Funciones para camas
  updateBedStatus: (bedId: string, status: Bed['status']) => void;
  updateBedCleaning: (bedId: string, cleaningStatus: Bed['cleaningStatus'], cleanedBy?: string) => void;
  reserveBed: (bedId: string, expirationDate: Date, notes?: string) => void;

  // Funciones para signos vitales
  addVitalSigns: (vitalSigns: Omit<VitalSigns, 'id'>) => void;

  // Funciones para órdenes médicas
  addMedicalOrder: (order: Omit<MedicalOrder, 'id'>) => void;
  updateMedicalOrder: (orderId: string, updates: Partial<MedicalOrder>) => void;

  // Funciones para notas de enfermería
  addNursingNote: (note: Omit<NursingNote, 'id'>) => void;
  updateNursingNote: (noteId: string, updates: Partial<NursingNote>) => void;

  // Funciones para plan de alta
  addDischargePlan: (plan: Omit<DischargeChecklist, 'id'>) => void;
  updateDischargePlan: (planId: string, updates: Partial<DischargeChecklist>) => void;

  // Funciones para mensajes
  addChatMessage: (message: Omit<ChatMessage, 'id'>) => void;

  // Funciones para evoluciones médicas
  addMedicalEvolution: (evolution: Omit<MedicalEvolution, 'id'>) => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export function HospitalProvider({ children }: { children: React.ReactNode }) {
  const { addAuditLog } = useAuth();
  
  // Estados principales
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [beds, setBeds] = useState<Bed[]>(mockBeds);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [admissions, setAdmissions] = useState<Admission[]>(mockAdmissions);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(mockMedicalRecords);
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>(mockVitalSigns);
  const [medications, setMedications] = useState<Medication[]>(mockMedications);
  const [services] = useState<Service[]>(mockServices);
  const [medicalOrders, setMedicalOrders] = useState<MedicalOrder[]>(mockMedicalOrders);
  const [nursingNotes, setNursingNotes] = useState<NursingNote[]>(mockNursingNotes);
  const [clinicalScales] = useState<ClinicalScale[]>(mockClinicalScales);
  const [fluidBalance] = useState<FluidBalance[]>(mockFluidBalance);
  const [woundAssessments] = useState<WoundAssessment[]>(mockWoundAssessments);
  const [medicalEvolutions, setMedicalEvolutions] = useState<MedicalEvolution[]>(mockMedicalEvolutions);
  const [dischargeChecklists, setDischargeChecklists] = useState<DischargeChecklist[]>(mockDischargeChecklists);
  const [systemNotifications] = useState<SystemNotification[]>(mockSystemNotifications);
  const [chatMessages] = useState<ChatMessage[]>(mockChatMessages);

  // Efectos para persistir datos en localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hospital-patients', JSON.stringify(patients));
    }
  }, [patients]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hospital-beds', JSON.stringify(beds));
    }
  }, [beds]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hospital-appointments', JSON.stringify(appointments));
    }
  }, [appointments]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hospital-medical-orders', JSON.stringify(medicalOrders));
    }
  }, [medicalOrders]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hospital-nursing-notes', JSON.stringify(nursingNotes));
    }
  }, [nursingNotes]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hospital-vital-signs', JSON.stringify(vitalSigns));
    }
  }, [vitalSigns]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hospital-admissions', JSON.stringify(admissions));
    }
  }, [admissions]);

  // Funciones para pacientes
  const addPatient = useCallback((patientData: Omit<Patient, 'id'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: `patient-${Date.now()}`
    };
    
    setPatients(prev => [...prev, newPatient]);
    
    addAuditLog({
      action: 'CREATE',
      resource: 'patient',
      resourceId: newPatient.id,
      details: { patientName: `${newPatient.firstName} ${newPatient.lastName}` }
    });
  }, [addAuditLog]);

  const updatePatient = useCallback((patientId: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(patient => 
      patient.id === patientId ? { ...patient, ...updates } : patient
    ));
    
    addAuditLog({
      action: 'UPDATE',
      resource: 'patient',
      resourceId: patientId,
      details: updates
    });
  }, [addAuditLog]);

  const deletePatient = useCallback((patientId: string) => {
    setPatients(prev => prev.filter(patient => patient.id !== patientId));
    
    addAuditLog({
      action: 'DELETE',
      resource: 'patient',
      resourceId: patientId
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

  // Funciones para camas
  const updateBedStatus = useCallback((bedId: string, status: Bed['status'], additionalData?: any) => {
    setBeds(prev => prev.map(bed => 
      bed.id === bedId ? { 
        ...bed, 
        status,
        ...additionalData,
        lastUpdated: new Date().toISOString()
      } : bed
    ));
    
    addAuditLog({
      action: 'UPDATE',
      resource: 'bed',
      resourceId: bedId,
      details: { newStatus: status, ...additionalData }
    });
  }, [addAuditLog]);

  const updateBedCleaning = useCallback((bedId: string, cleaningStatus: Bed['cleaningStatus'], cleanedBy?: string) => {
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
    
    addAuditLog({
      action: 'UPDATE',
      resource: 'bed-cleaning',
      resourceId: bedId,
      details: { cleaningStatus, cleanedBy }
    });
  }, [addAuditLog]);

  const reserveBed = useCallback((bedId: string, expirationDate: Date, notes?: string) => {
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
    
    addAuditLog({
      action: 'RESERVE',
      resource: 'bed',
      resourceId: bedId,
      details: { expirationDate: expirationDate.toISOString(), notes }
    });
  }, [addAuditLog]);

  // Funciones para signos vitales
  const addVitalSigns = useCallback((vitalSignsData: Omit<VitalSigns, 'id'>) => {
    const newVitalSigns: VitalSigns = {
      ...vitalSignsData,
      id: `vs-${Date.now()}`
    };
    
    setVitalSigns(prev => [...prev, newVitalSigns]);
    
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

  // Funciones para órdenes médicas
  const addMedicalOrder = useCallback((orderData: Omit<MedicalOrder, 'id'>) => {
    const newOrder: MedicalOrder = {
      ...orderData,
      id: `order-${Date.now()}`
    };
    
    setMedicalOrders(prev => [...prev, newOrder]);
    
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

  const updateMedicalOrder = useCallback((orderId: string, updates: Partial<MedicalOrder>) => {
    setMedicalOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, ...updates } : order
    ));
    
    addAuditLog({
      action: 'UPDATE',
      resource: 'medical-order',
      resourceId: orderId,
      details: updates
    });
  }, [addAuditLog]);

  // Funciones para notas de enfermería
  const addNursingNote = useCallback((noteData: Omit<NursingNote, 'id'>) => {
    const newNote: NursingNote = {
      ...noteData,
      id: `nn-${Date.now()}`
    };
    
    setNursingNotes(prev => [...prev, newNote]);
    
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

  const updateNursingNote = useCallback((noteId: string, updates: Partial<NursingNote>) => {
    setNursingNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, ...updates } : note
    ));
    
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
      details: { 
        recipient: newMessage.recipientRole,
        subject: newMessage.subject 
      }
    });
  }, [addAuditLog]);

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
        doctorName: newEvolution.doctorName
      }
    });
  }, [addAuditLog]);

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

    // Funciones
    addPatient,
    updatePatient,
    deletePatient,
    addAppointment,
    updateAppointment,
    cancelAppointment,
    updateBedStatus,
    updateBedCleaning,
    reserveBed,
    addVitalSigns,
    addMedicalOrder,
    updateMedicalOrder,
    addNursingNote,
    updateNursingNote,
    addDischargePlan,
    updateDischargePlan,

    // Funciones para mensajes
    addChatMessage,

    // Funciones para evoluciones médicas
    addMedicalEvolution
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
