
import { useToast } from '@/hooks/use-toast';

export const handleAuthError = (error: Error, toast: ReturnType<typeof useToast>['toast']) => {
  toast({
    variant: "destructive",
    title: "Erro na autenticação",
    description: error.message || "Ocorreu um erro durante a autenticação.",
  });
};

export const getRedirectPath = (userType: string | undefined) => {
  switch (userType) {
    case 'admin':
      return '/admin';
    case 'parceiro':
      return '/parceiro';
    default:
      return '/investidor';
  }
};

