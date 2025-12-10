/**
 * Datos SQL Pre-parseados
 * Generado automáticamente desde los archivos SQL
 * Fecha: 2025-12-04T15:22:02.249Z
 * 
 * SISTEMA DE CONTROL DE ACCESO:
 * - Las asignaciones profesional-paciente definen qué médicos pueden ver qué pacientes
 * - Cada profesional solo puede acceder a sus pacientes asignados (excepto admin)
 */

import type { Patient, User, Room, Bed, Medication, Service, Admission, MedicalOrder, AsignacionProfesionalPaciente, PermisoAreaClinica } from './types';

// ============================================
// PACIENTES (7 registros)
// ============================================
export const sqlPatients: Patient[] = [
  {
    id: "IFV_0001",
    dni: "80111345H",
    socialSecurityNumber: "08 1450 78123 07",
    firstName: "Isabel",
    lastName: "Flores Viñales",
    dateOfBirth: new Date("2002-11-10 03:50:00"),
    gender: "F",
    bloodType: undefined,
    phone: "673 245 910",
    email: "isafloresviñales@gmail.com",
    address: {
      street: "Pintor Ribalta 56",
      city: "Barcelona",
      postalCode: "",
      country: "España"
    },
    emergencyContact: {
      name: "Contacto de emergencia",
      relationship: "Familiar",
      phone: "697 869 322"
    },
    allergies: [],
    medicalHistory: [],
    currentMedications: [],
    currentCondition: "Stable",
    riskLevel: "Low",
    isolationRequired: false,
    codeStatus: "Full Code",
    anonymousId: "PAT-001"
  },
  {
    id: "PIF_0010",
    dni: "71403289D",
    socialSecurityNumber: "08 2301 99214 54",
    firstName: "Paula",
    lastName: "Imbernón Flores",
    dateOfBirth: new Date("2014-07-03 08:15:00"),
    gender: "F",
    bloodType: undefined,
    phone: "",
    email: undefined,
    address: {
      street: "Pintor Ribalta 56",
      city: "Barcelona",
      postalCode: "",
      country: "España"
    },
    emergencyContact: {
      name: "Contacto de emergencia",
      relationship: "Familiar",
      phone: "673 245 910"
    },
    allergies: [],
    medicalHistory: [],
    currentMedications: [],
    currentCondition: "Stable",
    riskLevel: "Low",
    isolationRequired: false,
    codeStatus: "Full Code",
    anonymousId: "PAT-002"
  },
  {
    id: "MIF_0011",
    dni: "71403312E",
    socialSecurityNumber: "17 0342 56109 33",
    firstName: "Martín",
    lastName: "Imbernón Flores",
    dateOfBirth: new Date("2014-07-03 08:21:00"),
    gender: "M",
    bloodType: undefined,
    phone: "",
    email: undefined,
    address: {
      street: "Pintor Ribalta 56",
      city: "Barcelona",
      postalCode: "",
      country: "España"
    },
    emergencyContact: {
      name: "Contacto de emergencia",
      relationship: "Familiar",
      phone: "673 245 910"
    },
    allergies: [],
    medicalHistory: [],
    currentMedications: [],
    currentCondition: "Stable",
    riskLevel: "Low",
    isolationRequired: false,
    codeStatus: "Full Code",
    anonymousId: "PAT-003"
  },
  {
    id: "JML_0001",
    dni: "80111345H",
    socialSecurityNumber: "17 0567 90831 02",
    firstName: "Javier",
    lastName: "Martinez Lopez",
    dateOfBirth: new Date("1990-11-13 00:00:00"),
    gender: "M",
    bloodType: undefined,
    phone: "676 904 552",
    email: "javimalo11@gmail.com",
    address: {
      street: "Carrer Sants",
      city: "Barcelona",
      postalCode: "",
      country: "España"
    },
    emergencyContact: {
      name: "Contacto de emergencia",
      relationship: "Familiar",
      phone: "667 392 277"
    },
    allergies: [],
    medicalHistory: [],
    currentMedications: [],
    currentCondition: "Stable",
    riskLevel: "Low",
    isolationRequired: false,
    codeStatus: "Full Code",
    anonymousId: "PAT-004"
  },
  {
    id: "SVP_0001",
    dni: "49806421T",
    socialSecurityNumber: "43 2984 12007 41",
    firstName: "Samuel",
    lastName: "Vallbé Pradera",
    dateOfBirth: new Date("1998-06-04 07:15:00"),
    gender: "M",
    bloodType: undefined,
    phone: "623 190 547",
    email: "samuel.vallbe@gmail.com",
    address: {
      street: "Carrer Aragó",
      city: "Barcelona",
      postalCode: "",
      country: "España"
    },
    emergencyContact: {
      name: "Contacto de emergencia",
      relationship: "Familiar",
      phone: "693 829 204"
    },
    allergies: [],
    medicalHistory: [],
    currentMedications: [],
    currentCondition: "Stable",
    riskLevel: "Low",
    isolationRequired: false,
    codeStatus: "Full Code",
    anonymousId: "PAT-005"
  },
  {
    id: "JAV_0001",
    dni: "42033987Q",
    socialSecurityNumber: "25 1120 44782 66",
    firstName: "Juan",
    lastName: "Agudells Valenciano",
    dateOfBirth: new Date("1942-03-03 08:30:00"),
    gender: "M",
    bloodType: undefined,
    phone: "639 771 284",
    email: "jagudells42@gmail.com",
    address: {
      street: "Carrer Balmes",
      city: "Barcelona",
      postalCode: "",
      country: "España"
    },
    emergencyContact: {
      name: "Contacto de emergencia",
      relationship: "Familiar",
      phone: "648 291 192"
    },
    allergies: [],
    medicalHistory: [],
    currentMedications: [],
    currentCondition: "Stable",
    riskLevel: "Low",
    isolationRequired: false,
    codeStatus: "Full Code",
    anonymousId: "PAT-006"
  },
  {
    id: "MRS_0001",
    dni: "49306228Y",
    socialSecurityNumber: "08 1789 33450 88",
    firstName: "María",
    lastName: "Rodríguez Sánchez",
    dateOfBirth: new Date("1990-01-01"),
    gender: "F",
    bloodType: undefined,
    phone: "694 882 014",
    email: "mariarodiguezsa@gmail.com",
    address: {
      street: "Gran Via 123",
      city: "Barcelona",
      postalCode: "",
      country: "España"
    },
    emergencyContact: {
      name: "Contacto de emergencia",
      relationship: "Familiar",
      phone: "657 372 285"
    },
    allergies: [],
    medicalHistory: [],
    currentMedications: [],
    currentCondition: "Stable",
    riskLevel: "Low",
    isolationRequired: false,
    codeStatus: "Full Code",
    anonymousId: "PAT-007"
  }
];

// ============================================
// PERSONAL SANITARIO (28 registros)
// ============================================
export const sqlStaff: User[] = [
  {
    id: "27512",
    dni: "DNI-27512",
    firstName: "Josep",
    lastName: "Blanch Alsina",
    email: "josep.blanch@hospital.com",
    phone: "+34 600 000 000",
    role: "doctor",
    department: "Ginecología y Obstetricia",
    specialization: "Ginecología y Obstetricia",
    professionalId: "27512",
    isActive: true,
    anonymousId: "STAFF-001",
    failedLoginAttempts: 0,
    isLocked: false
  },
  {
    id: "43234",
    dni: "DNI-43234",
    firstName: "Montserrat",
    lastName: "Valls Sentmenat",
    email: "montserrat.valls@hospital.com",
    phone: "+34 600 000 000",
    role: "nurse",
    department: "Obstetricia",
    specialization: "Obstetricia",
    professionalId: "43234",
    isActive: true,
    anonymousId: "STAFF-002",
    failedLoginAttempts: 0,
    isLocked: false
  },
  {
    id: "19621",
    dni: "DNI-19621",
    firstName: "Eugenio",
    lastName: "Magriñá Soler",
    email: "eugenio.magri@hospital.com",
    phone: "+34 600 000 000",
    role: "doctor",
    department: "Obstetricia",
    specialization: "Obstetricia",
    professionalId: "19621",
    isActive: true,
    anonymousId: "STAFF-003",
    failedLoginAttempts: 0,
    isLocked: false
  },
  {
    id: "12171",
    dni: "DNI-12171",
    firstName: "José",
    lastName: "Frontela Barón",
    email: "jos.frontela@hospital.com",
    phone: "+34 600 000 000",
    role: "doctor",
    department: "Pediatría",
    specialization: "Pediatría",
    professionalId: "12171",
    isActive: true,
    anonymousId: "STAFF-004",
    failedLoginAttempts: 0,
    isLocked: false
  },
  {
    id: "41271",
    dni: "DNI-41271",
    firstName: "Soledad",
    lastName: "Mirimbel Salisachs",
    email: "soledad.mirimbel@hospital.com",
    phone: "+34 600 000 000",
    role: "doctor",
    department: "Pediatría",
    specialization: "Pediatría",
    professionalId: "41271",
    isActive: true,
    anonymousId: "STAFF-005",
    failedLoginAttempts: 0,
    isLocked: false
  },
  {
    id: "12345",
    dni: "DNI-12345",
    firstName: "Laura",
    lastName: "Martinez Lopez",
    email: "laura.martinez@hospital.com",
    phone: "+34 600 000 000",
    role: "doctor",
    department: "Urgencias",
    specialization: "Urgencias",
    professionalId: "12345",
    isActive: true,
    anonymousId: "STAFF-006",
    failedLoginAttempts: 0,
    isLocked: false
  },
  {
    id: "12346",
    dni: "DNI-12346",
    firstName: "Carlos",
    lastName: "Martinez Gomez",
    email: "carlos.martinez@hospital.com",
    phone: "+34 600 000 000",
    role: "doctor",
    department: "Ortopedia",
    specialization: "Ortopedia",
    professionalId: "12346",
    isActive: true,
    anonymousId: "STAFF-007",
    failedLoginAttempts: 0,
    isLocked: false
  },
  {
    id: "58601_ADM",
    dni: "DNI-58601_ADM",
    firstName: "Dolores",
    lastName: "Gutierrez Punset",
    email: "dolores.gutierrez@hospital.com",
    phone: "+34 600 000 000",
    role: "admin",
    department: "Administración",
    specialization: "Administración",
    professionalId: "58601_ADM",
    isActive: true,
    anonymousId: "STAFF-008",
    failedLoginAttempts: 0,
    isLocked: false
  },
  {
    id: "67345",
    dni: "DNI-67345",
    firstName: "Maribel",
    lastName: "Quintanilla Reina",
    email: "maribel.quintanilla@hospital.com",
    phone: "+34 600 000 000",
    role: "nurse",
    department: "Triaje",
    specialization: "Triaje",
    professionalId: "67345",
    isActive: true,
    anonymousId: "STAFF-009",
    failedLoginAttempts: 0,
    isLocked: false
  },
  {
    id: "56345",
    dni: "DNI-56345",
    firstName: "Orestes",
    lastName: "García Villar",
    email: "orestes.garca@hospital.com",
    phone: "+34 600 000 000",
    role: "doctor",
    department: "Cirugía General",
    specialization: "Cirugía General",
    professionalId: "56345",
    isActive: true,
    anonymousId: "STAFF-010",
    failedLoginAttempts: 0,
    isLocked: false
  },
  {
    id: "18376",
    dni: "DNI-18376",
    firstName: "Lucía",
    lastName: "Cabañes Sierra",
    email: "luca.cabaes@hospital.com",
    phone: "+34 600 000 000",
    role: "nurse",
    department: "Urgencias",
    specialization: "Urgencias",
    professionalId: "18376",
    isActive: true,
    anonymousId: "STAFF-011",
    failedLoginAttempts: 0,
    isLocked: false
  },
  {
    id: "33272",
    dni: "DNI-33272",
    firstName: "Clara",
    lastName: "Dolz Salas",
    email: "clara.dolz@hospital.com",
    phone: "+34 600 000 000",
    role: "doctor",
    department: "Anestesiología",
    specialization: "Anestesiología",
    professionalId: "33272",
    isActive: true,
    anonymousId: "STAFF-012",
    failedLoginAttempts: 0,
    isLocked: false
  },
  {
    id: "97563",
    dni: "DNI-97563",
    firstName: "Carlos",
    lastName: "Muro Pérez",
    email: "carlos.muro@hospital.com",
    phone: "+34 600 000 000",
    role: "doctor",
    department: "Cirugía",
    specialization: "Cirugía",
    professionalId: "97563",
    isActive: true,
    anonymousId: "STAFF-013",
    failedLoginAttempts: 0,
    isLocked: false
  },
  {
    id: "44382",
    dni: "DNI-44382",
    firstName: "Claudia",
    lastName: "Malagelada Frías",
    email: "claudia.malagelada@hospital.com",
    phone: "+34 600 000 000",
    role: "nurse",
    department: "Instrumentista",
    specialization: "Instrumentista",
    professionalId: "44382",
    isActive: true,
    anonymousId: "STAFF-014",
    failedLoginAttempts: 0,
    isLocked: false
  },
  {
    id: "25437",
    dni: "DNI-25437",
    firstName: "Juana",
    lastName: "Lavilla Alsina",
    email: "juana.lavilla@hospital.com",
    phone: "+34 600 000 000",
    role: "nurse",
    department: "Hospitalización",
    specialization: "Hospitalización",
    professionalId: "25437",
    isActive: true,
    anonymousId: "STAFF-015",
    failedLoginAttempts: 0,
    isLocked: false
  },
  {
    id: "61765",
    dni: "DNI-61765",
    firstName: "Adela",
    lastName: "Ruíz Llenas",
    email: "adela.ruz@hospital.com",
    phone: "+34 600 000 000",
    role: "nurse",
    department: "Hospitalización",
    specialization: "Hospitalización",
    professionalId: "61765",
    isActive: true,
    anonymousId: "STAFF-016",
    failedLoginAttempts: 0,
    isLocked: false
  },
  {
    id: "43256",
    dni: "DNI-43256",
    firstName: "Antonia",
    lastName: "Ramos Ortega",
    email: "antonia.ramos@hospital.com",
    phone: "+34 600 000 000",
    role: "nurse",
    department: "Hospitalización",
    specialization: "Hospitalización",
    professionalId: "43256",
    isActive: true,
    anonymousId: "STAFF-017",
    failedLoginAttempts: 0,
    isLocked: false
  },
  {
    id: "22567",
    dni: "DNI-22567",
    firstName: "José",
    lastName: "Navarro Puig",
    email: "jos.navarro@hospital.com",
    phone: "+34 600 000 000",
    role: "doctor",
    department: "Medicina General",
    specialization: "Medicina General",
    professionalId: "22567",
    isActive: true,
    anonymousId: "STAFF-018",
    failedLoginAttempts: 0,
    isLocked: false
  },
  {
    id: "18273",
    dni: "DNI-18273",
    firstName: "Justino",
    lastName: "Garcés Pallerols",
    email: "justino.garcs@hospital.com",
    phone: "+34 600 000 000",
    role: "doctor",
    department: "Medicina Interna",
    specialization: "Medicina Interna",
    professionalId: "18273",
    isActive: true,
    anonymousId: "STAFF-019",
    failedLoginAttempts: 0,
    isLocked: false
  },
  {
    id: "6234",
    dni: "DNI-6234",
    firstName: "Nuria",
    lastName: "Bòria Casademont",
    email: "nuria.bria@hospital.com",
    phone: "+34 600 000 000",
    role: "nurse",
    department: "Hospitalización",
    specialization: "Hospitalización",
    professionalId: "6234",
    isActive: true,
    anonymousId: "STAFF-020",
    failedLoginAttempts: 0,
    isLocked: false
  },
  {
    id: "35678",
    dni: "DNI-35678",
    firstName: "Román",
    lastName: "Sampedro Guitart",
    email: "romn.sampedro@hospital.com",
    phone: "+34 600 000 000",
    role: "doctor",
    department: "Medicina Interna",
    specialization: "Medicina Interna",
    professionalId: "35678",
    isActive: true,
    anonymousId: "STAFF-021",
    failedLoginAttempts: 0,
    isLocked: false
  },
  {
    id: "8512",
    dni: "DNI-8512",
    firstName: "Isabel",
    lastName: "Centelles Puig",
    email: "isabel.centelles@hospital.com",
    phone: "+34 600 000 000",
    role: "nurse",
    department: "Hospitalización",
    specialization: "Hospitalización",
    professionalId: "8512",
    isActive: true,
    anonymousId: "STAFF-022",
    failedLoginAttempts: 0,
    isLocked: false
  },
  {
    id: "45621_ADM",
    dni: "DNI-45621_ADM",
    firstName: "Luciana",
    lastName: "Maldonado",
    email: "luciana.maldonado@hospital.com",
    phone: "+34 600 000 000",
    role: "admin",
    department: "Administración",
    specialization: "Administración",
    professionalId: "45621_ADM",
    isActive: true,
    anonymousId: "STAFF-023",
    failedLoginAttempts: 0,
    isLocked: false
  },
  {
    id: "34562",
    dni: "DNI-34562",
    firstName: "Carlos",
    lastName: "Subirana Prats",
    email: "carlos.subirana@hospital.com",
    phone: "+34 600 000 000",
    role: "doctor",
    department: "Radiología",
    specialization: "Radiología",
    professionalId: "34562",
    isActive: true,
    anonymousId: "STAFF-024",
    failedLoginAttempts: 0,
    isLocked: false
  },
  {
    id: "1111_ADM",
    dni: "DNI-1111_ADM",
    firstName: "Soledad",
    lastName: "Silva Pérez",
    email: "soledad.silva@hospital.com",
    phone: "+34 600 000 000",
    role: "admin",
    department: "Administración",
    specialization: "Administración",
    professionalId: "1111_ADM",
    isActive: true,
    anonymousId: "STAFF-025",
    failedLoginAttempts: 0,
    isLocked: false
  },
  {
    id: "30123",
    dni: "DNI-30123",
    firstName: "Miguel",
    lastName: "Serrano Gómez",
    email: "miguel.serrano@hospital.com",
    phone: "+34 600 000 000",
    role: "doctor",
    department: "Medicina Interna",
    specialization: "Medicina Interna",
    professionalId: "30123",
    isActive: true,
    anonymousId: "STAFF-026",
    failedLoginAttempts: 0,
    isLocked: false
  },
  {
    id: "7777",
    dni: "DNI-7777",
    firstName: "Laura",
    lastName: "Mora Martín",
    email: "laura.mora@hospital.com",
    phone: "+34 600 000 000",
    role: "doctor",
    department: "Medicina Interna",
    specialization: "Medicina Interna",
    professionalId: "7777",
    isActive: true,
    anonymousId: "STAFF-027",
    failedLoginAttempts: 0,
    isLocked: false
  },
  {
    id: "40876",
    dni: "DNI-40876",
    firstName: "Alberto",
    lastName: "Pérez Ruiz",
    email: "alberto.prez@hospital.com",
    phone: "+34 600 000 000",
    role: "doctor",
    department: "neumólogo",
    specialization: "neumólogo",
    professionalId: "40876",
    isActive: true,
    anonymousId: "STAFF-028",
    failedLoginAttempts: 0,
    isLocked: false
  }
];

