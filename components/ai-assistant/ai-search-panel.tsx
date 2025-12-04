'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, User, Bed, Calendar, FileText, Filter,
  MapPin, Clock, AlertTriangle, CheckCircle
} from 'lucide-react';
import { useHospital } from '@/lib/hospital-context';
import { useAuth } from '@/lib/auth-context';

export default function AISearchPanel() {
  const { patients, beds, rooms, appointments, hospitalFloors } = useHospital();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const results: any[] = [];

    // Búsqueda de pacientes
    if (activeFilter === 'all' || activeFilter === 'patients') {
      const patientResults = patients.filter(patient => {
        // Control de privacidad
        const canViewFullData = user?.role === 'admin' || user?.role === 'doctor' || user?.role === 'nurse';
        
        if (!canViewFullData && user?.role === 'cleaning') {
          return false; // Personal de limpieza no puede buscar pacientes
        }

        const searchableText = [
          patient.firstName,
          patient.lastName,
          patient.dni,
          patient.id.slice(-4), // Últimos 4 dígitos del ID
          patient.anonymousId || ''
        ].join(' ').toLowerCase();

        return searchableText.includes(searchTerm.toLowerCase());
      }).map(patient => ({
        type: 'patient',
        id: patient.id,
        title: user?.role === 'admin' || user?.role === 'doctor' || user?.role === 'nurse' 
          ? `${patient.firstName} ${patient.lastName}`
          : (patient.anonymousId || `Paciente ${patient.id.slice(-4)}`),
        subtitle: `DNI: ${user?.role === 'admin' || user?.role === 'doctor' || user?.role === 'nurse' ? patient.dni : 'Restringido'} • ${patient.gender}, ${new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} años`,
        description: `Habitación: ${patient.roomId || 'No asignada'} • Estado: ${patient.currentCondition}`,
        status: patient.currentCondition,
        location: patient.roomId
      }));
      results.push(...patientResults);
    }

    // Búsqueda de camas
    if (activeFilter === 'all' || activeFilter === 'beds') {
      const bedResults = beds.filter(bed => {
        const room = rooms.find(r => r.id === bed.roomId);
        const searchableText = [
          room?.number || '',
          bed.number,
          bed.status,
          bed.cleaningStatus,
          `${room?.number || ''}-${bed.number}`
        ].join(' ').toLowerCase();

        return searchableText.includes(searchTerm.toLowerCase());
      }).map(bed => {
        const room = rooms.find(r => r.id === bed.roomId);
        const patient = bed.patientId ? patients.find(p => p.id === bed.patientId) : null;
        
        return {
          type: 'bed',
          id: bed.id,
          title: `Cama ${room?.number || ''}-${bed.number}`,
          subtitle: `Estado: ${bed.status} • Limpieza: ${bed.cleaningStatus}`,
          description: patient 
            ? `Paciente: ${user?.role === 'admin' || user?.role === 'doctor' || user?.role === 'nurse' 
                ? `${patient.firstName} ${patient.lastName}` 
                : (patient.anonymousId || `Paciente ${patient.id.slice(-4)}`)}`
            : 'Cama disponible',
          status: bed.status,
          location: `Planta ${room?.floor || 'N/A'}`
        };
      });
      results.push(...bedResults);
    }

    // Búsqueda de citas
    if (activeFilter === 'all' || activeFilter === 'appointments') {
      const appointmentResults = appointments.filter(apt => {
        const searchableText = [
          apt.patientName,
          apt.physicianName,
          apt.serviceName,
          apt.location,
          apt.id
        ].join(' ').toLowerCase();

        return searchableText.includes(searchTerm.toLowerCase());
      }).map(apt => ({
        type: 'appointment',
        id: apt.id,
        title: `Cita - ${apt.serviceName}`,
        subtitle: `Paciente: ${apt.patientName} • Dr. ${apt.physicianName}`,
        description: `${apt.date.toLocaleDateString()} a las ${apt.startTime} • ${apt.location}`,
        status: apt.status,
        location: apt.location
      }));
      results.push(...appointmentResults);
    }

    setSearchResults(results);
  };

  const getStatusColor = (status: string, type: string) => {
    if (type === 'patient') {
      switch (status) {
        case 'Critical': return 'bg-red-100 text-red-800';
        case 'Serious': return 'bg-orange-100 text-orange-800';
        case 'Stable': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    } else if (type === 'bed') {
      switch (status) {
        case 'Available': return 'bg-green-100 text-green-800';
        case 'Occupied': return 'bg-red-100 text-red-800';
        case 'Cleaning Required': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    } else if (type === 'appointment') {
      switch (status) {
        case 'Scheduled': return 'bg-blue-100 text-blue-800';
        case 'Confirmed': return 'bg-green-100 text-green-800';
        case 'Cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    }
    return 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'patient': return <User className="h-4 w-4" />;
      case 'bed': return <Bed className="h-4 w-4" />;
      case 'appointment': return <Calendar className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const searchFilters = [
    { id: 'all', label: 'Todo', icon: Search },
    { id: 'patients', label: 'Pacientes', icon: User },
    { id: 'beds', label: 'Camas', icon: Bed },
    { id: 'appointments', label: 'Citas', icon: Calendar }
  ];

  return (
    <div className="space-y-6">
      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Búsqueda Inteligente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="flex space-x-2">
            <Input
              placeholder="Buscar pacientes, camas, citas... (ej: Juan, 301-2, cardiología)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {searchFilters.map((filter) => {
              const IconComponent = filter.icon;
              return (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter(filter.id)}
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {filter.label}
                </Button>
              );
            })}
          </div>

          {/* Quick Search Examples */}
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">Ejemplos de búsqueda:</p>
            <div className="flex flex-wrap gap-2">
              {['Juan García', 'Cama 301-1', 'UCI disponible', 'Citas cardiología'].map((example) => (
                <Button
                  key={example}
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1 text-xs text-blue-600 hover:text-blue-800"
                  onClick={() => setSearchTerm(example)}
                >
                  "{example}"
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Resultados de Búsqueda 
              <Badge variant="outline" className="ml-2">
                {searchResults.length} encontrados
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {searchResults.map((result, index) => (
                <div
                  key={`${result.type}-${result.id}-${index}`}
                  className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-muted cursor-pointer"
                >
                  <div className="flex-shrink-0">
                    {getTypeIcon(result.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium truncate">{result.title}</h4>
                      <Badge className={getStatusColor(result.status, result.type)}>
                        {result.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{result.subtitle}</p>
                    <p className="text-xs text-muted-foreground">{result.description}</p>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {result.location}
                    </div>
                    <Button size="sm" variant="outline" className="mt-2">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search History & Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Búsquedas Frecuentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              'Camas disponibles UCI',
              'Pacientes críticos',
              'Citas de hoy',
              'Habitaciones libres planta 3'
            ].map((search, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => setSearchTerm(search)}
              >
                <Clock className="h-4 w-4 mr-2" />
                {search}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros Avanzados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Filter className="h-4 w-4 mr-2" />
              Por especialidad médica
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <MapPin className="h-4 w-4 mr-2" />
              Por planta hospitalaria
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Solo casos urgentes
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <CheckCircle className="h-4 w-4 mr-2" />
              Estados específicos
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
