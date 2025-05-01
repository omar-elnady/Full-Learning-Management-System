import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isStudentRoute = createRouteMatcher(["/dashboard/user(.*)"]);
const isTeacherRoute = createRouteMatcher(["/dashboard/teacher(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims } = await auth();

  const userRole = (sessionClaims?.metadata as { userType?: "student" | "teacher" })?.userType;

  if (!userRole) return NextResponse.next();

  if (isStudentRoute(req) && userRole !== "student") {
    const url = new URL("/dashboard/teacher/courses", req.url);
    return NextResponse.redirect(url);
  }
  if (isTeacherRoute(req) && userRole !== "teacher") {
    const url = new URL("/dashboard/user/courses", req.url);
    return NextResponse.redirect(url);
  }
  const url = new URL("/dashboard", req.url);
  return NextResponse.redirect(url);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