// ============================================
// HABITACIONES (9 registros)
// ============================================
export const sqlRooms: Room[] = [
  {
    id: "P1_HO_101",
    number: "101",
    floor: 1,
    department: "Obstetricia",
    type: "Double",
    beds: [{
      id: "P1_HO_101_1",
      number: "1",
      roomId: "P1_HO_101",
      isOccupied: false,
      status: "Available",
      cleaningStatus: "Clean",
      lastCleaned: new Date(),
      hasBedrails: true,
      isElectric: true
    }],
    amenities: ["TV", "Baño privado"],
    dailyRate: 150.00,
    isOccupied: false,
    lastCleaned: new Date(),
    maintenanceStatus: "Good",
    hasOxygen: true,
    hasMonitor: false,
    hasPrivateBathroom: true
  },
  {
    id: "P5_TRU_501",
    number: "501",
    floor: 5,
    department: "Traumatología",
    type: "Single",
    beds: [{
      id: "P5_TRU_501_1",
      number: "1",
      roomId: "P5_TRU_501",
      isOccupied: false,
      status: "Available",
      cleaningStatus: "Clean",
      lastCleaned: new Date(),
      hasBedrails: true,
      isElectric: true
    }],
    amenities: ["TV", "Baño privado"],
    dailyRate: 150.00,
    isOccupied: false,
    lastCleaned: new Date(),
    maintenanceStatus: "Good",
    hasOxygen: true,
    hasMonitor: false,
    hasPrivateBathroom: true
  },
  {
    id: "P3_UC_301",
    number: "301",
    floor: 3,
    department: "Urgencias Cirugía",
    type: "Single",
    beds: [{
      id: "P3_UC_301_1",
      number: "1",
      roomId: "P3_UC_301",
      isOccupied: false,
      status: "Available",
      cleaningStatus: "Clean",
      lastCleaned: new Date(),
      hasBedrails: true,
      isElectric: true
    }],
    amenities: ["TV", "Baño privado"],
    dailyRate: 150.00,
    isOccupied: false,
    lastCleaned: new Date(),
    maintenanceStatus: "Good",
    hasOxygen: true,
    hasMonitor: false,
    hasPrivateBathroom: true
  },
  {
    id: "P3_SC_302",
    number: "302",
    floor: 3,
    department: "Cirugía",
    type: "Double",
    beds: [{
      id: "P3_SC_302_1",
      number: "1",
      roomId: "P3_SC_302",
      isOccupied: false,
      status: "Available",
      cleaningStatus: "Clean",
      lastCleaned: new Date(),
      hasBedrails: true,
      isElectric: true
    }],
    amenities: ["TV", "Baño privado"],
    dailyRate: 150.00,
    isOccupied: false,
    lastCleaned: new Date(),
    maintenanceStatus: "Good",
    hasOxygen: true,
    hasMonitor: false,
    hasPrivateBathroom: true
  },
  {
    id: "P3_QUI_303",
    number: "303",
    floor: 3,
    department: "Quirófano",
    type: "Single",
    beds: [{
      id: "P3_QUI_303_1",
      number: "1",
      roomId: "P3_QUI_303",
      isOccupied: false,
      status: "Available",
      cleaningStatus: "Clean",
      lastCleaned: new Date(),
      hasBedrails: true,
      isElectric: true
    }],
    amenities: ["TV", "Baño privado"],
    dailyRate: 150.00,
    isOccupied: false,
    lastCleaned: new Date(),
    maintenanceStatus: "Good",
    hasOxygen: true,
    hasMonitor: false,
    hasPrivateBathroom: true
  },
  {
    id: "P3_SC_304",
    number: "302",
    floor: 3,
    department: "Cirugía",
    type: "Double",
    beds: [],
    amenities: ["TV", "Baño privado"],
    dailyRate: 150.00,
    isOccupied: false,
    lastCleaned: new Date(),
    maintenanceStatus: "Good",
    hasOxygen: true,
    hasMonitor: false,
    hasPrivateBathroom: true
  },
  {
    id: "P4_UCI_670",
    number: "670",
    floor: 4,
    department: "UCI",
    type: "Single",
    beds: [{
      id: "P4_UCI_670_1",
      number: "1",
      roomId: "P4_UCI_670",
      isOccupied: false,
      status: "Available",
      cleaningStatus: "Clean",
      lastCleaned: new Date(),
      hasBedrails: true,
      isElectric: true
    }],
    amenities: ["TV", "Baño privado"],
    dailyRate: 150.00,
    isOccupied: false,
    lastCleaned: new Date(),
    maintenanceStatus: "Good",
    hasOxygen: true,
    hasMonitor: true,
    hasPrivateBathroom: true
  },
  {
    id: "P4_HG_330",
    number: "330",
    floor: 4,
    department: "Hospitalización General",
    type: "Double",
    beds: [{
      id: "P4_HG_330_2",
      number: "2",
      roomId: "P4_HG_330",
      isOccupied: false,
      status: "Available",
      cleaningStatus: "Clean",
      lastCleaned: new Date(),
      hasBedrails: true,
      isElectric: true
    }],
    amenities: ["TV", "Baño privado"],
    dailyRate: 150.00,
    isOccupied: false,
    lastCleaned: new Date(),
    maintenanceStatus: "Good",
    hasOxygen: true,
    hasMonitor: false,
    hasPrivateBathroom: true
  },
  {
    id: "P2_HMI_201",
    number: "8",
    floor: 2,
    department: "Medicina Interna",
    type: "Single",
    beds: [{
      id: "P2_HMI_201_M015",
      number: "M015",
      roomId: "P2_HMI_201",
      isOccupied: false,
      status: "Available",
      cleaningStatus: "Clean",
      lastCleaned: new Date(),
      hasBedrails: true,
      isElectric: true
    }],
    amenities: ["TV", "Baño privado"],
    dailyRate: 150.00,
    isOccupied: false,
    lastCleaned: new Date(),
    maintenanceStatus: "Good",
    hasOxygen: true,
    hasMonitor: false,
    hasPrivateBathroom: true
  },
  // Habitaciones adicionales para sincronizar con plantas hospitalarias
  {
    id: "P1_URG_102",
    number: "102",
    floor: 1,
    department: "Urgencias",
    type: "Double",
    beds: [],
    amenities: ["Monitor continuo", "Oxígeno"],
    dailyRate: 200.00,
    isOccupied: true,
    lastCleaned: new Date(),
    maintenanceStatus: "Good",
    hasOxygen: true,
    hasMonitor: true,
    hasPrivateBathroom: false
  },
  {
    id: "P1_URG_103",
    number: "103",
    floor: 1,
    department: "Urgencias",
    type: "Single",
    beds: [],
    amenities: ["Monitor continuo", "Oxígeno"],
    dailyRate: 180.00,
    isOccupied: true,
    lastCleaned: new Date(),
    maintenanceStatus: "Good",
    hasOxygen: true,
    hasMonitor: true,
    hasPrivateBathroom: false
  },
  {
    id: "P2_CIR_201",
    number: "201",
    floor: 2,
    department: "Cirugía",
    type: "Double",
    beds: [],
    amenities: ["TV", "Baño privado"],
    dailyRate: 180.00,
    isOccupied: true,
    lastCleaned: new Date(),
    maintenanceStatus: "Good",
    hasOxygen: true,
    hasMonitor: false,
    hasPrivateBathroom: true
  },
  {
    id: "P2_TRA_202",
    number: "202",
    floor: 2,
    department: "Traumatología",
    type: "Single",
    beds: [],
    amenities: ["TV", "Baño privado"],
    dailyRate: 150.00,
    isOccupied: false,
    lastCleaned: new Date('2024-01-10'),
    maintenanceStatus: "Good",
    hasOxygen: true,
    hasMonitor: false,
    hasPrivateBathroom: true
  },
  {
    id: "P3_OBS_301",
    number: "3-301",
    floor: 3,
    department: "Obstetricia",
    type: "Double",
    beds: [],
    amenities: ["TV", "Baño privado", "Cuna"],
    dailyRate: 180.00,
    isOccupied: true,
    lastCleaned: new Date(),
    maintenanceStatus: "Good",
    hasOxygen: true,
    hasMonitor: true,
    hasPrivateBathroom: true
  },
  {
    id: "P4_MED_401",
    number: "401",
    floor: 4,
    department: "Medicina Interna",
    type: "Double",
    beds: [],
    amenities: ["TV", "Baño privado"],
    dailyRate: 150.00,
    isOccupied: true,
    lastCleaned: new Date(),
    maintenanceStatus: "Good",
    hasOxygen: true,
    hasMonitor: false,
    hasPrivateBathroom: true
  },
  {
    id: "P4_UCI_402",
    number: "UCI-402",
    floor: 4,
    department: "UCI",
    type: "ICU",
    beds: [],
    amenities: ["Monitor continuo", "Ventilador", "Desfibrilador"],
    dailyRate: 500.00,
    isOccupied: true,
    lastCleaned: new Date(),
    maintenanceStatus: "Good",
    hasOxygen: true,
    hasMonitor: true,
    hasPrivateBathroom: false,
    notes: "Unidad de Cuidados Intensivos - Acceso restringido"
  },
  {
    id: "P5_HG_501",
    number: "501",
    floor: 5,
    department: "Hospitalización General",
    type: "Double",
    beds: [],
    amenities: ["TV", "Baño privado"],
    dailyRate: 120.00,
    isOccupied: false,
    lastCleaned: new Date(),
    maintenanceStatus: "Good",
    hasOxygen: false,
    hasMonitor: false,
    hasPrivateBathroom: true
  },
  {
    id: "P5_HG_502",
    number: "502",
    floor: 5,
    department: "Hospitalización General",
    type: "Single",
    beds: [],
    amenities: ["TV", "Baño privado"],
    dailyRate: 100.00,
    isOccupied: false,
    lastCleaned: new Date('2024-01-12'),
    maintenanceStatus: "Good",
    hasOxygen: false,
    hasMonitor: false,
    hasPrivateBathroom: true
  }
];

// ============================================
// CAMAS - Extraídas de las habitaciones + camas adicionales
// ============================================

// Función para extraer todas las camas de las habitaciones
function extractBedsFromRooms(rooms: Room[]): Bed[] {
  const bedsFromRooms: Bed[] = [];
  rooms.forEach(room => {
    if (room.beds && room.beds.length > 0) {
      bedsFromRooms.push(...room.beds);
    }
  });
  return bedsFromRooms;
}

// Camas base extraídas de las habitaciones
const bedsFromRooms = extractBedsFromRooms(sqlRooms);

// Camas adicionales para completar la distribución del hospital
// Estas camas están distribuidas en diferentes plantas y unidades
const additionalBeds: Bed[] = [
  // Planta 1 - Urgencias (Hab 102, 103)
  { id: "P1_URG_102_1", number: "1", roomId: "P1_URG_102", isOccupied: true, patientId: "IFV_0001", status: "Occupied", cleaningStatus: "Clean", lastCleaned: new Date(), hasBedrails: true, isElectric: true },
  { id: "P1_URG_102_2", number: "2", roomId: "P1_URG_102", isOccupied: false, status: "Available", cleaningStatus: "Clean", lastCleaned: new Date(), hasBedrails: true, isElectric: false },
  { id: "P1_URG_103_1", number: "1", roomId: "P1_URG_103", isOccupied: true, patientId: "JML_0001", status: "Occupied", cleaningStatus: "Clean", lastCleaned: new Date(), hasBedrails: true, isElectric: true },
  
  // Planta 2 - Cirugía y Traumatología (Hab 201, 202)
  { id: "P2_CIR_201_1", number: "1", roomId: "P2_CIR_201", isOccupied: true, patientId: "SVP_0001", status: "Occupied", cleaningStatus: "Clean", lastCleaned: new Date(), hasBedrails: true, isElectric: true },
  { id: "P2_CIR_201_2", number: "2", roomId: "P2_CIR_201", isOccupied: false, status: "Available", cleaningStatus: "Clean", lastCleaned: new Date(), hasBedrails: true, isElectric: true },
  { id: "P2_TRA_202_1", number: "1", roomId: "P2_TRA_202", isOccupied: false, status: "Cleaning Required", cleaningStatus: "Dirty", lastCleaned: new Date('2024-01-10'), hasBedrails: true, isElectric: false },
  
  // Planta 3 - Obstetricia (Hab 301, 302)
  { id: "P3_OBS_301_1", number: "1", roomId: "P3_OBS_301", isOccupied: true, patientId: "PIF_0010", status: "Occupied", cleaningStatus: "Clean", lastCleaned: new Date(), hasBedrails: true, isElectric: true },
  { id: "P3_OBS_301_2", number: "2", roomId: "P3_OBS_301", isOccupied: true, patientId: "MIF_0011", status: "Occupied", cleaningStatus: "Clean", lastCleaned: new Date(), hasBedrails: true, isElectric: true },
  
  // Planta 4 - Medicina Interna y UCI (Hab 401, 402)
  { id: "P4_MED_401_1", number: "1", roomId: "P4_MED_401", isOccupied: true, patientId: "JAV_0001", status: "Occupied", cleaningStatus: "Clean", lastCleaned: new Date(), hasBedrails: true, isElectric: true },
  { id: "P4_MED_401_2", number: "2", roomId: "P4_MED_401", isOccupied: false, status: "Reserved", cleaningStatus: "Sanitized", lastCleaned: new Date(), hasBedrails: true, isElectric: true },
  { id: "P4_UCI_402_1", number: "1", roomId: "P4_UCI_402", isOccupied: true, patientId: "MRS_0001", status: "Occupied", cleaningStatus: "Clean", lastCleaned: new Date(), hasBedrails: true, isElectric: true, equipment: ["Monitor", "Ventilador", "Desfibrilador"] },
  { id: "P4_UCI_402_2", number: "2", roomId: "P4_UCI_402", isOccupied: false, status: "Maintenance", cleaningStatus: "Clean", lastCleaned: new Date(), hasBedrails: true, isElectric: true, equipment: ["Monitor", "Ventilador"] },
  
  // Planta 5 - Hospitalización General
  { id: "P5_HG_501_1", number: "1", roomId: "P5_HG_501", isOccupied: false, status: "Available", cleaningStatus: "Clean", lastCleaned: new Date(), hasBedrails: true, isElectric: false },
  { id: "P5_HG_501_2", number: "2", roomId: "P5_HG_501", isOccupied: false, status: "Available", cleaningStatus: "Clean", lastCleaned: new Date(), hasBedrails: true, isElectric: false },
  { id: "P5_HG_502_1", number: "1", roomId: "P5_HG_502", isOccupied: false, status: "Available", cleaningStatus: "In Progress", lastCleaned: new Date('2024-01-12'), hasBedrails: true, isElectric: true }
];

