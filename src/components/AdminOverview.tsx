
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer } from "recharts";
import InvestorPortfolioChart from "./InvestorPortfolioChart";
import { Users, Building2, Percent, TrendingUp } from "lucide-react";

// Mock data for the dashboard
const mockStats = {
  totalInvestors: 248,
  totalPartners: 32,
  totalInvested: "R$ 1.245.890",
  avgReturn: "8.7%"
};

// Mock data for the charts
const investmentDistribution = [
  { name: "Imóveis", value: 450000 },
  { name: "Ações", value: 320000 },
  { name: "Startups", value: 215000 },
  { name: "Outros", value: 180000 }
];

const AdminOverview = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Investors */}
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Investidores</p>
              <h3 className="text-2xl font-bold">{mockStats.totalInvestors}</h3>
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
              <h3 className="text-2xl font-bold">{mockStats.totalPartners}</h3>
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
              <h3 className="text-2xl font-bold">{mockStats.totalInvested}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        {/* Avg Return */}
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Retorno Médio</p>
              <h3 className="text-2xl font-bold">{mockStats.avgReturn}</h3>
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
            <CardTitle>Distribuição de Investimentos</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <InvestorPortfolioChart data={investmentDistribution} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investimentos por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <InvestorPortfolioChart data={investmentDistribution} showBars={true} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start pb-4 border-b last:pb-0 last:border-0">
                <div className="rounded-full bg-primary/10 p-2 mr-4">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Novo investidor cadastrado</p>
                  <p className="text-sm text-muted-foreground">João Silva se registrou na plataforma</p>
                  <p className="text-xs text-muted-foreground mt-1">Há 2 horas</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
