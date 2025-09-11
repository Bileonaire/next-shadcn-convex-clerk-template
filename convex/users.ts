import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Simple function to ensure user has a profile - call this on app load
export const ensureUserProfile = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if profile already exists
    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile) {
      return existingProfile;
    }

    // Create new profile with empty defaults
    const now = Date.now();
    const profileId = await ctx.db.insert("profiles", {
      userId,
      email: "",
      firstName: "",
      lastName: "",
      bio: "",
      createdAt: now,
      updatedAt: now,
    });

    return { _id: profileId, userId };
  },
});

// Get current user with profile
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return {
      userId,
      profile,
    };
  },
});