// Combinar todas las camas
export const sqlBeds: Bed[] = [...bedsFromRooms, ...additionalBeds];

// ============================================
// MEDICAMENTOS (23 registros)
// ============================================
export const sqlMedications: Medication[] = [
  {
    id: "R06AA59",
    name: "Pluriamín",
    genericName: "Pluriamín",
    dosage: "Ver indicaciones",
    frequency: "Según prescripción",
    route: "Oral",
    startDate: new Date(),
    prescribedBy: "Sistema",
    patientId: "",
    instructions: "comprimido - oral",
    status: "Active"
  },
  {
    id: "B03AA07",
    name: "Ferrogradumet",
    genericName: "Ferrogradumet",
    dosage: "Ver indicaciones",
    frequency: "Según prescripción",
    route: "Oral",
    startDate: new Date(),
    prescribedBy: "Sistema",
    patientId: "",
    instructions: "comprimido - oral",
    status: "Active"
  },
  {
    id: "N02BE01",
    name: "Paracetamol",
    genericName: "Paracetamol",
    dosage: "g",
    frequency: "Según prescripción",
    route: "Oral",
    startDate: new Date(),
    prescribedBy: "Sistema",
    patientId: "",
    instructions: "comprimido - oral",
    status: "Active"
  },
  {
    id: "N02BE01_INY",
    name: "Enoxaparina",
    genericName: "Enoxaparina",
    dosage: "mg",
    frequency: "Según prescripción",
    route: "Oral",
    startDate: new Date(),
    prescribedBy: "Sistema",
    patientId: "",
    instructions: "inyección - subcutánea",
    status: "Active"
  },
  {
    id: "B05BB01",
    name: "Ringer-lactato",
    genericName: "Ringer-lactato",
    dosage: "Ver indicaciones",
    frequency: "Según prescripción",
    route: "IV",
    startDate: new Date(),
    prescribedBy: "Sistema",
    patientId: "",
    instructions: "solución - intravenosa",
    status: "Active"
  },
  {
    id: "N05BA01",
    name: "Diacepán",
    genericName: "Diacepán",
    dosage: "Ver indicaciones",
    frequency: "Según prescripción",
    route: "IV",
    startDate: new Date(),
    prescribedBy: "Sistema",
    patientId: "",
    instructions: "inyectable - intravenosa",
    status: "Active"
  },
  {
    id: "J01FF01",
    name: "Clindamicina",
    genericName: "Clindamicina",
    dosage: "Ver indicaciones",
    frequency: "Según prescripción",
    route: "IV",
    startDate: new Date(),
    prescribedBy: "Sistema",
    patientId: "",
    instructions: "inyectable - intravenosa",
    status: "Active"
  },
  {
    id: "N01AX10",
    name: "Propofol",
    genericName: "Propofol",
    dosage: "Ver indicaciones",
    frequency: "Según prescripción",
    route: "IV",
    startDate: new Date(),
    prescribedBy: "Sistema",
    patientId: "",
    instructions: "inyectable - intravenosa",
    status: "Active"
  },
  {
    id: "J01CA01",
    name: "Ampicilina",
    genericName: "Ampicilina",
    dosage: "Ver indicaciones",
    frequency: "Según prescripción",
    route: "IV",
    startDate: new Date(),
    prescribedBy: "Sistema",
    patientId: "",
    instructions: "inyectable - intravenosa",
    status: "Active"
  },
  {
    id: "J01GB03",
    name: "Gentamicina",
    genericName: "Gentamicina",
    dosage: "Ver indicaciones",
    frequency: "Según prescripción",
    route: "IM",
    startDate: new Date(),
    prescribedBy: "Sistema",
    patientId: "",
    instructions: "inyectable - intramuscular",
    status: "Active"
  },
  {
    id: "J01DD04",
    name: "Ceftriaxone",
    genericName: "Ceftriaxone",
    dosage: "g",
    frequency: "Según prescripción",
    route: "IV",
    startDate: new Date(),
    prescribedBy: "Sistema",
    patientId: "",
    instructions: "inyectable - intravenosa",
    status: "Active"
  },
  {
    id: "J01FA10",
    name: "Azitromicina",
    genericName: "Azitromicina",
    dosage: "mg",
    frequency: "Según prescripción",
    route: "Oral",
    startDate: new Date(),
    prescribedBy: "Sistema",
    patientId: "",
    instructions: "comprimido - oral",
    status: "Active"
  },
  {
    id: "J01XA01",
    name: "Vancomycin",
    genericName: "Vancomycin",
    dosage: "g",
    frequency: "Según prescripción",
    route: "IV",
    startDate: new Date(),
    prescribedBy: "Sistema",
    patientId: "",
    instructions: "solución - intravenosa",
    status: "Active"
  },
  {
    id: "R05CB01",
    name: "Fluimicil",
    genericName: "Fluimicil",
    dosage: "mg",
    frequency: "Según prescripción",
    route: "Oral",
    startDate: new Date(),
    prescribedBy: "Sistema",
    patientId: "",
    instructions: "Comprimido - Oral",
    status: "Active"
  },
  {
    id: "C09AA01",
    name: "Captopril",
    genericName: "Captopril",
    dosage: "mg",
    frequency: "Según prescripción",
    route: "Oral",
    startDate: new Date(),
    prescribedBy: "Sistema",
    patientId: "",
    instructions: "Comprimido - Oral",
    status: "Active"
  },
  {
    id: "A10BB09",
    name: "Glicazida",
    genericName: "Glicazida",
    dosage: "mg",
    frequency: "Según prescripción",
    route: "Oral",
    startDate: new Date(),
    prescribedBy: "Sistema",
    patientId: "",
    instructions: "Comprimido - Oral",
    status: "Active"
  },
  {
    id: "J01DC02",
    name: "Cefuroxima I",
    genericName: "Cefuroxima I",
    dosage: "g/12h",
    frequency: "Según prescripción",
    route: "IV",
    startDate: new Date(),
    prescribedBy: "Sistema",
    patientId: "",
    instructions: "Solución - Endovenosa",
    status: "Active"
  },
  {
    id: "B05XA03",
    name: "Suero fisiológico",
    genericName: "Suero fisiológico",
    dosage: "mL/h",
    frequency: "Según prescripción",
    route: "IV",
    startDate: new Date(),
    prescribedBy: "Sistema",
    patientId: "",
    instructions: "Solución - Endovenosa",
    status: "Active"
  },
  {
    id: "V03AN01",
    name: "Oxígeno",
    genericName: "Oxígeno",
    dosage: "L/min",
    frequency: "Según prescripción",
    route: "Oral",
    startDate: new Date(),
    prescribedBy: "Sistema",
    patientId: "",
    instructions: "Gas - Mascarilla",
    status: "Active"
  },
  {
    id: "J01DC02_ORAL",
    name: "Cefuroxima II",
    genericName: "Cefuroxima II",
    dosage: "g/12h",
    frequency: "Según prescripción",
    route: "Oral",
    startDate: new Date(),
    prescribedBy: "Sistema",
    patientId: "",
    instructions: "Comprimido - Oral",
    status: "Active"
  },
  {
    id: "C02AB01",
    name: "Aldomet",
    genericName: "Aldomet",
    dosage: "mg",
    frequency: "Según prescripción",
    route: "Oral",
    startDate: new Date(),
    prescribedBy: "Sistema",
    patientId: "",
    instructions: "Comprimido - Oral",
    status: "Active"
  },
  {
    id: "J01MA02",
    name: "Cirpofloxacina",
    genericName: "Cirpofloxacina",
    dosage: "mg",
    frequency: "Según prescripción",
    route: "Oral",
    startDate: new Date(),
    prescribedBy: "Sistema",
    patientId: "",
    instructions: "Comprimido - Oral",
    status: "Active"
  },
  {
    id: "C03CA01",
    name: "Seguril",
    genericName: "Seguril",
    dosage: "mg",
    frequency: "Según prescripción",
    route: "Oral",
    startDate: new Date(),
    prescribedBy: "Sistema",
    patientId: "",
    instructions: "Comprimido - Oral",
    status: "Active"
  }
];

// ============================================
// SERVICIOS/PRESTACIONES (15 registros)
// ============================================
export const sqlServices: Service[] = [
  {
    id: "LAB01",
    name: "Analítica básica",
    description: "Analítica básica",
    department: "procedimiento",
    duration: 30,
    cost: 146,
    requiresPreauth: false,
    isActive: true
  },
  {
    id: "ECO01",
    name: "Ecografía obstétrica",
    description: "Ecografía obstétrica",
    department: "procedimiento",
    duration: 30,
    cost: 180,
    requiresPreauth: false,
    isActive: true
  },
  {
    id: "SCR01",
    name: "Screening neonatal",
    description: "Screening neonatal",
    department: "procedimiento",
    duration: 30,
    cost: 22,
    requiresPreauth: false,
    isActive: true
  },
  {
    id: "EST01",
    name: "Dia de estancia en traumatologia",
    description: "Dia de estancia en traumatologia",
    department: "estancia",
    duration: 30,
    cost: 350,
    requiresPreauth: false,
    isActive: true
  },
  {
    id: "RX01",
    name: "Radiografia de Tibia",
    description: "Radiografia de Tibia",
    department: "procedimiento",
    duration: 30,
    cost: 30,
    requiresPreauth: false,
    isActive: true
  },
  {
    id: "LAB02",
    name: "Hemograma",
    description: "Hemograma",
    department: "procedimiento",
    duration: 30,
    cost: 50,
    requiresPreauth: false,
    isActive: true
  },
  {
    id: "RX02",
    name: "Radiografía de abdomen",
    description: "Radiografía de abdomen",
    department: "procedimiento",
    duration: 30,
    cost: 60,
    requiresPreauth: false,
    isActive: true
  },
  {
    id: "HC01",
    name: "Hemocultivo",
    description: "Hemocultivo",
    department: "procedimiento",
    duration: 30,
    cost: 32,
    requiresPreauth: false,
    isActive: true
  },
  {
    id: "RX03",
    name: "Radiografía de Tórax",
    description: "Radiografía de Tórax",
    department: "procedimiento",
    duration: 30,
    cost: 40,
    requiresPreauth: false,
    isActive: true
  },
  {
    id: "REHAB_RESP01",
    name: "Fisioterapia respiratoria",
    description: "Fisioterapia respiratoria",
    department: "Rehabiltación",
    duration: 30,
    cost: 75,
    requiresPreauth: false,
    isActive: true
  },
  {
    id: "PSICO_APOYO01",
    name: "Apoyo psicológico",
    description: "Apoyo psicológico",
    department: "Rehabiltación",
    duration: 30,
    cost: 125,
    requiresPreauth: false,
    isActive: true
  },
  {
    id: "LAB03",
    name: "Cultivo esputo",
    description: "Cultivo esputo",
    department: "Procedimiento",
    duration: 30,
    cost: 35,
    requiresPreauth: false,
    isActive: true
  },
  {
    id: "EST02",
    name: "Ingreso Medicina Interna",
    description: "Ingreso Medicina Interna",
    department: "Estancia",
    duration: 30,
    cost: 350,
    requiresPreauth: false,
    isActive: true
  },
  {
    id: "EST03",
    name: "Traslado área observación",
    description: "Traslado área observación",
    department: "Estancia",
    duration: 30,
    cost: 120,
    requiresPreauth: false,
    isActive: true
  },
  {
    id: "ECO02",
    name: "Ecocardiografía",
    description: "Ecocardiografía",
    department: "Procedimiento",
    duration: 30,
    cost: 200,
    requiresPreauth: false,
    isActive: true
  }
];

// ============================================
// ADMISIONES/EPISODIOS (registros únicos)
// ============================================
export const sqlAdmissions: Admission[] = [
];

