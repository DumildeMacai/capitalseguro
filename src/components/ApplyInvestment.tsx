import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { AlertCircle, DollarSign, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ApplyInvestmentProps {
  investmentId: string
  investmentTitle: string
  minValue: number
  tipoJuros: string
  onSuccess?: () => void
}

export default function ApplyInvestment({
  investmentId,
  investmentTitle,
  minValue,
  tipoJuros,
  onSuccess,
}: ApplyInvestmentProps) {
  const { toast } = useToast()
  const [valor, setValor] = useState("")
  const [loading, setLoading] = useState(false)
  const [saldoDisponivel, setSaldoDisponivel] = useState(0)
  const [jurosType, setJurosType] = useState(tipoJuros || "simples")

  // Load user balance on mount
  const loadBalance = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (error) throw error
      setSaldoDisponivel(data?.saldo_disponivel || 0)
    } catch (err) {
      console.error("Erro ao carregar saldo:", err)
    }
  }

  const handleApply = async () => {
    try {
      const valorNum = parseFloat(valor)

      // Validações
      if (!valor || valorNum <= 0) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Digite um valor válido.",
        })
        return
      }

      if (valorNum < minValue) {
        toast({
          variant: "destructive",
          title: "Valor Mínimo",
          description: `Valor mínimo é Kz ${minValue.toLocaleString("pt-AO")}`,
        })
        return
      }

      if (valorNum > saldoDisponivel) {
        toast({
          variant: "destructive",
          title: "Saldo Insuficiente",
          description: `Seu saldo disponível é Kz ${saldoDisponivel.toLocaleString("pt-AO")}`,
        })
        return
      }

      setLoading(true)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não autenticado")

      // 1. Insert application record (automatically approved - no approval needed)
      const { data: application, error: appError } = await supabase
        .from("inscricoes_investimentos")
        .insert([
          {
            usuario_id: user.id,
            investimento_id: investmentId,
            valor_investido: valorNum,
            tipo_juros: jurosType,
            status: "aprovado",
            data_inscricao: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (appError) throw appError

      // 2. Deduct from balance in two phases (Supabase cache workaround)
      const newBalance = saldoDisponivel - valorNum

      // Phase 1: Update balance
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ saldo_disponivel: newBalance })
        .eq("id", user.id)

      if (updateError) throw updateError

      // Success
      toast({
        title: "Sucesso!",
        description: `Aplicação de Kz ${valorNum.toLocaleString("pt-AO")} realizada com sucesso!`,
      })

      setValor("")
      setSaldoDisponivel(newBalance)

      if (onSuccess) onSuccess()
    } catch (error: any) {
      console.error("Erro ao aplicar:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível realizar a aplicação.",
      })
    } finally {
      setLoading(false)
    }
  }

  // Load balance on component mount
  React.useEffect(() => {
    loadBalance()
  }, [])

  const valorNum = parseFloat(valor) || 0
  const isValid = valorNum >= minValue && valorNum <= saldoDisponivel

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aplicar em {investmentTitle}</CardTitle>
        <CardDescription>
          Você pode investir múltiplas vezes no mesmo produto. Cada aplicação será registrada separadamente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Balance Display */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-md">
            <p className="text-sm text-muted-foreground">Saldo Disponível</p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Kz {saldoDisponivel.toLocaleString("pt-AO")}
            </p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-md">
            <p className="text-sm text-muted-foreground">Valor Mínimo</p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              Kz {minValue.toLocaleString("pt-AO")}
            </p>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="text-sm font-medium">Valor (Kz)</label>
          <Input
            type="number"
            placeholder="Ex: 10000"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Interest Type Selection */}
        <div>
          <label className="text-sm font-medium">Tipo de Juros</label>
          <Select value={jurosType} onValueChange={setJurosType} disabled={loading}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simples">Juros Simples (50% a.a.)</SelectItem>
              <SelectItem value="composto">Juros Compostos (50% a.a.)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Return Calculation Preview */}
        {isValid && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-md">
            <p className="text-sm text-muted-foreground">Retorno Estimado (1 ano)</p>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
              Kz {(valorNum * 0.5).toLocaleString("pt-AO")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              + 50% de retorno anual garantido
            </p>
          </div>
        )}

        {/* Warnings */}
        {valor && !isValid && (
          <div className="flex gap-2 p-3 bg-red-50 dark:bg-red-950 rounded-md">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">
              {valorNum < minValue
                ? `Valor mínimo é Kz ${minValue.toLocaleString("pt-AO")}`
                : `Saldo insuficiente`}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleApply}
          disabled={loading || !valor || !isValid}
          className="w-full"
          size="lg"
        >
          {loading ? "Processando..." : `Aplicar Kz ${valorNum.toLocaleString("pt-AO")}`}
        </Button>

        {/* Info */}
        <div className="text-xs text-muted-foreground space-y-1 p-3 bg-slate-50 dark:bg-slate-900 rounded-md">
          <p className="flex gap-2 items-start">
            <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
            Cada aplicação é registrada como uma operação separada
          </p>
          <p className="flex gap-2 items-start">
            <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
            Você pode investir quantas vezes quiser no mesmo produto
          </p>
          <p className="flex gap-2 items-start">
            <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
            Saldo será deduzido automaticamente de sua conta
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
