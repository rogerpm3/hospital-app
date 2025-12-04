"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function MedicalEvolutionDialog() {
  return (
    <Button className="flex items-center gap-2">
      <Plus className="h-4 w-4" />
      Nueva Evolución
    </Button>
  )
}
