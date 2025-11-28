import { supabase } from "@/integrations/supabase/client"
import type { useToast } from "@/hooks/use-toast"
import { handleAuthError, getRedirectPath } from "@/utils/authUtils"
import type { UserType } from "@/types/auth"
import type { NavigateFunction } from "react-router-dom"

export const fetchUserType = async (userId: string): Promise<UserType | null> => {
  try {
    const { data, error } = await supabase.rpc("get_user_type", { user_id: userId })

    if (error) {
      return null
    }

    return data as UserType
  } catch (error) {
    return null
  }
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
      const userType = await fetchUserType(data.user.id)

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
    const updateData = {
      user_id: userId,
      nome_completo: userData.name,
      telefone: userData.phone,
      endereco: userData.address,
      cidade: userData.city,
      provincia: userData.province,
      bio: userData.bio || "",
      doc_frente: userData.biFront instanceof File ? `${userId}/bi_frente` : null,
      doc_verso: userData.biBack instanceof File ? `${userId}/bi_verso` : null,
      empresa_nome: userType === "parceiro" && userData.nomeEmpresa ? userData.nomeEmpresa : null,
      ramo_negocio: userType === "parceiro" && userData.ramoAtuacao ? userData.ramoAtuacao : null,
    }

    console.log("Updating profile with data:", updateData)

    const { error: updateError } = await supabase.rpc("update_user_profile", updateData)

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
      .update({
        nome_completo: "Administrador",
        bio: "Conta administrativa",
        tipo: "admin" as const,
      })
      .eq("id", user.id)
    
    if (profileError) {
      console.warn("[Admin Access] Profile update warning:", profileError.message)
    }
    
    // Step 2.5: Try to set admin role using RPC
    console.log("[Admin Access] Attempting to set admin role via RPC...")
    try {
      const { error: roleError } = await supabase.rpc("set_user_as_admin", {
        user_email: adminEmail,
      })
      
      if (roleError) {
        console.warn("[Admin Access] RPC call warning:", roleError)
      } else {
        console.log("[Admin Access] Admin role set successfully via RPC")
      }
    } catch (e) {
      console.warn("[Admin Access] RPC call failed (may need manual SQL):", e)
    }
    
    // Step 3: Verify and redirect
    const userType = await fetchUserType(user.id)
    navigate("/admin")
    toast({
      title: "Acesso Admin Concedido",
      description: `Bem-vindo! (${userType || "admin"})`,
    })
  } catch (error: any) {
    console.error("[Admin Access] Error:", error)
    const err = new Error(error.message || "Erro ao acessar admin")
    handleAuthError(err, toast)
  }
}
