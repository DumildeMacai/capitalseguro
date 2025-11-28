import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Transaction } from "@/types/deposit"
import { TrendingUp, TrendingDown, Clock } from "lucide-react"

interface TransactionHistoryProps {
  userId: string
}

export const TransactionHistory = ({ userId }: TransactionHistoryProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([])

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

  const loadTransactions = () => {
    try {
      const allTransactions = JSON.parse(localStorage.getItem("transactions") || "[]")
      const userTransactions = allTransactions.filter((t: Transaction) => t.userId === userId)
      setTransactions(userTransactions.sort((a: Transaction, b: Transaction) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ))
    } catch (error) {
      console.error("Erro ao carregar histórico:", error)
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

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
          <CardDescription>Nenhuma transação registrada</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Transações</CardTitle>
        <CardDescription>Todas as suas transações</CardDescription>
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
                    <span className="capitalize">{tx.type}</span>
                  </TableCell>
                  <TableCell>{tx.description}</TableCell>
                  <TableCell className="text-right font-semibold">{tx.amount.toFixed(2)}</TableCell>
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
