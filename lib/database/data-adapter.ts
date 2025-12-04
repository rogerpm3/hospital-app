/**
 * Data Adapter - Convierte datos entre formato SQL y formato de la aplicación
 * Mapea las tablas SQL a las interfaces TypeScript de la app
 */

import type { SQLTable } from './sql-parser';
import type {
  Patient,
  Room,
  Bed,
  VitalSigns,
  Medication,
  MedicalOrder,
  Service,
  Admission,
  User
} from '../types';

/**
 * Convierte datos de la tabla Paciente SQL al formato Patient de la app
 */
export function sqlPatientsToAppPatients(
  pacienteTable: SQLTable | undefined,
  movimientoTable: SQLTable | undefined,
  episodioTable: SQLTable | undefined
): Patient[] {
  if (!pacienteTable || pacienteTable.rows.length === 0) return [];
  
  console.log('📊 Convirtiendo pacientes SQL:', pacienteTable.rows.length, 'filas');
  console.log('📊 Columnas de Paciente:', pacienteTable.columns);
  
  return pacienteTable.rows.map((row, index) => {
    // Buscar el último movimiento del paciente para obtener habitación actual
    const patientMovements = movimientoTable?.rows.filter(
      m => m.id_paciente === row.id_paciente
    ) || [];
    
    const lastMovement = patientMovements[patientMovements.length - 1];
    
    // Buscar episodios activos del paciente
    const patientEpisodes = episodioTable?.rows.filter(
      e => e.id_paciente === row.id_paciente
    ) || [];
    
    const activeEpisode = patientEpisodes.find(e => !e.fecha_hora_fin || e.fecha_hora_fin === 'NULL');
    
    // Parsear fecha de nacimiento
    let dateOfBirth = new Date();
    try {
      if (row.Fecha_nacimiento) {
        dateOfBirth = new Date(row.Fecha_nacimiento);
        if (isNaN(dateOfBirth.getTime())) {
          dateOfBirth = new Date('1990-01-01');
        }
      }
    } catch (e) {
      dateOfBirth = new Date('1990-01-01');
    }
    
    // Extraer dirección
    const addressParts = (row.Direccion || '').split(',').map(s => s.trim());
    
    // Determinar género
    let gender: 'M' | 'F' | 'Other' = 'Other';
    if (row.Sexo === 'M') gender = 'M';
    else if (row.Sexo === 'F') gender = 'F';
    
    return {
      id: row.id_paciente || `patient-sql-${index + 1}`,
      dni: row.ID_documento || '',
      socialSecurityNumber: row.HealthCard_Number || undefined,
      firstName: row.Nombre || '',
      lastName: row.Apellidos || '',
      dateOfBirth,
      gender,
      bloodType: undefined,
      phone: row.Phone || '',
      email: row.Email || undefined,
      address: {
        street: addressParts[0] || '',
        city: addressParts.length > 2 ? addressParts[addressParts.length - 1] : 'Barcelona',
        postalCode: addressParts[2]?.match(/\d+/)?.[0] || '',
        country: 'España'
      },
      emergencyContact: {
        name: 'Contacto de emergencia',
        relationship: 'Familiar',
        phone: row.Emergency_Contact || ''
      },
      allergies: [],
      medicalHistory: activeEpisode ? [activeEpisode.motivo_principal || ''] : [],
      currentMedications: [],
      admissionDate: activeEpisode ? parseDate(activeEpisode.fecha_hora_inicio) : undefined,
      roomId: lastMovement?.id_habitación || lastMovement?.['id_habitación'] || undefined,
      bedNumber: lastMovement?.id_cama || undefined,
      attendingPhysician: lastMovement?.id_profesional_responsable || undefined,
      admissionReason: activeEpisode?.motivo_principal || undefined,
      currentCondition: 'Stable',
      riskLevel: 'Low',
      isolationRequired: false,
      codeStatus: 'Full Code',
      assignedUnit: lastMovement?.servicio_clinico || undefined,
      anonymousId: `PAT-${String(index + 1).padStart(3, '0')}`
    };
  });
}

/**
 * Convierte datos de PersonalSanitario SQL al formato User de la app
 */
