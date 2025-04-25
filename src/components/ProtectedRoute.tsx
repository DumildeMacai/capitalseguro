
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'admin' | 'parceiro' | 'investidor';
}

const ProtectedRoute = ({ 
  children, 
  requiredUserType 
}: ProtectedRouteProps) => {
  const { user, userType, loading } = useAuth();

  // Mostrar um indicador de carregamento enquanto verifica a autenticação
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy-blue"></div>
      </div>
    );
  }

  // Se não estiver autenticado, redirecionar para o login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Se houver um tipo de usuário requerido e não corresponder, redirecionar
  if (requiredUserType && userType !== requiredUserType) {
    // Redirecionar para página apropriada com base no tipo de usuário
    switch (userType) {
      case 'admin':
        return <Navigate to="/admin" />;
      case 'parceiro': 
        return <Navigate to="/parceiro" />;
      case 'investidor':
        return <Navigate to="/investidor" />;
      default:
        return <Navigate to="/login" />;
    }
  }

  // Se autenticado e com o tipo correto, renderizar o conteúdo
  return <>{children}</>;
};

export default ProtectedRoute;
