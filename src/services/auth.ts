import { supabase } from "@/integrations/supabase/client"

export const loginUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export const registerUser = async (
  email: string,
  password: string,
  userType: "investidor" | "parceiro",
  userData: any,
) => {
  try {
    console.log("Starting user registration with:", { email, userType, userData })

    // First register the user with basic info
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
      console.error("Registration error:", error)
      throw error
    }

    if (!data.user) {
      throw new Error("User creation failed")
    }

    const userId = data.user.id
    console.log("User registered successfully:", userId)

    // Upload documents if available
    if (userData.biFront || userData.biBack) {
      console.log("Uploading documents for user:", userId)

      // Upload front document image if available
      if (userData.biFront instanceof File) {
        try {
          const frontPath = `${userId}/bi_frente_${Date.now()}.${userData.biFront.name.split('.').pop()}`
          console.log("Uploading front document to:", frontPath)
          
          const { error: frontError } = await supabase.storage
            .from("documentos")
            .upload(frontPath, userData.biFront, { upsert: false })

          if (frontError) {
            console.error("Error uploading front document:", frontError)
          } else {
            console.log("Front document uploaded successfully")
          }
        } catch (err) {
          console.error("Exception uploading front document:", err)
        }
      }

      // Upload back document image if available
      if (userData.biBack instanceof File) {
        try {
          const backPath = `${userId}/bi_verso_${Date.now()}.${userData.biBack.name.split('.').pop()}`
          console.log("Uploading back document to:", backPath)
          
          const { error: backError } = await supabase.storage
            .from("documentos")
            .upload(backPath, userData.biBack, { upsert: false })

          if (backError) {
            console.error("Error uploading back document:", backError)
          } else {
            console.log("Back document uploaded successfully")
          }
        } catch (err) {
          console.error("Exception uploading back document:", err)
        }
      }
    }

    // Update profile with user data (use upsert to handle new profiles)
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
        }, { onConflict: "id" })

      if (updateError) {
        console.error("Error updating profile:", updateError)
      } else {
        console.log("Profile updated successfully")
      }
    } catch (updateError) {
      console.error("Exception during profile update:", updateError)
    }

    return data
  } catch (error) {
    throw error
  }
}

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