export function sqlStaffToAppUsers(personalTable: SQLTable | undefined): User[] {
  if (!personalTable || personalTable.rows.length === 0) return [];
  
  console.log('📊 Convirtiendo personal SQL:', personalTable.rows.length, 'filas');
  
  return personalTable.rows.map((row, index) => {
    // Mapear rol de la BD al rol de la app
    const rolLower = (row.rol || '').toLowerCase();
    let role: string = 'doctor';
    
    if (rolLower.includes('médico') || rolLower.includes('medico')) {
      role = 'doctor';
    } else if (rolLower.includes('enferm')) {
      role = 'nurse';
    } else if (rolLower.includes('otro') || rolLower.includes('admin')) {
      role = 'admin';
    }
    
    const firstName = row.Nombre || '';
    const lastName = row.Apellidos || '';
    const emailPrefix = `${firstName.toLowerCase().replace(/[^a-z]/g, '')}.${lastName.split(' ')[0]?.toLowerCase().replace(/[^a-z]/g, '') || 'user'}`;
    
    return {
      id: row.id_profesional || `staff-sql-${index + 1}`,
      dni: `DNI-${row.id_profesional}`,
      firstName,
      lastName,
      email: `${emailPrefix}@hospital.com`,
      phone: '+34 600 000 000',
      role: role as any,
      department: row.Especialidad || 'General',
      specialization: row.Especialidad || undefined,
      professionalId: row.id_profesional || undefined,
      isActive: true,
      anonymousId: `STAFF-${String(index + 1).padStart(3, '0')}`,
      failedLoginAttempts: 0,
      isLocked: false
    };
  });
}

/**
 * Convierte datos de Habitacion y Cama SQL al formato Room y Bed de la app
 */
export function sqlRoomsToAppRooms(
  habitacionTable: SQLTable | undefined,
  camaTable: SQLTable | undefined,
  unidadTable: SQLTable | undefined
): { rooms: Room[], beds: Bed[] } {
  if (!habitacionTable || habitacionTable.rows.length === 0) {
    return { rooms: [], beds: [] };
  }
  
  console.log('📊 Convirtiendo habitaciones SQL:', habitacionTable.rows.length, 'filas');
  
  const allBeds: Bed[] = [];
  
  const rooms: Room[] = habitacionTable.rows.map((row, index) => {
    // Buscar la unidad hospitalaria
    const unidad = unidadTable?.rows.find(u => u.id_unidad === row.id_unidad);
    
    // Buscar camas de esta habitación
    const roomBeds = camaTable?.rows.filter(c => c.id_habitacion === row.id_habitacion) || [];
    
    const beds: Bed[] = roomBeds.map((bedRow, bedIndex) => {
      const bed: Bed = {
        id: bedRow.id_cama || `bed-${row.id_habitacion}-${bedIndex + 1}`,
        number: bedRow.Num_cama || String(bedIndex + 1),
        roomId: row.id_habitacion || '',
        isOccupied: bedRow.Estado !== 'operativa' && bedRow.Estado !== 'disponible',
        status: bedRow.Estado === 'operativa' ? 'Available' : 'Occupied',
        cleaningStatus: 'Clean',
        lastCleaned: new Date(),
        hasBedrails: true,
        isElectric: true
      };
      allBeds.push(bed);
      return bed;
    });
    
    // Mapear tipo de habitación
    const typeMapping: Record<string, Room['type']> = {
      'individual': 'Single',
      'doble': 'Double',
      'Individual': 'Single',
      'Doble': 'Double'
    };
    
    // Mapear unidad a departamento
    const departmentMapping: Record<string, string> = {
      'HO': 'Obstetricia',
      'TRU': 'Traumatología',
      'UC': 'Urgencias Cirugía',
      'SC': 'Cirugía',
      'HG': 'Hospitalización General',
      'UCI': 'UCI',
      'HMI': 'Medicina Interna',
      'QUI': 'Quirófano'
    };
    
    // Extraer número de planta del id_habitacion (ej: P1_HO_101 -> planta 1)
    const floorMatch = row.id_habitacion?.match(/P(\d)/);
    const floor = floorMatch ? parseInt(floorMatch[1]) : 1;
    
    return {
      id: row.id_habitacion || `room-sql-${index + 1}`,
      number: row.Num_habitacion || String(index + 1),
      floor,
      department: departmentMapping[row.id_unidad || ''] || unidad?.Nombre_unidad || 'General',
      type: typeMapping[row.Tipo_habitacion || ''] || 'Single',
      beds,
      amenities: ['TV', 'Baño privado'],
      dailyRate: 150.00,
      isOccupied: beds.some(b => b.isOccupied),
      lastCleaned: new Date(),
      maintenanceStatus: 'Good',
      hasOxygen: true,
      hasMonitor: row.id_unidad === 'UCI',
      hasPrivateBathroom: true
    };
  });
  
  return { rooms, beds: allBeds };
}

