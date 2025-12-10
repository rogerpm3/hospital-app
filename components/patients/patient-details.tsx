'use client';

import { useHospital } from '@/lib/hospital-context';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Phone, Mail, MapPin, Heart, Calendar, AlertTriangle, Shield, Lock, Stethoscope, FileText } from 'lucide-react';

interface PatientDetailsProps {
  patientId: string;
}

export default function PatientDetails({ patientId }: PatientDetailsProps) {
  const { 
    patients, 
    vitalSigns, 
    medications, 
    medicalRecords, 
    getPatientVisibilityFilter,
    getPatientDiagnosis,
    getPatientEpisodes,
    getPatientAllergies,
    getPatientAllergiesDetail
  } = useHospital();
  const { user } = useAuth();
  
  // Obtener filtro de visibilidad según el rol
  const visibilityFilter = getPatientVisibilityFilter();
  const isPatientOrFamily = user?.role === 'patient' || user?.role === 'family';
  const isOwnProfile = user?.role === 'patient' && (user.id === patientId || user.professionalId === patientId);
  
  const patient = patients.find(p => p.id === patientId);
  const patientVitals = vitalSigns.filter(vs => vs.patientId === patientId);
  const patientMedications = medications.filter(med => med.patientId === patientId);
  const patientRecords = medicalRecords.filter(record => record.patientId === patientId);
  
  // Obtener diagnóstico y alergias desde las tablas transaccionales
  const diagnosticoActivo = getPatientDiagnosis(patientId);
  const episodios = getPatientEpisodes(patientId);
  const alergiasBD = getPatientAllergiesDetail(patientId);

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

  // Para ADMISIONES, mostrar solo información administrativa (sin datos clínicos)
  if (user?.role === 'admission') {
    return (
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        <Card className="bg-pink-50 border-pink-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-pink-600" />
              <div>
                <p className="font-medium text-pink-900">Vista de Admisiones</p>
                <p className="text-sm text-pink-700">
                  Acceso a información administrativa. Los datos clínicos están restringidos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Información Personal Básica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nombre completo:</label>
                  <p className="text-gray-900 font-semibold">{patient.firstName} {patient.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">DNI:</label>
                  <p className="text-gray-900 font-mono">{patient.dni}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Fecha de nacimiento:</label>
                  <p className="text-gray-900">{patient.dateOfBirth.toLocaleDateString()} ({age} años)</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Género:</label>
                  <p className="text-gray-900">{patient.gender === 'M' ? 'Masculino' : patient.gender === 'F' ? 'Femenino' : 'Otro'}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Teléfono:</label>
                  <p className="text-gray-900">{patient.phone}</p>
                </div>
                {patient.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email:</label>
                    <p className="text-gray-900">{patient.email}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-600">Dirección:</label>
                  <p className="text-gray-900">{patient.address.street}, {patient.address.city} {patient.address.postalCode}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estado de hospitalización */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">Estado de Hospitalización</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Estado:</label>
                <div className="mt-1">
                  <Badge variant={patient.roomId ? "default" : "secondary"}>
                    {patient.roomId ? "Hospitalizado" : "Ambulatorio"}
                  </Badge>
                </div>
              </div>
              {patient.roomId && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Habitación:</label>
                  <p className="text-gray-900">Habitación {patient.roomId}</p>
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

        {/* Contacto de emergencia */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">Contacto de Emergencia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Nombre:</label>
                <p className="text-gray-900">{patient.emergencyContact.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Relación:</label>
                <p className="text-gray-900">{patient.emergencyContact.relationship}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Teléfono:</label>
                <p className="text-gray-900">{patient.emergencyContact.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información de seguro (datos financieros) */}
        {patient.insuranceInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Información de Seguro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Aseguradora:</label>
                  <p className="text-gray-900">{patient.insuranceInfo.provider}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Número de póliza:</label>
                  <p className="text-gray-900 font-mono">{patient.insuranceInfo.policyNumber}</p>
                </div>
                {patient.insuranceInfo.expirationDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Vencimiento:</label>
                    <p className="text-gray-900">{patient.insuranceInfo.expirationDate.toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Aviso de restricción */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3 text-gray-600">
              <Lock className="h-5 w-5" />
              <p className="text-sm">
                Los datos clínicos (historial médico, diagnósticos, alergias, medicaciones, signos vitales) 
                están restringidos para el personal de admisiones. Contacte con el personal médico para consultas clínicas.
              </p>
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

      {/* Diagnóstico Activo - desde EpisodioClinico */}
      {diagnosticoActivo && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Stethoscope className="h-5 w-5" />
              Diagnóstico Activo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium text-blue-900">{diagnosticoActivo}</p>
          </CardContent>
        </Card>
      )}
      
      {/* Historial de Episodios Clínicos */}
      {episodios.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <FileText className="h-5 w-5" />
              Historial Clínico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {episodios.slice(0, 5).map((episodio) => (
                <div key={episodio.id} className="p-3 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{episodio.motivoPrincipal}</span>
                    <Badge variant={episodio.activo ? 'default' : 'secondary'}>
                      {episodio.activo ? 'Activo' : 'Cerrado'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span>Inicio: {episodio.fechaInicio.toLocaleDateString()}</span>
                    {episodio.fechaFin && (
                      <span className="ml-3">Fin: {episodio.fechaFin.toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              ))}
              {episodios.length > 5 && (
                <p className="text-sm text-gray-500 text-center">
                  Y {episodios.length - 5} episodios más...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alergias - desde AsignacionAlergia */}
      {(alergiasBD.length > 0 || patient.allergies.length > 0) && (
        <Card className="border-red-200 bg-red-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Alergias Registradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {alergiasBD.length > 0 ? (
              <div className="space-y-2">
                {alergiasBD.map((asig, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg border border-red-100">
                    <div>
                      <span className="font-medium text-red-800">{asig.alergia.nombre}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs capitalize">
                          {asig.alergia.tipo}
                        </Badge>
                        {asig.alergia.severidad && (
                          <Badge 
                            variant={asig.alergia.severidad === 'grave' ? 'destructive' : 'secondary'}
                            className="text-xs capitalize"
                          >
                            {asig.alergia.severidad}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {asig.fechaDeteccion && (
                      <span className="text-xs text-gray-500">
                        Detectada: {asig.fechaDeteccion.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ))}
                {alergiasBD.some(a => a.notas) && (
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                    <strong className="text-yellow-800">Notas:</strong>
                    {alergiasBD.filter(a => a.notas).map((a, i) => (
                      <p key={i} className="text-yellow-700 mt-1">• {a.notas}</p>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {patient.allergies.map((allergy, index) => (
                  <Badge key={index} variant="destructive" className="text-sm">
                    {allergy}
                  </Badge>
                ))}
              </div>
            )}
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
