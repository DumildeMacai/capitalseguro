import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Eye, MoreVertical, Search } from "lucide-react";

interface Investor {
  id: string;
  nome_completo: string | null;
  email: string;
  telefone: string | null;
  bio: string | null;
  data_criacao: string | null;
}

const AdminInvestors = () => {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    nome_completo: "",
    email: "",
    telefone: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchInvestors();
  }, []);

  const fetchInvestors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, nome_completo, email, telefone, bio, data_criacao")
        .eq("tipo", "investidor")
        .order("data_criacao", { ascending: false });

      if (error) throw error;
      setInvestors(data || []);
    } catch (error: any) {
      console.error("Erro ao buscar investidores:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar investidores.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredInvestors = investors.filter((investor) =>
    investor.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewInvestor = (investor: Investor) => {
    setSelectedInvestor(investor);
    setFormData({
      nome_completo: investor.nome_completo || "",
      email: investor.email,
      telefone: investor.telefone || "",
    });
    setOpenDialog(true);
  };

  const handleEditInvestor = async () => {
    try {
      if (!selectedInvestor) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          nome_completo: formData.nome_completo || null,
          telefone: formData.telefone || null,
        })
        .eq("id", selectedInvestor.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Investidor atualizado com sucesso.",
      });

      setOpenDialog(false);
      await fetchInvestors();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar investidor.",
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("pt-PT");
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-muted-foreground">Carregando investidores...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Investidores Cadastrados</CardTitle>
              <CardDescription>
                Gerenciamento de todos os investidores da plataforma.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvestors.length > 0 ? (
                  filteredInvestors.map((investor) => (
                    <TableRow key={investor.id}>
                      <TableCell className="font-medium">{investor.nome_completo || "—"}</TableCell>
                      <TableCell>{investor.email}</TableCell>
                      <TableCell>{investor.telefone || "—"}</TableCell>
                      <TableCell>{formatDate(investor.data_criacao)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">Ativo</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewInvestor(investor)}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Visualizar/Editar</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhum investidor encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Visualizar/Editar Investidor</DialogTitle>
            <DialogDescription>
              Atualize os dados do investidor abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome Completo</label>
              <Input
                value={formData.nome_completo}
                onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
                placeholder="Nome do investidor"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                value={formData.email}
                disabled
                placeholder="email@exemplo.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Telefone</label>
              <Input
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="+244 923 000 000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditInvestor}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInvestors;
