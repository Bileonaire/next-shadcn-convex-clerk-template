import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/profile(.*)",
  "/api/protected(.*)",
]);

const isPublicRoute = createRouteMatcher([
  "/",
  "/auth/sign-in(.*)",
  "/auth/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Handle protected routes
  if (isProtectedRoute(req)) {
    await auth.protect();

    // For protected routes, we can optionally trigger profile creation
    // This will be handled by the getUser query in Convex automatically
    // when components mount, so we don't need to do it here
  }

  // Allow public routes without authentication
  if (isPublicRoute(req)) {
    return;
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
