/**
 * Database Service - Servicio central para operaciones de base de datos
 * Coordina la lectura/escritura de archivos SQL y la conversión de datos
 */

import { parseSQLContent, generateSQLContent, SQLTable, addRowToTable, updateRowInTable, deleteRowFromTable } from './sql-parser';
import {
  sqlPatientsToAppPatients,
  sqlStaffToAppUsers,
  sqlRoomsToAppRooms,
  sqlMedicationsToAppMedications,
  sqlOrdersToAppOrders,
  sqlVitalSignsToAppVitalSigns,
  sqlServicesToAppServices,
  sqlEpisodesToAppAdmissions,
  appPatientToSQLRow,
  appUserToSQLRow,
  appBedToSQLRow,
  appMedicationToSQLRow,
  generateId
} from './data-adapter';
import type {
  Patient,
  User,
  Room,
  Bed,
  Medication,
  MedicalOrder,
  VitalSigns,
  Service,
  Admission
} from '../types';

// Almacenamiento en memoria de las tablas SQL
let masterTables: Record<string, SQLTable> = {};
let dataTables: Record<string, SQLTable> = {};

// Estado de carga
let isLoaded = false;
let loadError: string | null = null;

/**
 * Inicializa la base de datos cargando los archivos SQL
 */
export async function initializeDatabase(): Promise<void> {
  if (isLoaded && Object.keys(masterTables).length > 0) {
    console.log('✅ Base de datos ya cargada, usando cache');
    return;
  }

  console.log('🔄 Iniciando carga de base de datos SQL...');

  try {
    // Intentar cargar desde localStorage primero (para persistir cambios)
    if (typeof window !== 'undefined') {
      const savedMaster = localStorage.getItem('hospital-db-master');
      const savedData = localStorage.getItem('hospital-db-data');
      
      if (savedMaster && savedData) {
        try {
          const parsedMaster = JSON.parse(savedMaster);
          const parsedData = JSON.parse(savedData);
          
          // Verificar que los datos son válidos
          if (Object.keys(parsedMaster).length > 0 || Object.keys(parsedData).length > 0) {
            masterTables = parsedMaster;
            dataTables = parsedData;
            isLoaded = true;
            console.log('✅ Base de datos cargada desde localStorage');
            console.log('📊 Tablas maestras:', Object.keys(masterTables));
            console.log('📊 Tablas de datos:', Object.keys(dataTables));
            return;
          }
        } catch (e) {
          console.warn('⚠️ Error parseando datos de localStorage, recargando desde API');
        }
      }
    }
    
    // Si no hay datos guardados, cargar desde los archivos SQL via API
    console.log('🔄 Cargando datos desde API...');
    const response = await fetch('/api/database');
    
    if (response.ok) {
      const data = await response.json();
      masterTables = data.masterTables || {};
      dataTables = data.dataTables || {};
      isLoaded = true;
      loadError = null;
      
      console.log('✅ Base de datos cargada desde API');
      console.log('📊 Tablas maestras:', Object.keys(masterTables));
      console.log('📊 Tablas de datos:', Object.keys(dataTables));
      
      // Mostrar cantidad de filas por tabla
      for (const [name, table] of Object.entries(masterTables)) {
        console.log(`  - ${name}: ${table.rows?.length || 0} filas`);
      }
      for (const [name, table] of Object.entries(dataTables)) {
        console.log(`  - ${name}: ${table.rows?.length || 0} filas`);
      }
      
      // Guardar en localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('hospital-db-master', JSON.stringify(masterTables));
        localStorage.setItem('hospital-db-data', JSON.stringify(dataTables));
      }
    } else {
      const errorText = await response.text();
      console.error('❌ Error cargando base de datos:', response.status, errorText);
      loadError = `Error ${response.status}: ${errorText}`;
    }
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    loadError = error instanceof Error ? error.message : 'Error desconocido';
    // Continuar con tablas vacías si hay error
    isLoaded = true;
  }
}

/**
 * Guarda los cambios en la base de datos
 */
export async function saveDatabase(): Promise<boolean> {
  try {
    // Guardar en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('hospital-db-master', JSON.stringify(masterTables));
      localStorage.setItem('hospital-db-data', JSON.stringify(dataTables));
      console.log('💾 Datos guardados en localStorage');
    }
    
    // Intentar guardar en el servidor
    const response = await fetch('/api/database', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ masterTables, dataTables })
    });
    
    if (response.ok) {
      console.log('💾 Datos guardados en servidor');
    }
    
    return response.ok;
  } catch (error) {
    console.error('❌ Error guardando base de datos:', error);
    return false;
  }
}

/**
 * Resetea la base de datos a los datos originales de los archivos SQL
 */
