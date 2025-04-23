
import { useState } from "react";
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
import { 
  Eye, Edit, Check, X, Bell, MoreVertical, Search, FileCheck 
} from "lucide-react";

// Mock data for partners
const mockPartners = [
  {
    id: "1",
    responsibleName: "Ricardo Monteiro",
    companyName: "Imobiliária Premium",
    businessType: "Imóveis",
    email: "ricardo@premium.co.ao",
    phone: "+244 923 111 222",
    status: "Aprovado",
  },
  {
    id: "2",
    responsibleName: "Ana Ferreira",
    companyName: "TechInvest Angola",
    businessType: "Tecnologia",
    email: "ana@techinvest.co.ao",
    phone: "+244 923 333 444",
    status: "Pendente",
  },
  {
    id: "3",
    responsibleName: "Carlos Mendes",
    companyName: "Agro Capital",
    businessType: "Agronegócio",
    email: "carlos@agrocapital.co.ao",
    phone: "+244 923 555 666",
    status: "Rejeitado",
  },
];

const AdminPartners = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPartners = mockPartners.filter((partner) =>
    partner.responsibleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Aprovado": return "outline";
      case "Pendente": return "secondary";
      case "Rejeitado": return "destructive";
      default: return "outline";
    }
  };

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
            <Button>+ Novo Parceiro</Button>
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

          <div className="rounded-md border">
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
                {filteredPartners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell className="font-medium">{partner.responsibleName}</TableCell>
                    <TableCell>{partner.companyName}</TableCell>
                    <TableCell>{partner.businessType}</TableCell>
                    <TableCell>{partner.email}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(partner.status)}>
                        {partner.status}
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
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Visualizar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileCheck className="mr-2 h-4 w-4" />
                            <span>Validar Documentos</span>
                          </DropdownMenuItem>
                          {partner.status === "Pendente" && (
                            <>
                              <DropdownMenuItem>
                                <Check className="mr-2 h-4 w-4" />
                                <span>Aprovar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <X className="mr-2 h-4 w-4" />
                                <span>Rejeitar</span>
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem>
                            <Bell className="mr-2 h-4 w-4" />
                            <span>Notificar</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPartners;
