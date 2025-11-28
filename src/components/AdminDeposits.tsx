"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, XCircle, Loader2, Clock } from "lucide-react"
import { Deposit } from "@/types/deposit"

export const AdminDeposits = () => {
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [loading, setLoading] = useState(true)
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadDeposits()
    
    // Polling automático a cada 3 segundos
    const interval = setInterval(() => {
      loadDeposits()
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  const loadDeposits = async () => {
    try {
      // Carregar de localStorage (MockData) - com reload forçado
      const depositsRaw = localStorage.getItem("deposits") || "[]"
      const deposits = JSON.parse(depositsRaw)
      setDeposits(deposits)
      setLoading(false)
      // TODO: Integrar com Supabase quando tabela existir
    } catch (error: any) {
      console.error("Erro ao carregar depósitos:", error)
      setLoading(false)
      // Não mostrar toast em polling para não irritar o user
    }
  }

  const handleApprove = async (depositId: string) => {
    setApprovingId(depositId)
    try {
      const deposit = deposits.find((d) => d.id === depositId)
      if (!deposit) throw new Error("Depósito não encontrado")

      // Atualizar depósitos
      const updatedDeposits = deposits.map((d: any) =>
        d.id === depositId
          ? { ...d, status: "approved", approvedAt: new Date().toISOString() }
          : d
      )
      localStorage.setItem("deposits", JSON.stringify(updatedDeposits))

      // Atualizar saldo do investidor
      const userBalances = JSON.parse(localStorage.getItem("userBalances") || "{}")
      const currentBalance = userBalances[deposit.userId] || 0
      userBalances[deposit.userId] = currentBalance + deposit.amount
      localStorage.setItem("userBalances", JSON.stringify(userBalances))

      // Criar histórico de transação
      const transactions = JSON.parse(localStorage.getItem("transactions") || "[]")
      transactions.push({
        id: `tx-${Date.now()}`,
        userId: deposit.userId,
        type: "deposit",
        amount: deposit.amount,
        status: "approved",
        description: `Depósito aprovado - ${deposit.paymentMethod === 'bank_transfer' ? 'Banco BAI' : 'Multicaixa'}`,
        createdAt: deposit.createdAt,
        approvedAt: new Date().toISOString(),
        relatedDepositId: depositId
      })
      localStorage.setItem("transactions", JSON.stringify(transactions))

      toast({ title: "Sucesso", description: `Depósito de Kz ${deposit.amount} aprovado! Saldo atualizado.` })
      loadDeposits()
      
      // Disparar evento customizado para atualizar dashboard
      window.dispatchEvent(new Event("depositApproved"))
      window.dispatchEvent(new Event("balanceUpdated"))
    } catch (error: any) {
      console.error("Erro ao aprovar depósito:", error)
      toast({ title: "Erro", description: error.message, variant: "destructive" })
    } finally {
      setApprovingId(null)
    }
  }

  const handleReject = async (depositId: string) => {
    setApprovingId(depositId)
    try {
      // Atualizar localStorage
      const updatedDeposits = deposits.map((d: any) =>
        d.id === depositId ? { ...d, status: "rejected" } : d
      )
      localStorage.setItem("deposits", JSON.stringify(updatedDeposits))

      toast({ title: "Sucesso", description: "Depósito rejeitado" })
      loadDeposits()
      
      // Disparar evento customizado
      window.dispatchEvent(new Event("depositRejected"))
    } catch (error: any) {
      console.error("Erro ao rejeitar depósito:", error)
      toast({ title: "Erro", description: error.message, variant: "destructive" })
    } finally {
      setApprovingId(null)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-10 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Depósitos Pendentes</CardTitle>
        <CardDescription>Aprove ou rejeite solicitações de depósito</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilizador ID</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deposits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Nenhum depósito encontrado
                  </TableCell>
                </TableRow>
              ) : (
                deposits.map((deposit) => (
                  <TableRow key={deposit.id}>
                    <TableCell className="font-mono text-sm">{deposit.userId.slice(0, 8)}...</TableCell>
                    <TableCell className="text-right font-semibold">
                      Kz {deposit.amount.toLocaleString("pt-PT")}
                    </TableCell>
                    <TableCell>
                      {deposit.paymentMethod === "bank_transfer" ? "Banco BAI" : "Multicaixa"}
                    </TableCell>
                    <TableCell>
                      {deposit.status === "pending" && (
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          <Clock className="h-3 w-3" />
                          Pendente
                        </Badge>
                      )}
                      {deposit.status === "approved" && (
                        <Badge className="bg-emerald-600 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="h-3 w-3" />
                          Aprovado
                        </Badge>
                      )}
                      {deposit.status === "rejected" && (
                        <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                          <XCircle className="h-3 w-3" />
                          Rejeitado
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(deposit.createdAt).toLocaleDateString("pt-PT")}
                    </TableCell>
                    <TableCell className="text-right">
                      {deposit.status === "pending" && (
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(deposit.id)}
                            disabled={approvingId === deposit.id}
                            className="bg-emerald-600 hover:bg-emerald-700"
                            data-testid={`button-approve-deposit-${deposit.id}`}
                          >
                            {approvingId === deposit.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              "Aprovar"
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(deposit.id)}
                            disabled={approvingId === deposit.id}
                            data-testid={`button-reject-deposit-${deposit.id}`}
                          >
                            Rejeitar
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default AdminDeposits