export async function resetDatabase(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('hospital-db-master');
    localStorage.removeItem('hospital-db-data');
  }
  masterTables = {};
  dataTables = {};
  isLoaded = false;
  loadError = null;
  console.log('🔄 Base de datos reseteada, recargando...');
  await initializeDatabase();
}

// ============================================
// FUNCIONES DE LECTURA
// ============================================

/**
 * Obtiene todos los pacientes
 */
export function getPatients(): Patient[] {
  const patients = sqlPatientsToAppPatients(
    masterTables['Paciente'],
    dataTables['movimiento'],
    dataTables['EpisodioClinico']
  );
  console.log(`📋 getPatients: ${patients.length} pacientes`);
  return patients;
}

/**
 * Obtiene un paciente por ID
 */
export function getPatientById(id: string): Patient | undefined {
  return getPatients().find(p => p.id === id);
}

/**
 * Obtiene todo el personal sanitario
 */
export function getStaff(): User[] {
  const staff = sqlStaffToAppUsers(masterTables['PersonalSanitario']);
  console.log(`📋 getStaff: ${staff.length} personal`);
  return staff;
}

/**
 * Obtiene un miembro del personal por ID
 */
export function getStaffById(id: string): User | undefined {
  return getStaff().find(s => s.id === id || s.professionalId === id);
}

/**
 * Obtiene todas las habitaciones y camas
 */
export function getRoomsAndBeds(): { rooms: Room[], beds: Bed[] } {
  const result = sqlRoomsToAppRooms(
    masterTables['Habitacion'],
    masterTables['Cama'],
    masterTables['UnidadHospitalaria']
  );
  console.log(`📋 getRoomsAndBeds: ${result.rooms.length} habitaciones, ${result.beds.length} camas`);
  return result;
}

/**
 * Obtiene todos los medicamentos
 */
export function getMedications(): Medication[] {
  const meds = sqlMedicationsToAppMedications(
    masterTables['Medicamento'],
    dataTables['AdministracinMedicacin'],
    dataTables['OrdenMedica']
  );
  console.log(`📋 getMedications: ${meds.length} medicamentos`);
  return meds;
}

/**
 * Obtiene todas las órdenes médicas
 */
export function getMedicalOrders(): MedicalOrder[] {
  const orders = sqlOrdersToAppOrders(
    dataTables['OrdenMedica'],
    masterTables['PersonalSanitario']
  );
  console.log(`📋 getMedicalOrders: ${orders.length} órdenes`);
  return orders;
}

/**
 * Obtiene todos los signos vitales
 */
export function getVitalSigns(): VitalSigns[] {
  const vs = sqlVitalSignsToAppVitalSigns(
    dataTables['RegistroSignosVitales'],
    dataTables['DetalleSignoVital'],
    masterTables['ParametroSignoVital']
  );
  console.log(`📋 getVitalSigns: ${vs.length} registros`);
  return vs;
}

/**
 * Obtiene todos los servicios/prestaciones
 */
export function getServices(): Service[] {
  const services = sqlServicesToAppServices(masterTables['Prestacion']);
  console.log(`📋 getServices: ${services.length} servicios`);
  return services;
}

/**
 * Obtiene todas las admisiones/episodios
 */
export function getAdmissions(): Admission[] {
  const admissions = sqlEpisodesToAppAdmissions(
    dataTables['EpisodioClinico'],
    dataTables['movimiento']
  );
  console.log(`📋 getAdmissions: ${admissions.length} admisiones`);
  return admissions;
}

/**
 * Obtiene las unidades hospitalarias
 */
export function getHospitalUnits() {
  const unidadTable = masterTables['UnidadHospitalaria'];
  if (!unidadTable) return [];
  
  return unidadTable.rows.map(row => ({
    id: row.id_unidad || '',
    name: row.Nombre_unidad || '',
    type: row.Tipo_unidad || ''
  }));
}

/**
 * Obtiene los diagnósticos
 */
export function getDiagnoses() {
  const diagTable = masterTables['Diagnostico'];
  if (!diagTable) return [];
  
  return diagTable.rows.map(row => ({
    id: row.id_diagnostico || '',
    description: row.Descripcion || ''
  }));
}

// ============================================
// FUNCIONES DE ESCRITURA
// ============================================

/**
 * Añade un nuevo paciente
 */
export async function addPatient(patient: Omit<Patient, 'id'>): Promise<Patient> {
  const id = generateId('PAT');
  const newPatient: Patient = { ...patient, id } as Patient;
  
  const sqlRow = appPatientToSQLRow(newPatient);
  masterTables = addRowToTable(masterTables, 'Paciente', sqlRow);
  
  await saveDatabase();
  return newPatient;
}

/**
 * Actualiza un paciente existente
 */
