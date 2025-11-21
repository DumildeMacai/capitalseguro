
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

export const getRedirectPath = (userType: string | undefined | null) => {
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

// Nota: Verificação de admin agora é feita através da tabela user_roles no banco
// Para tornar um usuário admin, execute no SQL Editor:
// SELECT public.set_user_as_admin('user-id-aqui');
