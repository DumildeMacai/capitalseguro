
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const LoginForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('tipo')
        .eq('id', data.user.id)
        .single();

      if (profileData) {
        switch (profileData.tipo) {
          case 'admin':
            navigate('/admin');
            break;
          case 'parceiro':
            navigate('/parceiro');
            break;
          default:
            navigate('/investidor');
        }

        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: "Email ou senha incorretos.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
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
