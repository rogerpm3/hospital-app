"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useHospital } from "@/lib/hospital-context"
import { useAuth } from "@/lib/auth-context"
import {
  FileText,
  Plus,
  Clock,
  User,
  Search,
  Stethoscope,
  Activity,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Edit
} from "lucide-react"

export default function MedicalEvolutionsPanel() {
  const { patients, medicalEvolutions, addMedicalEvolution } = useHospital()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [activeTab, setActiveTab] = useState("today")
  const [searchTerm, setSearchTerm] = useState("")
  const [showNewEvolutionDialog, setShowNewEvolutionDialog] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState("")
  
  const [evolutionData, setEvolutionData] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
    vitalSigns: {
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      respiratoryRate: "",
      oxygenSaturation: ""
    },
    symptoms: "",
    physicalExam: "",
    diagnosticTests: "",
    medications: "",
    recommendations: "",
    followUp: "",
    condition: "stable"
  })

  // Obtener solo pacientes hospitalizados
  const hospitalizedPatients = patients.filter(p => p.roomId)

  // Filtrar evoluciones
  const today = new Date()
  const todayEvolutions = medicalEvolutions.filter(evolution => 
    evolution.date.toDateString() === today.toDateString()
  )

  const thisWeekEvolutions = medicalEvolutions.filter(evolution => {
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    return evolution.date >= weekAgo
  })

  const filteredEvolutions = medicalEvolutions.filter(evolution => {
    const patient = patients.find(p => p.id === evolution.patientId)
    return patient?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           patient?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           evolution.subjective.toLowerCase().includes(searchTerm.toLowerCase()) ||
           evolution.assessment.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const conditions = [
    { value: "critical", label: "Crítico", color: "bg-red-100 text-red-800" },
    { value: "unstable", label: "Inestable", color: "bg-orange-100 text-orange-800" },
    { value: "stable", label: "Estable", color: "bg-green-100 text-green-800" },
    { value: "improving", label: "Mejorando", color: "bg-blue-100 text-blue-800" },
    { value: "deteriorating", label: "Deteriorando", color: "bg-purple-100 text-purple-800" }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPatient || !evolutionData.subjective || !evolutionData.assessment) {
      toast({
        title: "Error de validación",
        description: "Por favor completa los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    const newEvolution = {
      patientId: selectedPatient,
      doctorId: user?.id || "current-doctor",
      doctorName: user?.firstName + " " + user?.lastName || "Dr. Usuario",
      date: new Date(),
      subjective: evolutionData.subjective,
      objective: evolutionData.objective,
      assessment: evolutionData.assessment,
      plan: evolutionData.plan,
      vitalSigns: evolutionData.vitalSigns,
      symptoms: evolutionData.symptoms,
      physicalExam: evolutionData.physicalExam,
      diagnosticTests: evolutionData.diagnosticTests,
      medications: evolutionData.medications,
      recommendations: evolutionData.recommendations,
      followUp: evolutionData.followUp,
      condition: evolutionData.condition
    }

    addMedicalEvolution(newEvolution)

    toast({
      title: "Evolución registrada",
      description: "La evolución médica ha sido guardada exitosamente",
    })

    // Reset form
    setEvolutionData({
      subjective: "",
      objective: "",
      assessment: "",
      plan: "",
      vitalSigns: {
        bloodPressure: "",
        heartRate: "",
        temperature: "",
        respiratoryRate: "",
        oxygenSaturation: ""
      },
      symptoms: "",
      physicalExam: "",
      diagnosticTests: "",
      medications: "",
      recommendations: "",
      followUp: "",
      condition: "stable"
    })
    setSelectedPatient("")
    setShowNewEvolutionDialog(false)
  }

  const getConditionColor = (condition: string) => {
    const conditionObj = conditions.find(c => c.value === condition)
    return conditionObj?.color || "bg-gray-100 text-gray-800"
  }

  const EvolutionCard = ({ evolution }: { evolution: any }) => {
    const patient = patients.find(p => p.id === evolution.patientId)
    
    return (
      <Card className="mb-4 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Stethoscope className="w-4 h-4 text-blue-600" />
                <h3 className="font-semibold text-lg">
                  {patient?.firstName} {patient?.lastName}
                </h3>
                <Badge variant="outline">Hab. {patient?.roomId}</Badge>
                <Badge className={getConditionColor(evolution.condition)}>
                  {conditions.find(c => c.value === evolution.condition)?.label}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {evolution.doctorName}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {evolution.date.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-blue-600">Subjetivo:</span>
              <p className="mt-1">{evolution.subjective}</p>
            </div>
            
            {evolution.objective && (
              <div>
                <span className="font-medium text-green-600">Objetivo:</span>
                <p className="mt-1">{evolution.objective}</p>
              </div>
            )}
            
            <div>
              <span className="font-medium text-orange-600">Evaluación:</span>
              <p className="mt-1">{evolution.assessment}</p>
            </div>
            
            {evolution.plan && (
              <div>
                <span className="font-medium text-purple-600">Plan:</span>
                <p className="mt-1">{evolution.plan}</p>
              </div>
            )}

            {evolution.symptoms && (
              <div>
                <span className="font-medium text-red-600">Síntomas:</span>
                <p className="mt-1">{evolution.symptoms}</p>
              </div>
            )}

            {evolution.physicalExam && (
              <div>
                <span className="font-medium text-indigo-600">Examen Físico:</span>
                <p className="mt-1">{evolution.physicalExam}</p>
              </div>
            )}

            {evolution.recommendations && (
              <div>
                <span className="font-medium text-pink-600">Recomendaciones:</span>
                <p className="mt-1">{evolution.recommendations}</p>
              </div>
            )}

            {/* Signos vitales si están disponibles */}
            {(evolution.vitalSigns?.bloodPressure || evolution.vitalSigns?.heartRate) && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="font-medium text-gray-700">Signos Vitales:</span>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2 text-xs">
                  {evolution.vitalSigns.bloodPressure && (
                    <div>PA: {evolution.vitalSigns.bloodPressure}</div>
                  )}
                  {evolution.vitalSigns.heartRate && (
                    <div>FC: {evolution.vitalSigns.heartRate}</div>
                  )}
                  {evolution.vitalSigns.temperature && (
                    <div>T°: {evolution.vitalSigns.temperature}</div>
                  )}
                  {evolution.vitalSigns.respiratoryRate && (
                    <div>FR: {evolution.vitalSigns.respiratoryRate}</div>
                  )}
                  {evolution.vitalSigns.oxygenSaturation && (
                    <div>SatO2: {evolution.vitalSigns.oxygenSaturation}%</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Hospitalizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{hospitalizedPatients.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Evoluciones Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{todayEvolutions.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{thisWeekEvolutions.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {hospitalizedPatients.length - todayEvolutions.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header y controles */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Evoluciones Médicas
            </CardTitle>
            <Dialog open={showNewEvolutionDialog} onOpenChange={setShowNewEvolutionDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Nueva Evolución
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Registrar Evolución Médica</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Selección de paciente */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="patient">Paciente *</Label>
                      <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar paciente" />
                        </SelectTrigger>
                        <SelectContent>
                          {hospitalizedPatients.map(patient => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.firstName} {patient.lastName} - Hab. {patient.roomId}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="condition">Estado del Paciente</Label>
                      <Select 
                        value={evolutionData.condition} 
                        onValueChange={(value) => setEvolutionData({...evolutionData, condition: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {conditions.map(condition => (
                            <SelectItem key={condition.value} value={condition.value}>
                              {condition.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* SOAP Notes */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="subjective">Subjetivo (S) *</Label>
                      <Textarea
                        id="subjective"
                        value={evolutionData.subjective}
                        onChange={(e) => setEvolutionData({...evolutionData, subjective: e.target.value})}
                        placeholder="Síntomas reportados por el paciente..."
                        rows={3}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="objective">Objetivo (O)</Label>
                      <Textarea
                        id="objective"
                        value={evolutionData.objective}
                        onChange={(e) => setEvolutionData({...evolutionData, objective: e.target.value})}
                        placeholder="Hallazgos del examen físico, signos vitales..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="assessment">Evaluación (A) *</Label>
                      <Textarea
                        id="assessment"
                        value={evolutionData.assessment}
                        onChange={(e) => setEvolutionData({...evolutionData, assessment: e.target.value})}
                        placeholder="Diagnóstico, impresión clínica..."
                        rows={3}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="plan">Plan (P)</Label>
                      <Textarea
                        id="plan"
                        value={evolutionData.plan}
                        onChange={(e) => setEvolutionData({...evolutionData, plan: e.target.value})}
                        placeholder="Plan de tratamiento, órdenes médicas..."
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="symptoms">Síntomas Específicos</Label>
                      <Textarea
                        id="symptoms"
                        value={evolutionData.symptoms}
                        onChange={(e) => setEvolutionData({...evolutionData, symptoms: e.target.value})}
                        placeholder="Dolor, náuseas, disnea..."
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="physicalExam">Examen Físico</Label>
                      <Textarea
                        id="physicalExam"
                        value={evolutionData.physicalExam}
                        onChange={(e) => setEvolutionData({...evolutionData, physicalExam: e.target.value})}
                        placeholder="Auscultación, palpación, inspección..."
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Signos vitales */}
                  <div>
                    <Label className="text-base font-semibold">Signos Vitales</Label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
                      <div>
                        <Label htmlFor="bp">Presión Arterial</Label>
                        <Input
                          id="bp"
                          value={evolutionData.vitalSigns.bloodPressure}
                          onChange={(e) => setEvolutionData({
                            ...evolutionData,
                            vitalSigns: {
                              ...evolutionData.vitalSigns,
                              bloodPressure: e.target.value
                            }
                          })}
                          placeholder="120/80"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="hr">Frecuencia Cardíaca</Label>
                        <Input
                          id="hr"
                          value={evolutionData.vitalSigns.heartRate}
                          onChange={(e) => setEvolutionData({
                            ...evolutionData,
                            vitalSigns: {
                              ...evolutionData.vitalSigns,
                              heartRate: e.target.value
                            }
                          })}
                          placeholder="72"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="temp">Temperatura</Label>
                        <Input
                          id="temp"
                          value={evolutionData.vitalSigns.temperature}
                          onChange={(e) => setEvolutionData({
                            ...evolutionData,
                            vitalSigns: {
                              ...evolutionData.vitalSigns,
                              temperature: e.target.value
                            }
                          })}
                          placeholder="36.5"
                        />
                      </div>

                      <div>
                        <Label htmlFor="rr">Frecuencia Respiratoria</Label>
                        <Input
                          id="rr"
                          value={evolutionData.vitalSigns.respiratoryRate}
                          onChange={(e) => setEvolutionData({
                            ...evolutionData,
                            vitalSigns: {
                              ...evolutionData.vitalSigns,
                              respiratoryRate: e.target.value
                            }
                          })}
                          placeholder="16"
                        />
                      </div>

                      <div>
                        <Label htmlFor="sat">Saturación O2</Label>
                        <Input
                          id="sat"
                          value={evolutionData.vitalSigns.oxygenSaturation}
                          onChange={(e) => setEvolutionData({
                            ...evolutionData,
                            vitalSigns: {
                              ...evolutionData.vitalSigns,
                              oxygenSaturation: e.target.value
                            }
                          })}
                          placeholder="98"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="diagnosticTests">Estudios Diagnósticos</Label>
                      <Textarea
                        id="diagnosticTests"
                        value={evolutionData.diagnosticTests}
                        onChange={(e) => setEvolutionData({...evolutionData, diagnosticTests: e.target.value})}
                        placeholder="Laboratorios, imágenes solicitadas..."
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="medications">Medicamentos</Label>
                      <Textarea
                        id="medications"
                        value={evolutionData.medications}
                        onChange={(e) => setEvolutionData({...evolutionData, medications: e.target.value})}
                        placeholder="Cambios en medicación..."
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="recommendations">Recomendaciones</Label>
                      <Textarea
                        id="recommendations"
                        value={evolutionData.recommendations}
                        onChange={(e) => setEvolutionData({...evolutionData, recommendations: e.target.value})}
                        placeholder="Cuidados especiales, dieta..."
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="followUp">Seguimiento</Label>
                      <Textarea
                        id="followUp"
                        value={evolutionData.followUp}
                        onChange={(e) => setEvolutionData({...evolutionData, followUp: e.target.value})}
                        placeholder="Próxima evaluación, interconsultas..."
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => setShowNewEvolutionDialog(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      Guardar Evolución
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Buscar por paciente o contenido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de evoluciones */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">
            Hoy ({todayEvolutions.length})
          </TabsTrigger>
          <TabsTrigger value="week">
            Esta Semana ({thisWeekEvolutions.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            Todas ({filteredEvolutions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4 mt-6">
          {todayEvolutions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-muted-foreground">No hay evoluciones registradas hoy</p>
              </CardContent>
            </Card>
          ) : (
            todayEvolutions
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .map(evolution => (
                <EvolutionCard key={evolution.id} evolution={evolution} />
              ))
          )}
        </TabsContent>

        <TabsContent value="week" className="space-y-4 mt-6">
          {thisWeekEvolutions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-muted-foreground">No hay evoluciones esta semana</p>
              </CardContent>
            </Card>
          ) : (
            thisWeekEvolutions
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .map(evolution => (
                <EvolutionCard key={evolution.id} evolution={evolution} />
              ))
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4 mt-6">
          {filteredEvolutions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-muted-foreground">No se encontraron evoluciones</p>
              </CardContent>
            </Card>
          ) : (
            filteredEvolutions
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .map(evolution => (
                <EvolutionCard key={evolution.id} evolution={evolution} />
              ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
