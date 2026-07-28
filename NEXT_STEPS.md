# 🚀 Pennywise Supabase Integration - Next Steps

Your Supabase credentials have been configured! Here's what you need to do to complete the setup:

## ✅ What's Already Done

- ✅ Supabase client setup (browser & server)
- ✅ Database schema with RLS policies
- ✅ Signup page integrated with Supabase Auth
- ✅ Login page integrated with Supabase Auth
- ✅ Forgot password functionality wired up
- ✅ Auth context for global state management
- ✅ Route protection for wallet and dashboard
- ✅ Environment variables configured with your credentials

## 📋 What You Need To Do

### Step 1: Run Database Migration (REQUIRED)

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/pxzxexnbnlxqthfymkng
2. Click on **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy the entire contents of this file: `supabase/migrations/20240101000000_create_profiles_table.sql`
5. Paste it into the SQL editor
6. Click **Run** (or press Ctrl+Enter)

**Expected Result**: You should see "Success. No rows returned"

### Step 2: Verify Database Setup

1. In Supabase dashboard, go to **Table Editor**
2. You should see a `profiles` table
3. Click on it - it should have these columns:
   - `id` (UUID)
   - `full_name` (TEXT)
   - `phone_number` (TEXT)
   - `country_code` (TEXT)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

### Step 3: Configure Authentication Settings

1. In Supabase dashboard, go to **Authentication** > **Providers**
2. Make sure **Email** provider is enabled (it should be by default)
3. Click on **Email** to configure:
   - **Confirm email**: Turn this **OFF** (for immediate access)
   - **Secure email change**: ON
   - **Double confirm email change**: ON
4. Click **Save**

### Step 4: Test the Application

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser and go to: `http://localhost:3000/signup`

3. Create a test account:
   - **Full Name**: Test User
   - **Email**: test@example.com
   - **Phone**: 1234567890
   - **Country**: Select any country
   - **Password**: Test@123 (6-8 chars, letters and special chars only)
   - **Repeat Password**: Test@123

4. Click **Register**

5. You should be redirected to the login page with a success message

6. Log in with your credentials:
   - **Email**: test@example.com
   - **Password**: Test@123

7. You should be redirected to `/wallet` (your dashboard)

### Step 5: Verify in Supabase

1. Go back to Supabase dashboard
2. Click **Table Editor** > **profiles**
3. You should see your test user's profile with the data you entered

4. Click **Authentication** > **Users**
5. You should see your test user listed

## 🎯 Testing Checklist

- [ ] Database migration ran successfully
- [ ] `profiles` table exists in Supabase
- [ ] Email confirmation is disabled in Supabase
- [ ] Can access signup page
- [ ] Can create a new account
- [ ] Redirected to login after signup
- [ ] Can log in with new credentials
- [ ] Redirected to `/wallet` after login
- [ ] User name appears in wallet header
- [ ] Profile created in Supabase `profiles` table
- [ ] User appears in Supabase `auth.users`
- [ ] Can log out
- [ ] Can't access `/wallet` when logged out (redirects to login)
- [ ] Forgot password sends reset email

## 🔧 Troubleshooting

### Issue: "Invalid API key" or "JWT expired"
**Solution**: 
- Make sure you restarted the dev server after updating `.env.local`
- Double-check the credentials in `.env.local` match what's in Supabase

### Issue: "Row Level Security policy violation"
**Solution**:
- Make sure you ran the database migration SQL
- Check that the `profiles` table exists
- Verify RLS policies are enabled (Table Editor > profiles > Policies tab)

### Issue: "Profile not created after signup"
**Solution**:
- Check that the trigger was created: Go to SQL Editor and run:
  ```sql
  SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
  ```
- If no results, re-run the migration SQL

### Issue: "Email not sent" for password reset
**Solution**:
- Check Supabase **Authentication** > **Email Templates**
- For development, Supabase sends emails automatically
- Check your spam folder
- In production, you'll need to configure a custom SMTP server

### Issue: "Cannot read property 'user_metadata' of null"
**Solution**:
- Make sure the user is logged in
- Check that the auth context is properly wrapped around the app
- Verify the user exists in Supabase

## 📊 Database Schema

Your `profiles` table structure:

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  country_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔐 Security Features Active

- ✅ Row-Level Security (RLS) enabled
- ✅ Users can only access their own data
- ✅ Passwords validated (6-8 chars, letters + special chars, no numbers)
- ✅ Secure session management with Supabase
- ✅ Protected routes redirect unauthenticated users
- ✅ Password reset via email

## 🎨 Application Features

### For Users:
- ✅ Sign up with full name, email, phone, password
- ✅ Log in with email and password
- ✅ Forgot password functionality
- ✅ Access to wallet/dashboard
- ✅ Secure logout

### For Admins (Dashboard):
- ✅ View all users (mock data for now)
- ✅ User management interface
- ✅ Protected admin dashboard

## 📝 Important Notes

1. **Email Confirmation is DISABLED** - Users get immediate access (as requested)
2. **Password Requirements**: 6-8 characters, letters and special characters only, NO numbers
3. **Multi-tenancy**: Implemented via RLS - each user can only see their own data
4. **Session Management**: Handled automatically by Supabase (cookies)
5. **Production**: Remember to enable email confirmation and configure custom SMTP

## 🚀 Ready to Deploy?

When you're ready to deploy to production:

1. Update environment variables in your hosting platform (Vercel, Netlify, etc.)
2. Enable email confirmation in Supabase
3. Configure custom SMTP for emails
4. Enable 2FA on your Supabase account
5. Set up database backups

## 📚 Additional Resources

- **Supabase Dashboard**: https://supabase.com/dashboard/project/pxzxexnbnlxqthfymkng
- **Supabase Docs**: https://supabase.com/docs
- **Project Setup Guide**: See `SETUP.md` for detailed documentation

## 🆘 Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Check Supabase logs in the dashboard
3. Review the troubleshooting section above
4. Make sure all steps in this guide are completed

---

**Your Supabase Project**: https://pxzxexnbnlxqthfymkng.supabase.co  
**Production URL**: https://pennywiseltd.vercel.app/

**Next**: Complete the steps above, then test the authentication flow!