import NonDashboardNavbar from "@/components/NonDashboardNavbar"
import React from "react";
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen w-full bg-background">
            <NonDashboardNavbar />
            <main className="flex flex-grow w-full h-full justify-center items-center">
                {children}
            </main>
        </div>
    );
}
