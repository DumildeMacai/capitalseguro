import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const LoginForm = () => {
  const { toast } = useToast();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [userType, setUserType] = useState<"investidor" | "parceiro">("investidor");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Estas verificações são mantidas para compatibilidade com o fluxo existente
      if (email === "dumildemacai@gmail.com" && password === "19921admin1") {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo, Administrador!",
        });
        window.location.href = "/admin";
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
        window.location.href = "/parceiro";
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
        window.location.href = "/investidor";
        return;
      }

      // Login pelo Supabase
      await signIn(email, password);
    } catch (error) {
      console.error("Erro no login:", error);
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
