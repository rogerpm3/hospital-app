/**
 * API Route para operaciones SQLite
 * Expone las funciones de SQLite al cliente
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  initializeSQLiteDatabase,
  getPatientsSQLite,
  getStaffSQLite,
  getRoomsAndBedsSQLite,
  getMedicationsSQLite,
  getMedicalOrdersSQLite,
  getVitalSignsSQLite,
  getServicesSQLite,
  getAdmissionsSQLite,
  getHospitalUnitsSQLite,
  getDiagnosesSQLite,
  addPatientSQLite,
  updatePatientSQLite,
  deletePatientSQLite,
  addStaffSQLite,
  updateStaffSQLite,
  deleteStaffSQLite,
  addVitalSignsRecordSQLite,
  addMedicalOrderSQLite,
  updateBedStatusSQLite,
  addMedicationAdministrationSQLite,
  addNursingDocumentSQLite,
  createEpisodeSQLite,
  registerMovementSQLite,
  dischargePatientSQLite,
  resetSQLiteDatabase,
  exportAllDataSQLite
} from '@/lib/database/sqlite-service';

// Inicializar base de datos al cargar el módulo
let dbInitialized = false;

async function ensureInitialized() {
  if (!dbInitialized) {
    await initializeSQLiteDatabase();
    dbInitialized = true;
  }
}

/**
 * GET - Obtiene datos de la base de datos SQLite
 */
export async function GET(request: NextRequest) {
  try {
    await ensureInitialized();
    
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    switch (action) {
      case 'patients':
        return NextResponse.json({ data: getPatientsSQLite() });
      
      case 'staff':
        return NextResponse.json({ data: getStaffSQLite() });
      
      case 'rooms-beds':
        return NextResponse.json({ data: getRoomsAndBedsSQLite() });
      
      case 'medications':
        return NextResponse.json({ data: getMedicationsSQLite() });
      
      case 'orders':
        return NextResponse.json({ data: getMedicalOrdersSQLite() });
      
      case 'vitals':
        return NextResponse.json({ data: getVitalSignsSQLite() });
      
      case 'services':
        return NextResponse.json({ data: getServicesSQLite() });
      
      case 'admissions':
        return NextResponse.json({ data: getAdmissionsSQLite() });
      
      case 'hospital-units':
        return NextResponse.json({ data: getHospitalUnitsSQLite() });
      
      case 'diagnoses':
        return NextResponse.json({ data: getDiagnosesSQLite() });
      
      case 'all':
        return NextResponse.json({ data: exportAllDataSQLite() });
      
      default:
        return NextResponse.json({ 
          error: 'Acción no válida',
          availableActions: [
            'patients', 'staff', 'rooms-beds', 'medications', 
            'orders', 'vitals', 'services', 'admissions',
            'hospital-units', 'diagnoses', 'all'
          ]
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Error en GET /api/sqlite:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST - Escribe datos en la base de datos SQLite
 */
export async function POST(request: NextRequest) {
  try {
    await ensureInitialized();
    
    const body = await request.json();
    const { action, data } = body;
    
    switch (action) {
      // ============================================
      // PACIENTES
      // ============================================
      case 'add-patient':
        const newPatient = await addPatientSQLite(data);
        return NextResponse.json({ success: true, data: newPatient });
      
      case 'update-patient':
        const patientUpdated = await updatePatientSQLite(data.id, data.updates);
        return NextResponse.json({ success: patientUpdated });
      
      case 'delete-patient':
        const patientDeleted = await deletePatientSQLite(data.id);
        return NextResponse.json({ success: patientDeleted });
      
      // ============================================
      // PERSONAL
      // ============================================
      case 'add-staff':
        const newStaff = await addStaffSQLite(data);
        return NextResponse.json({ success: true, data: newStaff });
      
      case 'update-staff':
        const staffUpdated = await updateStaffSQLite(data.id, data.updates);
        return NextResponse.json({ success: staffUpdated });
      
      case 'delete-staff':
        const staffDeleted = await deleteStaffSQLite(data.id);
        return NextResponse.json({ success: staffDeleted });
      
      // ============================================
      // SIGNOS VITALES
      // ============================================
      case 'add-vital-signs':
        const newVitals = await addVitalSignsRecordSQLite({
          ...data,
          timestamp: new Date(data.timestamp)
        });
        return NextResponse.json({ success: true, data: newVitals });
      
      // ============================================
      // ÓRDENES MÉDICAS
      // ============================================
      case 'add-medical-order':
        const newOrder = await addMedicalOrderSQLite({
          ...data,
          orderDate: new Date(data.orderDate)
        });
        return NextResponse.json({ success: true, data: newOrder });
      
      // ============================================
      // CAMAS
      // ============================================
      case 'update-bed-status':
        const bedUpdated = await updateBedStatusSQLite(data.bedId, data.status);
        return NextResponse.json({ success: bedUpdated });
      
      // ============================================
      // MEDICACIÓN
      // ============================================
      case 'add-medication-administration':
        const medAdminAdded = await addMedicationAdministrationSQLite(
          data.orderId,
          data.medicationId,
          data.dose,
          data.professionalId
        );
        return NextResponse.json({ success: medAdminAdded });
      
      // ============================================
      // ENFERMERÍA
      // ============================================
      case 'add-nursing-document':
        const nursingDocAdded = await addNursingDocumentSQLite(
          data.episodeId,
          data.professionalId,
          data.documentType,
          data.text
        );
        return NextResponse.json({ success: nursingDocAdded });
      
      // ============================================
      // EPISODIOS Y MOVIMIENTOS
      // ============================================
      case 'create-episode':
        const episodeId = await createEpisodeSQLite(
          data.patientId,
          data.reason,
          data.professionalId
        );
        return NextResponse.json({ success: true, data: { episodeId } });
      
      case 'register-movement':
        const movementRegistered = await registerMovementSQLite(
          data.episodeId,
          data.patientId,
          data.origin,
          data.destination,
          data.roomId,
          data.bedId,
          data.professionalId,
          data.service
        );
        return NextResponse.json({ success: movementRegistered });
      
      case 'discharge-patient':
        const discharged = await dischargePatientSQLite(
          data.episodeId,
          data.dischargeReason,
          data.diagnosisCode,
          data.summary
        );
        return NextResponse.json({ success: discharged });
      
      // ============================================
      // RESET
      // ============================================
      case 'reset':
        await resetSQLiteDatabase();
        return NextResponse.json({ success: true, message: 'Base de datos reseteada' });
      
      default:
        return NextResponse.json(
          { 
            error: 'Acción no válida',
            availableActions: [
              'add-patient', 'update-patient', 'delete-patient',
              'add-staff', 'update-staff', 'delete-staff',
              'add-vital-signs', 'add-medical-order',
              'update-bed-status', 'add-medication-administration',
              'add-nursing-document', 'create-episode',
              'register-movement', 'discharge-patient', 'reset'
            ]
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error en POST /api/sqlite:', error);
    return NextResponse.json(
      { error: 'Error al guardar datos', details: String(error) },
      { status: 500 }
    );
  }
}
