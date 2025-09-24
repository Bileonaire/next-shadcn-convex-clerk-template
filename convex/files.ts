import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

// Generate a signed URL for uploading any file type
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.storage.generateUploadUrl();
  },
});

// Save file metadata to database
export const saveFileMetadata = mutation({
  args: {
    name: v.string(),
    size: v.number(),
    type: v.string(),
    storageId: v.id("_storage"),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const fileId = await ctx.db.insert("files", {
      userId,
      name: args.name,
      size: args.size,
      type: args.type,
      storageId: args.storageId,
      uploadedAt: Date.now(),
      category: args.category,
      description: args.description,
    });

    return fileId;
  },
});

// Get all files for the current user
export const getUserFiles = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const files = await ctx.db
      .query("files")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return files;
  },
});

// Get files by category for the current user
export const getUserFilesByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, { category }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const files = await ctx.db
      .query("files")
      .withIndex("by_user_and_category", (q) =>
        q.eq("userId", userId).eq("category", category)
      )
      .order("desc")
      .collect();

    return files;
  },
});

// Get a single file by storage ID
export const getFileByStorageId = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const file = await ctx.db
      .query("files")
      .withIndex("by_storage_id", (q) => q.eq("storageId", storageId))
      .first();

    if (!file || file.userId !== userId) {
      throw new Error("File not found or access denied");
    }

    return file;
  },
});

// Get a signed URL for viewing any file
export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});

// Get multiple signed URLs for viewing files (batch operation)
export const getFileUrls = query({
  args: { storageIds: v.array(v.id("_storage")) },
  handler: async (ctx, { storageIds }) => {
    const urls = await Promise.all(
      storageIds.map((id) => ctx.storage.getUrl(id))
    );
    return urls;
  },
});

// Delete a file (both from storage and database)
export const deleteFile = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Find the file record
    const file = await ctx.db
      .query("files")
      .withIndex("by_storage_id", (q) => q.eq("storageId", storageId))
      .first();

    if (!file || file.userId !== userId) {
      throw new Error("File not found or access denied");
    }

    // Delete from storage
    await ctx.storage.delete(storageId);

    // Delete from database
    await ctx.db.delete(file._id);

    return { success: true };
  },
});

// Update file metadata
export const updateFileMetadata = mutation({
  args: {
    storageId: v.id("_storage"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { storageId, name, description }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const file = await ctx.db
      .query("files")
      .withIndex("by_storage_id", (q) => q.eq("storageId", storageId))
      .first();

    if (!file || file.userId !== userId) {
      throw new Error("File not found or access denied");
    }

    await ctx.db.patch(file._id, {
      ...(name && { name }),
      ...(description && { description }),
    });

    return { success: true };
  },
});
