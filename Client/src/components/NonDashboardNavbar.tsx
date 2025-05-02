
// const NonDashboardNavbar = () => {
//     const {user} = useUser() ; 
//     const userRole = user?.publicMetadata?.userType as "student" | "teacher"
//     return (
//         <nav className='nondashboard-navbar '>
//             <div className="nondashboard-navbar__container">
//                 <div className="nondashboard-navbar__search">
//                     <Link href="/"  scroll={false} className='nondashboard-navbar__brand'>
//                         Learning
//                     </Link>
//                     <div className='flex items-center gap-4'>
//                         <div className='relative  group '>
//                             <Link href="/search"  scroll={false} className='nondashboard-navbar__search-input'>
//                                 <span className='hidden sm:inline'>Search Courses</span>
//                                 <span className=' sm:hidden'>Search</span>
//                             </Link>
//                             <BookOpen className='nondashboard-navbar__search-icon size={18}' />
//                         </div>
//                     </div>
//                 </div>
//                 <div className='nondashboard-navbar__actions'>
//                     <button className='nondashboard-navbar__notification-button'>
//                         <span className='nondashboard-navbar__notification-indicator'></span>
//                         <Bell className='nondashboard-navbar__notification-icon' />
//                     </button>
//                     <SignedIn>
//                         <UserButton appearance={{
//                             baseTheme: dark,
//                             elements: {
//                                 userButtonOuterIdentifier: "text-customgreys-dirtyGray",
//                                 userButtonBox: "scale-90 sm:scale-100",
//                                 userButtonPopoverCard: {
//                                     "& > div > div:nth-child(1)": {
//                                         background: "#FFFFFF",
//                                         display: "none"
//                                     },
//                                 },
//                             }
//                         }}
//                             showName={true}
//                             userProfileMode='navigation'
//                             userProfileUrl={
//                                 userRole === "teacher" ? "/dashboard/teacher/profile" : "/dashboard/user/profile"
//                             } />
//                     </SignedIn>
//                     <SignedOut>
//                         <Link href="/signin"  scroll={false} className='nondashboard-navbar__auth-button--login'>Log In</Link>
//                         <Link href="/signup"  scroll={false} className='nondashboard-navbar__auth-button--signup'>Sign Up</Link>
//                     </SignedOut>

//                 </div>
//             </div>

//         </nav>
//     )
// }

// export default NonDashboardNavbar


"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import {
    SignedIn,
    SignedOut,
    UserButton as ClerkUserButton,
    useUser,
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const Logo = (userRole: any) => (
    <div className="flex items-center gap-2">
        <Link href="/" scroll={false} className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
                <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl hidden sm:block text-blue-600">
                Learning
            </span>
        </Link>
        <div className="sm:hidden">
            <Link
                href={userRole === "teacher" ? "/dashboard/teacher/courses" : "/dashboard/user/courses"}
                scroll={false}
                className="flex items-center gap-3 px-6 py-3 bg-blue-500 text-white text-xs leading-4 font-bold uppercase rounded-lg shadow-md shadow-blue-500/20 hover:bg-white-100 hover:text-black hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-500 ease-in-out group"
            >
                My Courses
                <div className="flex justify-center items-center">
                    <div className="w-[10px] h-[2px] bg-blue-500 relative transition-all duration-200 group-hover:bg-black mt-[1px]">
                        <span className="absolute top-[-3px] right-[3px] border-solid border-white group-hover:border-black border-t-0 border-r-[2px] border-b-[2px] border-l-0 w-[6px] h-[6px] rotate-[-45deg] transition-all duration-200 group-hover:right-0" />
                    </div>
                </div>
            </Link>
        </div>
    </div>
);