// ============================================
// ÓRDENES MÉDICAS (según tabla OrdenMedica en database_all.sql)
// Mapeo episodio -> paciente:
// CTS880 -> IFV_0001 (Isabel Flores), WHG_123 -> JML_0001 (Javier Martinez)
// EPI001 -> SVP_0001 (Samuel Vallbé), AEF498 -> JAV_0001 (Juan Agudells)
// KOP233 -> MRS_0001 (María Rodríguez)
// ============================================
export const sqlMedicalOrders: MedicalOrder[] = [
  // ========================================
  // Isabel Flores Viñales (IFV_0001) - Episodio CTS880
  // Dr. Josep Blanch Alsina (27512) - Ginecología
  // ========================================
  { id: "ORD342", patientId: "IFV_0001", physicianId: "27512", physicianName: "Dr. Josep Blanch Alsina", orderDate: new Date("2014-01-02 10:30:00"), type: "Medication", category: "Routine", description: "Pluriamin prescription", instructions: "Prescripción de Pluriamin para control prenatal", status: "Pending", cost: 0, requiresConsent: false },
  { id: "ORD892", patientId: "IFV_0001", physicianId: "27512", physicianName: "Dr. Josep Blanch Alsina", orderDate: new Date("2014-03-27 10:00:00"), type: "Medication", category: "Routine", description: "Ferrogradumet prescription", instructions: "Prescripción de Ferrogradumet - Suplementación de hierro", status: "Pending", cost: 0, requiresConsent: false },
  { id: "ORD326", patientId: "IFV_0001", physicianId: "27512", physicianName: "Dr. Josep Blanch Alsina", orderDate: new Date("2014-05-07 13:00:00"), type: "Diet", category: "Routine", description: "Low-carbohydrate diet", instructions: "Dieta baja en carbohidratos", status: "Pending", cost: 0, requiresConsent: false },
  
  // ========================================
  // Javier Martinez Lopez (JML_0001) - Episodio WHG_123
  // Dra. Laura Martinez (12345) - Urgencias
  // ========================================
  { id: "ORD123", patientId: "JML_0001", physicianId: "12345", physicianName: "Dra. Laura Martinez", orderDate: new Date("2022-09-11 10:00:00"), type: "Medication", category: "Stat", description: "Analgesic treatment: Paracetamol 1g every 8 hours", instructions: "Tratamiento analgésico: Paracetamol 1g cada 8 horas", status: "Pending", cost: 0, requiresConsent: false },
  { id: "ORD124", patientId: "JML_0001", physicianId: "12345", physicianName: "Dra. Laura Martinez", orderDate: new Date("2022-09-11 10:00:00"), type: "Medication", category: "Stat", description: "Low Molecular Weight Heparin (Enoxaparin): 40 mg subcutaneously once daily", instructions: "Heparina de bajo peso molecular (Enoxaparina): 40 mg subcutáneo una vez al día", status: "Pending", cost: 0, requiresConsent: false },
  { id: "ORD125", patientId: "JML_0001", physicianId: "12345", physicianName: "Dra. Laura Martinez", orderDate: new Date("2022-09-11 10:00:00"), type: "Procedure", category: "Stat", description: "Cast fixation on right leg", instructions: "Fijación con yeso en pierna derecha", status: "Pending", cost: 0, requiresConsent: false },
  
  // ========================================
  // Samuel Vallbé Picornell (SVP_0001) - Episodio EPI001
  // Apendicectomía - Varios médicos
  // ========================================
  { id: "ORD342_EPI", patientId: "SVP_0001", physicianId: "56345", physicianName: "Dr. Orestes García", orderDate: new Date("2015-09-14 14:40:00"), type: "Procedure", category: "Stat", description: "Hospital admission. Urgent surgical intervention", instructions: "Ingreso hospitalario. Intervención quirúrgica urgente", status: "Pending", cost: 0, requiresConsent: true },
  { id: "ORD390", patientId: "SVP_0001", physicianId: "33272", physicianName: "Dra. Clara Dolz", orderDate: new Date("2015-09-14 18:44:00"), type: "Medication", category: "Stat", description: "Premedication: Diazepam 10mg IV. Anesthesia induction with Propofol", instructions: "Premedicación: Diazepam 10mg IV. Inducción anestésica con Propofol", status: "Pending", cost: 0, requiresConsent: true },
  { id: "ORD511", patientId: "SVP_0001", physicianId: "56345", physicianName: "Dr. Orestes García", orderDate: new Date("2015-09-14 20:30:00"), type: "Medication", category: "Routine", description: "Nil per os (NPO). Open nasogastric tube. Ringer-lactate 500ml/8h infusion. Clindamycin 300mg/12h IV. Paracetamol 500mg/8h as needed for pain", instructions: "Dieta absoluta (NPO). Sonda nasogástrica abierta. Perfusión Ringer-lactato 500ml/8h. Clindamicina 300mg/12h IV. Paracetamol 500mg/8h si dolor", status: "Pending", cost: 0, requiresConsent: false },
  { id: "ORD519", patientId: "SVP_0001", physicianId: "56345", physicianName: "Dr. Orestes García", orderDate: new Date("2015-09-15 09:00:00"), type: "Diet", category: "Routine", description: "Remove nasogastric tube. Progressive liquid diet reintroduction", instructions: "Retirar sonda nasogástrica. Reintroducción progresiva dieta líquida", status: "Pending", cost: 0, requiresConsent: false },
  { id: "ORD348", patientId: "SVP_0001", physicianId: "22567", physicianName: "Dr. Personal médico", orderDate: new Date("2015-09-15 18:15:00"), type: "Medication", category: "Stat", description: "Nil per os (NPO). Increase Ringer-lactate infusion to 500ml/6h. Ampicillin 500mg/6h IV. Gentamicin 20mg/8h IM", instructions: "Dieta absoluta (NPO). Aumentar perfusión Ringer-lactato a 500ml/6h. Ampicilina 500mg/6h IV. Gentamicina 20mg/8h IM", status: "Pending", cost: 0, requiresConsent: false },
  
  // ========================================
  // Juan Agudells Valenciano (JAV_0001) - Episodio AEF498
  // Dr. Román Sampedro (35678) - Medicina Interna
  // Neumonía
  // ========================================
  { id: "ORD133", patientId: "JAV_0001", physicianId: "35678", physicianName: "Dr. Román Sampedro", orderDate: new Date("2014-10-14 19:45:00"), type: "Lab", category: "Stat", description: "Blood test", instructions: "Análisis de sangre", status: "Pending", cost: 0, requiresConsent: false },
  { id: "ORD134", patientId: "JAV_0001", physicianId: "35678", physicianName: "Dr. Román Sampedro", orderDate: new Date("2014-10-14 19:45:00"), type: "Lab", category: "Stat", description: "Sputum culture", instructions: "Cultivo de esputo", status: "Pending", cost: 0, requiresConsent: false },
  { id: "ORD135", patientId: "JAV_0001", physicianId: "35678", physicianName: "Dr. Román Sampedro", orderDate: new Date("2014-10-14 19:45:00"), type: "Imaging", category: "Stat", description: "Chest X-ray", instructions: "Radiografía de tórax", status: "Pending", cost: 0, requiresConsent: false },
  { id: "ORD136", patientId: "JAV_0001", physicianId: "35678", physicianName: "Dr. Román Sampedro", orderDate: new Date("2014-10-14 19:45:00"), type: "Procedure", category: "Stat", description: "Vital signs monitoring", instructions: "Monitorización de signos vitales", status: "Pending", cost: 0, requiresConsent: false },
  { id: "ORD137", patientId: "JAV_0001", physicianId: "35678", physicianName: "Dr. Román Sampedro", orderDate: new Date("2014-10-14 19:45:00"), type: "Diet", category: "Stat", description: "Nil per os (NPO)", instructions: "Dieta absoluta (NPO)", status: "Pending", cost: 0, requiresConsent: false },
  { id: "ORD138", patientId: "JAV_0001", physicianId: "35678", physicianName: "Dr. Román Sampedro", orderDate: new Date("2014-10-14 19:45:00"), type: "Procedure", category: "Stat", description: "Saline infusion placement", instructions: "Colocación de vía salina", status: "Pending", cost: 0, requiresConsent: false },
  { id: "ORD139", patientId: "JAV_0001", physicianId: "35678", physicianName: "Dr. Román Sampedro", orderDate: new Date("2014-10-14 19:45:00"), type: "Procedure", category: "Stat", description: "Transfer to observation area", instructions: "Traslado a área de observación", status: "Pending", cost: 0, requiresConsent: false },
  { id: "ORD140", patientId: "JAV_0001", physicianId: "35678", physicianName: "Dr. Román Sampedro", orderDate: new Date("2014-10-14 23:30:00"), type: "Procedure", category: "Routine", description: "Transfer to internal medicine hospitalization", instructions: "Traslado a hospitalización de medicina interna", status: "Pending", cost: 0, requiresConsent: false },
  { id: "ORD141", patientId: "JAV_0001", physicianId: "35678", physicianName: "Dr. Román Sampedro", orderDate: new Date("2014-10-14 23:30:00"), type: "Medication", category: "Routine", description: "Paracetamol 600 mg", instructions: "Paracetamol 600 mg para control de fiebre y dolor", status: "Pending", cost: 0, requiresConsent: false },
  { id: "ORD142", patientId: "JAV_0001", physicianId: "35678", physicianName: "Dr. Román Sampedro", orderDate: new Date("2014-10-14 23:30:00"), type: "Medication", category: "Routine", description: "Oxygen via nasal cannula 4L/min", instructions: "Oxígeno por cánula nasal 4L/min", status: "Pending", cost: 0, requiresConsent: false },
  { id: "ORD143", patientId: "JAV_0001", physicianId: "35678", physicianName: "Dr. Román Sampedro", orderDate: new Date("2014-10-14 23:30:00"), type: "Procedure", category: "Routine", description: "Vital signs taken every 8 hours", instructions: "Toma de signos vitales cada 8 horas", status: "Pending", cost: 0, requiresConsent: false },
  { id: "ORD144", patientId: "JAV_0001", physicianId: "35678", physicianName: "Dr. Román Sampedro", orderDate: new Date("2014-10-14 23:30:00"), type: "Medication", category: "Routine", description: "Continuation of treatment prescribed by Dr. Garcés", instructions: "Continuación del tratamiento prescrito por el Dr. Garcés", status: "Pending", cost: 0, requiresConsent: false },
  { id: "ORD145", patientId: "JAV_0001", physicianId: "35678", physicianName: "Dr. Román Sampedro", orderDate: new Date("2014-10-14 23:30:00"), type: "Medication", category: "Routine", description: "Cefuroxime", instructions: "Cefuroxima - Antibiótico para tratamiento de neumonía", status: "Pending", cost: 0, requiresConsent: false },
  
  // ========================================
  // María Rodríguez Sánchez (MRS_0001) - Episodio KOP233
  // Dr. Miguel Serrano (30123) - UCI
  // Neumonía grave
  // ========================================
  { id: "ORD126", patientId: "MRS_0001", physicianId: "30123", physicianName: "Dr. Miguel Serrano", orderDate: new Date("2022-05-10 17:14:00"), type: "Medication", category: "Stat", description: "Ceftriaxone", instructions: "Ceftriaxona - Antibiótico de amplio espectro", status: "Pending", cost: 0, requiresConsent: false },
  { id: "ORD127", patientId: "MRS_0001", physicianId: "30123", physicianName: "Dr. Miguel Serrano", orderDate: new Date("2022-05-11 17:14:00"), type: "Medication", category: "Stat", description: "Ceftriaxone", instructions: "Ceftriaxona - Continuar tratamiento día 2", status: "Pending", cost: 0, requiresConsent: false },
  { id: "ORD128", patientId: "MRS_0001", physicianId: "30123", physicianName: "Dr. Miguel Serrano", orderDate: new Date("2022-05-11 17:14:00"), type: "Medication", category: "Stat", description: "Azithromycin", instructions: "Azitromicina - Macrólido añadido al tratamiento", status: "Pending", cost: 0, requiresConsent: false },
  { id: "ORD129", patientId: "MRS_0001", physicianId: "30123", physicianName: "Dr. Miguel Serrano", orderDate: new Date("2022-05-12 17:14:00"), type: "Medication", category: "Routine", description: "Ceftriaxone", instructions: "Ceftriaxona - Continuar tratamiento día 3", status: "Pending", cost: 0, requiresConsent: false },
  { id: "ORD130", patientId: "MRS_0001", physicianId: "30123", physicianName: "Dr. Miguel Serrano", orderDate: new Date("2022-05-12 17:14:00"), type: "Medication", category: "Routine", description: "Vancomycin", instructions: "Vancomicina - Cobertura SAMR añadida", status: "Pending", cost: 0, requiresConsent: false },
  { id: "ORD131", patientId: "MRS_0001", physicianId: "30123", physicianName: "Dr. Miguel Serrano", orderDate: new Date("2022-05-13 17:14:00"), type: "Medication", category: "Routine", description: "Ceftriaxone", instructions: "Ceftriaxona - Continuar tratamiento día 4", status: "Pending", cost: 0, requiresConsent: false },
  { id: "ORD132", patientId: "MRS_0001", physicianId: "30123", physicianName: "Dr. Miguel Serrano", orderDate: new Date("2022-05-13 17:14:00"), type: "Medication", category: "Routine", description: "Vancomycin", instructions: "Vancomicina - Última dosis UCI, traslado a planta", status: "Pending", cost: 0, requiresConsent: false },
];

