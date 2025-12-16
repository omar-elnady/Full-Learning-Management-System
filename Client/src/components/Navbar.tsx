"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Bell, Search } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "next-themes";

export const Navbar = () => {
  const { user } = useUser();
  const { theme } = useTheme();
  const userRole = user?.publicMetadata?.userType as "student" | "teacher";

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left Section: Sidebar Trigger & Search */}
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          </div>

          <div className="relative group">
            <Link
              href="/search"
              className={cn(
                "flex items-center gap-2 pl-4 pr-10 py-2 rounded-full",
                "bg-muted/50 text-muted-foreground border-transparent",
                "hover:bg-muted hover:text-foreground hover:border-border",
                "transition-all duration-300 ease-in-out cursor-pointer"
              )}
            >
              <Search className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="text-sm font-medium hidden sm:inline">Search Courses...</span>
              <span className="text-sm font-medium sm:hidden">Search</span>
            </Link>
          </div>
        </div>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center gap-4 md:gap-6">
          <ThemeToggle />



          <div className="pl-4 border-l border-border/50">
            <UserButton
              appearance={{
                baseTheme: theme === "dark" ? dark : undefined,
                elements: {
                  userButtonAvatarBox: "w-9 h-9 border border-border",
                  userButtonPopoverCard: { pointerEvents: "initial" },
                },
              }}
              showName={true}
              userProfileMode="navigation"
              userProfileUrl={
                userRole === "teacher"
                  ? "/dashboard/teacher/profile"
                  : "/dashboard/user/profile"
              }
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
