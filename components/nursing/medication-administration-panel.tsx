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
  Pill,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  User,
  Syringe,
  Plus,
  Eye,
  Search,
  Filter
} from "lucide-react"

export default function MedicationAdministrationPanel() {
  const { patients, medicalOrders, updateMedicalOrder, addMedicalOrder, getFilteredPatients } = useHospital()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [administrationDialog, setAdministrationDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRoom, setFilterRoom] = useState("all")
  const [showNewMedicationDialog, setShowNewMedicationDialog] = useState(false)
  
  // Estado para nueva medicación
  const [newMedication, setNewMedication] = useState({
    patientId: '',
    medication: '',
    dosage: '',
    route: '',
    frequency: '',
    notes: ''
  })
  
  // Obtener pacientes asignados
  const assignedPatients = getFilteredPatients()
  const hospitalizedPatients = assignedPatients.filter(p => p.roomId)
  
  const [administrationData, setAdministrationData] = useState({
    actualDose: "",
    administrationTime: new Date().toISOString().slice(0, 16),
    route: "",
    site: "",
    notes: "",
    patientResponse: "",
    vitalSigns: {
      bloodPressure: "",
      heartRate: "",
      temperature: ""
    }
  })

  // Filtrar órdenes médicas activas
  const activeOrders = medicalOrders.filter(order => 
    order.status === "pending" || order.status === "in_progress"
  )

  // Agrupar órdenes por estado
  const pendingOrders = activeOrders.filter(order => order.status === "pending")
  const inProgressOrders = activeOrders.filter(order => order.status === "in_progress")
  const completedToday = medicalOrders.filter(order => {
    const today = new Date().toDateString()
    return order.status === "completed" && 
           order.completedAt && 
           new Date(order.completedAt).toDateString() === today
  })

  // Filtrar por búsqueda y habitación
  const filterOrders = (orders: any[]) => {
    return orders.filter(order => {
      const matchesSearch = 
        order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.roomNumber?.includes(searchTerm)
      
      const matchesRoom = filterRoom === "all" || order.roomNumber === filterRoom
      
      return matchesSearch && matchesRoom
    })
  }

  // Obtener habitaciones únicas
  const uniqueRooms = [...new Set(activeOrders.map(order => order.roomNumber))].sort()

  const getNextDoseTime = (order: any) => {
    // Lógica simplificada para calcular próxima dosis
    const now = new Date()
    const frequency = order.frequency?.toLowerCase() || ""
    
    if (frequency.includes("4 horas")) {
      return new Date(now.getTime() + 4 * 60 * 60 * 1000)
    } else if (frequency.includes("6 horas")) {
      return new Date(now.getTime() + 6 * 60 * 60 * 1000)
    } else if (frequency.includes("8 horas")) {
      return new Date(now.getTime() + 8 * 60 * 60 * 1000)
    } else if (frequency.includes("12 horas")) {
      return new Date(now.getTime() + 12 * 60 * 60 * 1000)
    } else {
      return new Date(now.getTime() + 24 * 60 * 60 * 1000)
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
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleAdminister = () => {
    if (!selectedOrder) return

    const administrationRecord = {
      administeredBy: user?.firstName + " " + user?.lastName,
      administeredAt: new Date().toISOString(),
      actualDose: administrationData.actualDose || selectedOrder.dosage,
      route: administrationData.route || selectedOrder.route,
      site: administrationData.site,
      notes: administrationData.notes,
      patientResponse: administrationData.patientResponse,
      vitalSigns: administrationData.vitalSigns,
      nextDoseTime: getNextDoseTime(selectedOrder)
    }

    // Actualizar la orden médica
    updateMedicalOrder(selectedOrder.id, {
      status: "completed",
      completedAt: new Date().toISOString(),
      completedBy: user?.firstName + " " + user?.lastName,
      administrationRecords: [
        ...(selectedOrder.administrationRecords || []),
        administrationRecord
      ]
    })

    toast({
      title: "Medicamento Administrado",
      description: `${selectedOrder.medication} administrado correctamente a ${selectedOrder.patientName}`,
    })

    // Reset form
    setAdministrationData({
      actualDose: "",
      administrationTime: new Date().toISOString().slice(0, 16),
      route: "",
      site: "",
      notes: "",
      patientResponse: "",
      vitalSigns: {
        bloodPressure: "",
        heartRate: "",
        temperature: ""
      }
    })
    setSelectedOrder(null)
    setAdministrationDialog(false)
  }

  const OrderCard = ({ order }: { order: any }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Pill className="w-4 h-4 text-blue-600" />
              <h3 className="font-semibold text-lg">{order.medication}</h3>
              <Badge className={getPriorityColor(order.priority)}>
                {order.priority?.toUpperCase()}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <span className="text-muted-foreground">Paciente:</span>
                <span className="ml-2 font-medium">{order.patientName}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Habitación:</span>
                <span className="ml-2 font-medium">{order.roomNumber}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Dosis:</span>
                <span className="ml-2 font-medium">{order.dosage}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Vía:</span>
                <span className="ml-2 font-medium">{order.route}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Frecuencia:</span>
                <span className="ml-2 font-medium">{order.frequency}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Prescrito por:</span>
                <span className="ml-2 font-medium">{order.orderBy}</span>
              </div>
            </div>

            {order.notes && (
              <div className="bg-gray-50 p-2 rounded text-sm mb-3">
                <span className="font-medium">Notas:</span> {order.notes}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => {
              setSelectedOrder(order)
              setAdministrationDialog(true)
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            <Syringe className="w-4 h-4 mr-2" />
            Administrar
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              updateMedicalOrder(order.id, { status: "in_progress" })
            }}
          >
            <Clock className="w-4 h-4 mr-2" />
            Marcar en Proceso
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedOrder(order)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver Detalles
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  // Manejar agregar nueva medicación
  const handleAddMedication = () => {
    if (!newMedication.patientId || !newMedication.medication || !newMedication.dosage) {
      toast({
        title: "Error de validación",
        description: "Por favor completa los campos obligatorios",
        variant: "destructive",
      })
      return
    }
    
    const patient = patients.find(p => p.id === newMedication.patientId)
    
    addMedicalOrder({
      patientId: newMedication.patientId,
      patientName: patient ? `${patient.firstName} ${patient.lastName}` : '',
      roomNumber: patient?.roomId || '',
      doctorId: user?.id || '',
      type: 'Medication',
      medication: newMedication.medication,
      dosage: newMedication.dosage,
      route: newMedication.route || 'Oral',
      frequency: newMedication.frequency || 'Según necesidad',
      priority: 'Routine',
      status: 'pending',
      orderBy: `${user?.firstName} ${user?.lastName}`,
      notes: newMedication.notes,
      createdAt: new Date()
    })
    
    toast({
      title: "Medicación agregada",
      description: `${newMedication.medication} agregado para ${patient?.firstName} ${patient?.lastName}`,
    })
    
    // Resetear formulario
    setNewMedication({
      patientId: '',
      medication: '',
      dosage: '',
      route: '',
      frequency: '',
      notes: ''
    })
    setShowNewMedicationDialog(false)
  }

  return (
    <div className="space-y-6">
      {/* Header con botón de nueva medicación */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Administración de Medicamentos</h3>
          <p className="text-sm text-muted-foreground">Gestiona la administración de medicamentos a pacientes</p>
        </div>
        <Dialog open={showNewMedicationDialog} onOpenChange={setShowNewMedicationDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nueva Medicación
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Agregar Nueva Medicación</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Paciente *</Label>
                <Select 
                  value={newMedication.patientId} 
                  onValueChange={(v) => setNewMedication({...newMedication, patientId: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {hospitalizedPatients.length === 0 ? (
                      <SelectItem value="none" disabled>No hay pacientes asignados</SelectItem>
                    ) : (
                      hospitalizedPatients.map(p => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.firstName} {p.lastName} - Hab. {p.roomId}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Medicamento *</Label>
                <Input 
                  placeholder="Nombre del medicamento"
                  value={newMedication.medication}
                  onChange={(e) => setNewMedication({...newMedication, medication: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Dosis *</Label>
                  <Input 
                    placeholder="Ej: 500mg"
                    value={newMedication.dosage}
                    onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Vía</Label>
                  <Select 
                    value={newMedication.route} 
                    onValueChange={(v) => setNewMedication({...newMedication, route: v})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar vía" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Oral">Oral</SelectItem>
                      <SelectItem value="IV">Intravenosa (IV)</SelectItem>
                      <SelectItem value="IM">Intramuscular (IM)</SelectItem>
                      <SelectItem value="SC">Subcutánea (SC)</SelectItem>
                      <SelectItem value="Topical">Tópica</SelectItem>
                      <SelectItem value="Inhalation">Inhalación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Frecuencia</Label>
                <Select 
                  value={newMedication.frequency} 
                  onValueChange={(v) => setNewMedication({...newMedication, frequency: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar frecuencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cada 4 horas">Cada 4 horas</SelectItem>
                    <SelectItem value="Cada 6 horas">Cada 6 horas</SelectItem>
                    <SelectItem value="Cada 8 horas">Cada 8 horas</SelectItem>
                    <SelectItem value="Cada 12 horas">Cada 12 horas</SelectItem>
                    <SelectItem value="Una vez al día">Una vez al día</SelectItem>
                    <SelectItem value="Según necesidad">Según necesidad (PRN)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Notas</Label>
                <Textarea 
                  placeholder="Instrucciones adicionales..."
                  value={newMedication.notes}
                  onChange={(e) => setNewMedication({...newMedication, notes: e.target.value})}
                  rows={2}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewMedicationDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddMedication}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Medicación
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingOrders.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgressOrders.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completadas Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedToday.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{activeOrders.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Buscar por paciente, medicamento o habitación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterRoom} onValueChange={setFilterRoom}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por habitación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las habitaciones</SelectItem>
                {uniqueRooms.map(room => (
                  <SelectItem key={room} value={room}>
                    Habitación {room}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de órdenes */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pendientes ({filterOrders(pendingOrders).length})
          </TabsTrigger>
          <TabsTrigger value="in_progress">
            En Proceso ({filterOrders(inProgressOrders).length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completadas Hoy ({filterOrders(completedToday).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {filterOrders(pendingOrders).length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No hay medicamentos pendientes</p>
              </CardContent>
            </Card>
          ) : (
            filterOrders(pendingOrders).map(order => (
              <OrderCard key={order.id} order={order} />
            ))
          )}
        </TabsContent>

        <TabsContent value="in_progress" className="space-y-4 mt-6">
          {filterOrders(inProgressOrders).length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No hay medicamentos en proceso</p>
              </CardContent>
            </Card>
          ) : (
            filterOrders(inProgressOrders).map(order => (
              <OrderCard key={order.id} order={order} />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-6">
          {filterOrders(completedToday).length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No hay medicamentos completados hoy</p>
              </CardContent>
            </Card>
          ) : (
            filterOrders(completedToday).map(order => (
              <Card key={order.id} className="mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{order.medication}</h3>
                      <p className="text-sm text-muted-foreground">
                        {order.patientName} - Habitación {order.roomNumber}
                      </p>
                      <p className="text-xs text-green-600">
                        Completado: {order.completedAt ? new Date(order.completedAt).toLocaleString() : ""}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Completado
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog de Administración */}
      <Dialog open={administrationDialog} onOpenChange={setAdministrationDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Administrar Medicamento</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Información del medicamento */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información del Medicamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Medicamento:</span>
                      <p className="text-lg">{selectedOrder.medication}</p>
                    </div>
                    <div>
                      <span className="font-medium">Paciente:</span>
                      <p>{selectedOrder.patientName}</p>
                    </div>
                    <div>
                      <span className="font-medium">Dosis Prescrita:</span>
                      <p>{selectedOrder.dosage}</p>
                    </div>
                    <div>
                      <span className="font-medium">Vía Prescrita:</span>
                      <p>{selectedOrder.route}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Formulario de administración */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Registro de Administración</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="actualDose">Dosis Administrada</Label>
                      <Input
                        id="actualDose"
                        value={administrationData.actualDose}
                        onChange={(e) => setAdministrationData({
                          ...administrationData,
                          actualDose: e.target.value
                        })}
                        placeholder={selectedOrder.dosage}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="adminTime">Hora de Administración</Label>
                      <Input
                        id="adminTime"
                        type="datetime-local"
                        value={administrationData.administrationTime}
                        onChange={(e) => setAdministrationData({
                          ...administrationData,
                          administrationTime: e.target.value
                        })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="route">Vía de Administración</Label>
                      <Input
                        id="route"
                        value={administrationData.route}
                        onChange={(e) => setAdministrationData({
                          ...administrationData,
                          route: e.target.value
                        })}
                        placeholder={selectedOrder.route}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="site">Sitio de Administración</Label>
                      <Input
                        id="site"
                        value={administrationData.site}
                        onChange={(e) => setAdministrationData({
                          ...administrationData,
                          site: e.target.value
                        })}
                        placeholder="Ej: Brazo derecho, abdomen..."
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notas de Administración</Label>
                    <Textarea
                      id="notes"
                      value={administrationData.notes}
                      onChange={(e) => setAdministrationData({
                        ...administrationData,
                        notes: e.target.value
                      })}
                      placeholder="Observaciones durante la administración..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="response">Respuesta del Paciente</Label>
                    <Textarea
                      id="response"
                      value={administrationData.patientResponse}
                      onChange={(e) => setAdministrationData({
                        ...administrationData,
                        patientResponse: e.target.value
                      })}
                      placeholder="Reacción, efectos observados..."
                      rows={2}
                    />
                  </div>

                  {/* Signos vitales post-administración */}
                  <div>
                    <Label className="text-base font-semibold">Signos Vitales Post-Administración (Opcional)</Label>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div>
                        <Label htmlFor="bp">Presión Arterial</Label>
                        <Input
                          id="bp"
                          value={administrationData.vitalSigns.bloodPressure}
                          onChange={(e) => setAdministrationData({
                            ...administrationData,
                            vitalSigns: {
                              ...administrationData.vitalSigns,
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
                          value={administrationData.vitalSigns.heartRate}
                          onChange={(e) => setAdministrationData({
                            ...administrationData,
                            vitalSigns: {
                              ...administrationData.vitalSigns,
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
                          value={administrationData.vitalSigns.temperature}
                          onChange={(e) => setAdministrationData({
                            ...administrationData,
                            vitalSigns: {
                              ...administrationData.vitalSigns,
                              temperature: e.target.value
                            }
                          })}
                          placeholder="36.5"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Botones */}
              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setAdministrationDialog(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAdminister}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirmar Administración
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