// ============================================
// ASIGNACIONES PROFESIONAL-PACIENTE
// Control de acceso: qué profesionales pueden ver qué pacientes
// ============================================
export const sqlAsignacionesProfesionalPaciente: AsignacionProfesionalPaciente[] = [
  // Dr. Josep Blanch Alsina (27512) - Ginecología - Paciente Isabel Flores
  { id: 'ASG001', profesionalId: '27512', pacienteId: 'IFV_0001', tipoAsignacion: 'responsable', fechaInicio: new Date('2014-01-02'), departamento: 'Ginecología y Obstetricia', activo: true, notas: 'Médico responsable del embarazo' },
  
  // Dr. Eugenio Magriñá (19621) - Obstetricia - Pacientes gemelos y madre
  { id: 'ASG002', profesionalId: '19621', pacienteId: 'IFV_0001', tipoAsignacion: 'equipo', fechaInicio: new Date('2014-07-03'), fechaFin: new Date('2014-07-07'), departamento: 'Obstetricia', activo: true, notas: 'Atención al parto' },
  { id: 'ASG003', profesionalId: '19621', pacienteId: 'PIF_0010', tipoAsignacion: 'responsable', fechaInicio: new Date('2014-07-03'), departamento: 'Pediatría', activo: true, notas: 'Neonatología' },
  { id: 'ASG004', profesionalId: '19621', pacienteId: 'MIF_0011', tipoAsignacion: 'responsable', fechaInicio: new Date('2014-07-03'), departamento: 'Pediatría', activo: true, notas: 'Neonatología' },
  
  // Dr. Laura Martinez (12345) - Urgencias - Paciente Javier Martinez
  { id: 'ASG005', profesionalId: '12345', pacienteId: 'JML_0001', tipoAsignacion: 'responsable', fechaInicio: new Date('2022-09-10'), fechaFin: new Date('2022-09-14'), departamento: 'Urgencias', activo: true, notas: 'Accidente de tráfico' },
  
  // Dr. Orestes García (56345) - Cirugía - Paciente Samuel Vallbé
  { id: 'ASG006', profesionalId: '56345', pacienteId: 'SVP_0001', tipoAsignacion: 'responsable', fechaInicio: new Date('2015-09-14'), fechaFin: new Date('2015-09-16'), departamento: 'Cirugía General', activo: true, notas: 'Apendicectomía' },
  
  // Dr. Clara Dolz (33272) - Anestesiología - Paciente Samuel (cirugía)
  { id: 'ASG007', profesionalId: '33272', pacienteId: 'SVP_0001', tipoAsignacion: 'equipo', fechaInicio: new Date('2015-09-14'), fechaFin: new Date('2015-09-14'), departamento: 'Anestesiología', activo: true, notas: 'Anestesia para cirugía' },
  
  // Dr. Román Sampedro (35678) - Medicina Interna - Paciente Juan Agudells
  { id: 'ASG008', profesionalId: '35678', pacienteId: 'JAV_0001', tipoAsignacion: 'responsable', fechaInicio: new Date('2014-10-14'), fechaFin: new Date('2014-10-17'), departamento: 'Medicina Interna', activo: true, notas: 'Neumonía' },
  
  // Dr. Miguel Serrano (30123) / Laura Mora (7777) - Paciente María Rodríguez
  { id: 'ASG009', profesionalId: '30123', pacienteId: 'MRS_0001', tipoAsignacion: 'responsable', fechaInicio: new Date('2022-05-10'), fechaFin: new Date('2022-05-20'), departamento: 'UCI', activo: true, notas: 'Neumonía grave UCI' },
  { id: 'ASG010', profesionalId: '7777', pacienteId: 'MRS_0001', tipoAsignacion: 'responsable', fechaInicio: new Date('2022-05-20'), fechaFin: new Date('2022-06-02'), departamento: 'Hospitalización General', activo: true, notas: 'Seguimiento post-UCI' },
  
  // Dr. José Frontela (12171) - Pediatría - Recién nacidos
  { id: 'ASG011', profesionalId: '12171', pacienteId: 'PIF_0010', tipoAsignacion: 'equipo', fechaInicio: new Date('2014-07-03'), departamento: 'Pediatría', activo: true, notas: 'Screening neonatal' },
  { id: 'ASG012', profesionalId: '12171', pacienteId: 'MIF_0011', tipoAsignacion: 'equipo', fechaInicio: new Date('2014-07-03'), departamento: 'Pediatría', activo: true, notas: 'Screening neonatal' },
  
  // Enfermera Montserrat Valls (43234) - Obstetricia
  { id: 'ASG013', profesionalId: '43234', pacienteId: 'IFV_0001', tipoAsignacion: 'equipo', fechaInicio: new Date('2014-01-02'), fechaFin: new Date('2014-07-07'), departamento: 'Obstetricia', activo: true, notas: 'Cuidados prenatales y parto' },
  { id: 'ASG014', profesionalId: '43234', pacienteId: 'PIF_0010', tipoAsignacion: 'equipo', fechaInicio: new Date('2014-07-03'), fechaFin: new Date('2014-07-07'), departamento: 'Obstetricia', activo: true, notas: 'Cuidados neonatales' },
  { id: 'ASG015', profesionalId: '43234', pacienteId: 'MIF_0011', tipoAsignacion: 'equipo', fechaInicio: new Date('2014-07-03'), fechaFin: new Date('2014-07-07'), departamento: 'Obstetricia', activo: true, notas: 'Cuidados neonatales' },
  
  // Enfermera Lucía Cabañes (18376) - Urgencias
  { id: 'ASG016', profesionalId: '18376', pacienteId: 'SVP_0001', tipoAsignacion: 'equipo', fechaInicio: new Date('2015-09-14'), departamento: 'Urgencias', activo: true },
  { id: 'ASG017', profesionalId: '18376', pacienteId: 'JML_0001', tipoAsignacion: 'equipo', fechaInicio: new Date('2022-09-10'), departamento: 'Urgencias', activo: true },
  
  // Enfermeras de Hospitalización
  { id: 'ASG018', profesionalId: '25437', pacienteId: 'SVP_0001', tipoAsignacion: 'equipo', fechaInicio: new Date('2015-09-14'), departamento: 'Hospitalización', activo: true },
  { id: 'ASG019', profesionalId: '61765', pacienteId: 'SVP_0001', tipoAsignacion: 'equipo', fechaInicio: new Date('2015-09-15'), departamento: 'Hospitalización', activo: true },
  
  // Enfermera Nuria Bòria (6234) y Isabel Centelles (8512) - Medicina Interna
  { id: 'ASG020', profesionalId: '6234', pacienteId: 'JAV_0001', tipoAsignacion: 'equipo', fechaInicio: new Date('2014-10-14'), departamento: 'Hospitalización', activo: true },
  { id: 'ASG021', profesionalId: '8512', pacienteId: 'JAV_0001', tipoAsignacion: 'equipo', fechaInicio: new Date('2014-10-15'), departamento: 'Hospitalización', activo: true },
  
  // Enfermero Miguel Serrano (30123) si actúa como enfermero - María Rodríguez UCI
  { id: 'ASG022', profesionalId: '30123', pacienteId: 'MRS_0001', tipoAsignacion: 'equipo', fechaInicio: new Date('2022-05-10'), departamento: 'UCI', activo: true },
  
  // ============================================
  // ASIGNACIONES PARA USUARIOS DE DEMOSTRACIÓN
  // Estos usuarios permiten probar el sistema sin usar datos reales
  // ============================================
  
  // Dr. Demo MED001 (23456789B) - Médico de demostración con varios pacientes asignados
  { id: 'ASG_DEMO_001', profesionalId: 'MED001', pacienteId: 'IFV_0001', tipoAsignacion: 'responsable', fechaInicio: new Date('2024-01-01'), departamento: 'Medicina General', activo: true, notas: 'Médico de demostración' },
  { id: 'ASG_DEMO_002', profesionalId: 'MED001', pacienteId: 'PIF_0010', tipoAsignacion: 'responsable', fechaInicio: new Date('2024-01-01'), departamento: 'Medicina General', activo: true, notas: 'Médico de demostración' },
  { id: 'ASG_DEMO_003', profesionalId: 'MED001', pacienteId: 'MIF_0011', tipoAsignacion: 'responsable', fechaInicio: new Date('2024-01-01'), departamento: 'Medicina General', activo: true, notas: 'Médico de demostración' },
  { id: 'ASG_DEMO_004', profesionalId: 'MED001', pacienteId: 'JML_0001', tipoAsignacion: 'responsable', fechaInicio: new Date('2024-01-01'), departamento: 'Medicina General', activo: true, notas: 'Médico de demostración' },
  { id: 'ASG_DEMO_005', profesionalId: 'MED001', pacienteId: 'SVP_0001', tipoAsignacion: 'responsable', fechaInicio: new Date('2024-01-01'), departamento: 'Medicina General', activo: true, notas: 'Médico de demostración' },
  { id: 'ASG_DEMO_006', profesionalId: 'MED001', pacienteId: 'JAV_0001', tipoAsignacion: 'responsable', fechaInicio: new Date('2024-01-01'), departamento: 'Medicina General', activo: true, notas: 'Médico de demostración' },
  { id: 'ASG_DEMO_007', profesionalId: 'MED001', pacienteId: 'MRS_0001', tipoAsignacion: 'responsable', fechaInicio: new Date('2024-01-01'), departamento: 'Medicina General', activo: true, notas: 'Médico de demostración' },
  
  // Dr. Demo MED002 (34567890C) - Otro médico de demostración
  { id: 'ASG_DEMO_008', profesionalId: 'MED002', pacienteId: 'IFV_0001', tipoAsignacion: 'equipo', fechaInicio: new Date('2024-01-01'), departamento: 'Medicina General', activo: true, notas: 'Médico de demostración' },
  { id: 'ASG_DEMO_009', profesionalId: 'MED002', pacienteId: 'JML_0001', tipoAsignacion: 'responsable', fechaInicio: new Date('2024-01-01'), departamento: 'Medicina General', activo: true, notas: 'Médico de demostración' },
  { id: 'ASG_DEMO_010', profesionalId: 'MED002', pacienteId: 'SVP_0001', tipoAsignacion: 'equipo', fechaInicio: new Date('2024-01-01'), departamento: 'Medicina General', activo: true, notas: 'Médico de demostración' },
  
  // Enfermera Demo ENF001 (45678901D) - Enfermera de demostración
  // Ve los mismos pacientes que el médico MED001 (como equipo de enfermería)
  { id: 'ASG_DEMO_011', profesionalId: 'ENF001', pacienteId: 'IFV_0001', tipoAsignacion: 'equipo', fechaInicio: new Date('2024-01-01'), departamento: 'Enfermería', activo: true, notas: 'Enfermera de demostración - equipo de MED001' },
  { id: 'ASG_DEMO_012', profesionalId: 'ENF001', pacienteId: 'PIF_0010', tipoAsignacion: 'equipo', fechaInicio: new Date('2024-01-01'), departamento: 'Enfermería', activo: true, notas: 'Enfermera de demostración - equipo de MED001' },
  { id: 'ASG_DEMO_013', profesionalId: 'ENF001', pacienteId: 'MIF_0011', tipoAsignacion: 'equipo', fechaInicio: new Date('2024-01-01'), departamento: 'Enfermería', activo: true, notas: 'Enfermera de demostración - equipo de MED001' },
  { id: 'ASG_DEMO_014', profesionalId: 'ENF001', pacienteId: 'JML_0001', tipoAsignacion: 'equipo', fechaInicio: new Date('2024-01-01'), departamento: 'Enfermería', activo: true, notas: 'Enfermera de demostración - equipo de MED001' },
  { id: 'ASG_DEMO_015', profesionalId: 'ENF001', pacienteId: 'SVP_0001', tipoAsignacion: 'equipo', fechaInicio: new Date('2024-01-01'), departamento: 'Enfermería', activo: true, notas: 'Enfermera de demostración - equipo de MED001' },
  { id: 'ASG_DEMO_018', profesionalId: 'ENF001', pacienteId: 'JAV_0001', tipoAsignacion: 'equipo', fechaInicio: new Date('2024-01-01'), departamento: 'Enfermería', activo: true, notas: 'Enfermera de demostración - equipo de MED001' },
  { id: 'ASG_DEMO_019', profesionalId: 'ENF001', pacienteId: 'MRS_0001', tipoAsignacion: 'equipo', fechaInicio: new Date('2024-01-01'), departamento: 'Enfermería', activo: true, notas: 'Enfermera de demostración - equipo de MED001' },
  
  // Enfermera Demo ENF002 (67890123F) - También ve los mismos pacientes que MED001
  { id: 'ASG_DEMO_016', profesionalId: 'ENF002', pacienteId: 'JAV_0001', tipoAsignacion: 'equipo', fechaInicio: new Date('2024-01-01'), departamento: 'Enfermería', activo: true, notas: 'Enfermera de demostración - equipo de MED001' },
  { id: 'ASG_DEMO_017', profesionalId: 'ENF002', pacienteId: 'MRS_0001', tipoAsignacion: 'equipo', fechaInicio: new Date('2024-01-01'), departamento: 'Enfermería', activo: true, notas: 'Enfermera de demostración - equipo de MED001' },
  { id: 'ASG_DEMO_020', profesionalId: 'ENF002', pacienteId: 'IFV_0001', tipoAsignacion: 'equipo', fechaInicio: new Date('2024-01-01'), departamento: 'Enfermería', activo: true, notas: 'Enfermera de demostración - equipo de MED001' },
  { id: 'ASG_DEMO_021', profesionalId: 'ENF002', pacienteId: 'PIF_0010', tipoAsignacion: 'equipo', fechaInicio: new Date('2024-01-01'), departamento: 'Enfermería', activo: true, notas: 'Enfermera de demostración - equipo de MED001' },
  { id: 'ASG_DEMO_022', profesionalId: 'ENF002', pacienteId: 'MIF_0011', tipoAsignacion: 'equipo', fechaInicio: new Date('2024-01-01'), departamento: 'Enfermería', activo: true, notas: 'Enfermera de demostración - equipo de MED001' },
  { id: 'ASG_DEMO_023', profesionalId: 'ENF002', pacienteId: 'JML_0001', tipoAsignacion: 'equipo', fechaInicio: new Date('2024-01-01'), departamento: 'Enfermería', activo: true, notas: 'Enfermera de demostración - equipo de MED001' },
  { id: 'ASG_DEMO_024', profesionalId: 'ENF002', pacienteId: 'SVP_0001', tipoAsignacion: 'equipo', fechaInicio: new Date('2024-01-01'), departamento: 'Enfermería', activo: true, notas: 'Enfermera de demostración - equipo de MED001' }
];

// ============================================
// PERMISOS POR ÁREA CLÍNICA
// Define qué puede hacer cada rol en cada área
// ============================================
export const sqlPermisosAreaClinica: PermisoAreaClinica[] = [
  // Permisos de Admin (acceso total)
  { id: 'PERM001', rol: 'admin', areaClinica: 'todos', puedeVer: true, puedeEditar: true, puedeCrear: true, puedeEliminar: true, accesoDatosSensibles: true, descripcion: 'Acceso administrativo total' },
  
  // Permisos de Doctor (solo sus pacientes asignados)
  { id: 'PERM002', rol: 'doctor', areaClinica: 'pacientes_asignados', puedeVer: true, puedeEditar: true, puedeCrear: true, puedeEliminar: false, accesoDatosSensibles: true, descripcion: 'Acceso completo a pacientes asignados' },
  { id: 'PERM003', rol: 'doctor', areaClinica: 'ordenes_medicas', puedeVer: true, puedeEditar: true, puedeCrear: true, puedeEliminar: false, accesoDatosSensibles: true, descripcion: 'Gestión de órdenes médicas propias' },
  { id: 'PERM004', rol: 'doctor', areaClinica: 'evolucion_clinica', puedeVer: true, puedeEditar: true, puedeCrear: true, puedeEliminar: false, accesoDatosSensibles: true, descripcion: 'Evoluciones de pacientes asignados' },
  { id: 'PERM005', rol: 'doctor', areaClinica: 'altas', puedeVer: true, puedeEditar: true, puedeCrear: true, puedeEliminar: false, accesoDatosSensibles: true, descripcion: 'Gestión de altas' },
  
  // Permisos de Enfermera (pacientes de su unidad)
  { id: 'PERM006', rol: 'nurse', areaClinica: 'pacientes_unidad', puedeVer: true, puedeEditar: true, puedeCrear: false, puedeEliminar: false, accesoDatosSensibles: false, descripcion: 'Ver pacientes de su unidad' },
  { id: 'PERM007', rol: 'nurse', areaClinica: 'signos_vitales', puedeVer: true, puedeEditar: true, puedeCrear: true, puedeEliminar: false, accesoDatosSensibles: false, descripcion: 'Registro de signos vitales' },
  { id: 'PERM008', rol: 'nurse', areaClinica: 'notas_enfermeria', puedeVer: true, puedeEditar: true, puedeCrear: true, puedeEliminar: false, accesoDatosSensibles: false, descripcion: 'Notas de enfermería' },
  { id: 'PERM009', rol: 'nurse', areaClinica: 'administracion_medicamentos', puedeVer: true, puedeEditar: true, puedeCrear: true, puedeEliminar: false, accesoDatosSensibles: false, descripcion: 'Administración de medicamentos' },
  
  // Permisos de Limpieza (solo estado de camas)
  { id: 'PERM010', rol: 'cleaning', areaClinica: 'camas', puedeVer: true, puedeEditar: true, puedeCrear: false, puedeEliminar: false, accesoDatosSensibles: false, descripcion: 'Estado de limpieza de camas' },
  { id: 'PERM011', rol: 'cleaning', areaClinica: 'pacientes', puedeVer: false, puedeEditar: false, puedeCrear: false, puedeEliminar: false, accesoDatosSensibles: false, descripcion: 'Sin acceso a datos de pacientes' },
  
  
  // Permisos de Paciente (solo sus propios datos)
  { id: 'PERM017', rol: 'patient', areaClinica: 'datos_propios', puedeVer: true, puedeEditar: false, puedeCrear: false, puedeEliminar: false, accesoDatosSensibles: false, descripcion: 'Ver sus propios datos' },
  { id: 'PERM018', rol: 'patient', areaClinica: 'citas', puedeVer: true, puedeEditar: false, puedeCrear: true, puedeEliminar: false, accesoDatosSensibles: false, descripcion: 'Ver y solicitar citas' },
  
  // Permisos de Familia (datos limitados del familiar)
  { id: 'PERM019', rol: 'family', areaClinica: 'estado_paciente', puedeVer: true, puedeEditar: false, puedeCrear: false, puedeEliminar: false, accesoDatosSensibles: false, descripcion: 'Estado general del paciente' },
  { id: 'PERM020', rol: 'family', areaClinica: 'ubicacion', puedeVer: true, puedeEditar: false, puedeCrear: false, puedeEliminar: false, accesoDatosSensibles: false, descripcion: 'Ubicación en hospital' }
];

// ============================================
// EPISODIOS CLÍNICOS (diagnósticos por paciente)
// ============================================
export interface EpisodioClinico {
  id: string;
  pacienteId: string;
  fechaInicio: Date;
  fechaFin?: Date;
  motivoPrincipal: string;
  diagnosticoId?: string;
  activo: boolean;
}

