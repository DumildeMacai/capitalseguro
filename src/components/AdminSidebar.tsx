import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, Users, Building2, BarChart3, 
  Settings, LogOut, ChevronLeft, ChevronRight, UserCog 
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const AdminSidebar = ({ activeTab, setActiveTab, onLogout }: AdminSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: "overview", name: "Visão Geral", icon: LayoutDashboard },
    { id: "investors", name: "Investidores", icon: Users },
    { id: "partners", name: "Parceiros", icon: Building2 },
    { id: "investments", name: "Investimentos", icon: BarChart3 },
    { id: "users", name: "Usuários", icon: UserCog },
    { id: "settings", name: "Configurações", icon: Settings },
  ];

  return (
    <div className={cn(
      "bg-card border-r border-border transition-all duration-300 flex flex-col",
      collapsed ? "w-[70px]" : "w-[240px]"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <h2 className="text-lg font-semibold">Admin</h2>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("ml-auto")}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 py-6">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start mb-1",
                collapsed ? "px-2" : "px-3"
              )}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className={cn(
                "h-5 w-5",
                collapsed ? "mr-0" : "mr-2"
              )} />
              {!collapsed && <span>{item.name}</span>}
            </Button>
          ))}
        </nav>
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t mt-auto">
        <Button 
          variant="ghost" 
          className={cn("w-full justify-start", collapsed ? "px-2" : "px-3")}
          onClick={onLogout}
        >
          <LogOut className={cn(
            "h-5 w-5",
            collapsed ? "mr-0" : "mr-2"
          )} />
          {!collapsed && <span>Sair</span>}
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