export const NonDashboardNavbar = () => {
    const { user } = useUser();
    const userRole = user?.publicMetadata?.userType as "student" | "teacher";
    const isMobile = useIsMobile();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur border-b border-b-gray-800 shadow-sm">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-10">
                    <Logo userRole={userRole} />
                    <Link
                        href="/search"
                        className="items-center justify-center hidden md:flex"
                    >
                        <Button className="flex items-center gap-2 px-10 py-3 text-customgreys-dirtyGrey hover:text-white-50 bg-customgreys-secondarybg hover:bg-gray-800 rounded-xl font-semibold text-sm shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95">
                            <span>Search Courses</span>
                            <Search className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-4">
                    <SignedIn>
                        <Link
                            href={userRole === "teacher" ? "/dashboard/teacher/courses" : "/dashboard/user/courses"}
                            scroll={false}
                            className="flex items-center gap-3 px-6 py-3 bg-blue-500 text-white text-xs leading-4 font-bold uppercase rounded-lg shadow-md shadow-blue-500/20 hover:bg-white-100 hover:text-black hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-500 ease-in-out group"
                        >
                            My Courses
                            <div className="flex justify-center items-center">
                                <div className="w-[10px] h-[2px] bg-blue-500 relative transition-all duration-200 group-hover:bg-black mt-[1px]">
                                    <span className="absolute top-[-3px] right-[3px] border-solid border-white group-hover:border-black border-t-0 border-r-[2px] border-b-[2px] border-l-0 w-[6px] h-[6px] rotate-[-45deg] transition-all duration-200 group-hover:right-0" />
                                </div>
                            </div>
                        </Link>

                        <ClerkUserButton
                            appearance={{
                                baseTheme: dark,
                                elements: {
                                    userButtonOuterIdentifier: "text-white",
                                    userButtonBox: "scale-90 sm:scale-100",
                                    userButtonPopoverCard: {
                                        "& > div > div:nth-child(1)": {
                                            background: "#FFFFFF",
                                            display: "none",
                                        },
                                    },
                                },
                            }}
                            showName
                            userProfileMode="navigation"
                            userProfileUrl={
                                userRole === "teacher"
                                    ? "/dashboard/teacher/profile"
                                    : "/dashboard/user/profile"
                            }
                        />
                    </SignedIn>

                    <SignedOut>
                        <Link
                            href="/signin"
                            scroll={false}
                            className="flex items-center gap-3 px-6 py-3 bg-blue-500 text-white text-xs leading-4 font-bold uppercase rounded-lg shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-500 ease-in-out focus:opacity-85 active:opacity-85 focus:shadow-none active:shadow-none select-none"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/signup"
                            scroll={false}
                            className="flex items-center gap-3 px-6 py-3 bg-blue-500 text-white text-xs leading-4 font-bold uppercase rounded-lg shadow-md shadow-blue-500/20 hover:bg-white-100 hover:text-black hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-500 ease-in-out group"
                        >
                            Sign up
                            <div className="flex justify-center items-center">
                                <div className="w-[10px] h-[2px] bg-blue-500 relative transition-all duration-200 group-hover:bg-black mt-[1px]">
                                    <span className="absolute top-[-3px] right-[3px] border-solid border-white group-hover:border-black border-t-0 border-r-[2px] border-b-[2px] border-l-0 w-[6px] h-[6px] rotate-[-45deg] transition-all duration-200 group-hover:right-0" />
                                </div>
                            </div>
                        </Link>
                    </SignedOut>
                </nav>

                {/* Mobile Navigation Toggle */}
                {isMobile && (
                    <div className="flex md:hidden items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                            className="mr-2"
                        >
                            {isMenuOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </Button>
                        <ClerkUserButton />
                    </div>
                )}
            </div>

            {/* Mobile Menu */}
            {isMobile && isMenuOpen && (
                <div className="container py-3 md:hidden space-y-2">
                    <Link href="/search">
                        <Button className="flex items-center gap-2 px-10 py-3 text-customgreys-dirtyGrey hover:text-white-50 bg-customgreys-secondarybg hover:bg-gray-800 rounded-xl font-semibold text-sm shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95">
                            <span>Search Courses</span>
                            <Search className="w-5 h-5" />
                        </Button>
                    </Link>
                    <SignedOut>
                        <Link
                            href="/signin"
                            scroll={false}
                            className="text-white hover:text-blue-100 px-4 py-2 rounded border border-white/30 transition-colors block"
                        >
                            Log In
                        </Link>
                        <Link
                            href="/signup"
                            scroll={false}
                            className="bg-white text-blue-600 hover:bg-blue-100 px-4 py-2 rounded transition-colors block"
                        >
                            Sign Up
                        </Link>
                    </SignedOut>
                </div>
            )}
        </header>
    );
};

export default NonDashboardNavbar;
