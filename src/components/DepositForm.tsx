"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { useRateLimit } from "@/hooks/useRateLimit"
import { AlertCircle, CheckCircle2, Loader2, Upload } from "lucide-react"

export const DepositForm = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"bank_transfer" | "multicaixa">("bank_transfer")
  const [receipt, setReceipt] = useState<string | null>(null)
  const [receiptFileName, setReceiptFileName] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const { isAllowed } = useRateLimit("deposit", "")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"]
    if (!allowedTypes.includes(file.type)) {
      toast({ title: "Erro", description: "Formato inválido. Use PNG, JPG, JPEG ou PDF", variant: "destructive" })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Erro", description: "Arquivo deve ser menor que 5MB", variant: "destructive" })
      return
    }

    setReceiptFileName(file.name)
    const reader = new FileReader()
    reader.onload = (event) => {
      setReceipt(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || parseFloat(amount) <= 0) {
      toast({ title: "Erro", description: "Valor deve ser maior que 0", variant: "destructive" })
      return
    }

    if (!receipt) {
      toast({ title: "Erro", description: "Comprovante de transferência é obrigatório", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Utilizador não autenticado")

      // Verificar rate limiting (limitador client-side)
      const depositLimiterCheck = isAllowed()
      if (!depositLimiterCheck) {
        throw new Error("Limite de requisições atingido. Tente novamente em alguns minutos.")
      }

      // Inserir depósito em Supabase
      const { error: insertError } = await supabase
        .from("depositos")
        .insert({
          usuario_id: user.id,
          valor: parseFloat(amount),
          metodo: paymentMethod, // Alinhado com o erro 42703 (record "new" has no field "metodo") que sugere que o trigger espera 'metodo'
          comprovante_url: receipt,
          status: "pendente",
        } as any) // Using any to bypass TS error if 'metodo' is not in types yet

      if (insertError) throw insertError

      setSubmitted(true)
      toast({ title: "Sucesso", description: "Depósito solicitado! Aguardando aprovação do admin." })

      // Disparar evento para notificar admin em tempo real
      window.dispatchEvent(new Event("newDepositRequest"))

      setTimeout(() => {
        navigate("/investidor")
      }, 2000)
    } catch (error: any) {
      console.error("Erro ao submeter depósito:", error)
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
            Depósito Solicitado!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Seu depósito de <strong>Kz {parseFloat(amount).toLocaleString("pt-PT")}</strong> foi registado.
          </p>
          <p className="text-sm text-muted-foreground">
            O administrador irá revisar sua solicitação. Você receberá uma notificação quando o depósito for aprovado.
          </p>
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm">
            <p className="font-semibold text-blue-900 dark:text-blue-100">Próximos Passos:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1 text-blue-800 dark:text-blue-200">
              <li>Complete a transferência para a conta indicada</li>
              <li>Aguarde confirmação do admin</li>
              <li>Seu saldo será atualizado automaticamente</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Depositar Fundos</CardTitle>
        <CardDescription>Escolha o método de pagamento e informe o valor que deseja depositar</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Valor */}
          <div className="space-y-2">
            <Label htmlFor="amount">Valor a Depositar (Kz)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="1000000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="1000"
              disabled={loading}
              data-testid="input-deposit-amount"
            />
            <p className="text-xs text-muted-foreground">Mínimo: Kz 10.000</p>
          </div>

          {/* Método de Pagamento */}
          <div className="space-y-3">
            <Label>Método de Pagamento</Label>
            <RadioGroup value={paymentMethod} onValueChange={(val: any) => setPaymentMethod(val)}>
              {/* Banco BAI */}
              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="bank_transfer" id="bank_transfer" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="bank_transfer" className="font-semibold cursor-pointer">
                    Transferência Bancária - Banco BAI
                  </Label>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground bg-muted p-3 rounded">
                    <p>
                      <span className="font-semibold">IBAN:</span> AO06 0040 0000 1433 6637 1018 6
                    </p>
                  </div>
                </div>
              </div>

              {/* Multicaixa */}
              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="multicaixa" id="multicaixa" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="multicaixa" className="font-semibold cursor-pointer">
                    Multicaixa Express
                  </Label>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground bg-muted p-3 rounded">
                    <p>
                      <span className="font-semibold">Nº:</span> 949360828
                    </p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Upload Comprovante */}
          <div className="space-y-2">
            <Label htmlFor="receipt">Comprovante de Transferência *</Label>
            <div className="relative">
              <Input
                id="receipt"
                type="file"
                accept="image/png,image/jpeg,image/jpg,.pdf"
                onChange={handleFileChange}
                disabled={loading}
                className="cursor-pointer"
                data-testid="input-receipt-upload"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            {receipt && (
              <div className="flex items-center gap-2 p-2 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded text-sm text-emerald-900 dark:text-emerald-100">
                <CheckCircle2 className="h-4 w-4" />
                <span>{receiptFileName}</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground">Máximo 5MB - Formatos: PNG, JPG, JPEG, PDF</p>
          </div>

          {/* Aviso Importante */}
          <div className="flex gap-3 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900 dark:text-amber-100">
              <p className="font-semibold mb-1">Instruções Importantes:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Complete a transferência conforme os dados acima</li>
                <li>Faça upload da foto do comprovante</li>
                <li>O admin aprovará seu depósito após verificação</li>
                <li>Seu saldo será atualizado imediatamente após aprovação</li>
              </ul>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading || !amount || !receipt}
              className="flex-1"
              data-testid="button-submit-deposit"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Processando..." : "Solicitar Depósito"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/investidor")}
              disabled={loading}
              data-testid="button-cancel-deposit"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default DepositForm
