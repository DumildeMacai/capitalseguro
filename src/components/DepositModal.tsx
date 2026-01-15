import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Upload, CreditCard, Building2 } from "lucide-react"

interface DepositModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DepositModal({ open, onOpenChange }: DepositModalProps) {
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState<"bai" | "express">("express")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleDeposit = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Por favor, insira um valor válido.")
      return
    }
    if (!file) {
      toast.error("Por favor, envie o comprovativo do depósito.")
      return
    }

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não autenticado")

      // 1. Upload file
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from("comprovativos")
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // 2. Create deposit record
      const { error: depositError } = await supabase
        .from("deposits")
        .insert({
          usuario_id: user.id,
          valor: Number(amount),
          metodo: method === "bai" ? "Banco BAI" : "Multicaixa Express",
          comprovativo_url: fileName,
          status: "Pendente"
        })

      if (depositError) throw depositError

      toast.success("Depósito solicitado com sucesso! Aguarde a aprovação do administrador.")
      onOpenChange(false)
      setAmount("")
      setFile(null)
    } catch (error: any) {
      console.error(error)
      toast.error("Erro ao solicitar depósito: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Depósito</DialogTitle>
          <DialogDescription>
            Escolha o método e envie o comprovativo para adicionar saldo à sua conta.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Valor (Kz)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Ex: 5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Método de Pagamento</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={method === "express" ? "default" : "outline"}
                className="justify-start gap-2"
                onClick={() => setMethod("express")}
              >
                <CreditCard className="h-4 w-4" />
                MC Express
              </Button>
              <Button
                type="button"
                variant={method === "bai" ? "default" : "outline"}
                className="justify-start gap-2"
                onClick={() => setMethod("bai")}
              >
                <Building2 className="h-4 w-4" />
                Banco BAI
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="receipt">Comprovativo</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
                 onClick={() => document.getElementById("receipt-upload")?.click()}>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {file ? file.name : "Clique para enviar (PDF ou Imagem)"}
              </span>
              <input
                id="receipt-upload"
                type="file"
                className="hidden"
                accept="image/*,application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleDeposit} disabled={loading}>
            {loading ? "Enviando..." : "Confirmar Depósito"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
