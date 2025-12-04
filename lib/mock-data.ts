import { 
  User, Patient, Room, Bed, Admission, MedicalRecord, VitalSigns, 
  Medication, Service, Appointment, AuditLog, ChatMessage, MedicalOrder,
  NursingNote, ClinicalScale, FluidBalance, WoundAssessment, MedicalEvolution,
  DischargeChecklist, SystemNotification, HospitalFloor, HospitalUnit,
  AIAssistant, FutureAppointment, FollowUpAlert, PrivacySettings,
  AppointmentSummary
} from './types';

// Usuarios mock
export const mockUsers: User[] = [
  {
    id: '1',
    dni: '12345678A',
    firstName: 'Carlos',
    lastName: 'Administrador',
    email: 'admin@hospital.com',
    phone: '+34 600 000 001',
    role: 'admin',
    department: 'Administración',
    professionalId: 'ADM001',
    isActive: true,
    lastLogin: new Date('2024-01-15T08:30:00Z'),
    profilePicture: '/placeholder-user.jpg',
    preferences: {
      theme: 'light',
      language: 'es',
      notifications: true
    },
    twoFactorEnabled: true,
    anonymousId: 'ADMIN-001',
    failedLoginAttempts: 0,
    isLocked: false
  },
  {
    id: '2',
    dni: '23456789B',
    firstName: 'Ana',
    lastName: 'García',
    email: 'ana.garcia@hospital.com',
    phone: '+34 600 000 002',
    role: 'doctor',
    department: 'Cardiología',
    specialization: 'Cardiología Intervencionista',
    licenseNumber: 'COL12345',
    professionalId: 'MED001',
    isActive: true,
    lastLogin: new Date('2024-01-15T09:15:00Z'),
    anonymousId: 'DOC-001',
    failedLoginAttempts: 0,
    isLocked: false,
    emergencyContact: {
      name: 'Pedro García',
      phone: '+34 600 100 001',
      relationship: 'Esposo'
    }
  },
  {
    id: '3',
    dni: '34567890C',
    firstName: 'María',
    lastName: 'Rodríguez',
    email: 'maria.rodriguez@hospital.com',
    phone: '+34 600 000 003',
    role: 'doctor',
    department: 'Medicina Interna',
    specialization: 'Medicina Interna General',
    licenseNumber: 'COL23456',
    isActive: true
  },
  {
    id: '4',
    dni: '45678901D',
    firstName: 'Luis',
    lastName: 'Martínez',
    email: 'luis.martinez@hospital.com',
    phone: '+34 600 000 004',
    role: 'nurse',
    department: 'UCI',
    isActive: true,
    lastLogin: new Date('2024-01-15T07:00:00Z')
  },
  {
    id: '5',
    dni: '56789012E',
    firstName: 'Carmen',
    lastName: 'López',
    email: 'carmen.lopez@hospital.com',
    phone: '+34 600 000 005',
    role: 'cleaning',
    department: 'Limpieza',
    isActive: true
  },
  {
    id: '6',
    dni: '67890123F',
    firstName: 'Javier',
    lastName: 'Sánchez',
    email: 'javier.sanchez@hospital.com',
    phone: '+34 600 000 006',
    role: 'nurse',
    department: 'Cardiología',
    isActive: true
  },
  {
    id: '7',
    dni: '78901234G',
    firstName: 'Elena',
    lastName: 'Fernández',
    email: 'elena.fernandez@hospital.com',
    phone: '+34 600 000 007',
    role: 'pharmacy',
    department: 'Farmacia',
    isActive: true
  },
  {
    id: '8',
    dni: '89012345H',
    firstName: 'Roberto',
    lastName: 'Díaz',
    email: 'roberto.diaz@hospital.com',
    phone: '+34 600 000 008',
    role: 'radiology',
    department: 'Radiología',
    isActive: true
  },
  {
    id: '9',
    dni: '90123456I',
    firstName: 'Isabel',
    lastName: 'Moreno',
    email: 'isabel.moreno@hospital.com',
    phone: '+34 600 000 009',
    role: 'admission',
    department: 'Admisiones',
    isActive: true
  },
  {
    id: '10',
    dni: '01234567J',
    firstName: 'Francisco',
    lastName: 'Ruiz',
    email: 'francisco.ruiz@hospital.com',
    phone: '+34 600 000 010',
    role: 'social_work',
    department: 'Trabajo Social',
    isActive: true
  }
];

