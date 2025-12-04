'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, Download, Send, Mail, Printer, 
  FileDown, Eye, CheckCircle, Clock, User
} from 'lucide-react';
import { DischargeChecklist } from '@/lib/types';
import { useHospital } from '@/lib/hospital-context';

interface DischargeDocumentsProps {
  discharges: DischargeChecklist[];
  onGeneratePDF: (patientId: string) => any;
  onSendDocuments: (patientId: string, documents: string[]) => void;
}

export default function DischargeDocuments({ 
  discharges, 
  onGeneratePDF, 
  onSendDocuments 
}: DischargeDocumentsProps) {
  const { patients } = useHospital();
  const [selectedDischarge, setSelectedDischarge] = useState<string>('');
  const [emailRecipients, setEmailRecipients] = useState('');

  const documentTypes = [
    { id: 'discharge-summary', name: 'Resumen de Alta', icon: FileText },
    { id: 'medication-list', name: 'Lista de Medicamentos', icon: FileText },
    { id: 'follow-up-instructions', name: 'Instrucciones de Seguimiento', icon: FileText },
    { id: 'appointment-schedule', name: 'Calendario de Citas', icon: FileText },
    { id: 'emergency-contacts', name: 'Contactos de Emergencia', icon: FileText },
    { id: 'lab-results', name: 'Resultados de Laboratorio', icon: FileText }
  ];

  const getStatusColor = (status: DischargeChecklist['status']) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Ready': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const generateAllDocuments = (discharge: DischargeChecklist) => {
    const patient = patients.find(p => p.id === discharge.patientId);
    if (!patient) return [];

    return documentTypes.map(docType => ({
      type: docType.id,
      name: docType.name,
      generated: true,
      size: '2.4 MB',
      lastModified: new Date(),
      url: `/documents/${patient.id}/${docType.id}.pdf`
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Documentación de Alta</h2>
        <Button 
          variant="outline"
          onClick={() => {
            // Generar reporte consolidado
            console.log('Generando reporte consolidado...');
            alert('Reporte consolidado generado exitosamente');
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Reporte Consolidado
        </Button>
      </div>

      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="templates">Plantillas</TabsTrigger>
          <TabsTrigger value="sent">Enviados</TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lista de pacientes con alta */}
            <Card>
              <CardHeader>
                <CardTitle>Pacientes con Proceso de Alta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {discharges
                    .filter(discharge => discharge.status !== 'Completed')
                    .map(discharge => {
                    const patient = patients.find(p => p.id === discharge.patientId);
                    if (!patient) return null;
                    
                    return (
                      <div
                        key={discharge.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedDischarge === discharge.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedDischarge(discharge.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">
                              {patient.firstName} {patient.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Habitación: {patient.roomId} • 
                              Alta: {discharge.expectedDischargeDate.toLocaleDateString()}
                            </div>
                          </div>
                          <Badge className={getStatusColor(discharge.status)}>
                            {discharge.status}
                          </Badge>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Documentación</span>
                            <span>
                              {Object.values(discharge.checklist).filter(Boolean).length}/
                              {Object.keys(discharge.checklist).length}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ 
                                width: `${(Object.values(discharge.checklist).filter(Boolean).length / Object.keys(discharge.checklist).length) * 100}%` 
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Detalles del paciente seleccionado */}
            {selectedDischarge && (
              <Card>
                <CardHeader>
                  <CardTitle>Documentos Generados</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const discharge = discharges.find(d => d.id === selectedDischarge);
                    if (!discharge) return null;
                    
                    const patient = patients.find(p => p.id === discharge.patientId);
                    const documents = generateAllDocuments(discharge);
                    
                    return (
                      <div className="space-y-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="font-medium">
                            {patient?.firstName} {patient?.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            DNI: {patient?.dni} • Habitación: {patient?.roomId}
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button 
                            className="flex-1"
                            onClick={() => onGeneratePDF(discharge.patientId)}
                          >
                            <FileDown className="h-4 w-4 mr-2" />
                            Generar PDF Completo
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => {
                              console.log('Vista previa del documento');
                              alert('Abriendo vista previa...');
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => {
                              console.log('Imprimir documento');
                              alert('Enviando a impresora...');
                            }}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Documentos Individuales</h4>
                          {documents.map(doc => (
                            <div key={doc.type} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4 text-blue-600" />
                                <div>
                                  <div className="text-sm font-medium">{doc.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {doc.size} • {doc.lastModified.toLocaleString()}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Button size="sm" variant="ghost" className="h-6 px-2">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-6 px-2">
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Envío de documentos */}
                        <div className="border-t pt-4">
                          <h4 className="font-medium mb-2">Enviar Documentos</h4>
                          <div className="space-y-2">
                            <Input
                              placeholder="Emails separados por comas (paciente, médico cabecera...)"
                              value={emailRecipients}
                              onChange={(e) => setEmailRecipients(e.target.value)}
                            />
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  if (emailRecipients) {
                                    onSendDocuments(discharge.patientId, documents.map(d => d.type));
                                    setEmailRecipients('');
                                  }
                                }}
                              >
                                <Send className="h-4 w-4 mr-2" />
                                Enviar por Email
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  console.log('Enviando por SMS...');
                                  alert('Resumen enviado por SMS al paciente');
                                }}
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                SMS Resumen
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Plantillas de Documentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documentTypes.map(docType => {
                  const IconComponent = docType.icon;
                  return (
                    <Card key={docType.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4 text-center">
                        <IconComponent className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <h3 className="font-medium">{docType.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Plantilla estándar
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          Editar Plantilla
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sent">
          <Card>
            <CardHeader>
              <CardTitle>Documentos Enviados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {discharges
                  .filter(d => d.status === 'Completed')
                  .map(discharge => {
                  const patient = patients.find(p => p.id === discharge.patientId);
                  if (!patient) return null;
                  
                  return (
                    <div key={discharge.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">
                            {patient.firstName} {patient.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Enviado: {discharge.completedDate?.toLocaleDateString()} • 
                            Por: {discharge.completedBy}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Enviado
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Historial
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {discharges.filter(d => d.status === 'Completed').length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Mail className="h-12 w-12 mx-auto mb-4" />
                    <p>No hay documentos enviados aún</p>
                    <p className="text-sm">Los documentos enviados aparecerán aquí</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
