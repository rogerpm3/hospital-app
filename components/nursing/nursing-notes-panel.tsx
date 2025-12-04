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
import { useToast } from "@/hooks/use-toast"
import { useHospital } from "@/lib/hospital-context"
import { useAuth } from "@/lib/auth-context"
import {
  FileText,
  Plus,
  Clock,
  User,
  Search,
  Filter,
  Edit,
  Eye
} from "lucide-react"

export default function NursingNotesPanel() {
  const { patients, nursingNotes, addNursingNote } = useHospital()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterShift, setFilterShift] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [selectedPatient, setSelectedPatient] = useState("")
  
  const [noteData, setNoteData] = useState({
    category: "",
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
    interventions: "",
    patientResponse: "",
    shift: "",
    priority: "normal"
  })

  // Obtener solo pacientes hospitalizados
  const hospitalizedPatients = patients.filter(p => p.roomId)

  // Obtener turno actual basado en la hora
  const getCurrentShift = () => {
    const hour = new Date().getHours()
    if (hour >= 7 && hour < 15) return "morning"
    if (hour >= 15 && hour < 23) return "afternoon"
    return "night"
  }

  // Filtrar notas
  const filteredNotes = nursingNotes.filter(note => {
    const patient = patients.find(p => p.id === note.patientId)
    const matchesSearch = 
      patient?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.subjective.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.objective.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesShift = filterShift === "all" || note.shift === filterShift
    const matchesCategory = filterCategory === "all" || note.category === filterCategory
    
    return matchesSearch && matchesShift && matchesCategory
  })

  // Categorías de notas
  const categories = [
    "General", "Medicación", "Procedimientos", "Signos Vitales", 
    "Dolor", "Movilidad", "Nutrición", "Higiene", "Eliminación", 
    "Educación", "Seguridad", "Psicosocial"
  ]

  const shifts = [
    { value: "morning", label: "Mañana (7:00-15:00)" },
    { value: "afternoon", label: "Tarde (15:00-23:00)" },
    { value: "night", label: "Noche (23:00-7:00)" }
  ]

  const priorities = [
    { value: "low", label: "Baja", color: "bg-green-100 text-green-800" },
    { value: "normal", label: "Normal", color: "bg-blue-100 text-blue-800" },
    { value: "high", label: "Alta", color: "bg-orange-100 text-orange-800" },
    { value: "urgent", label: "Urgente", color: "bg-red-100 text-red-800" }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPatient || !noteData.category || !noteData.subjective) {
      toast({
        title: "Error de validación",
        description: "Por favor completa los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    const newNote = {
      patientId: selectedPatient,
      nurseName: user?.firstName + " " + user?.lastName || "Enfermero/a",
      nurseId: user?.id || "current-user",
      timestamp: new Date(),
      shift: noteData.shift || getCurrentShift(),
      category: noteData.category,
      subjective: noteData.subjective,
      objective: noteData.objective,
      assessment: noteData.assessment,
      plan: noteData.plan,
      interventions: noteData.interventions,
      patientResponse: noteData.patientResponse,
      priority: noteData.priority
    }

    addNursingNote(newNote)

    toast({
      title: "Nota registrada",
      description: "La nota de enfermería ha sido guardada exitosamente",
    })

    // Reset form
    setNoteData({
      category: "",
      subjective: "",
      objective: "",
      assessment: "",
      plan: "",
      interventions: "",
      patientResponse: "",
      shift: "",
      priority: "normal"
    })
    setSelectedPatient("")
    setShowAddDialog(false)
  }

  const getPriorityColor = (priority: string) => {
    const priorityObj = priorities.find(p => p.value === priority)
    return priorityObj?.color || "bg-gray-100 text-gray-800"
  }

  const getShiftLabel = (shift: string) => {
    const shiftObj = shifts.find(s => s.value === shift)
    return shiftObj?.label.split(' ')[0] || shift
  }

  // Notas del turno actual
  const currentShift = getCurrentShift()
  const todayNotes = filteredNotes.filter(note => {
    const today = new Date().toDateString()
    return note.timestamp.toDateString() === today
  })

  const currentShiftNotes = todayNotes.filter(note => note.shift === currentShift)

  return (
    <div className="space-y-6">
      {/* Stats del turno */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Notas del Turno</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{currentShiftNotes.length}</div>
            <p className="text-xs text-muted-foreground">
              Turno {getShiftLabel(currentShift)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Notas de Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{todayNotes.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{filteredNotes.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{hospitalizedPatients.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Header y filtros */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Notas de Enfermería
            </CardTitle>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Nueva Nota
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Agregar Nota de Enfermería</DialogTitle>
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
                      <Label htmlFor="category">Categoría *</Label>
                      <Select value={noteData.category} onValueChange={(value) => setNoteData({...noteData, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="shift">Turno</Label>
                      <Select 
                        value={noteData.shift} 
                        onValueChange={(value) => setNoteData({...noteData, shift: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={getShiftLabel(getCurrentShift())} />
                        </SelectTrigger>
                        <SelectContent>
                          {shifts.map(shift => (
                            <SelectItem key={shift.value} value={shift.value}>
                              {shift.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="priority">Prioridad</Label>
                      <Select value={noteData.priority} onValueChange={(value) => setNoteData({...noteData, priority: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {priorities.map(priority => (
                            <SelectItem key={priority.value} value={priority.value}>
                              {priority.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Notas SOAP */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="subjective">Subjetivo (S) *</Label>
                      <Textarea
                        id="subjective"
                        value={noteData.subjective}
                        onChange={(e) => setNoteData({...noteData, subjective: e.target.value})}
                        placeholder="Lo que dice el paciente..."
                        rows={2}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="objective">Objetivo (O)</Label>
                      <Textarea
                        id="objective"
                        value={noteData.objective}
                        onChange={(e) => setNoteData({...noteData, objective: e.target.value})}
                        placeholder="Lo que observas..."
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor="assessment">Evaluación (A)</Label>
                      <Textarea
                        id="assessment"
                        value={noteData.assessment}
                        onChange={(e) => setNoteData({...noteData, assessment: e.target.value})}
                        placeholder="Tu análisis profesional..."
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor="plan">Plan (P)</Label>
                      <Textarea
                        id="plan"
                        value={noteData.plan}
                        onChange={(e) => setNoteData({...noteData, plan: e.target.value})}
                        placeholder="Plan de cuidados..."
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor="interventions">Intervenciones Realizadas</Label>
                      <Textarea
                        id="interventions"
                        value={noteData.interventions}
                        onChange={(e) => setNoteData({...noteData, interventions: e.target.value})}
                        placeholder="Procedimientos, cuidados realizados..."
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor="response">Respuesta del Paciente</Label>
                      <Textarea
                        id="response"
                        value={noteData.patientResponse}
                        onChange={(e) => setNoteData({...noteData, patientResponse: e.target.value})}
                        placeholder="Cómo respondió el paciente..."
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      Guardar Nota
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
            
            <Select value={filterShift} onValueChange={setFilterShift}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por turno" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los turnos</SelectItem>
                {shifts.map(shift => (
                  <SelectItem key={shift.value} value={shift.value}>
                    {shift.label.split(' ')[0]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lista de notas */}
          <div className="space-y-4">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No se encontraron notas de enfermería</p>
              </div>
            ) : (
              filteredNotes
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .map(note => {
                  const patient = patients.find(p => p.id === note.patientId)
                  return (
                    <Card key={note.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold">
                                {patient?.firstName} {patient?.lastName}
                              </h3>
                              <Badge variant="outline">Hab. {patient?.roomId}</Badge>
                              <Badge variant="outline">{note.category}</Badge>
                              <Badge className={getPriorityColor(note.priority)}>
                                {priorities.find(p => p.value === note.priority)?.label}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {note.nurseName}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {note.timestamp.toLocaleString()}
                              </div>
                              <div>
                                Turno {getShiftLabel(note.shift)}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="font-medium text-blue-600">Subjetivo:</span>
                            <p className="mt-1">{note.subjective}</p>
                          </div>
                          
                          {note.objective && (
                            <div>
                              <span className="font-medium text-green-600">Objetivo:</span>
                              <p className="mt-1">{note.objective}</p>
                            </div>
                          )}
                          
                          {note.assessment && (
                            <div>
                              <span className="font-medium text-orange-600">Evaluación:</span>
                              <p className="mt-1">{note.assessment}</p>
                            </div>
                          )}
                          
                          {note.plan && (
                            <div>
                              <span className="font-medium text-purple-600">Plan:</span>
                              <p className="mt-1">{note.plan}</p>
                            </div>
                          )}

                          {note.interventions && (
                            <div>
                              <span className="font-medium text-indigo-600">Intervenciones:</span>
                              <p className="mt-1">{note.interventions}</p>
                            </div>
                          )}

                          {note.patientResponse && (
                            <div>
                              <span className="font-medium text-pink-600">Respuesta del Paciente:</span>
                              <p className="mt-1">{note.patientResponse}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
