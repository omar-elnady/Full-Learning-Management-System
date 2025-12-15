import { Router } from "express";
import * as CourseController from "./controller/courses.js";
import { requireAuth } from "@clerk/express";
import { fileUplode, fileVaildation } from "../../utils/multer.cloudinary.js";

const router = Router();

router.get("/listcourses", CourseController.listCourses);
router.post("/", requireAuth(), CourseController.createCourse);
router.put(
  "/:courseId",
  requireAuth(),
  fileUplode(fileVaildation.video).any(),
  CourseController.updateCourse
);
router.delete("/:courseId", requireAuth(), CourseController.deleteCourse);
router.get("/:courseId", CourseController.getCourse);

export default router;
