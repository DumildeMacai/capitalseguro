import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Target, Users, TrendingUp, Award, HeartHandshake, Lightbulb, CheckCircle2, Building2, Globe } from "lucide-react";
import FeatureCard from "@/components/FeatureCard";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  const timeline = [
    {
      year: "2020",
      title: "Fundação",
      description: "Início da Capital Seguro com a visão de democratizar investimentos de qualidade."
    },
    {
      year: "2021",
      title: "Primeiros Investimentos",
      description: "Lançamento das primeiras oportunidades em imóveis e negócios locais."
    },
    {
      year: "2022",
      title: "Expansão",
      description: "Atingimos 500 investidores e 2M Kz em investimentos na plataforma."
    },
    {
      year: "2023",
      title: "Consolidação",
      description: "Ultrapassamos 1000 investidores ativos e lançamos novos produtos."
    },
    {
      year: "2024",
      title: "Liderança de Mercado",
      description: "Reconhecidos como uma das principais plataformas de investimento em Angola."
    }
  ];

  const team = [
    {
      name: "Carlos Silva",
      role: "CEO & Fundador",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      description: "15 anos de experiência em mercados financeiros"
    },
    {
      name: "Ana Santos",
      role: "Diretora de Investimentos",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      description: "Especialista em análise de investimentos e gestão de portfólio"
    },
    {
      name: "João Costa",
      role: "Diretor de Tecnologia",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      description: "Expert em fintech e desenvolvimento de plataformas"
    },
    {
      name: "Maria Fernandes",
      role: "Diretora de Relacionamento",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      description: "Focada em experiência do cliente e suporte"
    }
  ];

  const achievements = [
    { icon: <Building2 className="h-6 w-6" />, text: "Mais de 50 projetos financiados com sucesso" },
    { icon: <Users className="h-6 w-6" />, text: "Comunidade de 1000+ investidores satisfeitos" },
    { icon: <Globe className="h-6 w-6" />, text: "Presente em 3 províncias de Angola" },
    { icon: <Award className="h-6 w-6" />, text: "Prêmio de Inovação Financeira 2023" }
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

      {/* Timeline Section */}
      <section className="py-20 px-4 bg-secondary/5">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossa Jornada</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Do início modesto à plataforma de investimentos líder
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative pl-8 pb-12 border-l-2 border-primary/30 last:pb-0"
              >
                <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-primary -translate-x-[9px]" />
                <div className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-sm font-semibold text-primary mb-2">{item.year}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossa Equipe</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Profissionais experientes dedicados ao seu sucesso financeiro
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <Avatar className="h-24 w-24 mx-auto mb-4">
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                    <p className="text-sm text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 px-4 bg-secondary/5">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Conquistas</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Marcos importantes na nossa trajetória de sucesso
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <div className="text-white">{achievement.icon}</div>
                    </div>
                    <p className="font-medium">{achievement.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center mb-6">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Nossa Visão</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Ser a plataforma de investimentos mais confiável e inovadora de Angola, 
                    transformando a vida financeira de milhares de pessoas através de oportunidades 
                    acessíveis e rentáveis. Queremos criar um futuro onde todos tenham a possibilidade 
                    de construir riqueza de forma inteligente e segura.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center mb-6">
                    <Lightbulb className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Nossa Missão</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Democratizar o acesso a investimentos de qualidade, oferecendo uma plataforma 
                    transparente, segura e fácil de usar. Conectamos investidores a oportunidades 
                    sólidas, fornecemos educação financeira contínua e construímos uma comunidade 
                    engajada em crescimento mútuo e prosperidade.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
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
