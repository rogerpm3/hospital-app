'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { DischargeChecklist as DischargeChecklistType } from '@/lib/types';

interface DischargeChecklistProps {
  checklist: DischargeChecklistType;
  onUpdateItem: (itemKey: string, checked: boolean) => void;
}

export default function DischargeChecklist({ checklist, onUpdateItem }: DischargeChecklistProps) {
  const checklistItems = [
    { key: 'medicalClearance', label: 'Autorización médica', icon: CheckCircle },
    { key: 'medicationReconciliation', label: 'Reconciliación de medicamentos', icon: CheckCircle },
    { key: 'dischargeInstructions', label: 'Instrucciones de alta', icon: CheckCircle },
    { key: 'followUpAppointments', label: 'Citas de seguimiento programadas', icon: CheckCircle },
    { key: 'equipmentOrdered', label: 'Equipamiento médico ordenado', icon: CheckCircle },
    { key: 'transportationArranged', label: 'Transporte organizado', icon: CheckCircle },
    { key: 'socialWorkConsult', label: 'Consulta trabajo social', icon: CheckCircle },
    { key: 'finalBilling', label: 'Facturación completada', icon: CheckCircle },
    { key: 'roomCleaning', label: 'Limpieza de habitación', icon: CheckCircle }
  ];

  const completedItems = Object.values(checklist.checklist).filter(Boolean).length;
  const totalItems = Object.keys(checklist.checklist).length;
  const progress = Math.round((completedItems / totalItems) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Checklist de Alta</span>
          <Badge variant={progress === 100 ? 'default' : 'secondary'}>
            {completedItems}/{totalItems} completado
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progreso</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${progress === 100 ? 'bg-green-600' : 'bg-blue-600'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {checklistItems.map(item => {
            const isCompleted = checklist.checklist[item.key as keyof typeof checklist.checklist];
            return (
              <div key={item.key} className="flex items-center space-x-3">
                <Checkbox
                  id={item.key}
                  checked={isCompleted}
                  onCheckedChange={(checked) => onUpdateItem(item.key, !!checked)}
                />
                <label
                  htmlFor={item.key}
                  className={`flex-1 text-sm ${isCompleted ? 'line-through text-muted-foreground' : ''}`}
                >
                  {item.label}
                </label>
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Clock className="h-4 w-4 text-gray-400" />
                )}
              </div>
            );
          })}
        </div>

        {progress === 100 && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">¡Paciente listo para el alta!</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
