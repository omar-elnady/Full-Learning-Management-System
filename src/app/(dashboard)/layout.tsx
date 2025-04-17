"use client";
import React, { useEffect, useState } from "react";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Loading from "@/components/Loading";
import { cn } from "@/lib/utils";
import AppSidebar from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, isLoaded } = useUser();
    const router = useRouter();
    console.log("pathname", pathname);
    useEffect(() => {
        if (!isLoaded) return; // انتظر حتى يتم تحميل بيانات المستخدم

        if (!user) {
            router.push("/sign-in");
            return;
        }

        const userType = user.publicMetadata?.userType;
        if (userType === "teacher" && pathname == "/teacher/courses") {
            router.push(pathname);
        }
        else if (userType === "user" && pathname !== "/user/courses") {
            router.push(pathname);
        } else if (!userType) {
            router.push("/setup");
        }
    }, [isLoaded, user, pathname, router]);

    if (!isLoaded) return <Loading />; // عرض Loading أثناء تحميل بيانات المستخدم

    return (
        <SidebarProvider>
            <div className="dashboard">
                {/* Sidebar */}
                <AppSidebar />
                <div className="dashboard__content">
                    <div className={cn("dashboard__main")} style={{ height: "100vh" }}>
                        <Navbar />
                        <main className="dashboard__body">{children}</main>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
