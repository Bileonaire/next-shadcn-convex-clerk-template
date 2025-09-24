import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

// Get current user profile (query - reactive, automatically updates when data changes)
export const getUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    // Get profile by Clerk user ID
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return { userId, profile };
  },
});

// Get user profile with automatic creation and linking (mutation - handles all profile logic)
export const getProfile = mutation({
  args: {
    clerkData: v.object({
      email: v.optional(v.string()),
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { clerkData }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // First, try to get profile by Clerk user ID
    let profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    // If no profile found by userId, try to find by email
    if (!profile && clerkData.email) {
      const profileByEmail = await ctx.db
        .query("profiles")
        .filter((q) => q.eq(q.field("email"), clerkData.email))
        .first();

      if (profileByEmail) {
        // Link existing profile to Clerk user
        await ctx.db.patch(profileByEmail._id, {
          userId, // Link to Clerk user ID
          updatedAt: Date.now(),
        });
        // Get the updated profile
        profile = await ctx.db.get(profileByEmail._id);
      }
    }

    // If still no profile, create new one with Clerk data
    if (!profile) {
      const now = Date.now();
      const profileId = await ctx.db.insert("profiles", {
        userId, // This is the Clerk user ID
        email: clerkData.email || "",
        firstName: clerkData.firstName || "",
        lastName: clerkData.lastName || "",
        bio: "",
        createdAt: now,
        updatedAt: now,
      });

      profile = await ctx.db.get(profileId);
    }

    return { userId, profile };
  },
});

// Get profile by user ID (read-only query)
export const getProfileByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

// Create or update profile
export const upsertProfile = mutation({
  args: {
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatarStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const now = Date.now();

    if (existingProfile) {
      // Update existing profile
      return await ctx.db.patch(existingProfile._id, {
        ...args,
        updatedAt: now,
      });
    } else {
      // Create new profile
      return await ctx.db.insert("profiles", {
        userId,
        ...args,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Update profile
export const updateProfile = mutation({
  args: {
    id: v.id("profiles"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatarStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, { id, ...args }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify the profile belongs to the current user
    const profile = await ctx.db.get(id);
    if (!profile || profile.userId !== userId) {
      throw new Error("Profile not found or unauthorized");
    }

    return await ctx.db.patch(id, {
      ...args,
      updatedAt: Date.now(),
    });
  },
});

// Delete profile
export const deleteProfile = mutation({
  args: { id: v.id("profiles") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify the profile belongs to the current user
    const profile = await ctx.db.get(id);
    if (!profile || profile.userId !== userId) {
      throw new Error("Profile not found or unauthorized");
    }

    return await ctx.db.delete(id);
  },
});

// Get all profiles (for admin purposes)
export const getAllProfiles = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.query("profiles").collect();
  },
});