// Camas mock
export const mockBeds: Bed[] = [
  {
    id: 'bed-101-1',
    number: '1',
    roomId: 'room-101',
    isOccupied: true,
    patientId: 'patient-1',
    status: 'Occupied',
    cleaningStatus: 'Clean',
    lastCleaned: new Date('2024-01-15T06:00:00Z'),
    cleanedBy: 'Carmen López',
    equipment: ['Monitor cardíaco', 'Oxígeno'],
    hasBedrails: true,
    isElectric: true
  },
  {
    id: 'bed-101-2',
    number: '2',
    roomId: 'room-101',
    isOccupied: false,
    status: 'Available',
    cleaningStatus: 'Clean',
    lastCleaned: new Date('2024-01-15T05:30:00Z'),
    cleanedBy: 'Carmen López',
    hasBedrails: true,
    isElectric: false
  },
  {
    id: 'bed-102-1',
    number: '1',
    roomId: 'room-102',
    isOccupied: true,
    patientId: 'patient-2',
    status: 'Occupied',
    cleaningStatus: 'Clean',
    lastCleaned: new Date('2024-01-14T22:00:00Z'),
    equipment: ['Ventilador', 'Monitor'],
    hasBedrails: true,
    isElectric: true
  },
  {
    id: 'bed-103-1',
    number: '1',
    roomId: 'room-103',
    isOccupied: false,
    status: 'Cleaning Required',
    cleaningStatus: 'Dirty',
    equipment: ['Oxígeno'],
    hasBedrails: true,
    isElectric: true
  }
];

// Habitaciones mock
export const mockRooms: Room[] = [
  {
    id: 'room-101',
    number: '101',
    floor: 1,
    department: 'Cardiología',
    type: 'Double',
    beds: mockBeds.filter(bed => bed.roomId === 'room-101'),
    amenities: ['TV', 'Baño privado', 'Aire acondicionado'],
    dailyRate: 150.00,
    isOccupied: true,
    lastCleaned: new Date('2024-01-15T06:00:00Z'),
    maintenanceStatus: 'Good',
    hasOxygen: true,
    hasMonitor: true,
    hasPrivateBathroom: true
  },
  {
    id: 'room-102',
    number: '102',
    floor: 1,
    department: 'UCI',
    type: 'ICU',
    beds: mockBeds.filter(bed => bed.roomId === 'room-102'),
    amenities: ['Monitor continuo', 'Ventilador', 'Desfibrilador'],
    dailyRate: 300.00,
    isOccupied: true,
    lastCleaned: new Date('2024-01-14T22:00:00Z'),
    maintenanceStatus: 'Good',
    hasOxygen: true,
    hasMonitor: true,
    hasPrivateBathroom: false,
    notes: 'Paciente crítico - Acceso restringido'
  },
  {
    id: 'room-103',
    number: '103',
    floor: 1,
    department: 'Medicina Interna',
    type: 'Single',
    beds: mockBeds.filter(bed => bed.roomId === 'room-103'),
    amenities: ['TV', 'Baño privado'],
    dailyRate: 120.00,
    isOccupied: false,
    maintenanceStatus: 'Good',
    hasOxygen: false,
    hasMonitor: false,
    hasPrivateBathroom: true
  },
  {
    id: 'room-201',
    number: '201',
    floor: 2,
    department: 'Cirugía',
    type: 'Single',
    beds: [],
    amenities: ['TV', 'Baño privado', 'Aire acondicionado'],
    dailyRate: 180.00,
    isOccupied: false,
    maintenanceStatus: 'Good',
    hasOxygen: true,
    hasMonitor: false,
    hasPrivateBathroom: true
  }
];

