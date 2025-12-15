import SharedNotificationSettings from '@/components/SharedNotificationSettings'
import React from 'react'

const UserSettings = () => {
    return (
        <div className='w-3/5'>
            <SharedNotificationSettings
                title='User Settings'
                subtitle='Manage your notification preferences and account settings'
            />
        </div>
    )
}

export default UserSettings
