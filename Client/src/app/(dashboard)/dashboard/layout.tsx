"use client";
import React, { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
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
  const [courseId, setCourseId] = useState<string | null>(null);
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
      if (isCoursePage) {
        const match = pathname.match(/\/user\/courses\/([^\/]+)/);
        setCourseId(match ? match[1] : null);
      } else {
        setCourseId(null);
      }
    };

    handleNavigation();
  }, [isLoaded, user, pathname, router, isCoursePage]);

  if (!isLoaded) return <Loading />;

  return (
    <SidebarProvider>
      <div className="dashboard ">
        <AppSidebar />
        <div className="dashboard__content">
          {courseId && <ChaptersSidebar />}
          <div
            className={cn(
              "dashboard__main",
              isCoursePage && "dashboard__main--not-course"
            )}
            style={{ height: "100vh" }}
          >
            <Navbar isCoursePage={isCoursePage} />
            <main className="dashboard__body">{children}</main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
