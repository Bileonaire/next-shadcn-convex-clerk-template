import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth, useUser as useClerkUser } from "@clerk/nextjs";
import { useEffect } from "react";

/**
 * Streamlined hook that gets user data with automatic profile creation
 * This replaces useProfileAuto and provides a cleaner API
 */
export function useUser() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user: clerkUser } = useClerkUser();

  // Reactive query to get user profile data (automatically updates when data changes)
  const userData = useQuery(api.users.getUserProfile);
  
  // Mutation to create/link profile when needed
  const getProfile = useMutation(api.users.getProfile);

  // Handle profile creation when user is signed in but no profile exists
  useEffect(() => {
    const createProfileIfNeeded = async () => {
      if (
        isLoaded &&
        isSignedIn &&
        clerkUser &&
        userData?.userId &&
        !userData.profile
      ) {
        try {
          // Use the mutation to handle profile creation/linking
          const clerkData = {
            email: clerkUser.primaryEmailAddress?.emailAddress,
            firstName: clerkUser.firstName || undefined,
            lastName: clerkUser.lastName || undefined,
          };

          await getProfile({ clerkData });
        } catch (error) {
          console.error("Error creating/linking profile:", error);
        }
      }
    };

    createProfileIfNeeded();
  }, [isLoaded, isSignedIn, clerkUser, userData, getProfile]);

  return {
    user: userData?.userId ? userData : null,
    profile: userData?.profile || null,
    isLoading: !isLoaded || (isSignedIn && userData === undefined),
    isSignedIn: isSignedIn && isLoaded,
  };
}
