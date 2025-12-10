'use client';

import { useState, useMemo } from 'react';
import { useHospital } from '@/lib/hospital-context';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Users, FileText, Stethoscope, ClipboardList, Edit, Filter } from 'lucide-react';
import MedicalEvolutionDialog from './medical-evolution-dialog';
import { sqlNursingDocuments, NursingDocument } from '@/lib/sql-data';

// Tipo unificado para documentos clínicos
interface ClinicalDocument {
  id: string;
  patientId: string;
  patientName: string;
  professionalId: string;
  professionalName: string;
  dateTime: Date;
  documentType: string;
  source: 'nursing' | 'evolution';
  text: string;
  episodeId?: string;
}

export default function RoundsDashboard() {
  const { patients, medicalEvolutions, getFilteredPatients } = useHospital();
  const { user } = useAuth();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<ClinicalDocument | null>(null);
  const [newDocText, setNewDocText] = useState('');
  const [newDocType, setNewDocType] = useState<string>('Progress');
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [filterSource, setFilterSource] = useState<'all' | 'nursing' | 'evolution'>('all');
  
  // Permisos
  const canCreateEvolution = user?.role === 'doctor' || user?.role === 'admin';
  const canEditNursingDocs = user?.role === 'nurse' || user?.role === 'admin';
  
  // Obtener pacientes asignados al usuario
  const myPatients = getFilteredPatients();
  const myPatientIds = myPatients.map(p => p.id);
  
  // Estado para nuevos documentos de enfermería creados en sesión
  const [localNursingDocs, setLocalNursingDocs] = useState<NursingDocument[]>([]);
  
  // Combinar documentos de enfermería y evoluciones médicas en una lista unificada
  const allDocuments = useMemo((): ClinicalDocument[] => {
    const documents: ClinicalDocument[] = [];
    
    // Añadir documentos de enfermería del SQL
    const allNursingDocs = [...sqlNursingDocuments, ...localNursingDocs];
    
    for (const doc of allNursingDocs) {
      const patient = patients.find(p => p.id === doc.patientId);
      documents.push({
        id: doc.id,
        patientId: doc.patientId,
        patientName: patient ? `${patient.firstName} ${patient.lastName}` : doc.patientId,
        professionalId: doc.professionalId,
        professionalName: doc.professionalName,
        dateTime: doc.dateTime,
        documentType: doc.documentType,
        source: 'nursing',
        text: doc.text,
        episodeId: doc.episodeId
      });
    }
    
    // Añadir evoluciones médicas
    for (const evo of medicalEvolutions) {
      const patient = patients.find(p => p.id === evo.patientId);
      documents.push({
        id: evo.id,
        patientId: evo.patientId,
        patientName: patient ? `${patient.firstName} ${patient.lastName}` : evo.patientId,
        professionalId: evo.physicianId,
        professionalName: evo.physicianName,
        dateTime: evo.date,
        documentType: 'Medical Evolution',
        source: 'evolution',
        text: `${evo.subjective}\n${evo.objective}\n${evo.assessment}\n${evo.plan}`,
        episodeId: undefined
      });
    }
    
    return documents;
  }, [patients, medicalEvolutions, localNursingDocs]);
  
  // Filtrar documentos según rol y pacientes asignados
  const filteredDocuments = useMemo(() => {
    let docs = allDocuments;
    
    // Admin ve todo, el resto solo sus pacientes asignados
    if (user?.role !== 'admin') {
      docs = docs.filter(doc => myPatientIds.includes(doc.patientId));
    }
    
    // Filtrar por tipo de fuente
    if (filterSource !== 'all') {
      docs = docs.filter(doc => doc.source === filterSource);
    }
    
    // Ordenar por fecha descendente
    return docs.sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());
  }, [allDocuments, user?.role, myPatientIds, filterSource]);
  
  // Estadísticas
  const nursingDocsCount = filteredDocuments.filter(d => d.source === 'nursing').length;
  const evolutionsCount = filteredDocuments.filter(d => d.source === 'evolution').length;
  
  // Helper para obtener estilo del badge según tipo
  const getDocTypeStyle = (docType: string, source: string) => {
    if (source === 'evolution') {
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
    }
    switch (docType) {
      case 'Initial assessment':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Progress':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'High education':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Recommendation':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'Hospital Admission Note':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };
  
  // Función para crear nuevo documento de enfermería
  const handleCreateDocument = () => {
    if (!selectedPatientId || !newDocText) return;
    
    const patient = patients.find(p => p.id === selectedPatientId);
    const newDoc: NursingDocument = {
      id: `ENF${Date.now()}`,
      episodeId: `EP_${selectedPatientId}`,
      patientId: selectedPatientId,
      professionalId: user?.professionalId || user?.id || '',
      professionalName: `${user?.firstName} ${user?.lastName}`,
      dateTime: new Date(),
      documentType: newDocType as NursingDocument['documentType'],
      text: newDocText
    };
    
    setLocalNursingDocs(prev => [...prev, newDoc]);
    setNewDocText('');
    setSelectedPatientId('');
    setIsDialogOpen(false);
  };
  
  const openCreateDialog = () => {
    setEditingDoc(null);
    setNewDocText('');
    setNewDocType('Progress');
    setSelectedPatientId('');
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Documentación Clínica</h1>
          <p className="text-muted-foreground">
            Evoluciones médicas y documentos de enfermería
            {user?.role !== 'admin' && ` (${myPatients.length} pacientes asignados)`}
          </p>
        </div>
        <div className="flex gap-2">
          {canEditNursingDocs && (
            <Button onClick={openCreateDialog} variant="outline" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Nuevo Doc. Enfermería
            </Button>
          )}
          {canCreateEvolution && <MedicalEvolutionDialog />}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Mis Pacientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{myPatients.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Total Documentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{filteredDocuments.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Doc. Enfermería
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{nursingDocsCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              Evoluciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{evolutionsCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista unificada de documentos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Historial de Documentación Clínica
            </CardTitle>
            <CardDescription>
              {user?.role === 'doctor' && 'Solo lectura - Documentos de tus pacientes asignados'}
              {user?.role === 'nurse' && 'Documentos de tus pacientes asignados'}
              {user?.role === 'admin' && 'Todos los documentos del sistema'}
            </CardDescription>
          </div>
          
          {/* Filtro por tipo */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterSource} onValueChange={(v) => setFilterSource(v as typeof filterSource)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos ({filteredDocuments.length})</SelectItem>
                <SelectItem value="nursing">Enfermería ({nursingDocsCount})</SelectItem>
                <SelectItem value="evolution">Evoluciones ({evolutionsCount})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay documentos disponibles</p>
              <p className="text-sm mt-2">
                {user?.role === 'admin' 
                  ? 'No hay documentos en el sistema' 
                  : 'No tienes pacientes asignados con documentos'
                }
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Profesional</TableHead>
                    <TableHead>Origen</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="min-w-[300px]">Contenido</TableHead>
                    <TableHead>Episodio</TableHead>
                    <TableHead>Fecha/Hora</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={`${doc.source}-${doc.id}`}>
                      <TableCell className="font-mono text-sm">
                        {doc.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{doc.patientName}</p>
                          <p className="text-xs text-muted-foreground">{doc.patientId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{doc.professionalName}</p>
                          <p className="text-xs text-muted-foreground">ID: {doc.professionalId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={doc.source === 'nursing' ? 'secondary' : 'default'}>
                          {doc.source === 'nursing' ? '🩺 Enfermería' : '👨‍⚕️ Médico'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getDocTypeStyle(doc.documentType, doc.source)}>
                          {doc.documentType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm max-w-[400px] truncate" title={doc.text}>
                          {doc.text}
                        </p>
                      </TableCell>
                      <TableCell>
                        {doc.episodeId ? (
                          <Badge variant="outline">{doc.episodeId}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm whitespace-nowrap">
                        {doc.dateTime.toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para crear documento de enfermería */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nuevo Documento de Enfermería</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Paciente</Label>
              <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar paciente" />
                </SelectTrigger>
                <SelectContent>
                  {myPatients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName} ({patient.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="docType">Tipo de Documento</Label>
              <Select value={newDocType} onValueChange={setNewDocType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Progress">Progress</SelectItem>
                  <SelectItem value="Initial assessment">Initial assessment</SelectItem>
                  <SelectItem value="High education">High education</SelectItem>
                  <SelectItem value="Recommendation">Recommendation</SelectItem>
                  <SelectItem value="Hospital Admission Note">Hospital Admission Note</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="text">Contenido</Label>
              <Textarea
                id="text"
                value={newDocText}
                onChange={(e) => setNewDocText(e.target.value)}
                placeholder="Escribir el contenido del documento..."
                rows={5}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateDocument}
              disabled={!newDocText || !selectedPatientId}
            >
              Crear Documento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
