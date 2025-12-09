/**
 * SQLite Database Service
 * Servicio completo para operaciones de base de datos usando SQLite
 */

import Database from 'better-sqlite3';
import { promises as fs, mkdirSync, existsSync } from 'fs';
import path from 'path';
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

// Ruta del archivo SQLite
const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'hospital.db');
const SQL_FILES_DIR = path.join(process.cwd(), 'sql_databases');

let db: Database.Database | null = null;
let isInitialized = false;

/**
 * Obtiene o crea la instancia de la base de datos
 */
function getDatabase(): Database.Database {
  if (!db) {
    // Asegurar que el directorio existe
    if (typeof window === 'undefined') {
      // Solo en servidor (Node.js)
      // Crear directorio si no existe
      if (!existsSync(DB_DIR)) {
        mkdirSync(DB_DIR, { recursive: true });
      }
      db = new Database(DB_PATH);
      db.pragma('foreign_keys = ON');
      db.pragma('journal_mode = WAL'); // Mejor rendimiento
    } else {
      // En el navegador, usar una versión en memoria o fallback
      throw new Error('SQLite solo funciona en el servidor (Node.js). Usa la API route.');
    }
  }
  return db;
}

/**
 * Inicializa la base de datos SQLite e importa datos si es necesario
 */
export async function initializeSQLiteDatabase(): Promise<void> {
  if (isInitialized && db) {
    console.log('✅ Base de datos SQLite ya inicializada');
    return;
  }

  // Solo funciona en servidor
  if (typeof window !== 'undefined') {
    console.warn('⚠️ SQLite solo funciona en servidor. Usando fallback.');
    return;
  }

  try {
    console.log('🔄 Inicializando base de datos SQLite...');
    
    const database = getDatabase();
    
    // Verificar si hay tablas (si no, importar datos)
    const tables = database.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `).all() as Array<{ name: string }>;
    
    if (tables.length === 0) {
      console.log('📥 Base de datos vacía, importando datos desde archivos SQL...');
      await importFromSQLFiles(database);
    } else {
      console.log(`✅ Base de datos ya contiene ${tables.length} tablas`);
    }
    
    isInitialized = true;
    console.log('✅ Base de datos SQLite inicializada correctamente');
    
  } catch (error) {
    console.error('❌ Error inicializando SQLite:', error);
    throw error;
  }
}

/**
 * Importa datos desde los archivos SQL existentes
 */
async function importFromSQLFiles(database: Database.Database): Promise<void> {
  try {
    // Leer archivos SQL
    const masterSQLPath = path.join(SQL_FILES_DIR, 'hospital_master_tables (1).sql');
    const dataSQLPath = path.join(SQL_FILES_DIR, 'database_all.sql');
    
    let masterSQL = '';
    let dataSQL = '';
    
    try {
      masterSQL = await fs.readFile(masterSQLPath, 'utf-8');
    } catch (e) {
      console.warn('⚠️ No se pudo leer hospital_master_tables:', e);
    }
    
    try {
      dataSQL = await fs.readFile(dataSQLPath, 'utf-8');
    } catch (e) {
      console.warn('⚠️ No se pudo leer database_all:', e);
    }
    
    // Limpiar y adaptar SQL para SQLite
    const cleanedMasterSQL = adaptSQLForSQLite(masterSQL);
    const cleanedDataSQL = adaptSQLForSQLite(dataSQL);
    
    // Ejecutar en transacción
    database.transaction(() => {
      // Ejecutar CREATE TABLE statements
      const createTableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"]?(\w+)[`"]?\s*\(([\s\S]*?)\)(?:\s*ENGINE[^;]*)?;/gi;
      
      // Procesar master tables
      let match;
      while ((match = createTableRegex.exec(cleanedMasterSQL + cleanedDataSQL)) !== null) {
        const tableName = match[1];
        const columnsSection = match[2];
        
        // Adaptar columnas para SQLite
        const adaptedColumns = columnsSection
          .split(',')
          .map(col => {
            const trimmed = col.trim();
            // Convertir tipos MySQL a SQLite
            return trimmed
              .replace(/VARCHAR\(\d+\)/gi, 'TEXT')
              .replace(/INT\(\d+\)/gi, 'INTEGER')
              .replace(/DATETIME/gi, 'TEXT')
              .replace(/DATE/gi, 'TEXT')
              .replace(/TEXT/gi, 'TEXT')
              .replace(/ENUM\([^)]+\)/gi, 'TEXT');
          })
          .filter(col => col.length > 0 && !col.match(/^(PRIMARY|FOREIGN|UNIQUE|KEY|CONSTRAINT)/i));
        
        if (adaptedColumns.length > 0) {
          const createSQL = `CREATE TABLE IF NOT EXISTS ${tableName} (${adaptedColumns.join(', ')})`;
          try {
            database.exec(createSQL);
          } catch (e: any) {
            console.warn(`⚠️ Error creando tabla ${tableName}:`, e.message);
          }
        }
      }
      
      // Ejecutar INSERT statements
      const insertRegex = /INSERT\s+INTO\s+[`"]?(\w+)[`"]?\s*VALUES\s*([\s\S]*?)(?=INSERT\s+INTO|CREATE\s+TABLE|$)/gi;
      
      while ((match = insertRegex.exec(cleanedMasterSQL + cleanedDataSQL)) !== null) {
        const tableName = match[1];
        let valuesSection = match[2].trim();
        
        // Remover punto y coma final
        if (valuesSection.endsWith(';')) {
          valuesSection = valuesSection.slice(0, -1);
        }
        
        // Procesar múltiples valores
        const valueGroups = extractValueGroups(valuesSection);
        
        for (const valueGroup of valueGroups) {
          const values = parseValuesFromGroup(valueGroup);
          
          if (values.length > 0) {
            const placeholders = values.map(() => '?').join(', ');
            const insertSQL = `INSERT INTO ${tableName} VALUES (${placeholders})`;
            
            try {
              database.prepare(insertSQL).run(...values);
            } catch (e: any) {
              // Ignorar errores de duplicados o constraint
              if (!e.message.includes('UNIQUE') && !e.message.includes('constraint')) {
                console.warn(`⚠️ Error insertando en ${tableName}:`, e.message);
              }
            }
          }
        }
      }
    })();
    
    console.log('✅ Datos importados correctamente desde archivos SQL');
    
  } catch (error) {
    console.error('❌ Error importando datos:', error);
    throw error;
  }
}

