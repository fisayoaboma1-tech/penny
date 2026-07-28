"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export interface UserPreferences {
  hide_balance: boolean
  push_notifications: boolean
  email_notifications: boolean
  sms_notifications: boolean
  preferred_language: string
}

export function useUserPreferences() {
  const queryClient = useQueryClient()

  // Fetch user preferences
  const { data: preferences, isLoading, error } = useQuery({
    queryKey: ["userPreferences"],
    queryFn: async () => {
      const response = await fetch("/api/user/preferences")
      if (!response.ok) {
        throw new Error("Failed to fetch preferences")
      }
      return response.json() as Promise<UserPreferences>
    },
  })

  // Update user preferences with optimistic update
  const updateMutation = useMutation({
    mutationFn: async (newPreferences: Partial<UserPreferences>) => {
      const response = await fetch("/api/user/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPreferences),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update preferences")
      }

      return response.json()
    },
    // Optimistic update - update UI immediately before server responds
    onMutate: async (newPreferences) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["userPreferences"] })

      // Snapshot the previous value
      const previousPreferences = queryClient.getQueryData<UserPreferences>(["userPreferences"])

      // Optimistically update to the new value
      if (previousPreferences) {
        queryClient.setQueryData<UserPreferences>(["userPreferences"], {
          ...previousPreferences,
          ...newPreferences,
        })
      }

      // Return context with previous value for rollback
      return { previousPreferences }
    },
    // If mutation fails, rollback to previous value
    onError: (err, newPreferences, context) => {
      if (context?.previousPreferences) {
        queryClient.setQueryData(["userPreferences"], context.previousPreferences)
      }
    },
    // Always refetch after mutation to ensure server state
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userPreferences"] })
    },
  })

  // Helper function to update a single preference
  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    return updateMutation.mutateAsync({ [key]: value })
  }

  return {
    preferences,
    isLoading,
    error,
    updatePreference,
    updatePreferences: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  }
}