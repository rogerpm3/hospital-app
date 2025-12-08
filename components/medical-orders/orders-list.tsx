"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter, Clock, AlertTriangle, CheckCircle, X, Trash2, Pill } from "lucide-react"
import { useHospital } from "@/lib/hospital-context"
import { useToast } from "@/hooks/use-toast"
import { CreateOrderDialog } from "./create-order-dialog"

export function OrdersList() {
  const { medicalOrders, patients, updateMedicalOrder, deleteMedicalOrder } = useHospital()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const filteredOrders = medicalOrders.filter(order => {
    const patientName = order.patientName || order.description || ''
    const medication = order.medication || order.description || ''
    const orderBy = order.orderBy || order.orderedBy || ''
    
    const matchesSearch = 
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orderBy.toLowerCase().includes(searchTerm.toLowerCase())
    
    const orderStatus = order.status?.toLowerCase() || 'pending'
    const orderPriority = order.priority?.toLowerCase() || 'normal'
    
    const matchesStatus = statusFilter === "all" || orderStatus === statusFilter.toLowerCase()
    const matchesPriority = priorityFilter === "all" || orderPriority === priorityFilter.toLowerCase()
    
    return matchesSearch && matchesStatus && matchesPriority
  })

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
        return "text-red-600 font-semibold"
      case "high":
        return "text-orange-600 font-medium"
      case "normal":
        return "text-green-600"
      case "low":
        return "text-gray-600"
      default:
        return "text-gray-600"
    }
  }

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateMedicalOrder(orderId, { status: newStatus })
    toast({
      title: "Estado actualizado",
      description: `La orden médica ha sido actualizada a: ${
        newStatus === 'Completed' ? 'Completada' :
        newStatus === 'In Progress' ? 'En Proceso' :
        newStatus === 'Cancelled' ? 'Cancelada' :
        newStatus === 'Pending' ? 'Pendiente' : newStatus
      }`,
    })
  }

  const ordersByStatus = {
    pending: filteredOrders.filter(order => order.status === "pending"),
    in_progress: filteredOrders.filter(order => order.status === "in_progress"),
    completed: filteredOrders.filter(order => order.status === "completed"),
    cancelled: filteredOrders.filter(order => order.status === "cancelled")
  }

  const OrderCard = ({ order }: { order: any }) => {
    // Obtener paciente si existe
    const patient = patients.find(p => p.id === order.patientId)
    const patientName = order.patientName || (patient ? `${patient.firstName} ${patient.lastName}` : 'Paciente desconocido')
    const roomNumber = order.roomNumber || patient?.roomId || 'N/A'
    const orderStatus = order.status?.toLowerCase() || 'pending'
    const orderPriority = order.priority?.toLowerCase() || 'normal'
    const orderedBy = order.orderBy || order.orderedBy || order.physicianName || 'No especificado'
    const orderDate = order.orderDate ? new Date(order.orderDate) : (order.orderedDate ? new Date(order.orderedDate) : new Date())
    
    return (
      <Card className="mb-4 hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">{patientName}</CardTitle>
              <p className="text-sm text-gray-600">Habitación: {roomNumber}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getPriorityColor(orderPriority)}>
                {orderPriority.toUpperCase()}
              </Badge>
              <Badge className={getStatusBadgeColor(orderStatus)}>
                {getStatusIcon(orderStatus)}
                <span className="ml-1 capitalize">{orderStatus.replace('_', ' ')}</span>
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Tipo y descripción de la orden */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 mb-1">
                <Pill className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-gray-900">{order.type || 'Orden Médica'}</span>
              </div>
              <p className="font-medium text-lg text-gray-900">
                {order.medication || order.description || 'Sin descripción'}
              </p>
              {(order.dosage || order.route || order.frequency) && (
                <p className="text-sm text-gray-700 mt-1">
                  {[order.dosage, order.route, order.frequency].filter(Boolean).join(' • ')}
                </p>
              )}
            </div>
            
            {/* Instrucciones si existen */}
            {order.instructions && (
              <div>
                <p className="text-sm font-medium text-gray-700">Instrucciones:</p>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{order.instructions}</p>
              </div>
            )}
            
            {/* Información de la orden */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Prescrito por:</p>
                <p className="font-medium text-gray-900">{orderedBy}</p>
              </div>
              <div>
                <p className="text-gray-500">Fecha:</p>
                <p className="font-medium text-gray-900">{orderDate.toLocaleDateString('es-ES')}</p>
              </div>
              {order.category && (
                <div>
                  <p className="text-gray-500">Categoría:</p>
                  <p className="font-medium text-gray-900">{order.category}</p>
                </div>
              )}
              {order.duration && (
                <div>
                  <p className="text-gray-500">Duración:</p>
                  <p className="font-medium text-gray-900">{order.duration}</p>
                </div>
              )}
            </div>

            {order.notes && (
              <div>
                <p className="text-gray-500 text-sm">Notas adicionales:</p>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{order.notes}</p>
              </div>
            )}

            <div className="flex gap-2 pt-3 border-t">
              {(orderStatus === "pending" || orderStatus === "Pending") && (
                <>
                  <Button 
                    size="sm" 
                    onClick={() => handleStatusChange(order.id, "In Progress")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Iniciar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleStatusChange(order.id, "Cancelled")}
                  >
                    Cancelar
                  </Button>
                </>
              )}
              
              {(orderStatus === "in progress" || orderStatus === "In Progress") && (
                <>
                  <Button 
                    size="sm" 
                    onClick={() => handleStatusChange(order.id, "Completed")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Completar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleStatusChange(order.id, "Cancelled")}
                  >
                    Cancelar
                  </Button>
                </>
              )}
              
              <Button 
                size="sm" 
                variant="outline"
                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
                onClick={() => {
                  if (confirm(`¿Estás seguro de eliminar esta orden?`)) {
                    deleteMedicalOrder(order.id)
                    toast({
                      title: "Orden eliminada",
                      description: "La orden médica ha sido eliminada correctamente",
                    })
                  }
                }}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Eliminar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header y Filtros */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Órdenes Médicas</h2>
          <CreateOrderDialog />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Buscar por paciente, medicamento o médico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="in_progress">En proceso</SelectItem>
              <SelectItem value="completed">Completado</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las prioridades</SelectItem>
              <SelectItem value="urgent">Urgente</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="low">Baja</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Vista por Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            Todas ({filteredOrders.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pendientes ({ordersByStatus.pending.length})
          </TabsTrigger>
          <TabsTrigger value="in_progress">
            En Proceso ({ordersByStatus.in_progress.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completadas ({ordersByStatus.completed.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Canceladas ({ordersByStatus.cancelled.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No se encontraron órdenes</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4 mt-6">
          <div className="grid gap-4">
            {ordersByStatus.pending.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="in_progress" className="space-y-4 mt-6">
          <div className="grid gap-4">
            {ordersByStatus.in_progress.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-6">
          <div className="grid gap-4">
            {ordersByStatus.completed.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4 mt-6">
          <div className="grid gap-4">
            {ordersByStatus.cancelled.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
