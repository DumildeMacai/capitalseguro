
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
import { Eye, Edit, Ban, Bell, MoreVertical, Search } from "lucide-react";

// Mock data for investors
const mockInvestors = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@email.com",
    phone: "+244 923 456 789",
    profileType: "Moderado",
    registrationDate: "12/04/2023",
    totalInvested: "R$ 50.000",
    status: "Ativo",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@email.com",
    phone: "+244 923 987 654",
    profileType: "Conservador",
    registrationDate: "25/03/2023",
    totalInvested: "R$ 120.000",
    status: "Ativo",
  },
  {
    id: "3",
    name: "Pedro Almeida",
    email: "pedro@email.com",
    phone: "+244 923 123 456",
    profileType: "Arrojado",
    registrationDate: "05/05/2023",
    totalInvested: "R$ 75.000",
    status: "Suspenso",
  },
];

const AdminInvestors = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInvestors = mockInvestors.filter((investor) =>
    investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Button>+ Novo Investidor</Button>
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

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead>Total Investido</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvestors.map((investor) => (
                  <TableRow key={investor.id}>
                    <TableCell className="font-medium">{investor.name}</TableCell>
                    <TableCell>{investor.email}</TableCell>
                    <TableCell>{investor.profileType}</TableCell>
                    <TableCell>{investor.registrationDate}</TableCell>
                    <TableCell>{investor.totalInvested}</TableCell>
                    <TableCell>
                      <Badge variant={investor.status === "Ativo" ? "outline" : "destructive"}>
                        {investor.status}
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
                            <Ban className="mr-2 h-4 w-4" />
                            <span>
                              {investor.status === "Ativo" ? "Suspender" : "Ativar"}
                            </span>
                          </DropdownMenuItem>
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

export default AdminInvestors;
