import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InvestorPortfolioChart from "./InvestorPortfolioChart";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, Building2, Percent, TrendingUp } from "lucide-react";

interface Stats {
  totalUsers: number;
  totalPartners: number;
  totalInvested: number;
  activeInvestments: number;
}

const AdminOverview = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalPartners: 0,
    totalInvested: 0,
    activeInvestments: 0,
  });
  const [investmentDistribution, setInvestmentDistribution] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Total Users (all profiles)
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Total Partners (profiles with empresa_nome)
      const { count: partnersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .not("empresa_nome", "is", null);

      // Total Invested (sum of all investments)
      const { data: inscricoes } = await supabase
        .from("inscricoes_investimentos")
        .select("valor_investido");

      const totalInvested = inscricoes?.reduce((sum, inv) => sum + (inv.valor_investido || 0), 0) || 0;

      // Active Investments
      const { count: activeInvsCount } = await supabase
        .from("investimentos")
        .select("*", { count: "exact", head: true })
        .eq("ativo", true);

      // Investment Distribution by Category
      const { data: investByCategory } = await supabase
        .from("investimentos")
        .select("categoria");

      const distribution = investByCategory?.reduce((acc: any, inv) => {
        const category = inv.categoria || "Outros";
        const existing = acc.find((item: any) => item.name === category);
        if (existing) {
          existing.value += 1;
        } else {
          acc.push({ name: category, value: 1 });
        }
        return acc;
      }, []) || [];

      setStats({
        totalUsers: usersCount || 0,
        totalPartners: partnersCount || 0,
        totalInvested,
        activeInvestments: activeInvsCount || 0,
      });

      setInvestmentDistribution(distribution);
    } catch (error: any) {
      console.error("Erro ao buscar estatísticas:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar estatísticas.",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "AOA",
    }).format(value);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-10 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Usuários</p>
              <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        {/* Total Partners */}
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Parceiros</p>
              <h3 className="text-2xl font-bold">{stats.totalPartners}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        {/* Total Invested */}
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Investido</p>
              <h3 className="text-lg font-bold">{formatCurrency(stats.totalInvested)}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        {/* Active Investments */}
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Investimentos Ativos</p>
              <h3 className="text-2xl font-bold">{stats.activeInvestments}</h3>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <Percent className="h-6 w-6 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Investimentos por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {investmentDistribution.length > 0 ? (
              <InvestorPortfolioChart data={investmentDistribution} />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Sem dados disponíveis
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo de Oportunidades</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex flex-col justify-center">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted rounded">
                <span className="font-medium">Investimentos Ativos</span>
                <span className="text-lg font-bold">{stats.activeInvestments}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded">
                <span className="font-medium">Total Investido</span>
                <span className="text-lg font-bold">{formatCurrency(stats.totalInvested)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded">
                <span className="font-medium">Usuários Cadastrados</span>
                <span className="text-lg font-bold">{stats.totalUsers}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded">
                <span className="font-medium">Parceiros</span>
                <span className="text-lg font-bold">{stats.totalPartners}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo de Atividades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start pb-4 border-b">
              <div className="rounded-full bg-primary/10 p-2 mr-4">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Usuários Cadastrados</p>
                <p className="text-sm text-muted-foreground">{stats.totalUsers} usuários na plataforma</p>
              </div>
            </div>
            <div className="flex items-start pb-4 border-b">
              <div className="rounded-full bg-blue-100 p-2 mr-4">
                <Building2 className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Parceiros</p>
                <p className="text-sm text-muted-foreground">{stats.totalPartners} parceiros na plataforma</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="rounded-full bg-green-100 p-2 mr-4">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Total Investido</p>
                <p className="text-sm text-muted-foreground">{formatCurrency(stats.totalInvested)} em investimentos</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
