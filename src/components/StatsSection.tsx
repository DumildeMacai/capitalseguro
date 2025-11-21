
import { motion } from "framer-motion";

const StatsSection = () => {
  const stats = [
    {
      value: "50%",
      label: "Annual Return",
      description: "Fixed return on all investments"
    },
    {
      value: "$25M+",
      label: "Assets Under Management",
      description: "From investors worldwide"
    },
    {
      value: "10K+",
      label: "Active Investors",
      description: "Building wealth with us"
    },
    {
      value: "100%",
      label: "Investor Satisfaction",
      description: "Reliable passive income"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Nosso histórico fala por si</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A Capital Seguro tem consistentemente entregue retornos excepcionais aos investidores, construindo uma reputação
            de confiabilidade e excelência na geração de rendimento passivo.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-xl p-6 text-center border border-border card-shadow hover-scale"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-primary mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                {index + 1}
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</h3>
              <p className="text-lg font-semibold text-purple mb-2">{stat.label}</p>
              <p className="text-muted-foreground">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
