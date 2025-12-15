'use client'

import { NotificationSettingsFormData, notificationSettingsSchema } from '@/app/lib/schemas';
import { useUpdateUserMutation } from '@/state/api';
import { zodResolver } from '@hookform/resolvers/zod'
import { useUser } from '@clerk/nextjs'
import React from 'react'
import { useForm } from 'react-hook-form';
import Header from './Header';
import { Form } from '@/components/ui/form';
import { CustomFormField } from './CustomFormField';
import { Button } from '@/components/ui/button';

const SharedNotificationSettings = ({
    title = "Notification Settings",
    subtitle = "Manage your notification settings"
}: SharedNotificationSettingsProps) => {

    const { user } = useUser();
    const [updateUser] = useUpdateUserMutation();

    const currentSettings = (user?.publicMetadata as { settings?: UserSettings }).settings || {};

    const methods = useForm<NotificationSettingsFormData>({
        resolver: zodResolver(notificationSettingsSchema),
        defaultValues: {
            courseNotifications: currentSettings.courseNotifications || false,
            emailAlerts: currentSettings.emailAlerts || false,
            smsAlerts: currentSettings.smsAlerts || false,
            notificationFrequency: currentSettings.notificationFrequency || "daily",
        }
    })

    const onSubmit = async (data: NotificationSettingsFormData) => {
        if (!user) return;
        const updatedUser = {
            userId: user.id,
            publicMetadata: {
                ...user.publicMetadata,
                settings: {
                    ...currentSettings,
                    ...data
                }
            }
        }
        try {
            await updateUser(updatedUser)
        } catch (err) { console.error("Failed to update user settings : ", err) }
    }

    if (!user) return <div>Please Sign in to manage your settings. </div>
    return (
        <div className="space-y-4">
            <Header title={title} subtitle={subtitle} />
            <Form {...methods}>
                <form
                    onSubmit={methods.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <div className="space-y-6">
                        <CustomFormField
                            name="courseNotifications"
                            label="Course Notifications"
                            type="switch"
                        />
                        <CustomFormField
                            name="emailAlerts"
                            label="Email Alerts"
                            type="switch"
                        />
                        <CustomFormField
                            name="smsAlerts"
                            label="SMS Alerts"
                            type="switch"
                        />

                        <CustomFormField
                            name="notificationFrequency"
                            label="Notification Frequency"
                            type="select"
                            options={[
                                { value: "immediate", label: "Immediate" },
                                { value: "daily", label: "Daily" },
                                { value: "weekly", label: "Weekly" },
                            ]}
                        />
                    </div>

                    <Button type="submit" className="!mt-8 text-gray-100 bg-primary-700 hover:bg-primary-600">
                        Update Settings
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default SharedNotificationSettings
