'use client';

import { useHospital } from '@/lib/hospital-context';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Phone, Mail, MapPin, Heart, Calendar, AlertTriangle, Shield, Lock } from 'lucide-react';

interface PatientDetailsProps {
  patientId: string;
}

export default function PatientDetails({ patientId }: PatientDetailsProps) {
  const { patients, vitalSigns, medications, medicalRecords, getPatientVisibilityFilter } = useHospital();
  const { user } = useAuth();
  
  // Obtener filtro de visibilidad según el rol
  const visibilityFilter = getPatientVisibilityFilter();
  const isPatientOrFamily = user?.role === 'patient' || user?.role === 'family';
  const isOwnProfile = user?.role === 'patient' && (user.id === patientId || user.professionalId === patientId);
  
  const patient = patients.find(p => p.id === patientId);
  const patientVitals = vitalSigns.filter(vs => vs.patientId === patientId);
  const patientMedications = medications.filter(med => med.patientId === patientId);
  const patientRecords = medicalRecords.filter(record => record.patientId === patientId);

  if (!patient) {
    return <div className="text-gray-900">Paciente no encontrado</div>;
  }

  const age = new Date().getFullYear() - patient.dateOfBirth.getFullYear();
  const latestVitals = patientVitals.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

  // Para familia, mostrar vista limitada
  if (user?.role === 'family' && !isOwnProfile) {
    return (
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Vista de Familiar</p>
                <p className="text-sm text-blue-700">
                  Como familiar, tienes acceso limitado a la información del paciente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <User className="h-5 w-5" />
              Información Básica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Nombre:</label>
                <p className="text-gray-900">{patient.firstName} {patient.lastName}</p>
              </div>
              {patient.roomId && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Habitación:</label>
                  <p className="text-gray-900">Habitación {patient.roomId}</p>
                </div>
              )}
              {patient.currentCondition && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Estado General:</label>
                  <Badge variant={
                    patient.currentCondition === 'Critical' ? 'destructive' :
                    patient.currentCondition === 'Serious' ? 'outline' : 'secondary'
                  }>
                    {patient.currentCondition === 'Stable' ? 'Estable' :
                     patient.currentCondition === 'Serious' ? 'Serio' :
                     patient.currentCondition === 'Critical' ? 'Crítico' : patient.currentCondition}
                  </Badge>
                </div>
              )}
              {patient.attendingPhysician && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Médico responsable:</label>
                  <p className="text-gray-900">{patient.attendingPhysician}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      {/* Banner para paciente viendo su propio perfil */}
      {isOwnProfile && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Mi Perfil de Salud</p>
                <p className="text-sm text-green-700">
                  Esta es tu información médica personal. Algunos datos solo pueden ser modificados por el personal médico.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Información personal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <User className="h-5 w-5" />
            Información Personal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {visibilityFilter?.mostrarNombreCompleto 
                      ? `${patient.firstName} ${patient.lastName}`
                      : patient.anonymousId || `Paciente`}
                  </h3>
                  {visibilityFilter?.mostrarDNI && (
                    <p className="text-gray-600">DNI: {patient.dni}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>{age} años ({patient.dateOfBirth.toLocaleDateString()})</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" />
                  <span>{patient.phone}</span>
                </div>

                {patient.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4" />
                    <span>{patient.email}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {patient.address.street}, {patient.address.city} {patient.address.postalCode}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Estado:</label>
                <div className="mt-1">
                  <Badge variant={patient.roomId ? "default" : "secondary"}>
                    {patient.roomId ? "Hospitalizado" : "Ambulatorio"}
                  </Badge>
                </div>
              </div>

              {patient.roomId && (
                <div>
                  <label className="text-sm font-medium">Habitación:</label>
                  <p className="text-sm">{patient.roomId}</p>
                </div>
              )}

              {patient.attendingPhysician && (
                <div>
                  <label className="text-sm font-medium">Médico responsable:</label>
                  <p className="text-sm">{patient.attendingPhysician}</p>
                </div>
              )}

              {patient.bloodType && (
                <div>
                  <label className="text-sm font-medium">Tipo de sangre:</label>
                  <p className="text-sm">{patient.bloodType}</p>
                </div>
              )}

              {patient.currentCondition && (
                <div>
                  <label className="text-sm font-medium">Condición:</label>
                  <Badge variant={
                    patient.currentCondition === 'Critical' ? 'destructive' :
                    patient.currentCondition === 'Serious' ? 'outline' : 'secondary'
                  }>
                    {patient.currentCondition}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacto de emergencia - solo si tiene permiso */}
      {visibilityFilter?.mostrarContactosEmergencia && (
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">Contacto de Emergencia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-gray-900"><strong className="text-gray-600">Nombre:</strong> {patient.emergencyContact.name}</p>
              <p className="text-gray-900"><strong className="text-gray-600">Relación:</strong> {patient.emergencyContact.relationship}</p>
              <p className="text-gray-900"><strong className="text-gray-600">Teléfono:</strong> {patient.emergencyContact.phone}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alergias */}
      {patient.allergies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Alergias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {patient.allergies.map((allergy, index) => (
                <Badge key={index} variant="destructive" className="text-sm">
                  {allergy}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Signos vitales recientes */}
      {latestVitals && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Últimos Signos Vitales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center p-3 border rounded-lg">
                <div className="font-semibold text-lg">
                  {latestVitals.bloodPressure.systolic}/{latestVitals.bloodPressure.diastolic}
                </div>
                <div className="text-sm text-muted-foreground">Presión Arterial</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="font-semibold text-lg">{latestVitals.heartRate}</div>
                <div className="text-sm text-muted-foreground">Frecuencia Cardíaca</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="font-semibold text-lg">{latestVitals.temperature}°C</div>
                <div className="text-sm text-muted-foreground">Temperatura</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="font-semibold text-lg">{latestVitals.oxygenSaturation}%</div>
                <div className="text-sm text-muted-foreground">Saturación O₂</div>
              </div>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              Registrado el {latestVitals.timestamp.toLocaleString()} por {latestVitals.recordedBy}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Medicaciones actuales - solo si tiene permiso */}
      {visibilityFilter?.mostrarMedicaciones && patientMedications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">Medicaciones Actuales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {patientMedications.filter(med => med.status === 'Active').map(medication => (
                <div key={medication.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{medication.name}</h4>
                      <p className="text-sm text-gray-600">
                        {medication.dosage} - {medication.frequency} - {medication.route}
                      </p>
                    </div>
                    <Badge variant="outline">{medication.status}</Badge>
                  </div>
                  {medication.instructions && (
                    <p className="text-sm mt-2 text-gray-500">
                      {medication.instructions}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historial médico - solo si tiene permiso */}
      {visibilityFilter?.mostrarHistorialMedico && patient.medicalHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">Historial Médico</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {patient.medicalHistory.map((condition, index) => (
                <li key={index} className="text-sm text-gray-900">• {condition}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Registros médicos recientes - solo si tiene permiso */}
      {visibilityFilter?.mostrarHistorialMedico && patientRecords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">Registros Médicos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patientRecords.slice(0, 5).map(record => (
                <div key={record.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{record.type}</Badge>
                    <span className="text-sm text-gray-500">
                      {record.date.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900">{record.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Por: {record.physician}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Mensaje de información restringida para roles sin permisos completos */}
      {!visibilityFilter?.mostrarHistorialMedico && !isPatientOrFamily && (
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-gray-400" />
              <p className="text-sm text-gray-500">
                Algunos datos clínicos no están disponibles para tu nivel de acceso.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
