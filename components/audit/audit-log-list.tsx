'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Search, Filter, Shield, Eye, Download, Clock, User, Monitor, MapPin, FileText, AlertTriangle, Activity } from 'lucide-react';
import { mockAuditLogs } from '@/lib/mock-data';

export default function AuditLogList() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [resourceFilter, setResourceFilter] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<typeof mockAuditLogs[0] | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Filtrar logs de auditoría
  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    const matchesResource = resourceFilter === 'all' || log.resource === resourceFilter;
    
    return matchesSearch && matchesAction && matchesSeverity && matchesResource;
  });

  // Obtener valores únicos para filtros
  const uniqueActions = [...new Set(mockAuditLogs.map(log => log.action))];
  const uniqueResources = [...new Set(mockAuditLogs.map(log => log.resource))];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'destructive';
      case 'High':
        return 'outline';
      case 'Medium':
        return 'secondary';
      case 'Low':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Auditoría del Sistema</h1>
          <p className="text-muted-foreground">
            Registro completo de actividades y cambios en el sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAuditLogs.length}</div>
            <p className="text-xs text-muted-foreground">
              Registros de auditoría
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Críticos</CardTitle>
            <Shield className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {mockAuditLogs.filter(log => log.severity === 'Critical').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Requieren atención
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {new Set(mockAuditLogs.map(log => log.userId)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Usuarios únicos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Hoy</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockAuditLogs.filter(log => 
                log.timestamp.toDateString() === new Date().toDateString()
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Actividad diaria
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Usuario, acción, recurso..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Acción</label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las acciones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las acciones</SelectItem>
                  {uniqueActions.map(action => (
                    <SelectItem key={action} value={action}>{action}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Severidad</label>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las severidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las severidades</SelectItem>
                  <SelectItem value="Critical">Crítica</SelectItem>
                  <SelectItem value="High">Alta</SelectItem>
                  <SelectItem value="Medium">Media</SelectItem>
                  <SelectItem value="Low">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Recurso</label>
              <Select value={resourceFilter} onValueChange={setResourceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los recursos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los recursos</SelectItem>
                  {uniqueResources.map(resource => (
                    <SelectItem key={resource} value={resource}>{resource}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Acciones</label>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setActionFilter('all');
                  setSeverityFilter('all');
                  setResourceFilter('all');
                }}
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de logs */}
      <Card>
        <CardHeader>
          <CardTitle>
            Registro de Auditoría ({filteredLogs.length} eventos)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Recurso</TableHead>
                <TableHead>Severidad</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Detalles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map(log => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {log.timestamp.toLocaleDateString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {log.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{log.userId}</div>
                      <div className="text-sm text-muted-foreground">
                        {log.userRole}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.action}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{log.resource}</div>
                      {log.resourceId && (
                        <div className="text-sm text-muted-foreground">
                          ID: {log.resourceId}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getSeverityColor(log.severity)}>
                      {log.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 text-gray-900 px-1 py-0.5 rounded font-mono">
                      {log.ipAddress || 'N/A'}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 flex items-center gap-1"
                      onClick={() => {
                        setSelectedLog(log);
                        setShowDetailsDialog(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="text-xs">Ver Detalles</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron eventos de auditoría que coincidan con los filtros aplicados.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de detalles del evento de auditoría */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5 text-blue-600" />
              Detalles del Evento de Auditoría
            </DialogTitle>
            <DialogDescription>
              Información completa del registro de auditoría seleccionado
            </DialogDescription>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-6">
              {/* Encabezado con severidad */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <Activity className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-lg">{selectedLog.action}</h3>
                    <p className="text-sm text-muted-foreground">ID: {selectedLog.id}</p>
                  </div>
                </div>
                <Badge 
                  variant={getSeverityColor(selectedLog.severity)}
                  className={`text-sm px-3 py-1 ${
                    selectedLog.severity === 'Critical' ? 'bg-red-100 text-red-700 border-red-300' :
                    selectedLog.severity === 'High' ? 'bg-orange-100 text-orange-700 border-orange-300' :
                    selectedLog.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                    'bg-green-100 text-green-700 border-green-300'
                  }`}
                >
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Severidad: {selectedLog.severity}
                </Badge>
              </div>

              {/* Información del evento */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Fecha y hora */}
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Fecha y Hora</p>
                        <p className="font-medium">
                          {selectedLog.timestamp.toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-sm">
                          {selectedLog.timestamp.toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Usuario */}
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Usuario que realizó la acción</p>
                        <p className="font-medium">{selectedLog.userId}</p>
                        <Badge variant="outline" className="mt-1">{selectedLog.userRole}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recurso afectado */}
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <Monitor className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Recurso Afectado</p>
                        <p className="font-medium">{selectedLog.resource}</p>
                        {selectedLog.resourceId && (
                          <p className="text-sm text-muted-foreground">
                            ID del recurso: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{selectedLog.resourceId}</code>
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Dirección IP */}
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Dirección IP de origen</p>
                        <code className="font-mono text-lg bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {selectedLog.ipAddress || 'No disponible'}
                        </code>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detalles adicionales */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Descripción del Evento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-gray-700 dark:text-gray-300">
                      {getActionDescription(selectedLog.action, selectedLog.resource, selectedLog.resourceId)}
                    </p>
                    
                    <div className="border-t pt-3 mt-3">
                      <p className="text-sm text-muted-foreground">
                        <strong>Tipo de Acción:</strong> {getActionType(selectedLog.action)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        <strong>Impacto:</strong> {getImpactDescription(selectedLog.severity)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Botones de acción */}
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    // Simular exportación del registro individual
                    alert(`Exportando registro ${selectedLog.id}...`);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Registro
                </Button>
                <Button onClick={() => setShowDetailsDialog(false)}>
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Funciones auxiliares para generar descripciones más claras
function getActionDescription(action: string, resource: string, resourceId?: string): string {
  const descriptions: Record<string, string> = {
    'LOGIN': `El usuario ha iniciado sesión en el sistema de forma exitosa.`,
    'LOGOUT': `El usuario ha cerrado sesión correctamente.`,
    'VIEW': `Se ha consultado información del recurso "${resource}"${resourceId ? ` con identificador ${resourceId}` : ''}.`,
    'CREATE': `Se ha creado un nuevo registro en "${resource}"${resourceId ? ` con identificador ${resourceId}` : ''}.`,
    'UPDATE': `Se han modificado datos del recurso "${resource}"${resourceId ? ` (ID: ${resourceId})` : ''}.`,
    'DELETE': `Se ha eliminado un registro del recurso "${resource}"${resourceId ? ` (ID: ${resourceId})` : ''}.`,
    'EXPORT': `Se han exportado datos del recurso "${resource}".`,
    'PRINT': `Se ha impreso documentación relacionada con "${resource}".`,
    'ACCESS_DENIED': `Se ha denegado el acceso al recurso "${resource}". Posible intento de acceso no autorizado.`,
    'PASSWORD_CHANGE': `El usuario ha cambiado su contraseña de acceso.`,
    'PERMISSION_CHANGE': `Se han modificado los permisos de acceso del usuario.`,
  };
  
  return descriptions[action] || `Se ha realizado la acción "${action}" sobre el recurso "${resource}".`;
}

function getActionType(action: string): string {
  const types: Record<string, string> = {
    'LOGIN': 'Autenticación - Inicio de sesión',
    'LOGOUT': 'Autenticación - Cierre de sesión',
    'VIEW': 'Consulta de datos',
    'CREATE': 'Creación de registro',
    'UPDATE': 'Modificación de datos',
    'DELETE': 'Eliminación de registro',
    'EXPORT': 'Exportación de datos',
    'PRINT': 'Impresión de documentos',
    'ACCESS_DENIED': 'Acceso denegado - Seguridad',
    'PASSWORD_CHANGE': 'Cambio de credenciales',
    'PERMISSION_CHANGE': 'Modificación de permisos',
  };
  
  return types[action] || action;
}

function getImpactDescription(severity: string): string {
  const impacts: Record<string, string> = {
    'Critical': 'Acción crítica que puede afectar la seguridad o integridad de datos sensibles. Requiere revisión inmediata.',
    'High': 'Acción de alto impacto que modifica datos importantes o configuraciones del sistema.',
    'Medium': 'Acción de impacto moderado. Operación estándar con modificación de datos.',
    'Low': 'Acción de bajo impacto. Operación rutinaria de consulta o visualización.',
  };
  
  return impacts[severity] || 'Impacto no determinado';
}
