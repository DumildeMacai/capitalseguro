"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
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
import { Home, PieChart, Search, User, Settings, LogOut, Wallet, TrendingUp } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import InvestmentCard from "@/components/InvestmentCard"
import InvestorPortfolioChart from "@/components/InvestorPortfolioChart"
import InvestmentOptions from "@/components/InvestmentOptions"
import EditProfileModal from "@/components/profile/EditProfileModal"
import UploadAvatar from "@/components/profile/UploadAvatar"
import Questionnaire from "@/components/profile/Questionnaire"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { motion } from "framer-motion"

const InvestorDashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("visao-geral")
  const [editOpen, setEditOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [questionOpen, setQuestionOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [profile, setProfile] = useState<any>(null)

  // load profile on mount
  useEffect(() => {
    ;(async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
        setProfile(data || null)
        if (data && "avatar_url" in data && data.avatar_url) setAvatarUrl(data.avatar_url as string)
      } catch (err) {
        setProfile(null)
      }
    })()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/login")
  }

  const portfolioData = [
    { name: "Imóveis", value: 50000 },
    { name: "Empresas", value: 25000 },
    { name: "Startups", value: 15000 },
    { name: "Outros", value: 10000 },
  ]

  const recentInvestments = [
    {
      id: "inv-001",
      name: "Edifício Comercial Centro",
      type: "Imóvel",
      value: 25000,
      date: "2023-09-15",
      status: "Ativo",
      return: 12.5,
    },
    {
      id: "inv-002",
      name: "Tech Solutions Inc.",
      type: "Empresa",
      value: 10000,
      date: "2023-10-05",
      status: "Em análise",
      return: 8.2,
    },
    {
      id: "inv-003",
      name: "EcoResort Expansão",
      type: "Imóvel",
      value: 15000,
      date: "2023-11-20",
      status: "Ativo",
      return: 15.0,
    },
  ]

  const featuredInvestments = [
    {
      id: "real-estate-fund-1",
      title: "Fundo Imobiliário Premium",
      description:
        "Portfólio diversificado de propriedades comerciais em localizações privilegiadas com renda estável de aluguel.",
      category: "Imóveis",
      returnRate: 50,
      minInvestment: 5000,
      remaining: 1250000,
      totalFunding: 5000000,
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1773&q=80",
      featured: true,
    },
    {
      id: "commercial-plaza-development",
      title: "Desenvolvimento de Plaza Comercial",
      description:
        "Novo desenvolvimento de plaza comercial em área urbana de alto tráfego com acordos de locação pré-assinados.",
      category: "Imóveis",
      returnRate: 50,
      minInvestment: 15000,
      remaining: 2000000,
      totalFunding: 6000000,
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      featured: true,
    },
  ]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Sidebar className="border-slate-700 bg-slate-800">
          <SidebarHeader className="border-slate-700">
            <div className="flex items-center gap-2 px-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-white">Capital Seguro</h1>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Início"
                  isActive={activeTab === "visao-geral"}
                  onClick={() => setActiveTab("visao-geral")}
                  className="data-[active=true]:bg-emerald-500/20 data-[active=true]:text-emerald-400"
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
                  className="data-[active=true]:bg-emerald-500/20 data-[active=true]:text-emerald-400"
                >
                  <PieChart size={20} />
                  <span>Meus Investimentos</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Explorar"
                  isActive={activeTab === "explorar"}
                  onClick={() => setActiveTab("explorar")}
                  className="data-[active=true]:bg-emerald-500/20 data-[active=true]:text-emerald-400"
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
                  className="data-[active=true]:bg-emerald-500/20 data-[active=true]:text-emerald-400"
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
                  className="data-[active=true]:bg-emerald-500/20 data-[active=true]:text-emerald-400"
                >
                  <Settings size={20} />
                  <span>Configurações</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-slate-700">
            <Button
              variant="outline"
              className="w-full justify-start bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-auto p-6 md:p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8 bg-slate-800 border border-slate-700">
              <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
              <TabsTrigger value="meus-investimentos">Meus Investimentos</TabsTrigger>
              <TabsTrigger value="explorar">Explorar</TabsTrigger>
              <TabsTrigger value="perfil">Perfil</TabsTrigger>
              <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
            </TabsList>

            {/* Visão Geral Tab */}
            <TabsContent value="visao-geral" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0 }}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 hover:border-emerald-500/50 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Total Investido</p>
                      <p className="text-4xl font-bold text-white">Kz 100.000</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <Wallet className="text-emerald-400" size={24} />
                    </div>
                  </div>
                  <p className="text-emerald-400 text-sm font-semibold">+15% este ano</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Retorno Acumulado</p>
                      <p className="text-4xl font-bold text-white">Kz 12.500</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <TrendingUp className="text-blue-400" size={24} />
                    </div>
                  </div>
                  <p className="text-blue-400 text-sm font-semibold">+5% este mês</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 hover:border-purple-500/50 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Oportunidades</p>
                      <p className="text-4xl font-bold text-white">24</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Search className="text-purple-400" size={24} />
                    </div>
                  </div>
                  <p className="text-purple-400 text-sm font-semibold">6 novos esta semana</p>
                </motion.div>
              </div>

              {/* Charts and Recent Investments */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Investments */}
                <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                  <div className="p-6 border-b border-slate-700">
                    <h3 className="text-xl font-bold text-white">Investimentos Recentes</h3>
                    <p className="text-slate-400 text-sm mt-1">Seus últimos investimentos realizados</p>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700 hover:bg-transparent">
                          <TableHead className="text-slate-300">Nome</TableHead>
                          <TableHead className="text-slate-300">Tipo</TableHead>
                          <TableHead className="text-slate-300">Valor</TableHead>
                          <TableHead className="text-slate-300">Status</TableHead>
                          <TableHead className="text-slate-300">Retorno</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentInvestments.map((investment) => (
                          <TableRow key={investment.id} className="border-slate-700 hover:bg-slate-700/50">
                            <TableCell className="font-medium text-white">{investment.name}</TableCell>
                            <TableCell className="text-slate-300">{investment.type}</TableCell>
                            <TableCell className="text-slate-300">
                              Kz {investment.value.toLocaleString("pt-PT")}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  investment.status === "Ativo"
                                    ? "bg-emerald-500/20 text-emerald-300"
                                    : investment.status === "Em análise"
                                      ? "bg-yellow-500/20 text-yellow-300"
                                      : "bg-slate-600 text-slate-300"
                                }`}
                              >
                                {investment.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-emerald-400 font-semibold">+{investment.return}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Portfolio Distribution */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Distribuição</h3>
                  <InvestorPortfolioChart data={portfolioData} />
                </div>
              </div>

              {/* Featured Investments */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Investimentos em Destaque</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredInvestments.map((investment) => (
                    <InvestmentCard key={investment.id} {...investment} />
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Meus Investimentos Tab */}
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
                      {[
                        ...recentInvestments,
                        {
                          id: "inv-004",
                          name: "Complexo Residencial Jardins",
                          type: "Imóvel",
                          value: 30000,
                          date: "2023-07-10",
                          status: "Ativo",
                          return: 9.8,
                        },
                        {
                          id: "inv-005",
                          name: "Startup FinTech Inovação",
                          type: "Startup",
                          value: 15000,
                          date: "2023-08-22",
                          status: "Ativo",
                          return: 22.5,
                        },
                      ].map((investment) => (
                        <TableRow key={investment.id}>
                          <TableCell className="font-medium">{investment.name}</TableCell>
                          <TableCell>{investment.type}</TableCell>
                          <TableCell>{new Date(investment.date).toLocaleDateString("pt-BR")}</TableCell>
                          <TableCell>Kz {investment.value.toLocaleString("pt-PT")}</TableCell>
                          <TableCell>
                            Kz {Math.round(investment.value * (1 + investment.return / 100)).toLocaleString("pt-PT")}
                          </TableCell>
                          <TableCell className="text-success">+{investment.return}%</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                investment.status === "Ativo"
                                  ? "bg-green-100 text-green-800"
                                  : investment.status === "Em análise"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {investment.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
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
                      <InvestorPortfolioChart data={portfolioData} showBars={true} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Retornos Acumulados</CardTitle>
                    <CardDescription>Evolução dos ganhos ao longo do tempo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center">
                      <p className="text-muted-foreground text-center">Gráfico de linha com evolução temporal</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
                        <Button onClick={() => setEditOpen(true)}>Editar Informações</Button>
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
                          <p className="text-lg font-medium px-4 py-1 bg-yellow-100 text-yellow-800 rounded-full">
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
                  <Button onClick={() => setQuestionOpen(true)}>Iniciar Questionário</Button>
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
                      <Button variant="outline">Alterar Senha</Button>
                      <Button variant="outline">Ativar Autenticação em Duas Etapas</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default InvestorDashboard
