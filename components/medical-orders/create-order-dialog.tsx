"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Search, User, Calendar, Clock } from "lucide-react"
import { useHospital } from "@/lib/hospital-context"
import { useAuth } from "@/lib/auth-context"

interface CreateOrderDialogProps {
  trigger?: React.ReactNode
}

export function CreateOrderDialog({ trigger }: CreateOrderDialogProps) {
  const { patients, addMedicalOrder } = useHospital()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [patientSearch, setPatientSearch] = useState("")
  
  const [formData, setFormData] = useState({
    medication: "",
    dosage: "",
    route: "",
    frequency: "",
    duration: "",
    priority: "normal",
    notes: "",
    startDate: "",
    endDate: ""
  })

  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase()
    return fullName.includes(patientSearch.toLowerCase()) ||
      patient.id.toLowerCase().includes(patientSearch.toLowerCase()) ||
      patient.roomId?.toString().includes(patientSearch)
  })

  const routes = [
    "Oral",
    "Intravenoso",
    "Intramuscular",
    "Subcutáneo",
    "Tópico",
    "Inhalado",
    "Sublingual",
    "Rectal",
    "Oftálmico",
    "Ótico"
  ]

  const frequencies = [
    "Una vez",
    "Cada 4 horas",
    "Cada 6 horas",
    "Cada 8 horas",
    "Cada 12 horas",
    "Cada 24 horas",
    "Dos veces al día",
    "Tres veces al día",
    "Cuatro veces al día",
    "Según necesidad",
    "Antes de las comidas",
    "Después de las comidas"
  ]

  const priorities = [
    { value: "urgent", label: "Urgente", color: "bg-red-100 text-red-800" },
    { value: "high", label: "Alta", color: "bg-orange-100 text-orange-800" },
    { value: "normal", label: "Normal", color: "bg-green-100 text-green-800" },
    { value: "low", label: "Baja", color: "bg-gray-100 text-gray-800" }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPatient || !formData.medication || !formData.dosage) {
      return
    }

    const newOrder = {
      patientId: selectedPatient.id,
      type: 'Medication' as const,
      description: `${formData.medication} - ${formData.dosage}`,
      medication: formData.medication,
      dosage: formData.dosage,
      route: formData.route || 'Oral',
      frequency: formData.frequency || 'Cada 8 horas',
      duration: formData.duration,
      priority: formData.priority as 'Normal' | 'Urgent' | 'STAT',
      status: 'Pending' as const,
      orderedBy: user?.firstName + " " + user?.lastName || "Doctor",
      orderedDate: new Date(),
      startDate: formData.startDate ? new Date(formData.startDate) : new Date(),
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      notes: formData.notes
    }

    addMedicalOrder(newOrder)
    
    // Reset form
    setFormData({
      medication: "",
      dosage: "",
      route: "",
      frequency: "",
      duration: "",
      priority: "normal",
      notes: "",
      startDate: "",
      endDate: ""
    })
    setSelectedPatient(null)
    setPatientSearch("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Orden Médica
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Orden Médica</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selección de Paciente */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Seleccionar Paciente</Label>
            
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
                
                <div className="max-h-40 overflow-y-auto border rounded-md">
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{patient.firstName} {patient.lastName}</p>
                          <p className="text-sm text-muted-foreground">
                            ID: {patient.id} {patient.roomId && `• Habitación: ${patient.roomId}`}
                          </p>
                        </div>
                        <Badge variant="outline">{patient.currentCondition || 'Activo'}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{selectedPatient.firstName} {selectedPatient.lastName}</p>
                        <p className="text-sm text-muted-foreground">
                          ID: {selectedPatient.id} {selectedPatient.roomId && `• Habitación: ${selectedPatient.roomId}`}
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
              {/* Información del Medicamento */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Información del Medicamento</Label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="medication">Medicamento *</Label>
                    <Input
                      id="medication"
                      value={formData.medication}
                      onChange={(e) => setFormData({...formData, medication: e.target.value})}
                      placeholder="Ej: Paracetamol"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dosage">Dosis *</Label>
                    <Input
                      id="dosage"
                      value={formData.dosage}
                      onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                      placeholder="Ej: 500mg"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="route">Vía de Administración</Label>
                    <Select value={formData.route} onValueChange={(value) => setFormData({...formData, route: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar vía" />
                      </SelectTrigger>
                      <SelectContent>
                        {routes.map((route) => (
                          <SelectItem key={route} value={route}>
                            {route}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="frequency">Frecuencia</Label>
                    <Select value={formData.frequency} onValueChange={(value) => setFormData({...formData, frequency: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencies.map((frequency) => (
                          <SelectItem key={frequency} value={frequency}>
                            {frequency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Prioridad y Duración */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Prioridad</Label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            <div className="flex items-center gap-2">
                              <Badge className={priority.color}>{priority.label}</Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="duration">Duración del Tratamiento</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      placeholder="Ej: 7 días"
                    />
                  </div>
                </div>
              </div>

              {/* Fechas */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Fecha de Inicio</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="endDate">Fecha de Finalización</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Notas */}
              <div>
                <Label htmlFor="notes">Notas e Instrucciones Especiales</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Instrucciones adicionales, contraindicaciones, etc."
                  rows={3}
                />
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Crear Orden Médica
                </Button>
              </div>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
