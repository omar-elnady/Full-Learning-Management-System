"use client"
// import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'
// import { dark } from '@clerk/themes'
// import { Bell, BookOpen } from 'lucide-react'
// import Link from 'next/link'
// import React, { useState } from 'react'
// import { SidebarTrigger } from '@/components/ui/sidebar'
// import { cn } from '@/lib/utils'

// const Navbar = ({ isCoursePage }: { isCoursePage: boolean }) => {
//     const [isDarkMode, setIsDarkMode] = useState(false);
//     const { user } = useUser();
//     const userRole = user?.publicMetadata?.userType as "student" | "teacher"
//     return (
//         <nav className='dashboard-navbar '>
//             <div className="dashboard-navbar__container">
//                 <div className="dashboard-navbar__search">
//                     <div className="md:hidden">
//                         <SidebarTrigger className='dashboard-navbar__sidebar-trigger' />
//                     </div>
//                     <div className='flex items-center gap-4'>
//                         <div className='relative  group '>
//                             <Link href="/search"  scroll={false} className={cn("dashboard-navbar__search-input", {
//                                 "!bg-customgreys-secondarybg": isCoursePage,
//                             }
//                             )}>
//                                 <span className='hidden sm:inline'>Search Courses</span>
//                                 <span className=' sm:hidden'>Search</span>
//                             </Link>
//                             <BookOpen className='dashboard-navbar__search-icon size={18}' />
//                         </div>
//                     </div>
//                 </div>
//                 <div className='dashboard-navbar__actions'>
//                     <button className='nondashboard-navbar__notification-button'>
//                         <span className='nondashboard-navbar__notification-indicator'></span>
//                         <Bell className='nondashboard-navbar__notification-icon' />
//                     </button>
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
                 

//                 </div>
//             </div>

//         </nav>
//     )
// }

// export default Navbar



import Link from 'next/link'
import { Button } from "@/components/ui/button";
import { Book, BookOpen } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    <div className="w-8 h-8 rounded bg-brand-DEFAULT flex items-center justify-center">
      <BookOpen className="h-5 w-5 text-white" />
    </div>
    <span className="font-bold text-xl hidden sm:block text-brand-DEFAULT">EduHub</span>
  </Link>
);

// Note: This is just a placeholder until Clerk is integrated
const UserButton = () => (
  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
    <span className="text-xs font-medium text-gray-600">U</span>
  </div>
);

export const Navbar = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        
        {/* Desktop Navigation */}
        <nav className={`hidden md:flex items-center gap-4`}>
          <Button variant="outline" asChild>
            <Link href="/search" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              Search Courses
            </Link>
          </Button>
          
          <Button asChild>
            <Link href="/courses">My Courses</Link>
          </Button>
          
          <UserButton />
        </nav>
        
        {/* Mobile Navigation */}
        {isMobile && (
          <div className="flex md:hidden items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="mr-2"
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                {isMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                  </>
                )}
              </svg>
            </Button>
            <UserButton />
          </div>
        )}
      </div>
      
      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="container pb-4 md:hidden">
          <nav className="flex flex-col gap-2">
            <Button variant="outline" asChild className="justify-start">
              <Link href="/search" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                Search Courses
              </Link>
            </Button>
            <Button asChild className="justify-start">
              <Link href="/courses">My Courses</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;