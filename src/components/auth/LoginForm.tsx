
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
      // Enviar o tipo de usuário para a função de login
      await signIn(email, password, userType);
    } catch (error) {
      console.error("Erro no login:", error);
      // O erro já é tratado na função signIn
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
            className={`w-full ${userType === "investidor" ? "bg-navy-blue hover:bg-navy-blue/90" : ""}`}
            onClick={() => setUserType("investidor")}
          >
            Investidor
          </Button>
          <Button
            type="button"
            variant={userType === "parceiro" ? "default" : "outline"}
            className={`w-full ${userType === "parceiro" ? "bg-navy-blue hover:bg-navy-blue/90" : ""}`}
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
          <Button variant="link" className="px-0 text-navy-blue" asChild>
            <a href="/esqueci-senha" className="text-sm hover:text-blue-800">
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
        className="w-full bg-navy-blue hover:bg-navy-blue/90 text-white" 
        disabled={isLoading}
      >
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
};
