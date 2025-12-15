import { useClerk, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  BookOpen,
  Briefcase,
  DollarSign,
  LogOut,
  PanelLeft,
  Settings,
  User,
} from "lucide-react";
import Loading from "./Loading";
import Image from "next/image";
import { cn } from "@/app/lib/utils";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

const AppSidebar = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const navLinks = {
    student: [
      { icon: BookOpen, label: "Courses", href: "/dashboard/user/courses" },
      { icon: Briefcase, label: "Billing", href: "/dashboard/user/billing" },
      { icon: User, label: "Profile", href: "/dashboard/user/profile" },
      { icon: Settings, label: "Settings", href: "/dashboard/user/settings" },
    ],
    teacher: [
      { icon: BookOpen, label: "Courses", href: "/dashboard/teacher/courses" },
      { icon: DollarSign, label: "Billing", href: "/dashboard/teacher/billing" },
      { icon: User, label: "Profile", href: "/dashboard/teacher/profile" },
      { icon: Settings, label: "Settings", href: "/dashboard/teacher/settings" },
    ],
  };
  if (!isLoaded) return <Loading />;
  if (!user) return <div>User Not Found</div>;
  const userType =
    (user.publicMetadata.userType as "student" | "teacher") || "student";
  const currentNavLinks = navLinks[userType];
  return (
    <Sidebar
      collapsible="icon"
      className="bg-gray-100 border-none shadow-lg min-h-screen h-full"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={() => toggleSidebar()}
              className="group hover:bg-muted text-foreground"
            >
              <div className="flex items-center gap-4 pl-2 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0">
                <div className="flex items-center gap-3">
                  <Image
                    alt="logo"
                    src="/logo.svg"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                  <p className="text-lg font-bold tracking-wide group-data-[collapsible=icon]:hidden">
                    LMS
                  </p>
                </div>
                <PanelLeft className="ml-auto h-5 w-5 text-muted-foreground group-data-[collapsible=icon]:hidden" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {currentNavLinks?.map((link, index) => {
            const isActive = pathname.includes(link.href);
            return (
              <SidebarMenuItem
                key={index}
                className={cn(
                  "group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:py-4 hover:bg-gray-100",
                  isActive && "bg-muted"
                )}
              >
                <SidebarMenuButton
                  asChild
                  size={"lg"}
                  className={cn(
                    "gap-4 p-8 hover:bg-gray-100 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center",
                    !isActive && "text-muted-foreground"
                  )}
                >
                  <Link href={link.href} scroll={false} className={`relative flex items-center`}>
                    <link.icon
                      className={isActive ? "text-foreground" : "text-muted-foreground"}
                    />
                    <span
                      className={cn(
                        "font-medium text-md ml-4 group-data-[collapsible=icon]:hidden",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {link.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
                {isActive && <div className="absolute right-0 top-0 h-full w-[4px] bg-primary-750" />}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-2">
              <ThemeToggle />
              <SidebarMenuButton asChild className="flex-1">
                <button
                  onClick={() => signOut()}
                  className="text-primary-700 pl-8"
                >
                  <LogOut className="mr-2 h-6 w-6" />
                  <span>Sign Out</span>
                </button>
              </SidebarMenuButton>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
