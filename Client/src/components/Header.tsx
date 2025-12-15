import React from 'react'

const Header = ({ title, subtitle, rightElement }: HeaderProps) => {
    return (
        <div className='mb-7 flex justify-between items-center'>
            <div>
                <h1 className='text-3xl font-bold dark:text-white text-black'>{title}</h1>
                <p className='text-sm dark:text-gray-400 text-gray-700 mt-1'>{subtitle}</p>
            </div>
            {rightElement && <div> {rightElement} </div>}
        </div>
    )
}

export default Header
