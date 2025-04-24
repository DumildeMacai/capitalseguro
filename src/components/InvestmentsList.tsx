
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Investment } from "@/types/investment";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface InvestmentsListProps {
  investments: Investment[];
  onInvest: (id: string) => void;
  className?: string;
}

const InvestmentsList = ({ investments, onInvest, className }: InvestmentsListProps) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", className)}>
      {investments.map((investment, index) => {
        const progress = ((investment.totalFunding - investment.remaining) / investment.totalFunding) * 100;
        
        return (
          <motion.div
            key={investment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative overflow-hidden rounded-xl border ${
              investment.featured ? "border-purple" : "border-border"
            } bg-card shadow-sm hover-scale card-hover`}
          >
            {investment.featured && (
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-gradient-primary">Em Destaque</Badge>
              </div>
            )}
            
            <div className="relative h-48 overflow-hidden">
              <img 
                src={investment.image} 
                alt={investment.title} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-3 left-3 flex gap-2">
                <Badge variant="secondary" className="bg-white/90 text-secondary font-medium flex items-center gap-1">
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
                  className="bg-opacity-90"
                >
                  Risco {investment.risk}
                </Badge>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 line-clamp-1">{investment.title}</h3>
              <p className="text-muted-foreground mb-4 text-sm line-clamp-2">{investment.description}</p>
              
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Retorno Anual</p>
                  <p className="text-xl font-bold text-success">{investment.returnRate}%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Investimento Mínimo</p>
                  <p className="text-xl font-semibold">AOA {investment.minInvestment.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between mb-1 text-sm">
                  <span>Progresso</span>
                  <span className="font-medium">{progress.toFixed(0)}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-primary rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>
                    AOA {(investment.totalFunding - investment.remaining).toLocaleString()} captados
                  </span>
                  <span>AOA {investment.remaining.toLocaleString()} restantes</span>
                </div>
              </div>
              
              <Button 
                asChild
                className="w-full bg-gradient-primary hover:opacity-90"
                onClick={() => onInvest(investment.id)}
              >
                <Link to={`/investments/${investment.id}`}>Investir Agora</Link>
              </Button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default InvestmentsList;
