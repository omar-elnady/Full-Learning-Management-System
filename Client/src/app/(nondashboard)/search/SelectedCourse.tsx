import AccordionSections from '@/components/AccordionSections'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import React from 'react'

const SelectedCourse = ({ course, handleEnrollNow, enrolledCourses }: SelectedCourseProps) => {
    const router = useRouter();
    const isEnrolled = enrolledCourses?.some(c => c._id === course._id);

    return (
        <div className='overflow-hidden py-9 px-9 transition-all duration-300'>
            <div>
                <h3 className='text-foreground font-semibold text-3xl'>{course.title}</h3>

            </div>
            <div className="mt-2">
                <div className='text-muted-foreground mb-1'>
                    {course.description}
                </div>
                <p className="text-muted-foreground text-sm pt-3">
                    By <span className="font-semibold text-foreground">{course.teacherName || "Unknown"}</span> | Enrolled: {" "}
                    <span className="font-semibold text-foreground">
                        {course.enrollments?.length || 0}
                    </span>
                </p>
                <div className='mt-6 max-h-[400px] overflow-y-auto'>
                    <h4 className='text-foreground/90 font-semibold mb-2'>Course Content</h4>
                    {/* Accrodion Sections  */}
                    <AccordionSections sections={course.sections} />
                </div>
                <div className="flex justify-between items-center mt-5">
                    <span className='text-primary font-semibold text-2xl'>
                        {formatPrice(course.price)}
                    </span>
                    {isEnrolled ? (
                        <Button
                            onClick={() => {
                                const firstChapter = course.sections?.[0]?.chapters?.[0];
                                if (firstChapter) {
                                    router.push(`/dashboard/user/courses/${course._id}/chapters/${firstChapter.chapterId}`);
                                } else {
                                    alert("Course has no content yet.");
                                }
                            }}
                            className='dark:bg-primary dark:hover:bg-primary/90 dark:text-white text-primary-foreground'
                        >
                            Go to Course
                        </Button>
                    ) : (
                        <Button
                            onClick={() => handleEnrollNow(course._id)}
                            className='dark:bg-primary dark:hover:bg-primary/90 dark:text-white text-primary-foreground'
                        >
                            Enroll Now
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SelectedCourse
