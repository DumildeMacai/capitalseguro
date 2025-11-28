import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="min-h-screen pt-28 pb-20 overflow-hidden relative">
      {/* Background gradient */}
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-purple/5 to-transparent -z-10" />
      
      {/* Animated circles */}
      <div className="absolute top-[20%] right-[10%] h-64 w-64 rounded-full bg-purple/10 blur-3xl -z-10" />
      <div className="absolute bottom-[20%] left-[10%] h-64 w-64 rounded-full bg-gold/10 blur-3xl -z-10" />
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start"
          >
            <span className="inline-flex items-center rounded-full border border-purple/30 bg-purple/10 px-3 py-1 text-sm font-medium text-purple mb-6">
              Retornos Anuais de 100%
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              <span className="text-gradient">À Prova de Futuro</span> da sua Riqueza com Rendimento Passivo
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg">
              Invista em oportunidades de alto rendimento com a Capital Seguro. Obtenha rendimento passivo com retornos anuais de 100% e transforme o seu futuro financeiro.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 font-medium">
                <Link to="/login?register=true">Comece a Investir Agora</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-medium">
                <Link to="/investments">Explorar Oportunidades</Link>
              </Button>
            </div>
            
            <div className="flex items-center gap-4 mt-10">
              <div className="flex -space-x-2">
                <img 
                  src="https://randomuser.me/api/portraits/women/79.jpg" 
                  alt="Utilizador" 
                  className="h-10 w-10 rounded-full border-2 border-background"
                />
                <img 
                  src="https://randomuser.me/api/portraits/men/52.jpg" 
                  alt="Utilizador" 
                  className="h-10 w-10 rounded-full border-2 border-background"
                />
                <img 
                  src="https://randomuser.me/api/portraits/women/67.jpg" 
                  alt="Utilizador" 
                  className="h-10 w-10 rounded-full border-2 border-background"
                />
                <img 
                  src="https://randomuser.me/api/portraits/men/5.jpg" 
                  alt="Utilizador" 
                  className="h-10 w-10 rounded-full border-2 border-background"
                />
              </div>
              <div>
                <p className="font-semibold">Confiado por mais de 10.000 investidores</p>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1 text-sm font-medium">4.9/5</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10">
              <div className="rounded-2xl overflow-hidden border border-border bg-card card-shadow p-1">
                <div className="rounded-xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1742&q=80" 
                    alt="Painel de Investimentos" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
              
              {/* Floating stats card */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-navy p-4 rounded-xl shadow-lg border border-border card-shadow">
                <h4 className="font-semibold mb-2">Os Seus Investimentos</h4>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Retornos Totais</p>
                    <p className="text-lg font-bold text-success">+100%</p>
                  </div>
                </div>
              </div>
              
              {/* Floating ROI card */}
              <div className="absolute -top-6 -right-6 bg-white dark:bg-navy p-4 rounded-xl shadow-lg border border-border card-shadow">
                <h4 className="font-semibold mb-2">ROI Anual</h4>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Taxa Anual</p>
                    <p className="text-lg font-bold text-gold">100%</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full border border-purple/20 -z-10" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] rounded-full border border-purple/10 -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
