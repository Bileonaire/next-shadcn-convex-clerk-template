import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

/**
 * Custom hook that automatically ensures a user has a profile
 * and provides profile data with automatic creation
 */
export function useProfileAuto() {
  const { isSignedIn, isLoaded } = useAuth();
  const profile = useQuery(api.profiles.getCurrentProfile);
  const ensureUserProfile = useMutation(api.users.ensureUserProfile);

  // Automatically create profile when user is signed in but no profile exists
  useEffect(() => {
    const createProfileIfNeeded = async () => {
      if (isLoaded && isSignedIn && profile === null) {
        try {
          await ensureUserProfile();
        } catch (error) {
          console.error("Error creating profile:", error);
        }
      }
    };

    createProfileIfNeeded();
  }, [isLoaded, isSignedIn, profile, ensureUserProfile]);

  return {
    profile,
    isLoading: !isLoaded || (isSignedIn && profile === undefined),
    isCreating: isSignedIn && profile === null,
  };
}
