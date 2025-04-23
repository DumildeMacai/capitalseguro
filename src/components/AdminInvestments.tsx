
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
import { Eye, Edit, Trash2, MoreVertical, Search } from "lucide-react";

// Mock data for investments
const mockInvestments = [
  {
    id: "1",
    name: "Edifício Miramar - 10º Andar",
    category: "Imóveis",
    partner: "Imobiliária Premium",
    minInvestment: "R$ 10.000",
    expectedReturn: "12% a.a.",
    lockupPeriod: "24 meses",
    risk: "Médio",
    status: "Ativo",
  },
  {
    id: "2",
    name: "Startup TechAngola - Série A",
    category: "Startups",
    partner: "TechInvest Angola",
    minInvestment: "R$ 5.000",
    expectedReturn: "25% a.a.",
    lockupPeriod: "36 meses",
    risk: "Alto",
    status: "Ativo",
  },
  {
    id: "3",
    name: "Fazenda Girassol - Cultivo de Soja",
    category: "Agronegócio",
    partner: "Agro Capital",
    minInvestment: "R$ 15.000",
    expectedReturn: "18% a.a.",
    lockupPeriod: "12 meses",
    risk: "Baixo",
    status: "Encerrado",
  },
];

const AdminInvestments = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInvestments = mockInvestments.filter((investment) =>
    investment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investment.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investment.partner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "Baixo": return "outline";
      case "Médio": return "secondary";
      case "Alto": return "destructive";
      default: return "outline";
    }
  };

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
            <Button>+ Novo Investimento</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, categoria, parceiro..."
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
                  <TableHead>Categoria</TableHead>
                  <TableHead>Parceiro</TableHead>
                  <TableHead>Valor Mínimo</TableHead>
                  <TableHead>Retorno</TableHead>
                  <TableHead>Risco</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvestments.map((investment) => (
                  <TableRow key={investment.id}>
                    <TableCell className="font-medium">{investment.name}</TableCell>
                    <TableCell>{investment.category}</TableCell>
                    <TableCell>{investment.partner}</TableCell>
                    <TableCell>{investment.minInvestment}</TableCell>
                    <TableCell>{investment.expectedReturn}</TableCell>
                    <TableCell>
                      <Badge variant={getRiskBadgeVariant(investment.risk)}>
                        {investment.risk}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={investment.status === "Ativo" ? "outline" : "secondary"}
                      >
                        {investment.status}
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
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Excluir</span>
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

export default AdminInvestments;
