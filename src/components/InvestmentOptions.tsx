import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvestmentCard from "./InvestmentCard";

const categories = [
  "Todos",
  "Imóveis",
  "Empresas",
  "Propriedades"
];

const investments = [
  {
    id: "real-estate-fund-1",
    title: "Premium Real Estate Fund",
    description: "Diversified portfolio of high-yield commercial properties in prime locations with stable rental income.",
    category: "Imóveis",
    returnRate: 50,
    minInvestment: 5000,
    remaining: 1250000,
    totalFunding: 5000000,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1773&q=80",
    featured: true
  },
  {
    id: "luxury-apartments-complex",
    title: "Luxury Apartment Complex",
    description: "High-end residential apartment complex in an emerging metropolitan area with strong rental demand.",
    category: "Propriedades",
    returnRate: 50,
    minInvestment: 10000,
    remaining: 750000,
    totalFunding: 3000000,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
  },
  {
    id: "tech-startup-expansion",
    title: "Tech Startup Expansion",
    description: "Rapidly growing technology company seeking capital for market expansion and product development.",
    category: "Empresas",
    returnRate: 50,
    minInvestment: 2500,
    remaining: 350000,
    totalFunding: 1000000,
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
  },
  {
    id: "commercial-plaza-development",
    title: "Commercial Plaza Development",
    description: "New commercial plaza development in high-traffic urban area with pre-signed lease agreements.",
    category: "Imóveis",
    returnRate: 50,
    minInvestment: 15000,
    remaining: 2000000,
    totalFunding: 6000000,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    featured: true
  },
  {
    id: "eco-resort-expansion",
    title: "Eco-Resort Expansion",
    description: "Established eco-resort expanding facilities and accommodations to meet growing sustainable tourism demand.",
    category: "Propriedades",
    returnRate: 50,
    minInvestment: 7500,
    remaining: 800000,
    totalFunding: 2500000,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
  },
  {
    id: "restaurant-chain-growth",
    title: "Restaurant Chain Growth",
    description: "Successful restaurant chain seeking funds for new locations across major cities.",
    category: "Empresas",
    returnRate: 50,
    minInvestment: 5000,
    remaining: 400000,
    totalFunding: 1500000,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1774&q=80"
  }
];

const InvestmentOptions = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  
  const filteredInvestments = activeCategory === "All" 
    ? investments 
    : investments.filter(inv => inv.category === activeCategory);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Oportunidades de Investimento</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore nossa variedade de oportunidades de investimento com alto potencial de retorno, apoiadas em ativos reais ou negócios consolidados.
          </p>
        </motion.div>
        
        <Tabs defaultValue="All" className="mb-12">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
              {categories.map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  onClick={() => setActiveCategory(category)}
                  className="text-sm md:text-base"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          <TabsContent value={activeCategory} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredInvestments.map((investment, index) => (
                <InvestmentCard
                  key={investment.id}
                  id={investment.id}
                  title={investment.title}
                  description={investment.description}
                  category={investment.category}
                  returnRate={investment.returnRate}
                  minInvestment={investment.minInvestment}
                  image={investment.image}
                  featured={investment.featured}
                  remaining={investment.remaining}
                  totalFunding={investment.totalFunding}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 font-medium">
            <Link to="/investments">Ver Todas as Oportunidades</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default InvestmentOptions;
