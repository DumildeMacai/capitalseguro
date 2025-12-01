import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { calculateReturn } from "@/utils/interestCalculations"

export default function MyApplications() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("inscricoes_investimentos")
        .select("*, investimentos(*)")
        .eq("usuario_id", user.id)
        .order("data_inscricao", { ascending: false })

      if (error) throw error
      setApplications(data || [])
    } catch (err) {
      console.error("Erro ao carregar aplicações:", err)
    } finally {
      setLoading(false)
    }
  }

  const getTipoJurosBadge = (tipo: string) => {
    if (tipo === "composto") return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900">Juros Compostos</Badge>
    return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900">Juros Simples</Badge>
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Carregando aplicações...</p>
        </CardContent>
      </Card>
    )
  }

  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Você ainda não realizou nenhuma aplicação.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Minhas Aplicações</CardTitle>
        <CardDescription>
          Histórico de todos os seus aportes e investimentos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Valor Investido</TableHead>
                <TableHead>Tipo de Juros</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Retorno Estimado (1 ano)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => {
                const daysElapsed = Math.floor(
                  (new Date().getTime() - new Date(app.data_inscricao).getTime()) / (1000 * 60 * 60 * 24)
                ) || 1
                const retorno = calculateReturn(
                  app.valor_investido,
                  0.5,
                  Math.min(daysElapsed, 365),
                  app.tipo_juros || "simples"
                )
                return (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">
                      {app.investimentos?.titulo || "Investimento"}
                    </TableCell>
                    <TableCell>Kz {app.valor_investido.toLocaleString("pt-AO")}</TableCell>
                    <TableCell>
                      {getTipoJurosBadge(app.tipo_juros || "simples")}
                    </TableCell>
                    <TableCell>
                      {new Date(app.data_inscricao).toLocaleDateString("pt-AO")}
                    </TableCell>
                    <TableCell className="text-green-600 font-semibold">
                      Kz {retorno.toLocaleString("pt-AO")}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
