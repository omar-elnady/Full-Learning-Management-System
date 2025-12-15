"use client"
import { SignUp, useUser } from '@clerk/nextjs'
import React from 'react'
import { dark } from '@clerk/themes'
import { useSearchParams } from 'next/navigation';

const SignUpComponant = () => {
    const searchParams = useSearchParams();
    const { user } = useUser();
    const isCheckoutPage = searchParams.get("showSignUp") !== null;
    const courseId = searchParams.get("id");
    const signInUrl = isCheckoutPage ? `/checkout?step=1&id=${courseId}&showSignUp=false` : "/signin";
    const getRedirectUrl = () => {
        if (isCheckoutPage) {
            return `/checkout?step=2&id=${courseId}`
        }
        const userType = user?.publicMetadata?.userType as string;
        if (userType === "teacher") {
            return "/dashboard/teacher/courses"
        }
        if(userType === "user"){ 
            return "/dashboard/user/courses"
        }
        return "/dashboard"
    }
    return <SignUp appearance={{
        layout: {
            unsafe_disableDevelopmentModeWarnings: true,
        },
        elements: {
            formFieldLabel: "text-muted-foreground font-normal",
            rootBox: "flex justify-center items-center py-5",
            cardBox: "shadow-none ",
            card: "bg-card w-full shadow-none",
            footer: {
                background: "transparent",
                padding: "0rem 2.5rem",

            },
            formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90 !shadow-none",
            formFieldInput: "bg-background text-foreground !shadow-none border border-input",
            footerActionLink: "text-primary hover:text-primary/90"


        },
        baseTheme: dark,

    }}
        signInUrl={signInUrl}
        forceRedirectUrl={getRedirectUrl()}
        afterSignOutUrl={"/"}
        routing='hash' />
}

export default SignUpComponant
