# 🔧 Supabase Database Fixes - Setup Guide

## Critical Issues Fixed

This guide resolves three critical database issues preventing your app from working:

1. ❌ **Infinite Recursion in RLS Policies** - Admin policy was checking itself recursively
2. ❌ **Storage Schema Invalid** - Policies referenced non-existent columns
3. ⚠️ **Email Verification Required** - Users need to confirm email before login

---

## Step 1: Run the SQL Fix Script

Execute the fix script in your Supabase SQL Editor:

1. Go to: **https://app.supabase.com/project/zclxwhbzisuyzytytcjr/sql/new**
2. Copy all content from: `/workspaces/capitalseguro/supabase/fix-policies-v2.sql`
3. Paste into the SQL editor
4. Click **"Run"** to execute all queries
5. ✅ You should see no errors

### What This Script Does:
- Removes all problematic RLS policies causing recursion
- Creates new `is_admin()` function without recursion
- Recreates storage policies that work with your schema
- Creates trigger to auto-create user profiles on signup
- Fixes the `user_roles` table integration

---

## Step 2: Enable Email Verification (Optional)

### Option A: Keep Email Verification (Recommended)
Users must confirm their email before logging in:

1. In Supabase Dashboard → **Authentication** → **Providers** → **Email**
2. Make sure "Confirm email" is enabled
3. Update your app to show: "A confirmation link has been sent to your email"

### Option B: Skip Email Verification (Not Recommended - Security Risk)
If you want to allow login without email confirmation:

1. Go to: **https://app.supabase.com/project/zclxwhbzisuyzytytcjr/settings/auth**
2. Find **"Email confirmation required"**
3. Toggle to **OFF** (⚠️ Less secure)

---

## Step 3: Test the Registration Flow

```typescript
// This should now work:
1. User registers with email, password, name, phone
2. Profile created automatically
3. Documents uploaded to 'documentos' bucket
4. User receives confirmation email (or can login immediately if Step 2B)
```

### Expected Behavior After Fix:

**Registration:**
```
✅ User created in auth.users
✅ Profile auto-created in profiles table
✅ User role created in user_roles table
✅ Documents uploaded to documentos/avatars/investimentos buckets
```

**Login:**
```
✅ Email confirmed → Can login
❌ Email not confirmed → Error "Email not confirmed" (if Step 2A is enabled)
```

---

## Step 4: Important Code Changes in App

Your app has been updated to:

### ✅ Use `upsert` for profiles
```typescript
.upsert({
  id: userId,
  nome_completo: userData.name,
  telefone: userData.phone,
  // ... other fields
}, { onConflict: "id" })
```

### ✅ Add unique filenames to documents
```typescript
const frontPath = `${userId}/bi_frente_${Date.now()}.${ext}`
```

### ✅ Better error handling for storage
```typescript
const { error: frontError } = await supabase.storage
  .from("documentos")
  .upload(frontPath, userData.biFront, { upsert: false })
```

---

## Troubleshooting

### Issue: Still getting "infinite recursion" error
**Solution:** Restart your terminal and clear browser cache after running the SQL script

### Issue: Storage uploads still failing with "400 Bad Request"
**Solution:** 
- Make sure the bucket name is exactly: `documentos`, `avatars`, or `investimentos`
- Check that you ran the SQL fix script completely

### Issue: Profile not being created on signup
**Solution:**
- The trigger should auto-create profiles
- If not working, manually insert: `INSERT INTO profiles (id) VALUES (user_uuid)`

### Issue: Can't login - "Email not confirmed"
**Solution:**
- Either confirm email (click link in email)
- Or disable email verification in Supabase Auth settings (Step 2B)

---

## Database Schema After Fix

```
auth.users (Supabase built-in)
├── id (UUID)
├── email
├── raw_user_meta_data → { tipo: 'investidor' | 'parceiro' }
└── ...

public.profiles
├── id (UUID) → references auth.users(id)
├── nome_completo
├── telefone
├── endereco
├── cidade
├── provincia
├── empresa_nome (parceiros only)
└── ...

public.user_roles
├── id (UUID)
├── user_id (UUID) → references auth.users(id)
├── role ('admin' | 'investidor' | 'parceiro')
└── ...

storage.buckets
├── documentos (identity documents)
├── avatars (profile pictures)
└── investimentos (investment files)
```

---

## Next Steps

1. ✅ Run the SQL fix script
2. ✅ Test registration with a new email
3. ✅ Verify email or disable email verification
4. ✅ Test login
5. ✅ Test document uploads
6. ✅ Check profile creation in Supabase Dashboard

Once working, your app should:
- ✅ Register users without errors
- ✅ Upload documents to correct buckets
- ✅ Allow users to login after email confirmation
- ✅ Show user profiles in admin dashboard

---

**Questions?** Check the Supabase logs in the Dashboard or share the error message for more help.
