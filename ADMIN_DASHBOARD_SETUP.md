# Admin Dashboard Setup Guide

This guide will help you set up the admin dashboard with proper authentication and user management.

## 📋 Prerequisites

- Supabase project already set up
- Admin dashboard files already created
- Database tables (profiles) already created

## 🚀 Setup Steps

### Step 1: Add Admin Role to Database

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `supabase/admin-setup.sql`
5. Click **Run**

This will add an `is_admin` column to the profiles table.

### Step 2: Make a User Admin

You need to make at least one user an admin. Here's how:

#### Option A: Using Supabase Dashboard (Easiest)

1. Go to **Authentication** > **Users** in Supabase Dashboard
2. Find the user you want to make admin (or sign up a new user first)
3. Copy the **User ID** (it looks like: `12345678-1234-1234-1234-123456789abc`)
4. Go to **SQL Editor** > **New Query**
5. Run this SQL (replace `USER_ID` with the actual user ID):

```sql
UPDATE public.profiles 
SET is_admin = true 
WHERE id = 'USER_ID';
```

#### Option B: Make the First User Admin

If you want to make the first registered user admin:

```sql
UPDATE public.profiles 
SET is_admin = true 
WHERE id = (SELECT id FROM public.profiles LIMIT 1);
```

### Step 3: Test the Admin Login

1. Go to http://localhost:3000/dashboard/login
2. Enter the email and password of the admin user you created
3. You should be redirected to the admin dashboard

## ✨ Features

The admin dashboard now has the following features:

### 🔐 Authentication
- **Secure login** using Supabase Auth (no hardcoded credentials!)
- **Role-based access** - only users with `is_admin = true` can access
- **Session management** - uses Supabase sessions instead of localStorage

### 📊 Dashboard
- **Real-time stats** - Total users and total assets fetched from database
- **Loading states** - Shows spinner while fetching data
- **User table** - Displays all registered users with:
  - Profile image
  - Full name
  - Email
  - Balance
  - Registration date

### ⚙️ User Management
- **Edit Balance** - Click the edit icon to update any user's balance
- **Delete User** - Click the delete icon to remove a user (with confirmation)
- **View Details** - See user information in the table

### 🎨 UI Features
- **Responsive design** - Works on mobile and desktop
- **Dark theme** - Modern emerald/dark aesthetic
- **Animations** - Smooth transitions and hover effects
- **Pagination** - Handles large numbers of users

## 🔧 Technical Details

### Database Schema

The `profiles` table now includes:
```sql
- id (UUID) - Primary key
- full_name (TEXT)
- email (TEXT)
- phone_number (TEXT)
- country_code (TEXT)
- profile_image_url (TEXT)
- balance (DECIMAL)
- is_admin (BOOLEAN) - NEW!
- created_at (TIMESTAMP)
```

### Authentication Flow

1. User visits `/dashboard/login`
2. Enters credentials
3. System checks if user exists in Supabase Auth
4. System checks if user has `is_admin = true` in profiles table
5. If both checks pass, user is redirected to `/dashboard`
6. If either check fails, access is denied

### Data Fetching

- Users are fetched from `profiles` table
- Ordered by `created_at` (newest first)
- Real-time updates when editing/deleting users

## 🛡️ Security Notes

- **Never commit** admin credentials to code
- Use Supabase's built-in authentication
- The `is_admin` flag is stored in the database, not in JWT tokens
- All API calls are protected by Supabase Row Level Security (RLS)

## 🐛 Troubleshooting

### "Access denied" error
- Make sure you've run the SQL migration
- Make sure the user has `is_admin = true` in the profiles table

### Users not showing up
- Check browser console for errors
- Make sure the profiles table has data
- Verify Supabase connection in `.env.local`

### Can't delete users
- Make sure you have the correct Supabase service role key
- Check RLS policies in Supabase

## 📝 Next Steps

1. ✅ Run the SQL migration
2. ✅ Make at least one user admin
3. ✅ Test the admin login
4. ✅ Verify user management features work
5. Consider adding:
   - More detailed user profiles
   - Transaction history
   - Advanced filtering and search
   - Bulk actions
   - Admin activity logs

## 🆘 Support

If you encounter any issues:
1. Check the browser console for errors
2. Check Supabase logs in the dashboard
3. Verify all environment variables are set correctly