import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="w-full max-w-md mx-auto px-4">
        {/* Perfectly centered title section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-3 text-white">
            Get Started
          </h1>
          <p className="text-lg text-slate-300">
            Create your account to get started
          </p>
        </div>

        {/* Centered Clerk component */}
        <div className="flex justify-center">
          <SignUp
            routing="path"
            path="/auth/sign-up"
            signInUrl="/auth/sign-in"
            fallbackRedirectUrl="/dashboard"
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-slate-800 hover:bg-slate-700 text-white border-0 shadow-lg",
                card: "shadow-2xl border-0 bg-white/95 backdrop-blur-sm",
                headerTitle: "text-center text-slate-800 font-semibold",
                headerSubtitle: "text-center text-slate-600",
                socialButtonsBlockButton:
                  "border border-slate-200 hover:bg-slate-50",
                formFieldInput:
                  "border-slate-200 focus:border-slate-400 focus:ring-slate-400",
                footerActionLink:
                  "text-blue-600 hover:text-blue-800 font-medium",
                identityPreviewText: "text-slate-600",
                formResendCodeLink: "text-slate-600 hover:text-slate-800",
                footerAction: "text-center",
                footerActionText: "text-slate-600",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
