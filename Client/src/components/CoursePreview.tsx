import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import React from 'react'
import AccordionSections from './AccordionSections';

const CoursePreview = ({ course }: CoursePreviewProps) => {
    const price = formatPrice(course.price);

    return (
        <div className='space-y-10'>
            <div className="w-full dark:border-none border border-gray-300 dark:bg-gray-900 bg-gray-50 py-8 px-10 flex flex-col gap-5 rounded-lg">
                <div className="mb-2 bg-white">
                    <Image src={course.image || "/course-preview-placeholder.png"}
                        alt='Course Preview'
                        width={640}
                        height={360}
                        className='w-full'
                    />
                </div>
                <div>
                    <h2 className='dark:text-white text-3xl font-bold mb-2'>{course.title}</h2>
                    <p className='dark:text-gray-400 text-gray-600 text-md mb-2'>{course.teacherName}</p>
                    <p className='dark:text-gray-400 text-gray-600 text-sm '>
                        {course.description}
                    </p>
                </div>
                <div>
                    <h4 className='text-foreground font-semibold mb-2'>Course Content</h4>
                    <AccordionSections sections={course.sections} />
                </div>
            </div>
            <div className='w-full dark:border-none border border-gray-300 dark:bg-gray-900 bg-gray-50 py-8 px-10 flex flex-col gap-5 rounded-lg'>
                <h3 className='text-xl mb-4'>Price Details ( 1 item )</h3>
                <div className='flex justify-between mb-4 dark:text-gray-300 text-gray-700 text-base'>
                    <span className='font-bold'>1x {course.title}</span>
                    <span className='font-bold'>{price}</span>
                </div>
                <div className='flex justify-between border-t border-border pt-4'>
                    <span className='font-bold text-lg'>Total amount</span>
                    <span className='font-bold text-lg'>{price}</span>
                </div>
            </div>
        </div>
    )
}

export default CoursePreview