export async function updatePatient(id: string, updates: Partial<Patient>): Promise<boolean> {
  const existingPatient = getPatientById(id);
  if (!existingPatient) return false;
  
  const updatedPatient = { ...existingPatient, ...updates };
  const sqlRow = appPatientToSQLRow(updatedPatient);
  
  masterTables = updateRowInTable(masterTables, 'Paciente', 'id_paciente', id, sqlRow);
  
  await saveDatabase();
  return true;
}

/**
 * Elimina un paciente
 */
export async function deletePatient(id: string): Promise<boolean> {
  masterTables = deleteRowFromTable(masterTables, 'Paciente', 'id_paciente', id);
  await saveDatabase();
  return true;
}

/**
 * Añade un nuevo miembro del personal
 */
export async function addStaff(user: Omit<User, 'id'>): Promise<User> {
  const id = generateId('STAFF');
  const newUser: User = { ...user, id } as User;
  
  const sqlRow = appUserToSQLRow(newUser);
  masterTables = addRowToTable(masterTables, 'PersonalSanitario', sqlRow);
  
  await saveDatabase();
  return newUser;
}

/**
 * Actualiza un miembro del personal
 */
export async function updateStaff(id: string, updates: Partial<User>): Promise<boolean> {
  const existingUser = getStaffById(id);
  if (!existingUser) return false;
  
  const updatedUser = { ...existingUser, ...updates };
  const sqlRow = appUserToSQLRow(updatedUser);
  
  masterTables = updateRowInTable(masterTables, 'PersonalSanitario', 'id_profesional', id, sqlRow);
  
  await saveDatabase();
  return true;
}

/**
 * Añade un registro de signos vitales
 */
export async function addVitalSignsRecord(vitalSigns: Omit<VitalSigns, 'id'>): Promise<VitalSigns> {
  const id = generateId('VS');
  const newRecord: VitalSigns = { ...vitalSigns, id } as VitalSigns;
  
  // Crear registro principal
  const registroRow = {
    id_registro_sv: id,
    id_episodio: vitalSigns.patientId,
    fecha_hora: vitalSigns.timestamp.toISOString(),
    id_profesional: vitalSigns.recordedBy
  };
  
  dataTables = addRowToTable(dataTables, 'RegistroSignosVitales', registroRow);
  
  // Crear detalles de signos vitales
  const detalles = [
    { id_parametro_sv: '2', valor: String(vitalSigns.bloodPressure.systolic) },
    { id_parametro_sv: '3', valor: String(vitalSigns.bloodPressure.diastolic) },
    { id_parametro_sv: '19', valor: String(vitalSigns.heartRate) },
    { id_parametro_sv: '17', valor: String(vitalSigns.temperature) },
    { id_parametro_sv: '20', valor: String(vitalSigns.respiratoryRate) },
    { id_parametro_sv: '22', valor: String(vitalSigns.oxygenSaturation) }
  ];
  
  if (vitalSigns.weight) {
    detalles.push({ id_parametro_sv: '1', valor: String(vitalSigns.weight) });
  }
  if (vitalSigns.glucoseLevel) {
    detalles.push({ id_parametro_sv: '4', valor: String(vitalSigns.glucoseLevel) });
  }
  
  for (const detalle of detalles) {
    dataTables = addRowToTable(dataTables, 'DetalleSignoVital', {
      id_registro_sv: id,
      ...detalle
    });
  }
  
  await saveDatabase();
  return newRecord;
}

/**
 * Añade una orden médica
 */
export async function addMedicalOrder(order: Omit<MedicalOrder, 'id'>): Promise<MedicalOrder> {
  const id = generateId('ORD');
  const newOrder: MedicalOrder = { ...order, id } as MedicalOrder;
  
  const sqlRow = {
    id_orden: id,
    id_epsiosdio: order.patientId,
    id_profesional: order.physicianId,
    fecha_hora: order.orderDate.toISOString(),
    texto_orden: order.description
  };
  
  dataTables = addRowToTable(dataTables, 'OrdenMedica', sqlRow);
  
  await saveDatabase();
  return newOrder;
}

/**
 * Actualiza el estado de una cama
 */
export async function updateBedStatus(bedId: string, status: Bed['status']): Promise<boolean> {
  const estadoMapping: Record<string, string> = {
    'Available': 'operativa',
    'Occupied': 'ocupada',
    'Cleaning Required': 'limpieza',
    'Maintenance': 'mantenimiento',
    'Reserved': 'reservada'
  };
  
  masterTables = updateRowInTable(
    masterTables, 
    'Cama', 
    'id_cama', 
    bedId, 
    { Estado: estadoMapping[status] || 'operativa' }
  );
  
  await saveDatabase();
  return true;
}

/**
 * Añade una administración de medicamento
 */
