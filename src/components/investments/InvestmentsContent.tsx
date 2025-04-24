
import { Investment, UserInvestment } from "@/types/investment";
import { PiggyBank } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvestmentsList from "@/components/InvestmentsList";
import MyInvestmentsList from "@/components/MyInvestmentsList";

interface InvestmentsContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filteredInvestments: Investment[];
  handleInvest: (id: string) => void;
  myInvestments: UserInvestment[];
}

const InvestmentsContent = ({
  activeTab,
  setActiveTab,
  filteredInvestments,
  handleInvest,
  myInvestments,
}: InvestmentsContentProps) => {
  return (
    <>
      <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab} className="mb-10">
        <TabsList className="mb-8">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="imóveis">Imóveis</TabsTrigger>
          <TabsTrigger value="empresas">Empresas</TabsTrigger>
          <TabsTrigger value="transporte">Transporte</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          {filteredInvestments.length > 0 ? (
            <InvestmentsList 
              investments={filteredInvestments} 
              onInvest={handleInvest} 
            />
          ) : (
            <div className="text-center py-10">
              <PiggyBank className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Nenhum investimento encontrado</h3>
              <p className="text-muted-foreground">
                Tente ajustar seus filtros ou pesquisar por outros termos.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {myInvestments.length > 0 && (
        <section className="mt-16">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Meus Investimentos</h2>
            <p className="text-muted-foreground">
              Acompanhe o desempenho dos seus investimentos ativos na plataforma.
            </p>
          </div>
          <MyInvestmentsList investments={myInvestments} />
        </section>
      )}
    </>
  );
};

export default InvestmentsContent;
