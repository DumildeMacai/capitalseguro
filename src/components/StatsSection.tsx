"use client"

import { motion } from "framer-motion"

const StatsSection = () => {
  const stats = [
    {
      value: "5M+",
      label: "Já Investido",
      description: "Capital gerido com sucesso",
    },
    {
      value: "1000+",
      label: "Investidores Ativos",
      description: "Comunidade em crescimento",
    },
    {
      value: "95%",
      label: "Satisfação",
      description: "Taxa de retenção de clientes",
    },
    {
      value: "18%",
      label: "Retorno Médio",
      description: "Competitivo e realista",
    },
  ]

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Números que Falam</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Confie em dados reais. A Capital Seguro tem um histórico comprovado de excelência e transparência.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl blur group-hover:blur-md group-hover:from-primary/20 transition-all duration-300"></div>
              <div className="relative bg-card/80 backdrop-blur rounded-xl p-8 border border-border group-hover:border-primary/50 transition-all">
                <h3 className="text-4xl md:text-5xl font-bold mb-2 text-primary">{stat.value}</h3>
                <p className="text-lg font-semibold text-foreground mb-2">{stat.label}</p>
                <p className="text-muted-foreground">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection
