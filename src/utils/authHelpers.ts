import { supabase } from "@/integrations/supabase/client"
import type { useToast } from "@/hooks/use-toast"
import { handleAuthError, getRedirectPath } from "@/utils/authUtils"
import type { UserType } from "@/types/auth"
import type { NavigateFunction } from "react-router-dom"

const normalizeUserType = (value: unknown): UserType | null => {
  if (typeof value !== "string") return null

  const normalized = value.toLowerCase()

  if (normalized === "admin" || normalized === "parceiro" || normalized === "investidor") {
    return normalized as UserType
  }

  return null
}

export const fetchUserType = async (userId: string, userMetadata?: Record<string, unknown> | null): Promise<UserType | null> => {
  const metadataType = normalizeUserType(userMetadata?.tipo ?? userMetadata?.role)
  if (metadataType) {
    return metadataType
  }

  try {
    const { data, error } = await supabase.rpc("get_user_type", { user_id: userId })

    if (!error && data) {
      return normalizeUserType(data)
    }
  } catch (error) {
    console.warn("RPC get_user_type indisponível, usando fallback:", error)
  }

  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .limit(1)

    if (!error && Array.isArray(data) && data.length > 0) {
      return normalizeUserType(data[0]?.role)
    }
  } catch (error) {
    console.warn("Falha ao consultar user_roles:", error)
  }

  return null
}

export const handleSignIn = async (
  email: string,
  password: string,
  navigate: NavigateFunction,
  toast: ReturnType<typeof useToast>["toast"],
) => {
  try {
    console.log("Attempting login for:", email)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Login error:", error)
      throw error
    }

    console.log("Login successful:", data.user?.id)

    // Fetch user type using RPC
    if (data.user) {
      const userType = await fetchUserType(data.user.id, data.user.user_metadata)

      if (userType) {
        const redirectPath = getRedirectPath(userType)
        console.log("Redirecting to:", redirectPath)
        navigate(redirectPath)

        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!",
        })
      }
    }
  } catch (error: any) {
    console.error("Complete login error:", error)
    handleAuthError(error, toast)
    throw error
  }
}

export const handleSignUp = async (
  email: string,
  password: string,
  userType: "investidor" | "parceiro",
  userData: any,
  navigate: NavigateFunction,
  toast: ReturnType<typeof useToast>["toast"],
) => {
  try {
    console.log("Registration data:", { email, userType, userData })

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          tipo: userType,
          nome: userData.name,
          telefone: userData.phone,
        },
      },
    })

    if (error) {
      console.error("Registration error in auth context:", error)
      throw error
    }

    console.log("User registered in auth context:", data.user?.id)

    // If user was created successfully, handle document uploads and profile update
    if (data.user) {
      await handleDocumentUpload(data.user.id, userData)
      await updateUserProfile(data.user.id, userData, userType)
    }

    toast({
      title: "Cadastro realizado com sucesso",
      description: "Agora você pode fazer login.",
    })

    navigate("/login")
  } catch (error: any) {
    console.error("Complete registration error in auth context:", error)
    handleAuthError(error, toast)
    throw error
  }
}

export const handleDocumentUpload = async (userId: string, userData: any) => {
  try {
    // Upload front document if available
    if (userData.biFront instanceof File) {
      const { error: frontError } = await supabase.storage
        .from("documentos")
        .upload(`${userId}/bi_frente`, userData.biFront)

      if (frontError) console.error("Error uploading front document:", frontError)
    }

    // Upload back document if available
    if (userData.biBack instanceof File) {
      const { error: backError } = await supabase.storage
        .from("documentos")
        .upload(`${userId}/bi_verso`, userData.biBack)

      if (backError) console.error("Error uploading back document:", backError)
    }
  } catch (error) {
    console.error("Error during document upload:", error)
  }
}

