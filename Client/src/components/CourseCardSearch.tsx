

import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

const CourseCardSearch = ({
  course,
  isSelected,
  onClick }: SearchCourseCardProps
) => {
  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col h-full w-full cursor-pointer overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        isSelected ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/50"
      }`}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={course.image || "/placeholder.png"}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="flex flex-col flex-grow p-4 gap-2">
        <h2 className="text-lg font-bold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {course.title}
        </h2>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.description}
        </p>
      </div>
      <div className="p-4 pt-0 mt-auto">
        <div className="flex justify-between items-center border-t border-border/50 pt-3">
          <span className="text-lg font-bold text-primary">
            {formatPrice(course.price)}
          </span>
          <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {course.enrollments?.length || 0} Enrolled
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          By <span className="font-semibold text-foreground">{course.teacherName}</span>
        </p>
      </div>
    </div>
  )
}

export default CourseCardSearch
