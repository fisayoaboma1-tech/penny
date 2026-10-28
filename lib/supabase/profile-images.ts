import type { SupabaseClient } from "@supabase/supabase-js"

export const PROFILE_IMAGE_BUCKET = "profile-images"
export const PROFILE_IMAGE_MAX_SIZE = 10 * 1024 * 1024

const imageExtensions: Record<string, string> = {
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
}

function getOwnedImagePath(
  supabase: SupabaseClient,
  userId: string,
  imageUrl: string | null | undefined,
) {
  if (!imageUrl || !URL.canParse(imageUrl)) return null

  const image = new URL(imageUrl)
  const marker = "profile-image-check"
  const publicUrl = supabase.storage
    .from(PROFILE_IMAGE_BUCKET)
    .getPublicUrl(marker).data.publicUrl
  const bucketUrl = new URL(publicUrl)
  const bucketPathPrefix = bucketUrl.pathname.slice(0, -`/${marker}`.length)

  if (
    image.origin !== bucketUrl.origin ||
    !image.pathname.startsWith(`${bucketPathPrefix}/`)
  ) {
    return null
  }

  const path = image.pathname.slice(bucketPathPrefix.length + 1)
  if (!path.startsWith(`${userId}/`)) return null

  const fileName = path.slice(userId.length + 1)
  return /^[0-9a-f-]+\.(jpg|png|gif|webp)$/i.test(fileName) ? path : null
}

async function removeStoredImage(supabase: SupabaseClient, path: string) {
  const { error } = await supabase.storage.from(PROFILE_IMAGE_BUCKET).remove([path])
  if (error) throw error
}

export async function saveProfileImage(
  supabase: SupabaseClient,
  userId: string,
  file: File,
  previousImageUrl?: string | null,
) {
  const extension = imageExtensions[file.type]
  if (!extension) {
    throw new Error("Choose a JPG, PNG, GIF, or WebP image.")
  }
  if (file.size > PROFILE_IMAGE_MAX_SIZE) {
    throw new Error("Choose an image smaller than 10 MB.")
  }

  const path = `${userId}/${crypto.randomUUID()}.${extension}`
  const { error: uploadError } = await supabase.storage
    .from(PROFILE_IMAGE_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from(PROFILE_IMAGE_BUCKET).getPublicUrl(path)
  const imageUrl = data.publicUrl
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ profile_image_url: imageUrl })
    .eq("id", userId)

  if (profileError) {
    try {
      await removeStoredImage(supabase, path)
    } catch (cleanupError) {
      console.error("Failed to clean up an unlinked profile image:", cleanupError)
    }
    throw profileError
  }

  const { error: metadataError } = await supabase.auth.updateUser({
    data: { avatar_url: imageUrl, profile_image: imageUrl },
  })
  if (metadataError) {
    console.error("Could not sync profile image metadata:", metadataError)
  }

  const previousPath = getOwnedImagePath(supabase, userId, previousImageUrl)
  if (previousPath && previousPath !== path) {
    try {
      await removeStoredImage(supabase, previousPath)
    } catch (cleanupError) {
      console.error("Failed to remove the previous profile image:", cleanupError)
    }
  }

  return imageUrl
}

export async function clearProfileImage(
  supabase: SupabaseClient,
  userId: string,
  previousImageUrl?: string | null,
) {
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ profile_image_url: null })
    .eq("id", userId)
  if (profileError) throw profileError

  const { error: metadataError } = await supabase.auth.updateUser({
    data: { avatar_url: null, profile_image: null },
  })
  if (metadataError) {
    console.error("Could not clear profile image metadata:", metadataError)
  }

  const path = getOwnedImagePath(supabase, userId, previousImageUrl)
  if (path) {
    try {
      await removeStoredImage(supabase, path)
    } catch (cleanupError) {
      console.error("Failed to remove the profile image from storage:", cleanupError)
    }
  }
}
