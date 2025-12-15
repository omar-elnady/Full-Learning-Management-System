import Header from '@/components/Header'
import { UserProfile } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import React from 'react'

const TeacherProfilePage = () => {
    return (
        <>
            <Header title={`Profile`} subtitle={`View your profile`} />
            <UserProfile
                path='/dashboard/teacher/profile'
                routing='path'
                appearance={{
                    baseTheme: dark,
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

export default TeacherProfilePage
