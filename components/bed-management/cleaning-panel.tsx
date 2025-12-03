'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useHospital } from '@/lib/hospital-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  PlayCircle,
  XCircle,
  FileText,
  Timer,
  Users
} from 'lucide-react';

// Checklist de limpieza estándar
const cleaningChecklist = [
  { id: 'bed_frame', label: 'Limpiar estructura de la cama', category: 'Cama' },
  { id: 'mattress', label: 'Desinfectar colchón', category: 'Cama' },
  { id: 'pillows', label: 'Cambiar/limpiar almohadas', category: 'Cama' },
  { id: 'bed_rails', label: 'Limpiar barandillas', category: 'Cama' },
  { id: 'bedside_table', label: 'Limpiar mesa de noche', category: 'Mobiliario' },
  { id: 'chair', label: 'Desinfectar silla/sillón', category: 'Mobiliario' },
  { id: 'bathroom', label: 'Limpiar baño completo', category: 'Baño' },
  { id: 'floor', label: 'Limpiar y desinfectar suelo', category: 'General' },
  { id: 'windows', label: 'Limpiar ventanas', category: 'General' },
  { id: 'equipment', label: 'Desinfectar equipos médicos', category: 'Equipamiento' },
  { id: 'waste', label: 'Retirar residuos', category: 'General' },
  { id: 'supplies', label: 'Reponer suministros', category: 'General' }
];

interface CleaningTask {
  bedId: string;
  roomNumber: string;
  bedNumber: string;
  department: string;
  priority: 'High' | 'Medium' | 'Low';
  estimatedTime: number;
  checklist: Record<string, boolean>;
  notes: string;
  startedAt?: Date;
  completedAt?: Date;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
}

