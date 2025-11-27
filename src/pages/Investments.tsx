"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Building, CarTaxiFront, Coins } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import SearchAndFilters from "@/components/investments/SearchAndFilters"
import InvestmentsContent from "@/components/investments/InvestmentsContent"
import FeaturedInvestments from "@/components/investments/FeaturedInvestments"
import type { Investment, UserInvestment } from "@/types/investment"

const Investments = () => {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("todos")
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [minValue, setMinValue] = useState<number | null>(null)
  const [maxReturn, setMaxReturn] = useState<number | null>(null)

  // Lista de investimentos disponíveis (simulado)
  const [availableInvestments, setAvailableInvestments] = useState<Investment[]>([
    {
      id: "1",
      title: "Edifício Comercial Talatona",
      description:
        "Investimento em edifício comercial premium na zona sul da cidade. Alto potencial de valorização e renda por aluguel.",
      category: "Imóveis",
      icon: <Building className="text-purple-600" />,
      returnRate: 50,
      minInvestment: 50000,
      remaining: 2500000,
      totalFunding: 10000000,
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      featured: true,
      risk: "Médio",
    },
    {
      id: "2",
      title: "Rede de Táxi Coletivo (Candongueiros)",
      description:
        "Investimento em frota de táxis coletivos operando em rotas de alta demanda na cidade. Retorno baseado em lucro operacional.",
      category: "Transporte",
      icon: <CarTaxiFront className="text-blue-500" />,
      returnRate: 50,
      minInvestment: 20000,
      remaining: 800000,
      totalFunding: 1500000,
      image:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1774&q=80",
      featured: false,
      risk: "Alto",
    },
    {
      id: "3",
      title: "Rede de Mototáxi (Kupapata)",
      description:
        "Financiamento coletivo para expansão de operadores de mototáxi nas zonas urbanas. ROI variável conforme demanda local.",
      category: "Transporte",
      icon: <CarTaxiFront className="text-orange-500" />,
      returnRate: 50,
      minInvestment: 10000,
      remaining: 350000,
      totalFunding: 500000,
      image:
        "https://images.unsplash.com/photo-1558981852-426c6c22a060?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      featured: true,
      risk: "Alto",
    },
    {
      id: "4",
      title: "Supermercado Bela Vista",
      description:
        "Participação em rede de supermercados em expansão nas principais cidades de Angola. Retorno com base em lucros operacionais.",
      category: "Empresas",
      icon: <Building className="text-green-600" />,
      returnRate: 50,
      minInvestment: 100000,
      remaining: 5000000,
      totalFunding: 15000000,
      image:
        "https://images.unsplash.com/photo-1604719312566-8912e9667d9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
      featured: false,
      risk: "Baixo",
    },
    {
      id: "5",
      title: "Condomínio Residencial Miramar",
      description:
        "Investimento em desenvolvimento de condomínio residencial de luxo com 50 apartamentos. Retorno por venda e aluguel.",
      category: "Imóveis",
      icon: <Building className="text-purple-600" />,
      returnRate: 50,
      minInvestment: 75000,
      remaining: 4000000,
      totalFunding: 20000000,
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1773&q=80",
      featured: true,
      risk: "Médio",
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
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      featured: false,
      risk: "Alto",
    },
  ])

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
      progress: 35,
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
      progress: 15,
    },
  ])

  const handleInvest = (investmentId: string) => {
    toast({
      title: "Processando investimento",
      description: "Redirecionando para a página de investimento...",
    })
  }

  // Filtrar investimentos por categoria e outros critérios
  const filteredInvestments = availableInvestments.filter((investment) => {
    if (activeTab !== "todos" && investment.category.toLowerCase() !== activeTab) {
      return false
    }
    if (
      searchQuery &&
      !investment.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !investment.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }
    if (selectedCategory && investment.category !== selectedCategory) {
      return false
    }
    if (minValue && investment.minInvestment < minValue) {
      return false
    }
    if (maxReturn && investment.returnRate > maxReturn) {
      return false
    }
    return true
  })

  const featuredInvestments = availableInvestments.filter((inv) => inv.featured)
  const categories = [...new Set(availableInvestments.map((inv) => inv.category))]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-28 pb-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">Oportunidades de Investimento</h1>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
              Explore uma carteira diversificada de oportunidades imobiliárias e empresariais com retornos competitivos,
              respaldadas por ativos reais e gestão profissional. Comece a construir sua riqueza hoje.
            </p>
          </motion.div>

          <SearchAndFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            minValue={minValue}
            setMinValue={setMinValue}
            maxReturn={maxReturn}
            setMaxReturn={setMaxReturn}
          />

          <InvestmentsContent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            filteredInvestments={filteredInvestments}
            handleInvest={handleInvest}
            myInvestments={myInvestments}
          />

          <FeaturedInvestments investments={featuredInvestments} onInvest={handleInvest} />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Investments
