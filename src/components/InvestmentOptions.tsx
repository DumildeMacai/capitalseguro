import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const InvestmentOptions = () => {

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Oportunidades de Investimento</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Explore nossa variedade de oportunidades de investimento com alto potencial de retorno, apoiadas em ativos reais ou negócios consolidados.
          </p>
          <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 font-medium">
            <Link to="/investments">Ver Todas as Oportunidades</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default InvestmentOptions;