export default function CleaningPanel() {
  const { user } = useAuth();
  const { rooms, beds, updateBedStatus } = useHospital();
  const { toast } = useToast();
  
  const [activeTasks, setActiveTasks] = useState<CleaningTask[]>([]);
  const [completedTasks, setCompletedTasks] = useState<CleaningTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<CleaningTask | null>(null);
  const [taskNotes, setTaskNotes] = useState('');

  // Obtener camas que requieren limpieza
  const bedsRequiringCleaning = beds.filter(bed => 
    bed.status === 'Cleaning Required' || bed.cleaningStatus === 'Dirty'
  );

  // Crear nueva tarea de limpieza
  const createCleaningTask = useCallback((bedId: string) => {
    const bed = beds.find(b => b.id === bedId);
    const room = rooms.find(r => r.id === bed?.roomId);
    
    if (!bed || !room) return;

    // Determinar prioridad basada en el tipo de habitación
    let priority: 'High' | 'Medium' | 'Low' = 'Medium';
    if (room.type === 'ICU' || room.type === 'CCU') priority = 'High';
    if (room.type === 'Emergency') priority = 'High';
    if (room.type === 'Surgery') priority = 'High';

    const newTask: CleaningTask = {
      bedId: bed.id,
      roomNumber: room.number,
      bedNumber: bed.number,
      department: room.department,
      priority,
      estimatedTime: room.type === 'ICU' ? 45 : 30, // minutos
      checklist: cleaningChecklist.reduce((acc, item) => {
        acc[item.id] = false;
        return acc;
      }, {} as Record<string, boolean>),
      notes: '',
      status: 'Pending'
    };

    setActiveTasks(prev => [...prev, newTask]);
    
    // Actualizar estado de la cama
    updateBedStatus(bedId, 'Cleaning Required');
    
    toast({
      title: "Tarea creada",
      description: `Nueva tarea de limpieza para Habitación ${room.number} - Cama ${bed.number}`,
    });
  }, [beds, rooms, updateBedStatus, toast]);

  // Iniciar tarea de limpieza
  const startTask = useCallback((taskIndex: number) => {
    setActiveTasks(prev => prev.map((task, index) => {
      if (index === taskIndex) {
        // Actualizar estado de la cama a "En Proceso"
        const bed = beds.find(b => b.id === task.bedId);
        if (bed) {
          // Actualizar limpieza en progreso
          const updatedBed = { ...bed, cleaningStatus: 'In Progress' as const };
          // Esta función debería existir en el contexto
          // updateBedCleaning(task.bedId, 'In Progress');
        }
        
        return {
          ...task,
          status: 'In Progress' as const,
          startedAt: new Date()
        };
      }
      return task;
    }));

    toast({
      title: "Tarea iniciada",
      description: "Has comenzado la limpieza de esta habitación",
    });
  }, [beds, toast]);

  // Completar tarea de limpieza
  const completeTask = useCallback((taskIndex: number) => {
    const task = activeTasks[taskIndex];
    if (!task) return;

    const completedTask = {
      ...task,
      status: 'Completed' as const,
      completedAt: new Date(),
      notes: taskNotes
    };

    // Mover a completadas
    setCompletedTasks(prev => [completedTask, ...prev]);
    setActiveTasks(prev => prev.filter((_, index) => index !== taskIndex));

    // Actualizar estado de la cama
    updateBedStatus(task.bedId, 'Available');
    
    // Registrar quién limpió (esto iría al contexto del hospital)
    // updateBedCleaning(task.bedId, 'Clean', user?.firstName + ' ' + user?.lastName);
    
    setTaskNotes('');
    setSelectedTask(null);

    toast({
      title: "Tarea completada",
      description: `Limpieza completada para Habitación ${task.roomNumber} - Cama ${task.bedNumber}`,
    });
  }, [activeTasks, taskNotes, updateBedStatus, toast]);

  // Cancelar tarea
  const cancelTask = useCallback((taskIndex: number) => {
    const task = activeTasks[taskIndex];
    if (!task) return;

    setActiveTasks(prev => prev.filter((_, index) => index !== taskIndex));
    
    toast({
      title: "Tarea cancelada",
      description: "La tarea de limpieza ha sido cancelada",
      variant: "destructive"
    });
  }, [activeTasks, toast]);

  // Actualizar checklist
  const updateChecklist = useCallback((taskIndex: number, itemId: string, checked: boolean) => {
    setActiveTasks(prev => prev.map((task, index) => {
      if (index === taskIndex) {
        return {
          ...task,
          checklist: {
            ...task.checklist,
            [itemId]: checked
          }
        };
      }
      return task;
    }));
  }, []);

  // Calcular progreso de la tarea
  const getTaskProgress = (task: CleaningTask) => {
    const totalItems = cleaningChecklist.length;
    const completedItems = Object.values(task.checklist).filter(Boolean).length;
    return Math.round((completedItems / totalItems) * 100);
  };

  // Calcular tiempo transcurrido
  const getElapsedTime = (startedAt: Date) => {
    const now = new Date();
    const diff = now.getTime() - startedAt.getTime();
    const minutes = Math.floor(diff / 60000);
    return minutes;
  };

  const pendingTasksCount = activeTasks.filter(t => t.status === 'Pending').length;
  const inProgressTasksCount = activeTasks.filter(t => t.status === 'In Progress').length;
  const todayCompletedCount = completedTasks.filter(t => {
    const today = new Date().toDateString();
    return t.completedAt?.toDateString() === today;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Camas Sucias</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{bedsRequiringCleaning.length}</div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingTasksCount}</div>
            <p className="text-xs text-muted-foreground">Sin iniciar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
            <PlayCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgressTasksCount}</div>
            <p className="text-xs text-muted-foreground">Activas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas Hoy</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{todayCompletedCount}</div>
            <p className="text-xs text-muted-foreground">Finalizadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Sección de camas que requieren limpieza */}
      {bedsRequiringCleaning.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Camas que Requieren Limpieza
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {bedsRequiringCleaning.map(bed => {
                const room = rooms.find(r => r.id === bed.roomId);
                const hasActiveTask = activeTasks.some(t => t.bedId === bed.id);
                
                return (
                  <div key={bed.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">
                        Habitación {room?.number} - Cama {bed.number}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {room?.department}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      Tipo: {room?.type}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => createCleaningTask(bed.id)}
                      disabled={hasActiveTask}
                      className="w-full"
                    >
                      {hasActiveTask ? 'Tarea Creada' : 'Crear Tarea de Limpieza'}
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tareas activas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Tareas de Limpieza Activas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay tareas de limpieza activas.
              <br />
              Las nuevas tareas aparecerán aquí cuando se creen.
            </div>
          ) : (
            <div className="space-y-4">
              {activeTasks.map((task, index) => {
                const progress = getTaskProgress(task);
                const isInProgress = task.status === 'In Progress';
                const elapsedTime = task.startedAt ? getElapsedTime(task.startedAt) : 0;
                
                return (
                  <Card key={index} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">
                            Habitación {task.roomNumber} - Cama {task.bedNumber}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {task.department} • {task.estimatedTime} min estimado
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={
                              task.priority === 'High' ? 'destructive' :
                              task.priority === 'Medium' ? 'outline' : 'secondary'
                            }
                          >
                            {task.priority}
                          </Badge>
                          <Badge 
                            variant={isInProgress ? 'default' : 'secondary'}
                          >
                            {task.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Progreso */}
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Progreso</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} />
                      </div>

                      {/* Tiempo */}
                      {isInProgress && task.startedAt && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Timer className="h-4 w-4" />
                          <span>Tiempo transcurrido: {elapsedTime} min</span>
                          {elapsedTime > task.estimatedTime && (
                            <Badge variant="outline" className="text-orange-600 border-orange-300">
                              Excedido
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Acciones */}
                      <div className="flex gap-2">
                        {task.status === 'Pending' && (
                          <Button
                            size="sm"
                            onClick={() => startTask(index)}
                            className="flex items-center gap-2"
                          >
                            <PlayCircle className="h-4 w-4" />
                            Iniciar
                          </Button>
                        )}
                        
                        {isInProgress && (
                          <>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setSelectedTask(task)}
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  Checklist
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>
                                    Checklist de Limpieza - Habitación {task.roomNumber}
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                  {cleaningChecklist.map(item => (
                                    <div key={item.id} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={item.id}
                                        checked={task.checklist[item.id]}
                                        onCheckedChange={(checked) => 
                                          updateChecklist(index, item.id, !!checked)
                                        }
                                      />
                                      <label 
                                        htmlFor={item.id}
                                        className="text-sm flex-1 cursor-pointer"
                                      >
                                        {item.label}
                                        <Badge variant="outline" className="ml-2 text-xs">
                                          {item.category}
                                        </Badge>
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </DialogContent>
                            </Dialog>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm"
                                  disabled={progress < 100}
                                  onClick={() => setSelectedTask(task)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Completar
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Completar Limpieza</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p className="text-sm text-muted-foreground">
                                    ¿Estás seguro de que has completado la limpieza de la Habitación {task.roomNumber} - Cama {task.bedNumber}?
                                  </p>
                                  <div>
                                    <label className="text-sm font-medium mb-2 block">
                                      Notas adicionales (opcional)
                                    </label>
                                    <Textarea
                                      placeholder="Observaciones, problemas encontrados, etc."
                                      value={taskNotes}
                                      onChange={(e) => setTaskNotes(e.target.value)}
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => completeTask(index)}
                                      className="flex-1"
                                    >
                                      Confirmar Completado
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => setSelectedTask(null)}
                                    >
                                      Cancelar
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => cancelTask(index)}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancelar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historial de tareas completadas */}
      {completedTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Tareas Completadas Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {completedTasks.slice(0, 5).map((task, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="font-medium text-sm">
                        Habitación {task.roomNumber} - Cama {task.bedNumber}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {task.department}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {task.completedAt?.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
