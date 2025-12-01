"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, XCircle, Loader2, Clock, Eye, Download } from "lucide-react"
import { Deposit } from "@/types/deposit"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export const AdminDeposits = () => {
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [loading, setLoading] = useState(true)
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDownloadReceipt = (receiptUrl: string) => {
    try {
      const link = document.createElement("a")
      link.href = receiptUrl
      link.download = `comprovante-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast({ title: "Sucesso", description: "Comprovante baixado com sucesso" })
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível baixar o comprovante", variant: "destructive" })
    }
  }

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
      const { data, error } = await (supabase
        .from("depositos")
        .select("*")
        .order("data_criacao", { ascending: false }) as any)

      if (error) throw error

      const formattedDeposits: Deposit[] = (data || []).map((d: any) => ({
        id: d.id,
        userId: d.usuario_id,
        amount: Number(d.valor),
        paymentMethod: d.metodo_pagamento === "bank_transfer" ? "bank_transfer" : "multicaixa",
        receiptUrl: d.comprovante_url,
        status: d.status === "pendente" ? "pending" : d.status === "aprovado" ? "approved" : "rejected",
        createdAt: d.data_criacao,
        approvedAt: d.data_aprovacao,
        approvedBy: d.aprovado_por,
        rejectionReason: d.motivo_rejeicao,
      }))
      setDeposits(formattedDeposits)
      setLoading(false)
    } catch (error: any) {
      console.error("Erro ao carregar depósitos:", error)
      setLoading(false)
    }
  }

  const handleApprove = async (depositId: string) => {
    setApprovingId(depositId)
    try {
      const deposit = deposits.find((d) => d.id === depositId)
      if (!deposit) throw new Error("Depósito não encontrado")

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Admin não autenticado")

      const approvedAt = new Date().toISOString()

      // Atualizar depósito em Supabase
      const { error: depositError } = await (supabase
        .from("depositos")
        .update({
          status: "aprovado",
          data_aprovacao: approvedAt,
          aprovado_por: user.id,
        })
        .eq("id", depositId) as any)

      if (depositError) throw depositError

      // Tentar atualizar saldo do investidor - com fallback se coluna não existir
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("saldo_disponivel")
          .eq("id", deposit.userId)
          .single()

        if (!profileError && profileData) {
          const currentBalance = Number(profileData.saldo_disponivel || 0)
          const newBalance = currentBalance + deposit.amount

          await supabase
            .from("profiles")
            .update({ saldo_disponivel: newBalance })
            .eq("id", deposit.userId)
        }
      } catch (balanceErr) {
        // Silencioso - não quebra a aprovação se houver erro
        console.warn("Aviso: Não foi possível atualizar saldo do investidor:", balanceErr)
      }

      toast({ title: "Sucesso", description: `Depósito de Kz ${deposit.amount.toLocaleString("pt-PT")} aprovado com sucesso!` })
      loadDeposits()

      // Disparar evento customizado para atualizar dashboard
      window.dispatchEvent(new Event("depositApproved"))
      window.dispatchEvent(new Event("balanceUpdated"))
      // Disparar para investimentos também (em caso de aprovação de investimentos)
      window.dispatchEvent(new Event("investmentStatusUpdated"))
      window.dispatchEvent(new Event("investmentApproved"))
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
      // Atualizar depósito em Supabase
      const { error } = await (supabase
        .from("depositos")
        .update({
          status: "rejeitado",
        })
        .eq("id", depositId) as any)

      if (error) throw error

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
                <TableHead>Comprovante</TableHead>
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
                    <TableCell>
                      {deposit.receiptUrl ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedReceipt(deposit.receiptUrl || null)}
                          data-testid={`button-view-receipt-${deposit.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
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

        {/* Receipt Modal */}
        <Dialog open={!!selectedReceipt} onOpenChange={() => setSelectedReceipt(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle>Comprovante de Transferência</DialogTitle>
                  <DialogDescription>
                    {selectedReceipt?.startsWith("data:application/pdf") 
                      ? "Documento PDF enviado pelo investidor" 
                      : "Foto do comprovante enviado pelo investidor"}
                  </DialogDescription>
                </div>
                {selectedReceipt && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadReceipt(selectedReceipt)}
                    data-testid="button-download-receipt"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Baixar
                  </Button>
                )}
              </div>
            </DialogHeader>
            {selectedReceipt && (
              <div className="flex justify-center">
                {selectedReceipt.startsWith("data:application/pdf") ? (
                  <div className="w-full bg-muted p-8 rounded-lg border border-border flex items-center justify-center min-h-96">
                    <div className="text-center">
                      <div className="text-4xl mb-3">📄</div>
                      <p className="font-semibold mb-2">Documento PDF</p>
                      <p className="text-sm text-muted-foreground mb-4">Clique em "Baixar" para visualizar o documento</p>
                      <Button
                        size="sm"
                        onClick={() => handleDownloadReceipt(selectedReceipt)}
                        data-testid="button-view-pdf"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Baixar PDF
                      </Button>
                    </div>
                  </div>
                ) : (
                  <img 
                    src={selectedReceipt} 
                    alt="Comprovante" 
                    className="max-w-full max-h-96 rounded-lg border border-border"
                  />
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default AdminDeposits
