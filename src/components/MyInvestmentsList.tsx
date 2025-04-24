
import { motion } from "framer-motion";
import { UserInvestment } from "@/types/investment";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface MyInvestmentsListProps {
  investments: UserInvestment[];
}

const MyInvestmentsList = ({ investments }: MyInvestmentsListProps) => {
  // Função para calcular dias restantes
  const calculateDaysLeft = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Função para formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-AO', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {investments.map((investment, index) => {
        const daysLeft = calculateDaysLeft(investment.endDate);
        const gain = investment.currentValue - investment.amountInvested;
        const gainPercentage = (gain / investment.amountInvested) * 100;
        
        return (
          <motion.div
            key={investment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex gap-2 items-center">
                      {investment.icon}
                      {investment.title}
                    </CardTitle>
                    <CardDescription>{investment.category}</CardDescription>
                  </div>
                  <Badge 
                    variant={
                      investment.status === "Ativo" ? "success" : 
                      investment.status === "Aguardando" ? "warning" : "secondary"
                    }
                  >
                    {investment.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="py-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Investido</p>
                      <p className="text-lg font-semibold">
                        AOA {investment.amountInvested.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Valor Atual</p>
                      <p className="text-lg font-semibold text-success">
                        AOA {investment.currentValue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm">Ganho</p>
                      <p className="text-sm font-medium text-success">
                        +AOA {gain.toLocaleString()} ({gainPercentage.toFixed(2)}%)
                      </p>
                    </div>
                    <Progress value={investment.progress} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Data Inicial</p>
                      <p className="text-sm font-medium">{formatDate(investment.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Data Final</p>
                      <p className="text-sm font-medium">{formatDate(investment.endDate)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Dias Restantes</p>
                    <p className="text-md font-semibold">{daysLeft} dias até o resgate</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Ver Detalhes
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MyInvestmentsList;
