"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { calculateReturn } from "@/utils/interestCalculations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Home, PieChart, Search, User, Settings, LogOut, Wallet, TrendingUp, Bell } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import InvestmentCard from "@/components/InvestmentCard"
import InvestorPortfolioChart from "@/components/InvestorPortfolioChart"
import ReturnsEvolutionChart from "@/components/ReturnsEvolutionChart"
import InvestmentOptions from "@/components/InvestmentOptions"
import EditProfileModal from "@/components/profile/EditProfileModal"
import UploadAvatar from "@/components/profile/UploadAvatar"
import Questionnaire from "@/components/profile/Questionnaire"
import NotificationsSection from "@/components/NotificationsSection"
import { ChangePasswordForm } from "@/components/security/ChangePasswordForm"
import { TwoFactorAuthForm } from "@/components/security/TwoFactorAuthForm"
import { WithdrawalForm } from "@/components/WithdrawalForm"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { TransactionHistory } from "@/components/TransactionHistory"
import ConsolidatedStatement from "@/components/ConsolidatedStatement"

const InvestorDashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("visao-geral")
  const [editOpen, setEditOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [questionOpen, setQuestionOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [userId, setUserId] = useState<string>("")
  const [unreadNotifications, setUnreadNotifications] = useState(3)
  const [saldo, setSaldo] = useState(0)
  const [myInvestments, setMyInvestments] = useState<any[]>([])
  const [featuredInvestmentsState, setFeaturedInvestmentsState] = useState<any[]>([])
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [show2FA, setShow2FA] = useState(false)

  // Load ALL data in parallel immediately on mount
  useEffect(() => {
    ;(async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return
        
        // Set userId first so dependent useEffects work
        setUserId(user.id)
        
        // Load EVERYTHING in parallel - profile, balance, and investments
        const [profileResponse, investmentsResponse] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).single(),
          supabase
            .from("inscricoes_investimentos")
            .select("*, investimentos(*)")
            .eq("usuario_id", user.id)
            .order("data_inscricao", { ascending: false })
        ])

        // Process profile
        const profileData = profileResponse.data
        setProfile(profileData || null)
        if (profileData && "avatar_url" in profileData && profileData.avatar_url) {
          setAvatarUrl(profileData.avatar_url as string)
        }

        // Process balance - load from Supabase database (saldo_disponivel)
        const saldoDoDb = profileData?.saldo_disponivel ? Number(profileData.saldo_disponivel) : 0
        setSaldo(saldoDoDb)

        // Process investments
        if (investmentsResponse.data) {
          console.log("Investimentos carregados do Supabase:", investmentsResponse.data)
          const formatted = (investmentsResponse.data || []).map((inv: any) => ({
            id: inv.id,
            name: inv.investimentos?.titulo || "Investimento",
            type: inv.investimentos?.categoria || "Outro",
            value: inv.valor_investido || 0,
            date: new Date(inv.data_inscricao).toLocaleDateString("pt-PT"),
            dateISO: inv.data_inscricao,
            status: "Ativo",
            return: inv.investimentos?.retorno_estimado || 0,
            tipoJuros: inv.investimentos?.tipo_juros || "simples",
            tipoRenda: inv.investimentos?.tipo_renda || "fixa",
          }))
          console.log("Investimentos formatados:", formatted)
          setMyInvestments(formatted)
        } else {
          console.log("Erro ao carregar investimentos:", investmentsResponse.error)
        }
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err)
        setProfile(null)
      }
    })()
  }, [])

  // Buscar investimentos em destaque
  useEffect(() => {
    const loadFeaturedInvestments = async () => {
      try {
        const { data, error } = await supabase
          .from("investimentos")
          .select("*")
          .eq("colocacao", "destaque")
          .eq("ativo", true)
          .order("data_criacao", { ascending: false })

        if (error) throw error

        // Transformar dados para o formato esperado pelo InvestmentCard
        const formatted = (data || []).map((inv: any) => ({
          id: inv.id,
          title: inv.titulo,
          description: inv.descricao || "",
          category: inv.categoria || "Investimento",
          returnRate: inv.retorno_estimado || 0,
          minInvestment: inv.valor_minimo || 0,
          image: inv.imagem || "/placeholder.svg",
          featured: true,
          remaining: inv.valor_minimo || 0,
          totalFunding: inv.valor_minimo ? (inv.valor_minimo * 2) : 10000,
        }))

        setFeaturedInvestmentsState(formatted)
      } catch (err) {
        console.error("Erro ao carregar investimentos em destaque:", err)
      }
    }

    loadFeaturedInvestments()
    
    // Recarregar quando investimentos mudam
    const handleUpdate = () => loadFeaturedInvestments()
    window.addEventListener("investmentUpdated", handleUpdate)
    window.addEventListener("investmentFeatured", handleUpdate)

    return () => {
      window.removeEventListener("investmentUpdated", handleUpdate)
      window.removeEventListener("investmentFeatured", handleUpdate)
    }
  }, [])

  // Listen para atualizações em tempo real do saldo e investimentos
  useEffect(() => {
    if (!userId) return

    const loadSaldoFromDb = async () => {
      try {
        const { data } = await supabase.from("profiles").select("saldo_disponivel").eq("id", userId).single()
        if (data) {
          console.log("Saldo atualizado:", data.saldo_disponivel)
          setSaldo(Number(data.saldo_disponivel || 0))
        }
      } catch (err) {
        console.error("Erro ao carregar saldo atualizado:", err)
      }
    }

    const handleInvestmentStatusUpdate = () => {
      reloadMyInvestments(userId)
    }
    
    window.addEventListener("balanceUpdated", loadSaldoFromDb)
    window.addEventListener("depositApproved", loadSaldoFromDb)
    window.addEventListener("investmentStatusUpdated", handleInvestmentStatusUpdate)
    window.addEventListener("investmentApproved", handleInvestmentStatusUpdate)
    
    return () => {
      window.removeEventListener("balanceUpdated", loadSaldoFromDb)
      window.removeEventListener("depositApproved", loadSaldoFromDb)
      window.removeEventListener("investmentStatusUpdated", handleInvestmentStatusUpdate)
      window.removeEventListener("investmentApproved", handleInvestmentStatusUpdate)
    }
  }, [userId])

  // Recarregar saldo imediatamente quando o userId está pronto (fallback)
  useEffect(() => {
    if (!userId) return
    
    const timeout = setTimeout(async () => {
      try {
        const { data } = await supabase.from("profiles").select("saldo_disponivel").eq("id", userId).single()
        if (data) {
          console.log("Saldo carregado (fallback):", data.saldo_disponivel)
          setSaldo(Number(data.saldo_disponivel || 0))
        }
      } catch (err) {
        console.error("Erro ao carregar saldo (fallback):", err)
      }
    }, 500)
    
    return () => clearTimeout(timeout)
  }, [userId])

  // Recarrega investimentos do usuário com status atualizado
  const reloadMyInvestments = async (uid?: string) => {
    try {
      const userId_to_use = uid || userId
      if (!userId_to_use) return

      const { data } = await supabase
        .from("inscricoes_investimentos")
        .select("*, investimentos(*)")
        .eq("usuario_id", userId_to_use)
        .order("data_inscricao", { ascending: false })

      if (data) {
        const formatted = data.map((inv: any) => ({
          id: inv.id,
          name: inv.investimentos?.titulo || "Investimento",
          type: inv.investimentos?.categoria || "Outro",
          value: inv.valor_investido || 0,
          date: new Date(inv.data_inscricao).toLocaleDateString("pt-PT"),
          dateISO: inv.data_inscricao,
          status: "Ativo",
          return: inv.investimentos?.retorno_estimado || 0,
          tipoJuros: inv.investimentos?.tipo_juros || "simples",
          tipoRenda: inv.investimentos?.tipo_renda || "fixa",
        }))
        setMyInvestments(formatted)
      }
    } catch (err) {
      console.error("Erro ao recarregar investimentos:", err)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/login")
  }

  // Calcula retorno acumulado diário (não anual imediato)
  const calculateDailyReturn = () => {
    return myInvestments.reduce((total, inv) => {
      const investmentDate = new Date(inv.dateISO || inv.date)
      const today = new Date()
      const daysElapsed = Math.floor((today.getTime() - investmentDate.getTime()) / (1000 * 60 * 60 * 24))
      const annualReturn = inv.return || 50
      const interestType = inv.tipoJuros || "simples"
      
      const dailyReturnValue = calculateReturn(inv.value, annualReturn, daysElapsed, interestType as "simples" | "composto")
      return total + dailyReturnValue
    }, 0)
  }

  // Calcula valor acumulado para um investimento específico
  const calculateInvestmentAccumulated = (investment: any) => {
    const investmentDate = new Date(investment.dateISO || investment.date)
    const today = new Date()
    const daysElapsed = Math.floor((today.getTime() - investmentDate.getTime()) / (1000 * 60 * 60 * 24))
    const annualReturn = investment.return || 50
    const interestType = investment.tipoJuros || "simples"
    return calculateReturn(investment.value, annualReturn, daysElapsed, interestType as "simples" | "composto")
  }

  // Calcula dias decorridos
  const calculateDaysElapsed = (investment: any) => {
    const investmentDate = new Date(investment.dateISO || investment.date)
    const today = new Date()
    return Math.floor((today.getTime() - investmentDate.getTime()) / (1000 * 60 * 60 * 24))
  }

  // Calcula data de término (data de investimento + 365 dias)
  const calculateEndDate = (investment: any) => {
    const investmentDate = new Date(investment.dateISO || investment.date)
    const endDate = new Date(investmentDate)
    endDate.setDate(endDate.getDate() + 365)
    return endDate.toLocaleDateString("pt-PT")
  }

  // Calcula dias restantes até o término
  const calculateDaysLeft = (investment: any) => {
    const investmentDate = new Date(investment.dateISO || investment.date)
    const endDate = new Date(investmentDate)
    endDate.setDate(endDate.getDate() + 365)
    const today = new Date()
    const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, daysLeft) // Não pode ser negativo
  }

  // Gera dados dinâmicos para o gráfico, agrupando por categoria
  const portfolioData = myInvestments.length > 0 
    ? Object.values(
        myInvestments.reduce((acc: any, inv: any) => {
          const category = inv.type || "Outro"
          if (!acc[category]) {
            acc[category] = { name: category, value: 0 }
          }
          acc[category].value += inv.value
          return acc
        }, {})
      )
    : [{ name: "Sem investimentos", value: 0 }]

  const recentInvestments = myInvestments
  const featuredInvestments = featuredInvestmentsState

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar className="border-border bg-card">
          <SidebarHeader className="border-border">
            <div className="flex items-center gap-2 px-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-lg font-bold text-card-foreground">Capital Seguro</h1>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Início"
                  isActive={activeTab === "visao-geral"}
                  onClick={() => setActiveTab("visao-geral")}
                  className="data-[active=true]:bg-primary/20 data-[active=true]:text-primary"
                >
                  <Home size={20} />
                  <span>Visão Geral</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Meus Investimentos"
                  isActive={activeTab === "meus-investimentos"}
                  onClick={() => setActiveTab("meus-investimentos")}
                  className="data-[active=true]:bg-primary/20 data-[active=true]:text-primary"
                >
                  <PieChart size={20} />
                  <span>Meus Investimentos</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Depositar"
                  onClick={() => navigate("/depositar")}
                  className="data-[active=false]:text-muted-foreground hover:text-primary"
                  data-testid="button-sidebar-deposit"
                >
                  <Wallet size={20} />
                  <span>Depositar</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Explorar"
                  isActive={activeTab === "explorar"}
                  onClick={() => setActiveTab("explorar")}
                  className="data-[active=true]:bg-primary/20 data-[active=true]:text-primary"
                >
                  <Search size={20} />
                  <span>Explorar Investimentos</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Perfil"
                  isActive={activeTab === "perfil"}
                  onClick={() => setActiveTab("perfil")}
                  className="data-[active=true]:bg-primary/20 data-[active=true]:text-primary"
                >
                  <User size={20} />
                  <span>Perfil</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Configurações"
                  isActive={activeTab === "configuracoes"}
                  onClick={() => setActiveTab("configuracoes")}
                  className="data-[active=true]:bg-primary/20 data-[active=true]:text-primary"
                >
                  <Settings size={20} />
                  <span>Configurações</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Notificações"
                  isActive={activeTab === "notificacoes"}
                  onClick={() => setActiveTab("notificacoes")}
                  className="data-[active=true]:bg-primary/20 data-[active=true]:text-primary"
                >
                  <div className="relative">
                    <Bell size={20} />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                        {unreadNotifications}
                      </span>
                    )}
                  </div>
                  <span>Notificações</span>
                  {unreadNotifications > 0 && (
                    <Badge variant="destructive" className="ml-auto text-[10px] px-1.5 py-0">
                      {unreadNotifications}
                    </Badge>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-border">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-auto p-6 md:p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8 bg-card border border-border">
              <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
              <TabsTrigger value="meus-investimentos">Meus Investimentos</TabsTrigger>
              <TabsTrigger value="extrato">Extrato Consolidado</TabsTrigger>
              <TabsTrigger value="sacar">Sacar</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
              <TabsTrigger value="explorar">Explorar</TabsTrigger>
              <TabsTrigger value="perfil">Perfil</TabsTrigger>
              <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
              <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
            </TabsList>

            {/* Visão Geral Tab */}
            <TabsContent value="visao-geral" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0 }}
                  className="bg-card rounded-xl p-6 border border-border hover:border-primary/20 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Total Investido</p>
                      <p className="text-4xl font-bold text-foreground">
                        Kz {myInvestments.reduce((sum, inv) => sum + inv.value, 0).toLocaleString("pt-PT")}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Wallet className="text-primary" size={24} />
                    </div>
                  </div>
                  <p className="text-primary text-sm font-semibold">+15% este ano</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-card rounded-xl p-6 border border-border hover:border-accent/20 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Retorno Acumulado (50% a.a.)</p>
                      <p className="text-4xl font-bold text-foreground">
                        Kz {calculateDailyReturn().toLocaleString("pt-PT", { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                      <TrendingUp className="text-accent" size={24} />
                    </div>
                  </div>
                  <p className="text-accent text-sm font-semibold">Acumulado diariamente</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card rounded-xl p-6 border border-border hover:border-accent/20 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Saldo Disponível</p>
                      <p className="text-4xl font-bold text-foreground">Kz {saldo.toFixed(2)}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
                      <Wallet className="text-success" size={24} />
                    </div>
                  </div>
                  <p className="text-success text-sm font-semibold">Pronto para investir</p>
                </motion.div>
              </div>

              {/* Charts and Recent Investments */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Investments */}
                <div className="lg:col-span-2 bg-card rounded-xl border border-border overflow-hidden">
                  <div className="p-6 border-b border-border">
                    <h3 className="text-xl font-bold text-foreground">Investimentos Recentes</h3>
                    <p className="text-muted-foreground text-sm mt-1">Seus últimos investimentos realizados</p>
                  </div>
                  <div className="overflow-x-auto">
                    <Table className="text-sm">
                      <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                          <TableHead className="text-muted-foreground text-xs px-2 py-2">Nome</TableHead>
                          <TableHead className="text-muted-foreground text-xs px-2 py-2">Tipo</TableHead>
                          <TableHead className="text-muted-foreground text-xs px-2 py-2">Data Investido</TableHead>
                          <TableHead className="text-muted-foreground text-xs px-2 py-2">Data Término</TableHead>
                          <TableHead className="text-muted-foreground text-xs px-2 py-2 text-center">Dias</TableHead>
                          <TableHead className="text-muted-foreground text-xs px-2 py-2 text-right">Valor</TableHead>
                          <TableHead className="text-muted-foreground text-xs px-2 py-2 text-right">Acumulado</TableHead>
                          <TableHead className="text-muted-foreground text-xs px-2 py-2">Status</TableHead>
                          <TableHead className="text-muted-foreground text-xs px-2 py-2 text-right">Retorno</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentInvestments.map((investment) => (
                          <TableRow key={investment.id} className="border-border hover:bg-muted/50">
                            <TableCell className="font-medium text-foreground text-xs px-2 py-2 whitespace-nowrap">{investment.name}</TableCell>
                            <TableCell className="text-muted-foreground text-xs px-2 py-2 whitespace-nowrap">{investment.type}</TableCell>
                            <TableCell className="text-muted-foreground text-xs px-2 py-2 whitespace-nowrap">{investment.date}</TableCell>
                            <TableCell className="text-muted-foreground text-xs px-2 py-2 whitespace-nowrap">{calculateEndDate(investment)}</TableCell>
                            <TableCell className="text-muted-foreground text-xs px-2 py-2 text-center font-medium">{calculateDaysLeft(investment)}d</TableCell>
                            <TableCell className="text-muted-foreground text-xs px-2 py-2 text-right whitespace-nowrap">
                              Kz {investment.value.toLocaleString("pt-PT")}
                            </TableCell>
                            <TableCell className="text-accent text-xs px-2 py-2 text-right font-semibold whitespace-nowrap">
                              Kz {calculateInvestmentAccumulated(investment).toLocaleString("pt-PT", { maximumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="text-xs px-2 py-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                                  investment.status === "Ativo"
                                    ? "bg-primary/20 text-primary"
                                    : investment.status === "Em análise"
                                      ? "bg-accent/20 text-accent"
                                      : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {investment.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-primary text-xs px-2 py-2 text-right font-semibold">+{investment.return}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Portfolio Distribution */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4">Distribuição</h3>
                  <InvestorPortfolioChart data={portfolioData as any} />
                </div>
              </div>

              {/* Featured Investments */}
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">Investimentos em Destaque</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredInvestments.map((investment) => (
                    <InvestmentCard key={investment.id} {...investment} />
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Meus Investimentos Tab */}
            {/* Extrato Consolidado Tab */}
            <TabsContent value="extrato" className="space-y-6">
              <ConsolidatedStatement />
            </TabsContent>

            <TabsContent value="meus-investimentos" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Seu Portfólio Completo</CardTitle>
                  <CardDescription>Visão detalhada de todos seus investimentos</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome do Investimento</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Valor Investido</TableHead>
                        <TableHead>Valor Atual</TableHead>
                        <TableHead>Retorno</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myInvestments.map((investment) => {
                        const daysElapsed = investment.dateISO 
                          ? Math.floor((new Date().getTime() - new Date(investment.dateISO).getTime()) / (1000 * 60 * 60 * 24))
                          : 0
                        const accumulatedReturn = (investment.return / 365) * daysElapsed * investment.value / 100
                        const currentValue = investment.value + accumulatedReturn
                        return (
                          <TableRow key={investment.id}>
                            <TableCell className="font-medium">{investment.name}</TableCell>
                            <TableCell>{investment.type}</TableCell>
                            <TableCell>{investment.date}</TableCell>
                            <TableCell>Kz {investment.value.toLocaleString("pt-PT")}</TableCell>
                            <TableCell>
                              Kz {currentValue.toLocaleString("pt-PT", { maximumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="text-primary">+{investment.return}%</TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  investment.status === "Ativo"
                                    ? "bg-primary/20 text-primary"
                                    : investment.status === "Pendente"
                                      ? "bg-accent/20 text-accent"
                                      : "bg-destructive/20 text-destructive"
                                }`}
                              >
                                {investment.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Análise de Desempenho</CardTitle>
                    <CardDescription>Comparativo dos retornos por categoria</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <InvestorPortfolioChart data={portfolioData as any} showBars={true} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Retornos Acumulados</CardTitle>
                    <CardDescription>Evolução dos ganhos ao longo do tempo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      {myInvestments.length > 0 ? (
                        <ReturnsEvolutionChart investments={myInvestments} />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-muted-foreground text-center">Nenhum investimento para exibir</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Sacar Tab */}
            <TabsContent value="sacar" className="space-y-6 flex justify-center py-8">
              <WithdrawalForm 
                onSuccess={() => {
                  // Recarregar saldo após saque
                  location.reload()
                }} 
              />
            </TabsContent>

            {/* Histórico Tab */}
            <TabsContent value="historico" className="space-y-6">
              <TransactionHistory userId={userId} />
            </TabsContent>

            {/* Explorar Tab */}
            <TabsContent value="explorar">
              <InvestmentOptions />
            </TabsContent>

            {/* Perfil Tab */}
            <TabsContent value="perfil" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Perfil do Investidor</CardTitle>
                  <CardDescription>Suas informações pessoais</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-md font-medium text-muted-foreground mb-1">Nome Completo</h3>
                          <p className="text-lg">{profile?.nome_completo || "João Silva Investidor"}</p>
                        </div>

                        <div>
                          <h3 className="text-md font-medium text-muted-foreground mb-1">E-mail</h3>
                          <p className="text-lg">{profile?.email || profile?.email || ""}</p>
                        </div>

                        <div>
                          <h3 className="text-md font-medium text-muted-foreground mb-1">Telefone</h3>
                          <p className="text-lg">{profile?.telefone || "+55 11 98765-4321"}</p>
                        </div>

                        <div>
                          <h3 className="text-md font-medium text-muted-foreground mb-1">Endereço</h3>
                          <p className="text-lg">{profile?.endereco || "Av. Paulista, 1000, São Paulo - SP"}</p>
                        </div>

                        <div>
                          <h3 className="text-md font-medium text-muted-foreground mb-1">Documento de Identidade</h3>
                          <p className="text-lg">{profile?.documento_frente || "123.456.789-00"}</p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <Button variant="outline" onClick={() => setEditOpen(true)}>Editar Informações</Button>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-40 h-40 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-primary mb-4">
                        {avatarUrl ? (
                          <Avatar className="h-40 w-40">
                            <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="Avatar" />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                        ) : (
                          <User className="h-20 w-20 text-muted-foreground" />
                        )}
                      </div>

                      <div className="space-y-4 text-center">
                        <div>
                          <h3 className="text-md font-medium text-muted-foreground mb-1">Perfil de Risco</h3>
                          <p className="text-lg font-medium px-4 py-1 bg-accent/20 text-accent rounded-full">
                            Moderado
                          </p>
                        </div>

                        <div>
                          <h3 className="text-md font-medium text-muted-foreground mb-1">Cliente desde</h3>
                          <p className="text-lg">Janeiro 2024</p>
                        </div>

                        <Button variant="outline" size="sm" onClick={() => setAvatarOpen(true)}>
                          Atualizar Foto
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Questionário de Perfil de Investidor</CardTitle>
                  <CardDescription>Refaça o teste para atualizar seu perfil de risco</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" onClick={() => setQuestionOpen(true)}>Iniciar Questionário</Button>
                </CardContent>
              </Card>

              {/* Modals */}
              <EditProfileModal open={editOpen} onOpenChange={setEditOpen} onSaved={(p) => setProfile(p)} />

              {/* Avatar upload dialog - reuse Dialog via UploadAvatar inside */}
              <Questionnaire open={questionOpen} onOpenChange={setQuestionOpen} />

              {/* Simple Dialog wrapper for UploadAvatar */}
              <div>
                {/* Hidden dialog usage: show UploadAvatar when avatarOpen true */}
                {avatarOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-background rounded-lg shadow-lg p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Atualizar Foto</h3>
                        <button onClick={() => setAvatarOpen(false)} className="text-muted-foreground">
                          Fechar
                        </button>
                      </div>
                      <UploadAvatar
                        onUpload={(url) => {
                          setAvatarUrl(url)
                          setAvatarOpen(false)
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Notificações Tab */}
            <TabsContent value="notificacoes" className="space-y-6">
              {userId && (
                <NotificationsSection 
                  userId={userId} 
                  onUnreadCountChange={(count) => setUnreadNotifications(count)}
                />
              )}
            </TabsContent>

            {/* Configurações Tab */}
            <TabsContent value="configuracoes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preferências da Conta</CardTitle>
                  <CardDescription>Gerencie as configurações da sua conta</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Notificações</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <label htmlFor="email-notif" className="text-sm">
                          Notificações por E-mail
                        </label>
                        <input type="checkbox" id="email-notif" className="toggle" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <label htmlFor="sms-notif" className="text-sm">
                          Notificações por SMS
                        </label>
                        <input type="checkbox" id="sms-notif" className="toggle" />
                      </div>
                      <div className="flex items-center justify-between">
                        <label htmlFor="new-opp" className="text-sm">
                          Novas Oportunidades
                        </label>
                        <input type="checkbox" id="new-opp" className="toggle" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <label htmlFor="inv-updates" className="text-sm">
                          Atualizações de Investimentos
                        </label>
                        <input type="checkbox" id="inv-updates" className="toggle" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4">
                    <h3 className="font-medium">Segurança</h3>
                    <div className="space-y-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowChangePassword(true)}
                        data-testid="button-open-change-password"
                      >
                        Alterar Senha
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setShow2FA(true)}
                        data-testid="button-open-2fa"
                      >
                        Ativar Autenticação em Duas Etapas
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent className="sm:max-w-md flex items-center justify-center">
          <ChangePasswordForm
            onClose={() => setShowChangePassword(false)}
            onSuccess={() => {
              setShowChangePassword(false)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Two Factor Auth Dialog */}
      <Dialog open={show2FA} onOpenChange={setShow2FA}>
        <DialogContent className="sm:max-w-md flex items-center justify-center">
          <TwoFactorAuthForm
            onClose={() => setShow2FA(false)}
            onSuccess={() => {
              setShow2FA(false)
            }}
          />
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}

export default InvestorDashboard
