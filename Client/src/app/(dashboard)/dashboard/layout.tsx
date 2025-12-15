"use client";
import React, { useEffect } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Loading from "@/components/Loading";
import { cn } from "@/lib/utils";
import AppSidebar from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import ChaptersSidebar from "@/components/courses/[courseId]/ChaptersSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const isCoursePage =
    /^\/dashboard\/user\/courses\/[^\/]+(?:\/chapters\/[^\/]+)?$/.test(
      pathname
    );

  const router = useRouter();

  useEffect(() => {
    const handleNavigation = async () => {
      if (!isLoaded) return;

      if (!user) {
        router.replace("/sign-in");
        return;
      }

      const userType = user.publicMetadata?.userType as string;
      if (pathname === "/dashboard") {
        if (userType === "teacher") {
          router.replace("/dashboard/teacher/courses");
        } else if (userType === "user") {
          router.replace("/dashboard/user/courses");
        }
        return;
      }
      if (userType === "teacher" && !pathname.includes("/dashboard/teacher")) {
        router.replace("/dashboard/teacher/courses");
        return;
      }
      if (userType === "user" && !pathname.includes("/dashboard/user")) {
        router.replace("/dashboard/user/courses");
        return;
      }
    };

    handleNavigation();
  }, [isLoaded, user, pathname, router]);

  if (!isLoaded) return <Loading />;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {isCoursePage ? <ChaptersSidebar /> : <AppSidebar />}

        <SidebarInset className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {!isCoursePage && <Navbar />}

          <main className={cn(
            "flex-1 overflow-y-auto",
            isCoursePage ? "bg-background" : "px-8 py-6"
          )}>
            {/* Mobile Sidebar Trigger for Course Pages */}
            {isCoursePage && (
              <div className="md:hidden p-4 pb-0">
                <div className="flex items-center gap-2">
                  <div className="p-2 -ml-2">
                    <SidebarTrigger />
                  </div>
                  {/* Optional: Add a small breadcrumb or title here for mobile if needed, but keeping it minimal for now as requested */}
                </div>
              </div>
            )}

            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
