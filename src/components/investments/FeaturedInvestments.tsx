import { motion } from "framer-motion";
import { Investment } from "@/types/investment";
import InvestmentsList from "@/components/InvestmentsList";

interface FeaturedInvestmentsProps {
  investments: Investment[];
  onInvest: (id: string) => void;
}

const FeaturedInvestments = ({ investments, onInvest }: FeaturedInvestmentsProps) => {
  return (
    <section className="mt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Investimentos em Destaque</h2>
        <p className="text-muted-foreground">Oportunidades selecionadas com alto potencial de retorno.</p>
      </motion.div>
      
      <InvestmentsList 
        investments={investments} 
        onInvest={onInvest} 
        className="grid-cols-1 md:grid-cols-2" 
      />
    </section>
  );
};

export default FeaturedInvestments;
