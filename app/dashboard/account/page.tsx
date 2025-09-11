export default function AccountPage() {
  return (
    <>
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and security settings.
        </p>
      </div>

      {/* Coming Soon Card */}
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold">Coming Soon</h2>
          <p className="text-muted-foreground max-w-md">
            Account management features are in development. You'll be able to
            manage your account settings here soon!
          </p>
        </div>
      </div>
    </>
  );
}
