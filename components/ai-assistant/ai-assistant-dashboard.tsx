'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, Send, Search, TrendingUp, Clock, User, 
  Stethoscope, Activity, Calendar, AlertTriangle,
  CheckCircle, MessageSquare, Sparkles, Zap
} from 'lucide-react';
import { useHospital } from '@/lib/hospital-context';
import { useAuth } from '@/lib/auth-context';
import AIQuickActions from './ai-quick-actions';
import AIStatistics from './ai-statistics';
import AISearchPanel from './ai-search-panel';

export default function AIAssistantDashboard() {
  const { aiAssistants, patients, beds, appointments } = useHospital();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{
    id: string;
    type: 'user' | 'ai';
    message: string;
    timestamp: Date;
    category?: string;
  }>>([
    {
      id: '1',
      type: 'ai',
      message: '¡Hola! Soy MediBot, tu asistente inteligente hospitalario. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
      category: 'greeting'
    }
  ]);

  const assistant = aiAssistants[0]; // Usar el primer asistente
  const [isTyping, setIsTyping] = useState(false);

  const handleSendQuery = async () => {
    if (!query.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      message: query,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Simular respuesta del AI después de un delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(query);
      setChatHistory(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);

    setQuery('');
  };

  const generateAIResponse = (userQuery: string) => {
    const lowerQuery = userQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let response = '';
    let category = 'general';

    // Buscar paciente específico por nombre
    const searchPatient = (name: string) => {
      return patients.find(p => 
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(name.toLowerCase()) ||
        p.id.toLowerCase().includes(name.toLowerCase()) ||
        p.dni?.toLowerCase().includes(name.toLowerCase())
      );
    };

    // Extraer nombre de la consulta
    const extractName = (query: string): string | null => {
      const patterns = [
        /(?:paciente|buscar|encontrar|donde esta|informacion de|datos de)\s+([a-záéíóúñ\s]+)/i,
        /([a-záéíóúñ]+\s+[a-záéíóúñ]+(?:\s+[a-záéíóúñ]+)?)\s+(?:esta|tiene|como|donde)/i
      ];
      for (const pattern of patterns) {
        const match = query.match(pattern);
        if (match) return match[1].trim();
      }
      return null;
    };

    // === CAMAS Y OCUPACIÓN ===
    if (lowerQuery.includes('cama') || lowerQuery.includes('bed') || lowerQuery.includes('disponible') || lowerQuery.includes('ocupacion')) {
      const availableBeds = beds.filter(bed => bed.status === 'Available').length;
      const occupiedBeds = beds.filter(bed => bed.status === 'Occupied').length;
      const reservedBeds = beds.filter(bed => bed.status === 'Reserved').length;
      const maintenanceBeds = beds.filter(bed => bed.status === 'Maintenance').length;
      const totalBeds = beds.length;
      const occupancyRate = totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : 0;
      
      // Si preguntan por UCI específicamente
      if (lowerQuery.includes('uci') || lowerQuery.includes('intensivo')) {
        const uciBeds = beds.filter(bed => bed.roomId?.toLowerCase().includes('uci'));
        const uciAvailable = uciBeds.filter(bed => bed.status === 'Available').length;
        const uciOccupied = uciBeds.filter(bed => bed.status === 'Occupied').length;
        response = `🏥 **Estado UCI en tiempo real:**\n\n` +
          `• Camas UCI totales: **${uciBeds.length}**\n` +
          `• ✅ Disponibles: **${uciAvailable}**\n` +
          `• 🔴 Ocupadas: **${uciOccupied}**\n\n` +
          `${uciAvailable === 0 ? '⚠️ **ALERTA: UCI completa. Considerar derivación.**' : `Hay ${uciAvailable} cama(s) disponible(s) para ingreso urgente.`}`;
        category = 'uci-info';
      } else {
        response = `📊 **Estado actual de camas hospitalarias:**\n\n` +
          `• Total: **${totalBeds} camas**\n` +
          `• ✅ Disponibles: **${availableBeds}** (${((availableBeds/totalBeds)*100).toFixed(0)}%)\n` +
          `• 🔴 Ocupadas: **${occupiedBeds}** (${occupancyRate}%)\n` +
          `• 🟡 Reservadas: **${reservedBeds}**\n` +
          `• 🔧 Mantenimiento: **${maintenanceBeds}**\n\n` +
          `📈 Tasa de ocupación: **${occupancyRate}%**\n\n` +
          `${parseFloat(occupancyRate as string) > 85 ? '⚠️ Alta ocupación. Revisar altas pendientes.' : '✅ Ocupación dentro de parámetros normales.'}`;
        category = 'bed-info';
      }
    }
    // === BÚSQUEDA DE PACIENTE ESPECÍFICO ===
    else if (lowerQuery.includes('buscar') || lowerQuery.includes('encontrar') || lowerQuery.includes('donde esta') || lowerQuery.includes('informacion de')) {
      const nameToSearch = extractName(userQuery);
      if (nameToSearch) {
        const foundPatient = searchPatient(nameToSearch);
        if (foundPatient) {
          const patientBed = beds.find(b => b.patientId === foundPatient.id);
          response = `👤 **Paciente encontrado:**\n\n` +
            `• **Nombre:** ${foundPatient.firstName} ${foundPatient.lastName}\n` +
            `• **ID:** ${foundPatient.id}\n` +
            `• **DNI:** ${foundPatient.dni || 'No registrado'}\n` +
            `• **Estado:** ${foundPatient.currentCondition || 'Estable'}\n` +
            `• **Riesgo:** ${foundPatient.riskLevel || 'Bajo'}\n` +
            `• **Ubicación:** ${patientBed ? `Habitación ${patientBed.roomId}, Cama ${patientBed.number}` : 'Sin cama asignada'}\n` +
            `• **Alergias:** ${foundPatient.allergies?.length ? foundPatient.allergies.join(', ') : 'Ninguna registrada'}\n\n` +
            `¿Necesitas más información sobre este paciente?`;
          category = 'patient-detail';
        } else {
          response = `❌ No encontré ningún paciente con "${nameToSearch}".\n\nPuedes buscar por:\n• Nombre completo\n• ID de paciente\n• DNI\n\n¿Deseas ver la lista de pacientes activos?`;
          category = 'patient-not-found';
        }
      } else {
        response = `🔍 Para buscar un paciente, indícame:\n• Nombre (ej: "buscar Isabel Flores")\n• ID (ej: "buscar IFV_0001")\n• DNI (ej: "buscar 80111345H")`;
        category = 'search-help';
      }
    }
    // === LISTAR TODOS LOS PACIENTES ===
    else if (lowerQuery.includes('lista de paciente') || lowerQuery.includes('listar paciente') || lowerQuery.includes('todos los paciente') || lowerQuery.includes('ver paciente') || lowerQuery.includes('mostrar paciente')) {
      const patientList = patients.slice(0, 10).map((p, i) => {
        const bed = beds.find(b => b.patientId === p.id);
        const status = p.riskLevel === 'Critical' ? '🔴' : p.riskLevel === 'High' ? '🟠' : '🟢';
        return `${i+1}. ${status} **${p.firstName} ${p.lastName}**\n   └ ID: ${p.id} | DNI: ${p.dni || 'N/A'} | ${bed ? `Hab. ${bed.roomId}` : 'Ambulatorio'}`;
      }).join('\n\n');
      
      response = `📋 **Lista de pacientes (${Math.min(10, patients.length)} de ${patients.length}):**\n\n${patientList}\n\n` +
        `${patients.length > 10 ? `... y ${patients.length - 10} pacientes más.\n\n` : ''}` +
        `💡 Para ver detalles: "buscar [nombre o ID del paciente]"`;
      category = 'patient-list';
    }
    // === INFORMACIÓN DE PACIENTES ===
    else if (lowerQuery.includes('paciente') || lowerQuery.includes('patient') || lowerQuery.includes('cuantos paciente')) {
      const hospitalized = patients.filter(p => p.roomId).length;
      const critical = patients.filter(p => p.riskLevel === 'Critical' || p.currentCondition === 'Critical').length;
      const high = patients.filter(p => p.riskLevel === 'High').length;
      const medium = patients.filter(p => p.riskLevel === 'Medium').length;
      const stable = patients.filter(p => p.currentCondition === 'Stable' || p.currentCondition === 'Good').length;
      
      response = `👥 **Resumen de pacientes:**\n\n` +
        `• Total registrados: **${patients.length}**\n` +
        `• 🏥 Hospitalizados: **${hospitalized}**\n` +
        `• 🚶 Ambulatorios: **${patients.length - hospitalized}**\n\n` +
        `**Por nivel de riesgo:**\n` +
        `• 🔴 Crítico: **${critical}**\n` +
        `• 🟠 Alto: **${high}**\n` +
        `• 🟡 Medio: **${medium}**\n` +
        `• 🟢 Estable: **${stable}**\n\n` +
        `**Pacientes recientes:**\n${patients.slice(0, 5).map(p => `• ${p.firstName} ${p.lastName} (${p.id})`).join('\n')}\n\n` +
        `💡 Escribe "listar pacientes" para ver la lista completa\n` +
        `💡 Escribe "buscar [nombre]" para buscar uno específico`;
      category = 'patient-info';
    }
    // === CITAS ===
    else if (lowerQuery.includes('cita') || lowerQuery.includes('appointment') || lowerQuery.includes('agenda')) {
      const today = new Date();
      const todayAppointments = appointments.filter(apt => 
        apt.date.toDateString() === today.toDateString()
      );
      const pendingToday = todayAppointments.filter(apt => apt.status === 'Scheduled').length;
      const completedToday = todayAppointments.filter(apt => apt.status === 'Completed').length;
      
      response = `📅 **Agenda del día (${today.toLocaleDateString('es-ES')}):**\n\n` +
        `• Total citas: **${todayAppointments.length}**\n` +
        `• ⏳ Pendientes: **${pendingToday}**\n` +
        `• ✅ Completadas: **${completedToday}**\n\n` +
        `${todayAppointments.length > 0 ? 
          `**Próximas citas:**\n${todayAppointments.slice(0, 3).map(apt => {
            const patient = patients.find(p => p.id === apt.patientId);
            return `• ${apt.time} - ${patient?.firstName || 'Paciente'} ${patient?.lastName || ''} (${apt.type})`;
          }).join('\n')}` : 
          '📭 No hay citas programadas para hoy.'}\n\n` +
        `¿Necesitas programar o modificar alguna cita?`;
      category = 'appointment-info';
    }
    // === URGENCIAS Y CRÍTICOS ===
    else if (lowerQuery.includes('urgencia') || lowerQuery.includes('emergency') || lowerQuery.includes('critico') || lowerQuery.includes('alerta')) {
      const criticalPatients = patients.filter(p => 
        p.riskLevel === 'Critical' || p.currentCondition === 'Critical'
      );
      const highRiskPatients = patients.filter(p => p.riskLevel === 'High');
      
      response = `🚨 **Panel de Urgencias - Estado actual:**\n\n` +
        `**Pacientes críticos: ${criticalPatients.length}**\n` +
        `${criticalPatients.length > 0 ? 
          criticalPatients.map(p => {
            const bed = beds.find(b => b.patientId === p.id);
            return `• 🔴 ${p.firstName} ${p.lastName} - ${bed ? `Hab. ${bed.roomId}` : 'Sin ubicación'}`;
          }).join('\n') : 
          '✅ Sin pacientes críticos actualmente'}\n\n` +
        `**Pacientes alto riesgo: ${highRiskPatients.length}**\n` +
        `${highRiskPatients.slice(0, 3).map(p => `• 🟠 ${p.firstName} ${p.lastName}`).join('\n')}\n\n` +
        `¿Necesitas más detalles de algún paciente específico?`;
      category = 'emergency';
    }
    // === ESTADÍSTICAS Y REPORTES ===
    else if (lowerQuery.includes('estadistica') || lowerQuery.includes('reporte') || lowerQuery.includes('analitica') || lowerQuery.includes('resumen')) {
      const occupiedBeds = beds.filter(bed => bed.status === 'Occupied').length;
      const totalBeds = beds.length;
      const occupancyRate = totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : 0;
      const todayAppts = appointments.filter(apt => apt.date.toDateString() === new Date().toDateString()).length;
      
      response = `📈 **Dashboard Ejecutivo - ${new Date().toLocaleDateString('es-ES')}**\n\n` +
        `**🏥 Ocupación hospitalaria**\n` +
        `• Tasa: ${occupancyRate}% (${occupiedBeds}/${totalBeds} camas)\n\n` +
        `**👥 Pacientes**\n` +
        `• Activos: ${patients.length}\n` +
        `• Hospitalizados: ${patients.filter(p => p.roomId).length}\n\n` +
        `**📅 Actividad del día**\n` +
        `• Citas programadas: ${todayAppts}\n\n` +
        `**📊 Indicadores clave**\n` +
        `• ${parseFloat(occupancyRate as string) > 85 ? '⚠️ Alta ocupación' : '✅ Ocupación normal'}\n` +
        `• ${patients.filter(p => p.riskLevel === 'Critical').length > 0 ? '🔴 Hay pacientes críticos' : '✅ Sin pacientes críticos'}`;
      category = 'analytics';
    }
    // === AYUDA Y COMANDOS ===
    else if (lowerQuery.includes('ayuda') || lowerQuery.includes('help') || lowerQuery.includes('que puedes') || lowerQuery.includes('comandos')) {
      response = `🤖 **Comandos disponibles de MediBot:**\n\n` +
        `**🏥 Camas y ocupación:**\n` +
        `• "¿Cuántas camas disponibles?"\n` +
        `• "Estado de UCI"\n` +
        `• "Ocupación del hospital"\n\n` +
        `**👤 Pacientes:**\n` +
        `• "Buscar [nombre paciente]"\n` +
        `• "Pacientes críticos"\n` +
        `• "Lista de pacientes"\n\n` +
        `**📅 Citas:**\n` +
        `• "Citas de hoy"\n` +
        `• "Agenda del día"\n\n` +
        `**📊 Estadísticas:**\n` +
        `• "Resumen del día"\n` +
        `• "Estadísticas generales"\n\n` +
        `**🚨 Urgencias:**\n` +
        `• "Alertas activas"\n` +
        `• "Pacientes críticos"`;
      category = 'help';
    }
    // === SALUDOS ===
    else if (lowerQuery.includes('hola') || lowerQuery.includes('buenos') || lowerQuery.includes('buenas')) {
      const hour = new Date().getHours();
      const greeting = hour < 12 ? 'Buenos días' : hour < 20 ? 'Buenas tardes' : 'Buenas noches';
      response = `${greeting}, ${user?.firstName || 'usuario'}! 👋\n\n` +
        `Soy **MediBot**, tu asistente hospitalario inteligente.\n\n` +
        `¿En qué puedo ayudarte hoy?\n\n` +
        `💡 **Sugerencias:**\n` +
        `• Ver estado de camas\n` +
        `• Buscar un paciente\n` +
        `• Ver citas del día\n` +
        `• Resumen de urgencias`;
      category = 'greeting';
    }
    // === RESPUESTA GENERAL MEJORADA ===
    else {
      // Intenta buscar si es un nombre de paciente
      const possiblePatient = searchPatient(userQuery);
      if (possiblePatient) {
        const patientBed = beds.find(b => b.patientId === possiblePatient.id);
        response = `👤 ¿Buscas información de **${possiblePatient.firstName} ${possiblePatient.lastName}**?\n\n` +
          `• **ID:** ${possiblePatient.id}\n` +
          `• **Estado:** ${possiblePatient.currentCondition || 'Estable'}\n` +
          `• **Ubicación:** ${patientBed ? `Habitación ${patientBed.roomId}, Cama ${patientBed.number}` : 'Sin cama asignada'}\n\n` +
          `¿Necesitas más detalles?`;
        category = 'patient-quick';
      } else {
        response = `🤔 No entendí completamente tu consulta: "${userQuery}"\n\n` +
          `**Prueba con frases como:**\n` +
          `• "¿Cuántas camas disponibles?"\n` +
          `• "Buscar paciente Isabel Flores"\n` +
          `• "Citas de hoy"\n` +
          `• "Pacientes críticos"\n` +
          `• "Estadísticas del hospital"\n\n` +
          `Escribe **"ayuda"** para ver todos los comandos disponibles.`;
        category = 'not-understood';
      }
    }

    return {
      id: Date.now().toString(),
      type: 'ai' as const,
      message: response,
      timestamp: new Date(),
      category
    };
  };

  const quickSuggestions = [
    'Listar todos los pacientes',
    '¿Cuántos pacientes hay?',
    '¿Cuántas camas disponibles hay?',
    'Buscar paciente Juan García',
    'Pacientes críticos',
    'Citas de hoy',
    'Estado de UCI',
    'Resumen del hospital',
    'Ayuda'
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header con avatar del asistente */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
              assistant?.status === 'online' ? 'bg-green-500' : 
              assistant?.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'
            }`} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Asistente IA - MediBot</h1>
            <div className="text-muted-foreground flex items-center gap-2">
              <span>Tu asistente inteligente para tareas hospitalarias</span>
              <Badge variant={assistant?.status === 'online' ? 'default' : 'secondary'}>
                {assistant?.status === 'online' ? 'En Línea' : 'Ocupado'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Capabilities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2" />
            Capacidades del Asistente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {assistant?.capabilities.map((capability, index) => (
              <Badge key={index} variant="outline" className="justify-center py-2">
                {capability}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chat">Chat IA</TabsTrigger>
          <TabsTrigger value="quick-actions">Acciones Rápidas</TabsTrigger>
          <TabsTrigger value="search">Búsqueda Inteligente</TabsTrigger>
          <TabsTrigger value="statistics">Estadísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Panel */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Conversación con MediBot
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col overflow-hidden">
                  <ScrollArea className="flex-1 pr-4 h-[380px]">
                    <div className="space-y-4 pb-4">
                      {chatHistory.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.type === 'user'
                                ? 'bg-blue-500 text-white ml-4'
                                : 'bg-gray-100 text-gray-900 mr-4'
                            }`}
                          >
                            <div className="flex items-center space-x-2 mb-1">
                              {message.type === 'ai' ? (
                                <Bot className="h-4 w-4 text-gray-600" />
                              ) : (
                                <User className="h-4 w-4" />
                              )}
                              <span className={`text-xs ${message.type === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                                {message.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="whitespace-pre-line text-sm">
                              {message.message}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 rounded-lg p-3 mr-4">
                            <div className="flex items-center space-x-2">
                              <Bot className="h-4 w-4 text-gray-600" />
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '100ms'}} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '200ms'}} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Escribe tu consulta aquí..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendQuery()}
                        className="flex-1"
                      />
                      <Button onClick={handleSendQuery} disabled={!query.trim() || isTyping}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Suggestions */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sugerencias Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {quickSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => setQuery(suggestion)}
                    >
                      <Zap className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="text-sm">{suggestion}</span>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Actividad Reciente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Consulta sobre camas UCI - Completada</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <span>Análisis de ocupación - En proceso</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span>Alerta quirófano - Atendida</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="quick-actions">
          <AIQuickActions />
        </TabsContent>

        <TabsContent value="search">
          <AISearchPanel />
        </TabsContent>

        <TabsContent value="statistics">
          <AIStatistics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
