# Profile Image Upload - Complete Setup Guide

## 📋 Database Schema (Already Applied)

The following SQL was already executed in Supabase (from `RUN_THIS_IN_SUPABASE.sql`):

```sql
-- Add profile_image_url column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS profile_image_url TEXT DEFAULT 'https://res.cloudinary.com/qz5m8bhg/image/upload/v1785215266/profilr_n29abb.jpg';

-- Update existing profiles to have default values
UPDATE public.profiles 
SET profile_image_url = COALESCE(profile_image_url, 'https://res.cloudinary.com/qz5m8bhg/image/upload/v1785215266/profilr_n29abb.jpg')
WHERE profile_image_url IS NULL;
```

**No additional SQL needed** - the `profile_image_url` column already exists!

## ☁️ Cloudinary Setup

### 1. Install Cloudinary Package
```bash
npm install cloudinary
```

### 2. Environment Variables
Add to `.env.local`:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=profile-images
```

### 3. Cloudinary Configuration
1. Go to https://cloudinary.com
2. Sign up / Log in
3. Get your Cloud Name from dashboard
4. Go to Settings → Upload → Upload presets
5. Create preset:
   - Name: `profile-images`
   - Signing Mode: Unsigned
   - Folder: `profiles`
   - Allowed formats: JPG, PNG, JPEG, WEBP
   - Max file size: 2MB

## 🔧 How It Works

### User Flow:
1. User opens side menu
2. Clicks camera icon on profile picture
3. Modal opens with current image preview
4. User clicks "Choose Photo" to select from gallery/camera
5. Image previews in modal
6. User clicks "Upload Photo"
7. Image uploads to Cloudinary
8. URL saves to Supabase `profiles` table
9. Header and side menu update immediately
10. Image persists across logout/login

### Technical Flow:
```
User selects image
    ↓
FileReader creates preview
    ↓
User clicks "Upload Photo"
    ↓
Image uploads to Cloudinary (client-side)
    ↓
Cloudinary returns secure_url
    ↓
URL saves to Supabase profiles table
    ↓
React state updates (profileImageUrl)
    ↓
Header & SideMenu re-render with new image
```

## 📁 Files Created

1. **CLOUDINARY_SETUP.md** - Cloudinary setup instructions
2. **components/wallet/profile-image-modal.tsx** - Upload modal component
3. **components/wallet/side-menu.tsx** - Updated with camera icon
4. **app/wallet/page.tsx** - Wired up profile image modal

## 🎨 Features

- ✅ Camera icon on profile picture in side menu
- ✅ Upload from gallery or camera
- ✅ Image preview before upload
- ✅ Upload to Cloudinary storage
- ✅ Save URL to Supabase database
- ✅ Real-time UI update (header + side menu)
- ✅ Delete/remove profile image
- ✅ Image persists across sessions
- ✅ Per-user database (each user has their own image)

## 🔒 Security

- Images are stored in Cloudinary (not in database)
- Only image URLs are stored in Supabase
- Each user can only update their own profile image
- RLS policies ensure users can only update their own profile

## 📝 Next Steps

1. **Install Cloudinary package:**
   ```bash
   npm install cloudinary
   ```

2. **Get Cloudinary credentials:**
   - Sign up at https://cloudinary.com
   - Get Cloud Name
   - Create upload preset named `profile-images`

3. **Add environment variables:**
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=profile-images
   ```

4. **Test the feature:**
   - Open side menu
   - Click camera icon
   - Upload a photo
   - Verify it appears in header and side menu
   - Logout and login to verify persistence

## 🚀 Ready to Use!

The profile image upload feature is fully implemented and ready to use once you:
1. Install the cloudinary package
2. Get your Cloudinary credentials
3. Add the environment variables

The database schema is already set up and working!