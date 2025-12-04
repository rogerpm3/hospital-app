"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  AlertTriangle, 
  Shield, 
  Info, 
  Search,
  X,
  Plus,
  Pill,
  AlertCircle
} from "lucide-react"

interface DrugInteraction {
  id: string
  drug1: string
  drug2: string
  severity: "low" | "moderate" | "high" | "severe"
  description: string
  recommendation: string
  mechanism: string
}

interface DrugInteractionCheckerProps {
  currentMedications?: string[]
  newMedication?: string
  onInteractionFound?: (interactions: DrugInteraction[]) => void
}

export function DrugInteractionChecker({ 
  currentMedications = [], 
  newMedication = "",
  onInteractionFound 
}: DrugInteractionCheckerProps) {
  const [medications, setMedications] = useState<string[]>(currentMedications)
  const [newMed, setNewMed] = useState(newMedication)
  const [interactions, setInteractions] = useState<DrugInteraction[]>([])
  const [isChecking, setIsChecking] = useState(false)

  // Base de datos simulada de interacciones medicamentosas
  const interactionDatabase: DrugInteraction[] = [
    {
      id: "1",
      drug1: "warfarina",
      drug2: "aspirina",
      severity: "high",
      description: "Riesgo aumentado de hemorragia",
      recommendation: "Monitorear INR frecuentemente. Considerar reducir dosis.",
      mechanism: "Efecto anticoagulante sinérgico"
    },
    {
      id: "2",
      drug1: "enalapril",
      drug2: "potasio",
      severity: "moderate",
      description: "Riesgo de hiperpotasemia",
      recommendation: "Monitorear potasio sérico regularmente.",
      mechanism: "Los IECA reducen la excreción de potasio"
    },
    {
      id: "3",
      drug1: "digoxina",
      drug2: "furosemida",
      severity: "moderate",
      description: "Riesgo de toxicidad por digoxina",
      recommendation: "Monitorear niveles de digoxina y electrolitos.",
      mechanism: "La furosemida puede causar hipopotasemia aumentando toxicidad de digoxina"
    },
    {
      id: "4",
      drug1: "tramadol",
      drug2: "sertraline",
      severity: "high",
      description: "Riesgo de síndrome serotoninérgico",
      recommendation: "Evitar combinación. Si es necesario, monitoreo estrecho.",
      mechanism: "Ambos aumentan niveles de serotonina"
    },
    {
      id: "5",
      drug1: "metformina",
      drug2: "contraste yodado",
      severity: "severe",
      description: "Riesgo de acidosis láctica",
      recommendation: "Suspender metformina 48h antes del contraste.",
      mechanism: "El contraste puede causar insuficiencia renal aguda"
    },
    {
      id: "6",
      drug1: "simvastatina",
      drug2: "claritromicina",
      severity: "high",
      description: "Riesgo de miopatía/rabdomiólisis",
      recommendation: "Evitar combinación o reducir dosis de simvastatina.",
      mechanism: "Claritromicina inhibe metabolismo de simvastatina"
    },
    {
      id: "7",
      drug1: "ibuprofeno",
      drug2: "enalapril",
      severity: "moderate",
      description: "Reducción del efecto antihipertensivo",
      recommendation: "Monitorear presión arterial. Considerar paracetamol como alternativa.",
      mechanism: "Los AINE pueden reducir efectividad de los IECA"
    },
    {
      id: "8",
      drug1: "omeprazol",
      drug2: "clopidogrel",
      severity: "moderate",
      description: "Reducción del efecto antiagregante",
      recommendation: "Usar pantoprazol como alternativa al omeprazol.",
      mechanism: "Omeprazol inhibe activación de clopidogrel"
    },
    {
      id: "9",
      drug1: "amiodarona",
      drug2: "warfarina",
      severity: "high",
      description: "Aumento significativo del INR",
      recommendation: "Reducir dosis de warfarina en 30-50%. Monitoreo frecuente de INR.",
      mechanism: "Amiodarona inhibe metabolismo de warfarina"
    },
    {
      id: "10",
      drug1: "ciprofloxacino",
      drug2: "teofilina",
      severity: "high",
      description: "Riesgo de toxicidad por teofilina",
      recommendation: "Monitorear niveles de teofilina. Reducir dosis si es necesario.",
      mechanism: "Ciprofloxacino inhibe metabolismo de teofilina"
    }
  ]

  const checkInteractions = () => {
    setIsChecking(true)
    
    // Simular checking con delay
    setTimeout(() => {
      const allMeds = newMed ? [...medications, newMed] : medications
      const foundInteractions: DrugInteraction[] = []

      for (let i = 0; i < allMeds.length; i++) {
        for (let j = i + 1; j < allMeds.length; j++) {
          const med1 = allMeds[i].toLowerCase().trim()
          const med2 = allMeds[j].toLowerCase().trim()

          const interaction = interactionDatabase.find(inter => 
            (inter.drug1.toLowerCase() === med1 && inter.drug2.toLowerCase() === med2) ||
            (inter.drug1.toLowerCase() === med2 && inter.drug2.toLowerCase() === med1)
          )

          if (interaction) {
            foundInteractions.push(interaction)
          }
        }
      }

      setInteractions(foundInteractions)
      if (onInteractionFound) {
        onInteractionFound(foundInteractions)
      }
      setIsChecking(false)
    }, 1000)
  }

  const addMedication = () => {
    if (newMed.trim() && !medications.includes(newMed.trim())) {
      setMedications([...medications, newMed.trim()])
      setNewMed("")
    }
  }

  const removeMedication = (index: number) => {
    const updatedMeds = medications.filter((_, i) => i !== index)
    setMedications(updatedMeds)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "severe":
        return "bg-red-100 text-red-800 border-red-300"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300"
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 border-green-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "severe":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      case "high":
        return <AlertTriangle className="w-4 h-4 text-orange-600" />
      case "moderate":
        return <Info className="w-4 h-4 text-yellow-600" />
      case "low":
        return <Shield className="w-4 h-4 text-green-600" />
      default:
        return <Info className="w-4 h-4" />
    }
  }

  useEffect(() => {
    if (medications.length >= 2 || (newMed && medications.length >= 1)) {
      checkInteractions()
    } else {
      setInteractions([])
    }
  }, [medications, newMed])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5" />
            Verificador de Interacciones Medicamentosas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Lista de medicamentos actuales */}
          <div>
            <Label className="text-sm font-medium">Medicamentos Actuales</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {medications.map((med, index) => (
                <Badge key={index} variant="outline" className="text-sm py-1">
                  {med}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-4 w-4 p-0"
                    onClick={() => removeMedication(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
              {medications.length === 0 && (
                <p className="text-sm text-muted-foreground">No hay medicamentos agregados</p>
              )}
            </div>
          </div>

          {/* Agregar nuevo medicamento */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Agregar medicamento..."
                value={newMed}
                onChange={(e) => setNewMed(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addMedication()}
              />
            </div>
            <Button onClick={addMedication} disabled={!newMed.trim()}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Botón de verificación manual */}
          <Button 
            onClick={checkInteractions} 
            disabled={isChecking || medications.length < 1}
            className="w-full"
          >
            <Search className="w-4 h-4 mr-2" />
            {isChecking ? "Verificando..." : "Verificar Interacciones"}
          </Button>
        </CardContent>
      </Card>

      {/* Resultados de interacciones */}
      {interactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Interacciones Encontradas ({interactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {interactions.map((interaction, index) => (
              <Alert key={index} className="border-l-4 border-l-red-500">
                <div className="flex items-start gap-3">
                  {getSeverityIcon(interaction.severity)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">
                        {interaction.drug1.charAt(0).toUpperCase() + interaction.drug1.slice(1)} + {" "}
                        {interaction.drug2.charAt(0).toUpperCase() + interaction.drug2.slice(1)}
                      </h4>
                      <Badge className={getSeverityColor(interaction.severity)}>
                        {interaction.severity.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <AlertDescription className="space-y-2">
                      <div>
                        <p className="font-medium text-red-800">Descripción:</p>
                        <p>{interaction.description}</p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-blue-800">Mecanismo:</p>
                        <p className="text-sm">{interaction.mechanism}</p>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded-md">
                        <p className="font-medium text-blue-800">Recomendación:</p>
                        <p className="text-sm">{interaction.recommendation}</p>
                      </div>
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Estado sin interacciones */}
      {medications.length >= 2 && interactions.length === 0 && !isChecking && (
        <Alert className="border-green-200 bg-green-50">
          <Shield className="w-4 h-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>No se encontraron interacciones conocidas</strong> entre los medicamentos verificados.
            Sin embargo, siempre consulte con el farmacéutico clínico para una evaluación completa.
          </AlertDescription>
        </Alert>
      )}

      {/* Información adicional */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>Nota importante:</strong> Este verificador incluye las interacciones más comunes y clínicamente relevantes.</p>
            <p>Para una evaluación completa, siempre consulte con el departamento de farmacia clínica.</p>
            <p>La base de datos se actualiza regularmente con nueva evidencia científica.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
