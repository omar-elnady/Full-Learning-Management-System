import { NextFunction, Request, Response } from "express"
import Course from "../../../../DB/models/courseModel";

export const listCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { category } = req.query;
    try {
        const courses = category && category !== "all"
            ? await Course.scan("category").eq(category).exec()
            : await Course.scan().exec();

        res.json({ message: "Done", data: courses })
    } catch (error) {
        res.status(500).json({ message: "Error", error })
    }
}
export const getCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { courseId } = req.params;
    try {
        const course = await Course.get(courseId)
        if (!course) {
            res.status(404).json({ message: "Course not found" });
            return;
        }
        res.json({ message: "Done", data: course })
    } catch (error) {
        res.status(500).json({ message: "Error", error })
    }
}