
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const PartnerDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Painel do Parceiro</h1>
      <div className="grid gap-6">
        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Bem-vindo, Parceiro!</h2>
          <p className="text-muted-foreground mb-4">
            Gerencie seus projetos e acompanhe os investimentos recebidos.
          </p>
          <Button onClick={handleLogout} variant="outline">
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