/**
 * Adapta SQL de MySQL a SQLite
 */
function adaptSQLForSQLite(sql: string): string {
  return sql
    .replace(/--.*$/gm, '') // Remover comentarios
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remover comentarios de bloque
    .replace(/ENGINE=InnoDB[^;]*/gi, '') // Remover ENGINE
    .replace(/DEFAULT CHARSET=[^;]*/gi, '') // Remover CHARSET
    .replace(/COLLATE=[^;]*/gi, '') // Remover COLLATE
    .replace(/AUTO_INCREMENT/gi, 'AUTOINCREMENT')
    .replace(/`/g, ''); // Remover backticks
}

/**
 * Extrae grupos de valores de un INSERT statement
 */
function extractValueGroups(valuesSection: string): string[] {
  const groups: string[] = [];
  let currentGroup = '';
  let depth = 0;
  let inString = false;
  let stringChar = '';
  
  for (let i = 0; i < valuesSection.length; i++) {
    const char = valuesSection[i];
    const nextChar = valuesSection[i + 1];
    
    if ((char === '"' || char === "'") && (i === 0 || valuesSection[i - 1] !== '\\')) {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
        stringChar = '';
      }
    }
    
    if (!inString) {
      if (char === '(') {
        depth++;
        if (depth === 1) {
          currentGroup = '';
          continue;
        }
      } else if (char === ')') {
        depth--;
        if (depth === 0) {
          groups.push(currentGroup.trim());
          currentGroup = '';
          continue;
        }
      }
    }
    
    if (depth > 0) {
      currentGroup += char;
    }
  }
  
  return groups;
}

/**
 * Parsea valores de un grupo de valores
 */
function parseValuesFromGroup(valueGroup: string): Array<string | null> {
  const values: Array<string | null> = [];
  let currentValue = '';
  let inString = false;
  let stringChar = '';
  
  for (let i = 0; i < valueGroup.length; i++) {
    const char = valueGroup[i];
    
    if ((char === '"' || char === "'") && (i === 0 || valueGroup[i - 1] !== '\\')) {
      if (!inString) {
        inString = true;
        stringChar = char;
        continue;
      } else if (char === stringChar) {
        inString = false;
        stringChar = '';
        continue;
      }
    }
    
    if (!inString && char === ',') {
      const trimmed = currentValue.trim();
      values.push(trimmed === 'NULL' || trimmed === '' ? null : trimmed.replace(/^['"]|['"]$/g, ''));
      currentValue = '';
      continue;
    }
    
    currentValue += char;
  }
  
  // Último valor
  const trimmed = currentValue.trim();
  values.push(trimmed === 'NULL' || trimmed === '' ? null : trimmed.replace(/^['"]|['"]$/g, ''));
  
  return values;
}

/**
 * Cierra la conexión a la base de datos
 */
export function closeSQLiteDatabase(): void {
  if (db) {
    db.close();
    db = null;
    isInitialized = false;
  }
}

// ============================================
// FUNCIONES DE LECTURA
// ============================================

/**
 * Obtiene todos los pacientes usando SQLite
 */
export function getPatientsSQLite(): Patient[] {
  if (typeof window !== 'undefined') {
    // En navegador, usar fallback
    return [];
  }
  
  try {
    const database = getDatabase();
    
    // Obtener datos de las tablas SQL
    const pacienteRows = database.prepare('SELECT * FROM Paciente').all() as any[];
    const movimientoRows = database.prepare('SELECT * FROM movimiento').all() as any[];
    const episodioRows = database.prepare('SELECT * FROM EpisodioClinico').all() as any[];
    
    // Convertir a formato SQLTable para usar el adaptador existente
    const pacienteTable = {
      name: 'Paciente',
      columns: pacienteRows.length > 0 ? Object.keys(pacienteRows[0]) : [],
      rows: pacienteRows
    };
    
    const movimientoTable = {
      name: 'movimiento',
      columns: movimientoRows.length > 0 ? Object.keys(movimientoRows[0]) : [],
      rows: movimientoRows
    };
    
    const episodioTable = {
      name: 'EpisodioClinico',
      columns: episodioRows.length > 0 ? Object.keys(episodioRows[0]) : [],
      rows: episodioRows
    };
    
    return sqlPatientsToAppPatients(pacienteTable, movimientoTable, episodioTable);
  } catch (error) {
    console.error('Error obteniendo pacientes:', error);
    return [];
  }
}

/**
 * Obtiene un paciente por ID
 */
export function getPatientByIdSQLite(id: string): Patient | undefined {
  return getPatientsSQLite().find(p => p.id === id);
}

/**
 * Obtiene todo el personal sanitario
 */
export function getStaffSQLite(): User[] {
  if (typeof window !== 'undefined') {
    return [];
  }
  
  try {
    const database = getDatabase();
    const rows = database.prepare('SELECT * FROM PersonalSanitario').all() as any[];
    
    const personalTable = {
      name: 'PersonalSanitario',
      columns: rows.length > 0 ? Object.keys(rows[0]) : [],
      rows
    };
    
    return sqlStaffToAppUsers(personalTable);
  } catch (error) {
    console.error('Error obteniendo personal:', error);
    return [];
  }
}

/**
 * Obtiene un miembro del personal por ID
 */
export function getStaffByIdSQLite(id: string): User | undefined {
  return getStaffSQLite().find(s => s.id === id || s.professionalId === id);
}

/**
 * Obtiene todas las habitaciones y camas
 */
export function getRoomsAndBedsSQLite(): { rooms: Room[], beds: Bed[] } {
  if (typeof window !== 'undefined') {
    return { rooms: [], beds: [] };
  }
  
  try {
    const database = getDatabase();
    const habitacionRows = database.prepare('SELECT * FROM Habitacion').all() as any[];
    const camaRows = database.prepare('SELECT * FROM Cama').all() as any[];
    const unidadRows = database.prepare('SELECT * FROM UnidadHospitalaria').all() as any[];
    
    const habitacionTable = {
      name: 'Habitacion',
      columns: habitacionRows.length > 0 ? Object.keys(habitacionRows[0]) : [],
      rows: habitacionRows
    };
    
    const camaTable = {
      name: 'Cama',
      columns: camaRows.length > 0 ? Object.keys(camaRows[0]) : [],
      rows: camaRows
    };
    
    const unidadTable = {
      name: 'UnidadHospitalaria',
      columns: unidadRows.length > 0 ? Object.keys(unidadRows[0]) : [],
      rows: unidadRows
    };
    
    return sqlRoomsToAppRooms(habitacionTable, camaTable, unidadTable);
  } catch (error) {
    console.error('Error obteniendo habitaciones y camas:', error);
    return { rooms: [], beds: [] };
  }
}

/**
 * Obtiene todos los medicamentos
 */
export function getMedicationsSQLite(): Medication[] {
  if (typeof window !== 'undefined') {
    return [];
  }
  
  try {
    const database = getDatabase();
    const medicamentoRows = database.prepare('SELECT * FROM Medicamento').all() as any[];
    const adminRows = database.prepare('SELECT * FROM AdministracinMedicacin').all() as any[];
    const ordenRows = database.prepare('SELECT * FROM OrdenMedica').all() as any[];
    
    const medicamentoTable = {
      name: 'Medicamento',
      columns: medicamentoRows.length > 0 ? Object.keys(medicamentoRows[0]) : [],
      rows: medicamentoRows
    };
    
    const adminTable = {
      name: 'AdministracinMedicacin',
      columns: adminRows.length > 0 ? Object.keys(adminRows[0]) : [],
      rows: adminRows
    };
    
    const ordenTable = {
      name: 'OrdenMedica',
      columns: ordenRows.length > 0 ? Object.keys(ordenRows[0]) : [],
      rows: ordenRows
    };
    
    return sqlMedicationsToAppMedications(medicamentoTable, adminTable, ordenTable);
  } catch (error) {
    console.error('Error obteniendo medicamentos:', error);
    return [];
  }
}

/**
 * Obtiene todas las órdenes médicas
 */
export function getMedicalOrdersSQLite(): MedicalOrder[] {
  if (typeof window !== 'undefined') {
    return [];
  }
  
  try {
    const database = getDatabase();
    const ordenRows = database.prepare('SELECT * FROM OrdenMedica').all() as any[];
    const personalRows = database.prepare('SELECT * FROM PersonalSanitario').all() as any[];
    
    const ordenTable = {
      name: 'OrdenMedica',
      columns: ordenRows.length > 0 ? Object.keys(ordenRows[0]) : [],
      rows: ordenRows
    };
    
    const personalTable = {
      name: 'PersonalSanitario',
      columns: personalRows.length > 0 ? Object.keys(personalRows[0]) : [],
      rows: personalRows
    };
    
    return sqlOrdersToAppOrders(ordenTable, personalTable);
  } catch (error) {
    console.error('Error obteniendo órdenes médicas:', error);
    return [];
  }
}

/**
 * Obtiene todos los signos vitales
 */
export function getVitalSignsSQLite(): VitalSigns[] {
  if (typeof window !== 'undefined') {
    return [];
  }
  
  try {
    const database = getDatabase();
    const registroRows = database.prepare('SELECT * FROM RegistroSignosVitales').all() as any[];
    const detalleRows = database.prepare('SELECT * FROM DetalleSignoVital').all() as any[];
    const parametroRows = database.prepare('SELECT * FROM ParametroSignoVital').all() as any[];
    
    const registroTable = {
      name: 'RegistroSignosVitales',
      columns: registroRows.length > 0 ? Object.keys(registroRows[0]) : [],
      rows: registroRows
    };
    
    const detalleTable = {
      name: 'DetalleSignoVital',
      columns: detalleRows.length > 0 ? Object.keys(detalleRows[0]) : [],
      rows: detalleRows
    };
    
    const parametroTable = {
      name: 'ParametroSignoVital',
      columns: parametroRows.length > 0 ? Object.keys(parametroRows[0]) : [],
      rows: parametroRows
    };
    
    return sqlVitalSignsToAppVitalSigns(registroTable, detalleTable, parametroTable);
  } catch (error) {
    console.error('Error obteniendo signos vitales:', error);
    return [];
  }
}

/**
 * Obtiene todos los servicios/prestaciones
 */
export function getServicesSQLite(): Service[] {
  if (typeof window !== 'undefined') {
    return [];
  }
  
  try {
    const database = getDatabase();
    const rows = database.prepare('SELECT * FROM Prestacion').all() as any[];
    
    const prestacionTable = {
      name: 'Prestacion',
      columns: rows.length > 0 ? Object.keys(rows[0]) : [],
      rows
    };
    
    return sqlServicesToAppServices(prestacionTable);
  } catch (error) {
    console.error('Error obteniendo servicios:', error);
    return [];
  }
}

/**
 * Obtiene todas las admisiones/episodios
 */
export function getAdmissionsSQLite(): Admission[] {
  if (typeof window !== 'undefined') {
    return [];
  }
  
  try {
    const database = getDatabase();
    const episodioRows = database.prepare('SELECT * FROM EpisodioClinico').all() as any[];
    const movimientoRows = database.prepare('SELECT * FROM movimiento').all() as any[];
    
    const episodioTable = {
      name: 'EpisodioClinico',
      columns: episodioRows.length > 0 ? Object.keys(episodioRows[0]) : [],
      rows: episodioRows
    };
    
    const movimientoTable = {
      name: 'movimiento',
      columns: movimientoRows.length > 0 ? Object.keys(movimientoRows[0]) : [],
      rows: movimientoRows
    };
    
    return sqlEpisodesToAppAdmissions(episodioTable, movimientoTable);
  } catch (error) {
    console.error('Error obteniendo admisiones:', error);
    return [];
  }
}

/**
 * Obtiene las unidades hospitalarias
 */
export function getHospitalUnitsSQLite() {
  if (typeof window !== 'undefined') {
    return [];
  }
  
  try {
    const database = getDatabase();
    const rows = database.prepare('SELECT * FROM UnidadHospitalaria').all() as any[];
    
    return rows.map((row: any) => ({
      id: row.id_unidad || '',
      name: row.Nombre_unidad || '',
      type: row.Tipo_unidad || ''
    }));
  } catch (error) {
    console.error('Error obteniendo unidades:', error);
    return [];
  }
}

/**
 * Obtiene los diagnósticos
 */
export function getDiagnosesSQLite() {
  if (typeof window !== 'undefined') {
    return [];
  }
  
  try {
    const database = getDatabase();
    const rows = database.prepare('SELECT * FROM Diagnostico').all() as any[];
    
    return rows.map((row: any) => ({
      id: row.id_diagnostico || '',
      description: row.Descripcion || ''
    }));
  } catch (error) {
    console.error('Error obteniendo diagnósticos:', error);
    return [];
  }
}

// ============================================
// FUNCIONES DE ESCRITURA
// ============================================

/**
 * Añade un nuevo paciente
 */
export async function addPatientSQLite(patient: Omit<Patient, 'id'>): Promise<Patient> {
  if (typeof window !== 'undefined') {
    throw new Error('SQLite solo funciona en servidor');
  }
  
  const id = generateId('PAT');
  const newPatient: Patient = { ...patient, id } as Patient;
  
  const sqlRow = appPatientToSQLRow(newPatient);
  const database = getDatabase();
  
  database.prepare(`
    INSERT INTO Paciente (
      id_paciente, Nombre, Apellidos, Fecha_nacimiento, 
      Sexo, ID_documento, HealthCard_Number, Direccion, 
      Phone, Email, Emergency_Contact
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    sqlRow.id_paciente,
    sqlRow.Nombre,
    sqlRow.Apellidos,
    sqlRow.Fecha_nacimiento,
    sqlRow.Sexo,
    sqlRow.ID_documento,
    sqlRow.HealthCard_Number,
    sqlRow.Direccion,
    sqlRow.Phone,
    sqlRow.Email,
    sqlRow.Emergency_Contact
  );
  
  return newPatient;
}

/**
 * Actualiza un paciente existente
 */
export async function updatePatientSQLite(id: string, updates: Partial<Patient>): Promise<boolean> {
  if (typeof window !== 'undefined') {
    throw new Error('SQLite solo funciona en servidor');
  }
  
  const existingPatient = getPatientByIdSQLite(id);
  if (!existingPatient) return false;
  
  const updatedPatient = { ...existingPatient, ...updates };
  const sqlRow = appPatientToSQLRow(updatedPatient);
  const database = getDatabase();
  
  database.prepare(`
    UPDATE Paciente 
    SET Nombre = ?, Apellidos = ?, Fecha_nacimiento = ?, 
        Sexo = ?, ID_documento = ?, HealthCard_Number = ?,
        Direccion = ?, Phone = ?, Email = ?, Emergency_Contact = ?
    WHERE id_paciente = ?
  `).run(
    sqlRow.Nombre,
    sqlRow.Apellidos,
    sqlRow.Fecha_nacimiento,
    sqlRow.Sexo,
    sqlRow.ID_documento,
    sqlRow.HealthCard_Number,
    sqlRow.Direccion,
    sqlRow.Phone,
    sqlRow.Email,
    sqlRow.Emergency_Contact,
    id
  );
  
  return true;
}

/**
 * Elimina un paciente
 */
export async function deletePatientSQLite(id: string): Promise<boolean> {
  if (typeof window !== 'undefined') {
    throw new Error('SQLite solo funciona en servidor');
  }
  
  const database = getDatabase();
  database.prepare('DELETE FROM Paciente WHERE id_paciente = ?').run(id);
  return true;
}

/**
 * Añade un nuevo miembro del personal
 */
export async function addStaffSQLite(user: Omit<User, 'id'>): Promise<User> {
  if (typeof window !== 'undefined') {
    throw new Error('SQLite solo funciona en servidor');
  }
  
  const id = generateId('STAFF');
  const newUser: User = { ...user, id } as User;
  const sqlRow = appUserToSQLRow(newUser);
  const database = getDatabase();
  
  database.prepare(`
    INSERT INTO PersonalSanitario (id_profesional, Nombre, Apellidos, rol, Especialidad)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    sqlRow.id_profesional,
    sqlRow.Nombre,
    sqlRow.Apellidos,
    sqlRow.rol,
    sqlRow.Especialidad
  );
  
  return newUser;
}

/**
 * Actualiza un miembro del personal
 */
export async function updateStaffSQLite(id: string, updates: Partial<User>): Promise<boolean> {
  if (typeof window !== 'undefined') {
    throw new Error('SQLite solo funciona en servidor');
  }
  
  const existingUser = getStaffByIdSQLite(id);
  if (!existingUser) return false;
  
  const updatedUser = { ...existingUser, ...updates };
  const sqlRow = appUserToSQLRow(updatedUser);
  const database = getDatabase();
  
  database.prepare(`
    UPDATE PersonalSanitario 
    SET Nombre = ?, Apellidos = ?, rol = ?, Especialidad = ?
    WHERE id_profesional = ?
  `).run(
    sqlRow.Nombre,
    sqlRow.Apellidos,
    sqlRow.rol,
    sqlRow.Especialidad,
    id
  );
  
  return true;
}

/**
 * Añade un registro de signos vitales
 */
export async function addVitalSignsRecordSQLite(vitalSigns: Omit<VitalSigns, 'id'>): Promise<VitalSigns> {
  if (typeof window !== 'undefined') {
    throw new Error('SQLite solo funciona en servidor');
  }
  
  const id = generateId('VS');
  const newRecord: VitalSigns = { ...vitalSigns, id } as VitalSigns;
  const database = getDatabase();
  
  database.transaction(() => {
    // Crear registro principal
    database.prepare(`
      INSERT INTO RegistroSignosVitales (id_registro_sv, id_episodio, fecha_hora, id_profesional)
      VALUES (?, ?, ?, ?)
    `).run(
      id,
      vitalSigns.patientId,
      vitalSigns.timestamp.toISOString(),
      vitalSigns.recordedBy
    );
    
    // Crear detalles
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
    
    const insertDetalle = database.prepare(`
      INSERT INTO DetalleSignoVital (id_registro_sv, id_parametro_sv, valor)
      VALUES (?, ?, ?)
    `);
    
    for (const detalle of detalles) {
      insertDetalle.run(id, detalle.id_parametro_sv, detalle.valor);
    }
  })();
  
  return newRecord;
}

/**
 * Añade una orden médica
 */
export async function addMedicalOrderSQLite(order: Omit<MedicalOrder, 'id'>): Promise<MedicalOrder> {
  if (typeof window !== 'undefined') {
    throw new Error('SQLite solo funciona en servidor');
  }
  
  const id = generateId('ORD');
  const newOrder: MedicalOrder = { ...order, id } as MedicalOrder;
  const database = getDatabase();
  
  database.prepare(`
    INSERT INTO OrdenMedica (id_orden, id_epsiosdio, id_profesional, fecha_hora, texto_orden)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    id,
    order.patientId,
    order.physicianId,
    order.orderDate.toISOString(),
    order.description
  );
  
  return newOrder;
}

/**
 * Actualiza el estado de una cama
 */
export async function updateBedStatusSQLite(bedId: string, status: Bed['status']): Promise<boolean> {
  if (typeof window !== 'undefined') {
    throw new Error('SQLite solo funciona en servidor');
  }
  
  const estadoMapping: Record<string, string> = {
    'Available': 'operativa',
    'Occupied': 'ocupada',
    'Cleaning Required': 'limpieza',
    'Maintenance': 'mantenimiento',
    'Reserved': 'reservada'
  };
  
  const database = getDatabase();
  database.prepare('UPDATE Cama SET Estado = ? WHERE id_cama = ?').run(
    estadoMapping[status] || 'operativa',
    bedId
  );
  
  return true;
}

/**
 * Añade una administración de medicamento
 */
export async function addMedicationAdministrationSQLite(
  orderId: string,
  medicationId: string,
  dose: string,
  professionalId: string
): Promise<boolean> {
  if (typeof window !== 'undefined') {
    throw new Error('SQLite solo funciona en servidor');
  }
  
  const id = generateId('ADM');
  const database = getDatabase();
  
  database.prepare(`
    INSERT INTO AdministracinMedicacin (id_admin, id_orden, id_medicamento, fecha_hora, dosis, id_profesional)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    id,
    orderId,
    medicationId,
    new Date().toISOString(),
    dose,
    professionalId
  );
  
  return true;
}

/**
 * Añade un documento de enfermería
 */
export async function addNursingDocumentSQLite(
  episodeId: string,
  professionalId: string,
  documentType: string,
  text: string
): Promise<boolean> {
  if (typeof window !== 'undefined') {
    throw new Error('SQLite solo funciona en servidor');
  }
  
  const id = generateId('ENF');
  const database = getDatabase();
  
  database.prepare(`
    INSERT INTO DocumentoEnfermeria (id_documento_enf, id_episodio, fecha_hora, id_profesional, tipo_documento, texto)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    id,
    episodeId,
    new Date().toISOString(),
    professionalId,
    documentType,
    text
  );
  
  return true;
}

/**
 * Crea un nuevo episodio clínico (admisión)
 */
export async function createEpisodeSQLite(
  patientId: string,
  reason: string,
  professionalId: string
): Promise<string> {
  if (typeof window !== 'undefined') {
    throw new Error('SQLite solo funciona en servidor');
  }
  
  const id = generateId('EPI');
  const database = getDatabase();
  
  database.prepare(`
    INSERT INTO EpisodioClinico (id_episodio, id_paciente, fecha_hora_inicio, fecha_hora_fin, motivo_principal, id_diagnostico)
    VALUES (?, ?, ?, NULL, ?, NULL)
  `).run(
    id,
    patientId,
    new Date().toISOString(),
    reason
  );
  
  return id;
}

/**
 * Registra un movimiento de paciente
 */
export async function registerMovementSQLite(
  episodeId: string,
  patientId: string,
  origin: string,
  destination: string,
  roomId: string | null,
  bedId: string | null,
  professionalId: string,
  service: string
): Promise<boolean> {
  if (typeof window !== 'undefined') {
    throw new Error('SQLite solo funciona en servidor');
  }
  
  const id = generateId('MOV');
  const database = getDatabase();
  
  database.prepare(`
    INSERT INTO movimiento (id_movimiento, id_episodio, id_paciente, fecha_hora_entrada, origen, destino, id_habitación, id_cama, id_profesional_responsable, servicio_clinico, fecha_hora_salida)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)
  `).run(
    id,
    episodeId,
    patientId,
    new Date().toISOString(),
    origin,
    destination,
    roomId,
    bedId,
    professionalId,
    service
  );
  
  // Si hay cama asignada, actualizar su estado
  if (bedId) {
    await updateBedStatusSQLite(bedId, 'Occupied');
  }
  
  return true;
}

/**
 * Finaliza un episodio clínico (alta)
 */
export async function dischargePatientSQLite(
  episodeId: string,
  dischargeReason: string,
  diagnosisCode: string | null,
  summary: string | null
): Promise<boolean> {
  if (typeof window !== 'undefined') {
    throw new Error('SQLite solo funciona en servidor');
  }
  
  const database = getDatabase();
  
  database.transaction(() => {
    // Actualizar episodio
    database.prepare(`
      UPDATE EpisodioClinico 
      SET fecha_hora_fin = ?, id_diagnostico = ?
      WHERE id_episodio = ?
    `).run(
      new Date().toISOString(),
      diagnosisCode,
      episodeId
    );
    
    // Crear registro de alta
    const altaId = generateId('ALT');
    database.prepare(`
      INSERT INTO AltaHospitalaria (id_alta, id_episodio, fecha_hora_alta, motivo_alta, destino_alta, id_diagnostico_alta, resumen_clinico, tratamiento_alta)
      VALUES (?, ?, ?, ?, 'Domicilio', ?, ?, NULL)
    `).run(
      altaId,
      episodeId,
      new Date().toISOString(),
      dischargeReason,
      diagnosisCode,
      summary
    );
  })();
  
  return true;
}

/**
 * Elimina un miembro del personal
 */
export async function deleteStaffSQLite(id: string): Promise<boolean> {
  if (typeof window !== 'undefined') {
    throw new Error('SQLite solo funciona en servidor');
  }
  
  const database = getDatabase();
  database.prepare('DELETE FROM PersonalSanitario WHERE id_profesional = ?').run(id);
  return true;
}

/**
 * Exporta todos los datos de la base de datos
 */
export function exportAllDataSQLite() {
  return {
    patients: getPatientsSQLite(),
    staff: getStaffSQLite(),
    ...getRoomsAndBedsSQLite(),
    medications: getMedicationsSQLite(),
    medicalOrders: getMedicalOrdersSQLite(),
    vitalSigns: getVitalSignsSQLite(),
    services: getServicesSQLite(),
    admissions: getAdmissionsSQLite(),
    hospitalUnits: getHospitalUnitsSQLite(),
    diagnoses: getDiagnosesSQLite()
  };
}

/**
 * Verifica si la base de datos está inicializada
 */
export function isSQLiteDatabaseLoaded(): boolean {
  return isInitialized;
}

/**
 * Resetea la base de datos eliminando todas las tablas
 */
export async function resetSQLiteDatabase(): Promise<void> {
  if (typeof window !== 'undefined') {
    throw new Error('SQLite solo funciona en servidor');
  }
  
  const database = getDatabase();
  
  database.transaction(() => {
    // Obtener todas las tablas
    const tables = database.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `).all() as Array<{ name: string }>;
    
    // Eliminar todas las tablas
    for (const table of tables) {
      database.prepare(`DROP TABLE IF EXISTS ${table.name}`).run();
    }
  })();
  
  // Reimportar datos
  await importFromSQLFiles(database);
}

