"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, Menu, X, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import {
    SignedIn,
    SignedOut,
    UserButton as ClerkUserButton,
    useUser,
} from "@clerk/nextjs";
import { dark, light } from "@clerk/themes";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const Logo = ({ isScrolled }: { isScrolled: boolean }) => (
    <Link href="/" scroll={false} className="flex items-center gap-2 group">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-md transition-transform group-hover:scale-110">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className={cn(
            "font-bold text-xl transition-colors duration-300",
            isScrolled ? "text-foreground" : "text-foreground"
        )}>
            Learning
        </span>
    </Link>
);

const NavLink = ({ href, children, className, onClick }: { href: string; children: React.ReactNode; className?: string; onClick?: () => void }) => (
    <Link
        href={href}
        scroll={false}
        onClick={onClick}
        className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors",
            className
        )}
    >
        {children}
    </Link>
);

const PrimaryButton = ({ href, children, className, onClick }: { href: string; children: React.ReactNode; className?: string; onClick?: () => void }) => (
    <Link href={href} scroll={false} onClick={onClick}>
        <Button className={cn("rounded-full font-bold shadow-md hover:shadow-lg transition-all duration-300", className)}>
            {children}
        </Button>
    </Link>
);

export const NonDashboardNavbar = () => {
    const { user } = useUser();
    const userRole = user?.publicMetadata?.userType as "student" | "teacher";
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            setIsScrolled(scrollTop > 10);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const dashboardUrl = userRole === "teacher" ? "/dashboard/teacher/courses" : "/dashboard/user/courses";

    return (
        <header className={cn(
            "sticky top-0 z-50 w-full transition-all duration-300",
            isScrolled
                ? "bg-background backdrop-blur-xl border-b border-border shadow-sm"
                : "bg-background backdrop-blur-sm border-b border-transparent"
        )}>
            <div className="container flex h-16 items-center justify-between px-4 md:px-8">
                {/* Left Section: Logo & Search */}
                <div className="flex items-center gap-8">
                    <Logo isScrolled={isScrolled} />

                    <div className="hidden md:block">
                        <Link href="/search">
                            <Button variant="outline" className="rounded-full pl-4 pr-10 text-muted-foreground bg-muted/50 hover:bg-muted hover:text-foreground border-transparent hover:border-border transition-all">
                                <Search className="w-4 h-4 mr-2" />
                                <span className="text-sm font-normal">Search for courses...</span>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    <ThemeToggle />

                    <SignedIn>
                        <NavLink href={dashboardUrl} className="text-foreground hover:text-primary font-semibold">
                            My Dashboard
                        </NavLink>
                        <div className="h-6 w-px bg-border" />
                        <ClerkUserButton
                            appearance={{
                                baseTheme: theme === "dark" ? dark : light,
                                elements: {
                                    userButtonBox: "scale-100",
                                    avatarBox: "w-9 h-9 border-2 border-primary/20"
                                },
                            }}
                            showName
                            userProfileMode="navigation"
                            userProfileUrl={userRole === "teacher" ? "/dashboard/teacher/profile" : "/dashboard/user/profile"}
                        />
                    </SignedIn>

                    <SignedOut>
                        <NavLink href="/signin">Log in</NavLink>
                        <PrimaryButton href="/signup">
                            Sign up
                        </PrimaryButton>
                    </SignedOut>
                </nav>

                {/* Mobile Navigation Toggle */}
                <div className="flex md:hidden items-center gap-4">
                    <ThemeToggle />

                    <SignedIn>
                        <ClerkUserButton
                            appearance={{
                                baseTheme: theme === "dark" ? dark : light,
                                elements: {
                                    userButtonBox: "scale-90",
                                    avatarBox: "w-8 h-8"
                                },
                            }}
                        />
                    </SignedIn>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                        className="text-foreground hover:bg-muted rounded-full"
                    >
                        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden absolute top-16 left-0 w-full bg-background border-b border-border shadow-lg"
                    >
                        <div className="container py-6 px-4 space-y-4">
                            <Link href="/search" onClick={() => setIsMenuOpen(false)}>
                                <Button variant="outline" className="w-full justify-start gap-3 rounded-lg h-12 text-base mb-4">
                                    <Search className="w-5 h-5" />
                                    Search Courses
                                </Button>
                            </Link>

                            <SignedIn>
                                <Link href={dashboardUrl} onClick={() => setIsMenuOpen(false)}>
                                    <Button className="w-full justify-start gap-3 rounded-lg h-12 text-base font-semibold">
                                        <BookOpen className="w-5 h-5" />
                                        My Dashboard
                                    </Button>
                                </Link>
                            </SignedIn>

                            <SignedOut>
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <Link href="/signin" onClick={() => setIsMenuOpen(false)}>
                                        <Button variant="outline" className="w-full rounded-lg h-11">
                                            Log in
                                        </Button>
                                    </Link>
                                    <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                                        <Button className="w-full rounded-lg h-11 font-bold">
                                            Sign up
                                        </Button>
                                    </Link>
                                </div>
                            </SignedOut>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default NonDashboardNavbar;