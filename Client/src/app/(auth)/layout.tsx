import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='h-full w-full bg-gray-900'>
            <main className="w-full flex h-full justify-center items-center">
                {children}
            </main>
        </div>
    )
}

export default Layout
