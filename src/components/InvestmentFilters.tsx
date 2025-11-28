"use client"

import { motion } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface InvestmentFiltersProps {
  minValue: number | null
  setMinValue: (value: number | null) => void
  maxReturn: number | null
  setMaxReturn: (value: number | null) => void
  categories: string[]
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
}

const InvestmentFilters = ({
  minValue,
  setMinValue,
  maxReturn,
  setMaxReturn,
  categories,
  selectedCategory,
  setSelectedCategory,
}: InvestmentFiltersProps) => {
  const resetFilters = () => {
    setMinValue(null)
    setMaxReturn(null)
    setSelectedCategory(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      <div className="bg-white dark:bg-card rounded-xl p-6 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground">
              Categoria
            </Label>
            <Select
              value={selectedCategory || "all"}
              onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
            >
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder="Todas as Categorias" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="all">Todas Categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="minValue" className="text-foreground">
                Investimento Mín.
              </Label>
              <span className="text-sm font-medium text-primary">
                {minValue ? `Kz ${minValue.toLocaleString()}` : "Qualquer"}
              </span>
            </div>
            <Slider
              id="minValue"
              defaultValue={[0]}
              max={100000}
              step={5000}
              onValueChange={(value) => setMinValue(value[0] || null)}
              className="mt-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="maxReturn" className="text-foreground">
                Retorno Máx.
              </Label>
              <span className="text-sm font-medium text-primary">
                {maxReturn ? `Até ${maxReturn}%` : "Qualquer"}
              </span>
            </div>
            <Slider
              id="maxReturn"
              defaultValue={[50]}
              max={100}
              step={10}
              onValueChange={(value) => setMaxReturn(value[0] || null)}
              className="mt-2"
            />
          </div>

          <div className="flex items-end">
            <Button
              onClick={resetFilters}
              variant="outline"
              className="w-full"
            >
              <X size={16} className="mr-2" />
              Limpar
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default InvestmentFilters
