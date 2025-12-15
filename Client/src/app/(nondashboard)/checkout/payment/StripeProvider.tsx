import React, { useEffect, useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { Appearance, loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
import { useCreateStripePaymentIntentMutation } from '@/state/api';
import { useCurrentCourse } from '@/hooks/useCurrentCourse';
import Loading from '@/components/Loading';
import { useTheme } from 'next-themes';


if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not set");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const StripeProvider = ({ children }: { children: React.ReactNode }) => {
  const [clientSecret, setClientSecret] = useState<string | "">("");
  const [createStripePaymentIntent] = useCreateStripePaymentIntentMutation();
  const { course } = useCurrentCourse();
  const { theme } = useTheme();

  useEffect(() => {
    if (!course) return;
    const fetchPaymentIntent = async () => {
      const result = await createStripePaymentIntent({
        amount: course?.price ?? 999999,
      }).unwrap();
      setClientSecret(result.clientSecret);
    };

    fetchPaymentIntent();
  }, [createStripePaymentIntent, course?.price, course]);

  const appearance: Appearance = {
    theme: theme === 'dark' ? 'night' : 'stripe',
    variables: {
      colorPrimary: "#0570de",
      fontFamily: "Inter, system-ui, sans-serif",
      spacingUnit: "3px",
      borderRadius: "10px",
      fontSizeBase: "14px",
      ...(theme === 'dark' ? {
        colorBackground: "#18181b",
        colorText: "#d2d2d2",
        colorTextPlaceholder: "#6e6e6e",
      } : {
        colorBackground: "#ffffff",
        colorText: "#30313d",
        colorTextPlaceholder: "#aab7c4",
      }),
    },
  };

  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  if (!clientSecret) return <Loading />;

  return (
    <Elements stripe={stripePromise} options={options} key={clientSecret}>
      {children}
    </Elements>
  );
};

export default StripeProvider;