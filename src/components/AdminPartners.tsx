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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Edit, MoreVertical, Search, FileCheck } from "lucide-react";

interface Partner {
  id: string;
  nome_completo: string | null;
  email: string;
  telefone: string | null;
  empresa_nome: string | null;
  ramo_negocio: string | null;
  data_criacao: string | null;
}

const AdminPartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    nome_completo: "",
    email: "",
    telefone: "",
    empresa_nome: "",
    ramo_negocio: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      // Fetch profiles that have empresa_nome (likely partners)
      const { data, error } = await supabase
        .from("profiles")
        .select("id, nome_completo, email, telefone, empresa_nome, ramo_negocio, created_at")
        .not("empresa_nome", "is", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPartners((data || []) as any);
    } catch (error: any) {
      console.error("Erro ao buscar parceiros:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar parceiros.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPartners = partners.filter((partner) =>
    partner.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.empresa_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditPartner = (partner: Partner) => {
    setSelectedPartner(partner);
    setFormData({
      nome_completo: partner.nome_completo || "",
      email: partner.email,
      telefone: partner.telefone || "",
      empresa_nome: partner.empresa_nome || "",
      ramo_negocio: partner.ramo_negocio || "",
    });
    setOpenDialog(true);
  };

  const handleSavePartner = async () => {
    try {
      if (!selectedPartner) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          nome_completo: formData.nome_completo || null,
          telefone: formData.telefone || null,
          empresa_nome: formData.empresa_nome || null,
          ramo_negocio: formData.ramo_negocio || null,
        })
        .eq("id", selectedPartner.id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Parceiro atualizado com sucesso.",
      });

      setOpenDialog(false);
      await fetchPartners();
    } catch (error: any) {
      console.error("Erro ao salvar parceiro:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível salvar parceiro.",
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
          <div className="text-center text-muted-foreground">Carregando parceiros...</div>
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
              <CardTitle>Parceiros Cadastrados</CardTitle>
              <CardDescription>
                Gerenciamento de todos os parceiros da plataforma.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, empresa, email..."
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
                  <TableHead>Responsável</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Ramo</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.length > 0 ? (
                  filteredPartners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell className="font-medium">{partner.nome_completo || "—"}</TableCell>
                      <TableCell>{partner.empresa_nome || "—"}</TableCell>
                      <TableCell>{partner.ramo_negocio || "—"}</TableCell>
                      <TableCell>{partner.email}</TableCell>
                      <TableCell>{formatDate(partner.data_criacao)}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleEditPartner(partner)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Editar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileCheck className="mr-2 h-4 w-4" />
                              <span>Validar Documentos</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhum parceiro encontrado
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
            <DialogTitle>Editar Parceiro</DialogTitle>
            <DialogDescription>
              Atualize os dados do parceiro abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome Completo</label>
              <Input
                value={formData.nome_completo}
                onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
                placeholder="Nome do responsável"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                value={formData.email}
                disabled
                placeholder="email@empresa.com"
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
            <div>
              <label className="text-sm font-medium">Empresa</label>
              <Input
                value={formData.empresa_nome}
                onChange={(e) => setFormData({ ...formData, empresa_nome: e.target.value })}
                placeholder="Nome da empresa"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Ramo de Negócio</label>
              <Input
                value={formData.ramo_negocio}
                onChange={(e) => setFormData({ ...formData, ramo_negocio: e.target.value })}
                placeholder="Ex: Imóveis, Tecnologia..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePartner}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPartners;
