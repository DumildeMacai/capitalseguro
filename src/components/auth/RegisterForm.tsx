
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Eye, EyeOff } from "lucide-react";

export const RegisterForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userType, setUserType] = useState<"investidor" | "parceiro">("investidor");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  
  // Dados do formulário
  const [formData, setFormData] = useState({
    // Dados comuns
    nome: "",
    idade: "",
    endereco: "",
    documentoNumero: "",
    email: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
    
    // Dados específicos de parceiro
    profissao: "",
    nomeEmpresa: "",
    ramoAtuacao: "",
    website: "",
    contatoProfissional: "",
    
    // Arquivos
    documentoFrente: null as File | null,
    documentoVerso: null as File | null,
    fotoPerfil: null as File | null,
    
    // Termos
    aceitoTermos: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const nextStep = () => {
    // Validação básica para o primeiro passo
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (userType === "parceiro" && formData.profissao.trim() === "") {
        toast({
          variant: "destructive",
          title: "Campo obrigatório",
          description: "Por favor, preencha sua profissão.",
        });
        return;
      }
      setCurrentStep(3);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação de senha
    if (formData.senha !== formData.confirmarSenha) {
      toast({
        variant: "destructive",
        title: "As senhas não coincidem",
        description: "Por favor, verifique se as senhas são iguais.",
      });
      return;
    }
    
    // Validação de termos
    if (!formData.aceitoTermos) {
      toast({
        variant: "destructive",
        title: "Termos e Condições",
        description: "Você precisa aceitar os termos para continuar.",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulando registro
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Registro realizado com sucesso",
        description: `Sua conta de ${userType} foi criada com sucesso!`,
      });
      
      // Redirecionar para a página correspondente
      if (userType === "parceiro") {
        window.location.href = "/parceiro";
      } else {
        window.location.href = "/investidor";
      }
    }, 1500);
  };

  return (
    <form onSubmit={handleRegister} className="space-y-5">
      {currentStep === 1 && (
        <>
          <div className="space-y-4">
            <Label className="text-center block mb-2">Você está se cadastrando como:</Label>
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
                Parceiro (Empresa)
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input
              id="nome"
              name="nome"
              placeholder="João Silva"
              value={formData.nome}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="idade">Idade</Label>
            <Input
              id="idade"
              name="idade"
              type="number"
              placeholder="30"
              value={formData.idade}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço Completo (morada)</Label>
            <Textarea
              id="endereco"
              name="endereco"
              placeholder="Rua, número, bairro, cidade, estado, CEP"
              value={formData.endereco}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <Button 
            type="button" 
            className="w-full bg-gradient-primary hover:opacity-90"
            onClick={nextStep}
          >
            Continuar
          </Button>
        </>
      )}
      
      {currentStep === 2 && (
        <>
          {userType === "parceiro" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="profissao">Profissão</Label>
                <Input
                  id="profissao"
                  name="profissao"
                  placeholder="Engenheiro, Médico, etc."
                  value={formData.profissao}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nomeEmpresa">Nome da Empresa ou Razão Social</Label>
                <Input
                  id="nomeEmpresa"
                  name="nomeEmpresa"
                  placeholder="Empresa XYZ Ltda."
                  value={formData.nomeEmpresa}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ramoAtuacao">Ramo de Atuação</Label>
                <Input
                  id="ramoAtuacao"
                  name="ramoAtuacao"
                  placeholder="Tecnologia, Construção, etc."
                  value={formData.ramoAtuacao}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website ou Redes Sociais (opcional)</Label>
                <Input
                  id="website"
                  name="website"
                  placeholder="www.empresa.com.br"
                  value={formData.website}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contatoProfissional">Contato Profissional</Label>
                <Input
                  id="contatoProfissional"
                  name="contatoProfissional"
                  placeholder="Email ou telefone profissional"
                  value={formData.contatoProfissional}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="documentoNumero">Número do Documento de Identidade</Label>
            <Input
              id="documentoNumero"
              name="documentoNumero"
              placeholder="000.000.000-00"
              value={formData.documentoNumero}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="documentoFrente">Foto da Frente do Documento</Label>
            <Input
              id="documentoFrente"
              name="documentoFrente"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="documentoVerso">Foto do Verso do Documento</Label>
            <Input
              id="documentoVerso"
              name="documentoVerso"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>
          
          <div className="flex justify-between space-x-4">
            <Button 
              type="button" 
              variant="outline"
              className="w-1/2"
              onClick={prevStep}
            >
              Voltar
            </Button>
            <Button 
              type="button" 
              className="w-1/2 bg-gradient-primary hover:opacity-90"
              onClick={nextStep}
            >
              Continuar
            </Button>
          </div>
        </>
      )}
      
      {currentStep === 3 && (
        <>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="nome@exemplo.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              name="telefone"
              placeholder="+55 (00) 00000-0000"
              value={formData.telefone}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fotoPerfil">Foto de Perfil (opcional)</Label>
            <Input
              id="fotoPerfil"
              name="fotoPerfil"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="senha">Senha</Label>
            <div className="relative">
              <Input
                id="senha"
                name="senha"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.senha}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
            <div className="relative">
              <Input
                id="confirmarSenha"
                name="confirmarSenha"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmarSenha}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="aceitoTermos" 
              checked={formData.aceitoTermos}
              onCheckedChange={(checked) => handleCheckboxChange("aceitoTermos", checked as boolean)}
              required
            />
            <Label htmlFor="aceitoTermos" className="text-sm font-normal cursor-pointer">
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
          
          <div className="flex justify-between space-x-4">
            <Button 
              type="button" 
              variant="outline"
              className="w-1/2"
              onClick={prevStep}
            >
              Voltar
            </Button>
            <Button 
              type="submit" 
              className="w-1/2 bg-gradient-primary hover:opacity-90" 
              disabled={isLoading || !formData.aceitoTermos}
            >
              {isLoading ? "Criando conta..." : "Criar conta"}
            </Button>
          </div>
        </>
      )}
    </form>
  );
};
