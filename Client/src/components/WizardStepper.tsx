import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import React from 'react'

const WizardStepper = ({ currentStep }: WizardStepperProps) => {
    return (
        <div className='w-full md:w-1/2 mb-4 flex flex-col items-center'>
            <div className="w-full flex items-center justify-between mb-2">
                {[1, 2, 3].map((step, index) => (
                    <React.Fragment key={step}>
                        <div className="flex flex-col items-center">

                            <div className={cn("w-8 h-8 flex items-center justify-center rounded-full mb-2", {
                                "bg-green-500 text-white": currentStep > step || (currentStep === 3 && step === 3),
                                "bg-blue-500 text-white": currentStep === step && step !== 3,
                                "border dark:border-gray-600 border-gray-400 dark:text-gray-600 text-gray-400": currentStep < step
                            })}>

                                {currentStep > step || (currentStep === 3 && step === 3) ? (
                                    <Check className='w-5 h-5' />
                                ) : (<span>{step}</span>)}
                            </div>
                            <p className={cn("text-sm", {
                                "dark:text-white text-black": currentStep >= step,
                                "dark:text-gray-600 text-gray-500": currentStep < step
                            })}>
                                {step === 1 && "Details"}
                                {step === 2 && "Payment"}
                                {step === 3 && "Completion"}
                            </p>
                        </div>
                        {index < 2 && (
                            <div
                                className={cn("w-1/4 h-[1px] self-start mt-4", {
                                    "bg-green-500": currentStep > step,
                                    "bg-gray-500": currentStep <= step,
                                })}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}

export default WizardStepper
