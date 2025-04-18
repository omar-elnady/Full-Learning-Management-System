import { Router } from "express";
import * as CourseController from "./controller/courses";
import { requireAuth } from "@clerk/express";
import multer from "multer";
const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get("/listcourses", CourseController.listCourses);
router.post("/", requireAuth(), CourseController.createCourse);
router.put(
  "/:courseId",
  requireAuth(),
  upload.any(),
  CourseController.updateCourse
);
router.delete("/:courseId", requireAuth(), CourseController.deleteCourse);
router.get("/:courseId", CourseController.getCourse);

export default router;
