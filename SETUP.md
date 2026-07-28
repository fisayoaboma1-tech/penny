# Pennywise - Supabase Setup Guide

This guide will walk you through setting up Supabase for the Pennywise banking application.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Your Supabase project credentials

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in your project details:
   - **Name**: Pennywise (or your preferred name)
   - **Database Password**: Save this securely!
   - **Region**: Choose the closest region to your users
4. Click "Create new project" and wait for it to initialize

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** (gear icon in the left sidebar)
2. Click on **API** in the settings menu
3. You'll find three important values:
   - **Project URL** (e.g., `https://xyzcompany.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - **Keep this secret!**

## Step 3: Configure Environment Variables

1. Open the `.env.local` file in your project root
2. Replace the placeholder values with your actual Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important Notes:**
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are safe to expose in client-side code
- `SUPABASE_SERVICE_ROLE_KEY` should NEVER be exposed to the client (only used in server-side code)
- The `NEXT_PUBLIC_` prefix makes the variable available in the browser

## Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy and paste the contents of `supabase/migrations/20240101000000_create_profiles_table.sql`
4. Click **Run** to execute the SQL

This will create:
- `profiles` table to store user information
- Row Level Security (RLS) policies to ensure data isolation
- Auto-profile creation trigger for new users
- Necessary indexes and permissions

### Verify the Setup

1. Go to **Table Editor** in the Supabase dashboard
2. You should see the `profiles` table listed
3. Check that the table has the following columns:
   - `id` (UUID, Primary Key)
   - `full_name` (TEXT)
   - `phone_number` (TEXT)
   - `country_code` (TEXT)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

## Step 5: Configure Authentication Settings

1. In Supabase dashboard, go to **Authentication** > **Providers**
2. Ensure **Email** provider is enabled (it should be by default)
3. Configure email settings:
   - **Confirm email**: Disabled (for immediate access as per your requirements)
   - **Secure email change**: Enabled (recommended)
   - **Double confirm email change**: Enabled (recommended)

### Email Templates (Optional)

Customize the email templates in **Authentication** > **Email Templates**:
- **Confirm signup**: Customize the confirmation email
- **Reset password**: Customize the password reset email
- **Magic link**: Customize the magic link email

## Step 6: Test the Application

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/signup`
3. Create a test account with:
   - Full Name: Test User
   - Email: test@example.com
   - Phone: Any valid phone number
   - Password: Test@123 (6-8 chars, letters and special chars only)
   - Repeat Password: Test@123

4. After signup, you should be redirected to login
5. Log in with your credentials
6. You should be redirected to `/wallet`

## Step 7: Verify Database Records

1. In Supabase dashboard, go to **Table Editor** > **profiles**
2. You should see your test user's profile with:
   - `id` (matches the auth.users id)
   - `full_name`: Test User
   - `phone_number`: Your phone number
   - `country_code`: Your selected country code
   - `created_at`: Current timestamp

3. Go to **Authentication** > **Users**
4. You should see your test user with:
   - Email: test@example.com
   - Confirmed: Yes (if email confirmation is disabled)
   - User metadata containing full_name, phone_number, country_code

## Step 8: Test Password Reset

1. Go to `http://localhost:3000/login`
2. Click "Forgot Password?"
3. Enter your email and click "Send Reset Link"
4. Check your email for the reset link
5. Click the link and set a new password
6. Log in with the new password

## Multi-Tenancy Implementation

The application uses **Row-Level Security (RLS)** for multi-tenancy:

### How It Works

1. Each user can only access their own profile
2. RLS policies enforce this at the database level
3. Even if a user tries to access another user's data, the database will reject it

### Current RLS Policies

```sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (during signup)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### Future Multi-Tenancy Features

When you're ready to add more features (transactions, cards, etc.), follow this pattern:

```sql
-- Example: Transactions table
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policy
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);
```

## Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Never expose `SUPABASE_SERVICE_ROLE_KEY`** in client-side code
3. **Always use RLS policies** for database tables
4. **Validate user input** on both client and server side
5. **Use HTTPS** in production
6. **Enable 2FA** on your Supabase account
7. **Regularly audit** your RLS policies

## Troubleshooting

### Issue: "Invalid API key"
- **Solution**: Double-check your `.env.local` file for typos
- Make sure you copied the full key (they're long!)
- Restart your dev server after changing `.env.local`

### Issue: "Row Level Security policy violation"
- **Solution**: Check that the user is authenticated
- Verify RLS policies are correctly set up
- Check that `auth.uid()` matches the user's ID

### Issue: "Email not sent"
- **Solution**: Check your Supabase email settings
- For development, you can use Supabase's built-in email service
- For production, configure a custom SMTP server

### Issue: "Profile not created after signup"
- **Solution**: Verify the trigger is set up correctly
- Check the `handle_new_user()` function exists
- Ensure the trigger is attached to `auth.users`

## Production Deployment

When deploying to production:

1. **Update environment variables** in your hosting platform (Vercel, Netlify, etc.)
2. **Enable email confirmation** for better security
3. **Configure custom SMTP** for emails (e.g., SendGrid, Postmark)
4. **Set up database backups** in Supabase
5. **Enable SSL** (automatic with most hosting platforms)
6. **Monitor usage** in Supabase dashboard

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check the Supabase logs in the dashboard
3. Review this guide again
4. Check Supabase documentation

---

**Next Steps**: Once authentication is working, you can start building additional features like:
- User profile editing
- Transaction history
- Wallet management
- Card management
- Notifications