
import { useToast } from "@/hooks/use-toast";

export const handleAuthError = (error: Error, toast: ReturnType<typeof useToast>['toast']) => {
  console.error("Erro de autenticação:", error);
  
  // Mensagens personalizadas para erros comuns
  let errorMessage = error.message || "Ocorreu um erro durante a autenticação.";
  
  if (errorMessage.includes("Database error saving new user")) {
    errorMessage = "Erro ao salvar usuário no banco de dados. Por favor, tente com um email diferente ou contacte o administrador.";
  } else if (errorMessage.includes("User already registered")) {
    errorMessage = "Este email já está registrado. Por favor, tente fazer login.";
  } else if (errorMessage.includes("Invalid login credentials")) {
    errorMessage = "Credenciais inválidas. Verifique seu email e senha.";
  }
  
  toast({
    variant: "destructive",
    title: "Erro na autenticação",
    description: errorMessage,
  });
};

export const getRedirectPath = (userType: string | undefined) => {
  // Lógica de redirecionamento melhorada
  switch (userType) {
    case 'admin':
      return '/admin';
    case 'parceiro':
      return '/parceiro';
    case 'investidor':
      return '/investidor';
    default:
      return '/investidor'; // Fallback padrão
  }
};

// Função auxiliar para verificar se um email é de administrador
export const isAdminEmail = (email: string): boolean => {
  const adminEmails = ['dumildemacai@gmail.com', 'dumildemacai69@gmail.com'];
  return adminEmails.includes(email.toLowerCase());
};

// Função temporária para atribuir o tipo de usuário sem depender do banco
export const determineUserType = (email: string, selectedType: string): 'admin' | 'parceiro' | 'investidor' => {
  if (isAdminEmail(email)) {
    return 'admin';
  }
  
  // Garantir que selectedType seja um valor válido
  if (selectedType === 'parceiro') {
    return 'parceiro';
  }
  
  return 'investidor';
};

