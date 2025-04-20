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


    useEffect(() => {
        if (!isLoaded) return;

        if (!user) {
            router.push("/sign-in", {
                scroll: false,
            });
            return;
        }

        const userType = user.publicMetadata?.userType;
        if (userType === "teacher" && pathname == "/teacher/courses") {
            router.push(pathname, {
                scroll: false,
            });
        }
        else if (userType === "user" && pathname !== "/user/courses") {
            router.push(pathname, {
                scroll: false,
            });
        } else if (!userType) {
            router.push("/setup", {
                scroll: false,
            });
        }
        if (isCoursePage) {
            const match = pathname.match(/\/user\/courses\/([^\/]+)/);
            setCourseId(match ? match[1] : null);
        } else {
            setCourseId(null);
        }
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
