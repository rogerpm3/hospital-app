// Tipos base del sistema hospitalario

export type UserRole = 
  | 'admin' 
  | 'doctor' 
  | 'nurse' 
  | 'auxiliary' 
  | 'cleaning' 
  | 'radiology' 
  | 'social_work' 
  | 'admission'
  | 'patient' 
  | 'family';

export interface User {
  id: string;
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  department?: string;
  specialization?: string;
  licenseNumber?: string;
  professionalId?: string; // Nuevo campo para ID profesional
  isActive: boolean;
  lastLogin?: Date;
  profilePicture?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences?: {
    theme: 'light' | 'dark';
    language: 'es' | 'en';
    notifications: boolean;
  };
  twoFactorEnabled?: boolean;
  lastPasswordChange?: Date;
  anonymousId?: string; // Para mostrar de forma anónima
  assignedUnit?: string; // Unidad asignada
  failedLoginAttempts?: number; // Contador de intentos fallidos
  isLocked?: boolean; // Estado de bloqueo
  lastFailedLogin?: Date;
  // Para usuarios de tipo familia
  relatedPatientId?: string; // Para usuarios familia
  relationshipToPatient?: string; // Relación con el paciente
  accessLevel?: 'full' | 'limited' | 'basic'; // Nivel de acceso
}

// Nuevas interfaces para organización hospitalaria
export interface HospitalUnit {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  specialization: string;
  description: string;
  isActive: boolean;
  rooms: string[]; // IDs de habitaciones
  staff: string[]; // IDs de personal asignado
}

export interface HospitalFloor {
  id: string;
  number: number;
  name: string;
  description: string;
  units: HospitalUnit[];
  totalCapacity: number;
  currentOccupancy: number;
  isRestricted?: boolean;
}

export interface Patient {
  id: string;
  dni: string;
  socialSecurityNumber?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'M' | 'F' | 'Other';
  bloodType?: string;
  phone: string;
  email?: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  allergies: string[];
  medicalHistory: string[];
  currentMedications: string[];
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    expirationDate: Date;
  };
  admissionDate?: Date;
  dischargeDate?: Date;
  roomId?: string;
  bedNumber?: string;
  attendingPhysician?: string;
  admissionReason?: string;
  currentCondition?: 'Stable' | 'Critical' | 'Serious' | 'Fair' | 'Good';
  riskLevel?: 'Low' | 'Medium' | 'High' | 'Critical';
  isolationRequired?: boolean;
  codeStatus?: 'Full Code' | 'DNR' | 'Limited Code';
  // Nuevos campos para asignación de unidad
  assignedUnit?: string;
  assignedFloor?: number;
  assignedWard?: string;
  anonymousId?: string; // Para mostrar en lugar del nombre cuando sea necesario
}

export interface Room {
  id: string;
  number: string;
  floor: number;
  department: string;
  type: 'Single' | 'Double' | 'ICU' | 'CCU' | 'Emergency' | 'Surgery' | 'Maternity' | 'Pediatric';
  beds: Bed[];
  amenities: string[];
  dailyRate: number;
  isOccupied: boolean;
  lastCleaned?: Date;
  maintenanceStatus?: 'Good' | 'Needs Repair' | 'Out of Service';
  notes?: string;
  hasOxygen?: boolean;
  hasMonitor?: boolean;
  hasPrivateBathroom?: boolean;
}

export interface Bed {
  id: string;
  number: string;
  roomId: string;
  isOccupied: boolean;
  patientId?: string;
  status: 'Available' | 'Occupied' | 'Cleaning Required' | 'Maintenance' | 'Reserved';
  cleaningStatus: 'Clean' | 'Dirty' | 'In Progress' | 'Sanitized';
  lastCleaned?: Date;
  cleanedBy?: string;
  reservationExpires?: Date;
  notes?: string;
  equipment?: string[];
  lastMaintenanceDate?: Date;
  hasBedrails?: boolean;
  isElectric?: boolean;
}

