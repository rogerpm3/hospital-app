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
    const lowerQuery = userQuery.toLowerCase();
    let response = '';
    let category = 'general';

    if (lowerQuery.includes('camas') || lowerQuery.includes('bed') || lowerQuery.includes('disponible')) {
      const availableBeds = beds.filter(bed => bed.status === 'Available').length;
      const occupiedBeds = beds.filter(bed => bed.status === 'Occupied').length;
      response = `📊 Estado actual de camas:\n\n✅ **${availableBeds} camas disponibles**\n🔴 **${occupiedBeds} camas ocupadas**\n\n¿Te gustaría ver detalles de una planta específica o necesitas reservar una cama?`;
      category = 'bed-info';
    } else if (lowerQuery.includes('paciente') || lowerQuery.includes('patient')) {
      response = `👥 Tenemos **${patients.length} pacientes** activos en el sistema.\n\n¿Buscas información de un paciente específico? Puedo ayudarte con:\n• Búsqueda por nombre o ID\n• Estado clínico\n• Ubicación de habitación\n• Historial reciente`;
      category = 'patient-info';
    } else if (lowerQuery.includes('cita') || lowerQuery.includes('appointment')) {
      const todayAppointments = appointments.filter(apt => 
        apt.date.toDateString() === new Date().toDateString()
      ).length;
      response = `📅 Información de citas:\n\n**${todayAppointments} citas programadas para hoy**\n\n¿Necesitas:\n• Ver citas de un médico específico?\n• Programar una nueva cita?\n• Verificar disponibilidad?`;
      category = 'appointment-info';
    } else if (lowerQuery.includes('urgencia') || lowerQuery.includes('emergency') || lowerQuery.includes('crítico')) {
      response = `🚨 **Panel de Urgencias**\n\nAcciones rápidas disponibles:\n• Ver pacientes críticos\n• Estado UCI en tiempo real\n• Alertas activas\n• Disponibilidad quirófanos\n\n¿Qué información específica necesitas?`;
      category = 'emergency';
    } else if (lowerQuery.includes('estadística') || lowerQuery.includes('reporte') || lowerQuery.includes('analítica')) {
      response = `📈 **Estadísticas Hospitalarias**\n\nPuedo generar reportes sobre:\n• Ocupación por plantas\n• Tiempos de espera\n• Rendimiento por departamento\n• Indicadores de calidad\n\n¿Qué tipo de análisis necesitas?`;
      category = 'analytics';
    } else {
      response = `🤖 Entiendo que necesitas ayuda con: "${userQuery}"\n\nPuedo asistirte con:\n• 🏥 **Información hospitalaria** - Estado de camas, ocupación\n• 👥 **Gestión de pacientes** - Búsquedas, ubicaciones\n• 📅 **Programación** - Citas, disponibilidad\n• 📊 **Estadísticas** - Reportes y análisis\n• 🚨 **Urgencias** - Información crítica\n\n¿Podrías ser más específico?`;
      category = 'general';
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
    '¿Cuántas camas están disponibles en UCI?',
    'Mostrar pacientes críticos',
    'Estado de quirófanos',
    'Citas de hoy',
    'Generar reporte de ocupación'
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
            <p className="text-muted-foreground">
              Tu asistente inteligente para tareas hospitalarias • 
              <Badge variant={assistant?.status === 'online' ? 'default' : 'secondary'} className="ml-2">
                {assistant?.status === 'online' ? 'En Línea' : 'Ocupado'}
              </Badge>
            </p>
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
                <CardContent className="flex-1 flex flex-col">
                  <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-4">
                      {chatHistory.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.type === 'user'
                                ? 'bg-blue-500 text-white ml-4'
                                : 'bg-muted mr-4'
                            }`}
                          >
                            <div className="flex items-center space-x-2 mb-1">
                              {message.type === 'ai' ? (
                                <Bot className="h-4 w-4" />
                              ) : (
                                <User className="h-4 w-4" />
                              )}
                              <span className="text-xs opacity-70">
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
                          <div className="bg-muted rounded-lg p-3 mr-4">
                            <div className="flex items-center space-x-2">
                              <Bot className="h-4 w-4" />
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
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