// Pacientes mock
export const mockPatients: Patient[] = [
  {
    id: 'patient-1',
    dni: '11111111A',
    socialSecurityNumber: 'SS123456789',
    firstName: 'Juan',
    lastName: 'Pérez González',
    dateOfBirth: new Date('1965-03-15'),
    gender: 'M',
    bloodType: 'O+',
    phone: '+34 600 111 001',
    email: 'juan.perez@email.com',
    address: {
      street: 'Calle Mayor 123',
      city: 'Madrid',
      postalCode: '28001',
      country: 'España'
    },
    emergencyContact: {
      name: 'María Pérez',
      relationship: 'Esposa',
      phone: '+34 600 111 002'
    },
    allergies: ['Penicilina', 'Mariscos'],
    medicalHistory: ['Hipertensión', 'Diabetes tipo 2'],
    currentMedications: ['Metformina 500mg', 'Enalapril 10mg'],
    insuranceInfo: {
      provider: 'Seguridad Social',
      policyNumber: 'SS123456789',
      expirationDate: new Date('2024-12-31')
    },
    admissionDate: new Date('2024-01-14T10:30:00Z'),
    roomId: 'room-101',
    bedNumber: '1',
    attendingPhysician: 'Dr. Ana García',
    admissionReason: 'Dolor torácico agudo',
    currentCondition: 'Stable',
    riskLevel: 'Medium',
    isolationRequired: false,
    codeStatus: 'Full Code',
    // Nuevos campos
    assignedUnit: 'unit-emergency-obs',
    assignedFloor: 1,
    assignedWard: 'Observación de Urgencias',
    anonymousId: 'PAT-001'
  },
  {
    id: 'patient-2',
    dni: '22222222B',
    socialSecurityNumber: 'SS987654321',
    firstName: 'Elena',
    lastName: 'Martín Ruiz',
    dateOfBirth: new Date('1978-07-22'),
    gender: 'F',
    bloodType: 'A-',
    phone: '+34 600 222 001',
    address: {
      street: 'Avenida Constitución 45',
      city: 'Barcelona',
      postalCode: '08001',
      country: 'España'
    },
    emergencyContact: {
      name: 'Carlos Martín',
      relationship: 'Hermano',
      phone: '+34 600 222 002'
    },
    allergies: ['Ibuprofeno'],
    medicalHistory: ['Asma bronquial'],
    currentMedications: ['Salbutamol inhalador'],
    admissionDate: new Date('2024-01-13T15:45:00Z'),
    roomId: 'room-102',
    bedNumber: '1',
    attendingPhysician: 'Dr. María Rodríguez',
    admissionReason: 'Crisis asmática severa',
    currentCondition: 'Critical',
    riskLevel: 'High',
    isolationRequired: false,
    codeStatus: 'Full Code'
  },
  {
    id: 'patient-3',
    dni: '33333333C',
    firstName: 'Roberto',
    lastName: 'Silva Fernández',
    dateOfBirth: new Date('1985-11-08'),
    gender: 'M',
    bloodType: 'B+',
    phone: '+34 600 333 001',
    address: {
      street: 'Plaza España 12',
      city: 'Valencia',
      postalCode: '46001',
      country: 'España'
    },
    emergencyContact: {
      name: 'Ana Silva',
      relationship: 'Madre',
      phone: '+34 600 333 002'
    },
    allergies: [],
    medicalHistory: ['Fractura de tibia (2020)'],
    currentMedications: [],
    currentCondition: 'Good',
    riskLevel: 'Low'
  },
  {
    id: 'patient-4',
    dni: '44444444D',
    firstName: 'Carmen',
    lastName: 'Jiménez López',
    dateOfBirth: new Date('1992-02-14'),
    gender: 'F',
    bloodType: 'AB+',
    phone: '+34 600 444 001',
    address: {
      street: 'Calle Velázquez 89',
      city: 'Sevilla',
      postalCode: '41001',
      country: 'España'
    },
    emergencyContact: {
      name: 'Luis Jiménez',
      relationship: 'Padre',
      phone: '+34 600 444 002'
    },
    allergies: ['Polen'],
    medicalHistory: ['Rinitis alérgica'],
    currentMedications: ['Antihistamínicos'],
    currentCondition: 'Good',
    riskLevel: 'Low'
  }
];

// Servicios mock
export const mockServices: Service[] = [
  {
    id: 'service-1',
    name: 'Consulta Cardiología',
    description: 'Consulta especializada en cardiología',
    department: 'Cardiología',
    duration: 30,
    cost: 80.00,
    requiresPreauth: false,
    isActive: true
  },
  {
    id: 'service-2',
    name: 'Ecocardiograma',
    description: 'Estudio ecocardiográfico completo',
    department: 'Cardiología',
    duration: 45,
    cost: 120.00,
    requiresPreauth: true,
    isActive: true
  },
  {
    id: 'service-3',
    name: 'Consulta Medicina Interna',
    description: 'Consulta de medicina interna general',
    department: 'Medicina Interna',
    duration: 30,
    cost: 70.00,
    requiresPreauth: false,
    isActive: true
  },
  {
    id: 'service-4',
    name: 'Radiografía Tórax',
    description: 'Radiografía de tórax AP y lateral',
    department: 'Radiología',
    duration: 15,
    cost: 45.00,
    requiresPreauth: false,
    isActive: true
  }
];

