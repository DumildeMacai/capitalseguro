"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
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

  // Lista de investimentos disponíveis (vinda do banco)
  const [availableInvestments, setAvailableInvestments] = useState<Investment[]>([])

  useEffect(() => {
    let mounted = true

    const fetchInvestments = async () => {
      try {
        const { data, error } = await supabase
          .from("investimentos")
          .select("*")
          .eq("ativo", true)
          .order("data_criacao", { ascending: false })

        if (error) throw error

        if (!mounted) return

        // Map rows to UI Investment type
        const mapped = (data || []).map((row: any) => ({
          id: row.id,
          title: row.titulo || "",
          description: row.descricao || "",
          category: row.categoria || "Outros",
          icon: <Building className="text-purple-600" />,
          returnRate: row.retorno_estimado || 0,
          minInvestment: row.valor_minimo || 0,
          remaining: row.remaining || 0,
          totalFunding: row.total_funding || 0,
          image: row.imagem || "",
          featured: false,
          risk: "Médio",
        }))

        setAvailableInvestments(mapped)
      } catch (err) {
        console.error("Erro ao buscar investimentos:", err)
      }
    }

    fetchInvestments()

    return () => {
      mounted = false
    }
  }, [])

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