export const sqlEpisodiosClinico: EpisodioClinico[] = [
  // Episodios clínicos reales según tabla EpisodioClinico en database_all.sql
  { id: 'CTS880_IFV', pacienteId: 'IFV_0001', fechaInicio: new Date('2014-01-02'), fechaFin: new Date('2014-07-07'), motivoPrincipal: 'Embarazo y parto gemelar', diagnosticoId: 'O30.0', activo: false },
  { id: 'ACR468_IFV', pacienteId: 'IFV_0001', fechaInicio: new Date('2014-01-02'), fechaFin: new Date('2014-07-07'), motivoPrincipal: 'Embarazo y parto gemelar', diagnosticoId: 'O30.0', activo: false },
  { id: 'TWD111_PIF', pacienteId: 'PIF_0010', fechaInicio: new Date('2014-07-03'), fechaFin: new Date('2014-07-07'), motivoPrincipal: 'Nacimiento', activo: false },
  { id: 'STW345_MIF', pacienteId: 'MIF_0011', fechaInicio: new Date('2014-07-03'), fechaFin: new Date('2014-07-07'), motivoPrincipal: 'Nacimiento', activo: false },
  { id: 'WHG123_JML_1', pacienteId: 'JML_0001', fechaInicio: new Date('2022-09-10'), fechaFin: new Date('2022-09-14'), motivoPrincipal: 'Accidente de tráfico con dolor en pierna derecha', activo: false },
  { id: 'WHG123_JML_2', pacienteId: 'JML_0001', fechaInicio: new Date('2022-09-10'), fechaFin: new Date('2022-09-14'), motivoPrincipal: 'Falta de aire y mareos', activo: false },
  { id: 'EPI001_SVP_1', pacienteId: 'SVP_0001', fechaInicio: new Date('2015-09-14'), fechaFin: new Date('2015-09-16'), motivoPrincipal: 'Dolor abdominal agudo', activo: false },
  { id: 'KOP233_MRS', pacienteId: 'MRS_0001', fechaInicio: new Date('2022-05-10'), fechaFin: new Date('2022-06-02'), motivoPrincipal: 'Fiebre, asfixia y expectoración', activo: false },
  { id: 'AEF497_JAV', pacienteId: 'JAV_0001', fechaInicio: new Date('2014-10-14'), fechaFin: new Date('2014-10-17'), motivoPrincipal: 'Constipado y asfixia', activo: false },
  { id: 'AEF498_JAV', pacienteId: 'JAV_0001', fechaInicio: new Date('2014-10-14'), fechaFin: new Date('2014-10-17'), motivoPrincipal: 'Fiebre, asfixia y expectoración', activo: false },
  { id: 'AEF502_JAV', pacienteId: 'JAV_0001', fechaInicio: new Date('2014-10-30'), fechaFin: new Date('2014-10-30'), motivoPrincipal: 'Seguimiento', activo: false },
  { id: 'AEF503_JAV', pacienteId: 'JAV_0001', fechaInicio: new Date('2014-11-10'), fechaFin: new Date('2014-11-10'), motivoPrincipal: 'Tos con expectoración e hilillos de sangre', activo: true },
];

// ============================================
// CATÁLOGO DE ALERGIAS
// ============================================
export interface Alergia {
  id: string;
  nombre: string;
  tipo: 'medicamento' | 'alimento' | 'ambiental' | 'otro';
  severidad?: 'leve' | 'moderada' | 'grave';
}

export const sqlAlergias: Alergia[] = [
  // Alergia real según tabla Alergia en hospital_master_tables.sql
  { id: '294976000', nombre: 'Cloranfenicol', tipo: 'medicamento', severidad: 'grave' },
];

// ============================================
// ASIGNACIÓN DE ALERGIAS A PACIENTES
// ============================================
export interface AsignacionAlergia {
  pacienteId: string;
  alergiaId: string;
  fechaDeteccion?: Date;
  notas?: string;
}

export const sqlAsignacionesAlergia: AsignacionAlergia[] = [
  // Alergias de pacientes reales del SQL (según tabla AsignacinAlergia en database_all.sql)
  // Javier Martinez Lopez (JML_0001) tiene alergia al Cloranfenicol (id: 294976000)
  { pacienteId: 'JML_0001', alergiaId: '294976000', notas: 'Alergia al Cloranfenicol' },
];

// ============================================
// CATÁLOGO DE DIAGNÓSTICOS
// ============================================
export interface Diagnostico {
  id: string;
  codigo: string;
  descripcion: string;
  categoria?: string;
}

export const sqlDiagnosticos: Diagnostico[] = [
  // Diagnóstico real según tabla Diagnostico en hospital_master_tables.sql
  { id: 'O30.0', codigo: 'O30.0', descripcion: 'Embarazo gemelar', categoria: 'Obstetricia' },
];

// Helper para obtener pacientes asignados a un profesional
export function getPacientesAsignadosPorProfesional(profesionalId: string): string[] {
  return sqlAsignacionesProfesionalPaciente
    .filter(a => a.profesionalId === profesionalId && a.activo)
    .map(a => a.pacienteId);
}

// Helper para verificar si un profesional tiene acceso a un paciente
export function profesionalTieneAccesoAPaciente(profesionalId: string, pacienteId: string): boolean {
  return sqlAsignacionesProfesionalPaciente.some(
    a => a.profesionalId === profesionalId && a.pacienteId === pacienteId && a.activo
  );
}

// Helper para obtener el tipo de asignación
export function getTipoAsignacion(profesionalId: string, pacienteId: string): string | null {
  const asignacion = sqlAsignacionesProfesionalPaciente.find(
    a => a.profesionalId === profesionalId && a.pacienteId === pacienteId && a.activo
  );
  return asignacion?.tipoAsignacion || null;
}

// ============================================
// DOCUMENTOS DE ENFERMERÍA (DocumentoEnfermeria)
// Mapeado desde database_all.sql
// ============================================
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

export const sqlNursingDocuments: NursingDocument[] = [
  // ========================================
  // Isabel Flores Viñales (IFV_0001) - Episodio CTS880
  // Seguimiento de embarazo
  // ========================================
  { 
    id: "ENF532", 
    episodeId: "CTS880", 
    patientId: "IFV_0001", 
    professionalId: "43234", 
    professionalName: "Montserrat Valls Blanco",
    dateTime: new Date("2014-03-27 10:00:00"), 
    documentType: "Progress", 
    text: "Pregnancy follow-up" 
  },
  { 
    id: "ENF987", 
    episodeId: "CTS880", 
    patientId: "IFV_0001", 
    professionalId: "43234", 
    professionalName: "Montserrat Valls Blanco",
    dateTime: new Date("2014-05-07 13:00:00"), 
    documentType: "Progress", 
    text: "Gestational diabetes" 
  },
  // ========================================
  // Isabel Flores Viñales (IFV_0001) - Episodio ACR468
  // Postparto
  // ========================================
  { 
    id: "ENF123", 
    episodeId: "ACR468", 
    patientId: "IFV_0001", 
    professionalId: "43234", 
    professionalName: "Montserrat Valls Blanco",
    dateTime: new Date("2014-07-07 10:00:00"), 
    documentType: "High education", 
    text: "Postpartum recommendations" 
  },
  // ========================================
  // Javier Martinez Lopez (JML_0001) - Episodio WHG123
  // Fractura de tibia
  // ========================================
  { 
    id: "ENF789", 
    episodeId: "WHG123", 
    patientId: "JML_0001", 
    professionalId: "12345", 
    professionalName: "Dra. Laura Martinez",
    dateTime: new Date("2022-09-11 19:00:00"), 
    documentType: "Recommendation", 
    text: "Patient instructed on cast care, avoiding weight-bearing, and warning signs." 
  },
  // ========================================
  // Samuel Vallbé Picornell (SVP_0001) - Episodio EPI001
  // Apendicectomía
  // ========================================
  { 
    id: "ENF333", 
    episodeId: "EPI001", 
    patientId: "SVP_0001", 
    professionalId: "18376", 
    professionalName: "Lucía Cabañes Mata",
    dateTime: new Date("2015-09-14 20:30:00"), 
    documentType: "Initial assessment", 
    text: "Patient with acute abdominal pain, abdominal guarding, signs of peritonitis. Ringer-lactate 500ml/8h infusion started." 
  },
  { 
    id: "ENF370", 
    episodeId: "EPI001", 
    patientId: "SVP_0001", 
    professionalId: "25437", 
    professionalName: "Juana Lavilla Royo",
    dateTime: new Date("2014-09-14 22:00:00"), 
    documentType: "Progress", 
    text: "Patient with good post-operative progress. Spontaneous urination. No vomiting." 
  },
  { 
    id: "ENF455", 
    episodeId: "EPI001", 
    patientId: "SVP_0001", 
    professionalId: "61765", 
    professionalName: "Personal de Enfermería",
    dateTime: new Date("2015-09-15 09:00:00"), 
    documentType: "Progress", 
    text: "Surgical wound check. Good progress. Nasogastric tube removed. Started liquid diet." 
  },
  { 
    id: "ENF498", 
    episodeId: "EPI001", 
    patientId: "SVP_0001", 
    professionalId: "43256", 
    professionalName: "Personal de Enfermería",
    dateTime: new Date("2015-09-15 18:00:00"), 
    documentType: "Progress", 
    text: "Patient reports general discomfort, body pain, and dizziness. Experiencing chills." 
  },
  { 
    id: "ENF5029", 
    episodeId: "EPI001", 
    patientId: "SVP_0001", 
    professionalId: "25437", 
    professionalName: "Juana Lavilla Royo",
    dateTime: new Date("2015-09-16 08:00:00"), 
    documentType: "Progress", 
    text: "Patient improved. Has rested since 1 a.m. Good tolerance to treatment." 
  },
  // ========================================
  // María Rodríguez Sánchez (MRS_0001) - Episodio KOP233
  // Neumonía
  // ========================================
  { 
    id: "ENF323", 
    episodeId: "KOP233", 
    patientId: "MRS_0001", 
    professionalId: "30123", 
    professionalName: "Miguel Serrano",
    dateTime: new Date("2022-05-11 00:00:00"), 
    documentType: "Progress", 
    text: "María shows improvement in oxygen saturation. Less persistent cough. Antibiotic regimen maintained." 
  },
  { 
    id: "ENF890", 
    episodeId: "KOP233", 
    patientId: "MRS_0001", 
    professionalId: "30123", 
    professionalName: "Miguel Serrano",
    dateTime: new Date("2022-05-12 00:00:00"), 
    documentType: "Progress", 
    text: "Continued improvement in oxygen saturation. Fever resolved. Creatinine levels decreased." 
  },
  { 
    id: "ENF444", 
    episodeId: "KOP233", 
    patientId: "MRS_0001", 
    professionalId: "30123", 
    professionalName: "Miguel Serrano",
    dateTime: new Date("2022-05-13 00:00:00"), 
    documentType: "Progress", 
    text: "María shows marked improvement. Oxygen saturation within normal range. No fever. Creatinine at normal values." 
  },
  // ========================================
  // Juan Agudells Vilaseca (JAV_0001) - Episodio AEF498
  // EPOC
  // ========================================
  { 
    id: "ENF201", 
    episodeId: "AEF498", 
    patientId: "JAV_0001", 
    professionalId: "6234", 
    professionalName: "Nuria Bòria Vila",
    dateTime: new Date("2014-10-14 19:45:00"), 
    documentType: "Hospital Admission Note", 
    text: "Reason for consultation, vital signs taken." 
  },
  { 
    id: "ENF202", 
    episodeId: "AEF498", 
    patientId: "JAV_0001", 
    professionalId: "8512", 
    professionalName: "Isabel Centelles Monfort",
    dateTime: new Date("2014-10-15 12:30:00"), 
    documentType: "Progress", 
    text: "Patient more alert and expectorates less." 
  },
  { 
    id: "ENF203", 
    episodeId: "AEF498", 
    patientId: "JAV_0001", 
    professionalId: "8512", 
    professionalName: "Isabel Centelles Monfort",
    dateTime: new Date("2014-10-16 11:30:00"), 
    documentType: "Progress", 
    text: "Patient improved with good tolerance to oral food intake." 
  },
];

// Helper para obtener documentos de enfermería por paciente
export function getNursingDocumentsByPatient(patientId: string): NursingDocument[] {
  return sqlNursingDocuments.filter(d => d.patientId === patientId);
}

// Helper para obtener documentos de enfermería por episodio
export function getNursingDocumentsByEpisode(episodeId: string): NursingDocument[] {
  return sqlNursingDocuments.filter(d => d.episodeId === episodeId);
}

// Helper para obtener episodios clínicos (diagnósticos) de un paciente
export function getEpisodiosPorPaciente(pacienteId: string): EpisodioClinico[] {
  return sqlEpisodiosClinico.filter(e => e.pacienteId === pacienteId);
}

// Helper para obtener el diagnóstico activo de un paciente
export function getDiagnosticoActivoPaciente(pacienteId: string): string | null {
  const episodioActivo = sqlEpisodiosClinico.find(e => e.pacienteId === pacienteId && e.activo);
  return episodioActivo?.motivoPrincipal || null;
}

// Helper para obtener alergias de un paciente
export function getAlergiasPorPaciente(pacienteId: string): Alergia[] {
  const asignaciones = sqlAsignacionesAlergia.filter(a => a.pacienteId === pacienteId);
  return asignaciones.map(asig => sqlAlergias.find(al => al.id === asig.alergiaId)).filter(Boolean) as Alergia[];
}

// Helper para obtener detalles de asignación de alergias
export function getDetalleAlergiasPaciente(pacienteId: string): (AsignacionAlergia & { alergia: Alergia })[] {
  return sqlAsignacionesAlergia
    .filter(a => a.pacienteId === pacienteId)
    .map(asig => {
      const alergia = sqlAlergias.find(al => al.id === asig.alergiaId);
      if (!alergia) return null;
      return { ...asig, alergia };
    })
    .filter(Boolean) as (AsignacionAlergia & { alergia: Alergia })[];
}

// ============================================
// ALTAS HOSPITALARIAS (Discharge)
// Mapeado desde database_all.sql - Tabla 22
// ============================================
export interface Discharge {
  id: string;
  episodeId: string;
  patientId: string;
  dateTimeDischarge: Date;
  reasonDischarge: string;
  destinyDischarge: string;
  diagnosticCode: string | null;
  clinicalSummary: string | null;
  treatmentDischarge: string;
}

// Mapeo de episodios a pacientes:
// ACR468 -> IFV_0001 (Isabel Flores Viñales)
// WHG123 -> JML_0001 (Javier Martinez Lopez)
// EPI001 -> SVP_0001 (Samuel Vallbé Picornell)
// AEF498 -> JAV_0001 (Juan Agudells Vilaseca)
// KOP233 -> MRS_0001 (María Rodríguez Sánchez)

export const sqlDischarges: Discharge[] = [
  {
    id: "ALT123",
    episodeId: "ACR468",
    patientId: "IFV_0001",
    dateTimeDischarge: new Date("2014-07-07 11:00:00"),
    reasonDischarge: "Delivery completed",
    destinyDischarge: "Home",
    diagnosticCode: "Z38.3",
    clinicalSummary: "Multiple uncomplicated vaginal delivery",
    treatmentDischarge: "Follow-up in 15 days"
  },
  {
    id: "ALT456",
    episodeId: "WHG123",
    patientId: "JML_0001",
    dateTimeDischarge: new Date("2022-09-14 11:00:00"),
    reasonDischarge: "Improvement",
    destinyDischarge: "Home",
    diagnosticCode: "S82.21",
    clinicalSummary: "Tibia fracture treated with cast",
    treatmentDischarge: "Follow-up progress"
  },
  {
    id: "ALT456_2",
    episodeId: "WHG123",
    patientId: "JML_0001",
    dateTimeDischarge: new Date("2022-09-14 11:00:00"),
    reasonDischarge: "Improvement",
    destinyDischarge: "Home",
    diagnosticCode: "D64.9",
    clinicalSummary: "Anemia under follow-up",
    treatmentDischarge: "Follow-up progress"
  },
  {
    id: "ALT477",
    episodeId: "EPI001",
    patientId: "SVP_0001",
    dateTimeDischarge: new Date("2015-09-16 12:00:00"),
    reasonDischarge: "Clinical improvement",
    destinyDischarge: "Home",
    diagnosticCode: "DX001",
    clinicalSummary: "Acute appendicitis operated, favorable progress",
    treatmentDischarge: "Post-surgical follow-up"
  },
  {
    id: "ALT439",
    episodeId: "AEF498",
    patientId: "JAV_0001",
    dateTimeDischarge: new Date("2014-10-17 17:30:00"),
    reasonDischarge: "Improvement",
    destinyDischarge: "Home",
    diagnosticCode: "J13",
    clinicalSummary: "Maintenance of treatment and home discharge",
    treatmentDischarge: "1-month follow-up"
  },
  {
    id: "ALT727",
    episodeId: "KOP233",
    patientId: "MRS_0001",
    dateTimeDischarge: new Date("2022-06-02 17:14:00"),
    reasonDischarge: "Pneumonia resolved",
    destinyDischarge: "Home",
    diagnosticCode: null,
    clinicalSummary: null,
    treatmentDischarge: "Follow-up 06/15/2022"
  }
];