// Citas mock
export const mockAppointments: Appointment[] = [
  {
    id: 'apt-1',
    patientId: 'patient-1',
    patientName: 'Juan Pérez González',
    physicianId: '2',
    physicianName: 'Dr. Ana García',
    serviceId: 'service-1',
    serviceName: 'Consulta Cardiología',
    date: new Date('2024-01-16'),
    startTime: '09:00',
    endTime: '09:30',
    duration: 30,
    status: 'Scheduled',
    type: 'Follow-up',
    location: 'Consulta 1 - Cardiología',
    notes: 'Control post-infarto',
    createdBy: '9',
    createdAt: new Date('2024-01-10T10:00:00Z'),
    priority: 'High',
    estimatedCost: 80.00
  },
  {
    id: 'apt-2',
    patientId: 'patient-3',
    patientName: 'Roberto Silva Fernández',
    physicianId: '3',
    physicianName: 'Dr. María Rodríguez',
    serviceId: 'service-3',
    serviceName: 'Consulta Medicina Interna',
    date: new Date('2024-01-16'),
    startTime: '10:30',
    endTime: '11:00',
    duration: 30,
    status: 'Confirmed',
    type: 'Consultation',
    location: 'Consulta 2 - Medicina Interna',
    createdBy: '9',
    createdAt: new Date('2024-01-12T14:30:00Z'),
    priority: 'Medium',
    estimatedCost: 70.00,
    reminderSent: true
  },
  {
    id: 'apt-3',
    patientId: 'patient-1',
    patientName: 'Juan Pérez González',
    physicianId: '2',
    physicianName: 'Dr. Ana García',
    serviceId: 'service-2',
    serviceName: 'Ecocardiograma',
    date: new Date('2024-01-17'),
    startTime: '14:00',
    endTime: '14:45',
    duration: 45,
    status: 'Scheduled',
    type: 'Procedure',
    location: 'Sala Eco - Cardiología',
    notes: 'Eco de control',
    createdBy: '2',
    createdAt: new Date('2024-01-15T09:15:00Z'),
    priority: 'Medium',
    estimatedCost: 120.00,
    requiresPrep: true,
    prepInstructions: 'Ayuno de 4 horas'
  }
];

// Admisiones mock
export const mockAdmissions: Admission[] = [
  {
    id: 'adm-1',
    patientId: 'patient-1',
    admissionDate: new Date('2024-01-14T10:30:00Z'),
    expectedDischargeDate: new Date('2024-01-18T12:00:00Z'),
    reason: 'Dolor torácico agudo - Sospecha IAM',
    type: 'Emergency',
    status: 'Active',
    admittingPhysician: 'Dr. Ana García',
    roomId: 'room-101',
    bedId: 'bed-101-1',
    diagnosticCodes: ['I21.9', 'Z51.11'],
    priorityLevel: 'High',
    admissionSource: 'Emergency',
    paymentMethod: 'Insurance',
    notes: 'Paciente con dolor torácico de 2 horas de evolución'
  },
  {
    id: 'adm-2',
    patientId: 'patient-2',
    admissionDate: new Date('2024-01-13T15:45:00Z'),
    expectedDischargeDate: new Date('2024-01-17T10:00:00Z'),
    reason: 'Crisis asmática severa',
    type: 'Emergency',
    status: 'Active',
    admittingPhysician: 'Dr. María Rodríguez',
    roomId: 'room-102',
    bedId: 'bed-102-1',
    diagnosticCodes: ['J45.9'],
    priorityLevel: 'Critical',
    admissionSource: 'Emergency',
    paymentMethod: 'Insurance'
  }
];

// Registros médicos mock
export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: 'mr-1',
    patientId: 'patient-1',
    date: new Date('2024-01-14T11:00:00Z'),
    type: 'Diagnosis',
    description: 'Infarto agudo de miocardio confirmado por ECG y troponinas',
    physician: 'Dr. Ana García',
    isCritical: true,
    followUpRequired: true,
    followUpDate: new Date('2024-01-16T09:00:00Z'),
    tags: ['Cardiología', 'IAM', 'Urgente']
  },
  {
    id: 'mr-2',
    patientId: 'patient-2',
    date: new Date('2024-01-13T16:30:00Z'),
    type: 'Treatment Plan',
    description: 'Iniciado tratamiento con broncodilatadores y corticoides sistémicos',
    physician: 'Dr. María Rodríguez',
    isCritical: false,
    followUpRequired: true,
    tags: ['Neumología', 'Asma']
  }
];

// Signos vitales mock
export const mockVitalSigns: VitalSigns[] = [
  {
    id: 'vs-1',
    patientId: 'patient-1',
    timestamp: new Date('2024-01-15T08:00:00Z'),
    recordedBy: 'Luis Martínez',
    bloodPressure: { systolic: 140, diastolic: 90 },
    heartRate: 78,
    temperature: 36.5,
    respiratoryRate: 16,
    oxygenSaturation: 98,
    painLevel: 2,
    glucoseLevel: 110,
    weight: 75.5,
    notes: 'Paciente estable, dolor controlado',
    alerts: []
  },
  {
    id: 'vs-2',
    patientId: 'patient-2',
    timestamp: new Date('2024-01-15T08:15:00Z'),
    recordedBy: 'Javier Sánchez',
    bloodPressure: { systolic: 120, diastolic: 80 },
    heartRate: 95,
    temperature: 36.8,
    respiratoryRate: 22,
    oxygenSaturation: 94,
    painLevel: 0,
    notes: 'Mejoría respiratoria gradual',
    alerts: ['Saturación O2 límite']
  }
];