export interface Admission {
  id: string;
  patientId: string;
  admissionDate: Date;
  expectedDischargeDate?: Date;
  actualDischargeDate?: Date;
  reason: string;
  type: 'Emergency' | 'Planned' | 'Transfer' | 'Readmission';
  status: 'Active' | 'Discharged' | 'Transferred';
  admittingPhysician: string;
  roomId?: string;
  bedId?: string;
  diagnosticCodes: string[];
  notes?: string;
  priorityLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  admissionSource: 'Emergency' | 'Outpatient' | 'Transfer' | 'Referral';
  paymentMethod: 'Insurance' | 'Self-pay' | 'Government' | 'Other';
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  date: Date;
  type: 'Consultation' | 'Procedure' | 'Lab Result' | 'Imaging' | 'Diagnosis' | 'Treatment Plan';
  description: string;
  physician: string;
  attachments?: string[];
  isCritical: boolean;
  followUpRequired?: boolean;
  followUpDate?: Date;
  tags?: string[];
}

export interface VitalSigns {
  id: string;
  patientId: string;
  timestamp: Date;
  recordedBy: string;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  heartRate: number;
  temperature: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  painLevel?: number;
  glucoseLevel?: number;
  weight?: number;
  height?: number;
  notes?: string;
  alerts?: string[];
}

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  dosage: string;
  frequency: string;
  route: 'Oral' | 'IV' | 'IM' | 'Topical' | 'Inhalation' | 'Sublingual' | 'Rectal';
  startDate: Date;
  endDate?: Date;
  prescribedBy: string;
  patientId: string;
  instructions: string;
  sideEffects?: string[];
  contraindications?: string[];
  cost?: number;
  status: 'Active' | 'Completed' | 'Discontinued' | 'On Hold';
  renewalDate?: Date;
  pharmacyNotes?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  department: string;
  duration: number;
  cost: number;
  requiresPreauth?: boolean;
  isActive: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  physicianId: string;
  physicianName: string;
  serviceId: string;
  serviceName: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'Scheduled' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show' | 'Rescheduled';
  type: 'Consultation' | 'Follow-up' | 'Procedure' | 'Emergency' | 'Preventive';
  location: string;
  notes?: string;
  reminderSent?: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
  cancelReason?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  estimatedCost?: number;
  requiresPrep?: boolean;
  prepInstructions?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userRole: UserRole;
  action: string;
  resource: string;
  resourceId?: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId?: string;
  recipientRole?: UserRole | 'all'; // Rol destinatario: si es 'all' o undefined, va para todos
  channelId?: string;
  message: string;
  subject?: string; // Asunto del mensaje
  timestamp: Date;
  type: 'direct' | 'channel' | 'broadcast' | 'emergency';
  isRead: boolean;
  attachments?: string[];
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent' | string;
  category?: string; // Categoría del mensaje
  relatedPatientId?: string;
}

export interface MedicalOrder {
  id: string;
  patientId: string;
  physicianId: string;
  physicianName: string;
  orderDate: Date;
  type: 'Medication' | 'Lab' | 'Imaging' | 'Procedure' | 'Diet' | 'Activity' | 'Nursing' | 'Therapy';
  category: 'Stat' | 'ASAP' | 'Routine' | 'PRN';
  description: string;
  instructions: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled' | 'On Hold';
  scheduledDateTime?: Date;
  completedDateTime?: Date;
  completedBy?: string;
  notes?: string;
  cost?: number;
  requiresConsent?: boolean;
  consentObtained?: boolean;
  interactions?: string[];
  contraindications?: string[];
}

export interface NursingNote {
  id: string;
  patientId: string;
  nurseId: string;
  nurseName: string;
  timestamp: Date;
  shift: 'Day' | 'Evening' | 'Night';
  category: 'Assessment' | 'Intervention' | 'Evaluation' | 'Care Plan' | 'Medication' | 'Vital Signs' | 'Patient Education';
  note: string;
  objective: string;
  subjective: string;
  plan: string;
  followUpRequired?: boolean;
  flaggedForPhysician?: boolean;
  tags?: string[];
}

// Documentos de enfermería del SQL (formato más estructurado)
export interface NursingDocument {
  id: string;
  episodeId: string;
  patientId: string;
  professionalId: string;
  professionalName: string;
  dateTime: Date;
  documentType: 'Progress' | 'High education' | 'Recommendation' | 'Initial assessment' | 'Hospital Admission Note';
  text: string;
}

export interface ClinicalScale {
  id: string;
  patientId: string;
  assessorId: string;
  assessorName: string;
  timestamp: Date;
  scaleType: 'Glasgow Coma Scale' | 'Braden Scale' | 'Morse Fall Scale' | 'Pain Scale' | 'Delirium Scale' | 'Depression Scale';
  score: number;
  maxScore: number;
  interpretation: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  interventions?: string[];
  notes?: string;
}