export async function addMedicationAdministration(
  orderId: string,
  medicationId: string,
  dose: string,
  professionalId: string
): Promise<boolean> {
  const id = generateId('ADM');
  
  const sqlRow = {
    id_admin: id,
    id_orden: orderId,
    id_medicamento: medicationId,
    fecha_hora: new Date().toISOString(),
    dosis: dose,
    id_profesional: professionalId
  };
  
  dataTables = addRowToTable(dataTables, 'AdministracinMedicacin', sqlRow);
  
  await saveDatabase();
  return true;
}

/**
 * Añade un documento de enfermería
 */
export async function addNursingDocument(
  episodeId: string,
  professionalId: string,
  documentType: string,
  text: string
): Promise<boolean> {
  const id = generateId('ENF');
  
  const sqlRow = {
    id_documento_enf: id,
    id_episodio: episodeId,
    fecha_hora: new Date().toISOString(),
    id_profesional: professionalId,
    tipo_documento: documentType,
    texto: text
  };
  
  dataTables = addRowToTable(dataTables, 'DocumentoEnfermeria', sqlRow);
  
  await saveDatabase();
  return true;
}

/**
 * Crea un nuevo episodio clínico (admisión)
 */
export async function createEpisode(
  patientId: string,
  reason: string,
  professionalId: string
): Promise<string> {
  const id = generateId('EPI');
  
  const sqlRow = {
    id_episodio: id,
    id_paciente: patientId,
    fecha_hora_inicio: new Date().toISOString(),
    fecha_hora_fin: null,
    motivo_principal: reason,
    id_diagnostico: null
  };
  
  dataTables = addRowToTable(dataTables, 'EpisodioClinico', sqlRow);
  
  await saveDatabase();
  return id;
}

/**
 * Registra un movimiento de paciente
 */
export async function registerMovement(
  episodeId: string,
  patientId: string,
  origin: string,
  destination: string,
  roomId: string | null,
  bedId: string | null,
  professionalId: string,
  service: string
): Promise<boolean> {
  const id = generateId('MOV');
  
  const sqlRow = {
    id_movimiento: id,
    id_episodio: episodeId,
    id_paciente: patientId,
    fecha_hora_entrada: new Date().toISOString(),
    origen: origin,
    destino: destination,
    'id_habitación': roomId,
    id_cama: bedId,
    id_profesional_responsable: professionalId,
    servicio_clinico: service,
    fecha_hora_salida: null
  };
  
  dataTables = addRowToTable(dataTables, 'movimiento', sqlRow);
  
  // Si hay cama asignada, actualizar su estado
  if (bedId) {
    await updateBedStatus(bedId, 'Occupied');
  }
  
  await saveDatabase();
  return true;
}

/**
 * Finaliza un episodio clínico (alta)
 */
export async function dischargePatient(
  episodeId: string,
  dischargeReason: string,
  diagnosisCode: string | null,
  summary: string | null
): Promise<boolean> {
  // Actualizar episodio
  dataTables = updateRowInTable(
    dataTables,
    'EpisodioClinico',
    'id_episodio',
    episodeId,
    {
      fecha_hora_fin: new Date().toISOString(),
      id_diagnostico: diagnosisCode
    }
  );
  
  // Crear registro de alta
  const altaId = generateId('ALT');
  const altaRow = {
    id_alta: altaId,
    id_episodio: episodeId,
    fecha_hora_alta: new Date().toISOString(),
    motivo_alta: dischargeReason,
    destino_alta: 'Domicilio',
    id_diagnostico_alta: diagnosisCode,
    resumen_clinico: summary,
    tratamiento_alta: null
  };
  
  dataTables = addRowToTable(dataTables, 'AltaHospitalaria', altaRow);
  
  await saveDatabase();
  return true;
}

// ============================================
// FUNCIÓN DE EXPORTACIÓN DE DATOS
// ============================================

/**
 * Exporta todos los datos de la base de datos en formato JSON
 */
export function exportAllData() {
  return {
    patients: getPatients(),
    staff: getStaff(),
    ...getRoomsAndBeds(),
    medications: getMedications(),
    medicalOrders: getMedicalOrders(),
    vitalSigns: getVitalSigns(),
    services: getServices(),
    admissions: getAdmissions(),
    hospitalUnits: getHospitalUnits(),
    diagnoses: getDiagnoses()
  };
}

/**
 * Obtiene las tablas SQL crudas
 */
export function getRawTables() {
  return { masterTables, dataTables };
}

/**
 * Verifica si la base de datos está cargada
 */
export function isDatabaseLoaded(): boolean {
  return isLoaded;
}

/**
 * Obtiene el error de carga si existe
 */
export function getLoadError(): string | null {
  return loadError;
}
