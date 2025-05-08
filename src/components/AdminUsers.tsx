
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
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { UserCheck, UserX, Shield, RefreshCw, AlertTriangle } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const [refreshing, setRefreshing] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
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

  const refreshUsers = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
    toast({
      title: "Atualizado",
      description: "Lista de usuários atualizada com sucesso.",
    });
  };

  const setUserAsAdmin = async (userId: string, email: string) => {
    try {
      setOpenModal(false);
      
      // Using RPC function directly with parameters as object
      const { error } = await supabase.rpc('set_user_as_admin', { user_email: email });
      
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
        description: "Não foi possível atualizar o usuário: " + error.message,
      });
    }
  };
  
  const handleConfirmAdmin = (user: UserData) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gerenciamento de Usuários</CardTitle>
            <CardDescription>
              Gerencie todos os usuários da plataforma
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={refreshUsers} 
            disabled={refreshing}
            title="Atualizar lista"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
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
                          onClick={() => handleConfirmAdmin(user)}
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
      {users.length > 0 && (
        <CardFooter className="justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">
            Total: {users.length} usuários
          </div>
          <div className="text-sm flex items-center gap-4">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-1 text-red-500" />
              <span>Admin: {users.filter(u => u.tipo === 'admin').length}</span>
            </div>
            <div className="flex items-center">
              <UserCheck className="h-4 w-4 mr-1 text-blue-500" />
              <span>Parceiro: {users.filter(u => u.tipo === 'parceiro').length}</span>
            </div>
            <div className="flex items-center">
              <UserX className="h-4 w-4 mr-1 text-green-500" />
              <span>Investidor: {users.filter(u => u.tipo === 'investidor').length}</span>
            </div>
          </div>
        </CardFooter>
      )}

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar ação</DialogTitle>
            <DialogDescription>
              Você está prestes a tornar o usuário{" "}
              <span className="font-semibold">{selectedUser?.email}</span> um administrador.
              Esta ação dará acesso completo ao sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 p-4 bg-amber-50 rounded-md">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <p className="text-sm text-amber-700">
              Administradores têm acesso completo ao sistema, incluindo dados de todos os usuários.
            </p>
          </div>
          <DialogFooter className="flex sm:justify-between">
            <Button 
              variant="outline" 
              onClick={() => setOpenModal(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="default"
              onClick={() => selectedUser && setUserAsAdmin(selectedUser.id, selectedUser.email)}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminUsers;
