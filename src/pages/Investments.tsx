
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building,
  CarTaxiFront,
  Coins,
  PiggyBank,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import InvestmentsList from "@/components/InvestmentsList";
import InvestmentFilters from "@/components/InvestmentFilters";
import MyInvestmentsList from "@/components/MyInvestmentsList";
import { Investment, UserInvestment } from "@/types/investment";

const Investments = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("todos");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [minValue, setMinValue] = useState<number | null>(null);
  const [maxReturn, setMaxReturn] = useState<number | null>(null);

  // Lista de investimentos disponíveis (simulado)
  const [availableInvestments, setAvailableInvestments] = useState<Investment[]>([
    {
      id: "1",
      title: "Edifício Comercial Talatona",
      description: "Investimento em edifício comercial premium na zona sul da cidade. Alto potencial de valorização e renda por aluguel.",
      category: "Imóveis",
      icon: <Building className="text-purple-600" />,
      returnRate: 50,
      minInvestment: 50000,
      remaining: 2500000,
      totalFunding: 10000000,
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      featured: true,
      risk: "Médio"
    },
    {
      id: "2",
      title: "Rede de Táxi Coletivo (Candongueiros)",
      description: "Investimento em frota de táxis coletivos operando em rotas de alta demanda na cidade. Retorno baseado em lucro operacional.",
      category: "Transporte",
      icon: <CarTaxiFront className="text-blue-500" />,
      returnRate: 50,
      minInvestment: 20000,
      remaining: 800000,
      totalFunding: 1500000,
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1774&q=80",
      featured: false,
      risk: "Alto"
    },
    {
      id: "3",
      title: "Rede de Mototáxi (Kupapata)",
      description: "Financiamento coletivo para expansão de operadores de mototáxi nas zonas urbanas. ROI variável conforme demanda local.",
      category: "Transporte",
      icon: <CarTaxiFront className="text-orange-500" />,
      returnRate: 50,
      minInvestment: 10000,
      remaining: 350000,
      totalFunding: 500000,
      image: "https://images.unsplash.com/photo-1558981852-426c6c22a060?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      featured: true,
      risk: "Alto"
    },
    {
      id: "4",
      title: "Supermercado Bela Vista",
      description: "Participação em rede de supermercados em expansão nas principais cidades de Angola. Retorno com base em lucros operacionais.",
      category: "Empresas",
      icon: <Building className="text-green-600" />,
      returnRate: 50,
      minInvestment: 100000,
      remaining: 5000000,
      totalFunding: 15000000,
      image: "https://images.unsplash.com/photo-1604719312566-8912e9667d9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
      featured: false,
      risk: "Baixo"
    },
    {
      id: "5",
      title: "Condomínio Residencial Miramar",
      description: "Investimento em desenvolvimento de condomínio residencial de luxo com 50 apartamentos. Retorno por venda e aluguel.",
      category: "Imóveis",
      icon: <Building className="text-purple-600" />,
      returnRate: 50,
      minInvestment: 75000,
      remaining: 4000000,
      totalFunding: 20000000,
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1773&q=80",
      featured: true,
      risk: "Médio"
    },
    {
      id: "6",
      title: "Tech Startup Angolana",
      description: "Investimento em startup de tecnologia em fase de expansão focada em soluções para o mercado local.",
      category: "Empresas",
      icon: <Coins className="text-blue-500" />,
      returnRate: 50,
      minInvestment: 25000,
      remaining: 900000,
      totalFunding: 1200000,
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      featured: false,
      risk: "Alto"
    }
  ]);

  // Lista de investimentos do usuário (simulado)
  const [myInvestments, setMyInvestments] = useState<UserInvestment[]>([
    {
      id: "inv-001",
      investmentId: "1",
      title: "Edifício Comercial Talatona",
      category: "Imóveis",
      icon: <Building className="text-purple-600" />,
      amountInvested: 100000,
      currentValue: 115000,
      returnRate: 50,
      startDate: "2023-09-10",
      endDate: "2024-09-10",
      status: "Ativo",
      progress: 35
    },
    {
      id: "inv-002",
      investmentId: "3",
      title: "Rede de Mototáxi (Kupapata)",
      category: "Transporte",
      icon: <CarTaxiFront className="text-orange-500" />,
      amountInvested: 30000,
      currentValue: 37500,
      returnRate: 50,
      startDate: "2024-01-15",
      endDate: "2025-01-15",
      status: "Ativo",
      progress: 15
    }
  ]);

  const handleInvest = (investmentId: string) => {
    toast({
      title: "Processando investimento",
      description: "Redirecionando para a página de investimento...",
    });
  };

  // Filtrar investimentos por categoria
  const filteredInvestments = availableInvestments.filter(investment => {
    // Filtro por tab ativa (categoria)
    if (activeTab !== "todos" && investment.category.toLowerCase() !== activeTab) {
      return false;
    }
    
    // Filtro por busca
    if (searchQuery && !investment.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !investment.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filtro por categoria selecionada
    if (selectedCategory && investment.category !== selectedCategory) {
      return false;
    }
    
    // Filtro por valor mínimo
    if (minValue && investment.minInvestment < minValue) {
      return false;
    }
    
    // Filtro por retorno máximo
    if (maxReturn && investment.returnRate > maxReturn) {
      return false;
    }
    
    return true;
  });

  // Os investimentos em destaque são os marcados como "featured"
  const featuredInvestments = availableInvestments.filter(inv => inv.featured);

  // Categorias distintas para filtros
  const categories = [...new Set(availableInvestments.map(inv => inv.category))];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Oportunidades de Investimento</h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Explore as nossas diversas opções de investimento de alto retorno, cada uma oferecendo 
              50% de retorno anual garantido e respaldada por ativos reais ou negócios estabelecidos.
            </p>
          </motion.div>
          
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
              
              <Select value={selectedCategory || ""} onValueChange={(value) => setSelectedCategory(value || null)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas Categorias</SelectItem>
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
          
          <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab} className="mb-10">
            <TabsList className="mb-8">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="imóveis">Imóveis</TabsTrigger>
              <TabsTrigger value="empresas">Empresas</TabsTrigger>
              <TabsTrigger value="transporte">Transporte</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              {filteredInvestments.length > 0 ? (
                <InvestmentsList 
                  investments={filteredInvestments} 
                  onInvest={handleInvest} 
                />
              ) : (
                <div className="text-center py-10">
                  <PiggyBank className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">Nenhum investimento encontrado</h3>
                  <p className="text-muted-foreground">
                    Tente ajustar seus filtros ou pesquisar por outros termos.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          {myInvestments.length > 0 && (
            <section className="mt-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Meus Investimentos</h2>
                <p className="text-muted-foreground">Acompanhe o desempenho dos seus investimentos ativos na plataforma.</p>
              </motion.div>
              
              <MyInvestmentsList investments={myInvestments} />
            </section>
          )}
          
          <section className="mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Investimentos em Destaque</h2>
              <p className="text-muted-foreground">Oportunidades selecionadas com alto potencial de retorno.</p>
            </motion.div>
            
            <InvestmentsList 
              investments={featuredInvestments} 
              onInvest={handleInvest} 
              className="grid-cols-1 md:grid-cols-2" 
            />
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Investments;
