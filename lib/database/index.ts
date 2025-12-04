/**
 * Database Module - Exportaciones centralizadas
 * 
 * Este módulo proporciona acceso a la base de datos SQL del hospital
 */

// Parser SQL
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

// Servicio de base de datos
export {
  initializeDatabase,
  saveDatabase,
  resetDatabase,
  getPatients,
  getPatientById,
  getStaff,
  getStaffById,
  getRoomsAndBeds,
  getMedications,
  getMedicalOrders,
  getVitalSigns,
  getServices,
  getAdmissions,
  getHospitalUnits,
  getDiagnoses,
  addPatient,
  updatePatient,
  deletePatient,
  addStaff,
  updateStaff,
  addVitalSignsRecord,
  addMedicalOrder,
  updateBedStatus,
  addMedicationAdministration,
  addNursingDocument,
  createEpisode,
  registerMovement,
  dischargePatient,
  exportAllData,
  getRawTables,
  isDatabaseLoaded
} from './db-service';