export const updateUserProfile = async (userId: string, userData: any, userType: "investidor" | "parceiro") => {
  try {
    const { error: updateError } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        nome_completo: userData.name,
        telefone: userData.phone,
        endereco: userData.address,
        cidade: userData.city,
        provincia: userData.province || "Angola",
        bio: userData.bio || "",
        empresa_nome: userType === "parceiro" && userData.nomeEmpresa ? userData.nomeEmpresa : null,
        ramo_negocio: userType === "parceiro" && userData.ramoAtuacao ? userData.ramoAtuacao : null,
      }, { onConflict: 'id' })

    if (updateError) {
      console.error("Error updating profile:", updateError)
    } else {
      console.log("Profile updated successfully")
    }
  } catch (updateError) {
    console.error("Exception during profile update:", updateError)
  }
}

export const handleSignOut = async (navigate: NavigateFunction, toast: ReturnType<typeof useToast>["toast"]) => {
  try {
    await supabase.auth.signOut()
    navigate("/login")
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    })
  } catch (error: any) {
    handleAuthError(error, toast)
  }
}

/**
 * Smart Admin Access: Try Sign Up first, fallback to Sign In if user exists
 * Then upsert admin profile with full permissions
 */
export const handleAdminAccess = async (
  navigate: NavigateFunction,
  toast: ReturnType<typeof useToast>["toast"],
) => {
  const adminEmail = "admin@admin.com"
  const adminPassword = "1dumilde1@A"
  
  try {
    console.log("[Admin Access] Starting smart admin sign-up/sign-in flow...")
    
    // Step 1: Try to sign up
    let user = null
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          nome: "Administrador",
        },
      },
    })
    
    if (signUpError) {
      if (
        signUpError.message.includes("already registered") || 
        signUpError.message.includes("User already exists") ||
        signUpError.status === 422
      ) {
        console.log("[Admin Access] User exists, attempting sign-in...")
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: adminPassword,
        })
        
        if (signInError) {
          throw new Error(`Sign-in falhou: ${signInError.message}`)
        }
        
        user = signInData.user
      } else {
        throw signUpError
      }
    } else {
      user = signUpData.user
    }
    
    if (!user) throw new Error("Falha ao autenticar admin")
    
    // Step 2: Update admin profile using direct update (trigger creates profile on signup)
    console.log("[Admin Access] Updating admin profile...")
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        nome_completo: "Administrador",
        bio: "Conta administrativa",
      }, { onConflict: 'id' })

    if (profileError) {
      console.warn("[Admin Access] Profile update warning:", profileError.message)
    }
    
    // Step 2.5: Use SECURITY DEFINER RPC to ensure admin role (avoids RLS issues)
    console.log("[Admin Access] Setting admin role via RPC...")
    try {
      const { data: rpcData, error: rpcError } = await (supabase as any).rpc(
        "admin_login_or_create",
        { admin_email: adminEmail, admin_password: adminPassword, admin_nome: "Administrador" },
      )

      if (rpcError) {
        console.warn("[Admin Access] RPC error:", rpcError)
      } else if (Array.isArray(rpcData) && rpcData[0]) {
        console.log("[Admin Access] RPC result:", rpcData[0])
        toast({
          title: "Acesso Admin Concedido",
          description: rpcData[0].message || "Bem-vindo, Administrador!",
        })
      } else {
        console.log("[Admin Access] RPC returned no data, attempting fetchUserType...")
        const userType = await fetchUserType(user.id)
        toast({
          title: "Acesso Admin Concedido",
          description: `Bem-vindo! (${userType || "admin"})`,
        })
      }
    } catch (e) {
      console.warn("[Admin Access] Admin role RPC failed:", e)
      try {
        const userType = await fetchUserType(user.id)
        toast({
          title: "Acesso Admin Concedido",
          description: `Bem-vindo! (${userType || "admin"})`,
        })
      } catch (fetchError) {
        console.warn("[Admin Access] fetchUserType failed:", fetchError)
        toast({
          title: "Acesso Admin Concedido",
          description: "Bem-vindo, Administrador!",
        })
      }
    }
    
    // Redirect after brief delay to ensure profile is updated
    setTimeout(() => {
      navigate("/admin")
    }, 500)
  } catch (error: any) {
    console.error("[Admin Access] Error:", error)
    const err = new Error(error.message || "Erro ao acessar admin")
    handleAuthError(err, toast)
  }
}
