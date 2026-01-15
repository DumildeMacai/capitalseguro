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
import { Home, PieChart, Search, User, Settings, LogOut, Wallet, TrendingUp, Bell, Download, PlusCircle } from "lucide-react"
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
import { DepositModal } from "@/components/DepositModal"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { TransactionHistory } from "@/components/TransactionHistory"
import ConsolidatedStatement from "@/components/ConsolidatedStatement"
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import { Skeleton } from "@/components/ui/skeleton"

const DashboardSkeleton = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-32 w-full rounded-xl" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
      <div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    </div>
  </div>
)

const InvestorDashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("visao-geral")
  const [editOpen, setEditOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [depositOpen, setDepositOpen] = useState(false)
  const [questionOpen, setQuestionOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [userId, setUserId] = useState<string>("")
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [saldo, setSaldo] = useState(0)
  const [myInvestments, setMyInvestments] = useState<any[]>([])
  const [featuredInvestmentsState, setFeaturedInvestmentsState] = useState<any[]>([])
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [show2FA, setShow2FA] = useState(false)

  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(20)
    doc.setTextColor(41, 128, 185)
    doc.text("Capital Seguro - Extrato de Investimentos", 20, 20)
    doc.setFontSize(12)
    doc.setTextColor(100)
    doc.text(`Investidor: ${profile?.nome_completo || "Investidor"}`, 20, 30)
    doc.text(`Data de Emissão: ${new Date().toLocaleDateString("pt-PT")}`, 20, 37)
    doc.text(`Saldo Disponível: Kz ${saldo.toLocaleString("pt-PT")}`, 20, 44)
    const tableData = myInvestments.map(inv => [
      inv.name,
      inv.type,
      `Kz ${inv.value.toLocaleString("pt-PT")}`,
      inv.date,
      `${inv.return}%`,
      inv.status
    ])
    ;(doc as any).autoTable({
      startY: 55,
      head: [["Investimento", "Categoria", "Valor", "Data", "Retorno", "Status"]],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185] }
    })
    doc.save(`extrato-capital-seguro-${new Date().getTime()}.pdf`)
  }

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        setUserId(user.id)
        const [profileResponse, investmentsResponse] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).single(),
          supabase.from("inscricoes_investimentos").select("*, investimentos(*)").eq("usuario_id", user.id).order("data_inscricao", { ascending: false })
        ])
        const profileData = profileResponse.data
        if (profileResponse.error || !profileData) {
          setProfile({ id: user.id, email: user.email, nome_completo: "Investidor", saldo_disponivel: 0 })
          setSaldo(0)
        } else {
          setProfile(profileData)
          if (profileData.avatar_url) setAvatarUrl(profileData.avatar_url)
          setSaldo(Number(profileData.saldo_disponivel || 0))
        }
        if (investmentsResponse.data) {
          const formatted = investmentsResponse.data.map((inv: any) => ({
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
        console.error(err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    const loadFeaturedInvestments = async () => {
      const { data } = await supabase.from("investimentos").select("*").eq("colocacao", "destaque").eq("ativo", true).order("data_criacao", { ascending: false })
      if (data) {
        setFeaturedInvestmentsState(data.map((inv: any) => ({
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
        })))
      }
    }
    loadFeaturedInvestments()
  }, [])

  useEffect(() => {
    if (!userId) return
    const channel = supabase.channel(`public:profiles:id=eq.${userId}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${userId}` }, (payload) => {
        if (payload.new && "saldo_disponivel" in payload.new) setSaldo(Number(payload.new.saldo_disponivel || 0))
      }).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [userId])

  const calculateDailyReturn = () => myInvestments.reduce((total, inv) => total + calculateReturn(inv.value, inv.return || 50, Math.floor((new Date().getTime() - new Date(inv.dateISO).getTime()) / 86400000), inv.tipoJuros || "simples"), 0)

  const portfolioData = myInvestments.length > 0 
    ? Object.values(myInvestments.reduce((acc: any, inv: any) => {
        const cat = inv.type || "Outro"; acc[cat] = { name: cat, value: (acc[cat]?.value || 0) + inv.value }; return acc
      }, {})) : [{ name: "Sem investimentos", value: 0 }]

  const handleLogout = async () => { await supabase.auth.signOut(); navigate("/login") }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar className="border-border bg-card">
          <SidebarHeader className="border-border">
            <div className="flex items-center gap-2 px-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-lg font-bold">Capital Seguro</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {[
                { id: "visao-geral", label: "Visão Geral", icon: Home },
                { id: "meus-investimentos", label: "Meus Investimentos", icon: PieChart },
                { id: "explorar", label: "Explorar", icon: Search },
                { id: "perfil", label: "Perfil", icon: User },
                { id: "configuracoes", label: "Configurações", icon: Settings },
                { id: "notificacoes", label: "Notificações", icon: Bell }
              ].map(item => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton isActive={activeTab === item.id} onClick={() => setActiveTab(item.id)}>
                    <item.icon size={20} /> <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter><Button variant="outline" className="w-full" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" /> Sair</Button></SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8 bg-card/50 backdrop-blur-sm border border-border p-1 rounded-xl">
              {["visao-geral", "meus-investimentos", "extrato", "sacar", "historico", "explorar", "perfil", "notificacoes", "configuracoes"].map(tab => (
                <TabsTrigger key={tab} value={tab} className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all capitalize">
                  {tab.replace("-", " ")}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="visao-geral" className="space-y-8">
              {loading ? <DashboardSkeleton /> : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="hover:border-primary/20 transition-all shadow-sm">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Investido</CardTitle>
                        <Wallet className="h-4 w-4 text-primary" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">Kz {myInvestments.reduce((s, i) => s + i.value, 0).toLocaleString("pt-PT")}</div>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs text-primary font-semibold">+15% este ano</p>
                          <Button variant="ghost" size="sm" onClick={exportToPDF} className="h-7 text-[10px] gap-1"><Download className="h-3 w-3" /> PDF</Button>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="hover:border-accent/20 transition-all shadow-sm">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Retorno Acumulado</CardTitle>
                        <TrendingUp className="h-4 w-4 text-accent" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">Kz {calculateDailyReturn().toLocaleString("pt-PT", { maximumFractionDigits: 0 })}</div>
                        <p className="text-xs text-accent mt-1">Acumulado diariamente</p>
                      </CardContent>
                    </Card>
                    <Card className="hover:border-success/20 transition-all shadow-sm">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Disponível</CardTitle>
                        <Wallet className="h-4 w-4 text-success" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">Kz {saldo.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}</div>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs text-success font-semibold">Pronto para investir</p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setDepositOpen(true)}
                            className="h-7 text-[10px] gap-1 hover:text-success"
                          >
                            <PlusCircle className="h-3 w-3" />
                            Depositar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 shadow-sm">
                      <CardHeader><CardTitle>Investimentos Recentes</CardTitle></CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Valor</TableHead><TableHead>Data</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                          <TableBody>
                            {myInvestments.slice(0, 5).map(inv => (
                              <TableRow key={inv.id}>
                                <TableCell className="font-medium">{inv.name}</TableCell>
                                <TableCell>Kz {inv.value.toLocaleString("pt-PT")}</TableCell>
                                <TableCell>{inv.date}</TableCell>
                                <TableCell><Badge variant="outline" className="bg-success/10 text-success border-success/20">{inv.status}</Badge></TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                      <CardHeader><CardTitle>Distribuição</CardTitle></CardHeader>
                      <CardContent><InvestorPortfolioChart data={portfolioData as any} /></CardContent>
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>
            <TabsContent value="extrato"><ConsolidatedStatement /></TabsContent>
            <TabsContent value="sacar" className="py-8 flex justify-center"><WithdrawalForm onSuccess={() => location.reload()} /></TabsContent>
            <TabsContent value="historico"><TransactionHistory userId={userId} /></TabsContent>
            <TabsContent value="explorar"><InvestmentOptions /></TabsContent>
            <TabsContent value="perfil">
              <Card>
                <CardHeader><CardTitle>Perfil</CardTitle></CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-4">
                    <div><p className="text-sm text-muted-foreground">Nome</p><p className="text-lg font-medium">{profile?.nome_completo}</p></div>
                    <div><p className="text-sm text-muted-foreground">E-mail</p><p className="text-lg">{profile?.email}</p></div>
                    <Button variant="outline" onClick={() => setEditOpen(true)}>Editar Perfil</Button>
                  </div>
                  <div className="flex flex-col items-center">
                    <Avatar className="h-32 w-32 mb-4 border-2 border-primary">
                      <AvatarImage src={avatarUrl || ""} /><AvatarFallback>{profile?.nome_completo?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm" onClick={() => setAvatarOpen(true)}>Mudar Foto</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notificacoes"><NotificationsSection userId={userId} onUnreadCountChange={setUnreadNotifications} /></TabsContent>
            <TabsContent value="configuracoes">
              <Card><CardHeader><CardTitle>Segurança</CardTitle></CardHeader><CardContent className="space-y-4">
                <Button variant="outline" onClick={() => setShowChangePassword(true)}>Alterar Senha</Button>
                <Button variant="outline" onClick={() => setShow2FA(true)}>2FA</Button>
              </CardContent></Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <EditProfileModal open={editOpen} onOpenChange={setEditOpen} onSaved={setProfile} />
      <Questionnaire open={questionOpen} onOpenChange={setQuestionOpen} />
      <Dialog open={avatarOpen} onOpenChange={setAvatarOpen}><DialogContent><UploadAvatar onUpload={(url) => { setAvatarUrl(url); setAvatarOpen(false) }} /></DialogContent></Dialog>
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}><DialogContent><ChangePasswordForm onClose={() => setShowChangePassword(false)} onSuccess={() => setShowChangePassword(false)} /></DialogContent></Dialog>
      <Dialog open={show2FA} onOpenChange={setShow2FA}><DialogContent><TwoFactorAuthForm onClose={() => setShow2FA(false)} /></DialogContent></Dialog>
      <DepositModal open={depositOpen} onOpenChange={setDepositOpen} />
    </SidebarProvider>
  )
}

export default InvestorDashboard
