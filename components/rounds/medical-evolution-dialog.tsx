"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Search, User, Calendar, Stethoscope } from "lucide-react"
import { useHospital } from "@/lib/hospital-context"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function MedicalEvolutionDialog() {
  const { patients, getFilteredPatients, addMedicalEvolution } = useHospital()
  const { user } = useAuth()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [patientSearch, setPatientSearch] = useState("")
  
  const [formData, setFormData] = useState({
    subjectiveAssessment: "",
    objectiveAssessment: "",
    diagnosis: "",
    treatmentPlan: "",
    notes: "",
    evolutionType: "routine",
    vitalSigns: "",
    recommendations: ""
  })

  // Obtener pacientes filtrados según el rol del usuario (todos los asignados, no solo hospitalizados)
  const availablePatients = getFilteredPatients()
  
  const filteredPatients = availablePatients.filter(patient => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase()
    return fullName.includes(patientSearch.toLowerCase()) ||
      patient.id.toLowerCase().includes(patientSearch.toLowerCase()) ||
      (patient.roomId && patient.roomId.toString().includes(patientSearch))
  })

  const evolutionTypes = [
    { value: "routine", label: "Evolución Rutinaria" },
    { value: "urgent", label: "Evolución Urgente" },
    { value: "preoperative", label: "Evaluación Preoperatoria" },
    { value: "postoperative", label: "Evolución Postoperatoria" },
    { value: "discharge", label: "Evaluación para Alta" },
    { value: "consultation", label: "Interconsulta" }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPatient) {
      toast({
        title: "Error",
        description: "Debe seleccionar un paciente",
        variant: "destructive",
      })
      return
    }

    if (!formData.subjectiveAssessment && !formData.objectiveAssessment) {
      toast({
        title: "Error",
        description: "Debe completar al menos la valoración subjetiva u objetiva",
        variant: "destructive",
      })
      return
    }

    const newEvolution = {
      patientId: selectedPatient.id,
      physicianId: user?.id || "",
      physicianName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Médico",
      date: new Date(),
      subjectiveAssessment: formData.subjectiveAssessment,
      objectiveAssessment: formData.objectiveAssessment,
      diagnosis: formData.diagnosis,
      treatmentPlan: formData.treatmentPlan,
      notes: formData.notes,
      evolutionType: formData.evolutionType,
      vitalSigns: formData.vitalSigns,
      recommendations: formData.recommendations
    }

    addMedicalEvolution(newEvolution)
    
    toast({
      title: "Evolución creada",
      description: `Se ha registrado la evolución médica para ${selectedPatient.firstName} ${selectedPatient.lastName}`,
    })

    // Reset form
    setFormData({
      subjectiveAssessment: "",
      objectiveAssessment: "",
      diagnosis: "",
      treatmentPlan: "",
      notes: "",
      evolutionType: "routine",
      vitalSigns: "",
      recommendations: ""
    })
    setSelectedPatient(null)
    setPatientSearch("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Evolución
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900">
            <Stethoscope className="h-5 w-5 text-blue-600" />
            Nueva Evolución Médica
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selección de Paciente */}
          <div className="space-y-4">
            <Label className="text-base font-semibold text-gray-900">Seleccionar Paciente *</Label>
            
            {!selectedPatient ? (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Buscar por nombre, ID o habitación..."
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {filteredPatients.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 border rounded-md">
                    {availablePatients.length === 0 
                      ? 'No tiene pacientes asignados. Contacte con el administrador.'
                      : 'No se encontraron pacientes con ese criterio de búsqueda'
                    }
                  </div>
                ) : (
                  <div className="max-h-48 overflow-y-auto border rounded-md">
                    {filteredPatients.map((patient) => (
                      <div
                        key={patient.id}
                        className="p-3 border-b last:border-b-0 hover:bg-blue-50 cursor-pointer transition-colors"
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{patient.firstName} {patient.lastName}</p>
                            <p className="text-sm text-gray-500">
                              ID: {patient.id} • Habitación: {patient.roomId || 'N/A'}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-gray-700">
                            {patient.currentCondition || 'Hospitalizado'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">{selectedPatient.firstName} {selectedPatient.lastName}</p>
                        <p className="text-sm text-gray-600">
                          ID: {selectedPatient.id} • Habitación: {selectedPatient.roomId || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPatient(null)}
                    >
                      Cambiar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {selectedPatient && (
            <>
              {/* Tipo de Evolución */}
              <div className="space-y-2">
                <Label className="text-gray-900">Tipo de Evolución</Label>
                <Select 
                  value={formData.evolutionType} 
                  onValueChange={(value) => setFormData({...formData, evolutionType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {evolutionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Valoración SOAP */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-900">Valoración Subjetiva (S)</Label>
                  <Textarea
                    value={formData.subjectiveAssessment}
                    onChange={(e) => setFormData({...formData, subjectiveAssessment: e.target.value})}
                    placeholder="Síntomas referidos por el paciente, quejas, preocupaciones..."
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-900">Valoración Objetiva (O)</Label>
                  <Textarea
                    value={formData.objectiveAssessment}
                    onChange={(e) => setFormData({...formData, objectiveAssessment: e.target.value})}
                    placeholder="Hallazgos del examen físico, signos vitales, resultados de pruebas..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Signos Vitales */}
              <div className="space-y-2">
                <Label className="text-gray-900">Signos Vitales</Label>
                <Input
                  value={formData.vitalSigns}
                  onChange={(e) => setFormData({...formData, vitalSigns: e.target.value})}
                  placeholder="Ej: PA: 120/80, FC: 72, FR: 16, T°: 36.5°C, SatO2: 98%"
                />
              </div>

              {/* Diagnóstico y Plan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-900">Diagnóstico / Evaluación (A)</Label>
                  <Textarea
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                    placeholder="Diagnóstico actual, evolución de la enfermedad..."
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-900">Plan de Tratamiento (P)</Label>
                  <Textarea
                    value={formData.treatmentPlan}
                    onChange={(e) => setFormData({...formData, treatmentPlan: e.target.value})}
                    placeholder="Plan terapéutico, medicamentos, procedimientos..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Recomendaciones */}
              <div className="space-y-2">
                <Label className="text-gray-900">Recomendaciones</Label>
                <Textarea
                  value={formData.recommendations}
                  onChange={(e) => setFormData({...formData, recommendations: e.target.value})}
                  placeholder="Indicaciones especiales, cuidados, seguimiento..."
                  rows={2}
                />
              </div>

              {/* Notas adicionales */}
              <div className="space-y-2">
                <Label className="text-gray-900">Notas Adicionales</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Observaciones adicionales..."
                  rows={2}
                />
              </div>
            </>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!selectedPatient}>
              <Stethoscope className="h-4 w-4 mr-2" />
              Guardar Evolución
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
