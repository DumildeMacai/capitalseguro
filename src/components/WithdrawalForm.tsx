"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

export const WithdrawalForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState("")
  const [withdrawalMethod, setWithdrawalMethod] = useState<"bank_transfer" | "multicaixa">("bank_transfer")
  const [bankAccount, setBankAccount] = useState("")
  const [bankName, setBankName] = useState("")
  const [multicaixaNumber, setMulticaixaNumber] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [saldo, setSaldo] = useState(0)
  const [userId, setUserId] = useState("")

  // Load user balance
  useEffect(() => {
    ;(async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        setUserId(user.id)

        // Select all fields like in InvestorDashboard
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        if (error) {
          console.error("Erro ao carregar perfil:", error)
          return
        }

        if (profileData && profileData.saldo_disponivel !== undefined) {
          const saldoCarregado = Number(profileData.saldo_disponivel) || 0
          setSaldo(saldoCarregado)
        }
      } catch (err) {
        console.error("Erro ao carregar saldo:", err)
      }
    })()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const withdrawAmount = parseFloat(amount)

    if (!amount || withdrawAmount <= 0) {
      toast({ title: "Erro", description: "Valor deve ser maior que 0", variant: "destructive" })
      return
    }

    // Validar saldo mínimo de 5000 Kz
    if (saldo < 5000) {
      const mensagem = saldo === 0 
        ? "Saldo insuficiente. Você deve ter no mínimo 5.000,00 Kz para sacar"
        : `Saldo insuficiente. Deve ter no mínimo 5.000,00 Kz. Saldo disponível: Kz ${saldo.toFixed(2)}`
      toast({ title: "Erro", description: mensagem, variant: "destructive" })
      return
    }

    // Validar valor mínimo de saque de 5000 Kz
    if (withdrawAmount < 5000) {
      toast({ title: "Erro", description: "Valor mínimo de saque: 5.000,00 Kz", variant: "destructive" })
      return
    }

    if (withdrawAmount > saldo) {
      toast({ title: "Erro", description: `Saldo insuficiente. Disponível: Kz ${saldo.toFixed(2)}`, variant: "destructive" })
      return
    }

    if (withdrawalMethod === "bank_transfer" && !bankAccount) {
      toast({ title: "Erro", description: "IBAN é obrigatório", variant: "destructive" })
      return
    }

    if (withdrawalMethod === "bank_transfer" && !bankName) {
      toast({ title: "Erro", description: "Nome do banco é obrigatório", variant: "destructive" })
      return
    }

    if (withdrawalMethod === "multicaixa" && !multicaixaNumber) {
      toast({ title: "Erro", description: "Número de telefone/conta é obrigatório para Multicaixa", variant: "destructive" })
      return
    }

    if (withdrawalMethod === "multicaixa" && !/^\d+$/.test(multicaixaNumber)) {
      toast({ title: "Erro", description: "Número de Multicaixa deve conter apenas números", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      // Registrar solicitação de saque
      const { error: withdrawError } = await supabase
        .from("saques")
        .insert({
          usuario_id: userId,
          valor: withdrawAmount,
          metodo_pagamento: withdrawalMethod,
          numero_conta: withdrawalMethod === "bank_transfer" ? bankAccount : multicaixaNumber,
          nome_banco: withdrawalMethod === "bank_transfer" ? bankName : null,
          status: "pendente",
        })

      if (withdrawError) throw withdrawError

      // Atualizar saldo do usuário (deduzir o valor)
      const newBalance = saldo - withdrawAmount
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ saldo_disponivel: newBalance })
        .eq("id", userId)

      if (updateError) throw updateError

      setSubmitted(true)
      toast({ title: "Sucesso", description: "Solicitação de saque enviada!" })

      // Disparar evento
      window.dispatchEvent(new Event("withdrawalRequested"))

      if (onSuccess) {
        onSuccess()
      }

      setTimeout(() => {
        navigate("/investidor")
      }, 2000)
    } catch (error: any) {
      console.error("Erro ao processar saque:", error)
      toast({ title: "Erro", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 />
            Saque Solicitado!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Seu saque de <strong>Kz {parseFloat(amount).toLocaleString("pt-PT")}</strong> foi registado.
          </p>
          <p className="text-sm text-muted-foreground">
            O administrador irá processar sua solicitação. Você receberá uma notificação quando o saque for aprovado.
          </p>
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm">
            <p className="font-semibold text-blue-900 dark:text-blue-100">Próximos Passos:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1 text-blue-800 dark:text-blue-200">
              <li>Admin processará sua solicitação</li>
              <li>Você receberá uma confirmação por email</li>
              <li>A transferência será feita para sua conta</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Sacar Fundos</CardTitle>
        <CardDescription>
          Saldo Disponível: <strong>Kz {saldo.toLocaleString("pt-PT")}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Saldo Disponível Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Saldo Disponível para Saque</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              Kz {saldo.toLocaleString("pt-PT")}
            </p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Valor Mínimo para Saque</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              Kz 5.000,00
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Valor */}
          <div className="space-y-2">
            <Label htmlFor="amount">Valor a Sacar (Kz)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="10000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="1000"
              max={saldo}
              disabled={loading}
              data-testid="input-withdrawal-amount"
            />
            <p className="text-xs text-muted-foreground">Máximo disponível: Kz {saldo.toLocaleString("pt-PT")}</p>
          </div>

          {/* Método de Pagamento */}
          <div className="space-y-3">
            <Label>Método de Pagamento</Label>
            <RadioGroup value={withdrawalMethod} onValueChange={(val: any) => setWithdrawalMethod(val)}>
              {/* Banco BAI */}
              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="bank_transfer" id="bank_transfer_w" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="bank_transfer_w" className="font-semibold cursor-pointer">
                    Transferência Bancária - Banco BAI
                  </Label>
                </div>
              </div>

              {/* Multicaixa */}
              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="multicaixa" id="multicaixa_w" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="multicaixa_w" className="font-semibold cursor-pointer">
                    Multicaixa Express
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Número de Conta/IBAN */}
          {withdrawalMethod === "bank_transfer" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Nome do Banco *</Label>
                <Input
                  id="bankName"
                  type="text"
                  placeholder="Ex: Banco BAI, BIC, BFA, etc"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  disabled={loading}
                  data-testid="input-bank-name"
                />
                <p className="text-xs text-muted-foreground">Informe o nome da instituição bancária</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankAccount">IBAN *</Label>
                <Input
                  id="bankAccount"
                  type="text"
                  placeholder="AO06 0040 0000 1433 6637 1018 6"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value.toUpperCase())}
                  disabled={loading}
                  data-testid="input-bank-account"
                />
                <p className="text-xs text-muted-foreground">Informe a conta IBAN para transferência</p>
              </div>
            </div>
          )}

          {withdrawalMethod === "multicaixa" && (
            <div className="space-y-2">
              <Label htmlFor="multicaixaAccount">Número de Telefone/Conta *</Label>
              <Input
                id="multicaixaAccount"
                type="text"
                placeholder="Ex: 923456789"
                value={multicaixaNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "")
                  setMulticaixaNumber(value)
                }}
                disabled={loading}
                data-testid="input-multicaixa-account"
              />
              <p className="text-xs text-muted-foreground">Informe seu número de conta Multicaixa (apenas números)</p>
            </div>
          )}

          {/* Aviso Importante */}
          <div className="flex gap-3 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900 dark:text-amber-100">
              <p className="font-semibold mb-1">Informações Importantes:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Verifique os dados da conta antes de confirmar</li>
                <li>O admin processará sua solicitação em até 24h</li>
                <li>Você não poderá investir até completar o saque</li>
              </ul>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={
                loading ||
                !amount ||
                (withdrawalMethod === "bank_transfer" && (!bankAccount || !bankName)) ||
                (withdrawalMethod === "multicaixa" && !multicaixaNumber)
              }
              className="flex-1"
              data-testid="button-submit-withdrawal"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Processando..." : "Solicitar Saque"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/investidor")}
              disabled={loading}
              data-testid="button-cancel-withdrawal"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
