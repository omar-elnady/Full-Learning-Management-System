import AccordionSections from '@/components/AccordionSections'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import React from 'react'

const SelectedCourse = ({ course, handleEnrollNow, enrolledCourses }: SelectedCourseProps) => {
    const router = useRouter();
    const isEnrolled = enrolledCourses?.some(c => c._id === course._id);

    return (
        <div className='selected-course'>
            <div>
                <h3 className='selected-course__title'>{course.title}</h3>
                <p className="selected-course__author">
                    By {course.teacherName || " "} |{"  Enrolled : "}
                    <span className="selected-course__enrollment-count">
                        {course.enrollments?.length}
                    </span>
                </p>
            </div>
            <div className="selected-course__content">
                <p className='selected-course__description'>{course.description}</p>
                <div className='selected-course__sections'>
                    <h4 className='selected-course__sections-title'>Course Content</h4>
                    {/* Accrodion Sections  */}
                    <AccordionSections sections={course.sections} />
                </div>
                <div className="selected-course__footer">
                    <span className='selected-course__price'>
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
                            className='bg-green-700 hover:bg-green-600'
                        >
                            Go to Course
                        </Button>
                    ) : (
                        <Button
                            onClick={() => handleEnrollNow(course._id)}
                            className='bg-primary-750 hover:bg-primary-700'
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
