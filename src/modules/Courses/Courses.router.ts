import { Router } from 'express';
import { getCourse, listCourses } from './controller/courses'
const router = Router();

router.get("/listcourses", listCourses)
router.get("/:courseId", getCourse)

export default router