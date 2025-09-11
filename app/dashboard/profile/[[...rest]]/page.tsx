import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <>
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Profile Container with proper overflow handling */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          <UserProfile
            appearance={{
              elements: {
                rootBox: "w-full h-full",
                card: "shadow-none border-0 bg-transparent",
                main: "bg-transparent",
                page: "bg-transparent",
                navbar: "hidden",
                navbarMobileMenuButton: "hidden",
                headerTitle: "text-2xl font-bold text-foreground",
                headerSubtitle: "text-muted-foreground",
                profileSectionTitle: "text-lg font-semibold",
                formButtonPrimary:
                  "bg-primary hover:bg-primary/90 text-primary-foreground",
                formFieldInput:
                  "border-input focus:border-primary focus:ring-primary bg-background text-foreground",
                identityPreviewText: "text-muted-foreground",
                formResendCodeLink: "text-primary hover:text-primary/80",
                footerActionLink: "text-primary hover:text-primary/80",
                formFieldLabel: "text-sm font-medium text-foreground",
                dividerLine: "bg-border",
                dividerText: "text-muted-foreground",
                profileSection: "bg-transparent border-0 p-0 m-0 mb-2",
                formFieldSuccessText: "text-green-600",
                formFieldErrorText: "text-red-600",
                formFieldWarningText: "text-yellow-600",
                formFieldHintText: "text-muted-foreground text-xs",
                badge:
                  "bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded-full text-xs font-medium",
                identityPreview: "bg-transparent border-0 p-0 m-0",
                identityPreviewEditButton:
                  "text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 px-3 py-1 rounded-md transition-colors",
                connectedAccount: "bg-transparent border-0 p-0",
                connectedAccountButton:
                  "text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 px-3 py-1 rounded-md transition-colors",
                footer: "border-t border-border pt-2 mt-2",
                footerAction: "text-primary hover:text-primary/80",
                footerActionText: "text-muted-foreground",
                // Additional styling for better text visibility
                identityPreviewSecondaryText: "text-muted-foreground text-sm",
                connectedAccountText: "text-foreground font-medium",
                connectedAccountSecondaryText: "text-muted-foreground text-sm",
                formFieldAction:
                  "text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 px-3 py-1 rounded-md transition-colors",
                // Remove all dark backgrounds - override existing properties
                formField: "space-y-1 bg-transparent p-0 m-0",
                formFieldRow:
                  "flex items-center justify-between bg-transparent",
                formFieldInputGroup: "flex gap-2 bg-transparent",
                formFieldInputGroupInput: "flex-1 bg-transparent",
                formFieldInputGroupButton:
                  "px-3 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80",
                // Ensure all containers are transparent
                profileSectionContent: "space-y-2 bg-transparent p-0 m-0",
                formFieldInputWrapper: "relative bg-transparent p-0 m-0",
              },
            }}
          />
        </div>
      </div>
    </>
  );
}