export interface FluidBalance {
  id: string;
  patientId: string;
  nurseId: string;
  date: Date;
  shift: 'Day' | 'Evening' | 'Night';
  intake: {
    oral: number;
    iv: number;
    tube: number;
    other: number;
    total: number;
  };
  output: {
    urine: number;
    stool: number;
    vomit: number;
    drainage: number;
    other: number;
    total: number;
  };
  netBalance: number;
  notes?: string;
}

export interface WoundAssessment {
  id: string;
  patientId: string;
  nurseId: string;
  nurseName: string;
  assessmentDate: Date;
  woundLocation: string;
  woundType: 'Surgical' | 'Pressure' | 'Diabetic' | 'Traumatic' | 'Burn' | 'Other';
  length: number;
  width: number;
  depth: number;
  drainageAmount: 'None' | 'Minimal' | 'Moderate' | 'Heavy';
  drainageType: 'Serous' | 'Sanguineous' | 'Purulent' | 'Mixed';
  tissueType: 'Granulation' | 'Necrotic' | 'Slough' | 'Epithelial';
  painLevel: number;
  treatment: string;
  dressing: string;
  healingStage: 'Inflammatory' | 'Proliferative' | 'Maturation';
  photos?: string[];
  notes?: string;
}

export interface MedicalEvolution {
  id: string;
  patientId: string;
  physicianId: string;
  physicianName: string;
  date: Date;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  activeProblems: string[];
  newProblems: string[];
  resolvedProblems: string[];
  vitals?: VitalSigns;
  orders?: MedicalOrder[];
  followUpRequired?: boolean;
  followUpInstructions?: string;
  riskAssessment?: string;
}

export interface DischargeChecklist {
  id: string;
  patientId: string;
  createdBy: string;
  createdDate: Date;
  expectedDischargeDate: Date;
  checklist: {
    medicalClearance: boolean;
    medicationReconciliation: boolean;
    dischargeInstructions: boolean;
    followUpAppointments: boolean;
    equipmentOrdered: boolean;
    transportationArranged: boolean;
    socialWorkConsult: boolean;
    finalBilling: boolean;
    roomCleaning: boolean;
  };
  dischargeInstructions: string;
  medicationList: Medication[];
  followUpAppointments: Appointment[];
  homeCarePlan?: string;
  equipmentNeeded?: string[];
  restrictions?: string[];
  warningSignsEducation?: string;
  status: 'In Progress' | 'Ready' | 'Completed';
  completedBy?: string;
  completedDate?: Date;
  // Nuevos campos para mejoras
  futureAppointments: FutureAppointment[];
  medicalRecommendations: string[];
  dischargeSummaryPdf?: string; // URL del PDF generado
  followUpAlerts: FollowUpAlert[];
}

export interface FutureAppointment {
  id: string;
  patientId: string;
  type: 'Lab Test' | 'Follow-up Consultation' | 'Procedure' | 'Imaging' | 'Therapy';
  description: string;
  scheduledDate: Date;
  provider: string;
  location: string;
  instructions?: string;
  reminderDays: number[];
}

export interface FollowUpAlert {
  id: string;
  patientId: string;
  alertType: 'appointment' | 'medication' | 'test-result' | 'check-up';
  title: string;
  description: string;
  dueDate: Date;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  isActive: boolean;
  completedDate?: Date;
}

// Control de privacidad para diferentes roles
export interface PrivacySettings {
  id: string;
  userId: string;
  role: UserRole;
  canViewFullName: boolean;
  canViewMedicalHistory: boolean;
  canViewVitalSigns: boolean;
  canViewClinicalNotes: boolean;
  canViewDiagnosis: boolean;
  canViewMedications: boolean;
  canViewFinancialInfo: boolean;
  maxPatientDataAccess: 'none' | 'basic' | 'clinical' | 'full';
  allowedPatientIds?: string[]; // Para usuarios familia
}

export interface AIAssistant {
  id: string;
  name: string;
  avatar: string; // URL del icono del robot
  status: 'online' | 'offline' | 'busy';
  capabilities: string[];
}

export interface AIQuery {
  id: string;
  userId: string;
  assistantId: string;
  query: string;
  category: 'medical' | 'administrative' | 'search' | 'statistics' | 'quick-action';
  timestamp: Date;
  response?: string;
  confidence?: number;
  feedback?: 'helpful' | 'not-helpful' | 'partially-helpful';
}

