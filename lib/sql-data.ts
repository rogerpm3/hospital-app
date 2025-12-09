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
// ÓRDENES MÉDICAS (31 registros)
// ============================================
export const sqlMedicalOrders: MedicalOrder[] = [
  {
    id: "order-1",
    patientId: "ORD342",
    physicianId: "CTS880",
    physicianName: "Dr. Sistema",
    orderDate: new Date(),
    type: "Medication",
    category: "Routine",
    description: "2014-01-02 10:30:00",
    instructions: "2014-01-02 10:30:00",
    status: "Completed",
    cost: 0,
    requiresConsent: false
  },
  {
    id: "order-2",
    patientId: "ORD892",
    physicianId: "CTS880",
    physicianName: "Dr. Sistema",
    orderDate: new Date(),
    type: "Medication",
    category: "Routine",
    description: "2014-03-27 10:00:00",
    instructions: "2014-03-27 10:00:00",
    status: "Completed",
    cost: 0,
    requiresConsent: false
  },
  {
    id: "order-3",
    patientId: "ORD326",
    physicianId: "CTS880",
    physicianName: "Dr. Sistema",
    orderDate: new Date(),
    type: "Medication",
    category: "Routine",
    description: "07/05/2014 13.00",
    instructions: "07/05/2014 13.00",
    status: "Completed",
    cost: 0,
    requiresConsent: false
  },
  {
    id: "order-4",
    patientId: "ORD123",
    physicianId: "WHG_123",
    physicianName: "Dr. Sistema",
    orderDate: new Date(),
    type: "Medication",
    category: "Routine",
    description: "2022-09-11 10:00:00",
    instructions: "2022-09-11 10:00:00",
    status: "Completed",
    cost: 0,
    requiresConsent: false
  },
  {
    id: "order-5",
    patientId: "ORD124",
    physicianId: "WHG_123",
    physicianName: "Dr. Sistema",
    orderDate: new Date(),
    type: "Medication",
    category: "Routine",
    description: "2022-09-11 10:00:00",
    instructions: "2022-09-11 10:00:00",
    status: "Completed",
    cost: 0,
    requiresConsent: false
  },
  {
    id: "order-6",
    patientId: "ORD125",
    physicianId: "WHG_123",
    physicianName: "Dr. Sistema",
    orderDate: new Date(),
    type: "Medication",
    category: "Routine",
    description: "2022-09-11 10:00:00",
    instructions: "2022-09-11 10:00:00",
    status: "Completed",
    cost: 0,
    requiresConsent: false
  },
  {
    id: "order-7",
    patientId: "ORD342",
    physicianId: "EPI001",
    physicianName: "Dr. Sistema",
    orderDate: new Date(),
    type: "Medication",
    category: "Routine",
    description: "2015-09-14 14:40:00",
    instructions: "2015-09-14 14:40:00",
    status: "Completed",
    cost: 0,
    requiresConsent: false
  },
  {
    id: "order-8",
    patientId: "ORD390",
    physicianId: "EPI001",
    physicianName: "Dr. Sistema",
    orderDate: new Date(),
    type: "Medication",
    category: "Routine",
    description: "2015-09-14 18:44:00",
    instructions: "2015-09-14 18:44:00",
    status: "Completed",
    cost: 0,
    requiresConsent: false
  },
  {
    id: "order-9",
    patientId: "ORD511",
    physicianId: "EPI001",
    physicianName: "Dr. Sistema",
    orderDate: new Date(),
    type: "Medication",
    category: "Routine",
    description: "2015-09-14 20:30:00",
    instructions: "2015-09-14 20:30:00",
    status: "Completed",
    cost: 0,
    requiresConsent: false
  },
  {
    id: "order-10",
    patientId: "ORD519",
    physicianId: "EPI001",
    physicianName: "Dr. Sistema",
    orderDate: new Date(),
    type: "Medication",
    category: "Routine",
    description: "15/09/2015 2015-09-15 09:00:00",
    instructions: "15/09/2015 2015-09-15 09:00:00",
    status: "Completed",
    cost: 0,
    requiresConsent: false
  },
  {
    id: "order-11",
    patientId: "ORD348",
    physicianId: "EPI001",
    physicianName: "Dr. Sistema",
    orderDate: new Date(),
    type: "Medication",
    category: "Routine",
    description: "2015-09-15 18:15:00",
    instructions: "2015-09-15 18:15:00",
    status: "Completed",
    cost: 0,
    requiresConsent: false
  },
  {
    id: "order-12",
    patientId: "ORD133",
    physicianId: "AEF498",
    physicianName: "Dr. Sistema",
    orderDate: new Date(),
    type: "Medication",
    category: "Routine",
    description: "2014-10-14 19:45:00",
    instructions: "2014-10-14 19:45:00",
    status: "Completed",
    cost: 0,
    requiresConsent: false
  },
  {
    id: "order-13",
    patientId: "ORD134",
    physicianId: "AEF498",
    physicianName: "Dr. Sistema",
    orderDate: new Date(),
    type: "Medication",
    category: "Routine",
    description: "2014-10-14 19:45:00.288000",
    instructions: "2014-10-14 19:45:00.288000",
    status: "Completed",
    cost: 0,
    requiresConsent: false
  },
  {
    id: "order-14",
    patientId: "ORD135",
    physicianId: "AEF498",
    physicianName: "Dr. Sistema",
    orderDate: new Date(),
    type: "Medication",
    category: "Routine",
    description: "2014-10-14 19:45:00.288000",
    instructions: "2014-10-14 19:45:00.288000",
    status: "Completed",
    cost: 0,
    requiresConsent: false
  },
  {
    id: "order-15",
    patientId: "ORD136",
    physicianId: "AEF498",
    physicianName: "Dr. Sistema",
    orderDate: new Date(),
    type: "Medication",
    category: "Routine",
    description: "2014-10-14 19:45:00.288000",
    instructions: "2014-10-14 19:45:00.288000",
    status: "Completed",
    cost: 0,
    requiresConsent: false
  },
  {
    id: "order-16",
    patientId: "ORD137",
    physicianId: "AEF498",
    physicianName: "Dr. Sistema",
    orderDate: new Date(),
    type: "Medication",
    category: "Routine",
    description: "2014-10-14 19:45:00",
    instructions: "2014-10-14 19:45:00",
    status: "Completed",
    cost: 0,
    requiresConsent: false
  },
  {
    id: "order-17",
    patientId: "ORD138",
    physicianId: "AEF498",
    physicianName: "Dr. Sistema",
    orderDate: new Date(),
    type: "Medication",
    category: "Routine",
    description: "2014-10-14 19:45:00",
    instructions: "2014-10-14 19:45:00",
    status: "Completed",
    cost: 0,
    requiresConsent: false
  },
  {
    id: "order-18",
    patientId: "ORD139",
    physicianId: "AEF498",
    physicianName: "Dr. Sistema",
    orderDate: new Date(),
    type: "Medication",
    category: "Routine",
    description: "2014-10-14 19:45:00",
    instructions: "2014-10-14 19:45:00",
    status: "Completed",
    cost: 0,
    requiresConsent: false
  },
  {
    id: "order-19",
    patientId: "ORD140",
    physicianId: "AEF498",
    physicianName: "Dr. Sistema",
    orderDate: new Date(),
    type: "Medication",
    category: "Routine",
    description: "2014-10-14 23:30:00.288000",
    instructions: "2014-10-14 23:30:00.288000",
    status: "Completed",
    cost: 0,
    requiresConsent: false
  },
  {
    id: "order-20",
    patientId: "ORD141",
    physicianId: "AEF498",
    physicianName: "Dr. Sistema",
    orderDate: new Date(),
    type: "Medication",
    category: "Routine",
    description: "2014-10-14 23:30:00.288000",
    instructions: "2014-10-14 23:30:00.288000",
    status: "Completed",
    cost: 0,
    requiresConsent: false
  },
  {
    id: "order-21",
    patientId: "ORD142",
    physicianId: "AEF498",
    physicianName: "Dr. Sistema",
    orderDate: new Date(),
    type: "Medication",
    category: "Routine",
    description: "2014-10-14 23:30:00.288000",
    instructions: "2014-10-14 23:30:00.288000",
    status: "Completed",
    cost: 0,
    requiresConsent: false
  },
  {
    id: "order-22",
    patientId: "ORD143",
    physicianId: "AEF498",
    physicianName: "Dr. Sistema",
    orderDate: new Date(),
    type: "Medication",
    category: "Routine",
    description: "2014-10-14 23:30:00.288000",
    instructions: "2014-10-14 23:30:00.288000",
    status: "Completed",
    cost: 0,
    requiresConsent: false
  },
  {
    id: "order-23",
    patientId: "ORD144",
    physicianId: "AEF498",
    physicianName: "Dr. Sistema",
    orderDate: new Date(),
    type: "Medication",
    category: "Routine",
    description: "2014-10-14 23:30:00.288000",
    instructions: "2014-10-14 23:30:00.288000",
    status: "Completed",
    cost: 0,
    requiresConsent: false
  },
  {
    id: "order-24",
    patientId: "ORD145",
    physicianId: "AEF498",
    physicianName: "Dr. Sistema",
    orderDate: new Date(),
    type: "Medication",
    category: "Routine",
    description: "2014-10-14 23:30:00.288000",
    instructions: "2014-10-14 23:30:00.288000",
    status: "Completed",
    cost: 0,
    requiresConsent: false
  },
  {
    id: "order-25",
    patientId: "ORD126",
    physicianId: "KOP233",
    physicianName: "Dr. Sistema",
    orderDate: new Date(),
    type: "Medication",
    category: "Routine",
    description: "2022-05-10 17:14:00",
    instructions: "2022-05-10 17:14:00",
    status: "Completed",
    cost: 0,
    requiresConsent: false
  },
  {
    id: "order-26",
    patientId: "ORD127",
    physicianId: "KOP233",
    physicianName: "Dr. Sistema",
    orderDate: new Date(),
    type: "Medication",
    category: "Routine",
    description: "2022-05-11 17:14:00",
    instructions: "2022-05-11 17:14:00",
    status: "Completed",
    cost: 0,
    requiresConsent: false
  },
  {
    id: "order-27",
    patientId: "ORD128",
    physicianId: "KOP233",
    physicianName: "Dr. Sistema",
    orderDate: new Date(),
    type: "Medication",
    category: "Routine",
    description: "2022-05-11 17:14:00",
    instructions: "2022-05-11 17:14:00",
    status: "Completed",
    cost: 0,
    requiresConsent: false
  },
  {
    id: "order-28",
    patientId: "ORD129",
    physicianId: "KOP233",
    physicianName: "Dr. Sistema",
    orderDate: new Date(),
    type: "Medication",
    category: "Routine",
    description: "2022-05-12 17:14:00",
    instructions: "2022-05-12 17:14:00",
    status: "Completed",
    cost: 0,
    requiresConsent: false
  },
  {
    id: "order-29",
    patientId: "ORD130",
    physicianId: "KOP233",
    physicianName: "Dr. Sistema",
    orderDate: new Date(),
    type: "Medication",
    category: "Routine",
    description: "2022-05-12 17:14:00",
    instructions: "2022-05-12 17:14:00",
    status: "Completed",
    cost: 0,
    requiresConsent: false
  },
  {
    id: "order-30",
    patientId: "ORD131",
    physicianId: "KOP233",
    physicianName: "Dr. Sistema",
    orderDate: new Date(),
    type: "Medication",
    category: "Routine",
    description: "2022-05-13 17:14:00",
    instructions: "2022-05-13 17:14:00",
    status: "Completed",
    cost: 0,
    requiresConsent: false
  },
  {
    id: "order-31",
    patientId: "ORD132",
    physicianId: "KOP233",
    physicianName: "Dr. Sistema",
    orderDate: new Date(),
    type: "Medication",
    category: "Routine",
    description: "2022-05-13 17:14:00",
    instructions: "2022-05-13 17:14:00",
    status: "Completed",
    cost: 0,
    requiresConsent: false
  }
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
  
  // Permisos de Admisiones (registro inicial)
  { id: 'PERM012', rol: 'admission', areaClinica: 'registro_pacientes', puedeVer: true, puedeEditar: true, puedeCrear: true, puedeEliminar: false, accesoDatosSensibles: false, descripcion: 'Registro y admisión' },
  { id: 'PERM013', rol: 'admission', areaClinica: 'camas', puedeVer: true, puedeEditar: true, puedeCrear: false, puedeEliminar: false, accesoDatosSensibles: false, descripcion: 'Asignación de camas' },
  { id: 'PERM014', rol: 'admission', areaClinica: 'datos_clinicos', puedeVer: false, puedeEditar: false, puedeCrear: false, puedeEliminar: false, accesoDatosSensibles: false, descripcion: 'Sin acceso a datos clínicos' },
  
  // Permisos de Farmacia
  { id: 'PERM015', rol: 'pharmacy', areaClinica: 'medicamentos', puedeVer: true, puedeEditar: true, puedeCrear: true, puedeEliminar: false, accesoDatosSensibles: false, descripcion: 'Gestión de medicamentos' },
  { id: 'PERM016', rol: 'pharmacy', areaClinica: 'ordenes_medicacion', puedeVer: true, puedeEditar: false, puedeCrear: false, puedeEliminar: false, accesoDatosSensibles: false, descripcion: 'Ver órdenes de medicación' },
  
  // Permisos de Paciente (solo sus propios datos)
  { id: 'PERM017', rol: 'patient', areaClinica: 'datos_propios', puedeVer: true, puedeEditar: false, puedeCrear: false, puedeEliminar: false, accesoDatosSensibles: false, descripcion: 'Ver sus propios datos' },
  { id: 'PERM018', rol: 'patient', areaClinica: 'citas', puedeVer: true, puedeEditar: false, puedeCrear: true, puedeEliminar: false, accesoDatosSensibles: false, descripcion: 'Ver y solicitar citas' },
  
  // Permisos de Familia (datos limitados del familiar)
  { id: 'PERM019', rol: 'family', areaClinica: 'estado_paciente', puedeVer: true, puedeEditar: false, puedeCrear: false, puedeEliminar: false, accesoDatosSensibles: false, descripcion: 'Estado general del paciente' },
  { id: 'PERM020', rol: 'family', areaClinica: 'ubicacion', puedeVer: true, puedeEditar: false, puedeCrear: false, puedeEliminar: false, accesoDatosSensibles: false, descripcion: 'Ubicación en hospital' }
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
