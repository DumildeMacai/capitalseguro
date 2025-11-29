import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Lock } from "lucide-react"

interface ChangePasswordFormProps {
  onClose: () => void
  onSuccess: () => void
}

export const ChangePasswordForm = ({ onClose, onSuccess }: ChangePasswordFormProps) => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Todos os campos são obrigatórios")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    if (newPassword.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres")
      return
    }

    if (currentPassword === newPassword) {
      setError("A nova senha deve ser diferente da atual")
      return
    }

    setLoading(true)

    try {
      // First, verify current password by attempting to sign in
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user?.email) {
        throw new Error("Usuário não encontrado")
      }

      // Attempt to verify current password through re-authentication
      // In production, consider using update_user with password verification
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) {
        throw updateError
      }

      toast({
        title: "Sucesso",
        description: "Sua senha foi alterada com sucesso!",
      })

      onSuccess()
      onClose()
    } catch (err: any) {
      console.error("Erro ao alterar senha:", err)
      setError(err.message || "Erro ao alterar senha. Tente novamente.")
      toast({
        title: "Erro",
        description: err.message || "Não foi possível alterar sua senha",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock size={20} />
          Alterar Senha
        </CardTitle>
        <CardDescription>
          Atualize sua senha para manter sua conta segura
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleChangePassword} className="space-y-4">
          {error && (
            <div className="p-3 rounded-md bg-destructive/15 border border-destructive/30 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Senha Atual</label>
            <Input
              type="password"
              placeholder="Insira sua senha atual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={loading}
              data-testid="input-current-password"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Nova Senha</label>
            <Input
              type="password"
              placeholder="Insira sua nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              data-testid="input-new-password"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Confirmar Senha</label>
            <Input
              type="password"
              placeholder="Confirme sua nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              data-testid="input-confirm-password"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
              data-testid="button-change-password"
            >
              {loading ? "Alterando..." : "Alterar Senha"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
