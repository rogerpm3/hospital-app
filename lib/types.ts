// Tipos base del sistema hospitalario

export type UserRole = 
  | 'admin' 
  | 'doctor' 
  | 'nurse' 
  | 'auxiliary' 
  | 'cleaning' 
  | 'pharmacy' 
  | 'radiology' 
  | 'admission' 
  | 'social_work' 
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
  channelId?: string;
  message: string;
  timestamp: Date;
  type: 'direct' | 'channel' | 'broadcast' | 'emergency';
  isRead: boolean;
  attachments?: string[];
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
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
}

export interface AIAssistance {
  id: string;
  patientId: string;
  requesterId: string;
  requestType: 'Diagnosis' | 'Treatment' | 'Drug Interaction' | 'Clinical Decision' | 'Risk Assessment';
  query: string;
  aiResponse: string;
  confidence: number;
  timestamp: Date;
  feedback?: 'Helpful' | 'Not Helpful' | 'Partially Helpful';
  humanOverride?: boolean;
  implementedSuggestions?: string[];
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
    'view_nursing_notes', 'manage_bed_assignments'
  ],
  doctor: [
    'view_patients', 'manage_medical_records', 'create_medical_orders', 'view_lab_results',
    'manage_appointments', 'create_prescriptions', 'view_imaging', 'manage_discharge',
    'view_nursing_notes', 'create_evolution_notes', 'view_rounds', 'view_communication'
  ],
  nurse: [
    'view_patients', 'manage_nursing_notes', 'record_vital_signs', 'administer_medication',
    'view_medical_orders', 'manage_patient_care', 'view_communication', 'update_bed_status',
    'record_fluid_balance', 'assess_wounds', 'use_clinical_scales'
  ],
  auxiliary: [
    'view_patients', 'record_vital_signs', 'basic_patient_care', 'view_communication',
    'update_bed_status', 'transport_patients'
  ],
  cleaning: [
    'view_room_status', 'update_cleaning_status', 'view_bed_assignments', 
    'manage_cleaning_tasks', 'view_communication'
  ],
  pharmacy: [
    'view_prescriptions', 'manage_medication_inventory', 'check_drug_interactions',
    'view_patients', 'view_communication', 'dispense_medications'
  ],
  radiology: [
    'view_imaging_orders', 'manage_imaging_results', 'view_patients', 'view_communication',
    'schedule_imaging', 'upload_images'
  ],
  admission: [
    'manage_admissions', 'manage_appointments', 'view_patients', 'manage_bed_assignments',
    'view_room_availability', 'view_communication', 'patient_registration'
  ],
  social_work: [
    'view_patients', 'manage_discharge_planning', 'coordinate_home_care', 
    'view_communication', 'assess_social_needs'
  ],
  patient: [
    'view_own_records', 'view_appointments', 'view_test_results', 'communicate_with_staff',
    'view_discharge_instructions'
  ],
  family: [
    'view_patient_status', 'receive_updates', 'limited_communication', 'view_visiting_hours'
  ]
};

// Definición de elementos de menú por rol
export const roleMenuItems: Record<UserRole, string[]> = {
  admin: [
    'dashboard', 'patients', 'staff', 'rooms', 'bed-management', 'appointments', 
    'admissions', 'medical-orders', 'rounds', 'discharge', 'analytics', 
    'communication', 'audit', 'settings'
  ],
  doctor: [
    'dashboard', 'patients', 'appointments', 'medical-orders', 'rounds', 
    'discharge', 'communication', 'analytics'
  ],
  nurse: [
    'dashboard', 'patients', 'nursing', 'bed-management', 'medical-orders', 
    'communication', 'rounds'
  ],
  auxiliary: [
    'dashboard', 'patients', 'nursing', 'bed-management', 'communication'
  ],
  cleaning: [
    'dashboard', 'cleaning', 'communication'
  ],
  pharmacy: [
    'dashboard', 'patients', 'medical-orders', 'communication'
  ],
  radiology: [
    'dashboard', 'patients', 'medical-orders', 'communication'
  ],
  admission: [
    'dashboard', 'patients', 'admissions', 'appointments', 'bed-management', 
    'rooms', 'communication'
  ],
  social_work: [
    'dashboard', 'patients', 'discharge', 'communication'
  ],
  patient: [
    'dashboard', 'appointments', 'records', 'communication'
  ],
  family: [
    'dashboard', 'patient-status', 'communication'
  ]
};
