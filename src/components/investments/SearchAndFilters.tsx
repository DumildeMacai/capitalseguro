
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InvestmentFilters from "@/components/InvestmentFilters";

interface SearchAndFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  categories: string[];
  minValue: number | null;
  setMinValue: (value: number | null) => void;
  maxReturn: number | null;
  setMaxReturn: (value: number | null) => void;
}

const SearchAndFilters = ({
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  selectedCategory,
  setSelectedCategory,
  categories,
  minValue,
  setMinValue,
  maxReturn,
  setMaxReturn,
}: SearchAndFiltersProps) => {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-10"
            placeholder="Pesquisar investimentos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" /> 
            Filtros
          </Button>
          
          <Select value={selectedCategory || "all"} onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {showFilters && (
        <InvestmentFilters 
          minValue={minValue}
          setMinValue={setMinValue}
          maxReturn={maxReturn}
          setMaxReturn={setMaxReturn}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}
    </>
  );
};

export default SearchAndFilters;
