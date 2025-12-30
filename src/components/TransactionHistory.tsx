import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { supabase } from "@/integrations/supabase/client"
import { TrendingUp, TrendingDown, Clock } from "lucide-react"

interface TransactionHistoryProps {
  userId: string
}

export const TransactionHistory = ({ userId }: TransactionHistoryProps) => {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTransactions()

    // Listen para atualizações
    const handleUpdate = () => loadTransactions()
    window.addEventListener("depositApproved", handleUpdate)
    window.addEventListener("balanceUpdated", handleUpdate)

    return () => {
      window.removeEventListener("depositApproved", handleUpdate)
      window.removeEventListener("balanceUpdated", handleUpdate)
    }
  }, [userId])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      // Carregar depósitos do Supabase
      const { data, error } = await (supabase
        .from("deposits")
        .select("*")
        .eq("usuario_id", userId)
        .order("created_at", { ascending: false }) as any)

      if (error) throw error

      // Transformar depósitos em transações
      const formattedTransactions = (data || []).map((d: any) => ({
        id: d.id,
        userId: d.usuario_id,
        type: "deposit",
        amount: Number(d.valor),
        status: d.status === "pendente" ? "pending" : d.status === "aprovado" ? "approved" : "rejected",
        description: `Depósito via ${d.metodo === "bank_transfer" ? "Banco BAI" : "Multicaixa Express"}`,
        createdAt: d.created_at,
        approvedAt: d.data_aprovacao,
      }))

      setTransactions(formattedTransactions)
    } catch (error) {
      console.error("Erro ao carregar histórico:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      approved: "default",
      pending: "secondary",
      rejected: "destructive",
      completed: "default"
    }
    return variants[status] || "outline"
  }

  const getTypeIcon = (type: string) => {
    return type === "deposit" ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
          <CardDescription>Carregando...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
          <CardDescription>Nenhuma transação registrada</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">Seus depósitos aparecerão aqui</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Transações</CardTitle>
        <CardDescription>Todas as suas transações ({transactions.length})</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Valor (Kz)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="flex items-center gap-2">
                    {getTypeIcon(tx.type)}
                    <span className="capitalize">{tx.type === "deposit" ? "Depósito" : tx.type}</span>
                  </TableCell>
                  <TableCell>{tx.description}</TableCell>
                  <TableCell className="text-right font-semibold">{Number(tx.amount).toLocaleString("pt-PT")}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(tx.status)}>
                      {tx.status === "approved" && "Aprovado"}
                      {tx.status === "pending" && "Pendente"}
                      {tx.status === "rejected" && "Rejeitado"}
                      {tx.status === "completed" && "Concluído"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(tx.createdAt).toLocaleDateString("pt-PT")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
