
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { UserCheck, UserX, Shield } from "lucide-react";

interface UserData {
  id: string;
  email: string;
  nome_completo: string | null;
  tipo: 'admin' | 'investidor' | 'parceiro';
  telefone: string | null;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
        
      if (error) {
        throw error;
      }
      
      setUsers(data as UserData[]);
    } catch (error: any) {
      console.error("Erro ao buscar usuários:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar a lista de usuários.",
      });
    } finally {
      setLoading(false);
    }
  };

  const setUserAsAdmin = async (userId: string, email: string) => {
    try {
      // Use the raw query instead of the typed RPC call
      const { error } = await supabase.rpc('set_user_as_admin', { user_email: email } as any);
      
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Usuário definido como administrador.",
      });
      
      fetchUsers(); // Atualizar lista
    } catch (error: any) {
      console.error("Erro ao definir usuário como admin:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o usuário.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Usuários</CardTitle>
        <CardDescription>
          Gerencie todos os usuários da plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.nome_completo || "Não informado"}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {user.tipo === 'admin' ? (
                          <Shield className="h-4 w-4 mr-1 text-red-500" />
                        ) : user.tipo === 'parceiro' ? (
                          <UserCheck className="h-4 w-4 mr-1 text-blue-500" />
                        ) : (
                          <UserX className="h-4 w-4 mr-1 text-green-500" />
                        )}
                        {user.tipo}
                      </div>
                    </TableCell>
                    <TableCell>{user.telefone || "Não informado"}</TableCell>
                    <TableCell>
                      {user.tipo !== 'admin' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setUserAsAdmin(user.id, user.email)}
                        >
                          Tornar Admin
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Nenhum usuário encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminUsers;
