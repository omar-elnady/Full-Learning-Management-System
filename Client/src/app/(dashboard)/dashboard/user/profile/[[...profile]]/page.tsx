'use client'
import Header from '@/components/Header'
import { UserProfile } from '@clerk/nextjs'
import { dark, light } from '@clerk/themes'
import { useTheme } from 'next-themes'
import React from 'react'


const UserProfilePage = () => {
    const { theme } = useTheme()
    return (
        <>
            <Header title={`Profile`} subtitle={`View your profile`} />
            <UserProfile
                path='/dashboard/user/profile'
                routing='path'
                appearance={{
                    baseTheme: theme === 'dark' ? dark : light,
                    elements: {
                        scrollBox: "bg-background",
                        navbar: {
                            "& > div:not(:nth-child(2))": {
                                display: "none"
                            },

                        }
                    }
                }}
            />

        </>
    )
}

export default UserProfilePage
