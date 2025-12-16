"use client"
import { GuestFormData, guestSchema } from '@/app/lib/schemas';
import CoursePreview from '@/components/CoursePreview';
import { CustomFormField } from '@/components/CustomFormField';
import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { useCurrentCourse } from '@/hooks/useCurrentCourse';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation'
import React from 'react'
import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form';
import SignInComponent from '@/components/SignIn';
import SignUpComponent from '@/components/SignUp';

const ChechoutDetailsPage = () => {
    const searchParams = useSearchParams()
    const { course: selectedCourse, isLoading, isError } = useCurrentCourse();
    const showSignUp = searchParams.get('showSignUp') === "true";

    const methods = useForm<GuestFormData>({
        resolver: zodResolver(guestSchema),
        defaultValues: {
            email: "",
        }
    })

    if (isLoading) return <Loading />
    if (isError) return <div>Failed to fetch course data </div>
    if (!selectedCourse) return <div >Course not found </div>

    return (
        <div className="w-full h-fit gap-10">
            <div className="flex flex-col md:flex-row gap-10">
                <div className=" basis-1/2 rounded-lg">
                    <CoursePreview course={selectedCourse} />
                </div>

                <div className="basis-1/2 flex-1 h-auto flex flex-col gap-10   dark:bg-gray-900 rounded-lg">
                    <div className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-none py-12 px-24 rounded-lg">
                        <h2 className="text-3xl font-bold text-center mb-2">Guest Checkout</h2>
                        <p className="mb-6 text-sm text-center dark:text-gray-400 text-gray-600 mx-auto">
                            Enter email to receive course access details and order
                            confirmation. You can create an account after purchase.
                        </p>
                        <Form {...methods}>
                            <form
                                onSubmit={methods.handleSubmit((data) => {
                                    console.log(data);
                                })}
                                className="space-y-8"
                            >
                                <CustomFormField
                                    name="email"
                                    label="Email address"
                                    type="email"
                                    className="w-full rounded mt-4"
                                    labelClassName="font-normal text-white-50"
                                    inputClassName="py-3"
                                />
                                <Button type="submit" className="w-full my-6 py-3 bg-primary-700 hover:bg-primary-600 text-white rounded shadow text-sm font-semibold">
                                    Continue as Guest
                                </Button>
                            </form>
                        </Form>
                    </div>

                    <div className="flex items-center justify-between">
                        <hr className="w-full border-gray-300 dark:border-gray-600" />
                        <span className="px-4 text-sm text-gray-400 whitespace-nowrap">Or</span>
                        <hr className="w-full border-gray-300 dark:border-gray-600" />
                    </div>

                    <div className="w-full border border-gray-300 dark:border-none bg-gray-50 dark:bg-gray-900 px-2 py-2 flex justify-center items-center rounded-lg">
                        {showSignUp ? <SignUpComponent /> : <SignInComponent />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChechoutDetailsPage
