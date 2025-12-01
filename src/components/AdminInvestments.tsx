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
import { Eye, Edit, Trash2, MoreVertical, Search, Plus, Upload, X, Star } from "lucide-react";

interface Investment {
  id: string;
  titulo: string;
  categoria: string | null;
  valor_minimo: number | null;
  retorno_estimado: number | null;
  prazo_minimo: number | null;
  ativo: boolean | null;
  descricao: string | null;
  imagem: string | null;
  colocacao?: string | null;
  tipo_juros?: string | null;
}

const AdminInvestments = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    categoria: "",
    valor_minimo: "",
    retorno_estimado: "",
    prazo_minimo: "",
    descricao: "",
      imagem: "",
      imagemFile: null as File | null,
    ativo: true,
    colocacao: "oportunidades",
    tipo_juros: "simples",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("investimentos")
        .select("*")
        .order("data_criacao", { ascending: false });

      if (error) throw error;
      setInvestments(data || []);
    } catch (error: any) {
      console.error("Erro ao buscar investimentos:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar investimentos.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredInvestments = investments.filter((inv) =>
    inv.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewInvestment = () => {
    setSelectedInvestment(null);
    setFormData({
      titulo: "",
      categoria: "",
      valor_minimo: "",
      retorno_estimado: "",
      prazo_minimo: "",
      descricao: "",
        imagem: "",
        imagemFile: null,
      ativo: true,
      colocacao: "oportunidades",
      tipo_juros: "simples",
    });
    setOpenDialog(true);
  };

  const handleEditInvestment = (investment: Investment) => {
    setSelectedInvestment(investment);
    setFormData({
      titulo: investment.titulo,
      categoria: investment.categoria || "",
      valor_minimo: investment.valor_minimo?.toString() || "",
      retorno_estimado: investment.retorno_estimado?.toString() || "",
      prazo_minimo: investment.prazo_minimo?.toString() || "",
      descricao: investment.descricao || "",
        imagem: investment.imagem || "",
        imagemFile: null,
      ativo: investment.ativo ?? true,
      colocacao: (investment as any).colocacao ?? ((investment as any).featured ? 'destaque' : 'oportunidades'),
      tipo_juros: investment.tipo_juros || "simples",
    });
    setOpenDialog(true);
  };

  const handleSaveInvestment = async () => {
    try {
      if (!formData.titulo.trim()) {
        toast({
          variant: "destructive",
          title: "Validação",
          description: "Título é obrigatório.",
        });
        return;
      }

        let imagemUrl = formData.imagem;

        // Upload de imagem se um arquivo foi selecionado
        if (formData.imagemFile) {
          try {
            const fileName = `investimento-${Date.now()}-${formData.imagemFile.name}`;
            const { data, error: uploadError } = await supabase.storage
              .from("investimentos")
              .upload(fileName, formData.imagemFile);

            if (uploadError) throw uploadError;

            // Obter URL pública da imagem
            const { data: publicUrl } = supabase.storage
              .from("investimentos")
              .getPublicUrl(fileName);

            imagemUrl = publicUrl.publicUrl;
          } catch (uploadError: any) {
            toast({
              variant: "destructive",
              title: "Erro",
              description: "Não foi possível fazer upload da imagem.",
            });
            return;
          }
        }

      const payload = {
        titulo: formData.titulo,
        categoria: formData.categoria || null,
        valor_minimo: formData.valor_minimo ? parseFloat(formData.valor_minimo) : null,
        retorno_estimado: formData.retorno_estimado ? parseFloat(formData.retorno_estimado) : null,
        prazo_minimo: formData.prazo_minimo ? parseInt(formData.prazo_minimo) : null,
        descricao: formData.descricao || null,
          imagem: imagemUrl || null,
        ativo: !!formData.ativo,
        colocacao: formData.colocacao || 'oportunidades',
        tipo_juros: formData.tipo_juros || 'simples',
      };

      if (selectedInvestment) {
        const { error } = await supabase
          .from("investimentos")
          .update(payload)
          .eq("id", selectedInvestment.id);

        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Investimento atualizado com sucesso.",
        });
        // Disparar evento para atualizar dashboard do investidor se for "destaque"
        if (formData.colocacao === 'destaque') {
          window.dispatchEvent(new CustomEvent('investmentFeatured'));
        }
      } else {
        const { error } = await supabase
          .from("investimentos")
          .insert([payload]);

        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Investimento criado com sucesso.",
        });
        // Disparar evento para atualizar dashboard do investidor se for "destaque"
        if (formData.colocacao === 'destaque') {
          window.dispatchEvent(new CustomEvent('investmentFeatured'));
        }
      }

      setOpenDialog(false);
      await fetchInvestments();
    } catch (error: any) {
      console.error("Erro ao salvar investimento:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível salvar investimento.",
      });
    }
  };

  const handleDeleteInvestment = async () => {
    try {
      if (!selectedInvestment) return;

      const { error } = await supabase
        .from("investimentos")
        .delete()
        .eq("id", selectedInvestment.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Investimento excluído com sucesso.",
      });

      setOpenDeleteDialog(false);
      setSelectedInvestment(null);
      await fetchInvestments();
    } catch (error: any) {
      console.error("Erro ao excluir investimento:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir investimento.",
      });
    }
  };

  const getRiskBadgeVariant = (retorno: number | null | undefined) => {
    if (!retorno) return "outline";
    if (retorno < 10) return "outline";
    if (retorno < 20) return "secondary";
    return "destructive";
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-muted-foreground">Carregando investimentos...</div>
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
              <CardTitle>Investimentos</CardTitle>
              <CardDescription>
                Gerenciamento de todas as oportunidades de investimento.
              </CardDescription>
            </div>
            <Button onClick={handleNewInvestment}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Investimento
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, categoria..."
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
                  <TableHead>Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Valor Mínimo</TableHead>
                  <TableHead>Retorno</TableHead>
                  <TableHead>Prazo</TableHead>
                  <TableHead>Status</TableHead>
                      <TableHead>Destaque</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvestments.length > 0 ? (
                  filteredInvestments.map((investment) => (
                    <TableRow key={investment.id}>
                      <TableCell className="font-medium">{investment.titulo}</TableCell>
                      <TableCell>{investment.categoria || "—"}</TableCell>
                      <TableCell>
                        {investment.valor_minimo
                          ? `Kz ${investment.valor_minimo.toLocaleString()}`
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {investment.retorno_estimado
                          ? `${investment.retorno_estimado}% a.a.`
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {investment.prazo_minimo
                          ? `${investment.prazo_minimo} meses`
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            investment.ativo ? "outline" : "secondary"
                          }
                        >
                          {investment.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {investment.imagem ? (
                          <span className="inline-flex items-center gap-2">
                            {investment.imagem && (investment as any).featured ? (
                              <Star className="text-yellow-400" />
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </span>
                        ) : (
                          (investment as any).featured ? <Star className="text-yellow-400" /> : <span className="text-muted-foreground">—</span>
                        )}
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
                            <DropdownMenuItem onClick={() => handleEditInvestment(investment)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Editar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedInvestment(investment);
                                setOpenDeleteDialog(true);
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Excluir</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhum investimento encontrado
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
            <DialogTitle>
              {selectedInvestment ? "Editar Investimento" : "Novo Investimento"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do investimento abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Título *</label>
              <Input
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Ex: Edifício Miramar"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Categoria</label>
              <Input
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                placeholder="Ex: Imóveis, Startups..."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Valor Mínimo (Kz)</label>
              <Input
                type="number"
                value={formData.valor_minimo}
                onChange={(e) => setFormData({ ...formData, valor_minimo: e.target.value })}
                placeholder="10000"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Retorno Estimado (%)</label>
              <Input
                type="number"
                value={formData.retorno_estimado}
                onChange={(e) => setFormData({ ...formData, retorno_estimado: e.target.value })}
                placeholder="12"
                step="0.1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Prazo Mínimo (meses)</label>
              <Input
                type="number"
                value={formData.prazo_minimo}
                onChange={(e) => setFormData({ ...formData, prazo_minimo: e.target.value })}
                placeholder="24"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Descrição</label>
              <textarea
                className="w-full px-3 py-2 border rounded-md text-sm"
                rows={3}
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descrição do investimento..."
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!formData.ativo}
                  onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                />
                <span className="text-sm">Visível (Ativo)</span>
              </label>

              <label className="text-sm">Colocação</label>
              <select
                className="w-full border rounded-md px-3 py-2"
                value={formData.colocacao}
                onChange={(e) => setFormData({ ...formData, colocacao: e.target.value })}
              >
                <option value="oportunidades">Oportunidades</option>
                <option value="destaque">Destaque</option>
                <option value="pagina_inicial">Página Inicial</option>
              </select>

              <label className="text-sm">Tipo de Juros</label>
              <select
                className="w-full border rounded-md px-3 py-2"
                value={formData.tipo_juros}
                onChange={(e) => setFormData({ ...formData, tipo_juros: e.target.value })}
              >
                <option value="simples">Juros Simples (50% a.a.)</option>
                <option value="composto">Juros Compostos (50% a.a.)</option>
              </select>
            </div>
              <div>
                <label className="text-sm font-medium">Imagem</label>
                {formData.imagem && (
                  <div className="mb-3 relative">
                    <img 
                      src={formData.imagem} 
                      alt="Preview" 
                      className="h-40 w-full object-cover rounded-md border"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-1 right-1 bg-destructive/80 hover:bg-destructive text-white"
                      onClick={() => setFormData({ ...formData, imagem: "", imagemFile: null })}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Clique ou arraste imagem aqui
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData({ ...formData, imagemFile: file });
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData((prev) => ({ 
                              ...prev, 
                              imagem: reader.result as string 
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveInvestment}>
              {selectedInvestment ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir "{selectedInvestment?.titulo}"? Esta ação é irreversível.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={handleDeleteInvestment} className="bg-destructive text-destructive-foreground">
            Excluir
          </AlertDialogAction>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminInvestments;
