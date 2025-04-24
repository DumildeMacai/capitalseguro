
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface InvestmentFiltersProps {
  minValue: number | null;
  setMinValue: (value: number | null) => void;
  maxReturn: number | null;
  setMaxReturn: (value: number | null) => void;
  categories: string[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
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
    setMinValue(null);
    setMaxReturn(null);
    setSelectedCategory(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <Label htmlFor="category">Categoria</Label>
              <Select 
                value={selectedCategory || "all"} 
                onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as Categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="minValue">Valor Mínimo</Label>
                <span className="text-sm font-medium">
                  {minValue ? `AOA ${minValue.toLocaleString()}` : "Qualquer valor"}
                </span>
              </div>
              <Slider
                id="minValue"
                defaultValue={[0]}
                max={100000}
                step={5000}
                onValueChange={(value) => setMinValue(value[0] || null)}
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="maxReturn">Retorno Anual</Label>
                <span className="text-sm font-medium">
                  {maxReturn ? `Até ${maxReturn}%` : "Qualquer retorno"}
                </span>
              </div>
              <Slider
                id="maxReturn"
                defaultValue={[50]}
                max={100}
                step={10}
                onValueChange={(value) => setMaxReturn(value[0] || null)}
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={resetFilters} className="text-sm">
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InvestmentFilters;
