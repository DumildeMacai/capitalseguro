
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { isAdminEmail, getRedirectPath, handleAuthError } from "@/utils/authUtils";

export const LoginForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [userType, setUserType] = useState<"investidor" | "parceiro">("investidor");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Tentando login para:", email);
      
      // Verificações para contas hardcoded para desenvolvimento
      if (email === "dumildemacai@gmail.com" && password === "19921admin1") {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo, Administrador!",
        });
        navigate("/admin");
        setIsLoading(false);
        return;
      } else if (email === "dumildemacai@gmail.com" && password === "19921parceiro1") {
        if (userType !== "parceiro") {
          toast({
            variant: "destructive",
            title: "Tipo de usuário incorreto",
            description: "Você está tentando entrar como investidor, mas esta conta é de parceiro.",
          });
          setIsLoading(false);
          return;
        }
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo, Parceiro!",
        });
        navigate("/parceiro");
        setIsLoading(false);
        return;
      } else if (email === "dumildemacai@gmail.com" && password === "19921investidor1") {
        if (userType !== "investidor") {
          toast({
            variant: "destructive",
            title: "Tipo de usuário incorreto",
            description: "Você está tentando entrar como parceiro, mas esta conta é de investidor.",
          });
          setIsLoading(false);
          return;
        }
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo, Investidor!",
        });
        navigate("/investidor");
        setIsLoading(false);
        return;
      }

      // Login pelo Supabase com tratamento de erros melhorado
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      console.log("Login bem-sucedido:", data.user?.id);

      // Verifica se o usuário é admin pelo email
      if (data.user && isAdminEmail(data.user.email || '')) {
        console.log("Usuário é admin, redirecionando para /admin");
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo, Administrador!",
        });
        navigate("/admin");
        setIsLoading(false);
        return;
      }
      
      // Para usuários não-admin, tenta obter o tipo pelo perfil ou usa o tipo selecionado
      let userRole = userType; // Fallback para o tipo selecionado
      
      if (data.user) {
        const { data: userType, error: typeError } = await supabase.rpc('get_user_type', { user_id: data.user.id });
        
        if (!typeError && userType) {
          userRole = userType as "admin" | "parceiro" | "investidor";
        } else {
          console.warn("Não foi possível obter o tipo de usuário da RPC, usando tipo selecionado:", userType);
        }
      }
        
      const redirectPath = getRedirectPath(userRole);
        
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo! Redirecionando para ${redirectPath}`,
      });
        
      navigate(redirectPath);
    } catch (error: any) {
      console.error("Erro completo no login:", error);
      handleAuthError(error, toast);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-4">
        <Label className="text-center block mb-2">Você quer fazer login como:</Label>
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant={userType === "investidor" ? "default" : "outline"}
            className={`w-full ${userType === "investidor" ? "bg-gradient-primary" : ""}`}
            onClick={() => setUserType("investidor")}
          >
            Investidor
          </Button>
          <Button
            type="button"
            variant={userType === "parceiro" ? "default" : "outline"}
            className={`w-full ${userType === "parceiro" ? "bg-gradient-primary" : ""}`}
            onClick={() => setUserType("parceiro")}
          >
            Parceiro
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="nome@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Senha</Label>
          <Button variant="link" className="px-0" asChild>
            <a href="/esqueci-senha" className="text-sm text-purple hover:text-purple-dark">
              Esqueceu a senha?
            </a>
          </Button>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="remember" 
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
        />
        <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
          Lembrar por 30 dias
        </Label>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-primary hover:opacity-90" 
        disabled={isLoading}
      >
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
};

