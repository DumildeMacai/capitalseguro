import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, UserCheck, Building, BarChart3, Settings, LogOut, 
  Bell, Wallet
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminOverview from "@/components/AdminOverview";
import AdminInvestors from "@/components/AdminInvestors";
import AdminPartners from "@/components/AdminPartners";
import AdminInvestments from "@/components/AdminInvestments";
import AdminUsers from "@/components/AdminUsers";
import AdminDeposits from "@/components/AdminDeposits";
import { useAuth } from "@/contexts/AuthContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const { signOut } = useAuth();

  const tabs = [
    { id: "overview", label: "Visão Geral", icon: BarChart3 },
    { id: "deposits", label: "Depósitos", icon: Wallet },
    { id: "investors", label: "Investidores", icon: UserCheck },
    { id: "partners", label: "Parceiros", icon: Users },
    { id: "investments", label: "Investimentos", icon: Building },
    { id: "users", label: "Usuários", icon: Users },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">
            {activeTab === "overview" && "Painel Administrativo"}
            {activeTab === "deposits" && "Gerenciamento de Depósitos"}
            {activeTab === "investors" && "Gerenciamento de Investidores"}
            {activeTab === "partners" && "Gerenciamento de Parceiros"}
            {activeTab === "investments" && "Gerenciamento de Investimentos"}
            {activeTab === "users" && "Gerenciamento de Usuários"}
            {activeTab === "settings" && "Configurações"}
          </h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon">
              <Bell className="h-[1.2rem] w-[1.2rem]" />
            </Button>
            <Button onClick={handleLogout} variant="outline">
              Sair
            </Button>
          </div>
        </div>

        {/* Tab content */}
        <div className="mt-6">
          {activeTab === "overview" && <AdminOverview />}
          {activeTab === "deposits" && <AdminDeposits />}
          {activeTab === "investors" && <AdminInvestors />}
          {activeTab === "partners" && <AdminPartners />}
          {activeTab === "investments" && <AdminInvestments />}
          {activeTab === "users" && <AdminUsers />}
          {activeTab === "settings" && (
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Gerenciar configurações da plataforma e permissões de usuários.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
