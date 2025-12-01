import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { calculateReturn } from "@/utils/interestCalculations"

interface ConsolidatedInvestment {
  investmentId: string
  investmentTitle: string
  totalInvested: number
  totalReturn: number
  numberOfApplications: number
  firstDate: string
  lastDate: string
  tipoRenda: string
}

export default function ConsolidatedStatement() {
  const [consolidated, setConsolidated] = useState<ConsolidatedInvestment[]>([])
  const [loading, setLoading] = useState(true)
  const [grandTotal, setGrandTotal] = useState(0)
  const [grandReturn, setGrandReturn] = useState(0)

  useEffect(() => {
    loadConsolidated()
  }, [])

  const loadConsolidated = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get all applications for this user
      const { data, error } = await supabase
        .from("inscricoes_investimentos")
        .select("*, investimentos(*)")
        .eq("usuario_id", user.id)
        .order("data_inscricao", { ascending: true })

      if (error) throw error

      // Group by investment
      const groupedMap = new Map<string, any>()

      data?.forEach((app: any) => {
        const key = app.investimento_id
        if (!groupedMap.has(key)) {
          groupedMap.set(key, {
            investmentId: app.investimento_id,
            investmentTitle: app.investimentos?.titulo || "Investimento",
            applications: [],
            tipoRenda: app.investimentos?.tipo_renda || "fixa",
          })
        }
        groupedMap.get(key).applications.push(app)
      })

      // Calculate consolidated data
      let totalInvested = 0
      let totalReturn = 0
      const consolidated: ConsolidatedInvestment[] = []

      groupedMap.forEach((group) => {
        let groupTotalInvested = 0
        let groupTotalReturn = 0

        group.applications.forEach((app: any) => {
          groupTotalInvested += app.valor_investido || 0

          // Calculate return for this application
          const daysElapsed = Math.floor(
            (new Date().getTime() - new Date(app.data_inscricao).getTime()) / (1000 * 60 * 60 * 24)
          ) || 1
          const appReturn = calculateReturn(
            app.valor_investido,
            0.5,
            Math.min(daysElapsed, 365),
            app.tipo_juros || "simples"
          )
          groupTotalReturn += appReturn
        })

        consolidated.push({
          investmentId: group.investmentId,
          investmentTitle: group.investmentTitle,
          totalInvested: groupTotalInvested,
          totalReturn: groupTotalReturn,
          numberOfApplications: group.applications.length,
          firstDate: group.applications[0]?.data_inscricao || "",
          lastDate: group.applications[group.applications.length - 1]?.data_inscricao || "",
          tipoRenda: group.tipoRenda,
        })

        totalInvested += groupTotalInvested
        totalReturn += groupTotalReturn
      })

      setConsolidated(consolidated)
      setGrandTotal(totalInvested)
      setGrandReturn(totalReturn)
    } catch (err) {
      console.error("Erro ao carregar extrato consolidado:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Carregando extrato...</p>
        </CardContent>
      </Card>
    )
  }

  if (consolidated.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Nenhum investimento registrado.</p>
        </CardContent>
      </Card>
    )
  }

  const getTipoRendaBadge = (tipo: string) => {
    const colors: { [key: string]: string } = {
      fixa: "bg-blue-100 text-blue-800 dark:bg-blue-900",
      variavel: "bg-purple-100 text-purple-800 dark:bg-purple-900",
      passiva: "bg-green-100 text-green-800 dark:bg-green-900",
    }
    const labels: { [key: string]: string } = {
      fixa: "Renda Fixa",
      variavel: "Renda Variável",
      passiva: "Renda Passiva",
    }
    return <Badge className={colors[tipo] || colors.fixa}>{labels[tipo] || tipo}</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Extrato Consolidado</CardTitle>
        <CardDescription>
          Resumo consolidado de todos os seus investimentos agrupados por produto
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Grand Totals */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Investido</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                Kz {grandTotal.toLocaleString("pt-AO")}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg">
              <p className="text-sm text-muted-foreground">Retorno Acumulado</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                Kz {grandReturn.toLocaleString("pt-AO")}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 rounded-lg">
              <p className="text-sm text-muted-foreground">Total com Retorno</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                Kz {(grandTotal + grandReturn).toLocaleString("pt-AO")}
              </p>
            </div>
          </div>

          {/* Investments Table */}
          <div className="overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Investimento</TableHead>
                  <TableHead>Tipo Renda</TableHead>
                  <TableHead className="text-right">Total Investido</TableHead>
                  <TableHead className="text-right">Retorno</TableHead>
                  <TableHead className="text-right">Aportes</TableHead>
                  <TableHead className="text-xs">Período</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consolidated.map((inv) => (
                  <TableRow key={inv.investmentId}>
                    <TableCell className="font-medium">{inv.investmentTitle}</TableCell>
                    <TableCell>{getTipoRendaBadge(inv.tipoRenda)}</TableCell>
                    <TableCell className="text-right font-semibold">
                      Kz {inv.totalInvested.toLocaleString("pt-AO")}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-600 dark:text-green-400">
                      Kz {inv.totalReturn.toLocaleString("pt-AO")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{inv.numberOfApplications}x</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(inv.firstDate).toLocaleDateString("pt-AO")} até{" "}
                      {new Date(inv.lastDate).toLocaleDateString("pt-AO")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Summary */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-2 text-sm">
            <p className="font-semibold text-foreground">
              Total de {consolidated.length} investimento(s) com {consolidated.reduce((acc, inv) => acc + inv.numberOfApplications, 0)} aporte(s)
            </p>
            <p className="text-muted-foreground">
              Rentabilidade média: {((grandReturn / grandTotal) * 100).toFixed(2)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
