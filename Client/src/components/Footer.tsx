import React from 'react'
import { Linkedin, Github, Mail, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"

const Footer = () => {
    return (
        <div className='border-t border-gray-100 px-2 dark:border-gray-900 bg-white dark:bg-muted/10 bottom-0 w-full py-12 md:py-20 text-center text-sm'>
            <h2 className="text-4xl md:text-6xl font-bold mb-2 text-foreground text-center tracking-tight">
                Join as a <span className="font-extrabold text-primary">Learner</span>
            </h2>
            <p className="text-muted-foreground text-sm mb-8">
                Join our community of learners and start your journey to financial success today.
            </p>

            <div className="flex md:flex-row flex-col flex-wrap justify-center gap-4 mb-12 md:mb-24">
                {[
                    { icon: Facebook, label: "Facebook", href: "#" },
                    { icon: Linkedin, label: "LinkedIn", href: "#" },
                    { icon: Github, label: "Github", href: "#" },
                    { icon: Mail, label: "Email", href: "#" },
                ].map(({ icon: Icon, label, href }) => (
                    <Button
                        key={label}
                        asChild
                        className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-md"
                    >
                        <a href={href}>
                            <Icon size={18} />
                            {label}
                        </a>
                    </Button>
                ))}
            </div>
            {/* Brand Name */}
            <div className="text-center">
                <h1 className="text-[10vw] md:text-[8vw] font-bold tracking-wider dark:opacity-[0.10] opacity-[0.15] select-none dark:text-white text-black">
                    LEARNING
                </h1>
            </div>
        </div>
    )
}

export default Footer
