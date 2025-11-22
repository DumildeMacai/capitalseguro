import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Target, Users, TrendingUp, Award, HeartHandshake } from "lucide-react";
import FeatureCard from "@/components/FeatureCard";
import { motion } from "framer-motion";

const About = () => {
  const values = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Segurança",
      description: "Protegemos seus investimentos com as melhores práticas de segurança e transparência total."
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Foco no Cliente",
      description: "Seu sucesso financeiro é nossa prioridade. Oferecemos suporte dedicado em cada etapa."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Comunidade",
      description: "Construímos uma comunidade de investidores que compartilham conhecimento e crescem juntos."
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Crescimento",
      description: "Focamos em oportunidades de alto potencial que geram retornos consistentes e sustentáveis."
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Excelência",
      description: "Selecionamos rigorosamente cada oportunidade para garantir qualidade e rentabilidade."
    },
    {
      icon: <HeartHandshake className="h-6 w-6" />,
      title: "Confiança",
      description: "Construímos relacionamentos duradouros baseados em transparência e integridade."
    }
  ];

  const stats = [
    { value: "5M+", label: "Investido na Plataforma" },
    { value: "1000+", label: "Investidores Ativos" },
    { value: "95%", label: "Taxa de Satisfação" },
    { value: "18%", label: "Retorno Médio Anual" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Sobre <span className="text-gradient">Capital Seguro</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Somos uma plataforma de investimentos inovadora que conecta investidores a oportunidades 
              de alto retorno, apoiadas por ativos reais e negócios locais sólidos.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-secondary/5">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Nossa Missão</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Democratizar o acesso a investimentos de qualidade, tornando oportunidades antes 
                restritas a grandes investidores acessíveis a todos.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                Acreditamos que todos merecem a chance de construir riqueza através de investimentos 
                inteligentes, seguros e transparentes.
              </p>
              <p className="text-lg text-muted-foreground">
                Nossa plataforma combina tecnologia de ponta com expertise em investimentos para 
                oferecer uma experiência única e resultados consistentes.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Investimentos em imóveis"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossos Valores</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Princípios que guiam cada decisão e ação na Capital Seguro
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <FeatureCard
                key={value.title}
                icon={value.icon}
                title={value.title}
                description={value.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-primary">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center text-white"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm md:text-base opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Nossa História</h2>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground">
                A Capital Seguro nasceu da visão de criar uma ponte entre investidores e oportunidades 
                reais de crescimento financeiro. Fundada em 2020, começamos com o objetivo simples: 
                tornar investimentos de qualidade acessíveis a todos.
              </p>
              
              <p className="text-lg text-muted-foreground">
                Desde então, crescemos para nos tornar uma das plataformas de investimento mais 
                confiáveis do mercado, conectando milhares de investidores a oportunidades em 
                imóveis, empresas locais e projetos de desenvolvimento.
              </p>
              
              <p className="text-lg text-muted-foreground">
                Nossa equipe é composta por profissionais experientes em finanças, tecnologia e 
                desenvolvimento imobiliário, todos comprometidos em oferecer a melhor experiência 
                de investimento possível.
              </p>
              
              <p className="text-lg text-muted-foreground">
                Hoje, com mais de 5 milhões de kwanzas investidos através da nossa plataforma e 
                uma taxa de satisfação de 95%, continuamos crescendo e inovando para servir melhor 
                nossa comunidade de investidores.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-secondary/5">
        <div className="container mx-auto text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para Começar sua Jornada de Investimentos?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Junte-se a milhares de investidores que já estão construindo seu futuro financeiro conosco.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/login"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-full bg-gradient-primary text-white hover:opacity-90 transition-opacity"
              >
                Criar Conta Grátis
              </a>
              <a
                href="/investments"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-full border-2 border-primary text-primary hover:bg-primary/10 transition-colors"
              >
                Ver Oportunidades
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
