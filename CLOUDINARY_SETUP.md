# Cloudinary Setup Instructions

## 1. Create Cloudinary Account
- Go to https://cloudinary.com
- Sign up for a free account

## 2. Get Your Credentials
After signing up, you'll get:
- Cloud Name
- API Key
- API Secret

## 3. Create Upload Preset
1. Go to Cloudinary Dashboard
2. Navigate to Settings → Upload
3. Scroll to "Upload presets"
4. Create a new preset:
   - Name: `profile-images`
   - Signing Mode: Unsigned (for client-side uploads)
   - Folder: `profiles`
   - Allowed formats: JPG, PNG, JPEG, WEBP
   - Max file size: 2MB

## 4. Environment Variables
Add these to your `.env.local` file:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=profile-images
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 5. Install Cloudinary Package
```bash
npm install cloudinary
```

## 6. Database Schema
The `profile_image_url` column already exists in the `profiles` table from the previous migration.

## 7. How It Works
1. User clicks camera icon in side menu
2. Selects image from gallery/camera
3. Image uploads to Cloudinary
4. URL is saved to Supabase `profiles` table
5. Header and side menu update immediately with new image
6. Image persists across logout/login

## Your Cloudinary Credentials (to be filled):
- Cloud Name: qz5m8bhg
- Upload Preset: profile-images
- API Key: 354819336511838
- API Secret: B9CwWGJ0v7b-VosV7Z4pyO4V-8U