/**
 * Convierte datos de Medicamento SQL al formato Medication de la app
 */
export function sqlMedicationsToAppMedications(
  medicamentoTable: SQLTable | undefined,
  adminMedTable: SQLTable | undefined,
  ordenTable: SQLTable | undefined
): Medication[] {
  if (!medicamentoTable || medicamentoTable.rows.length === 0) return [];
  
  console.log('📊 Convirtiendo medicamentos SQL:', medicamentoTable.rows.length, 'filas');
  
  return medicamentoTable.rows.map((row, index) => {
    // Buscar administraciones de este medicamento
    const admins = adminMedTable?.rows.filter(a => a.id_medicamento === row.id_medicamento) || [];
    const lastAdmin = admins[admins.length - 1];
    
    // Mapear vía de administración
    const routeMapping: Record<string, Medication['route']> = {
      'oral': 'Oral',
      'intravenosa': 'IV',
      'intramuscular': 'IM',
      'subcutánea': 'IM',
      'Oral': 'Oral',
      'Endovenosa': 'IV',
      'Mascarilla': 'Inhalation'
    };
    
    return {
      id: row.id_medicamento || `med-sql-${index + 1}`,
      name: row.Nombre_generico || '',
      genericName: row.Nombre_generico || undefined,
      dosage: row.Unidad_dosis || 'Ver indicaciones',
      frequency: 'Según prescripción',
      route: routeMapping[row.Via_administracion || ''] || 'Oral',
      startDate: lastAdmin ? parseDate(lastAdmin.fecha_hora) : new Date(),
      prescribedBy: lastAdmin?.id_profesional || 'Sistema',
      patientId: '',
      instructions: `${row.Forma_farmaceutica || ''} - ${row.Via_administracion || ''}`,
      status: 'Active'
    };
  });
}

/**
 * Convierte datos de OrdenMedica SQL al formato MedicalOrder de la app
 */
export function sqlOrdersToAppOrders(
  ordenTable: SQLTable | undefined,
  personalTable: SQLTable | undefined
): MedicalOrder[] {
  if (!ordenTable || ordenTable.rows.length === 0) return [];
  
  console.log('📊 Convirtiendo órdenes médicas SQL:', ordenTable.rows.length, 'filas');
  
  return ordenTable.rows.map((row, index) => {
    // Buscar el profesional
    const professional = personalTable?.rows.find(p => p.id_profesional === row.id_profesional);
    
    return {
      id: row.id_orden || `order-sql-${index + 1}`,
      patientId: row.id_epsiosdio || row.id_episodio || '', // Manejar typo en la BD
      physicianId: row.id_profesional || '',
      physicianName: professional ? `${professional.Nombre} ${professional.Apellidos}` : 'Dr. Sistema',
      orderDate: parseDate(row.fecha_hora),
      type: 'Medication',
      category: 'Routine',
      description: row.texto_orden || 'Orden médica',
      instructions: row.texto_orden || '',
      status: 'Completed',
      cost: 0,
      requiresConsent: false
    };
  });
}

/**
 * Convierte datos de RegistroSignosVitales SQL al formato VitalSigns de la app
 */
