import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/nextjs/middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: [
    "/api/trpc/posts.getAll",
    "/api/trpc/posts.getPostsByUserId,profile.getUserByUserName",
    "/api/trpc/posts.getPostById",
  ],
});

export const config = {
  matcher: ["/(api|trpc)(.*)"],
};