// Medicamentos mock
export const mockMedications: Medication[] = [
  {
    id: 'med-1',
    name: 'Aspirina',
    genericName: 'Ácido acetilsalicílico',
    dosage: '100mg',
    frequency: 'Una vez al día',
    route: 'Oral',
    startDate: new Date('2024-01-14'),
    prescribedBy: 'Dr. Ana García',
    patientId: 'patient-1',
    instructions: 'Tomar después de las comidas',
    sideEffects: ['Malestar gástrico', 'Sangrado'],
    cost: 5.50,
    status: 'Active'
  },
  {
    id: 'med-2',
    name: 'Clopidogrel',
    dosage: '75mg',
    frequency: 'Una vez al día',
    route: 'Oral',
    startDate: new Date('2024-01-14'),
    endDate: new Date('2024-04-14'),
    prescribedBy: 'Dr. Ana García',
    patientId: 'patient-1',
    instructions: 'Tomar a la misma hora todos los días',
    status: 'Active'
  }
];

// Órdenes médicas mock
export const mockMedicalOrders: MedicalOrder[] = [
  {
    id: 'order-1',
    patientId: 'patient-1',
    physicianId: '2',
    physicianName: 'Dr. Ana García',
    orderDate: new Date('2024-01-14T11:30:00Z'),
    type: 'Lab',
    category: 'Stat',
    description: 'Troponinas seriadas cada 6 horas x 3',
    instructions: 'Extraer muestra cada 6 horas durante 18 horas',
    status: 'In Progress',
    scheduledDateTime: new Date('2024-01-14T12:00:00Z'),
    cost: 45.00,
    requiresConsent: false
  },
  {
    id: 'order-2',
    patientId: 'patient-1',
    physicianId: '2',
    physicianName: 'Dr. Ana García',
    orderDate: new Date('2024-01-14T11:35:00Z'),
    type: 'Medication',
    category: 'Stat',
    description: 'Aspirina 300mg vía oral STAT, luego 100mg/día',
    instructions: 'Primera dosis inmediata, continuar con 100mg diarios',
    status: 'Completed',
    completedDateTime: new Date('2024-01-14T12:00:00Z'),
    completedBy: 'Luis Martínez'
  }
];

// Notas de enfermería mock
export const mockNursingNotes: NursingNote[] = [
  {
    id: 'nn-1',
    patientId: 'patient-1',
    nurseId: '4',
    nurseName: 'Luis Martínez',
    timestamp: new Date('2024-01-15T08:30:00Z'),
    shift: 'Day',
    category: 'Assessment',
    note: 'Paciente despierto, orientado, cooperador',
    objective: 'Signos vitales estables, dolor controlado nivel 2/10',
    subjective: 'Refiere mejoría del dolor torácico',
    plan: 'Continuar monitorización, administrar medicación pautada',
    followUpRequired: false,
    flaggedForPhysician: false,
    tags: ['Estable', 'Dolor controlado']
  }
];

// Escalas clínicas mock
export const mockClinicalScales: ClinicalScale[] = [
  {
    id: 'cs-1',
    patientId: 'patient-2',
    assessorId: '6',
    assessorName: 'Javier Sánchez',
    timestamp: new Date('2024-01-15T09:00:00Z'),
    scaleType: 'Glasgow Coma Scale',
    score: 15,
    maxScore: 15,
    interpretation: 'Consciente y orientado',
    riskLevel: 'Low',
    notes: 'Paciente completamente despierto y colaborador'
  }
];

// Balance hídrico mock
export const mockFluidBalance: FluidBalance[] = [
  {
    id: 'fb-1',
    patientId: 'patient-1',
    nurseId: '4',
    date: new Date('2024-01-15'),
    shift: 'Day',
    intake: {
      oral: 800,
      iv: 500,
      tube: 0,
      other: 0,
      total: 1300
    },
    output: {
      urine: 1100,
      stool: 0,
      vomit: 0,
      drainage: 0,
      other: 0,
      total: 1100
    },
    netBalance: 200,
    notes: 'Balance positivo controlado'
  }
];

// Evaluación de heridas mock
export const mockWoundAssessments: WoundAssessment[] = [
  {
    id: 'wa-1',
    patientId: 'patient-3',
    nurseId: '4',
    nurseName: 'Luis Martínez',
    assessmentDate: new Date('2024-01-15T10:00:00Z'),
    woundLocation: 'Pierna izquierda - tercio distal',
    woundType: 'Surgical',
    length: 8,
    width: 2,
    depth: 1,
    drainageAmount: 'Minimal',
    drainageType: 'Serous',
    tissueType: 'Granulation',
    painLevel: 3,
    treatment: 'Limpieza con suero salino',
    dressing: 'Apósito hidrocoloide',
    healingStage: 'Proliferative',
    notes: 'Buena evolución, sin signos de infección'
  }
];

