"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  User, 
  Calendar, 
  Clock, 
  Pill, 
  Route,
  FileText,
  AlertTriangle,
  CheckCircle,
  X,
  Edit
} from "lucide-react"
import { useHospital } from "@/lib/hospital-context"
import { useAuth } from "@/lib/auth-context"

interface OrderDetailsDialogProps {
  order: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderDetailsDialog({ order, open, onOpenChange }: OrderDetailsDialogProps) {
  const { updateMedicalOrder, patients } = useHospital()
  const { user } = useAuth()
  const [adminNotes, setAdminNotes] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  
  const patient = patients.find(p => p.id === order.patientId)
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "in_progress":
        return <AlertTriangle className="w-4 h-4 text-blue-500" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "cancelled":
        return <X className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "normal":
        return "bg-green-100 text-green-800 border-green-200"
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleStatusChange = (newStatus: string) => {
    const updateData: any = { 
      status: newStatus,
      lastUpdatedBy: user?.name,
      lastUpdatedAt: new Date().toISOString()
    }

    if (newStatus === "completed") {
      updateData.completedAt = new Date().toISOString()
      updateData.completedBy = user?.name
    }

    if (adminNotes.trim()) {
      updateData.adminNotes = [
        ...(order.adminNotes || []),
        {
          note: adminNotes,
          addedBy: user?.name,
          addedAt: new Date().toISOString()
        }
      ]
      setAdminNotes("")
    }

    updateMedicalOrder(order.id, updateData)
  }

  const addNote = () => {
    if (!adminNotes.trim()) return

    const newNote = {
      note: adminNotes,
      addedBy: user?.name,
      addedAt: new Date().toISOString()
    }

    updateMedicalOrder(order.id, {
      adminNotes: [...(order.adminNotes || []), newNote]
    })

    setAdminNotes("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Detalles de la Orden Médica</DialogTitle>
            <div className="flex items-center gap-2">
              <Badge className={getPriorityColor(order.priority)}>
                {order.priority.toUpperCase()}
              </Badge>
              <Badge className={getStatusBadgeColor(order.status)}>
                {getStatusIcon(order.status)}
                <span className="ml-1 capitalize">{order.status.replace('_', ' ')}</span>
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del Paciente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Información del Paciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nombre</p>
                  <p className="font-semibold text-lg">{order.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Habitación</p>
                  <p className="font-medium">{order.roomNumber || "No asignada"}</p>
                </div>
                {patient && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">ID Paciente</p>
                      <p className="font-medium">{patient.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Edad</p>
                      <p className="font-medium">{patient.age} años</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Información del Medicamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="w-5 h-5" />
                Información del Medicamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Medicamento</p>
                  <p className="font-semibold text-xl">{order.medication}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Dosis</p>
                    <p className="font-medium">{order.dosage}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Vía</p>
                    <p className="font-medium">{order.route}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Frecuencia</p>
                    <p className="font-medium">{order.frequency}</p>
                  </div>
                </div>

                {order.duration && (
                  <div>
                    <p className="text-sm text-muted-foreground">Duración del Tratamiento</p>
                    <p className="font-medium">{order.duration}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Información de la Orden */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Información de la Orden
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Prescrito por</p>
                  <p className="font-medium">{order.orderBy}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de Prescripción</p>
                  <p className="font-medium">
                    {new Date(order.orderDate).toLocaleString()}
                  </p>
                </div>
                
                {order.startDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Inicio del Tratamiento</p>
                    <p className="font-medium">
                      {new Date(order.startDate).toLocaleString()}
                    </p>
                  </div>
                )}
                
                {order.endDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Fin del Tratamiento</p>
                    <p className="font-medium">
                      {new Date(order.endDate).toLocaleString()}
                    </p>
                  </div>
                )}

                {order.lastUpdatedBy && (
                  <div>
                    <p className="text-sm text-muted-foreground">Última actualización</p>
                    <p className="font-medium">
                      {order.lastUpdatedBy} - {new Date(order.lastUpdatedAt).toLocaleString()}
                    </p>
                  </div>
                )}

                {order.completedBy && (
                  <div>
                    <p className="text-sm text-muted-foreground">Completado por</p>
                    <p className="font-medium">
                      {order.completedBy} - {new Date(order.completedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notas de la Prescripción */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notas de la Prescripción</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{order.notes}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notas de Seguimiento */}
          {order.adminNotes && order.adminNotes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Notas de Seguimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.adminNotes.map((note: any, index: number) => (
                    <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                      <p className="whitespace-pre-wrap">{note.note}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {note.addedBy} - {new Date(note.addedAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Agregar Nota */}
          <Card>
            <CardHeader>
              <CardTitle>Agregar Nota de Seguimiento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="admin-notes">Nueva Nota</Label>
                <Textarea
                  id="admin-notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Agregar observaciones, cambios en el tratamiento, etc."
                  rows={3}
                />
              </div>
              <Button onClick={addNote} disabled={!adminNotes.trim()}>
                Agregar Nota
              </Button>
            </CardContent>
          </Card>

          {/* Acciones */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {order.status === "pending" && (
                  <>
                    <Button 
                      onClick={() => handleStatusChange("in_progress")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Iniciar Administración
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => handleStatusChange("cancelled")}
                    >
                      Cancelar Orden
                    </Button>
                  </>
                )}
                
                {order.status === "in_progress" && (
                  <>
                    <Button 
                      onClick={() => handleStatusChange("completed")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Marcar como Completado
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => handleStatusChange("cancelled")}
                    >
                      Cancelar Orden
                    </Button>
                  </>
                )}
                
                {(order.status === "completed" || order.status === "cancelled") && (
                  <Badge variant="outline" className="px-4 py-2">
                    Orden {order.status === "completed" ? "Completada" : "Cancelada"}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
