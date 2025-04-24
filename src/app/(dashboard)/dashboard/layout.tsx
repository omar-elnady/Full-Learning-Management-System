"use client";
import React, { useEffect, useState } from "react";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Loading from "@/components/Loading";
import { cn } from "@/lib/utils";
import AppSidebar from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import ChaptersSidebar from "@/components/courses/[courseId]/ChaptersSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, isLoaded } = useUser();
    const [courseId, setCourseId] = useState<string | null>(null);
    const isCoursePage = /^\/user\/courses\/[^\/]+(?:\/chapters\/[^\/]+)?$/.test(
        pathname
    );
    const router = useRouter();

    console.log("pathname", pathname);

    useEffect(() => {
        const handleNavigation = async () => {
            if (!isLoaded) return;

            if (!user) {
                await router.replace("/sign-in");
                return;
            }

            const userType = user.publicMetadata?.userType as string;
            console.log("Current userType:", userType);
            console.log("Current pathname:", pathname);

            // Handle dashboard route
            if (pathname === "/dashboard") {
                try {
                    if (userType === "teacher") {
                        await router.replace("/dashboard/teacher/courses");
                    } else if (userType === "user") {
                        await router.replace("/dashboard/user/courses");
                    } else {
                        await router.replace("/setup");
                    }
                    return;
                } catch (error) {
                    console.error("Navigation error:", error);
                }
            }

            // Handle wrong routes for teacher
            if (userType === "teacher" && !pathname.includes("/dashboard/teacher")) {
                try {
                    await router.replace("/dashboard/teacher/courses");
                    return;
                } catch (error) {
                    console.error("Teacher navigation error:", error);
                }
            }

            // Handle wrong routes for user
            if (userType === "user" && !pathname.includes("/dashboard/user")) {
                try {
                    await router.replace("/dashboard/user/courses");
                    return;
                } catch (error) {
                    console.error("User navigation error:", error);
                }
            }

            // Handle course ID
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
            <div className="dashboard">
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