// Evolución médica mock
export const mockMedicalEvolutions: MedicalEvolution[] = [
  {
    id: 'me-1',
    patientId: 'patient-1',
    physicianId: '2',
    physicianName: 'Dr. Ana García',
    date: new Date('2024-01-15T10:00:00Z'),
    subjective: 'Paciente refiere mejoría del dolor torácico',
    objective: 'Signos vitales estables, ECG sin cambios agudos',
    assessment: 'IAM en evolución favorable',
    plan: 'Continuar tratamiento actual, control enzimático',
    activeProblems: ['Infarto agudo de miocardio', 'Hipertensión arterial'],
    newProblems: [],
    resolvedProblems: [],
    followUpRequired: true,
    followUpInstructions: 'Control en 24 horas'
  }
];

// Checklist de alta mock
export const mockDischargeChecklists: DischargeChecklist[] = [
  {
    id: 'dc-1',
    patientId: 'patient-3',
    createdBy: '3',
    createdDate: new Date('2024-01-15T09:00:00Z'),
    expectedDischargeDate: new Date('2024-01-17T10:00:00Z'),
    checklist: {
      medicalClearance: true,
      medicationReconciliation: true,
      dischargeInstructions: false,
      followUpAppointments: false,
      equipmentOrdered: false,
      transportationArranged: false,
      socialWorkConsult: false,
      finalBilling: false,
      roomCleaning: false
    },
    dischargeInstructions: 'Reposo relativo, control en consulta externa',
    medicationList: [],
    followUpAppointments: [],
    status: 'In Progress'
  }
];

// Notificaciones del sistema mock
export const mockSystemNotifications: SystemNotification[] = [
  {
    id: 'notif-1',
    type: 'Warning',
    title: 'Ocupación UCI Alta',
    message: 'La UCI está al 95% de ocupación',
    timestamp: new Date('2024-01-15T10:30:00Z'),
    department: 'UCI',
    isRead: false,
    priority: 'High'
  },
  {
    id: 'notif-2',
    type: 'Info',
    title: 'Mantenimiento Programado',
    message: 'Mantenimiento del sistema el domingo de 2:00 a 4:00',
    timestamp: new Date('2024-01-15T08:00:00Z'),
    isRead: true,
    priority: 'Medium',
    expiresAt: new Date('2024-01-21T04:00:00Z')
  },
  {
    id: 'notif-3',
    type: 'Critical',
    title: 'Código Azul',
    message: 'Activado código azul en habitación 102',
    timestamp: new Date('2024-01-15T11:45:00Z'),
    department: 'UCI',
    isRead: false,
    priority: 'Critical',
    action: {
      label: 'Ver Detalles',
      url: '/patients/patient-2'
    }
  }
];

// Mensajes de chat mock
export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: '2',
    senderName: 'Dr. Ana García',
    senderRole: 'doctor',
    recipientId: '4',
    message: 'Por favor, control de signos vitales cada 2 horas para el paciente en 101',
    timestamp: new Date('2024-01-15T09:30:00Z'),
    type: 'direct',
    isRead: true,
    priority: 'Medium',
    relatedPatientId: 'patient-1'
  },
  {
    id: 'msg-2',
    senderId: '4',
    senderName: 'Luis Martínez',
    senderRole: 'nurse',
    recipientId: '2',
    message: 'Confirmado, signos vitales estables. Última toma: TA 140/90, FC 78',
    timestamp: new Date('2024-01-15T10:00:00Z'),
    type: 'direct',
    isRead: false,
    priority: 'Medium',
    relatedPatientId: 'patient-1'
  },
  {
    id: 'msg-3',
    senderId: '1',
    senderName: 'Carlos Administrador',
    senderRole: 'admin',
    channelId: 'general',
    message: 'Recordatorio: Reunión de equipo mañana a las 08:00',
    timestamp: new Date('2024-01-15T08:00:00Z'),
    type: 'channel',
    isRead: true,
    priority: 'Low'
  }
];

