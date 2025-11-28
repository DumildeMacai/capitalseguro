"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  TrendingUp,
  Shield,
  DollarSign,
  Users,
  Calendar,
  CheckCircle,
  MapPin,
  Clock,
  AlertCircle,
  Phone,
  Mail,
  Award,
  Zap,
  FileText,
  BarChart3,
  Lock,
  Percent,
  CreditCard,
  Download,
  Share2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import type { Investment } from "@/types/investment"
import { Building, CarTaxiFront, Coins } from "lucide-react"

const InvestmentDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [investment, setInvestment] = useState<Investment | null>(null)
  const [loading, setLoading] = useState(true)
  const [investmentAmount, setInvestmentAmount] = useState<number>(0)
  const [activeTab, setActiveTab] = useState("visao-geral")

  const availableInvestments: Investment[] = [
    {
      id: "1",
      title: "Edifício Comercial Talatona",
      description:
        "Investimento em edifício comercial premium na zona sul da cidade. Alto potencial de valorização e renda por aluguel.",
      category: "Imóveis",
      icon: <Building className="text-purple-600" />,
      returnRate: 100,
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
      description: "Investimento em frota de táxis coletivos operando em rotas de alta demanda.",
      category: "Transporte",
      icon: <CarTaxiFront className="text-blue-500" />,
      returnRate: 100,
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
      description: "Financiamento coletivo para expansão de operadores de mototáxi nas zonas urbanas.",
      category: "Transporte",
      icon: <CarTaxiFront className="text-orange-500" />,
      returnRate: 100,
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
      description: "Participação em rede de supermercados em expansão nas principais cidades.",
      category: "Empresas",
      icon: <Building className="text-green-600" />,
      returnRate: 100,
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
      description: "Investimento em desenvolvimento de condomínio residencial de luxo com 50 apartamentos.",
      category: "Imóveis",
      icon: <Building className="text-purple-600" />,
      returnRate: 100,
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
      description: "Investimento em startup de tecnologia em fase de expansão focada no mercado local.",
      category: "Empresas",
      icon: <Coins className="text-blue-500" />,
      returnRate: 100,
      minInvestment: 25000,
      remaining: 900000,
      totalFunding: 1200000,
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      featured: false,
      risk: "Alto",
    },
  ]

  useEffect(() => {
    const found = availableInvestments.find((inv) => inv.id === id)
    if (found) {
      setInvestment(found)
      setInvestmentAmount(found.minInvestment)
    }
    setLoading(false)
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando detalhes do investimento...</p>
        </div>
      </div>
    )
  }

  if (!investment) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">Investimento não encontrado</h1>
            <p className="text-muted-foreground mb-6">O investimento que você procura não existe.</p>
            <Button onClick={() => navigate("/investments")}>Voltar aos Investimentos</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const progress = ((investment.totalFunding - investment.remaining) / investment.totalFunding) * 100
  const estimatedReturn = (investmentAmount * (investment.returnRate / 100)).toFixed(0)
  const numInvestors = Math.floor(Math.random() * 500) + 100
  const daysRemaining = Math.floor(Math.random() * 90) + 30

  const handleInvest = () => {
    if (investmentAmount < investment.minInvestment) {
      toast({
        title: "Valor inválido",
        description: `O investimento mínimo é AOA ${investment.minInvestment.toLocaleString("pt-PT")}`,
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Investimento processado",
      description: `Você investiu AOA ${investmentAmount.toLocaleString("pt-PT")} em ${investment.title}`,
    })

    setTimeout(() => {
      navigate("/investidor")
    }, 1500)
  }

  const features = [
    {
      icon: TrendingUp,
      title: "Retorno Garantido",
      description: `${investment.returnRate}% de retorno anual garantido`,
    },
    {
      icon: Shield,
      title: "Ativos Reais",
      description: "Respaldado por imóveis e negócios concretos",
    },
    {
      icon: Users,
      title: "Investimento Coletivo",
      description: "Diversifique seu portfólio com outros investidores",
    },
    {
      icon: Calendar,
      title: "Liquidez Periódica",
      description: "Resgate anual com opção de reinvestimento",
    },
  ]

  const timeline = [
    { phase: "Fase 1", date: "Jan - Mar 2024", description: "Aprovação e Documentação" },
    { phase: "Fase 2", date: "Abr - Jun 2024", description: "Captação de Recursos" },
    { phase: "Fase 3", date: "Jul - Set 2024", description: "Implementação do Projeto" },
    { phase: "Fase 4", date: "Out - Dez 2024", description: "Operação e Retornos" },
  ]

  const riskFactors = [
    { factor: "Mercado", level: "Médio", description: "Variações na demanda do mercado" },
    { factor: "Operacional", level: "Baixo", description: "Equipe experiente com track record comprovado" },
    { factor: "Regulatório", level: "Médio", description: "Conformidade com legislação vigente" },
    { factor: "Financeiro", level: "Baixo", description: "Estrutura de capital estável" },
  ]

  const similarInvestments = availableInvestments.filter((inv) => inv.id !== id && inv.category === investment.category)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <motion.button
            onClick={() => navigate("/investments")}
            className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
            whileHover={{ x: -4 }}
          >
            <ArrowLeft size={20} />
            <span>Voltar aos investimentos</span>
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="relative h-[500px] rounded-2xl overflow-hidden mb-8 shadow-2xl group">
                  <img
                    src={investment.image || "/placeholder.svg"}
                    alt={investment.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                  <div className="absolute top-6 right-6 flex gap-2">
                    <Button size="sm" variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                      <Share2 size={16} className="mr-1" />
                      Compartilhar
                    </Button>
                    <Button size="sm" variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                      <Download size={16} className="mr-1" />
                      PDF
                    </Button>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-12">
                    <div className="flex items-end justify-between">
                      <div className="flex-1">
                        <div className="flex gap-3 mb-4 flex-wrap">
                          <Badge className="bg-white/95 text-foreground font-semibold flex items-center gap-2 text-sm py-2 px-4">
                            {investment.icon}
                            {investment.category}
                          </Badge>
                          <Badge
                            variant={
                              investment.risk === "Baixo"
                                ? "success"
                                : investment.risk === "Médio"
                                  ? "warning"
                                  : "destructive"
                            }
                            className="text-sm py-2 px-4 font-semibold"
                          >
                            Risco {investment.risk}
                          </Badge>
                          <Badge className="bg-cyan-500/90 text-white text-sm py-2 px-4 font-semibold">
                            {numInvestors} investidores
                          </Badge>
                        </div>
                        <h1 className="text-white text-5xl font-bold leading-tight max-w-3xl">{investment.title}</h1>
                        <p className="text-gray-100 text-lg mt-4 max-w-2xl">
                          Oportunidade premium com retorno garantido
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <Card className="bg-gradient-to-br from-purple-500/15 to-purple-600/10 border-purple-200/40 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Percent className="text-purple-600 mx-auto mb-2" size={24} />
                      <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold">Retorno Anual</p>
                      <p className="text-3xl font-bold text-purple-600">{investment.returnRate}%</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500/15 to-blue-600/10 border-blue-200/40 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <DollarSign className="text-blue-600 mx-auto mb-2" size={24} />
                      <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold">Mínimo</p>
                      <p className="text-2xl font-bold text-blue-600">
                        AOA {(investment.minInvestment / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500/15 to-green-600/10 border-green-200/40 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <BarChart3 className="text-green-600 mx-auto mb-2" size={24} />
                      <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold">Financiado</p>
                      <p className="text-3xl font-bold text-green-600">{progress.toFixed(0)}%</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500/15 to-orange-600/10 border-orange-200/40 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Clock className="text-orange-600 mx-auto mb-2" size={24} />
                      <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold">Prazo</p>
                      <p className="text-2xl font-bold text-orange-600">{daysRemaining}d</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-muted/50 border border-border/50">
                    <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
                    <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
                    <TabsTrigger value="riscos">Riscos</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  </TabsList>

                  <TabsContent value="visao-geral" className="space-y-6">
                    <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/0">
                        <CardTitle className="text-2xl">Sobre este investimento</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6 pt-6">
                        <p className="text-lg text-muted-foreground leading-relaxed">{investment.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {features.map((feature, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex gap-4 p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/20 border border-border/50 hover:border-primary/30 transition-colors"
                            >
                              <div className="flex-shrink-0">
                                <div className="p-2 rounded-lg bg-primary/10">
                                  <feature.icon className="h-6 w-6 text-primary" />
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-1">{feature.title}</h4>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/0">
                        <CardTitle>Progresso de Financiamento</CardTitle>
                        <CardDescription>Quanto já foi captado desta meta</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6 pt-6">
                        <div>
                          <div className="mb-2 flex justify-between items-center">
                            <h4 className="font-semibold">Meta de Captação</h4>
                            <span className="text-sm font-bold text-primary">{progress.toFixed(1)}% concluído</span>
                          </div>
                          <Progress value={progress} className="h-3 rounded-full" />
                          <div className="grid grid-cols-3 gap-4 mt-6">
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200/50"
                            >
                              <p className="text-xs text-muted-foreground mb-1 font-semibold">Captado</p>
                              <p className="font-bold text-lg text-green-700">
                                AOA {((investment.totalFunding - investment.remaining) / 1000000).toFixed(1)}M
                              </p>
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50 text-center"
                            >
                              <p className="text-xs text-muted-foreground mb-1 font-semibold">Meta</p>
                              <p className="font-bold text-lg text-blue-700">
                                AOA {(investment.totalFunding / 1000000).toFixed(1)}M
                              </p>
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                              className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200/50 text-right"
                            >
                              <p className="text-xs text-muted-foreground mb-1 font-semibold">Restante</p>
                              <p className="font-bold text-lg text-orange-700">
                                AOA {(investment.remaining / 1000000).toFixed(1)}M
                              </p>
                            </motion.div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="detalhes" className="space-y-6">
                    <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/0">
                        <CardTitle>Informações Detalhadas</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0 }}
                            className="flex gap-4 p-4 rounded-xl bg-muted/40 border border-border/50"
                          >
                            <MapPin className="text-primary flex-shrink-0 mt-1" size={24} />
                            <div>
                              <h4 className="font-semibold mb-1 text-lg">Localização</h4>
                              <p className="text-sm text-muted-foreground">Luanda, Angola</p>
                              <p className="text-xs text-muted-foreground mt-1">Zona Premium com alta valorização</p>
                            </div>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex gap-4 p-4 rounded-xl bg-muted/40 border border-border/50"
                          >
                            <Clock className="text-primary flex-shrink-0 mt-1" size={24} />
                            <div>
                              <h4 className="font-semibold mb-1 text-lg">Duração Estimada</h4>
                              <p className="text-sm text-muted-foreground">24 meses</p>
                              <p className="text-xs text-muted-foreground mt-1">Com retorno periódico anual</p>
                            </div>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex gap-4 p-4 rounded-xl bg-muted/40 border border-border/50"
                          >
                            <Award className="text-primary flex-shrink-0 mt-1" size={24} />
                            <div>
                              <h4 className="font-semibold mb-1 text-lg">Qualidade do Projeto</h4>
                              <p className="text-sm text-muted-foreground">Certificado AAA</p>
                              <p className="text-xs text-muted-foreground mt-1">Auditado por firmas internacionais</p>
                            </div>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex gap-4 p-4 rounded-xl bg-muted/40 border border-border/50"
                          >
                            <Zap className="text-primary flex-shrink-0 mt-1" size={24} />
                            <div>
                              <h4 className="font-semibold mb-1 text-lg">Liquidez</h4>
                              <p className="text-sm text-muted-foreground">Anual com opções mensais</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Resgate flexível conforme necessidade
                              </p>
                            </div>
                          </motion.div>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200/50 flex gap-3"
                        >
                          <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                          <div>
                            <h4 className="font-semibold text-blue-900 mb-1">Informação Importante</h4>
                            <p className="text-sm text-blue-800">
                              Este investimento é auditado trimestralmente por auditores independentes certificados.
                              Todos os documentos estão disponíveis para download.
                            </p>
                          </div>
                        </motion.div>

                        <div className="p-4 rounded-xl bg-muted/40 border border-border/50">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <FileText size={18} />
                            Documentos Disponíveis
                          </h4>
                          <div className="space-y-2">
                            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                              <Download size={16} className="mr-2" />
                              Prospecto do Investimento
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                              <Download size={16} className="mr-2" />
                              Relatório Financeiro
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                              <Download size={16} className="mr-2" />
                              Análise de Risco
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="riscos" className="space-y-6">
                    <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/0">
                        <CardTitle>Análise de Riscos</CardTitle>
                        <CardDescription>Fatores de risco e mitigação</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-6">
                        {riskFactors.map((risk, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 rounded-xl border border-border/50 bg-gradient-to-r from-muted/30 to-muted/10 hover:border-primary/30 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-semibold text-lg">{risk.factor}</h4>
                              <Badge
                                variant={
                                  risk.level === "Baixo"
                                    ? "success"
                                    : risk.level === "Médio"
                                      ? "warning"
                                      : "destructive"
                                }
                                className="text-xs font-semibold"
                              >
                                {risk.level}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{risk.description}</p>
                          </motion.div>
                        ))}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="timeline" className="space-y-6">
                    <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/0">
                        <CardTitle>Timeline do Projeto</CardTitle>
                        <CardDescription>Cronograma de execução</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-8">
                          {timeline.map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex gap-4"
                            >
                              <div className="flex flex-col items-center">
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: index * 0.1 + 0.2 }}
                                  className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold text-lg shadow-lg"
                                >
                                  {index + 1}
                                </motion.div>
                                {index !== timeline.length - 1 && <div className="w-1 h-20 bg-primary/20 mt-2"></div>}
                              </div>
                              <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 + 0.1 }}
                                className="flex-1 pt-2 pb-4 px-4 rounded-lg bg-gradient-to-r from-muted/40 to-muted/10 border border-border/50 hover:border-primary/30 transition-colors"
                              >
                                <h4 className="font-semibold text-lg text-primary">{item.phase}</h4>
                                <p className="text-sm text-muted-foreground mb-2">{item.date}</p>
                                <p className="text-sm text-foreground font-medium">{item.description}</p>
                              </motion.div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:sticky lg:top-32 lg:h-fit"
            >
              <Card className="shadow-xl border-primary/20 bg-gradient-to-br from-card to-card/80">
                <CardHeader className="bg-gradient-to-r from-primary/15 to-primary/5 border-b border-primary/10">
                  <CardTitle className="text-2xl">Investir Agora</CardTitle>
                  <CardDescription>Configure seu investimento</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div>
                    <label className="text-sm font-semibold mb-3 block flex items-center gap-2">
                      <DollarSign size={16} className="text-primary" />
                      Valor a Investir
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground font-semibold">
                        AOA
                      </span>
                      <input
                        type="number"
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                        min={investment.minInvestment}
                        className="w-full pl-14 pr-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background"
                        placeholder="Insira o valor"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Mínimo: AOA {investment.minInvestment.toLocaleString("pt-PT")}
                    </p>
                  </div>

                  <div className="space-y-3 bg-gradient-to-br from-primary/8 to-primary/3 p-4 rounded-xl border border-primary/15">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Investimento:</span>
                      <span className="font-bold text-foreground">AOA {investmentAmount.toLocaleString("pt-PT")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Taxa anual:</span>
                      <span className="font-bold text-primary">{investment.returnRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duração:</span>
                      <span className="font-bold text-foreground">24 meses</span>
                    </div>
                    <div className="border-t border-primary/20 pt-3 flex justify-between font-bold text-lg">
                      <span>Retorno anual:</span>
                      <span className="text-green-600">AOA {estimatedReturn}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-3">Valores rápidos</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[50000, 100000, 250000, 500000].map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          onClick={() => setInvestmentAmount(amount)}
                          className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          AOA {(amount / 1000).toFixed(0)}K
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleInvest}
                    className="w-full bg-gradient-to-r from-primary via-primary to-primary/90 hover:shadow-lg transition-all h-12 text-base font-semibold"
                  >
                    <CreditCard className="mr-2" size={20} />
                    Investir Agora
                  </Button>

                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <div className="flex gap-2 text-xs">
                      <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">Investimento seguro com garantia</span>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">Retorno garantido e documentado</span>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">Processamento em 24 horas</span>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <Lock size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">Transação 100% segura</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50 space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground">Precisa de ajuda?</p>
                    <div className="flex gap-3 flex-col text-xs">
                      <Button variant="ghost" size="sm" className="justify-start">
                        <Phone size={14} className="mr-2 text-primary" />
                        +244 923 123 456
                      </Button>
                      <Button variant="ghost" size="sm" className="justify-start">
                        <Mail size={14} className="mr-2 text-primary" />
                        suporte@capitalseguro.ao
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {similarInvestments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-16"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Investimentos Similares</h2>
                <p className="text-muted-foreground">Outras oportunidades na categoria {investment.category}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarInvestments.slice(0, 3).map((inv, index) => (
                  <motion.div
                    key={inv.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group border-border/50">
                      <div className="h-40 overflow-hidden bg-muted">
                        <img
                          src={inv.image || "/placeholder.svg"}
                          alt={inv.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="pt-4">
                        <h3 className="font-semibold line-clamp-2 mb-3">{inv.title}</h3>
                        <div className="flex justify-between text-sm mb-4 p-2 rounded-lg bg-muted/50">
                          <span className="text-muted-foreground">Retorno:</span>
                          <span className="font-bold text-green-600">{inv.returnRate}%</span>
                        </div>
                        <Button
                          onClick={() => navigate(`/investments/${inv.id}`)}
                          size="sm"
                          className="w-full hover:shadow-md transition-shadow"
                        >
                          Ver Detalhes
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default InvestmentDetail