// ============================================
// INSTRUCCIONES AL PACIENTE (PatientInstructions)
// Mapeado desde database_all.sql - Tabla 23
// ============================================
export interface PatientInstruction {
  id: string;
  dischargeId: string;
  textInstructions: string;
}

export const sqlPatientInstructions: PatientInstruction[] = [
  // Instrucciones para ALT123 (Isabel Flores - Parto)
  { id: "INS123_1", dischargeId: "ALT123", textInstructions: "Postpartum hygiene + breastfeeding + warning signs" },
  
  // Instrucciones para ALT456 (Javier Martinez - Fractura tibia)
  { id: "INS456_1", dischargeId: "ALT456", textInstructions: "Avoid weight-bearing on the right leg" },
  { id: "INS456_2", dischargeId: "ALT456", textInstructions: "Keep the limb elevated" },
  { id: "INS456_3", dischargeId: "ALT456", textInstructions: "Care for the cast as instructed" },
  { id: "INS456_4", dischargeId: "ALT456", textInstructions: "Seek care if fever or severe pain occurs" },
  
  // Instrucciones para ALT477 (Samuel Vallbé - Apendicectomía)
  { id: "INS477_1", dischargeId: "ALT477", textInstructions: "Post-surgical check-up, progressive diet" },
  { id: "INS477_2", dischargeId: "ALT477", textInstructions: "Check surgical wound in outpatient consultation" },
  { id: "INS477_3", dischargeId: "ALT477", textInstructions: "Avoid physical exertion for 2 weeks" },
  { id: "INS477_4", dischargeId: "ALT477", textInstructions: "Go to emergency if fever > 38ºC or severe abdominal pain" },
  
  // Instrucciones para ALT439 (Juan Agudells - Neumonía/EPOC)
  { id: "INS439_1", dischargeId: "ALT439", textInstructions: "Echocardiography" },
  { id: "INS439_2", dischargeId: "ALT439", textInstructions: "Follow-up plan with primary care physician (Dr. Garcés)" },
  
  // Instrucciones para ALT727 (María Rodríguez - Neumonía)
  { id: "INS727_1", dischargeId: "ALT727", textInstructions: "Visit Dr. Alberto Pérez" }
];

// Helper para obtener altas por paciente
export function getDischargesByPatient(patientId: string): Discharge[] {
  return sqlDischarges.filter(d => d.patientId === patientId);
}

// Helper para obtener altas por episodio
export function getDischargesByEpisode(episodeId: string): Discharge[] {
  return sqlDischarges.filter(d => d.episodeId === episodeId);
}

// Helper para obtener instrucciones por alta
export function getInstructionsByDischarge(dischargeId: string): PatientInstruction[] {
  return sqlPatientInstructions.filter(i => i.dischargeId === dischargeId);
}

// Helper para obtener alta completa con instrucciones
export function getDischargeWithInstructions(dischargeId: string): (Discharge & { instructions: PatientInstruction[] }) | null {
  const discharge = sqlDischarges.find(d => d.id === dischargeId);
  if (!discharge) return null;
  
  return {
    ...discharge,
    instructions: getInstructionsByDischarge(dischargeId)
  };
}

// ============================================
// PARÁMETROS DE SIGNOS VITALES
// Mapeado desde database_all.sql
// ============================================
export interface VitalSignParameter {
  id: string;
  name: string;
  unit: string;
  category: 'vital' | 'lab' | 'blood';
}

export const sqlVitalSignParameters: VitalSignParameter[] = [
  // Signos Vitales Básicos
  { id: '1', name: 'Peso', unit: 'kg', category: 'vital' },
  { id: '2', name: 'Presión Sistólica', unit: 'mmHg', category: 'vital' },
  { id: '3', name: 'Presión Diastólica', unit: 'mmHg', category: 'vital' },
  { id: '4', name: 'Glucemia', unit: 'mg/dL', category: 'lab' },
  { id: '17', name: 'Temperatura', unit: '°C', category: 'vital' },
  { id: '18', name: 'Temperatura Rectal', unit: '°C', category: 'vital' },
  { id: '19', name: 'Frecuencia Cardíaca', unit: 'lpm', category: 'vital' },
  { id: '20', name: 'Frecuencia Respiratoria', unit: 'rpm', category: 'vital' },
  { id: '21', name: 'Saturación O2', unit: '%', category: 'vital' },
  { id: '22', name: 'SpO2', unit: '%', category: 'vital' },
  { id: '23', name: 'Presión Arterial', unit: 'mmHg', category: 'vital' },
  { id: '24', name: 'Saturación Oxígeno', unit: '%', category: 'vital' },
  
  // Análisis de Sangre / Laboratorio
  { id: '10', name: 'Creatinina', unit: 'mg/dL', category: 'lab' },
  { id: '11', name: 'Sodio', unit: 'mEq/L', category: 'lab' },
  { id: '12', name: 'Potasio', unit: 'mEq/L', category: 'lab' },
  { id: '13', name: 'Hemoglobina', unit: 'g/dL', category: 'blood' },
  { id: '14', name: 'Hematocrito', unit: '%', category: 'blood' },
  { id: '15', name: 'VCM', unit: 'fL', category: 'blood' },
  { id: '16', name: 'Plaquetas', unit: '/µL', category: 'blood' },
  { id: '30', name: 'Eritrocitos', unit: '/µL', category: 'blood' },
  { id: '31', name: 'Leucocitos', unit: '/µL', category: 'blood' },
  { id: '32', name: 'Segmentados', unit: '%', category: 'blood' },
  { id: '33', name: 'Cayados', unit: '%', category: 'blood' },
  { id: '34', name: 'Linfocitos', unit: '%', category: 'blood' },
  { id: '35', name: 'Monocitos', unit: '%', category: 'blood' },
  { id: '36', name: 'Eosinófilos', unit: '%', category: 'blood' }
];

// ============================================
// DETALLE DE SIGNOS VITALES
// Mapeado desde database_all.sql - Tabla 16
// ============================================
export interface DetailVitalSign {
  registerId: string;
  parameterId: string;
  value: string;
  patientId: string;
  timestamp?: Date;
}

