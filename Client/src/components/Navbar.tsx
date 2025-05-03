"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import {
  SignedIn,
  UserButton as ClerkUserButton,
  useUser,
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { SidebarTrigger } from '@/components/ui/sidebar'
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";



export const Navbar = ({ isCoursePage }: { isCoursePage: boolean }) => {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.userType as "student" | "teacher";
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter()

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur border-b border-b-gray-800 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="dashboard-navbar__search">
          <div className="md:hidden">
            <SidebarTrigger className='dashboard-navbar__sidebar-trigger' />
          </div>
          <div className="flex items-center gap-10">
            <Button
              onClick={() => (
                router.push('/search')
              )}
              className="flex items-center gap-2 px-12 md:px-24 py-5 text-customgreys-dirtyGrey hover:text-white-50 bg-customgreys-primarybg hover:bg-gray-700 rounded-xl font-semibold text-lg shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              <span>Search Courses</span>
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </div>


        <nav className="flex items-center gap-4">
          <SignedIn>
            <ClerkUserButton
              appearance={{
                baseTheme: dark,
                elements: {
                  userButtonOuterIdentifier: "text-white text-base",
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
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
