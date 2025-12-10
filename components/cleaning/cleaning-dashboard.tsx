"use client"

import React, { useState, useEffect, useMemo } from "react"
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
  Target,
  RefreshCw
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useHospital } from "@/lib/hospital-context"

interface CleaningTask {
  id: string;
  bedId?: string;
  room: string;
  bedNumber?: string;
  floor: number;
  type: string;
  status: string;
  priority: string;
  estimatedTime: string;
  assignedTo: string;
  lastCleaned: Date | null;
  notes: string;
  isFromSystem: boolean;
}

export default function CleaningDashboard() {
  const { user } = useAuth()
  const { rooms, beds, hospitalFloors, updateBedCleaning, staff } = useHospital()
  const [activeTab, setActiveTab] = useState("tasks")
  const [refreshKey, setRefreshKey] = useState(0)

  // Obtener personal de limpieza de demo
  const cleaningStaff = staff.filter(s => s.role === 'cleaning');
  const currentCleanerName = user?.firstName + " " + user?.lastName;

  // Datos por defecto de tareas (tareas adicionales estáticas)
  const defaultTasks: CleaningTask[] = [
    {
      id: "static-1",
      room: "101",
      floor: 1,
      type: "Limpieza Terminal",
      status: "pending",
      priority: "high",
      estimatedTime: "45 min",
      assignedTo: currentCleanerName,
      lastCleaned: null,
      notes: "Paciente con alta médica. Desinfección completa requerida.",
      isFromSystem: false
    },
    {
      id: "static-2", 
      room: "205",
      floor: 2,
      type: "Limpieza Diaria",
      status: "in_progress",
      priority: "normal", 
      estimatedTime: "30 min",
      assignedTo: currentCleanerName,
      lastCleaned: new Date(Date.now() - 2 * 60 * 60 * 1000),
      notes: "Paciente ambulatorio. Limpieza de rutina.",
      isFromSystem: false
    }
  ];

  // Convertir camas que necesitan limpieza a tareas
  const bedsNeedingCleaning = useMemo(() => {
    return beds
      .filter(bed => 
        bed.cleaningStatus === 'In Progress' || 
        bed.cleaningStatus === 'Cleaning Required' ||
        bed.status === 'Cleaning Required'
      )
      .map(bed => {
        const room = rooms.find(r => r.id === bed.roomId);
        return {
          id: `bed-${bed.id}`,
          bedId: bed.id,
          room: room?.number || bed.roomId,
          bedNumber: bed.number,
          floor: room?.floor || 1,
          type: bed.cleaningStatus === 'Cleaning Required' ? 'Desinfección' : 'Limpieza en Proceso',
          status: bed.cleaningStatus === 'In Progress' ? 'in_progress' : 'pending',
          priority: bed.cleaningStatus === 'Cleaning Required' ? 'high' : 'normal',
          estimatedTime: '30 min',
          assignedTo: bed.cleanedBy || currentCleanerName,
          lastCleaned: bed.lastCleaned || null,
          notes: `Habitación ${room?.number || 'N/A'} - Cama ${bed.number}. ${bed.cleaningStatus === 'Cleaning Required' ? 'Requiere limpieza urgente.' : 'En proceso de limpieza.'}`,
          isFromSystem: true
        } as CleaningTask;
      });
  }, [beds, rooms, currentCleanerName]);

  // Combinar tareas del sistema con tareas estáticas
  const [localTaskStatuses, setLocalTaskStatuses] = useState<Record<string, { status: string; lastCleaned: string | null }>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cleaningTasksStatus');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  // Todas las tareas combinadas
  const allTasks = useMemo(() => {
    // Tareas del sistema (camas)
    const systemTasks = bedsNeedingCleaning;
    
    // Tareas estáticas con estado local
    const staticTasksWithStatus = defaultTasks.map(task => ({
      ...task,
      status: localTaskStatuses[task.id]?.status || task.status,
      lastCleaned: localTaskStatuses[task.id]?.lastCleaned 
        ? new Date(localTaskStatuses[task.id].lastCleaned!) 
        : task.lastCleaned
    }));
    
    return [...systemTasks, ...staticTasksWithStatus];
  }, [bedsNeedingCleaning, localTaskStatuses, defaultTasks]);

  // Función para actualizar el estado de una tarea
  const updateTaskStatus = (taskId: string, newStatus: string) => {
    const task = allTasks.find(t => t.id === taskId);
    if (!task) return;

    // Si es una tarea del sistema (cama real)
    if (task.isFromSystem && task.bedId) {
      let cleaningStatus: 'Clean' | 'In Progress' | 'Cleaning Required' | 'Sanitized';
      
      switch (newStatus) {
        case 'completed':
          cleaningStatus = 'Clean';
          break;
        case 'in_progress':
          cleaningStatus = 'In Progress';
          break;
        default:
          cleaningStatus = 'Cleaning Required';
      }
      
      updateBedCleaning(task.bedId, cleaningStatus, currentCleanerName);
      
      // Forzar refresco
      setRefreshKey(prev => prev + 1);
    } else {
      // Tarea estática - guardar en localStorage
      const newStatuses = { ...localTaskStatuses };
      newStatuses[taskId] = {
        status: newStatus,
        lastCleaned: newStatus === 'completed' ? new Date().toISOString() : localTaskStatuses[taskId]?.lastCleaned || null
      };
      setLocalTaskStatuses(newStatuses);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('cleaningTasksStatus', JSON.stringify(newStatuses));
      }
    }
  }

  // Refresco automático cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

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

  // Estadísticas
  const completedTasks = allTasks.filter(task => task.status === "completed").length
  const totalTasks = allTasks.length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const pendingTasks = allTasks.filter(task => task.status === "pending")
  const inProgressTasks = allTasks.filter(task => task.status === "in_progress")

  // Camas limpias vs sucias
  const cleanBeds = beds.filter(bed => bed.cleaningStatus === 'Clean' || bed.cleaningStatus === 'Sanitized').length;
  const dirtyBeds = beds.filter(bed => bed.cleaningStatus === 'Cleaning Required' || bed.cleaningStatus === 'In Progress').length;

  return (
    <div className="space-y-6 p-6" key={refreshKey}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panel de Limpieza</h1>
          <p className="text-muted-foreground">
            Gestión de tareas de limpieza y desinfección hospitalaria
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-muted-foreground">
              {user?.firstName} {user?.lastName}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
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
            <CardTitle className="text-sm font-medium">Camas Limpias</CardTitle>
            <Sparkles className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{cleanBeds}</div>
            <p className="text-xs text-muted-foreground">
              de {beds.length} camas
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
            Mis Tareas ({allTasks.filter(t => t.status !== 'completed').length})
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
                Tareas Asignadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {allTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <p className="text-lg font-medium">¡Todo limpio!</p>
                  <p>No hay tareas de limpieza pendientes</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allTasks.map((task) => (
                    <div 
                      key={task.id}
                      className={`p-4 rounded-lg border ${
                        task.status === 'completed' ? 'bg-green-50 border-green-200' :
                        task.status === 'in_progress' ? 'bg-blue-50 border-blue-200' :
                        'bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getStatusIcon(task.status)}
                            <span className="font-semibold">
                              Habitación {task.room}
                              {task.bedNumber && ` - Cama ${task.bedNumber}`}
                            </span>
                            {task.isFromSystem && (
                              <Badge variant="outline" className="text-xs">
                                Sistema
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="outline" className={getStatusColor(task.status)}>
                              {task.status === 'pending' ? 'Pendiente' :
                               task.status === 'in_progress' ? 'En Progreso' : 'Completada'}
                            </Badge>
                            <Badge variant="outline" className={getPriorityColor(task.priority)}>
                              {task.priority === 'urgent' ? 'Urgente' :
                               task.priority === 'high' ? 'Alta' : 'Normal'}
                            </Badge>
                            <Badge variant="secondary">{task.type}</Badge>
                            <Badge variant="outline">Planta {task.floor}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{task.notes}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {task.estimatedTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {task.assignedTo}
                            </span>
                            {task.lastCleaned && (
                              <span>
                                Última limpieza: {task.lastCleaned.toLocaleString('es-ES')}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Botones de acción */}
                        <div className="flex gap-2 ml-4">
                          {task.status === 'pending' && (
                            <Button 
                              size="sm"
                              onClick={() => updateTaskStatus(task.id, 'in_progress')}
                            >
                              Iniciar
                            </Button>
                          )}
                          {task.status === 'in_progress' && (
                            <Button 
                              size="sm"
                              variant="default"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => updateTaskStatus(task.id, 'completed')}
                            >
                              Completar
                            </Button>
                          )}
                          {task.status === 'completed' && (
                            <Badge className="bg-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completada
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="floors" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {hospitalFloors.map((floor) => {
              const floorRooms = rooms.filter(r => r.floor === floor.number);
              const floorBeds = beds.filter(b => {
                const room = rooms.find(r => r.id === b.roomId);
                return room?.floor === floor.number;
              });
              const cleanFloorBeds = floorBeds.filter(b => b.cleaningStatus === 'Clean' || b.cleaningStatus === 'Sanitized').length;
              const dirtyFloorBeds = floorBeds.filter(b => b.cleaningStatus === 'Cleaning Required' || b.cleaningStatus === 'In Progress').length;
              
              return (
                <Card key={floor.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      <span>{floor.name}</span>
                      <Badge variant="outline">Planta {floor.number}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Habitaciones:</span>
                        <span className="font-medium">{floorRooms.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Camas totales:</span>
                        <span className="font-medium">{floorBeds.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          Limpias:
                        </span>
                        <span className="font-medium text-green-600">{cleanFloorBeds}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-yellow-600" />
                          Requieren limpieza:
                        </span>
                        <span className="font-medium text-yellow-600">{dirtyFloorBeds}</span>
                      </div>
                      <Progress 
                        value={floorBeds.length > 0 ? (cleanFloorBeds / floorBeds.length) * 100 : 100} 
                        className="h-2 mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
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
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Turno Mañana (07:00 - 15:00)</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Limpieza diaria de todas las habitaciones ocupadas</li>
                    <li>• Desinfección de áreas comunes</li>
                    <li>• Reposición de material sanitario</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Turno Tarde (15:00 - 23:00)</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Limpieza terminal de habitaciones con altas</li>
                    <li>• Desinfección de quirófanos</li>
                    <li>• Limpieza de emergencias según demanda</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-blue-600" />
                    Protocolo COVID-19
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Desinfección cada 2 horas en áreas de alto tránsito</li>
                    <li>• Uso obligatorio de EPP completo</li>
                    <li>• Registro de todas las actividades de limpieza</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
