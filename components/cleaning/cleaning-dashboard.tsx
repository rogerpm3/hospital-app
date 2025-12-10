"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Sparkles, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  User,
  MapPin,
  ClipboardList,
  Timer,
  Target
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useHospital } from "@/lib/hospital-context"

export default function CleaningDashboard() {
  const { user } = useAuth()
  const { rooms, beds, hospitalFloors } = useHospital()
  const [activeTab, setActiveTab] = useState("tasks")

  // Datos por defecto de tareas
  const defaultTasks = [
    {
      id: "1",
      room: "101",
      floor: 1,
      type: "Limpieza Terminal",
      status: "pending",
      priority: "high",
      estimatedTime: "45 min",
      assignedTo: user?.firstName + " " + user?.lastName,
      lastCleaned: null as Date | null,
      notes: "Paciente con alta médica. Desinfección completa requerida."
    },
    {
      id: "2", 
      room: "205",
      floor: 2,
      type: "Limpieza Diaria",
      status: "in_progress",
      priority: "normal", 
      estimatedTime: "30 min",
      assignedTo: user?.firstName + " " + user?.lastName,
      lastCleaned: new Date(Date.now() - 2 * 60 * 60 * 1000),
      notes: "Paciente ambulatorio. Limpieza de rutina."
    },
    {
      id: "3",
      room: "102", 
      floor: 1,
      type: "Desinfección",
      status: "completed",
      priority: "urgent",
      estimatedTime: "60 min",
      assignedTo: user?.firstName + " " + user?.lastName,
      lastCleaned: new Date(Date.now() - 1 * 60 * 60 * 1000),
      notes: "Protocolo COVID-19 aplicado completamente."
    },
    {
      id: "4",
      room: "304",
      floor: 3,
      type: "Limpieza Diaria", 
      status: "pending",
      priority: "normal",
      estimatedTime: "25 min",
      assignedTo: user?.firstName + " " + user?.lastName,
      lastCleaned: new Date(Date.now() - 24 * 60 * 60 * 1000),
      notes: ""
    }
  ];

  // Estado de tareas de limpieza - con persistencia en localStorage
  const [cleaningTasks, setCleaningTasks] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cleaningTasksStatus');
      if (saved) {
        const savedStatuses = JSON.parse(saved) as Record<string, { status: string; lastCleaned: string | null }>;
        return defaultTasks.map(task => ({
          ...task,
          status: savedStatuses[task.id]?.status || task.status,
          lastCleaned: savedStatuses[task.id]?.lastCleaned 
            ? new Date(savedStatuses[task.id].lastCleaned) 
            : task.lastCleaned
        }));
      }
    }
    return defaultTasks;
  })

  // Función para cambiar el estado de una tarea - con persistencia
  const updateTaskStatus = (taskId: string, newStatus: string) => {
    setCleaningTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status: newStatus,
              lastCleaned: newStatus === 'completed' ? new Date() : task.lastCleaned
            }
          : task
      );
      
      // Persistir en localStorage
      if (typeof window !== 'undefined') {
        const statusesToSave: Record<string, { status: string; lastCleaned: string | null }> = {};
        updatedTasks.forEach(task => {
          statusesToSave[task.id] = {
            status: task.status,
            lastCleaned: task.lastCleaned ? task.lastCleaned.toISOString() : null
          };
        });
        localStorage.setItem('cleaningTasksStatus', JSON.stringify(statusesToSave));
      }
      
      return updatedTasks;
    });
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "in_progress":
        return <Timer className="w-4 h-4 text-blue-600" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in_progress": 
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "normal":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const completedTasks = cleaningTasks.filter(task => task.status === "completed").length
  const totalTasks = cleaningTasks.length
  const completionRate = Math.round((completedTasks / totalTasks) * 100)

  const pendingTasks = cleaningTasks.filter(task => task.status === "pending")
  const inProgressTasks = cleaningTasks.filter(task => task.status === "in_progress")

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panel de Limpieza</h1>
          <p className="text-muted-foreground">
            Gestión de tareas de limpieza y desinfección hospitalaria
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <span className="text-sm text-muted-foreground">
            {user?.firstName} {user?.lastName}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tareas Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              de {totalTasks} tareas totales
            </p>
            <Progress value={completionRate} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
            <Timer className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgressTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              tareas activas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              tareas por iniciar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eficiencia</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              tasa de finalización
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Mis Tareas
          </TabsTrigger>
          <TabsTrigger value="floors" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Plantas
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Programación
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                Lista de Tareas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cleaningTasks.map((task) => (
                  <Card key={task.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(task.status)}
                              <h3 className="font-semibold">Habitación {task.room}</h3>
                            </div>
                            <Badge className={getStatusColor(task.status)}>
                              {task.status === "pending" ? "Pendiente" : 
                               task.status === "in_progress" ? "En Progreso" : "Completado"}
                            </Badge>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority === "urgent" ? "Urgente" :
                               task.priority === "high" ? "Alta" : "Normal"}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Tipo:</span>
                              <span className="ml-2 font-medium">{task.type}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Tiempo estimado:</span>
                              <span className="ml-2 font-medium">{task.estimatedTime}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Asignado a:</span>
                              <span className="ml-2 font-medium">{task.assignedTo}</span>
                            </div>
                          </div>

                          {task.lastCleaned && (
                            <div className="mt-2 text-sm">
                              <span className="text-muted-foreground">Última limpieza:</span>
                              <span className="ml-2">{task.lastCleaned.toLocaleString()}</span>
                            </div>
                          )}

                          {task.notes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-md">
                              <p className="text-sm">{task.notes}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {task.status === "pending" && (
                            <Button 
                              size="sm" 
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => updateTaskStatus(task.id, "in_progress")}
                            >
                              Iniciar Tarea
                            </Button>
                          )}
                          {task.status === "in_progress" && (
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => updateTaskStatus(task.id, "completed")}
                            >
                              Finalizar
                            </Button>
                          )}
                          {task.status === "completed" && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-green-600"
                              onClick={() => updateTaskStatus(task.id, "pending")}
                            >
                              ✓ Completado
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="floors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Estado de Limpieza por Plantas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5].map(floor => {
                  const floorTasks = cleaningTasks.filter(t => t.floor === floor)
                  const floorCompleted = floorTasks.filter(t => t.status === 'completed').length
                  const floorPending = floorTasks.filter(t => t.status === 'pending').length
                  const floorInProgress = floorTasks.filter(t => t.status === 'in_progress').length
                  const floorTotal = floorTasks.length
                  const floorProgress = floorTotal > 0 ? Math.round((floorCompleted / floorTotal) * 100) : 100
                  
                  return (
                    <Card key={floor} className="border-2">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Planta {floor}</CardTitle>
                          <Badge className={floorProgress === 100 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                            {floorProgress}%
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Progress value={floorProgress} className="h-2 mb-4" />
                        <div className="grid grid-cols-3 gap-2 text-center text-sm">
                          <div className="p-2 bg-yellow-50 rounded">
                            <div className="font-bold text-yellow-600">{floorPending}</div>
                            <div className="text-xs text-gray-600">Pendientes</div>
                          </div>
                          <div className="p-2 bg-blue-50 rounded">
                            <div className="font-bold text-blue-600">{floorInProgress}</div>
                            <div className="text-xs text-gray-600">En curso</div>
                          </div>
                          <div className="p-2 bg-green-50 rounded">
                            <div className="font-bold text-green-600">{floorCompleted}</div>
                            <div className="text-xs text-gray-600">Completas</div>
                          </div>
                        </div>
                        {floorTasks.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <p className="text-xs font-medium text-gray-500 uppercase">Habitaciones:</p>
                            <div className="flex flex-wrap gap-1">
                              {floorTasks.map(task => (
                                <Badge 
                                  key={task.id}
                                  className={
                                    task.status === 'completed' ? 'bg-green-100 text-green-700' :
                                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                    'bg-yellow-100 text-yellow-700'
                                  }
                                >
                                  {task.room}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Programación de Limpieza
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Horario del día */}
                <div>
                  <h3 className="font-semibold mb-3">Horario de Hoy</h3>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="font-medium">08:00 - 10:00</p>
                          <p className="text-sm text-muted-foreground">Limpieza Terminal - Hab. 101</p>
                        </div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Programado</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Timer className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="font-medium">10:30 - 11:00</p>
                          <p className="text-sm text-muted-foreground">Limpieza Diaria - Hab. 205</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">En Progreso</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="font-medium">11:15 - 12:00</p>
                          <p className="text-sm text-muted-foreground">Desinfección - Hab. 102</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Completado</Badge>
                    </div>
                  </div>
                </div>

                {/* Próximas tareas */}
                <div>
                  <h3 className="font-semibold mb-3 text-gray-900">Próximas Tareas</h3>
                  <div className="grid gap-3">
                    {pendingTasks.map((task, index) => (
                      <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg bg-amber-50">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-amber-600" />
                          <div>
                            <p className="font-medium text-gray-900">Habitación {task.room} - Planta {task.floor}</p>
                            <p className="text-sm text-gray-600">{task.type} • {task.estimatedTime}</p>
                          </div>
                        </div>
                        {index === 0 && <Badge className="bg-amber-100 text-amber-800">Siguiente</Badge>}
                      </div>
                    ))}
                    {pendingTasks.length === 0 && (
                      <div className="p-4 text-center text-gray-500">
                        No hay tareas pendientes
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
