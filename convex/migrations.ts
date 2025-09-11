import { mutation } from "./_generated/server";

// Migration to clean up old schema fields
export const cleanupOldSchema = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("Starting schema cleanup migration...");
    
    // Get all profiles
    const profiles = await ctx.db.query("profiles").collect();
    
    for (const profile of profiles) {
      const updates: any = {};
      
      // Remove old fields if they exist
      if ('lastUpdatedBy' in profile) {
        delete (profile as any).lastUpdatedBy;
        updates.lastUpdatedBy = undefined;
      }
      if ('userUpdatedAt' in profile) {
        delete (profile as any).userUpdatedAt;
        updates.userUpdatedAt = undefined;
      }
      if ('clerkSyncedAt' in profile) {
        delete (profile as any).clerkSyncedAt;
        updates.clerkSyncedAt = undefined;
      }
      
      // Only update if there were fields to remove
      if (Object.keys(updates).length > 0) {
        console.log(`Cleaning up profile ${profile._id}:`, updates);
        await ctx.db.patch(profile._id, updates);
      }
    }
    
    console.log("Schema cleanup migration completed");
    return { cleaned: profiles.length };
  },
});