export const sqlDetailVitalSigns: DetailVitalSign[] = [
  // Isabel Flores Viñales (IFV_0001) - Embarazo
  { registerId: 'SV_IFV_0001_20140318_1500', parameterId: '4', value: '102', patientId: 'IFV_0001', timestamp: new Date('2014-03-18 15:00:00') },
  { registerId: 'SV_IFV_0001_20140318_1500', parameterId: '10', value: '1.5', patientId: 'IFV_0001', timestamp: new Date('2014-03-18 15:00:00') },
  { registerId: 'SV_IFV_0001_20140318_1500', parameterId: '13', value: '10.5', patientId: 'IFV_0001', timestamp: new Date('2014-03-18 15:00:00') },
  { registerId: 'SV_IFV_0001_20140318_1500', parameterId: '11', value: '141', patientId: 'IFV_0001', timestamp: new Date('2014-03-18 15:00:00') },
  { registerId: 'SV_IFV_0001_20140318_1500', parameterId: '12', value: '4.2', patientId: 'IFV_0001', timestamp: new Date('2014-03-18 15:00:00') },
  { registerId: 'SV_IFV_0001_20140320_1000', parameterId: '1', value: '58', patientId: 'IFV_0001', timestamp: new Date('2014-03-20 10:00:00') },
  { registerId: 'SV_IFV_0001_20140320_1000', parameterId: '2', value: '143', patientId: 'IFV_0001', timestamp: new Date('2014-03-20 10:00:00') },
  { registerId: 'SV_IFV_0001_20140320_1000', parameterId: '3', value: '73', patientId: 'IFV_0001', timestamp: new Date('2014-03-20 10:00:00') },
  { registerId: 'SV_IFV_0001_20140327_1000', parameterId: '2', value: '132', patientId: 'IFV_0001', timestamp: new Date('2014-03-27 10:00:00') },
  { registerId: 'SV_IFV_0001_20140327_1000', parameterId: '3', value: '65', patientId: 'IFV_0001', timestamp: new Date('2014-03-27 10:00:00') },
  { registerId: 'SV_IFV_0001_20140424_1100', parameterId: '4', value: '123', patientId: 'IFV_0001', timestamp: new Date('2014-04-24 11:00:00') },
  { registerId: 'SV_IFV_0001_20140424_1100', parameterId: '10', value: '1.4', patientId: 'IFV_0001', timestamp: new Date('2014-04-24 11:00:00') },
  { registerId: 'SV_IFV_0001_20140424_1100', parameterId: '13', value: '11.8', patientId: 'IFV_0001', timestamp: new Date('2014-04-24 11:00:00') },
  { registerId: 'SV_IFV_0001_20140424_1100', parameterId: '11', value: '143', patientId: 'IFV_0001', timestamp: new Date('2014-04-24 11:00:00') },
  { registerId: 'SV_IFV_0001_20140424_1100', parameterId: '12', value: '4.1', patientId: 'IFV_0001', timestamp: new Date('2014-04-24 11:00:00') },
  { registerId: 'SV_IFV_0001_20140530_1000', parameterId: '2', value: '138', patientId: 'IFV_0001', timestamp: new Date('2014-05-30 10:00:00') },
  { registerId: 'SV_IFV_0001_20140530_1000', parameterId: '3', value: '69', patientId: 'IFV_0001', timestamp: new Date('2014-05-30 10:00:00') },
  { registerId: 'SV_IFV_0001_20140530_1000', parameterId: '1', value: '64.5', patientId: 'IFV_0001', timestamp: new Date('2014-05-30 10:00:00') },
  { registerId: 'SV_IFV_0001_20140530_1000', parameterId: '4', value: '117', patientId: 'IFV_0001', timestamp: new Date('2014-05-30 10:00:00') },
  { registerId: 'SV_IFV_0001_20140617_1000', parameterId: '2', value: '128', patientId: 'IFV_0001', timestamp: new Date('2014-06-17 10:00:00') },
  { registerId: 'SV_IFV_0001_20140617_1000', parameterId: '3', value: '64', patientId: 'IFV_0001', timestamp: new Date('2014-06-17 10:00:00') },
  { registerId: 'SV_IFV_0001_20140617_1000', parameterId: '1', value: '66', patientId: 'IFV_0001', timestamp: new Date('2014-06-17 10:00:00') },
  { registerId: 'SV_IFV_0001_20140617_1000', parameterId: '4', value: '112', patientId: 'IFV_0001', timestamp: new Date('2014-06-17 10:00:00') },
  { registerId: 'SV_IFV_0001_20140703_0432', parameterId: '2', value: '150', patientId: 'IFV_0001', timestamp: new Date('2014-07-03 04:32:00') },
  { registerId: 'SV_IFV_0001_20140703_0432', parameterId: '3', value: '90', patientId: 'IFV_0001', timestamp: new Date('2014-07-03 04:32:00') },
  { registerId: 'SV_IFV_0001_20140703_0432', parameterId: '1', value: '68', patientId: 'IFV_0001', timestamp: new Date('2014-07-03 04:32:00') },
  { registerId: 'SV_PIF_0010_20140703_0815', parameterId: '1', value: '2.85', patientId: 'PIF_0010', timestamp: new Date('2014-07-03 08:15:00') },
  { registerId: 'SV_MIF_0011_20140703_0821', parameterId: '1', value: '2.63', patientId: 'MIF_0011', timestamp: new Date('2014-07-03 08:21:00') },
  
  // Javier Martinez Lopez (JML_0001) - Accidente tráfico
  { registerId: 'SV_JML_20220910_1900', parameterId: '13', value: '45878', patientId: 'JML_0001', timestamp: new Date('2022-09-10 19:00:00') },
  { registerId: 'SV_JML_20220910_1900', parameterId: '14', value: '30', patientId: 'JML_0001', timestamp: new Date('2022-09-10 19:00:00') },
  { registerId: 'SV_JML_20220910_1900', parameterId: '15', value: '45691', patientId: 'JML_0001', timestamp: new Date('2022-09-10 19:00:00') },
  { registerId: 'SV_JML_20220910_1900', parameterId: '16', value: '220000', patientId: 'JML_0001', timestamp: new Date('2022-09-10 19:00:00') },
  
  // Samuel Vallbé Picornell (SVP_0001) - Apendicitis
  { registerId: 'SV_SVP_0001_20150914_1431', parameterId: '17', value: '38.3', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 14:31:00') },
  { registerId: 'SV_SVP_0001_20150914_1431', parameterId: '2', value: '87', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 14:31:00') },
  { registerId: 'SV_SVP_0001_20150914_1431', parameterId: '3', value: '20', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 14:31:00') },
  { registerId: 'SV_SVP_0001_20150914_1431', parameterId: '19', value: '118', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 14:31:00') },
  { registerId: 'SV_SVP_0001_20150914_1431', parameterId: '20', value: '64', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 14:31:00') },
  { registerId: 'SV_SVP_0001_20150914_1500', parameterId: '17', value: '38.3', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 15:00:00') },
  { registerId: 'SV_SVP_0001_20150914_1500', parameterId: '18', value: '39.5', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 15:00:00') },
  { registerId: 'SV_SVP_0001_20150914_1500', parameterId: '2', value: '90', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 15:00:00') },
  { registerId: 'SV_SVP_0001_20150914_1500', parameterId: '3', value: '23', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 15:00:00') },
  { registerId: 'SV_SVP_0001_20150914_1500', parameterId: '19', value: '134', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 15:00:00') },
  { registerId: 'SV_SVP_0001_20150914_1500', parameterId: '20', value: '87', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 15:00:00') },
  { registerId: 'SV_SVP_0001_20150914_1530', parameterId: '17', value: '38.9', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 15:30:00') },
  { registerId: 'SV_SVP_0001_20150914_1530', parameterId: '2', value: '85', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 15:30:00') },
  { registerId: 'SV_SVP_0001_20150914_1530', parameterId: '3', value: '22', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 15:30:00') },
  { registerId: 'SV_SVP_0001_20150914_1530', parameterId: '19', value: '128', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 15:30:00') },
  { registerId: 'SV_SVP_0001_20150914_1530', parameterId: '20', value: '88', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 15:30:00') },
  { registerId: 'SV_SVP_0001_20150914_1600', parameterId: '17', value: '39.2', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 16:00:00') },
  { registerId: 'SV_SVP_0001_20150914_1600', parameterId: '2', value: '95', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 16:00:00') },
  { registerId: 'SV_SVP_0001_20150914_1600', parameterId: '3', value: '25', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 16:00:00') },
  { registerId: 'SV_SVP_0001_20150914_1600', parameterId: '19', value: '145', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 16:00:00') },
  { registerId: 'SV_SVP_0001_20150914_1600', parameterId: '20', value: '87', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 16:00:00') },
  { registerId: 'SV_SVP_0001_20150914_1835', parameterId: '17', value: '39.5', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 18:35:00') },
  { registerId: 'SV_SVP_0001_20150914_1835', parameterId: '2', value: '90', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 18:35:00') },
  { registerId: 'SV_SVP_0001_20150914_1835', parameterId: '3', value: '29', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 18:35:00') },
  { registerId: 'SV_SVP_0001_20150914_1835', parameterId: '19', value: '150', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 18:35:00') },
  { registerId: 'SV_SVP_0001_20150914_1835', parameterId: '20', value: '90', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 18:35:00') },
  { registerId: 'SV_SVP_0001_20150914_1835', parameterId: '21', value: '89', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 18:35:00') },
  { registerId: 'SV_SVP_0001_20150914_1900', parameterId: '17', value: '38.7', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 19:00:00') },
  { registerId: 'SV_SVP_0001_20150914_1900', parameterId: '2', value: '86', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 19:00:00') },
  { registerId: 'SV_SVP_0001_20150914_1900', parameterId: '3', value: '25', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 19:00:00') },
  { registerId: 'SV_SVP_0001_20150914_1900', parameterId: '19', value: '144', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 19:00:00') },
  { registerId: 'SV_SVP_0001_20150914_1900', parameterId: '20', value: '83', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 19:00:00') },
  { registerId: 'SV_SVP_0001_20150914_1900', parameterId: '21', value: '92', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 19:00:00') },
  { registerId: 'SV_SVP_0001_20150914_1915', parameterId: '17', value: '37.4', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 19:15:00') },
  { registerId: 'SV_SVP_0001_20150914_1915', parameterId: '2', value: '73', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 19:15:00') },
  { registerId: 'SV_SVP_0001_20150914_1915', parameterId: '3', value: '20', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 19:15:00') },
  { registerId: 'SV_SVP_0001_20150914_1915', parameterId: '19', value: '131', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 19:15:00') },
  { registerId: 'SV_SVP_0001_20150914_1915', parameterId: '20', value: '80', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 19:15:00') },
  { registerId: 'SV_SVP_0001_20150914_1915', parameterId: '21', value: '96', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 19:15:00') },
  { registerId: 'SV_SVP_0001_20150914_1930', parameterId: '17', value: '36.6', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 19:30:00') },
  { registerId: 'SV_SVP_0001_20150914_1930', parameterId: '2', value: '71', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 19:30:00') },
  { registerId: 'SV_SVP_0001_20150914_1930', parameterId: '3', value: '18', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 19:30:00') },
  { registerId: 'SV_SVP_0001_20150914_1930', parameterId: '19', value: '129', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 19:30:00') },
  { registerId: 'SV_SVP_0001_20150914_1930', parameterId: '20', value: '77', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 19:30:00') },
  { registerId: 'SV_SVP_0001_20150914_1930', parameterId: '21', value: '98', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 19:30:00') },
  { registerId: 'SV_SVP_0001_20150914_1945', parameterId: '17', value: '36.9', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 19:45:00') },
  { registerId: 'SV_SVP_0001_20150914_1945', parameterId: '2', value: '72', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 19:45:00') },
  { registerId: 'SV_SVP_0001_20150914_1945', parameterId: '3', value: '20', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 19:45:00') },
  { registerId: 'SV_SVP_0001_20150914_1945', parameterId: '19', value: '125', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 19:45:00') },
  { registerId: 'SV_SVP_0001_20150914_1945', parameterId: '20', value: '70', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 19:45:00') },
  { registerId: 'SV_SVP_0001_20150914_1945', parameterId: '21', value: '98', patientId: 'SVP_0001', timestamp: new Date('2015-09-14 19:45:00') },
  { registerId: 'SV_SVP_0001_20150915_1500', parameterId: '17', value: '39.0', patientId: 'SVP_0001', timestamp: new Date('2015-09-15 15:00:00') },
  { registerId: 'SV_SVP_0001_20150915_1500', parameterId: '2', value: '92', patientId: 'SVP_0001', timestamp: new Date('2015-09-15 15:00:00') },
  { registerId: 'SV_SVP_0001_20150915_1500', parameterId: '3', value: '22', patientId: 'SVP_0001', timestamp: new Date('2015-09-15 15:00:00') },
  { registerId: 'SV_SVP_0001_20150915_1500', parameterId: '19', value: '112', patientId: 'SVP_0001', timestamp: new Date('2015-09-15 15:00:00') },
  { registerId: 'SV_SVP_0001_20150915_1500', parameterId: '20', value: '66', patientId: 'SVP_0001', timestamp: new Date('2015-09-15 15:00:00') },
  { registerId: 'SV_SVP_0001_20150916_0100', parameterId: '17', value: '37.2', patientId: 'SVP_0001', timestamp: new Date('2015-09-16 01:00:00') },
  { registerId: 'SV_SVP_0001_20150916_0100', parameterId: '2', value: '76', patientId: 'SVP_0001', timestamp: new Date('2015-09-16 01:00:00') },
  { registerId: 'SV_SVP_0001_20150916_0100', parameterId: '3', value: '14', patientId: 'SVP_0001', timestamp: new Date('2015-09-16 01:00:00') },
  { registerId: 'SV_SVP_0001_20150916_0100', parameterId: '19', value: '128', patientId: 'SVP_0001', timestamp: new Date('2015-09-16 01:00:00') },
  { registerId: 'SV_SVP_0001_20150916_0100', parameterId: '20', value: '79', patientId: 'SVP_0001', timestamp: new Date('2015-09-16 01:00:00') },
  
  // María Rodríguez Sánchez (MRS_0001) - Neumonía UCI
  { registerId: 'SV_MRS_0001_20220510_1000', parameterId: '22', value: '88', patientId: 'MRS_0001', timestamp: new Date('2022-05-10 10:00:00') },
  { registerId: 'SV_MRS_0001_20220510_1000', parameterId: '2', value: '140', patientId: 'MRS_0001', timestamp: new Date('2022-05-10 10:00:00') },
  { registerId: 'SV_MRS_0001_20220510_1000', parameterId: '3', value: '90', patientId: 'MRS_0001', timestamp: new Date('2022-05-10 10:00:00') },
  { registerId: 'SV_MRS_0001_20220510_1000', parameterId: '19', value: '110', patientId: 'MRS_0001', timestamp: new Date('2022-05-10 10:00:00') },
  { registerId: 'SV_MRS_0001_20220510_1000', parameterId: '10', value: '68', patientId: 'MRS_0001', timestamp: new Date('2022-05-10 10:00:00') },
  { registerId: 'SV_MRS_0001_20220510_1000', parameterId: '11', value: '138', patientId: 'MRS_0001', timestamp: new Date('2022-05-10 10:00:00') },
  { registerId: 'SV_MRS_0001_20220510_1000', parameterId: '12', value: '3.8', patientId: 'MRS_0001', timestamp: new Date('2022-05-10 10:00:00') },
  { registerId: 'SV_MRS_0001_20220510_1000', parameterId: '13', value: '12.5', patientId: 'MRS_0001', timestamp: new Date('2022-05-10 10:00:00') },
  { registerId: 'SV_MRS_0001_20220511_1000', parameterId: '22', value: '92', patientId: 'MRS_0001', timestamp: new Date('2022-05-11 10:00:00') },
  { registerId: 'SV_MRS_0001_20220511_1000', parameterId: '2', value: '130', patientId: 'MRS_0001', timestamp: new Date('2022-05-11 10:00:00') },
  { registerId: 'SV_MRS_0001_20220511_1000', parameterId: '3', value: '85', patientId: 'MRS_0001', timestamp: new Date('2022-05-11 10:00:00') },
  { registerId: 'SV_MRS_0001_20220511_1000', parameterId: '19', value: '100', patientId: 'MRS_0001', timestamp: new Date('2022-05-11 10:00:00') },
  { registerId: 'SV_MRS_0001_20220511_1000', parameterId: '10', value: '1.2', patientId: 'MRS_0001', timestamp: new Date('2022-05-11 10:00:00') },
  { registerId: 'SV_MRS_0001_20220511_1000', parameterId: '11', value: '140', patientId: 'MRS_0001', timestamp: new Date('2022-05-11 10:00:00') },
  { registerId: 'SV_MRS_0001_20220511_1000', parameterId: '12', value: '3.9', patientId: 'MRS_0001', timestamp: new Date('2022-05-11 10:00:00') },
  { registerId: 'SV_MRS_0001_20220511_1000', parameterId: '13', value: '12.4', patientId: 'MRS_0001', timestamp: new Date('2022-05-11 10:00:00') },
  { registerId: 'SV_MRS_0001_20220512_1000', parameterId: '22', value: '94', patientId: 'MRS_0001', timestamp: new Date('2022-05-12 10:00:00') },
  { registerId: 'SV_MRS_0001_20220512_1000', parameterId: '2', value: '135', patientId: 'MRS_0001', timestamp: new Date('2022-05-12 10:00:00') },
  { registerId: 'SV_MRS_0001_20220512_1000', parameterId: '3', value: '88', patientId: 'MRS_0001', timestamp: new Date('2022-05-12 10:00:00') },
  { registerId: 'SV_MRS_0001_20220512_1000', parameterId: '19', value: '95', patientId: 'MRS_0001', timestamp: new Date('2022-05-12 10:00:00') },
  { registerId: 'SV_MRS_0001_20220512_1000', parameterId: '10', value: '1.1', patientId: 'MRS_0001', timestamp: new Date('2022-05-12 10:00:00') },
  { registerId: 'SV_MRS_0001_20220512_1000', parameterId: '11', value: '142', patientId: 'MRS_0001', timestamp: new Date('2022-05-12 10:00:00') },
  { registerId: 'SV_MRS_0001_20220512_1000', parameterId: '12', value: '4.0', patientId: 'MRS_0001', timestamp: new Date('2022-05-12 10:00:00') },
  { registerId: 'SV_MRS_0001_20220512_1000', parameterId: '13', value: '12.3', patientId: 'MRS_0001', timestamp: new Date('2022-05-12 10:00:00') },
  { registerId: 'SV_MRS_0001_20220513_1000', parameterId: '22', value: '96', patientId: 'MRS_0001', timestamp: new Date('2022-05-13 10:00:00') },
  { registerId: 'SV_MRS_0001_20220513_1000', parameterId: '2', value: '130', patientId: 'MRS_0001', timestamp: new Date('2022-05-13 10:00:00') },
  { registerId: 'SV_MRS_0001_20220513_1000', parameterId: '3', value: '85', patientId: 'MRS_0001', timestamp: new Date('2022-05-13 10:00:00') },
  { registerId: 'SV_MRS_0001_20220513_1000', parameterId: '19', value: '90', patientId: 'MRS_0001', timestamp: new Date('2022-05-13 10:00:00') },
  { registerId: 'SV_MRS_0001_20220513_1000', parameterId: '10', value: '1.0', patientId: 'MRS_0001', timestamp: new Date('2022-05-13 10:00:00') },
  { registerId: 'SV_MRS_0001_20220513_1000', parameterId: '11', value: '143', patientId: 'MRS_0001', timestamp: new Date('2022-05-13 10:00:00') },
  { registerId: 'SV_MRS_0001_20220513_1000', parameterId: '12', value: '4.1', patientId: 'MRS_0001', timestamp: new Date('2022-05-13 10:00:00') },
  { registerId: 'SV_MRS_0001_20220513_1000', parameterId: '13', value: '12.2', patientId: 'MRS_0001', timestamp: new Date('2022-05-13 10:00:00') },
  
  // Juan Agudells Vilaseca (JAV_0001) - EPOC/Neumonía
  { registerId: 'SV_JAV_0001_20141014_1001', parameterId: '17', value: '39.5', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:01:00') },
  { registerId: 'SV_JAV_0001_20141014_1001', parameterId: '19', value: '90', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:01:00') },
  { registerId: 'SV_JAV_0001_20141014_1001', parameterId: '20', value: '31', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:01:00') },
  { registerId: 'SV_JAV_0001_20141014_1001', parameterId: '23', value: '150/90', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:01:00') },
  { registerId: 'SV_JAV_0001_20141014_1001', parameterId: '24', value: '89', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:01:00') },
  { registerId: 'SV_JAV_0001_20141014_1002', parameterId: '17', value: '38.3', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:02:00') },
  { registerId: 'SV_JAV_0001_20141014_1002', parameterId: '19', value: '85', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:02:00') },
  { registerId: 'SV_JAV_0001_20141014_1002', parameterId: '20', value: '28', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:02:00') },
  { registerId: 'SV_JAV_0001_20141014_1002', parameterId: '23', value: '142/88', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:02:00') },
  { registerId: 'SV_JAV_0001_20141014_1002', parameterId: '24', value: '92', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:02:00') },
  { registerId: 'SV_JAV_0001_20141014_1003', parameterId: '17', value: '36.6', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:03:00') },
  { registerId: 'SV_JAV_0001_20141014_1003', parameterId: '19', value: '83', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:03:00') },
  { registerId: 'SV_JAV_0001_20141014_1003', parameterId: '20', value: '23', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:03:00') },
  { registerId: 'SV_JAV_0001_20141014_1003', parameterId: '23', value: '145/87', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:03:00') },
  { registerId: 'SV_JAV_0001_20141014_1003', parameterId: '24', value: '93', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:03:00') },
  { registerId: 'SV_JAV_0001_20141014_1004', parameterId: '17', value: '37.2', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:04:00') },
  { registerId: 'SV_JAV_0001_20141014_1004', parameterId: '19', value: '74', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:04:00') },
  { registerId: 'SV_JAV_0001_20141014_1004', parameterId: '20', value: '21', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:04:00') },
  { registerId: 'SV_JAV_0001_20141014_1004', parameterId: '23', value: '139/90', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:04:00') },
  { registerId: 'SV_JAV_0001_20141014_1004', parameterId: '24', value: '96', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:04:00') },
  { registerId: 'SV_JAV_0001_20141014_1005', parameterId: '17', value: '36.1', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:05:00') },
  { registerId: 'SV_JAV_0001_20141014_1005', parameterId: '19', value: '72', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:05:00') },
  { registerId: 'SV_JAV_0001_20141014_1005', parameterId: '20', value: '18', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:05:00') },
  { registerId: 'SV_JAV_0001_20141014_1005', parameterId: '23', value: '140/89', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:05:00') },
  { registerId: 'SV_JAV_0001_20141014_1005', parameterId: '24', value: '98', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:05:00') },
  { registerId: 'SV_JAV_0001_20141014_1006', parameterId: '17', value: '36.6', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:06:00') },
  { registerId: 'SV_JAV_0001_20141014_1006', parameterId: '19', value: '68', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:06:00') },
  { registerId: 'SV_JAV_0001_20141014_1006', parameterId: '20', value: '20', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:06:00') },
  { registerId: 'SV_JAV_0001_20141014_1006', parameterId: '23', value: '137/87', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:06:00') },
  { registerId: 'SV_JAV_0001_20141014_1006', parameterId: '24', value: '98', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:06:00') },
  // Analítica de Juan Agudells
  { registerId: 'SV_JAV_0001_20141014_1000', parameterId: '14', value: '42', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:00:00') },
  { registerId: 'SV_JAV_0001_20141014_1000', parameterId: '13', value: '45852', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:00:00') },
  { registerId: 'SV_JAV_0001_20141014_1000', parameterId: '30', value: '4950000', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:00:00') },
  { registerId: 'SV_JAV_0001_20141014_1000', parameterId: '31', value: '7643', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:00:00') },
  { registerId: 'SV_JAV_0001_20141014_1000', parameterId: '16', value: '240000', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:00:00') },
  { registerId: 'SV_JAV_0001_20141014_1000', parameterId: '32', value: '73', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:00:00') },
  { registerId: 'SV_JAV_0001_20141014_1000', parameterId: '33', value: '2', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:00:00') },
  { registerId: 'SV_JAV_0001_20141014_1000', parameterId: '34', value: '1', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:00:00') },
  { registerId: 'SV_JAV_0001_20141014_1000', parameterId: '35', value: '20', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:00:00') },
  { registerId: 'SV_JAV_0001_20141014_1000', parameterId: '36', value: '4', patientId: 'JAV_0001', timestamp: new Date('2014-10-14 10:00:00') }
];

// Helper para obtener signos vitales por paciente
export function getDetailVitalSignsByPatient(patientId: string): DetailVitalSign[] {
  return sqlDetailVitalSigns.filter(d => d.patientId === patientId);
}

// Helper para obtener signos vitales agrupados por registro
export function getVitalSignsGroupedByRegister(patientId: string): Map<string, DetailVitalSign[]> {
  const signs = getDetailVitalSignsByPatient(patientId);
  const grouped = new Map<string, DetailVitalSign[]>();
  
  for (const sign of signs) {
    const existing = grouped.get(sign.registerId) || [];
    existing.push(sign);
    grouped.set(sign.registerId, existing);
  }
  
  return grouped;
}

// Helper para obtener nombre de parámetro
export function getVitalSignParameterName(parameterId: string): string {
  const param = sqlVitalSignParameters.find(p => p.id === parameterId);
  return param?.name || `Parámetro ${parameterId}`;
}

// Helper para obtener unidad de parámetro
export function getVitalSignParameterUnit(parameterId: string): string {
  const param = sqlVitalSignParameters.find(p => p.id === parameterId);
  return param?.unit || '';
}
