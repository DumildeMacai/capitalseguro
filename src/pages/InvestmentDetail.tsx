"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, TrendingUp, Shield, DollarSign, Users, Calendar, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
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

  const availableInvestments: Investment[] = [
    {
      id: "1",
      title: "Edifício Comercial Talatona",
      description:
        "Investimento em edifício comercial premium na zona sul da cidade. Alto potencial de valorização e renda por aluguel. O projeto inclui 5 andares de escritórios com acabamento de luxo, estacionamento privativo e espaços comerciais no térreo.",
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
        "Investimento em frota de táxis coletivos operando em rotas de alta demanda na cidade. Retorno baseado em lucro operacional com potencial de crescimento exponencial.",
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb e botão voltar */}
          <motion.button
            onClick={() => navigate("/investments")}
            className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
            whileHover={{ x: -4 }}
          >
            <ArrowLeft size={20} />
            <span>Voltar aos investimentos</span>
          </motion.button>

          {/* Hero section com imagem */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden mb-8">
              <img
                src={investment.image || "/placeholder.svg"}
                alt={investment.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="flex gap-3 mb-4">
                      <Badge className="bg-white/90 text-foreground font-medium flex items-center gap-1 text-base py-1 px-3">
                        {investment.icon} {investment.category}
                      </Badge>
                      <Badge
                        variant={
                          investment.risk === "Baixo"
                            ? "success"
                            : investment.risk === "Médio"
                              ? "warning"
                              : "destructive"
                        }
                        className="text-base py-1 px-3"
                      >
                        Risco {investment.risk}
                      </Badge>
                    </div>
                    <h1 className="text-white text-4xl md:text-5xl font-bold">{investment.title}</h1>
                  </div>
                </div>
              </div>
            </div>

            {/* Descrição principal */}
            <div className="bg-card rounded-xl p-8 border">
              <h2 className="text-2xl font-bold mb-4">Sobre este investimento</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{investment.description}</p>
            </div>
          </motion.div>

          {/* Grid com stats e formulário */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Coluna esquerda - Informações */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats principais */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-200/50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Retorno Anual</p>
                      <p className="text-3xl font-bold text-purple-600">{investment.returnRate}%</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200/50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Investimento Mínimo</p>
                      <p className="text-2xl font-bold text-blue-600">
                        AOA {(investment.minInvestment / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200/50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Financiado</p>
                      <p className="text-2xl font-bold text-green-600">{progress.toFixed(0)}%</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-200/50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Restante</p>
                      <p className="text-xl font-bold text-orange-600">
                        AOA {(investment.remaining / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Progresso de financiamento */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Progresso de Financiamento</CardTitle>
                    <CardDescription>Quanto já foi captado desta meta</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Progress value={progress} className="h-3" />
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Captado</p>
                        <p className="font-semibold">
                          AOA {((investment.totalFunding - investment.remaining) / 1000000).toFixed(1)}M
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Meta</p>
                        <p className="font-semibold">AOA {(investment.totalFunding / 1000000).toFixed(1)}M</p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground">Restante</p>
                        <p className="font-semibold">AOA {(investment.remaining / 1000000).toFixed(1)}M</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Características */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Características do Investimento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {features.map((feature, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex-shrink-0">
                            <feature.icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold mb-1">{feature.title}</h4>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Coluna direita - Formulário de investimento */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="sticky top-32 h-fit">
                <CardHeader>
                  <CardTitle>Investir Agora</CardTitle>
                  <CardDescription>Configure seu investimento</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Input de valor */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Valor a Investir (AOA)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        AOA
                      </span>
                      <input
                        type="number"
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                        min={investment.minInvestment}
                        className="w-full pl-12 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Insira o valor"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Mínimo: AOA {investment.minInvestment.toLocaleString("pt-PT")}
                    </p>
                  </div>

                  {/* Resumo do cálculo */}
                  <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Investimento:</span>
                      <span className="font-medium">AOA {investmentAmount.toLocaleString("pt-PT")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Taxa anual:</span>
                      <span className="font-medium">{investment.returnRate}%</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                      <span>Retorno anual:</span>
                      <span className="text-green-600">AOA {estimatedReturn}</span>
                    </div>
                  </div>

                  {/* Botão de investimento */}
                  <Button onClick={handleInvest} className="w-full bg-gradient-primary hover:opacity-90 h-12 text-base">
                    <DollarSign className="mr-2" size={20} />
                    Investir Agora
                  </Button>

                  {/* Disclaimer */}
                  <div className="text-xs text-muted-foreground space-y-2 pt-4 border-t">
                    <div className="flex gap-2">
                      <CheckCircle size={14} className="flex-shrink-0 mt-0.5" />
                      <span>Investimento 100% seguro</span>
                    </div>
                    <div className="flex gap-2">
                      <CheckCircle size={14} className="flex-shrink-0 mt-0.5" />
                      <span>Retorno garantido</span>
                    </div>
                    <div className="flex gap-2">
                      <CheckCircle size={14} className="flex-shrink-0 mt-0.5" />
                      <span>Processamento em 24h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recomendações - investimentos similares */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Investimentos Similares</h2>
              <p className="text-muted-foreground">Confira outras oportunidades na mesma categoria</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {availableInvestments
                .filter((inv) => inv.category === investment.category && inv.id !== investment.id)
                .slice(0, 3)
                .map((inv) => {
                  const simProgress = ((inv.totalFunding - inv.remaining) / inv.totalFunding) * 100
                  return (
                    <Card
                      key={inv.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => navigate(`/investments/${inv.id}`)}
                    >
                      <div className="relative h-40 overflow-hidden rounded-t-lg">
                        <img
                          src={inv.image || "/placeholder.svg"}
                          alt={inv.title}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="pt-4">
                        <h3 className="font-semibold mb-2 line-clamp-2">{inv.title}</h3>
                        <div className="flex justify-between mb-3 text-sm">
                          <span className="font-medium">{inv.returnRate}% ao ano</span>
                          <span className="text-muted-foreground">{simProgress.toFixed(0)}% financiado</span>
                        </div>
                        <Progress value={simProgress} className="h-2" />
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default InvestmentDetail
