
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export const RegisterForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "As senhas não coincidem",
        description: "Por favor, verifique se as senhas são iguais.",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simular registro
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Registro realizado com sucesso",
        description: "Sua conta foi criada com sucesso!",
      });
    }, 1500);
  };

  return (
    <form onSubmit={handleRegister} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          placeholder="João Silva"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <Input
          id="register-email"
          type="email"
          placeholder="nome@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="register-password">Senha</Label>
        <Input
          id="register-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirmar Senha</Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="terms" 
          checked={agreeTerms}
          onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
          required
        />
        <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
          Li e aceito os{" "}
          <Link to="/termos" className="text-purple hover:text-purple-dark">
            Termos de Serviço
          </Link>{" "}
          e{" "}
          <Link to="/privacidade" className="text-purple hover:text-purple-dark">
            Política de Privacidade
          </Link>
        </Label>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-gradient-primary hover:opacity-90" 
        disabled={isLoading || !agreeTerms}
      >
        {isLoading ? "Criando conta..." : "Criar conta"}
      </Button>
    </form>
  );
};
