import { motion } from "framer-motion";
import { Wallet, TrendingUp, Building2, BookOpen, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { calculateReturn } from "@/utils/interestCalculations";

const investmentTypes = [
  {
    id: "obrigações",
    title: "Obrigações (Bonds)",
    tabLabel: "Obrigações",
    description: "Títulos de dívida pública ou corporativa com juros fixos.",
    icon: Wallet,
    color: "bg-blue-500",
    details: "As obrigações são empréstimos que você faz a uma entidade (governo ou empresa) em troca de juros regulares.",
    category: "Renda Fixa",
    rate: 50,
    defaultType: "simples" as const
  },
  {
    id: "fundos_investimento",
    title: "Fundos de Investimento",
    tabLabel: "Fundos",
    description: "Carteiras coletivas geridas por profissionais experientes.",
    icon: TrendingUp,
    color: "bg-green-500",
    details: "Diversificação automática em ações, títulos e outros ativos com gestão profissional.",
    category: "Multimercado",
    rate: 50,
    defaultType: "composto" as const
  },
  {
    id: "fundos_imobiliarios",
    title: "Fundos Imobiliários (FIIs)",
    tabLabel: "FIIs",
    description: "Investimento em imóveis comerciais e residenciais.",
    icon: Building2,
    color: "bg-orange-500",
    details: "Receba rendimentos mensais provenientes de aluguéis sem precisar comprar um imóvel físico.",
    category: "Renda Passiva",
    rate: 50,
    defaultType: "composto" as const
  }
];

const educationalContent = {
  obrigações: [
    { title: "💵 O que são Obrigações?", content: "São títulos de dívida emitidos por empresas ou governos quando precisam captar recursos." },
    { title: "⚙️ Como funcionam?", content: "Você empresta dinheiro e recebe juros (cupões) periódicos até o vencimento do título." },
    { title: "📊 Exemplo", content: "Um título de 1.000 Kz com 50% de juros ao ano rende 500 Kz anuais ao investidor." }
  ],
  fundos_investimento: [
    { title: "📈 O que são?", content: "Carteiras coletivas onde vários investidores aplicam juntos para acessar diversos mercados." },
    { title: "⚙️ Como funcionam?", content: "Um gestor profissional decide onde investir o capital do grupo buscando a melhor rentabilidade." },
    { title: "🏷️ Tipos", content: "Existem fundos de Ações, Multimercado, Renda Fixa e Cambiais, para cada perfil de risco." }
  ],
  fundos_imobiliarios: [
    { title: "🏢 O que são?", content: "Fundos que investem em shoppings, galpões logísticos, escritórios e outros imóveis." },
    { title: "⚙️ Como funcionam?", content: "Você compra cotas do fundo e recebe aluguéis mensais (dividendos) proporcionalmente." },
    { title: "💰 Vantagens", content: "Renda passiva mensal, isenção de impostos em dividendos (dependendo da região) e alta liquidez." }
  ]
};

const InvestmentOptions = () => {
  const [activeTab, setActiveTab] = useState("obrigações");
  const [simValue, setSimValue] = useState(100000);
  const [simMonths, setSimMonths] = useState(12);
  const [interestType, setInterestType] = useState<"simples" | "composto">("simples");

  const calculateSim = () => {
    const type = investmentTypes.find(t => t.id === activeTab);
    const rate = type?.rate || 50;
    const days = simMonths * 30; // Aproximação de dias
    return calculateReturn(simValue, rate, days, interestType).toFixed(2);
  };

  return (
    <section className="py-20 bg-background/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Modalidades de Investimento</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Escolha a modalidade que melhor se adapta ao seu perfil e objetivos financeiros.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => {
          setActiveTab(v);
          const type = investmentTypes.find(t => t.id === v);
          if (type) setInterestType(type.defaultType);
        }} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            {investmentTypes.map((type) => (
              <TabsTrigger key={type.id} value={type.id} className="flex gap-2 items-center">
                <type.icon className="w-4 h-4 hidden sm:block" />
                <span className="text-xs sm:text-sm">{type.tabLabel}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {investmentTypes.map((type) => (
            <TabsContent key={type.id} value={type.id} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Educational Content */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="text-primary w-5 h-5" />
                    <h3 className="text-xl font-semibold">Conteúdo Educativo</h3>
                  </div>
                  {educationalContent[type.id as keyof typeof educationalContent].map((item, i) => (
                    <Card key={i}>
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-base">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-4">
                        <p className="text-sm text-muted-foreground">{item.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Simulator Card */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Calculator className="text-primary w-5 h-5" />
                      <CardTitle>Simulador de {type.title.split(' ')[0]}</CardTitle>
                    </div>
                    <CardDescription>Estime seus ganhos potenciais (50% a.a.)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Valor do Investimento (Kz)</Label>
                      <Input 
                        type="number" 
                        value={simValue} 
                        onChange={(e) => setSimValue(Number(e.target.value))} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Prazo (Meses)</Label>
                      <Input 
                        type="number" 
                        value={simMonths} 
                        onChange={(e) => setSimMonths(Number(e.target.value))} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo de Juros</Label>
                      <div className="flex gap-2">
                        <Button 
                          variant={interestType === "simples" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setInterestType("simples")}
                          className="flex-1"
                        >
                          Simples
                        </Button>
                        <Button 
                          variant={interestType === "composto" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setInterestType("composto")}
                          className="flex-1"
                        >
                          Composto
                        </Button>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-primary/10">
                      <p className="text-sm text-muted-foreground">Retorno Estimado:</p>
                      <p className="text-3xl font-bold text-primary">Kz {Number(calculateSim()).toLocaleString("pt-PT")}</p>
                      <p className="text-sm font-semibold text-primary/80">Total Final: Kz {(simValue + Number(calculateSim())).toLocaleString("pt-PT")}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        * Simulação baseada na taxa fixa de 50% ao ano oferecida pela Capital Seguro.
                      </p>
                    </div>
                    <Button className="w-full mt-4" variant="default" asChild>
                      <Link to="/investments" data-testid="button-start-investing">Começar a Investir</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default InvestmentOptions;
