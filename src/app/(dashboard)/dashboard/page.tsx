"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

export default function DashboardPage() {
    const router = useRouter();
    const { user, isLoaded } = useUser();

    useEffect(() => {
        if (!isLoaded) return;

        if (!user) {
            router.replace("/sign-in");
            return;
        }

        const userType = user.publicMetadata?.userType as string;
        
        if (userType === "teacher") {
            router.replace("/dashboard/teacher/courses");
        } else if (userType === "user") {
            router.replace("/dashboard/user/courses");
        } else {
            router.replace("/setup");
        }
    }, [isLoaded, user, router]);

    return <Loading />;
}