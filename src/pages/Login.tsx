import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { AuthSocialButtons } from "@/components/auth/AuthSocialButtons";
import { handleAdminAccess } from "@/utils/authHelpers";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const searchParams = new URLSearchParams(location.search);
  const isRegister = searchParams.get("register") === "true";
  
  const [activeTab, setActiveTab] = useState<string>(isRegister ? "register" : "login");
  const [adminLoading, setAdminLoading] = useState(false);
  
  const handleAdminClick = async () => {
    setAdminLoading(true);
    try {
      await handleAdminAccess(navigate, toast);
    } finally {
      setAdminLoading(false);
    }
  };
  
  useEffect(() => {
    const newUrl = activeTab === "register" 
      ? `${window.location.pathname}?register=true`
      : window.location.pathname;
    
    window.history.replaceState({}, "", newUrl);
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - image/content */}
      <div className="hidden md:block md:w-1/2 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTQ0MCAxMDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZyBvcGFjaXR5PSIwLjIiPgo8Y2lyY2xlIGN4PSI3MjAiIGN5PSI1MTIiIHI9IjUwMCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIi8+CjxjaXJjbGUgY3g9IjcyMCIgY3k9IjUxMiIgcj0iNDAwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjMiLz4KPGNpcmNsZSBjeD0iNzIwIiBjeT0iNTEyIiByPSIzMDAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMyIvPgo8Y2lyY2xlIGN4PSI3MjAiIGN5PSI1MTIiIHI9IjIwMCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIi8+CjwvZz4KPC9zdmc+Cg==')] bg-no-repeat bg-cover opacity-20" />
        
        <div className="relative h-full flex flex-col justify-center items-center text-white p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md"
          >
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-8">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                  <span className="text-white text-lg font-bold">CS</span>
                </span>
                <span className="text-white text-3xl font-extrabold">Capital Seguro</span>
              </div>
              
              <h1 className="text-4xl font-bold mb-6">
                {activeTab === "login" ? "Bem-vindo de volta!" : "Junte-se a nós"}
              </h1>
              <p className="text-white/80 text-lg mb-8">
                {activeTab === "login"
                  ? "Entre para acessar seu painel de investimentos e acompanhar seus rendimentos."
                  : "Crie uma conta para começar sua jornada rumo à liberdade financeira com 50% de retorno anual."}
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20">
              <h3 className="text-xl font-semibold mb-4">Destaques do Investimento</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="h-6 w-6 mr-2 text-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>50% de retorno anual garantido em todos os investimentos</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 mr-2 text-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Oportunidades de investimento em imóveis e negócios</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 mr-2 text-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Plataforma de investimento segura e transparente</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 mr-2 text-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Capital disponível após apenas 1 ano</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Right side - login/register forms */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 md:hidden">
            <Link to="/" className="inline-block mb-8">
              <div className="flex items-center justify-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary">
                  <span className="text-white text-sm font-bold">CS</span>
                </span>
                <span className="text-gradient text-3xl font-extrabold">Capital Seguro</span>
              </div>
            </Link>
            <h1 className="text-3xl font-bold">
              {activeTab === "login" ? "Bem-vindo de volta!" : "Junte-se a nós"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {activeTab === "login"
                ? "Entre para acessar seu painel de investimentos"
                : "Comece sua jornada rumo à liberdade financeira"}
            </p>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="register">Registrar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <LoginForm />
                <div className="text-center text-sm text-muted-foreground mt-4">
                  Não tem uma conta?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("register")}
                    className="text-purple hover:text-purple-dark font-medium"
                  >
                    Cadastre-se
                  </button>
                </div>
              </TabsContent>
              
              <TabsContent value="register">
                <RegisterForm />
                <div className="text-center text-sm text-muted-foreground mt-4">
                  Já tem uma conta?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("login")}
                    className="text-purple hover:text-purple-dark font-medium"
                  >
                    Entre
                  </button>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Ou continue com
                  </span>
                </div>
              </div>
              
              <div className="mt-6">
                <AuthSocialButtons />
              </div>
            </div>

            <div className="mt-6">
              <Button
                onClick={handleAdminClick}
                disabled={adminLoading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2"
              >
                {adminLoading ? "Acessando..." : "🔐 Acesso Admin (Demo)"}
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-2">
                Demo: admin@admin.com / 1dumilde1@A
              </p>
            </div>
            
            <p className="mt-6 text-center text-xs text-muted-foreground">
              Ao continuar, você concorda com nossos{" "}
              <Link to="/termos" className="underline underline-offset-4 hover:text-foreground">
                Termos de Serviço
              </Link>{" "}
              e{" "}
              <Link to="/privacidade" className="underline underline-offset-4 hover:text-foreground">
                Política de Privacidade
              </Link>
              .
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