export interface AIAssistance {
  id: string;
  patientId: string;
  requesterId: string;
  requestType: 'Diagnosis' | 'Treatment' | 'Drug Interaction' | 'Clinical Decision' | 'Risk Assessment' | 'Search' | 'Statistics' | 'Quick Action';
  query: string;
  aiResponse: string;
  confidence: number;
  timestamp: Date;
  feedback?: 'Helpful' | 'Not Helpful' | 'Partially Helpful';
  humanOverride?: boolean;
  implementedSuggestions?: string[];
}

// Nueva interface para vista de calendario mejorada
export interface CalendarView {
  id: string;
  viewType: 'daily' | 'weekly' | 'monthly';
  date: Date;
  filters: {
    specialty?: string[];
    room?: string[];
    provider?: string[];
    status?: string[];
  };
}

export interface AppointmentSummary {
  date: Date;
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  completed: number;
  bySpecialty: Record<string, number>;
  byStatus: Record<string, number>;
}

export interface SystemNotification {
  id: string;
  type: 'Info' | 'Warning' | 'Error' | 'Success' | 'Critical';
  title: string;
  message: string;
  timestamp: Date;
  userId?: string;
  role?: UserRole;
  department?: string;
  isRead: boolean;
  action?: {
    label: string;
    url: string;
  };
  expiresAt?: Date;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface TwoFactorAuth {
  id: string;
  userId: string;
  method: 'SMS' | 'Email' | 'Authenticator';
  isEnabled: boolean;
  backupCodes: string[];
  lastUsed?: Date;
  createdAt: Date;
}

export interface BreakGlassAccess {
  id: string;
  userId: string;
  patientId: string;
  reason: string;
  timestamp: Date;
  accessedResources: string[];
  approvedBy?: string;
  justified: boolean;
  reviewed: boolean;
}

// ============================================
// SISTEMA DE CONTROL DE ACCESO Y ROLES
// ============================================

// Tipo de asignación profesional-paciente
export type TipoAsignacion = 'responsable' | 'equipo' | 'consulta' | 'temporal';

// Asignación de profesional a paciente
export interface AsignacionProfesionalPaciente {
  id: string;
  profesionalId: string;
  pacienteId: string;
  tipoAsignacion: TipoAsignacion;
  fechaInicio: Date;
  fechaFin?: Date;
  departamento: string;
  activo: boolean;
  notas?: string;
}

// Permisos por área clínica
export interface PermisoAreaClinica {
  id: string;
  rol: UserRole;
  areaClinica: string;
  puedeVer: boolean;
  puedeEditar: boolean;
  puedeCrear: boolean;
  puedeEliminar: boolean;
  accesoDatosSensibles: boolean;
  descripcion?: string;
}

// Contexto de acceso del usuario actual
export interface AccessContext {
  userId: string;
  userRole: UserRole;
  professionalId?: string;
  departamento?: string;
  unidadAsignada?: string;
  pacientesAsignados: string[]; // IDs de pacientes que puede ver
  permisos: PermisoAreaClinica[];
  esAdmin: boolean;
  puedeVerTodosPacientes: boolean;
}

// Resultado de verificación de acceso
export interface AccessCheckResult {
  permitido: boolean;
  razon?: string;
  nivelAcceso: 'completo' | 'parcial' | 'solo_lectura' | 'denegado';
  datosOcultos?: string[]; // Campos que no puede ver
}

// Filtro de visibilidad de datos
export interface DataVisibilityFilter {
  mostrarNombreCompleto: boolean;
  mostrarDNI: boolean;
  mostrarHistorialMedico: boolean;
  mostrarDiagnosticos: boolean;
  mostrarMedicaciones: boolean;
  mostrarNotasClinicas: boolean;
  mostrarDatosFinancieros: boolean;
  mostrarContactosEmergencia: boolean;
  usarIdentificadorAnonimo: boolean;
}

// Configuración de visibilidad por rol
export const roleDataVisibility: Record<UserRole, DataVisibilityFilter> = {
  admin: {
    mostrarNombreCompleto: true,
    mostrarDNI: true,
    mostrarHistorialMedico: true,
    mostrarDiagnosticos: true,
    mostrarMedicaciones: true,
    mostrarNotasClinicas: true,
    mostrarDatosFinancieros: true,
    mostrarContactosEmergencia: true,
    usarIdentificadorAnonimo: false
  },
  doctor: {
    mostrarNombreCompleto: true,
    mostrarDNI: true,
    mostrarHistorialMedico: true,
    mostrarDiagnosticos: true,
    mostrarMedicaciones: true,
    mostrarNotasClinicas: true,
    mostrarDatosFinancieros: false,
    mostrarContactosEmergencia: true,
    usarIdentificadorAnonimo: false
  },
  nurse: {
    mostrarNombreCompleto: true,
    mostrarDNI: false,
    mostrarHistorialMedico: true,
    mostrarDiagnosticos: true,
    mostrarMedicaciones: true,
    mostrarNotasClinicas: true,
    mostrarDatosFinancieros: false,
    mostrarContactosEmergencia: true,
    usarIdentificadorAnonimo: false
  },
  auxiliary: {
    mostrarNombreCompleto: true,
    mostrarDNI: false,
    mostrarHistorialMedico: false,
    mostrarDiagnosticos: false,
    mostrarMedicaciones: false,
    mostrarNotasClinicas: false,
    mostrarDatosFinancieros: false,
    mostrarContactosEmergencia: true,
    usarIdentificadorAnonimo: false
  },
  cleaning: {
    mostrarNombreCompleto: false,
    mostrarDNI: false,
    mostrarHistorialMedico: false,
    mostrarDiagnosticos: false,
    mostrarMedicaciones: false,
    mostrarNotasClinicas: false,
    mostrarDatosFinancieros: false,
    mostrarContactosEmergencia: false,
    usarIdentificadorAnonimo: true
  },
  radiology: {
    mostrarNombreCompleto: true,
    mostrarDNI: false,
    mostrarHistorialMedico: true,
    mostrarDiagnosticos: true,
    mostrarMedicaciones: false,
    mostrarNotasClinicas: false,
    mostrarDatosFinancieros: false,
    mostrarContactosEmergencia: false,
    usarIdentificadorAnonimo: false
  },
  social_work: {
    mostrarNombreCompleto: true,
    mostrarDNI: true,
    mostrarHistorialMedico: false,
    mostrarDiagnosticos: false,
    mostrarMedicaciones: false,
    mostrarNotasClinicas: false,
    mostrarDatosFinancieros: false,
    mostrarContactosEmergencia: true,
    usarIdentificadorAnonimo: false
  },
  admission: {
    mostrarNombreCompleto: true,
    mostrarDNI: true,
    mostrarHistorialMedico: false, // NO puede ver historial médico
    mostrarDiagnosticos: false,    // NO puede ver diagnósticos
    mostrarMedicaciones: false,    // NO puede ver medicaciones
    mostrarNotasClinicas: false,   // NO puede ver notas clínicas
    mostrarDatosFinancieros: true, // SÍ puede ver datos financieros
    mostrarContactosEmergencia: true,
    usarIdentificadorAnonimo: false
  },
  patient: {
    mostrarNombreCompleto: true,
    mostrarDNI: true,
    mostrarHistorialMedico: true,
    mostrarDiagnosticos: true,
    mostrarMedicaciones: true,
    mostrarNotasClinicas: false,
    mostrarDatosFinancieros: true,
    mostrarContactosEmergencia: true,
    usarIdentificadorAnonimo: false
  },
  family: {
    mostrarNombreCompleto: true,
    mostrarDNI: false,
    mostrarHistorialMedico: false,
    mostrarDiagnosticos: false,
    mostrarMedicaciones: false,
    mostrarNotasClinicas: false,
    mostrarDatosFinancieros: false,
    mostrarContactosEmergencia: false,
    usarIdentificadorAnonimo: false
  }
};

export interface QualityMetric {
  id: string;
  metricType: 'Patient Satisfaction' | 'Readmission Rate' | 'Length of Stay' | 'Infection Rate' | 'Medication Errors';
  value: number;
  targetValue: number;
  unit: string;
  period: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
  date: Date;
  department?: string;
  trend: 'Improving' | 'Stable' | 'Declining';
  notes?: string;
}

// Definición de permisos por rol
export const rolePermissions: Record<UserRole, string[]> = {
  admin: [
    'manage_users', 'manage_system', 'view_all_patients', 'manage_rooms', 
    'view_analytics', 'manage_appointments', 'manage_admissions', 'manage_discharge',
    'view_audit_logs', 'manage_staff', 'view_communication', 'manage_medical_orders',
    'view_nursing_notes', 'manage_bed_assignments', 'view_hospital_floors', 'manage_hospital_units',
    'manage_privacy_settings', 'view_full_patient_data', 'access_ai_assistant',
    'view_financial_info', 'generate_discharge_pdfs', 'manage_future_appointments',
    'view_anonymous_ids', 'manage_professional_ids', 'unlock_user_accounts'
  ],
  doctor: [
    'view_patients', 'manage_medical_records', 'create_medical_orders', 'view_lab_results',
    'manage_appointments', 'create_prescriptions', 'view_imaging', 'manage_discharge',
    'view_nursing_notes', 'create_evolution_notes', 'view_rounds', 'view_communication',
    'view_hospital_floors', 'access_ai_assistant', 'view_clinical_data', 
    'create_future_appointments', 'view_bed_overview', 'generate_medical_pdfs'
  ],
  nurse: [
    'view_patients', 'manage_nursing_notes', 'record_vital_signs', 'administer_medication',
    'view_medical_orders', 'manage_patient_care', 'view_communication', 'update_bed_status',
    'record_fluid_balance', 'assess_wounds', 'use_clinical_scales', 'view_hospital_floors',
    'reserve_beds', 'access_ai_assistant_limited', 'view_clinical_data'
  ],
  auxiliary: [
    'view_patients', 'record_vital_signs', 'basic_patient_care', 'view_communication',
    'update_bed_status', 'transport_patients', 'view_basic_patient_info'
  ],
  cleaning: [
    'view_room_status', 'update_cleaning_status', 'view_bed_assignments', 
    'manage_cleaning_tasks', 'view_communication', 'view_basic_patient_info',
    'view_hospital_floors_limited', 'mark_beds_cleaning_required'
  ],
  radiology: [
    'view_imaging_orders', 'manage_imaging_results', 'view_patients', 'view_communication',
    'schedule_imaging', 'upload_images'
  ],
  social_work: [
    'view_patients', 'manage_discharge_planning', 'coordinate_home_care', 
    'view_communication', 'assess_social_needs'
  ],
  admission: [
    'view_patients',           // Ver información básica de pacientes
    'register_patients',       // Registrar nuevos pacientes
    'manage_appointments',     // Programar y confirmar citas
    'view_financial_info',     // Ver información financiera
    'manage_admissions',       // Gestionar admisiones
    'view_bed_overview',       // Ver estado de camas (para asignar)
    'view_communication',      // Comunicación básica
    'view_basic_patient_info'  // Info básica del paciente
  ],
  patient: [
    'view_own_records', 'view_appointments', 'view_test_results', 'communicate_with_staff',
    'view_discharge_instructions', 'view_own_schedule', 'request_appointments'
  ],
  family: [
    'view_patient_status', 'receive_updates', 'limited_communication', 'view_visiting_hours',
    'view_basic_patient_info', 'view_general_condition', 'view_room_location'
  ]
};

// Definición de elementos de menú por rol
export const roleMenuItems: Record<UserRole, string[]> = {
  admin: [
    'dashboard', 'hospital-floors', 'patients', 'staff', 'user-management', 'rooms', 'bed-management', 
    'appointments', 'admissions', 'medical-orders', 'rounds', 'discharge', 'nursing',
    'analytics', 'communication', 'audit', 'access-logs', 'privacy-settings', 'ai-assistant'
  ],
  doctor: [
    'dashboard', 'patients', 'appointments', 'medical-orders', 'rounds', 
    'discharge', 'communication', 'analytics', 'ai-assistant'
  ],
  nurse: [
    'dashboard', 'patients', 'nursing', 'hospital-floors', 'bed-management', 'medical-orders', 
    'communication', 'rounds', 'ai-assistant'
  ],
  auxiliary: [
    'dashboard', 'patients', 'nursing', 'bed-management', 'communication'
  ],
  cleaning: [
    'dashboard', 'cleaning', 'hospital-floors', 'communication'
  ],
  radiology: [
    'dashboard', 'patients', 'medical-orders', 'communication'
  ],
  social_work: [
    'dashboard', 'patients', 'discharge', 'communication'
  ],
  admission: [
    'dashboard', 'patients', 'appointments', 'admissions', 'bed-management', 'communication'
  ],
  patient: [
    'dashboard', 'appointments', 'satisfaction-survey'
  ],
  family: [
    'patient-status', 'visiting-hours'
  ]
};