export function sqlVitalSignsToAppVitalSigns(
  registroSVTable: SQLTable | undefined,
  detalleSVTable: SQLTable | undefined,
  parametroSVTable: SQLTable | undefined
): VitalSigns[] {
  if (!registroSVTable || registroSVTable.rows.length === 0) return [];
  
  console.log('📊 Convirtiendo signos vitales SQL:', registroSVTable.rows.length, 'filas');
  
  return registroSVTable.rows.map((row, index) => {
    // Buscar detalles de signos vitales para este registro
    const detalles = detalleSVTable?.rows.filter(d => d.id_registro_sv === row.id_registro_sv) || [];
    
    // Valores por defecto
    let systolic = 120;
    let diastolic = 80;
    let heartRate = 75;
    let temperature = 36.5;
    let respiratoryRate = 16;
    let oxygenSaturation = 98;
    let weight: number | undefined;
    let glucoseLevel: number | undefined;
    
    for (const detalle of detalles) {
      const paramId = detalle.id_parametro_sv;
      const valor = parseFloat(detalle.valor || '0');
      
      if (isNaN(valor)) continue;
      
      // Mapear según los IDs de parámetros de la BD
      switch (paramId) {
        case '2': systolic = valor; break; // Presión sistólica
        case '3': diastolic = valor; break; // Presión diastólica
        case '19': heartRate = valor; break; // Frecuencia cardíaca
        case '17': temperature = valor; break; // Temperatura
        case '20': respiratoryRate = valor; break; // Frecuencia respiratoria
        case '21': case '22': oxygenSaturation = valor; break; // Saturación O2
        case '1': weight = valor; break; // Peso
        case '4': glucoseLevel = valor; break; // Glucemia
      }
    }
    
    return {
      id: row.id_registro_sv || `vs-sql-${index + 1}`,
      patientId: row.id_episodio || '',
      timestamp: parseDate(row.fecha_hora),
      recordedBy: row.id_profesional || 'Sistema',
      bloodPressure: { systolic, diastolic },
      heartRate,
      temperature,
      respiratoryRate,
      oxygenSaturation,
      painLevel: 0,
      glucoseLevel,
      weight,
      notes: 'Registro de base de datos SQL',
      alerts: []
    };
  });
}

/**
 * Convierte datos de Prestacion SQL al formato Service de la app
 */
export function sqlServicesToAppServices(prestacionTable: SQLTable | undefined): Service[] {
  if (!prestacionTable || prestacionTable.rows.length === 0) return [];
  
  console.log('📊 Convirtiendo servicios SQL:', prestacionTable.rows.length, 'filas');
  
  return prestacionTable.rows.map((row, index) => {
    return {
      id: row.id_prestacion || `service-sql-${index + 1}`,
      name: row.Descripcion || '',
      description: row.Descripcion || '',
      department: row.Tipo_prestacion || 'General',
      duration: 30,
      cost: parseFloat(row.Coste_unitario || '0'),
      requiresPreauth: false,
      isActive: true
    };
  });
}

/**
 * Convierte datos de EpisodioClinico y movimiento SQL al formato Admission de la app
 */
export function sqlEpisodesToAppAdmissions(
  episodioTable: SQLTable | undefined,
  movimientoTable: SQLTable | undefined
): Admission[] {
  if (!episodioTable || episodioTable.rows.length === 0) return [];
  
  console.log('📊 Convirtiendo episodios/admisiones SQL:', episodioTable.rows.length, 'filas');
  
  // Eliminar duplicados por id_episodio
  const uniqueEpisodes = new Map<string, any>();
  for (const row of episodioTable.rows) {
    const key = row.id_episodio || `ep-${Math.random()}`;
    if (!uniqueEpisodes.has(key)) {
      uniqueEpisodes.set(key, row);
    }
  }
  
  return Array.from(uniqueEpisodes.values()).map((row, index) => {
    // Buscar movimientos de este episodio
    const movements = movimientoTable?.rows.filter(m => m.id_episodio === row.id_episodio) || [];
    const lastMovement = movements[movements.length - 1];
    
    const startDate = parseDate(row.fecha_hora_inicio);
    const endDate = row.fecha_hora_fin && row.fecha_hora_fin !== 'NULL' 
      ? parseDate(row.fecha_hora_fin) 
      : undefined;
    
    return {
      id: row.id_episodio || `adm-sql-${index + 1}`,
      patientId: row.id_paciente || '',
      admissionDate: startDate,
      expectedDischargeDate: endDate,
      actualDischargeDate: endDate,
      reason: row.motivo_principal || '',
      type: 'Emergency' as const,
      status: endDate ? 'Discharged' : 'Active',
      admittingPhysician: lastMovement?.id_profesional_responsable || 'Sistema',
      roomId: lastMovement?.id_habitación || lastMovement?.['id_habitación'] || undefined,
      bedId: lastMovement?.id_cama || undefined,
      diagnosticCodes: row.id_diagnostico ? [row.id_diagnostico] : [],
      priorityLevel: 'Medium',
      admissionSource: 'Emergency',
      paymentMethod: 'Insurance'
    };
  });
}

