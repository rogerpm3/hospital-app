"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useHospital } from "@/lib/hospital-context"
import { useAuth } from "@/lib/auth-context"
import {
  MessageSquare,
  Plus,
  Send,
  Search,
  Filter,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  CheckCheck,
  User,
  Stethoscope,
  Shield,
  Mail,
  MailOpen
} from "lucide-react"

export default function MessagingPanel() {
  const { getFilteredChatMessages, addChatMessage, markMessageAsRead, markAllMessagesAsRead } = useHospital()
  const { user } = useAuth()
  const { toast } = useToast()
  
  // Obtener mensajes filtrados por el rol del usuario
  const chatMessages = getFilteredChatMessages()
  
  const [activeTab, setActiveTab] = useState("all")
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  
  const [messageData, setMessageData] = useState({
    recipient: "",
    recipientRole: "",
    subject: "",
    message: "",
    priority: "normal",
    category: "general"
  })

  // Roles disponibles para enviar mensajes
  const availableRoles = [
    { value: "admin", label: "Administración", icon: <Shield className="w-4 h-4" /> },
    { value: "doctor", label: "Médicos", icon: <Stethoscope className="w-4 h-4" /> },
    { value: "nurse", label: "Enfermería", icon: <User className="w-4 h-4" /> },
    { value: "auxiliary", label: "Auxiliares", icon: <Users className="w-4 h-4" /> },
    { value: "cleaning", label: "Limpieza", icon: <Users className="w-4 h-4" /> },
    { value: "radiology", label: "Radiología", icon: <Users className="w-4 h-4" /> },
    { value: "admission", label: "Admisiones", icon: <Users className="w-4 h-4" /> }
  ]

  const priorities = [
    { value: "low", label: "Baja", color: "bg-green-100 text-green-800" },
    { value: "normal", label: "Normal", color: "bg-blue-100 text-blue-800" },
    { value: "high", label: "Alta", color: "bg-orange-100 text-orange-800" },
    { value: "urgent", label: "Urgente", color: "bg-red-100 text-red-800" }
  ]

  const categories = [
    "General", "Urgente", "Consulta", "Coordinación", "Información", 
    "Paciente", "Procedimiento", "Medicación", "Resultados", "Administrativa"
  ]

  // Filtrar mensajes
  const filteredMessages = chatMessages.filter(message => {
    const matchesSearch = 
      message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (message.subject && message.subject.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesRole = filterRole === "all" || message.senderRole === filterRole
    
    return matchesSearch && matchesRole
  })

  // Agrupar mensajes por estado
  const unreadMessages = filteredMessages.filter(msg => !msg.isRead)
  const sentMessages = filteredMessages.filter(msg => msg.senderId === user?.id)
  const receivedMessages = filteredMessages.filter(msg => msg.senderId !== user?.id)

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!messageData.message.trim()) {
      toast({
        title: "Error de validación",
        description: "El mensaje no puede estar vacío",
        variant: "destructive",
      })
      return
    }

    // Determinar el tipo de mensaje según el destinatario
    const messageType: 'direct' | 'channel' | 'broadcast' | 'emergency' = 
      !messageData.recipientRole || messageData.recipientRole === 'all' 
        ? 'broadcast' 
        : messageData.priority === 'urgent' 
          ? 'emergency' 
          : 'direct';

    const newMessage = {
      senderId: user?.id || "current-user",
      senderName: user?.firstName + " " + user?.lastName || "Usuario",
      senderRole: user?.role || "doctor",
      recipientId: messageData.recipient || "broadcast",
      recipientRole: messageData.recipientRole as any || "all",
      message: messageData.message,
      subject: messageData.subject,
      timestamp: new Date(),
      type: messageType,
      isRead: false,
      priority: messageData.priority,
      category: messageData.category
    }

    addChatMessage(newMessage)

    toast({
      title: "Mensaje enviado",
      description: `Mensaje enviado correctamente${messageData.recipientRole ? ` a ${availableRoles.find(r => r.value === messageData.recipientRole)?.label}` : ""}`,
    })

    // Reset form
    setMessageData({
      recipient: "",
      recipientRole: "",
      subject: "",
      message: "",
      priority: "normal",
      category: "general"
    })
    setShowNewMessageDialog(false)
  }

  const getPriorityColor = (priority: string) => {
    const priorityObj = priorities.find(p => p.value === priority)
    return priorityObj?.color || "bg-gray-100 text-gray-800"
  }

  const getRoleIcon = (role: string) => {
    const roleObj = availableRoles.find(r => r.value === role)
    return roleObj?.icon || <User className="w-4 h-4" />
  }

  const handleMarkAsRead = (messageId: string) => {
    markMessageAsRead(messageId)
    toast({
      title: "Mensaje marcado como leído",
      description: "El mensaje ha sido marcado como leído.",
    })
  }

  const handleMarkAllAsRead = () => {
    markAllMessagesAsRead()
    toast({
      title: "Todos los mensajes marcados como leídos",
      description: "Todos tus mensajes han sido marcados como leídos.",
    })
  }

  const MessageCard = ({ message }: { message: any }) => (
    <Card className={`mb-4 hover:shadow-md transition-shadow ${!message.isRead ? 'border-l-4 border-l-blue-500' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {getRoleIcon(message.senderRole)}
              <h3 className="font-semibold text-gray-900">{message.senderName}</h3>
              <Badge variant="outline" className="text-xs">
                {availableRoles.find(r => r.value === message.senderRole)?.label || message.senderRole}
              </Badge>
              {message.recipientRole && message.recipientRole !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Para: {availableRoles.find(r => r.value === message.recipientRole)?.label || message.recipientRole}
                </Badge>
              )}
              {message.priority && (
                <Badge className={getPriorityColor(message.priority)}>
                  {priorities.find(p => p.value === message.priority)?.label}
                </Badge>
              )}
              {!message.isRead && (
                <Badge className="bg-blue-100 text-blue-800">
                  Nuevo
                </Badge>
              )}
            </div>
            
            {message.subject && (
              <h4 className="font-medium text-lg mb-2 text-gray-800">{message.subject}</h4>
            )}
            
            <p className="text-sm text-gray-600 mb-3">{message.message}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {message.timestamp.toLocaleString()}
                </div>
                {message.category && (
                  <div>
                    Categoría: {message.category}
                  </div>
                )}
              </div>
              
              {/* Botón para marcar como leído */}
              {!message.isRead && message.senderId !== user?.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => handleMarkAsRead(message.id)}
                >
                  <MailOpen className="w-4 h-4 mr-1" />
                  Marcar como leído
                </Button>
              )}
              {message.isRead && message.senderId !== user?.id && (
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCheck className="w-4 h-4" />
                  Leído
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Mensajes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{filteredMessages.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">No Leídos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{unreadMessages.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Enviados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{sentMessages.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recibidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{receivedMessages.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Header y controles */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <MessageSquare className="w-5 h-5" />
              Sistema de Mensajería
            </CardTitle>
            <div className="flex items-center gap-2">
              {unreadMessages.length > 0 && (
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleMarkAllAsRead}
                >
                  <CheckCheck className="w-4 h-4" />
                  Marcar todos como leídos
                </Button>
              )}
              <Dialog open={showNewMessageDialog} onOpenChange={setShowNewMessageDialog}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Nuevo Mensaje
                  </Button>
                </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Enviar Nuevo Mensaje</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSendMessage} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="recipientRole">Destinatario *</Label>
                      <Select 
                        value={messageData.recipientRole} 
                        onValueChange={(value) => setMessageData({...messageData, recipientRole: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar destinatario" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los roles</SelectItem>
                          {availableRoles.map(role => (
                            <SelectItem key={role.value} value={role.value}>
                              <div className="flex items-center gap-2">
                                {role.icon}
                                {role.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="priority">Prioridad</Label>
                      <Select 
                        value={messageData.priority} 
                        onValueChange={(value) => setMessageData({...messageData, priority: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {priorities.map(priority => (
                            <SelectItem key={priority.value} value={priority.value}>
                              {priority.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Categoría</Label>
                      <Select 
                        value={messageData.category} 
                        onValueChange={(value) => setMessageData({...messageData, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category.toLowerCase()}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="subject">Asunto</Label>
                      <Input
                        id="subject"
                        value={messageData.subject}
                        onChange={(e) => setMessageData({...messageData, subject: e.target.value})}
                        placeholder="Asunto del mensaje (opcional)"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Mensaje *</Label>
                    <Textarea
                      id="message"
                      value={messageData.message}
                      onChange={(e) => setMessageData({...messageData, message: e.target.value})}
                      placeholder="Escribir mensaje..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => setShowNewMessageDialog(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Mensaje
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Buscar mensajes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                {availableRoles.map(role => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de mensajes */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            Todos ({filteredMessages.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            No Leídos ({unreadMessages.length})
          </TabsTrigger>
          <TabsTrigger value="sent">
            Enviados ({sentMessages.length})
          </TabsTrigger>
          <TabsTrigger value="received">
            Recibidos ({receivedMessages.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {filteredMessages.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-muted-foreground">No hay mensajes</p>
              </CardContent>
            </Card>
          ) : (
            filteredMessages
              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
              .map(message => (
                <MessageCard key={message.id} message={message} />
              ))
          )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-4 mt-6">
          {unreadMessages.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-300" />
                <p className="text-muted-foreground">No hay mensajes sin leer</p>
              </CardContent>
            </Card>
          ) : (
            unreadMessages
              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
              .map(message => (
                <MessageCard key={message.id} message={message} />
              ))
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4 mt-6">
          {sentMessages.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Send className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-muted-foreground">No has enviado mensajes</p>
              </CardContent>
            </Card>
          ) : (
            sentMessages
              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
              .map(message => (
                <MessageCard key={message.id} message={message} />
              ))
          )}
        </TabsContent>

        <TabsContent value="received" className="space-y-4 mt-6">
          {receivedMessages.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-muted-foreground">No has recibido mensajes</p>
              </CardContent>
            </Card>
          ) : (
            receivedMessages
              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
              .map(message => (
                <MessageCard key={message.id} message={message} />
              ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
