"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter, Clock, AlertTriangle, CheckCircle, X, Trash2 } from "lucide-react"
import { useHospital } from "@/lib/hospital-context"
import { useToast } from "@/hooks/use-toast"

export function OrdersList() {
  const { medicalOrders, updateMedicalOrder, deleteMedicalOrder } = useHospital()
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
  }

  const ordersByStatus = {
    pending: filteredOrders.filter(order => order.status === "pending"),
    in_progress: filteredOrders.filter(order => order.status === "in_progress"),
    completed: filteredOrders.filter(order => order.status === "completed"),
    cancelled: filteredOrders.filter(order => order.status === "cancelled")
  }

  const OrderCard = ({ order }: { order: any }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{order.patientName}</CardTitle>
            <p className="text-sm text-muted-foreground">Habitación {order.roomNumber}</p>
          </div>
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
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="font-medium text-lg">{order.medication}</p>
            <p className="text-sm text-muted-foreground">
              {order.dosage} - {order.route} - {order.frequency}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Prescrito por:</p>
              <p className="font-medium">{order.orderBy}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Fecha:</p>
              <p className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</p>
            </div>
          </div>

          {order.notes && (
            <div>
              <p className="text-muted-foreground text-sm">Notas:</p>
              <p className="text-sm bg-gray-50 p-2 rounded">{order.notes}</p>
            </div>
          )}

          <div className="flex gap-2 pt-3">
            {order.status === "pending" && (
              <>
                <Button 
                  size="sm" 
                  onClick={() => handleStatusChange(order.id, "in_progress")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Iniciar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleStatusChange(order.id, "cancelled")}
                >
                  Cancelar
                </Button>
              </>
            )}
            
            {order.status === "in_progress" && (
              <>
                <Button 
                  size="sm" 
                  onClick={() => handleStatusChange(order.id, "completed")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Completar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleStatusChange(order.id, "cancelled")}
                >
                  Cancelar
                </Button>
              </>
            )}
            
            <Button 
              size="sm" 
              variant="outline"
              className="text-destructive hover:text-destructive border-destructive/50 hover:border-destructive"
              onClick={() => {
                if (confirm(`¿Estás seguro de eliminar esta orden de ${order.patientName}?`)) {
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

  return (
    <div className="space-y-6">
      {/* Header y Filtros */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Órdenes Médicas</h2>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Orden
          </Button>
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