// ============================================
// FUNCIONES DE CONVERSIÓN INVERSA (App -> SQL)
// ============================================

/**
 * Convierte un Patient de la app al formato SQL de Paciente
 */
export function appPatientToSQLRow(patient: Patient): Record<string, string | null> {
  return {
    id_paciente: patient.id,
    Nombre: patient.firstName,
    Apellidos: patient.lastName,
    Fecha_nacimiento: patient.dateOfBirth.toISOString(),
    Sexo: patient.gender === 'Other' ? 'O' : patient.gender,
    ID_documento: patient.dni,
    HealthCard_Number: patient.socialSecurityNumber || null,
    Direccion: `${patient.address.street}, ${patient.address.postalCode}, ${patient.address.city}`,
    Phone: patient.phone,
    Email: patient.email || null,
    Emergency_Contact: patient.emergencyContact?.phone || null
  };
}

/**
 * Convierte un User de la app al formato SQL de PersonalSanitario
 */
export function appUserToSQLRow(user: User): Record<string, string | null> {
  const rolMapping: Record<string, string> = {
    'doctor': 'médico',
    'nurse': 'enfermería',
    'admin': 'otro'
  };
  
  return {
    id_profesional: user.professionalId || user.id,
    Nombre: user.firstName,
    Apellidos: user.lastName,
    rol: rolMapping[user.role] || 'otro',
    Especialidad: user.specialization || user.department || null
  };
}

/**
 * Convierte una Bed de la app al formato SQL de Cama
 */
export function appBedToSQLRow(bed: Bed): Record<string, string | null> {
  return {
    id_cama: bed.id,
    Num_cama: bed.number,
    id_habitacion: bed.roomId,
    Estado: bed.status === 'Available' ? 'operativa' : 'ocupada'
  };
}

/**
 * Convierte un Medication de la app al formato SQL de Medicamento
 */
export function appMedicationToSQLRow(medication: Medication): Record<string, string | null> {
  const routeMapping: Record<string, string> = {
    'Oral': 'oral',
    'IV': 'intravenosa',
    'IM': 'intramuscular',
    'Topical': 'topica',
    'Inhalation': 'inhalada',
    'Sublingual': 'sublingual',
    'Rectal': 'rectal'
  };
  
  return {
    id_medicamento: medication.id,
    Nombre_generico: medication.genericName || medication.name,
    Forma_farmaceutica: 'comprimido',
    Via_administracion: routeMapping[medication.route] || 'oral',
    Unidad_dosis: medication.dosage
  };
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Parsea una fecha desde varios formatos posibles de la BD
 */
function parseDate(dateStr: string | null | undefined): Date {
  if (!dateStr || dateStr === 'NULL') return new Date();
  
  // Limpiar la cadena
  const cleaned = dateStr.trim().replace(/\s+/g, ' ');
  
  // Intentar ISO primero
  let date = new Date(cleaned);
  if (!isNaN(date.getTime())) return date;
  
  // Intentar formato DD/MM/YYYY HH:MM:SS
  const ddmmyyyy = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}):?(\d{2})?)?/);
  if (ddmmyyyy) {
    const [, day, month, year, hour = '0', minute = '0', second = '0'] = ddmmyyyy;
    date = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second)
    );
    if (!isNaN(date.getTime())) return date;
  }
  
  // Intentar otros formatos
  const formats = [
    /^(\d{4})-(\d{2})-(\d{2})$/,
    /^(\d{4})(\d{2})(\d{2})$/
  ];
  
  for (const fmt of formats) {
    const m = cleaned.match(fmt);
    if (m) {
      date = new Date(`${m[1]}-${m[2]}-${m[3]}`);
      if (!isNaN(date.getTime())) return date;
    }
  }
  
  return new Date();
}

/**
 * Genera un ID único para nuevos registros
 */
export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
