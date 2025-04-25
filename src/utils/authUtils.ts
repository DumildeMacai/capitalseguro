
import { useToast } from '@/hooks/use-toast';

export const handleAuthError = (error: Error, toast: ReturnType<typeof useToast>['toast']) => {
  let errorMessage = error.message || "Ocorreu um erro durante a autenticação.";
  
  // Traduzir mensagens de erro comuns do Supabase para português
  if (errorMessage.includes("Invalid login credentials")) {
    errorMessage = "Credenciais de login inválidas.";
  } else if (errorMessage.includes("Email not confirmed")) {
    errorMessage = "Email não confirmado. Por favor, verifique sua caixa de entrada.";
  } else if (errorMessage.includes("User already registered")) {
    errorMessage = "Utilizador já registado com este email.";
  }
  
  toast({
    variant: "destructive",
    title: "Erro na autenticação",
    description: errorMessage,
  });
};

export const getRedirectPath = (userType: string | undefined) => {
  switch (userType) {
    case 'admin':
      return '/admin';
    case 'parceiro':
      return '/parceiro';
    case 'investidor':
      return '/investidor';
    default:
      return '/login';
  }
};

// Função para validar se é um email de administrador
export const isAdminEmail = (email: string): boolean => {
  return email === 'dumildemacai@gmail.com';
};

// Função para validar credenciais de administrador
export const validateAdminCredentials = (email: string, password: string): boolean => {
  return email === 'dumildemacai@gmail.com' && password === '19921admin1';
};
