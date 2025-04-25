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
        console.log(userType);
        if (userType === "teacher") {
            router.replace("/dashboard/teacher/courses");
        }  else {
            router.replace("/dashboard/user/courses");
        }
    }, [isLoaded, user, router]);

    return <Loading />;
}