// Plantas y unidades hospitalarias mock
export const mockHospitalFloors: HospitalFloor[] = [
  {
    id: 'floor-1',
    number: 1,
    name: 'Planta 1 — Acceso, Urgencias y Consultas Externas',
    description: 'Servicios de acceso, emergencias y consultas ambulatorias',
    totalCapacity: 30,
    currentOccupancy: 25,
    units: [
      {
        id: 'unit-emergency-obs',
        name: 'Observación de Urgencias',
        floor: 1,
        capacity: 20,
        specialization: 'Emergency',
        description: 'Observación y estabilización de pacientes urgentes',
        isActive: true,
        rooms: ['room-101', 'room-102', 'room-103'], // Habitaciones existentes
        staff: ['2', '4', '6'] // Ana García, Luis Martínez, Javier Sánchez
      },
      {
        id: 'unit-emergency-surgery',
        name: 'Cirugía de Urgencias',
        floor: 1,
        capacity: 10,
        specialization: 'Surgery',
        description: 'Quirófanos para cirugías de emergencia',
        isActive: true,
        rooms: [],
        staff: ['3'] // María Rodríguez
      },
      {
        id: 'unit-outpatient',
        name: 'Consultas Externas',
        floor: 1,
        capacity: 0,
        specialization: 'Outpatient',
        description: 'Consultas ambulatorias especializadas',
        isActive: true,
        rooms: [],
        staff: ['2', '3'] // Doctores
      }
    ]
  },
  {
    id: 'floor-2',
    number: 2,
    name: 'Planta 2 — Cirugía, Recuperación y Traumatología',
    description: 'Servicios quirúrgicos y traumatológicos',
    totalCapacity: 47,
    currentOccupancy: 30,
    units: [
      {
        id: 'unit-pacu',
        name: 'PACU - Recuperación Post-Anestésica',
        floor: 2,
        capacity: 12,
        specialization: 'Recovery',
        description: 'Unidad de cuidados post-anestésicos',
        isActive: true,
        rooms: [],
        staff: ['4', '6'] // Enfermeros
      },
      {
        id: 'unit-surgical',
        name: 'Hospitalización Quirúrgica',
        floor: 2,
        capacity: 20,
        specialization: 'Surgery',
        description: 'Hospitalización para pacientes quirúrgicos',
        isActive: true,
        rooms: ['room-201'],
        staff: ['2', '4']
      },
      {
        id: 'unit-trauma',
        name: 'Traumatología',
        floor: 2,
        capacity: 15,
        specialization: 'Trauma',
        description: 'Atención especializada en traumatología',
        isActive: true,
        rooms: [],
        staff: ['3', '6']
      }
    ]
  },
  {
    id: 'floor-3',
    number: 3,
    name: 'Planta 3 — Obstetricia, Materno-Infantil, Atención Domiciliaria',
    description: 'Servicios especializados en obstetricia y pediatría',
    totalCapacity: 50,
    currentOccupancy: 40,
    units: [
      {
        id: 'unit-obstetrics',
        name: 'Hospitalización Obstétrica',
        floor: 3,
        capacity: 30,
        specialization: 'Obstetrics',
        description: 'Atención integral a pacientes obstétricas',
        isActive: true,
        rooms: [],
        staff: ['2', '4']
      },
      {
        id: 'unit-maternal',
        name: 'Hospitalización Materno-Infantil',
        floor: 3,
        capacity: 20,
        specialization: 'Maternity',
        description: 'Cuidados madre-hijo',
        isActive: true,
        rooms: [],
        staff: ['6']
      }
    ]
  },
  {
    id: 'floor-4',
    number: 4,
    name: 'Planta 4 — Hospitalización General y Medicina Interna',
    description: 'Servicios de hospitalización general',
    totalCapacity: 50,
    currentOccupancy: 42,
    units: [
      {
        id: 'unit-general',
        name: 'Hospitalización General',
        floor: 4,
        capacity: 30,
        specialization: 'General',
        description: 'Hospitalización médica general',
        isActive: true,
        rooms: [],
        staff: ['3', '4']
      },
      {
        id: 'unit-internal',
        name: 'Medicina Interna',
        floor: 4,
        capacity: 20,
        specialization: 'Internal Medicine',
        description: 'Especialidades médicas internas',
        isActive: true,
        rooms: [],
        staff: ['3']
      }
    ]
  },
  {
    id: 'floor-5',
    number: 5,
    name: 'Planta 5 — UCI y Cuidados Intermedios',
    description: 'Cuidados intensivos y semi-intensivos',
    totalCapacity: 28,
    currentOccupancy: 25,
    isRestricted: true,
    units: [
      {
        id: 'unit-icu',
        name: 'Unidad de Cuidados Intensivos (UCI)',
        floor: 5,
        capacity: 20,
        specialization: 'ICU',
        description: 'Cuidados intensivos para pacientes críticos',
        isActive: true,
        rooms: [],
        staff: ['4', '6'] // Personal especializado UCI
      },
      {
        id: 'unit-stepdown',
        name: 'Unidad de Cuidados Intermedios',
        floor: 5,
        capacity: 8,
        specialization: 'Intermediate Care',
        description: 'Cuidados semi-intensivos',
        isActive: true,
        rooms: [],
        staff: ['4']
      }
    ]
  }
];

