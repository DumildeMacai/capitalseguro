import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function setupAdmin() {
  try {
    console.log("🔧 Setting up admin user...")

    // 1. Create user
    console.log("📝 Creating admin@admin.com user...")
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: "admin@admin.com",
      password: "1dumilde1@A",
      email_confirm: true,
    })

    if (userError) {
      if (userError.message.includes("already exists")) {
        console.log("✓ User admin@admin.com already exists")
      } else {
        throw userError
      }
    } else {
      console.log("✓ User created:", userData.user?.id)
    }

    // 2. Get user ID
    const { data: users, error: getUserError } = await supabase.auth.admin.listUsers()

    if (getUserError) throw getUserError

    const adminUser = users.users.find((u) => u.email === "admin@admin.com")

    if (!adminUser) {
      throw new Error("Admin user not found after creation")
    }

    console.log("✓ Found admin user:", adminUser.id)

    // 3. Set as admin using RPC
    console.log("🔑 Setting user as admin...")
    const { error: rpcError } = await supabase.rpc("set_user_as_admin", {
      user_email: "admin@admin.com",
    })

    if (rpcError) throw rpcError

    // 4. Verify
    const { data: userType, error: verifyError } = await supabase.rpc("get_user_type", {
      user_id: adminUser.id,
    })

    if (verifyError) throw verifyError

    console.log("✅ Admin setup complete!")
    console.log("Type:", userType)
    console.log("\nYou can now login with:")
    console.log("Email: admin@admin.com")
    console.log("Password: 1dumilde1@A")
  } catch (error) {
    console.error("❌ Error setting up admin:", error)
    process.exit(1)
  }
}

setupAdmin()
