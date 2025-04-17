import { useGetCourseQuery, useUpdateCourseMutation } from '@/state/api';
import { useAppDispatch, useAppSelector } from '@/state/redux';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'

const CourseEditor = () => {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const { data: course, isLoading, isError } = useGetCourseQuery(id);
    const [updateCourse] = useUpdateCourseMutation();

    // Upload  Video Functionality 
    const dispatch = useAppDispatch();
    const { sections } = useAppSelector((state) => state.global.courseEditor);
    
    return (
        <div>

        </div>
    )
}

export default CourseEditor