// Asistente IA mock
export const mockAIAssistant: AIAssistant[] = [
  {
    id: 'ai-assistant-1',
    name: 'MediBot',
    avatar: '/robot-icon.png',
    status: 'online',
    capabilities: [
      'Consultas médicas',
      'Búsqueda de pacientes',
      'Estadísticas hospitalarias',
      'Acciones rápidas',
      'Gestión administrativa',
      'Interacciones medicamentosas'
    ]
  }
];

// Citas futuras mock (para altas)
export const mockFutureAppointments: FutureAppointment[] = [
  {
    id: 'future-apt-1',
    patientId: 'patient-1',
    type: 'Lab Test',
    description: 'Análisis de sangre de control',
    scheduledDate: new Date('2024-02-15T09:00:00Z'),
    provider: 'Dr. Ana García',
    location: 'Laboratorio - Planta 1',
    instructions: 'Ayuno de 12 horas',
    reminderDays: [7, 3, 1]
  },
  {
    id: 'future-apt-2',
    patientId: 'patient-1',
    type: 'Follow-up Consultation',
    description: 'Control cardiológico post-alta',
    scheduledDate: new Date('2024-03-01T10:30:00Z'),
    provider: 'Dr. Ana García',
    location: 'Consulta Cardiología',
    reminderDays: [14, 7, 1]
  }
];

// Alertas de seguimiento mock
export const mockFollowUpAlerts: FollowUpAlert[] = [
  {
    id: 'alert-1',
    patientId: 'patient-1',
    alertType: 'appointment',
    title: 'Cita de control cardiológico',
    description: 'Recordatorio para cita de seguimiento post-IAM',
    dueDate: new Date('2024-02-15T09:00:00Z'),
    priority: 'High',
    isActive: true
  }
];

// Configuraciones de privacidad mock
export const mockPrivacySettings: PrivacySettings[] = [
  {
    id: 'privacy-cleaning-1',
    userId: '5', // Carmen López (cleaning)
    role: 'cleaning',
    canViewFullName: false,
    canViewMedicalHistory: false,
    canViewVitalSigns: false,
    canViewClinicalNotes: false,
    canViewDiagnosis: false,
    canViewMedications: false,
    canViewFinancialInfo: false,
    maxPatientDataAccess: 'basic'
  },
  {
    id: 'privacy-family-1',
    userId: 'family-user-1',
    role: 'family',
    canViewFullName: true,
    canViewMedicalHistory: false,
    canViewVitalSigns: false,
    canViewClinicalNotes: false,
    canViewDiagnosis: false,
    canViewMedications: false,
    canViewFinancialInfo: false,
    maxPatientDataAccess: 'basic',
    allowedPatientIds: ['patient-1']
  }
];

// Resúmenes de citas mock
export const mockAppointmentSummaries: AppointmentSummary[] = [
  {
    date: new Date('2024-01-16'),
    total: 15,
    confirmed: 10,
    pending: 3,
    cancelled: 1,
    completed: 1,
    bySpecialty: {
      'Cardiología': 5,
      'Medicina Interna': 4,
      'Radiología': 3,
      'Urgencias': 3
    },
    byStatus: {
      'Scheduled': 8,
      'Confirmed': 5,
      'Cancelled': 1,
      'Completed': 1
    }
  }
];

// Logs de auditoría mock
export const mockAuditLogs: AuditLog[] = [
  {
    id: 'audit-1',
    userId: '2',
    userRole: 'doctor',
    action: 'CREATE',
    resource: 'medical-order',
    resourceId: 'order-1',
    timestamp: new Date('2024-01-14T11:30:00Z'),
    ipAddress: '192.168.1.100',
    details: {
      patientId: 'patient-1',
      orderType: 'Lab',
      description: 'Troponinas seriadas'
    },
    severity: 'Medium'
  },
  {
    id: 'audit-2',
    userId: '4',
    userRole: 'nurse',
    action: 'UPDATE',
    resource: 'vital-signs',
    resourceId: 'vs-1',
    timestamp: new Date('2024-01-15T08:00:00Z'),
    ipAddress: '192.168.1.101',
    details: {
      patientId: 'patient-1',
      recordedBy: 'Luis Martínez'
    },
    severity: 'Low'
  },
  {
    id: 'audit-3',
    userId: '1',
    userRole: 'admin',
    action: 'LOGIN',
    resource: 'system',
    timestamp: new Date('2024-01-15T08:30:00Z'),
    ipAddress: '192.168.1.50',
    details: {
      loginMethod: 'password',
      successful: true
    },
    severity: 'Low'
  }
];
