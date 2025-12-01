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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Eye, MoreVertical, Search, Send } from "lucide-react";

interface Investor {
  id: string;
  nome_completo: string | null;
  email: string;
  telefone: string | null;
  bio: string | null;
  data_criacao: string | null;
  saldo_disponivel?: number;
}

const AdminInvestors = () => {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCreditDialog, setOpenCreditDialog] = useState(false);
  const [creditAmount, setCreditAmount] = useState("");
  const [creditLoading, setCreditLoading] = useState(false);
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
      // Fetch all profiles using select * to avoid RLS issues
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInvestors((data || []) as any);
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
        description: "Usuário atualizado com sucesso.",
      });

      setOpenDialog(false);
      await fetchInvestors();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar usuário.",
      });
    }
  };

  const handleOpenCreditDialog = (investor: Investor) => {
    setSelectedInvestor(investor);
    setCreditAmount("");
    setOpenCreditDialog(true);
  };

  const handleCreditBalance = async () => {
    try {
      if (!selectedInvestor || !creditAmount) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Informe um valor válido.",
        });
        return;
      }

      const amount = parseFloat(creditAmount);
      if (isNaN(amount) || amount <= 0) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Valor deve ser maior que 0.",
        });
        return;
      }

      setCreditLoading(true);
      const currentBalance = Number(selectedInvestor.saldo_disponivel || 0);
      const newBalance = currentBalance + amount;

      const { error } = await supabase
        .from("profiles")
        .update({ saldo_disponivel: newBalance })
        .eq("id", selectedInvestor.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Creditado Kz ${amount.toFixed(2)} ao investidor. Novo saldo: Kz ${newBalance.toFixed(2)}`,
      });

      setOpenCreditDialog(false);
      await fetchInvestors();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível creditar saldo.",
      });
    } finally {
      setCreditLoading(false);
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
          <div className="text-center text-muted-foreground">Carregando usuários...</div>
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
              <CardTitle>Usuários Cadastrados</CardTitle>
              <CardDescription>
                Gerenciamento de todos os usuários da plataforma.
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
                  <TableHead>Saldo Disponível</TableHead>
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
                      <TableCell>Kz {Number(investor.saldo_disponivel || 0).toLocaleString("pt-PT", { minimumFractionDigits: 2 })}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleOpenCreditDialog(investor)}>
                              <Send className="mr-2 h-4 w-4" />
                              <span>Creditar Saldo</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhum usuário encontrado
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
            <DialogTitle>Visualizar/Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize os dados do usuário abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome Completo</label>
              <Input
                value={formData.nome_completo}
                onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
                placeholder="Nome do usuário"
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

      <Dialog open={openCreditDialog} onOpenChange={setOpenCreditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Creditar Saldo ao Investidor</DialogTitle>
            <DialogDescription>
              Adicione fundos à conta do investidor.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Investidor</label>
              <Input
                value={selectedInvestor?.nome_completo || ""}
                disabled
                placeholder="Nome do investidor"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Saldo Atual</label>
              <Input
                value={`Kz ${Number(selectedInvestor?.saldo_disponivel || 0).toFixed(2)}`}
                disabled
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="credit-amount">Valor a Creditar (Kz) *</Label>
              <Input
                id="credit-amount"
                type="number"
                placeholder="10000"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                min="0"
                step="100"
                disabled={creditLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenCreditDialog(false)} disabled={creditLoading}>
              Cancelar
            </Button>
            <Button onClick={handleCreditBalance} disabled={creditLoading}>
              {creditLoading ? "Creditando..." : "Creditar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInvestors;
