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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (error) {
        throw error
      }

      if (data.user) {
        let userType: "admin" | "parceiro" | "investidor" | null = null

        try {
          const { data: userTypeData, error: userTypeError } = await supabase.rpc("get_user_type", {
            user_id: data.user.id,
          })

          if (!userTypeError && userTypeData) {
            const typeStr = String(userTypeData).toLowerCase()
            if (typeStr === "admin" || typeStr === "parceiro" || typeStr === "investidor") {
              userType = typeStr as "admin" | "parceiro" | "investidor"
            }
          }
        } catch (userTypeError) {
          // Silently fail if RPC not available
        }

        const redirectPath = getRedirectPath(userType)
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
