
import React from 'react'
import StripeProvider from './StripeProvider'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useCreateTransactionMutation } from '@/state/api';
import { useCheckoutNavigation } from '@/hooks/useCheckoutNavigation';
import { useCurrentCourse } from '@/hooks/useCurrentCourse';
import { useUser, useClerk } from '@clerk/nextjs';
import CoursePreview from '@/components/CoursePreview';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const PaymentPageContent = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [createTransaction] = useCreateTransactionMutation();
    const { navigateToStep } = useCheckoutNavigation();
    const { course, courseId } = useCurrentCourse();
    const { user } = useUser();
    const { signOut } = useClerk()


    const baseUrl = process.env.NEXT_PUBLIC_LOCAL_URL ? `${process.env.NEXT_PUBLIC_LOCAL_URL}`
        : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : undefined;

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        if (!stripe || !elements) {
            return toast.error("Stripe service is not available ")
        }
        const loadingToast = toast.loading("Processing payment...");
        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${baseUrl}/checkout?step=3&?id=${courseId}`
            },
            redirect: "if_required"
        })
        toast.dismiss(loadingToast);

        if (result.error) {
            toast.error(result.error.message || "Payment failed");
            return;
        }
        if (result.paymentIntent?.status === "succeeded") {
            const transactionData: Partial<Transaction> = {
                transactionId: result.paymentIntent.id,
                userId: user?.id,
                courseId: courseId,
                paymentProvider: "stripe",
                amount: course?.price || 0,
            };

            try {
                await createTransaction(transactionData).unwrap();
                toast.success("Payment successful!");
                navigateToStep(3);
            } catch (error: any) {
                console.error("Transaction creation failed:", error);
                toast.error("Payment successful but enrollment failed. Please contact support.");
            }
        } else {
            toast.error("Payment not completed");
        }
    }
    const handleSignOutAndNavigate = async () => {
        await signOut();
        navigateToStep(1)
    }
    if (!course) return null;
    return (
        <div className="flex flex-col w-full">
            <div className="flex md:flex-row flex-col gap-10 mb-6">
                {/* Order Summary */}
                <div className="md:basis-1/2 rounded-lg">
                    <CoursePreview course={course} />
                </div>

                {/* Pyament Form */}
                <div className="md:basis-1/2 ">
                    <form
                        id="payment-form"
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >
                        <div className="flex flex-col gap-4 dark:border-none border border-gray-300 bg-gray-50 dark:bg-gray-900 px-10 py-10 rounded-lg">
                            <h1 className="text-2xl dark:text-white font-bold">Checkout</h1>
                            <p className="text-sm dark:text-gray-400 text-gray-600">
                                Fill out the payment details below to complete your purchase.
                            </p>

                            <div className="flex flex-col gap-2 w-full mt-6">
                                <h3 className="text-md dark:text-white font-semibold">Payment Method</h3>

                                <div className="flex flex-col border-[2px] dark:border-white-100/5 border-gray-800 rounded-lg">
                                    <div className="flex items-center gap-2 bg-white/5 py-2 px-2 rounded-t-lg">
                                        <CreditCard size={24} />
                                        <span>Credit/Debit Card</span>
                                    </div>
                                    <div className="px-4 py-6">
                                        <PaymentElement />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center w-full mt-6">
                <Button
                    className="hover:bg-white-50/10"
                    // onClick={handleSignOutAndNavigate}
                    variant="outline"
                    type="button"
                >
                    Switch Account
                </Button>

                <Button
                    form="payment-form"
                    type="submit"
                    className="hover:bg-primary-600 bg-primary-700"
                    disabled={!stripe || !elements}
                >
                    Pay with Credit Card
                </Button>
            </div>
        </div>
    )
}

const PaymentPage = () => (
    <StripeProvider>
        <PaymentPageContent />
    </StripeProvider>
)

export default PaymentPage
