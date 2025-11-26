import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Facebook, Instagram, Linkedin, Youtube, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Mensagem enviada!",
      description: "Entraremos em contato em breve. Obrigado!"
    });
    
    setFormData({ name: "", email: "", phone: "", subject: "", category: "", message: "" });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      content: "suporte@capitalseguro.com",
      description: "Responderemos em até 24 horas"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Telefone",
      content: "+244 923 456 789",
      description: "Seg-Sex: 9h às 18h"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Endereço",
      content: "Rua Principal, Luanda, Angola",
      description: "Visite nosso escritório"
    }
  ];

  const departments = [
    {
      title: "Suporte ao Investidor",
      email: "suporte@capitalseguro.com",
      phone: "+244 923 456 789",
      description: "Dúvidas sobre investimentos e sua conta"
    },
    {
      title: "Parcerias Comerciais",
      email: "parcerias@capitalseguro.com",
      phone: "+244 923 456 790",
      description: "Oportunidades de negócios e colaboração"
    },
    {
      title: "Departamento Jurídico",
      email: "juridico@capitalseguro.com",
      phone: "+244 923 456 791",
      description: "Questões legais e contratuais"
    },
    {
      title: "Imprensa",
      email: "imprensa@capitalseguro.com",
      phone: "+244 923 456 792",
      description: "Consultas de mídia e comunicação"
    }
  ];

  const faqs = [
    {
      question: "Qual o investimento mínimo?",
      answer: "O investimento mínimo varia por oportunidade, geralmente a partir de 5.000 Kz. Algumas oportunidades podem ter valores mínimos diferentes dependendo do tipo de ativo e estrutura do investimento."
    },
    {
      question: "Como funciona o processo de investimento?",
      answer: "Após criar sua conta e completar o processo de verificação, você pode explorar oportunidades disponíveis, analisar os detalhes de cada investimento, e fazer sua aplicação diretamente pela plataforma através de transferência bancária ou outros meios de pagamento aceitos."
    },
    {
      question: "Quando recebo os retornos?",
      answer: "Os retornos são pagos de acordo com o tipo de investimento. Investimentos em renda fixa pagam mensalmente, enquanto outros podem ter pagamentos trimestrais, semestrais ou no vencimento. Todas as informações sobre pagamento estão detalhadas na página de cada oportunidade."
    },
    {
      question: "Como posso acompanhar meus investimentos?",
      answer: "Você pode acompanhar todos os seus investimentos através do painel do investidor em sua conta. Lá você encontra relatórios detalhados, histórico de transações e projeções de retorno."
    },
    {
      question: "É seguro investir pela Capital Seguro?",
      answer: "Sim! Utilizamos tecnologia de criptografia avançada, seguimos normas de segurança bancária e todos os investimentos são registrados legalmente. Além disso, fazemos due diligence rigorosa em todas as oportunidades oferecidas."
    },
    {
      question: "Posso retirar meu dinheiro a qualquer momento?",
      answer: "Cada investimento tem seu próprio período de carência e condições de liquidez. Investimentos de curto prazo geralmente têm maior liquidez, enquanto projetos de longo prazo podem ter períodos de lock-up. Consulte os termos específicos de cada oportunidade."
    }
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
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Entre em <span className="text-gradient">Contato</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Estamos aqui para ajudar. Entre em contato conosco e responderemos o mais rápido possível.
            </p>
          </motion.div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                      <div className="text-white">{info.icon}</div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
                    <p className="text-foreground font-medium mb-1">{info.content}</p>
                    <p className="text-sm text-muted-foreground">{info.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contact Form and Additional Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Envie-nos uma Mensagem
                  </CardTitle>
                  <CardDescription>
                    Preencha o formulário abaixo e entraremos em contato em breve
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Nome Completo *
                        </label>
                        <Input
                          id="name"
                          placeholder="Seu nome"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email *
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium">
                          Telefone
                        </label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+244 923 456 789"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="category" className="text-sm font-medium">
                          Categoria *
                        </label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                          required
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="investimento">Dúvidas sobre Investimento</SelectItem>
                            <SelectItem value="conta">Problemas com Conta</SelectItem>
                            <SelectItem value="parceria">Oportunidade de Parceria</SelectItem>
                            <SelectItem value="suporte">Suporte Técnico</SelectItem>
                            <SelectItem value="outro">Outro Assunto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Assunto *
                      </label>
                      <Input
                        id="subject"
                        placeholder="Como podemos ajudar?"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Mensagem *
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Descreva sua dúvida ou solicitação em detalhes..."
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Enviando..."
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Enviar Mensagem
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Office Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5" />
                    Horário de Atendimento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Segunda - Sexta</span>
                    <span className="font-medium">9h - 18h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sábado</span>
                    <span className="font-medium">9h - 13h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Domingo</span>
                    <span className="font-medium">Fechado</span>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Redes Sociais</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Siga-nos nas redes sociais para novidades e dicas de investimento
                  </p>
                  <div className="flex gap-3">
                    <a
                      href="#"
                      className="h-10 w-10 flex items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-white transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                    <a
                      href="#"
                      className="h-10 w-10 flex items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-white transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-4 w-4" />
                    </a>
                    <a
                      href="#"
                      className="h-10 w-10 flex items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-white transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                    <a
                      href="#"
                      className="h-10 w-10 flex items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-white transition-colors"
                      aria-label="Youtube"
                    >
                      <Youtube className="h-4 w-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-20 px-4 bg-secondary/5">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossos Departamentos</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Entre em contato direto com o departamento que pode ajudá-lo melhor
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept, index) => (
              <motion.div
                key={dept.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-bold mb-3">{dept.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{dept.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                        <a href={`mailto:${dept.email}`} className="hover:text-primary transition-colors break-all">
                          {dept.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                        <a href={`tel:${dept.phone}`} className="hover:text-primary transition-colors">
                          {dept.phone}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Perguntas Frequentes</h2>
            <p className="text-lg text-muted-foreground">
              Encontre respostas rápidas para as dúvidas mais comuns
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <div className="mt-6 pt-6 border-t text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Não encontrou sua resposta?
                  </p>
                  <Button variant="outline" asChild>
                    <a href="#contact-form">Entre em Contato Conosco</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 px-4 bg-secondary/5">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Visite Nosso Escritório</h2>
            <p className="text-lg text-muted-foreground">
              Rua Principal, Luanda, Angola
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="aspect-video rounded-2xl overflow-hidden shadow-xl"
          >
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Mapa de localização</p>
                <p className="text-sm text-muted-foreground mt-2">Rua Principal, Luanda, Angola</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
