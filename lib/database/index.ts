/**
 * Database Module - Exportaciones centralizadas
 * 
 * Este módulo proporciona acceso a la base de datos SQLite del hospital
 */

// Parser SQL (mantenido para compatibilidad)
export { 
  parseSQLContent, 
  generateSQLContent, 
  addRowToTable, 
  updateRowInTable, 
  deleteRowFromTable,
  findRows,
  type SQLTable,
  type ParsedDatabase 
} from './sql-parser';

// Adaptador de datos
export {
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

// ============================================
// SERVICIO SQLITE - Exportaciones principales
// ============================================

export {
  // Inicialización
  initializeSQLiteDatabase as initializeDatabase,
  closeSQLiteDatabase as closeDatabase,
  resetSQLiteDatabase as resetDatabase,
  isSQLiteDatabaseLoaded as isDatabaseLoaded,
  
  // Lectura de datos
  getPatientsSQLite as getPatients,
  getPatientByIdSQLite as getPatientById,
  getStaffSQLite as getStaff,
  getStaffByIdSQLite as getStaffById,
  getRoomsAndBedsSQLite as getRoomsAndBeds,
  getMedicationsSQLite as getMedications,
  getMedicalOrdersSQLite as getMedicalOrders,
  getVitalSignsSQLite as getVitalSigns,
  getServicesSQLite as getServices,
  getAdmissionsSQLite as getAdmissions,
  getHospitalUnitsSQLite as getHospitalUnits,
  getDiagnosesSQLite as getDiagnoses,
  
  // Escritura de datos - Pacientes
  addPatientSQLite as addPatient,
  updatePatientSQLite as updatePatient,
  deletePatientSQLite as deletePatient,
  
  // Escritura de datos - Personal
  addStaffSQLite as addStaff,
  updateStaffSQLite as updateStaff,
  deleteStaffSQLite as deleteStaff,
  
  // Escritura de datos - Signos vitales
  addVitalSignsRecordSQLite as addVitalSignsRecord,
  
  // Escritura de datos - Órdenes médicas
  addMedicalOrderSQLite as addMedicalOrder,
  
  // Escritura de datos - Camas
  updateBedStatusSQLite as updateBedStatus,
  
  // Escritura de datos - Medicación
  addMedicationAdministrationSQLite as addMedicationAdministration,
  
  // Escritura de datos - Enfermería
  addNursingDocumentSQLite as addNursingDocument,
  
  // Escritura de datos - Episodios y movimientos
  createEpisodeSQLite as createEpisode,
  registerMovementSQLite as registerMovement,
  dischargePatientSQLite as dischargePatient,
  
  // Exportación
  exportAllDataSQLite as exportAllData
} from './sqlite-service';

// Función dummy para saveDatabase (SQLite guarda automáticamente)
export async function saveDatabase(): Promise<boolean> {
  // SQLite guarda automáticamente, no se necesita acción
  return true;
}

// Función para obtener tablas crudas (compatibilidad)
export function getRawTables() {
  return { masterTables: {}, dataTables: {} };
}
