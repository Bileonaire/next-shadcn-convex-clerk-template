import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  profiles: defineTable({
    userId: v.string(), // Clerk user ID
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatarStorageId: v.optional(v.id("_storage")), // Convex storage ID for uploaded images
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_email", ["email"]),

  files: defineTable({
    userId: v.string(), // Clerk user ID
    name: v.string(), // Original filename
    size: v.number(), // File size in bytes
    type: v.string(), // MIME type
    storageId: v.id("_storage"), // Convex storage ID
    uploadedAt: v.number(), // Timestamp
    category: v.optional(v.string()), // File category (image, video, document, etc.)
    description: v.optional(v.string()), // Optional file description
  })
    .index("by_user", ["userId"])
    .index("by_user_and_category", ["userId", "category"])
    .index("by_storage_id", ["storageId"]),
});
