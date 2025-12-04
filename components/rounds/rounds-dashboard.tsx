'use client';

import { useHospital } from '@/lib/hospital-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Users, Route, FileText } from 'lucide-react';
import MedicalEvolutionsPanel from './medical-evolutions-panel';
import MedicalEvolutionDialog from './medical-evolution-dialog';

export default function RoundsDashboard() {
  const { patients, medicalEvolutions } = useHospital();
  
  const hospitalizedPatients = patients.filter(p => p.roomId);
  const todayEvolutions = medicalEvolutions.filter(evolution => 
    evolution.date.toDateString() === new Date().toDateString()
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rondas y Evolución Médica</h1>
          <p className="text-muted-foreground">Seguimiento clínico de pacientes</p>
        </div>
        <MedicalEvolutionDialog />
      </div>

      <MedicalEvolutionsPanel />
    </div>
  )
}
