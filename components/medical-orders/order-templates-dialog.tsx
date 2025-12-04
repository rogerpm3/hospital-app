"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Heart, 
  Brain, 
  Wind, 
  Bone, 
  Eye, 
  Pill,
  Stethoscope,
  Activity,
  Zap,
  Shield
} from "lucide-react"

interface OrderTemplatesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectTemplate: (template: any) => void
}

export function OrderTemplatesDialog({ open, onOpenChange, onSelectTemplate }: OrderTemplatesDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("all")

  const orderTemplates = [
    // Cardiología
    {
      id: "cardio-1",
      name: "Hipertensión - Primera línea",
      specialty: "cardiology",
      medication: "Enalapril",
      dosage: "10mg",
      route: "Oral",
      frequency: "Cada 12 horas",
      duration: "Indefinido",
      priority: "normal",
      notes: "Controlar presión arterial cada 48 horas. Ajustar dosis según respuesta."
    },
    {
      id: "cardio-2",
      name: "Insuficiencia Cardíaca",
      specialty: "cardiology",
      medication: "Furosemida",
      dosage: "40mg",
      route: "Intravenoso",
      frequency: "Cada 12 horas",
      duration: "5 días",
      priority: "high",
      notes: "Monitorear diuresis y electrolitos. Pesar diariamente."
    },
    {
      id: "cardio-3",
      name: "Dolor Torácico - Nitroglicerina",
      specialty: "cardiology",
      medication: "Nitroglicerina",
      dosage: "0.4mg",
      route: "Sublingual",
      frequency: "Según necesidad",
      duration: "PRN",
      priority: "urgent",
      notes: "Máximo 3 dosis en 15 minutos. Si persiste dolor, evaluar inmediatamente."
    },

    // Neurología
    {
      id: "neuro-1",
      name: "Epilepsia - Crisis",
      specialty: "neurology",
      medication: "Diazepam",
      dosage: "10mg",
      route: "Intravenoso",
      frequency: "Una vez",
      duration: "Dosis única",
      priority: "urgent",
      notes: "Administrar lentamente. Tener disponible equipo de ventilación."
    },
    {
      id: "neuro-2",
      name: "Migraña Severa",
      specialty: "neurology",
      medication: "Sumatriptán",
      dosage: "6mg",
      route: "Subcutáneo",
      frequency: "Una vez",
      duration: "PRN",
      priority: "high",
      notes: "Contraindicado en cardiopatía isquémica. Puede repetir en 1 hora si es necesario."
    },

    // Neumología
    {
      id: "pulmo-1",
      name: "Asma - Crisis",
      specialty: "pulmonology",
      medication: "Salbutamol",
      dosage: "100mcg",
      route: "Inhalado",
      frequency: "Cada 4 horas",
      duration: "5 días",
      priority: "high",
      notes: "2 puff cada aplicación. Valorar respuesta y espaciar según mejoría."
    },
    {
      id: "pulmo-2",
      name: "EPOC - Reagudización",
      specialty: "pulmonology",
      medication: "Prednisolona",
      dosage: "40mg",
      route: "Oral",
      frequency: "Cada 24 horas",
      duration: "7 días",
      priority: "high",
      notes: "Reducir dosis gradualmente. Controlar glucemia si es diabético."
    },

    // Traumatología
    {
      id: "trauma-1",
      name: "Dolor Moderado - Postoperatorio",
      specialty: "orthopedics",
      medication: "Tramadol",
      dosage: "100mg",
      route: "Intravenoso",
      frequency: "Cada 8 horas",
      duration: "3 días",
      priority: "normal",
      notes: "Evaluar nivel de dolor con escala EVA. Cambiar a oral cuando tolere."
    },
    {
      id: "trauma-2",
      name: "Inflamación Articular",
      specialty: "orthopedics",
      medication: "Ibuprofeno",
      dosage: "600mg",
      route: "Oral",
      frequency: "Cada 8 horas",
      duration: "5 días",
      priority: "normal",
      notes: "Tomar con alimentos. Suspender si hay síntomas gastrointestinales."
    },

    // Oftalmología
    {
      id: "ophtho-1",
      name: "Infección Ocular",
      specialty: "ophthalmology",
      medication: "Tobramicina colirio",
      dosage: "1 gota",
      route: "Oftálmico",
      frequency: "Cada 4 horas",
      duration: "7 días",
      priority: "normal",
      notes: "Lavar manos antes de la aplicación. No tocar el gotero con el ojo."
    },

    // Anestesiología
    {
      id: "anesth-1",
      name: "Sedación Leve",
      specialty: "anesthesiology",
      medication: "Midazolam",
      dosage: "2mg",
      route: "Intravenoso",
      frequency: "Una vez",
      duration: "Procedimiento",
      priority: "high",
      notes: "Monitoreo continuo de signos vitales. Tener flumazenil disponible."
    },
    {
      id: "anesth-2",
      name: "Náuseas Postoperatorias",
      specialty: "anesthesiology",
      medication: "Ondansetrón",
      dosage: "8mg",
      route: "Intravenoso",
      frequency: "Cada 8 horas",
      duration: "24 horas",
      priority: "normal",
      notes: "Administrar lentamente. Puede causar cefalea leve."
    },

    // Medicina Interna
    {
      id: "internal-1",
      name: "Fiebre Alta",
      specialty: "internal",
      medication: "Paracetamol",
      dosage: "1g",
      route: "Intravenoso",
      frequency: "Cada 8 horas",
      duration: "PRN",
      priority: "normal",
      notes: "No exceder 3g/día. Controlar temperatura cada 4 horas."
    },
    {
      id: "internal-2",
      name: "Infección Urinaria",
      specialty: "internal",
      medication: "Ciprofloxacino",
      dosage: "400mg",
      route: "Intravenoso",
      frequency: "Cada 12 horas",
      duration: "7 días",
      priority: "normal",
      notes: "Hidratación abundante. Cultivo de control post-tratamiento."
    }
  ]

  const specialties = [
    { id: "all", name: "Todas las Especialidades", icon: <Stethoscope className="w-4 h-4" /> },
    { id: "cardiology", name: "Cardiología", icon: <Heart className="w-4 h-4" /> },
    { id: "neurology", name: "Neurología", icon: <Brain className="w-4 h-4" /> },
    { id: "pulmonology", name: "Neumología", icon: <Wind className="w-4 h-4" /> },
    { id: "orthopedics", name: "Traumatología", icon: <Bone className="w-4 h-4" /> },
    { id: "ophthalmology", name: "Oftalmología", icon: <Eye className="w-4 h-4" /> },
    { id: "anesthesiology", name: "Anestesiología", icon: <Zap className="w-4 h-4" /> },
    { id: "internal", name: "Medicina Interna", icon: <Shield className="w-4 h-4" /> }
  ]

  const getSpecialtyIcon = (specialty: string) => {
    switch (specialty) {
      case "cardiology": return <Heart className="w-4 h-4" />
      case "neurology": return <Brain className="w-4 h-4" />
      case "pulmonology": return <Wind className="w-4 h-4" />
      case "orthopedics": return <Bone className="w-4 h-4" />
      case "ophthalmology": return <Eye className="w-4 h-4" />
      case "anesthesiology": return <Zap className="w-4 h-4" />
      case "internal": return <Shield className="w-4 h-4" />
      default: return <Pill className="w-4 h-4" />
    }
  }

  const getSpecialtyName = (specialty: string) => {
    const spec = specialties.find(s => s.id === specialty)
    return spec ? spec.name : specialty
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "normal":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredTemplates = orderTemplates.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getSpecialtyName(template.specialty).toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSpecialty = selectedSpecialty === "all" || template.specialty === selectedSpecialty
    
    return matchesSearch && matchesSpecialty
  })

  const handleSelectTemplate = (template: any) => {
    onSelectTemplate(template)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Plantillas de Órdenes Médicas</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full min-h-0">
          {/* Filtros */}
          <div className="space-y-4 pb-4 border-b">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, medicamento o especialidad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {specialties.map((specialty) => (
                <Button
                  key={specialty.id}
                  variant={selectedSpecialty === specialty.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSpecialty(specialty.id)}
                  className="flex items-center gap-2"
                >
                  {specialty.icon}
                  {specialty.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Lista de Plantillas */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {getSpecialtyIcon(template.specialty)}
                        <CardTitle className="text-base">{template.name}</CardTitle>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {getSpecialtyName(template.specialty)}
                        </Badge>
                        <Badge className={`${getPriorityColor(template.priority)} text-xs`}>
                          {template.priority.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-semibold text-lg text-blue-600">{template.medication}</p>
                      <p className="text-sm text-muted-foreground">
                        {template.dosage} • {template.route} • {template.frequency}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Duración:</span>
                        <span className="ml-1 font-medium">{template.duration}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Prioridad:</span>
                        <span className="ml-1 font-medium capitalize">{template.priority}</span>
                      </div>
                    </div>

                    {template.notes && (
                      <div className="bg-gray-50 p-2 rounded text-xs">
                        <p className="text-muted-foreground line-clamp-2">{template.notes}</p>
                      </div>
                    )}

                    <Button size="sm" className="w-full mt-3">
                      Usar Esta Plantilla
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No se encontraron plantillas que coincidan con tu búsqueda</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
