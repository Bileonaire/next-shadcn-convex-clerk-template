export default function NotificationsPage() {
  return (
    <>
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">
          Manage your notification preferences and settings.
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
                d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L16 7M4.828 7H9m-4.172 0a2 2 0 012-2h2.172M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold">Coming Soon</h2>
          <p className="text-muted-foreground max-w-md">
            Notification management features are in development. You'll be able
            to customize your notifications here soon!
          </p>
        </div>
      </div>
    </>
  );
}
