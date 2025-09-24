"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { User, Mail, FileText } from "lucide-react";
import { useUser as useClerkUser } from "@clerk/nextjs";
import { ImageUpload } from "./image-upload";
import { useImageUrl } from "@/hooks/use-image-url";

export function ConvexProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    avatar: "",
    avatarStorageId: undefined as Id<"_storage"> | undefined,
  });

  const { profile, isLoading } = useUser();
  const upsertProfile = useMutation(api.users.upsertProfile);
  const { user: clerkUser } = useClerkUser();

  // Initialize form data when profile loads - use Clerk data as fallback
  useEffect(() => {
    if (profile && !isEditing) {
      setFormData({
        // Use Convex data first, fallback to Clerk data
        firstName: profile.firstName || clerkUser?.firstName || "",
        lastName: profile.lastName || clerkUser?.lastName || "",
        email:
          profile.email || clerkUser?.primaryEmailAddress?.emailAddress || "",
        bio: profile.bio || "",
        // For avatar, use Clerk image as fallback if no custom upload
        avatar: profile.avatarStorageId ? "" : clerkUser?.imageUrl || "",
        avatarStorageId: profile.avatarStorageId,
      });
    }
  }, [profile, clerkUser, isEditing]);

  // Update avatar URL when storage ID changes
  const imageUrl = useImageUrl(formData.avatarStorageId);
  useEffect(() => {
    if (imageUrl && formData.avatarStorageId && imageUrl !== formData.avatar) {
      setFormData((prev) => ({
        ...prev,
        avatar: imageUrl,
      }));
    }
  }, [imageUrl, formData.avatarStorageId, formData.avatar]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await upsertProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        bio: formData.bio,
        avatarStorageId: formData.avatarStorageId,
      });

      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        // Use Convex data first, fallback to Clerk data
        firstName: profile.firstName || clerkUser?.firstName || "",
        lastName: profile.lastName || clerkUser?.lastName || "",
        email:
          profile.email || clerkUser?.primaryEmailAddress?.emailAddress || "",
        bio: profile.bio || "",
        // For avatar, use Clerk image as fallback if no custom upload
        avatar: profile.avatarStorageId ? "" : clerkUser?.imageUrl || "",
        avatarStorageId: profile.avatarStorageId,
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and preferences.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <ImageUpload
            currentImage={
              formData.avatar && formData.avatar.trim() !== ""
                ? formData.avatar
                : undefined
            }
            currentStorageId={formData.avatarStorageId}
            onImageChange={async (imageUrl, storageId, file) => {
              // Update form data immediately
              setFormData((prev) => ({
                ...prev,
                avatar: imageUrl || "",
                avatarStorageId: storageId,
              }));

              // Automatically save the avatarStorageId to the database
              if (storageId) {
                try {
                  await upsertProfile({
                    avatarStorageId: storageId,
                  });

                  // Also upload to Clerk if file is provided
                  if (file && clerkUser) {
                    try {
                      await clerkUser.setProfileImage({ file });
                    } catch (clerkError) {
                      console.error(
                        "Error updating Clerk profile image:",
                        clerkError
                      );
                      // Don't show error to user as Convex save was successful
                    }
                  }

                  toast.success("Profile picture updated!");
                } catch (error) {
                  console.error("Error auto-saving avatar:", error);
                  toast.error(
                    "Failed to save profile picture. Please try again."
                  );
                }
              }
            }}
            firstName={formData.firstName}
            lastName={formData.lastName}
          />

          {/* Image Sync Note */}
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
            <strong>Note:</strong> Uploaded images are stored in your profile.
            To update your account profile picture (used for authentication),
            use the Account Settings tab.
          </div>

          <Separator />

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Bio
            </Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              disabled={!isEditing}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Profile Stats */}
      {profile && (
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Your profile details and account information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Member Since</p>
                <p className="font-medium">
                  {profile.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Last Updated</p>
                <p className="font-medium">
                  {profile.updatedAt
                    ? new Date(profile.updatedAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Profile Status</p>
                <p className="font-medium text-green-600">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
