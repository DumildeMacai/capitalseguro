"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { getRedirectPath, handleAuthError } from "@/utils/authUtils"

const loginFormSchema = z.object({
  email: z.string().email({
    message: "Por favor, insira um email válido.",
  }),
  password: z.string().min(1, {
    message: "Por favor, insira uma senha.",
  }),
})

type LoginFormValues = z.infer<typeof loginFormSchema>

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: LoginFormValues) => {
    try {
      console.log("[v0] Tentando login para:", values.email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (error) {
        console.error("[v0] Erro no login:", error)
        throw error
      }

      console.log("[v0] Login bem-sucedido para:", values.email)
      console.log("[v0] User ID:", data.user?.id)

      if (data.user) {
        // Verificar tipo de usuário usando RPC
        let userType: "admin" | "parceiro" | "investidor" | null = null

        try {
          console.log("[v0] Buscando tipo de usuário para user_id:", data.user.id)

          const { data: userTypeData, error: userTypeError } = await supabase.rpc("get_user_type", {
            user_id: data.user.id,
          })

          console.log("[v0] Resposta da RPC get_user_type:", userTypeData)
          console.log("[v0] Erro da RPC get_user_type:", userTypeError)

          if (userTypeError) {
            console.error("[v0] Erro ao buscar tipo de usuário:", userTypeError)
          } else if (userTypeData) {
            // Garantir que é uma string válida
            userType = (userTypeData as string).toLowerCase() as "admin" | "parceiro" | "investidor"
            console.log("[v0] Tipo de usuário processado:", userType)
          }
        } catch (userTypeError) {
          console.error("[v0] Exceção ao buscar tipo de usuário:", userTypeError)
        }

        console.log("[v0] userType final:", userType)

        // Redirecionar com base no tipo de usuário
        const redirectPath = getRedirectPath(userType)
        console.log("[v0] Redirecionando para:", redirectPath)
        navigate(redirectPath)

        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo de volta!",
        })
      }
    } catch (error) {
      handleAuthError(error as Error, toast)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="seu@email.com" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    autoComplete="current-password"
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading} className="w-full" type="submit">
          {isLoading ? "Verificando..." : "Entrar"}
        </Button>
      </form>
    </Form>
  )
}
