"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClerkProfile } from "@/components/profile/clerk-profile";
import { ConvexProfile } from "@/components/profile/convex-profile";
import { User, UserCog } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Tabs Interface */}
      <Tabs defaultValue="convex" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="convex" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile Details</span>
            <span className="sm:hidden">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="clerk" className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            <span className="hidden sm:inline">Account Settings</span>
            <span className="sm:hidden">Account</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="convex" className="mt-6">
          <ConvexProfile />
        </TabsContent>

        <TabsContent value="clerk" className="mt-6">
          <ClerkProfile />
        </TabsContent>
      </Tabs>
    </div>
  );
}
