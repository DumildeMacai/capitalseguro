import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Chart from "@/components/Chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock data - 50% annual return
  const investmentSummary = {
    totalInvested: 50000,
    currentValue: 75000, // 50000 + 50% = 75000
    totalReturns: 25000, // 50% of 50000
    returnsPercentage: 50,
    timeUntilWithdrawal: 182, // days remaining
  };
  
  const investmentData = [
    {
      id: "inv-001",
      name: "Premium Real Estate Fund",
      amount: 20000,
      currentValue: 30000, // 20000 + 50% = 30000
      returnRate: 50,
      category: "Real Estate",
      maturityDate: "2023-12-15",
      progress: 75,
    },
    {
      id: "inv-002",
      name: "Tech Startup Growth",
      amount: 15000,
      currentValue: 22500, // 15000 + 50% = 22500
      returnRate: 50,
      category: "Business",
      maturityDate: "2023-11-20",
      progress: 60,
    },
    {
      id: "inv-003",
      name: "Luxury Apartment Complex",
      amount: 15000,
      currentValue: 22500, // 15000 + 50% = 22500
      returnRate: 50,
      category: "Properties",
      maturityDate: "2024-01-10",
      progress: 45,
    },
  ];
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNewInvestment = () => navigate('/investments');
  const handleAddFunds = () => navigate('/investidor');
  const handleExport = () => {
    // Simple CSV export of investmentData
    const headers = ['Investimento','Valor','Valor Atual','Taxa de Retorno','Categoria'];
    const rows = investmentData.map(i => [i.name, i.amount, i.currentValue, i.returnRate, i.category]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'investments.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Exportado', description: 'Resumo de investimentos exportado como CSV.' });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between h-16 px-4">
              <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary">
                <span className="text-white text-sm font-bold">CS</span>
              </span>
              <span className="font-semibold">Capital Seguro</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link to="/dashboard" className="font-medium text-purple">Dashboard</Link>
              <Link to="/investments" className="text-muted-foreground hover:text-foreground transition-colors">Investments</Link>
              <Link to="/portfolio" className="text-muted-foreground hover:text-foreground transition-colors">Portfolio</Link>
              <Link to="/transactions" className="text-muted-foreground hover:text-foreground transition-colors">Transactions</Link>
              <Link to="/support" className="text-muted-foreground hover:text-foreground transition-colors">Support</Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              Exportar
            </Button>
            <Button variant="outline" size="sm" onClick={handleNewInvestment}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              Novo Investimento
            </Button>

            <Button className="bg-gradient-primary hover:opacity-90" size="sm" onClick={handleAddFunds}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              Adicionar Fundos
            </Button>

            <Avatar>
              <AvatarImage src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      
      <main className="container px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
              <h1 className="text-3xl font-bold">Painel</h1>
            <p className="text-muted-foreground">Bem-vindo de volta, John. Aqui está o resumo dos seus investimentos.</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Button variant="outline">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              Exportar
            </Button>
            <Button className="bg-gradient-primary hover:opacity-90">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              Adicionar Fundos
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3 mb-8">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Investido</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-lg font-semibold">Crescimento do Investimento</h3>
                  <p className="text-xs text-muted-foreground mt-1">Em {investmentData.length} investimentos</p>
                </CardContent>
              </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Valor Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Kz {investmentSummary.currentValue.toLocaleString('pt-PT')}</div>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-success font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="m18 15-6-6-6 6" />
                    </svg>
                    {investmentSummary.returnsPercentage}% de crescimento
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Retornos Totais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">+Kz {investmentSummary.totalReturns.toLocaleString('pt-PT')}</div>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-muted-foreground">
                    Próximo resgate disponível em {Math.floor(investmentSummary.timeUntilWithdrawal / 30)} meses
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="md:col-span-2"
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Investment Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart />
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card>
                <CardHeader className="pb-2">
                <CardTitle>Alocação de Investimentos</CardTitle>
                </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investmentData.map((investment) => (
                    <div key={investment.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{investment.name}</span>
                        <span className="text-sm font-medium">Kz {investment.amount.toLocaleString('pt-PT')}</span>
                      </div>
                      <Progress value={investment.progress} className="h-2" />
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{investment.category}</span>
                        <span>{investment.progress}% of term complete</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        <Tabs defaultValue="overview" onValueChange={setActiveTab} className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="active">Active Investments</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Your Investments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-4 font-medium">Investimento</th>
                          <th className="text-left p-4 font-medium">Valor</th>
                          <th className="text-left p-4 font-medium">Valor Atual</th>
                          <th className="text-left p-4 font-medium">Taxa de Retorno</th>
                          <th className="text-left p-4 font-medium">Status</th>
                          <th className="text-left p-4 font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {investmentData.map((investment) => (
                          <tr key={investment.id} className="border-t">
                            <td className="p-4">
                              <div className="font-medium">{investment.name}</div>
                              <div className="text-sm text-muted-foreground">{investment.category}</div>
                            </td>
                            <td className="p-4">Kz {investment.amount.toLocaleString('pt-PT')}</td>
                            <td className="p-4">Kz {investment.currentValue.toLocaleString('pt-PT')}</td>
                            <td className="p-4 text-success">+{investment.returnRate}%</td>
                            <td className="p-4">
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                Active
                              </span>
                            </td>
                            <td className="p-4">
                              <Button variant="outline" size="sm">Ver</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="active">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Active Investments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-4 font-medium">Investimento</th>
                          <th className="text-left p-4 font-medium">Valor</th>
                          <th className="text-left p-4 font-medium">Data de Vencimento</th>
                          <th className="text-left p-4 font-medium">Progresso</th>
                          <th className="text-left p-4 font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {investmentData.map((investment) => (
                          <tr key={investment.id} className="border-t">
                            <td className="p-4">
                              <div className="font-medium">{investment.name}</div>
                              <div className="text-sm text-muted-foreground">{investment.category}</div>
                            </td>
                            <td className="p-4">Kz {investment.amount.toLocaleString('pt-PT')}</td>
                            <td className="p-4">{new Date(investment.maturityDate).toLocaleDateString()}</td>
                            <td className="p-4 w-32">
                              <div className="flex items-center gap-2">
                                <Progress value={investment.progress} className="h-2" />
                                <span className="text-xs font-medium">{investment.progress}%</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">Detalhes</Button>
                                <Button variant="ghost" size="sm" className="text-purple">Adicionar Mais</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="history">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Investment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-8">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-muted-foreground">
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <line x1="2" x2="22" y1="10" y2="10" />
                    </svg>
                    <h3 className="text-lg font-medium mb-2">No completed investments yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Your investment history will appear here once you've completed your first investment term.
                    </p>
                    <Button className="bg-gradient-primary hover:opacity-90">
                      Explorar Oportunidades de Investimento
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card className="bg-gradient-primary text-white">
            <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">Ready to expand your portfolio?</h3>
                <p className="opacity-90 max-w-md">
                  Discover new investment opportunities with 50% annual returns. Grow your wealth faster with Capital Seguro.
                </p>
              </div>
              <Button size="lg" className="min-w-[180px] bg-white text-purple-dark hover:bg-white/90">
                Investir Agora
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
