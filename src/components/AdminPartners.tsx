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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { 
  Eye, Edit, Check, X, Bell, MoreVertical, Search, FileCheck, Plus 
} from "lucide-react";

interface Partner {
  id: string;
  nome_completo: string | null;
  email: string;
  telefone: string | null;
  empresa_nome: string | null;
  ramo_negocio: string | null;
  status?: string;
}

const AdminPartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openNotifyDialog, setOpenNotifyDialog] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [notificationMessage, setNotificationMessage] = useState("");
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
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("tipo", "parceiro")
        .order("data_criacao", { ascending: false });

      if (error) throw error;
      setPartners((data || []).map(p => ({
        ...p,
        status: p.status || "Pendente"
      })));
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

  const handleNewPartner = () => {
    setSelectedPartner(null);
    setFormData({
      nome_completo: "",
      email: "",
      telefone: "",
      empresa_nome: "",
      ramo_negocio: "",
    });
    setOpenDialog(true);
  };

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
      if (!formData.email.trim()) {
        toast({
          variant: "destructive",
          title: "Validação",
          description: "Email é obrigatório.",
        });
        return;
      }

      const payload = {
        nome_completo: formData.nome_completo || null,
        email: formData.email,
        telefone: formData.telefone || null,
        empresa_nome: formData.empresa_nome || null,
        ramo_negocio: formData.ramo_negocio || null,
      };

      if (selectedPartner) {
        const { error } = await supabase
          .from("profiles")
          .update(payload)
          .eq("id", selectedPartner.id);

        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Parceiro atualizado com sucesso.",
        });
      } else {
        toast({
          title: "Atenção",
          description: "Parceiros devem ser criados através do registro.",
        });
      }

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

  const handleApprovePartner = async () => {
    try {
      if (!selectedPartner) return;

      await supabase
        .from("profiles")
        .update({ status: "Aprovado" })
        .eq("id", selectedPartner.id);

      toast({
        title: "Sucesso",
        description: "Parceiro aprovado com sucesso.",
      });

      setActionType(null);
      await fetchPartners();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível aprovar parceiro.",
      });
    }
  };

  const handleRejectPartner = async () => {
    try {
      if (!selectedPartner) return;

      await supabase
        .from("profiles")
        .update({ status: "Rejeitado" })
        .eq("id", selectedPartner.id);

      toast({
        title: "Sucesso",
        description: "Parceiro rejeitado com sucesso.",
      });

      setActionType(null);
      await fetchPartners();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível rejeitar parceiro.",
      });
    }
  };

  const handleDeletePartner = async () => {
    try {
      if (!selectedPartner) return;

      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", selectedPartner.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Parceiro excluído com sucesso.",
      });

      setOpenDeleteDialog(false);
      setSelectedPartner(null);
      await fetchPartners();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir parceiro.",
      });
    }
  };

  const handleSendNotification = async () => {
    try {
      if (!selectedPartner) return;

      console.log("Enviando notificação para:", selectedPartner.email, notificationMessage);

      toast({
        title: "Sucesso",
        description: `Notificação enviada para ${selectedPartner.email}`,
      });

      setOpenNotifyDialog(false);
      setNotificationMessage("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível enviar notificação.",
      });
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Aprovado": return "outline";
      case "Pendente": return "secondary";
      case "Rejeitado": return "destructive";
      default: return "outline";
    }
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
            <Button onClick={handleNewPartner}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Parceiro
            </Button>
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
                  <TableHead>Status</TableHead>
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
                      <TableCell>
                        <Badge variant={getStatusVariant(partner.status || "Pendente")}>
                          {partner.status || "Pendente"}
                        </Badge>
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
                            <DropdownMenuItem onClick={() => handleEditPartner(partner)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Editar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileCheck className="mr-2 h-4 w-4" />
                              <span>Validar Documentos</span>
                            </DropdownMenuItem>
                            {(partner.status || "Pendente") === "Pendente" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => { setSelectedPartner(partner); setActionType("approve"); }}>
                                  <Check className="mr-2 h-4 w-4" />
                                  <span>Aprovar</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { setSelectedPartner(partner); setActionType("reject"); }} className="text-destructive">
                                  <X className="mr-2 h-4 w-4" />
                                  <span>Rejeitar</span>
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => { setSelectedPartner(partner); setOpenNotifyDialog(true); }}>
                              <Bell className="mr-2 h-4 w-4" />
                              <span>Notificar</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedPartner(partner);
                                setOpenDeleteDialog(true);
                              }}
                              className="text-destructive"
                            >
                              <X className="mr-2 h-4 w-4" />
                              <span>Excluir</span>
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
              <label className="text-sm font-medium">Email *</label>
              <Input
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

      <Dialog open={openNotifyDialog} onOpenChange={setOpenNotifyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Notificar Parceiro</DialogTitle>
            <DialogDescription>
              Envie uma mensagem para {selectedPartner?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <textarea
              className="w-full px-3 py-2 border rounded-md text-sm"
              rows={5}
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              placeholder="Digite sua mensagem aqui..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenNotifyDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSendNotification}>Enviar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={actionType === "approve"} onOpenChange={(open) => !open && setActionType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aprovar Parceiro</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja aprovar "{selectedPartner?.empresa_nome}"? O parceiro receberá uma notificação.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={handleApprovePartner} className="bg-primary">
            Aprovar
          </AlertDialogAction>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={actionType === "reject"} onOpenChange={(open) => !open && setActionType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rejeitar Parceiro</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja rejeitar "{selectedPartner?.empresa_nome}"? O parceiro receberá uma notificação.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={handleRejectPartner} className="bg-destructive text-destructive-foreground">
            Rejeitar
          </AlertDialogAction>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir "{selectedPartner?.empresa_nome}"? Esta ação é irreversível.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={handleDeletePartner} className="bg-destructive text-destructive-foreground">
            Excluir
          </AlertDialogAction>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPartners;
