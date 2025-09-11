"use client";

import { UserProfile } from "@clerk/nextjs";

export function ClerkProfile() {
  return (
    <div className="w-full">
      <UserProfile
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "w-full shadow-none border-0 bg-transparent",
            main: "w-full bg-transparent",
            page: "w-full bg-transparent",
            navbar: "hidden",
            navbarMobileMenuButton: "hidden",
            headerTitle: "text-2xl font-bold text-foreground",
            headerSubtitle: "text-muted-foreground",
            profileSectionTitle: "text-lg font-semibold text-foreground",
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
            profileSection: "bg-transparent border-0 p-0 m-0 mb-4",
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
            footer: "border-t border-border pt-4 mt-4",
            footerAction: "text-primary hover:text-primary/80",
            footerActionText: "text-muted-foreground",
            identityPreviewSecondaryText: "text-muted-foreground text-sm",
            connectedAccountText: "text-foreground font-medium",
            connectedAccountSecondaryText: "text-muted-foreground text-sm",
            formFieldAction:
              "text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 px-3 py-1 rounded-md transition-colors",
            formField: "space-y-2 bg-transparent p-0 m-0",
            formFieldRow: "flex items-center justify-between bg-transparent",
            formFieldInputGroup: "flex gap-2 bg-transparent",
            formFieldInputGroupInput: "flex-1 bg-transparent",
            formFieldInputGroupButton:
              "px-3 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80",
            profileSectionContent: "space-y-4 bg-transparent p-0 m-0",
            formFieldInputWrapper: "relative bg-transparent p-0 m-0",
          },
        }}
      />
    </div>
  );
}
