import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface InvestmentCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  returnRate: number;
  minInvestment: number;
  image: string;
  delay?: number;
  featured?: boolean;
  remaining?: number;
  totalFunding?: number;
}

const InvestmentCard = ({
  id,
  title,
  description,
  category,
  returnRate,
  minInvestment,
  image,
  delay = 0,
  featured = false,
  remaining,
  totalFunding,
}: InvestmentCardProps) => {
  const progress = remaining && totalFunding 
    ? ((totalFunding - remaining) / totalFunding) * 100
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={`relative overflow-hidden rounded-xl border ${
        featured ? "border-purple" : "border-border"
      } bg-card shadow-sm hover-scale card-hover`}
    >
      {featured && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-gradient-primary">Destaque</Badge>
        </div>
      )}
      
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-3 left-3">
          <Badge variant="secondary" className="bg-white/90 text-secondary font-medium">
            {category}
          </Badge>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 line-clamp-1">{title}</h3>
        <p className="text-muted-foreground mb-4 text-sm line-clamp-2">{description}</p>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Retorno Anual</p>
            <p className="text-xl font-bold text-success">{returnRate}%</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Investimento Mín.</p>
            <p className="text-xl font-semibold">Kz {minInvestment.toLocaleString('pt-PT')}</p>
          </div>
        </div>
        
        {progress !== null && (
          <div className="mb-4">
            <div className="flex justify-between mb-1 text-sm">
              <span>Progresso de captação</span>
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
                Kz {(totalFunding! - remaining!).toLocaleString('pt-PT')} arrecadado
              </span>
              <span>Kz {remaining!.toLocaleString('pt-PT')} restante</span>
            </div>
          </div>
        )}
        
        <Button asChild className="w-full bg-gradient-primary hover:opacity-90">
          <Link to={`/investments/${id}`}>Investir Agora</Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default InvestmentCard;
