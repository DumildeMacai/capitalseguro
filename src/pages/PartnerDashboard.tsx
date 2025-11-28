import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, Building, FileCheck, LineChart, 
  LogOut, PlusCircle, Users, MessageCircle, Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Dados simulados para o painel
const mockData = {
  investmentsSummary: {
    totalOpportunities: 5,
    totalAmount: "AOA 15.000.000",
    totalInvestors: 28,
    avgReturn: "100%"
  },
  recentOpportunities: [
    {
      id: 1,
      title: "Edifício Comercial - Centro de Luanda",
      type: "Imóvel",
      status: "Ativo",
      target: "AOA 5.000.000",
      raised: "AOA 3.250.000",
      progress: 65,
      investors: 12
    },
    {
      id: 2,
      title: "Expansão da Rede Hoteleira",
      type: "Negócio",
      status: "Em aprovação",
      target: "AOA 2.500.000",
      raised: "AOA 0",
      progress: 0,
      investors: 0
    }
  ],
  notifications: [
    {
      id: 1,
      title: "Nova mensagem do administrador",
      description: "Sua última proposta foi aprovada e está publicada.",
      date: "Hoje, 14:32"
    },
    {
      id: 2,
      title: "Documentação pendente",
      description: "Por favor, atualize o seu certificado comercial.",
      date: "Ontem, 09:15"
    }
  ]
};

const PartnerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("visao-geral");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Sessão encerrada",
      description: "Encerrou sessão com sucesso.",
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Painel do Parceiro</h1>
          <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <Tabs defaultValue="visao-geral" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-4 md:grid-cols-5 lg:w-[600px]">
            <TabsTrigger value="visao-geral" className="text-sm">
              <BarChart3 className="h-4 w-4 mr-2" /> Visão Geral
            </TabsTrigger>
            <TabsTrigger value="oportunidades" className="text-sm">
              <Building className="h-4 w-4 mr-2" /> Oportunidades
            </TabsTrigger>
            <TabsTrigger value="documentos" className="text-sm">
              <FileCheck className="h-4 w-4 mr-2" /> Documentos
            </TabsTrigger>
            <TabsTrigger value="mensagens" className="text-sm">
              <MessageCircle className="h-4 w-4 mr-2" /> Mensagens
            </TabsTrigger>
            <TabsTrigger value="configuracoes" className="hidden md:flex text-sm">
              <Settings className="h-4 w-4 mr-2" /> Configurações
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="visao-geral" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total de Oportunidades</p>
                      <p className="text-2xl font-bold">{mockData.investmentsSummary.totalOpportunities}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                      <Building className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Capital Total</p>
                      <p className="text-2xl font-bold">{mockData.investmentsSummary.totalAmount}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <LineChart className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total de Investidores</p>
                      <p className="text-2xl font-bold">{mockData.investmentsSummary.totalInvestors}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Retorno Médio</p>
                      <p className="text-2xl font-bold">{mockData.investmentsSummary.avgReturn}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle>Oportunidades Recentes</CardTitle>
                <CardDescription>Suas oportunidades de investimento mais recentes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.recentOpportunities.map(opportunity => (
                    <div key={opportunity.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{opportunity.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{opportunity.type}</span>
                            <span className="block h-1 w-1 rounded-full bg-muted-foreground"></span>
                            <span className={`${opportunity.status === 'Ativo' ? 'text-green-600' : 'text-amber-600'}`}>
                              {opportunity.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{opportunity.target}</p>
                          <p className="text-sm text-muted-foreground">{opportunity.investors} investidores</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${opportunity.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center mt-1 text-xs">
                        <span>{opportunity.raised}</span>
                        <span>{opportunity.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end p-6 pt-0">
                <Button variant="outline" className="flex items-center">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nova Oportunidade
                </Button>
              </CardFooter>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>Atualizações importantes da plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.notifications.map(notification => (
                    <div key={notification.id} className="flex gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center shrink-0">
                        <MessageCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Placeholder content for other tabs */}
          <TabsContent value="oportunidades">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Oportunidades</CardTitle>
                <CardDescription>Crie e gerencie as suas oportunidades de investimento</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Esta área está em desenvolvimento. Aqui você poderá criar, editar e gerir todas as suas oportunidades de investimento.</p>
              </CardContent>
              <CardFooter>
                <Button className="flex items-center">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Criar Nova Oportunidade
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="documentos">
            <Card>
              <CardHeader>
                <CardTitle>Documentos</CardTitle>
                <CardDescription>Gerencie os seus documentos e certificações</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Esta área está em desenvolvimento. Aqui você poderá enviar e gerir todos os documentos necessários para validar a sua empresa na plataforma.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mensagens">
            <Card>
              <CardHeader>
                <CardTitle>Centro de Mensagens</CardTitle>
                <CardDescription>Comunique-se com a administração e seus investidores</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Esta área está em desenvolvimento. Aqui você poderá enviar e receber mensagens da administração da plataforma e responder a perguntas dos investidores.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuracoes">
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
                <CardDescription>Gerencie as configurações da sua conta</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Esta área está em desenvolvimento. Aqui você poderá alterar dados da sua empresa, configurações de conta e preferências de notificação.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PartnerDashboard;
